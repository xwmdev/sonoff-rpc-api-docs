# Input

The Input component is used to configure external switches to accommodate different types of external switches such as latching switches and momentary switches.

The relay separation feature can be enabled. When enabled, the external switch no longer directly controls the device's built-in relay; instead, it serves as a scene trigger condition for controlling other devices or triggering specific scenes.

| Method | Description |
| --- | --- |
| Input.SetConfig | Set external switch configuration |
| Input.GetConfig | Get external switch configuration |




## Methods
Methods supported by the Input component.

### Input.SetConfig
**Request**

| Property | Type | Description |
| --- | --- | --- |
| id | number | Input channel ID<br/>Value range: 1 ~ max (max varies by product maximum input channel count) |
| config | object | Input channel configuration |


For more information on the `config` property, refer to the `config` data structure.

**Response**

For the response content, refer to the response frame.



### Input.GetConfig
**Request**

| Property | Type | Description |
| --- | --- | --- |
| id | number | Input channel ID<br/>Value range: 1 ~ max (max varies by product maximum input channel count) |


**Response**

The response content of `Input.GetConfig` is described in the `config` data structure.



## Data Structures
Data structures related to the Input component.

### config
| Property | Type | Description |
| --- | --- | --- |
| external_switch_mode | string | External switch mode<br/>Value range:<br/>"edge"  Edge mode, compatible with latching switches and SPDT switches, commonly used for two-way light control. Toggles the relay state on trigger.<br/><br/>"pulse"  Pulse mode, compatible with momentary switches and spring-return switches, commonly used for door access switches. Toggles the relay state on trigger. When relay separation is enabled, supports single click, double click, and long press operations in pulse mode. When relay separation is disabled, only single click is supported.<br/>   "follow" Follow mode, compatible with latching switches, traditional mechanical switches, or dry contact signal sensors. On trigger, the relay follows the external switch state. |
| reverse | boolean | This field is only required in "follow" mode.   true: enable inversion, in follow mode the relay state is opposite to the external switch state.<br/>false: disable inversion, in follow mode the relay follows the external switch state. |
| relay_separate | boolean | Relay separation configuration<br/>true: enable separation<br/>The device relay and external switch are separated; external switch operations no longer control the device relay.   <br/>false: disable separation<br/>External switch operations can control the device relay on and off. |




## MQTT Control
After enabling MQTT, you can configure external switches via command topics and receive external switch operations via event topics. For `<topic_root>` and connection parameters, refer to the MQTT Control section in the MQTT documentation.

### Topics and Directions
| Direction | Topic | Payload or Field | Purpose |
| --- | --- | --- | --- |
| Subscribe | `<topic_root>/status` | `switch_mode`, `relay_separation` | Receive device retained state and confirm configuration results |
| Subscribe | `<topic_root>/event/external_switch` | `{"event_type":"<type>"}` | Receive external switch trigger events |
| Publish | `<topic_root>/cmd/switch_mode` | `edge`, `follow`, `follow reverse`, or `pulse` | Set the external switch mode; `follow reverse` means inverted follow |
| Publish | `<topic_root>/cmd/relay_separation` | `ON`, `OFF`, `true`, `false`, `1`, or `0` | Enable or disable relay separation |

`event_type` can be `Single Click`, `Double Click`, `Long Press`, `On`, or `Off`. The event topic is used by the device to publish operation events to the MQTT client; the client should not publish control payloads to this topic.

### Operation Steps
1. Subscribe to `<topic_root>/status` and `<topic_root>/event/external_switch`.
2. Publish the target mode to `<topic_root>/cmd/switch_mode`.
3. If you want the external switch to serve only as an event input without directly controlling the relay, publish `ON` to `<topic_root>/cmd/relay_separation`.
4. Confirm from the status topic that `switch_mode` and `relay_separation` have been updated.
5. Operate the device's external switch and receive the corresponding `event_type` from the event topic.

In pulse mode, when relay separation is enabled, `Single Click`, `Double Click`, and `Long Press` are supported; when relay separation is not enabled, only click operations are generated.

### Configuration and Event Subscription Example
Subscribe to status and events first, then set the external switch to pulse mode:

```bash
mosquitto_sub -h ${MQTT_SERVER} -p ${MQTT_PORT} -v \
  -t "${SONOFF_ID}/status" \
  -t "${SONOFF_ID}/event/external_switch"

mosquitto_pub -h ${MQTT_SERVER} -p ${MQTT_PORT} \
  -t "${SONOFF_ID}/cmd/switch_mode" \
  -m "pulse"
```

When `switch_mode` in the status message changes to `pulse`, the configuration is successful; subsequent external switch operations will be received as event messages on the event topic.


## Event Notifications
Event notifications supported by the Input component.

### config_changed
When the external switch configuration changes, the device emits this event.

## Examples
Examples of Input component methods and events.

### Input.SetConfig Example
**Request**

```json
{
  "jsonrpc":"2.0",
  "id": 1,
  "src":"user_1",
  "method":"Input.SetConfig",
  "params": {
    "id": 1,
    "config": {
      "external_switch_mode":"edge",
      "relay_separate":true
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



### Input.GetConfig Example
**Request**

```json
{
  "jsonrpc":"2.0",
  "id": 1,
  "src":"user_1",
  "method":"Input.GetConfig",
  "params": {
    "id": 1
  }
}
```

**Response**

```json
{
  "id": 1,
  "src": "sonoffmini1gsp-acebe61fae74",
  "result": {
    "id": 1,
    "config": {
      "external_switch_mode":"edge",
      "relay_separate":true
    }
  }
}
```



### Notification Example
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
            "component": "input:1",
            "id": 1,
            "event": "config_changed",
            "ts": 1626221112
         }
      ]
   }
}
```

After receiving the configuration change event, the receiver can call `Input.GetConfig` to get the latest configuration.
