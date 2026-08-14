---
sidebar_position: 6
---

# 调试日志

支持通过 WebSocket、MQTT 从设备流式传输调试日志以诊断问题。日志流默认禁用。

## 使用步骤

### 方式一：WebSocket 调试日志

1. 调用 [System.SetConfig](../Components/System.md#systemsetconfig) 启用 WebSocket 调试输出：

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

2. 使用 WebSocket 客户端连接到设备：

```bash
websocat ws://${SONOFF}/debug/log
```

3. 日志开始实时流式输出。使用完毕后，将 `websocket_enable` 设为 `false` 即可关闭。

   当前状态可通过 [System.GetConfig](../Components/System.md#systemgetconfig) 查看。

### 方式二：MQTT 调试日志

1. 确保设备已正确连接 MQTT Broker（[MQTT 配置说明](../Components/MQTT.md)）。

2. 调用 [MQTT.SetConfig](../Components/MQTT.md#mqttsetconfig) 启用 MQTT 调试输出：

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

3. 订阅日志主题：

```bash
mosquitto_sub -h ${MQTT_SERVER} -p ${MQTT_PORT} -t sonoffmini1gsp-acebe61fae74/debug/log
```

4. 日志开始输出。使用完毕后，将 `debug_output` 设为 `false` 即可关闭。

---

## MQTT日志

启用后，设备日志将发布到主题 `<sonoff-id>/debug/log`。

日志为文本格式，每行以 `[TAG]` 标识来源模块，后接具体消息。常见 TAG 及含义：

+ `[SWITCH]`：开关组件
+ `[RPC]`：RPC 调用
+ `[MQTT]`：MQTT 连接
+ `[CLOUD]`：云端连接
+ `[OTA]`：固件升级
+ `[WIFI]`：WiFi 连接

示例:

```log
[SWITCH] id=1 state=on trigger=button
[RPC] handle Switch.GetConfig from ws
[SWITCH] id=1 state=off trigger=button
[MQTT] connected to 192.168.50.190:1883
[RPC] handle Switch.Set from mqtt
```

## WebSocket日志

启用后，设备日志将流式传输到 `ws://${SONOFF}/debug/log`（例如 `ws://10.33.52.133/debug/log`）。

禁用时，日志记录将停止，所有打开的 WebSocket 调试连接将被关闭。最多可以同时打开三个 WebSocket 调试连接。

日志以 JSON 对象的形式流式传输，每个对象包含以下字段：

+ `seq`：number，日志序号，单调递增
+ `ts`：number，Unix 时间戳（UTC），精确到毫秒
+ `level`：number，日志级别。取值范围：`1` → 错误，`2` → 警告，`3` → 信息，`4` → 调试，`5` → 详细调试
+ `data`：string，日志消息

```json
{"seq":32,"ts":1786517430000,"level":3,"data":"[SWITCH] id=1 state=on trigger=input"}
{"seq":33,"ts":1786517430000,"level":3,"data":"[RPC] handle Switch.GetConfig from ws"}
{"seq":34,"ts":1786517430000,"level":3,"data":"[RPC] handle Switch.GetStatus from ws"}
```
