# Ota

The Ota component provides firmware update status query, automatic update schedule configuration, and OTA upgrade services.

| Method | Description |
| --- | --- |
| Ota.SetConfig | Set OTA configuration, or trigger an OTA upgrade action |
| Ota.GetConfig | Get OTA automatic update configuration |
| Ota.GetStatus | Get OTA status and available update version information |


## Methods
Methods supported by the Ota component.

### Ota.SetConfig
Set OTA configuration, or trigger an OTA upgrade action.

Requests must wrap the configuration object using `params.config`. Fields not included retain their current values.

`start` is a one-time action field and is not saved as persistent configuration; `auto` and `time` are automatic update configuration fields.

**Request**

| Property | Type | Description |
| --- | --- | --- |
| config | object | OTA configuration object, required |

For more information on the `config` property, refer to the `config` data structure.

**Response**

The response content of `Ota.SetConfig` is described in the `config` data structure.


### Ota.GetConfig
Get the current OTA automatic update configuration.

**Request**

None.

**Response**

The response content of `Ota.GetConfig` is described in the `config` data structure.


### Ota.GetStatus
Get the current OTA status and available update version information.

When this interface is called, the response immediately returns the current cached snapshot; it does not wait for the background query task to complete.

**Request**

None.

**Response**

| Property | Type | Description |
| --- | --- | --- |
| available_update | string or null | Available update version, maximum 15 bytes; this product uses the `x.y.z` format. `null` when no update is available |
| changelog_url | string or null | Changelog URL for the available update. `null` when no update is available |
| status | string | OTA runtime status. `stop`: not upgrading; `start`: upgrading |


## Data Structures
Data structures related to the Ota component.

### config
`config` is used in `Ota.SetConfig` requests and in `Ota.GetConfig` and `Ota.SetConfig` responses.

| Property | Type | Description |
| --- | --- | --- |
| auto | boolean | Whether to enable automatic updates |
| time | string | Automatic update time window executed in the device's local timezone, format `HH:MM-HH:MM`, e.g. `02:00-04:00`. Start and end times must be on the hour, with a minimum interval of 1 hour, no cross-day spans, end time must be later than start time |
| start | boolean | `true` triggers an OTA upgrade. Always returns `false` in responses |


### status
`status` is used in `Ota.GetStatus` responses.

| Property | Type | Description |
| --- | --- | --- |
| available_update | string or null | Available update version, maximum 15 bytes; this product uses the `x.y.z` format, e.g. `1.0.6`. `null` when no update is available |
| changelog_url | string or null | Changelog URL for the available update. `null` when no update is available |
| status | string | OTA runtime status. `stop`: not upgrading; `start`: upgrading |


### Other
#### ota_notify_status
`ota_notify_status` is used for the `status.status` field in OTA progress status notifications.

| Value | Description |
| --- | --- |
| stop | Not upgrading |
| start | Upgrading |
| success | Upgrade succeeded |
| fail | Upgrade failed |
| timeout | Upgrade timed out |


## MQTT Control
After enabling MQTT, you can query and install firmware updates via command topics. For `<topic_root>` and connection parameters, refer to the MQTT Control section in the MQTT documentation.

### Topics and Directions
| Direction | Topic | Payload or Field | Purpose |
| --- | --- | --- | --- |
| Subscribe | `<topic_root>/status` | `firmware_installed_version`, `firmware_latest_version`, `firmware_update_available`, `firmware_update_running` | Get query results and track upgrade status |
| Publish | `<topic_root>/cmd/firmware_query` | `PRESS` | Query available firmware updates in the background |
| Publish | `<topic_root>/cmd/firmware_install` | `INSTALL` | Install the queried available firmware update |

Query and install operations are both asynchronous; command topics do not return independent responses. The result must be determined via the status topic.

### Operation Steps
1. Subscribe to `<topic_root>/status` and note the currently installed version and upgrade status.
2. Publish `PRESS` to `<topic_root>/cmd/firmware_query`.
3. Wait for the status topic to update and check `firmware_latest_version` and `firmware_update_available`.
4. Only when `firmware_update_available` is `true`, publish `INSTALL` to `<topic_root>/cmd/firmware_install`.
5. Continue subscribing to the status topic; `firmware_update_running` being `true` indicates upgrading is in progress. After the device upgrades, restarts, and reconnects, check whether `firmware_installed_version` has been updated.

When no available version has been queried, do not send the install command directly. Do not restart the device or disconnect the device's power during the upgrade process.

### Query and Install Example

```bash
mosquitto_sub -h ${MQTT_SERVER} -p ${MQTT_PORT} -v \
  -t "${SONOFF_ID}/status"

mosquitto_pub -h ${MQTT_SERVER} -p ${MQTT_PORT} \
  -t "${SONOFF_ID}/cmd/firmware_query" \
  -m "PRESS"
```

After confirming that `firmware_update_available` is `true` in the status message, execute:

```bash
mosquitto_pub -h ${MQTT_SERVER} -p ${MQTT_PORT} \
  -t "${SONOFF_ID}/cmd/firmware_install" \
  -m "INSTALL"
```


## Event Notifications
Event notifications supported by the Ota component.

### autoupgrade_changed
Triggered when the automatic update configuration changes.

| Property | Type | Description |
| --- | --- | --- |
| component | string | Always `ota` |
| id | number | Always `1` |
| event | string | Always `autoupgrade_changed` |
| ts | number | UTC Unix timestamp in seconds, using 10-digit integer |


## Status Notifications
When the OTA component starts upgrading, progress changes, succeeds, fails, or times out, it pushes status via `NotifyStatus`. `params.status` contains the Ota component's internal status data:

| Property | Type | Description |
| --- | --- | --- |
| status | object | Ota component status object, located at `NotifyStatus.params.status` |
| status.component | string | Always `Ota` |
| status.progress | number | OTA progress, range `0` to `100` |
| status.status | string | OTA status: `stop`, `start`, `success`, `fail`, `timeout` |


## Examples
Examples of Ota component methods and events.

### Ota.SetConfig Example
Request to enable automatic updates and set a time window:

```json
{
  "jsonrpc": "2.0",
  "id": 24,
  "src": "web",
  "method": "Ota.SetConfig",
  "params": {
    "config": {
      "auto": true,
      "time": "02:00-04:00"
    }
  }
}
```

Request to start an OTA upgrade:

```json
{
  "jsonrpc": "2.0",
  "id": 25,
  "src": "web",
  "method": "Ota.SetConfig",
  "params": {
    "config": {
      "start": true
    }
  }
}
```

**Success Response**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 25,
  "result": {
    "config": {
      "auto": true,
      "time": "02:00-04:00",
      "start": false
    }
  }
}
```

Error response example:

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 25,
  "error": {
    "code": -32602,
    "message": "no available update"
  }
}
```

### Ota.GetConfig Example
**Request**

```json
{
  "jsonrpc": "2.0",
  "id": 22,
  "src": "web",
  "method": "Ota.GetConfig",
  "params": {}
}
```

**Success Response**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 22,
  "result": {
    "config": {
      "auto": false,
      "time": "02:00-04:00",
      "start": false
    }
  }
}
```

### Ota.GetStatus Example
**Request**

```json
{
  "jsonrpc": "2.0",
  "id": 21,
  "src": "web",
  "method": "Ota.GetStatus",
  "params": {}
}
```

**Success Response**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 21,
  "result": {
    "available_update": "1.0.6",
    "changelog_url": "https://appcms.coolkit.cn/fwupdate/1399.html",
    "status": "stop"
  }
}
```

### Notification Examples
#### autoupgrade_changed Example
```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "method": "NotifyEvent",
  "params": {
    "ts": 1626221112,
    "events": [
      {
        "component": "ota",
        "id": 1,
        "event": "autoupgrade_changed",
        "ts": 1626221112
      }
    ]
  }
}
```

#### Status Notification Example
```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "method": "NotifyStatus",
  "params": {
    "ts": 1626221112,
    "status": {
      "component": "Ota",
      "progress": 100,
      "status": "success"
    }
  }
}
```
