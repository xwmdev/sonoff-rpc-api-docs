# System

The System component provides functionalities such as device runtime status queries, time and timezone configuration, device reboot, and factory reset.

| Method | Description |
| --- | --- |
| System.GetStatus | Get all current runtime statuses of the device |
| System.GetConfig | Get system configuration parameters |
| System.SetConfig | Update system configuration |
| System.SetTime | Set system time |
| System.SetTimeZone | Set timezone |
| System.GetTimeZone | Get timezone information |
| System.Control | System control |




## Methods
The methods supported by the System component are as follows.

### System.GetStatus
Get all current runtime statuses of the device.

**Request**

None.

**Response**

| Property | Type | Description |
| --- | --- | --- |
| reboot_reason | string | Reboot reason (only for battery-powered devices). Possible values: `poweron`, `software_restart`, `deepsleep_wake`, `internal`, `unknown` |
| time | string | Current time, the device's local time. Format: `YYYY/MM/DD HH:MM:SS` |
| unixtime | number | Unix timestamp (UTC), null when time has not been synced from an NTP server or not yet set |
| timezone_info | object | Timezone-related information. See timezone_info for details |
| last_sync_ts | number | Last time the system synced time from an NTP server (UTC), null when time has not been synced from an NTP server |
| uptime | number | Time since last reboot (seconds) |
| flash_size | number | Flash size, unit: MB |
| app_size | number | Firmware partition size, unit: KB |
| app_free | number | Free space in firmware partition, unit: KB |
| ram_size | number | System RAM size, unit: Byte |
| ram_free | number | Free system RAM, unit: Byte |
| ram_min_free | number | Historical minimum free RAM, unit: Byte |
| ram_largest_block | number | Largest free contiguous block size, unit: Byte |


### System.GetConfig
Get system configuration parameters.

**Request**

None.

**Response**

| Property | Type | Description |
| --- | --- | --- |
| config | object | System configuration object. See config for details |


### System.SetConfig
Update system configuration.

**Request**

| Property | Type | Description |
| --- | --- | --- |
| config | object | System configuration object. See config for details |


**Response**

For the response content, please refer to the response frame.

### System.SetTime
Set system time.

**Request**

| Property | Type | Description |
| --- | --- | --- |
| unixtime | number | Unix timestamp (UTC), set to the current time, unit: seconds |


**Response**

For the response content, please refer to the response frame.

Note: If the device obtains time from NTP, this setting will be overwritten.

### System.SetTimeZone
Set timezone.

**Request**

| Property | Type | Description |
| --- | --- | --- |
| timezone_id | string | Timezone string, e.g., `Asia/Shanghai` |
| timezone_offset | number or null | Timezone offset, unit: minutes, a positive or negative integer, range: [-720, 840]. When this field is null, the device queries the actual timezone information from the network based on timezone_id. |


**Response**

For the response content, please refer to the response frame.

### System.GetTimeZone
Get timezone information.

**Request**

| Property | Type | Description |
| --- | --- | --- |
| timezone_id | string | Timezone string, e.g., `Asia/Shanghai`. Use an empty string when the device should auto-detect. |


**Response**

For the response content of `System.GetTimeZone`, see the `timezone_info` data structure.

### System.Control
System control.

**Request**

| Property | Type | Description |
| --- | --- | --- |
| action | string | Control action. Possible values: `reboot` (system reboot), `factory_reset` (factory reset) |


**Response**

For the response content, please refer to the response frame.



## Data Structures
The data structures related to the System component are as follows.

### config
| Property | Type | Description |
| --- | --- | --- |
| sntp | object | Configure NTP server addresses. See sntp for details |
| debug | object | Configure debug logging functionality. See debug for details |
| domain | string | mDNS domain name (where `.local` is fixed on the web frontend and not entered by the user), max length 60 characters. |




**sntp**

| Property | Type | Description |
| --- | --- | --- |
| server1 | string | Primary NTP server address, max length 63 characters. |
| server2 | string | Secondary NTP server address, max length 63 characters. |




**debug**

| Property | Type | Description |
| --- | --- | --- |
| websocket_enable | boolean | Debug log switch. `true`: Enable debug log output via WebSocket, `false`: Disable |


### timezone_info
| Property | Type | Description |
| --- | --- | --- |
| id | string | Timezone ID. e.g., `Asia/Chongqing` |
| utc | string | Server current time, UTC standard time, ISO8601 format |
| dst | number | Whether currently in daylight saving time. `0`: Timezone has no DST, `1`: Currently in DST, `2`: Not currently in DST |
| offset | number | Current time offset, unit: minutes, a positive or negative integer, includes both timezone offset and DST offset, range: −840 to +840 |
| nextDst | string | DST transition time, standard time. This field is absent if dst=0 |
| nextOffset | number | Time offset after DST transition, unit: minutes, a positive or negative integer. This field is absent if dst=0, range: -840 to +720 |


## MQTT Control
After enabling MQTT, the device can be rebooted via a Topic. For `<topic_root>` and connection parameters, please refer to MQTT Control in the MQTT documentation.

### Topics and Directions
| Direction | Topic | Payload | Purpose |
| --- | --- | --- | --- |
| Subscribe | `<topic_root>/online` | `online` or `offline` | Observe the device's MQTT online status and reconnection after reboot |
| Publish | `<topic_root>/cmd/reboot` | `PRESS` | Immediately reboot the device |

The reboot command has no independent response. The client must subscribe to the online status before sending the command, otherwise the device offline process may be missed. `<topic_root>/online` is a retained Topic, and `offline` is also used as the MQTT will payload.

### Operation Steps
1. Subscribe to `<topic_root>/online` and confirm the current payload is `online`.
2. Publish `PRESS` to `<topic_root>/cmd/reboot`.
3. Wait for the device to disconnect, and the online status to become `offline`.
4. Wait for the device to complete the reboot and reconnect to the broker, with the online status restoring to `online`.

Rebooting will interrupt the device's current connections and ongoing operations; please use with caution.

### Reboot Example

```bash
mosquitto_sub -h ${MQTT_SERVER} -p ${MQTT_PORT} -v \
  -t "${SONOFF_ID}/online"

mosquitto_pub -h ${MQTT_SERVER} -p ${MQTT_PORT} \
  -t "${SONOFF_ID}/cmd/reboot" \
  -m "PRESS"
```


## Examples
Examples of the System component methods.

### System.GetStatus Example
**Request**

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "src": "user_1",
  "method": "System.GetStatus",
  "params": {}
}
```

**Response**

```json
{
  "id": 4,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {
    "reboot_reason": "poweron",
    "time": "2026/04/20 11:42:46",
    "unixtime": 1776656566,
    "last_sync_ts": null,
    "uptime": 1011,
    "flash_size": 8,
    "app_size": 3392,
    "app_free": 0,
    "ram_size": 327680,
    "ram_free": 69608,
    "timezone_info": {
      "id": "Asia/Shanghai",
      "utc": "2026-04-20T03:42:46.000Z",
      "dst": 0,
      "offset": 480
    }
  }
}
```



### System.GetConfig Example
**Request**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "src": "user_1",
  "method": "System.GetConfig",
  "params": {}
}
```

**Response**

```json
{
  "id": 1,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {
    "config": {
        "sntp": {
          "server1": "0.pool.ntp.org",
          "server2": "1.pool.ntp.org"
        },
        "debug": {
          "websocket_enable": false
        },
        "domain": "sonoff-mini1gsp"
      }
  }
}
```



### System.SetConfig Example
**Request**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "src": "user_1",
  "method": "System.SetConfig",
  "params": {
    "config": {
      "sntp": {
        "server1": "0.pool.ntp.org",
        "server2": "1.pool.ntp.org"
      },
      "debug": {
        "websocket_enable": true
      },
      "domain": "sonoff-mini1gsp"
    }
  }
}
```

**Response**

```json
{
  "id": 2,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {}
}
```



### System.SetTime Example
**Request**

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "src": "user_1",
  "method": "System.SetTime",
  "params": {
    "unixtime": 1776656566
  }
}
```

**Response**

```json
{
  "id": 3,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {}
}
```



### System.SetTimeZone Example
**Request**

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "src": "user_1",
  "method": "System.SetTimeZone",
  "params": {
    "timezone_id": "Asia/Shanghai"
  }
}
```

**Response**

```json
{
  "id": 5,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {}
}
```

### System.GetTimeZone Example
**Request**

```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "src": "user_1",
  "method": "System.GetTimeZone",
  "params": {
    "timezone_id": "Asia/Shanghai"
  }
}
```

**Response**

```json
{
  "id": 6,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {
      "id": "Asia/Shanghai",
      "utc": "2026-04-20T03:42:46.000Z",
      "dst": 0,
      "offset": 480
  }
}
```



### System.Control Example
**Request**

System reboot:

```json
{
  "jsonrpc": "2.0",
  "id": 7,
  "src": "user_1",
  "method": "System.Control",
  "params": {
    "action": "reboot"
  }
}
```

**Request**

Factory reset:

```json
{
  "jsonrpc": "2.0",
  "id": 8,
  "src": "user_1",
  "method": "System.Control",
  "params": {
    "action": "factory_reset"
  }
}
```

**Response**

```json
{
  "id": 7,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {}
}
```
