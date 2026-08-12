---
sidebar_position: 6
---

# Debug Logs

Supports streaming debug logs from the device via WebSocket and MQTT for diagnosing issues. Log streaming is disabled by default.

## Usage Steps

### Method 1: WebSocket Debug Logging

1. Call [System.SetConfig](../Components/System#systemsetconfig) to enable WebSocket debug output:

```json
{
   "id": 1,
   "src": "user_1",
   "method": "System.SetConfig",
   "params": {
      "config": {
         "debug": {
            "websocket_enable": true
         }
      }
   }
}
```

2. Use a WebSocket client to connect to the device:

```bash
websocat ws://${SONOFF}/debug/log
```

3. Logs begin streaming in real time. After use, set `websocket_enable` to `false` to disable.

    The current status can be viewed via [System.GetConfig](../Components/System#systemgetconfig).

### Method 2: MQTT Debug Logging

1. Ensure the device is properly connected to the MQTT Broker ([MQTT Configuration](../Components/MQTT)).

2. Call [MQTT.SetConfig](../Components/MQTT#mqttsetconfig) to enable MQTT debug output:

```json
{
   "id": 1,
   "src": "user_1",
   "method": "MQTT.SetConfig",
   "params": {
      "config": {
         "debug_output": true
      }
   }
}
```

3. Subscribe to the log topic:

```bash
mosquitto_sub -h ${MQTT_SERVER} -p ${MQTT_PORT} -t sonoffmini1gsp-acebe61fae74/debug/log
```

4. Logs begin output. After use, set `debug_output` to `false` to disable.

---

## MQTT Logs

When enabled, device logs will be published to the topic `<sonoff-id>/debug/log`.

Logs are in text format, with each line identified by a `[TAG]` indicating the source module, followed by the specific message. Common TAGs and their meanings:

+ `[SWITCH]`: Switch component
+ `[RPC]`: RPC calls
+ `[MQTT]`: MQTT connection
+ `[CLOUD]`: Cloud connection
+ `[OTA]`: Firmware upgrade
+ `[WIFI]`: WiFi connection

Example:

```log
[SWITCH] id=1 state=on trigger=button
[RPC] handle Switch.GetConfig form ws
[SWITCH] id=1 state=off trigger=button
[MQTT] connected to 192.168.50.190:1883
[RPC] handle Switch.Set form mqtt
```

## WebSocket Logs

When enabled, device logs will stream to `ws://${SONOFF}/debug/log` (e.g. `ws://10.33.52.133/debug/log`).

When disabled, log recording will stop and all open WebSocket debug connections will be closed. Up to three WebSocket debug connections can be open simultaneously.

Logs are streamed as JSON objects, each containing the following fields:

+ `seq`: number, log sequence number, monotonically increasing
+ `ts`: number, Unix timestamp (UTC), accurate to milliseconds
+ `level`: number, log level. Values: `1` → Error, `2` → Warning, `3` → Info, `4` → Debug, `5` → Verbose Debug
+ `data`: string, log message

```json
{"seq":32,"ts":1786517430000,"level":3,"data":"[SWITCH] id=1 state=on trigger=input"}
{"seq":33,"ts":1786517430000,"level":3,"data":"[RPC] handle Switch.GetConfig form ws"}
{"seq":34,"ts":1786517430000,"level":3,"data":"[RPC] handle Switch.GetStatus form ws"}
```
