# Switch
The Switch component is used to manage the configuration and status of switches (relays).

| Method | Description |
| --- | --- |
| Switch.SetConfig | Configure the switch |
| Switch.GetConfig | Get switch configuration |
| Switch.Set | Set the switch |
| Switch.Toggle | Toggle the switch |
| Switch.GetStatus | Get switch status |
| Switch.GetRecords | Get historical switch operation records |




## Methods
The methods supported by the Switch component are as follows.

### Switch.SetConfig
Configure the switch, including power-on behavior and pulse settings.

**Request**

| Property | Type | Description |
| --- | --- | --- |
| id | number | Switch id<br/>Range: 1 ~ max (max varies by product depending on the maximum number of inputs/outputs) |
| config | object | Switch configuration |


For more details about the `config` property, see the `config` data structure.

**Response**

For the response content, please refer to the response frame.



### Switch.GetConfig
Get switch configuration.

**Request**

| Property | Type | Description |
| --- | --- | --- |
| id | number | Switch id<br/>Range: 1 ~ max (max varies by product depending on the maximum number of inputs/outputs) |


**Response**

For the response content of `Switch.GetConfig`, see the `config` data structure.



### Switch.Set
Set the switch state (on or off).

**Request**

| Property | Type | Description |
| --- | --- | --- |
| id | number | Switch id<br/>Range: 1 ~ max (max varies by product depending on the maximum number of inputs/outputs) |
| on | boolean | Switch state<br/>true: on<br/>false: off |


**Response**

For the response content, please refer to the response frame.



### Switch.Toggle
Toggle the switch state.

**Request**

| Property | Type | Description |
| --- | --- | --- |
| id | number | Switch id<br/>Range: 1 ~ max (max varies by product depending on the maximum number of inputs/outputs) |


**Response**

For the response content, please refer to the response frame.



### Switch.GetStatus
Get switch status.

**Request**

| Property | Type | Description |
| --- | --- | --- |
| id | number | Switch id<br/>Range: 1 ~ max (max varies by product depending on the maximum number of inputs/outputs) |


**Response**

| Property | Type | Description |
| --- | --- | --- |
| id | number | Switch id<br/>Range: 1 ~ max (max varies by product depending on the maximum number of inputs/outputs) |
| on | boolean | Switch state<br/>true: on<br/>false: off |




### Switch.GetRecords
Get historical switch operation records.

**Request**

| Property | Type | Description |
| --- | --- | --- |
| offset | number | Starting index (0 means start from the most recent record) |
| count | number | Number of records requested, maximum 100<br/>Needs to be downloaded in batches; generally recommended to keep each packet under 30 |


**Response**

| Property | Type | Description |
| --- | --- | --- |
| next_offset | number | Starting index for the next request (returns total_count if no more data is available) |
| total_count | number | Total number of records |
| records | array  of object | Array of records |




## Data Structures
The data structures related to the Switch component are as follows.

### config
| Property | Type | Description |
| --- | --- | --- |
| startup | object | Power-on behavior configuration |
| pulse | object | Pulse configuration |


For more details about the `startup` property, see the `startup` data structure.

For more details about the `pulse` property, see the `pulse` data structure.



### startup
| Property | Type | Description |
| --- | --- | --- |
| startup | string | on: power on,<br/>off: power off,<br/>stay: keep previous state, restore the state before power loss<br/>invert: toggle (implement as needed) |
| enable_delay | boolean | (Implement as needed)<br/>true: enable delay<br/>false: disable delay |
| delay_width | number | (Implement as needed)<br/>Delay before executing power-on behavior<br/>Unit: milliseconds, only supports values in multiples of 500 milliseconds (i.e., 0.5 seconds). Range: 0 ~ 3599500 milliseconds |




### pulse
| Property | Type | Description |
| --- | --- | --- |
|   enable | boolean | Pulse function switch. true: enable pulse<br/>false: disable pulse |
|   on | boolean | Switch state after pulse ends<br/>true: on<br/>false: off |
|   width | number | Pulse duration. Unit: milliseconds, only supports values in multiples of 500 milliseconds (i.e., 0.5 seconds). When enable is false (pulse disabled), this value is 0. Range: 0.5 seconds ~ 23 hours 59 minutes 59.5 seconds |


### Other Data Structures
**records**

| Property | Type | Description |
| --- | --- | --- |
| id | number | Switch id<br/>Range: 1 ~ max (max varies by product depending on the maximum number of inputs/outputs) |
| on | boolean | Switch state<br/>true: on<br/>false: off |
| trigger_type | string | Trigger source<br/>button: device button<br/>input: external switch<br/>fastgo: fastgo remote<br/>timer: timer<br/>startup: power-on behavior<br/>pulse: pulse<br/>fastScene: auto power-off (fast scene)<br/>Overcurrent protection: overcurrent protection<br/>Overpower protection: overpower protection<br/>Overvoltage protection: overvoltage protection<br/>Undervoltage protection: undervoltage protection<br/>overheat protection: overheat protection<br/>Auto Recovery: auto recovery<br/>eWeLink<br/>Matter<br/>Mqtt<br/>websocket<br/>http |
| ts | number | Operation time<br/>Timestamp, unit: ms |




## MQTT Control
After enabling MQTT, the Switch component can be controlled via Topics. For `<topic_root>` and connection parameters, please refer to MQTT Control in the MQTT documentation.

### Topics and Directions
From the MQTT client's perspective, **publish** control payloads to command Topics and **subscribe** to status Topics to confirm whether the device executed successfully.

| Direction | Topic | Payload or Field | Purpose |
| --- | --- | --- | --- |
| Subscribe | `<topic_root>/status` | `switch`, `power_on_behavior`, `startup_delay_enable`, `startup_delay_time` | Receive the device's retained status and confirm control results |
| Publish | `<topic_root>/cmd/switch` | `ON`, `OFF`, `true`, `false`, `1`, or `0` | Turn the device switch on or off |
| Publish | `<topic_root>/cmd/power_on_behavior` | `off`, `on`, `stay`, or `invert` | Set the switch state after the device powers on |
| Publish | `<topic_root>/cmd/power_on_delay` | `ON`, `OFF`, `true`, `false`, `1`, or `0` | Enable or disable power-on delay |
| Publish | `<topic_root>/cmd/power_on_delay_time` | `0` to `3599.5`, unit: seconds, step: `0.5` | Set the power-on delay time |

Command Topics do not return independent responses. The update of the corresponding field in `<topic_root>/status` should be used as the execution result.

### Operation Steps
1. Subscribe to `<topic_root>/status` to first get the device's current state.
2. Publish the payload to the desired command Topic.
3. Wait for the status Topic to update and check the corresponding status field.

When setting power-on delay, there is a dependency: first publish `ON` to `<topic_root>/cmd/power_on_delay`, confirm that `startup_delay_enable` is `true`; then publish the time to `<topic_root>/cmd/power_on_delay_time`. When the delay is not enabled, the device will ignore the delay time setting.

### Switch Control Example
First subscribe to status, then turn on the switch:

```bash
mosquitto_sub -h ${MQTT_SERVER} -p ${MQTT_PORT} -v \
  -t "${SONOFF_ID}/status"

mosquitto_pub -h ${MQTT_SERVER} -p ${MQTT_PORT} \
  -t "${SONOFF_ID}/cmd/switch" \
  -m "ON"
```

When `switch` in the status message becomes `true`, it means the switch has been turned on.


## Event Notifications
The event notifications supported by the Switch component are as follows.

### config_changed
When the Switch component configuration changes, the device will emit this event.



## Status Notifications
When the Switch component state changes, a status notification will be triggered. The data carried is as follows:

| Property | Type | Description |
| --- | --- | --- |
| id | number | Switch id<br/>Range: 1 ~ max (max varies by product depending on the maximum number of inputs/outputs) |
| on | boolean | Switch state<br/>true: on<br/>false: off |


## Examples
Examples of the Switch component methods and events.

### Switch.SetConfig Example
**Request**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Switch.SetConfig",
   "params": {
      "id":1,
      "config":{
        "startup": {
          "startup":"stay",
          "enable_delay":false,
          "delay_width":500
        },
        "pulse":{
          "enable":false,
          "on":false,
          "width":5000
        }
      }
   }
}
```

**Response**

```json
{
  "id": 1,
  "src": "sonoffmini1gsp-acebe61fae74",
  "result": {
  }
}
```

### Switch.GetConfig Example
**Request**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Switch.GetConfig",
   "params": {
      "id":1
   }
}
```

**Response**

```json
{
  "id": 1,
  "src": "sonoffmini1gsp-acebe61fae74",
  "result": {
      "id":1,
      "config":{
        "startup": {
          "startup":"stay",
          "enable_delay":false,
          "delay_width":500
        },
        "pulse":{
          "enable":false,
          "on":false,
          "width":5000
        }
      }
   }
}
```

### Switch.Set Example
**Request**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Switch.Set",
   "params": {
      "id":1,
      "on":true
   }
}
```

**Response**

```json
{
  "id": 1,
  "src": "sonoffmini1gsp-acebe61fae74",
  "result": {
  }
}
```

### Switch.Toggle Example
**Request**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Switch.Toggle",
   "params": {
      "id":1
   }
}
```

**Response**

```json
{
  "id": 1,
  "src": "sonoffmini1gsp-acebe61fae74",
  "result": {
  }
}
```

### Switch.GetStatus Example
**Request**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Switch.GetStatus",
   "params": {
      "id":1
   }
}
```

**Response**

```json
{
  "id": 1,
  "src": "sonoffmini1gsp-acebe61fae74",
  "result": {
      "id":1,
      "on":true
  }
}
```



### Switch.GetRecords Example
**Request**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Switch.GetRecords",
   "params": {
      "offset":0,
      "count":30
   }
}
```

**Response**

```json
{
  "id": 1,
  "src": "sonoffmini1gsp-acebe61fae74",
  "result": {
      "next_offset":1,
      "total_count":50,
      "records":[
        {
          "id":1,
          "on":true,
          "trigger_type":"button",
          "ts":1626221112
        },
        {
          "id":1,
          "on":false,
          "trigger_type":"input",
          "ts":16263321112
        }
      ]
  }
}
```



### Notification Examples
#### config_changed Example
```json
{
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "web",
   "method": "NotifyEvent",
   "params": {
      "ts": 1626221112,
      "events": [
         {
            "component": "switch:1",
            "id": 1,
            "event": "config_changed",
            "ts": 1626221112
         }
      ]
   }
}
```

After receiving the configuration change event, the recipient can call `Switch.GetConfig` to get the latest configuration.



#### Status Notification Example
```json
{
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "method": "NotifyStatus",
   "params": {
      "ts": 1626221112,
      "switch:1": {
         "id": 1,
         "on": true
      }
   }
}
```
