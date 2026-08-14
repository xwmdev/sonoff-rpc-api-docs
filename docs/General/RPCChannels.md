---
sidebar_position: 2
---

# RPC 传输通道

设备支持通过多种 RPC 通道进行通信。

## HTTP

HTTP 用于一次性请求-响应调用。它不支持连接保持在线，且无法通过该通道发送和接收通知。当启用认证功能时，将通过 [HTTP 摘要认证](Authentication.md) 实施保护。

客户端 POST 到设备端点 `/rpc`，提供整个 JSON RPC 调用帧作为有效载荷：

```shell
> POST /rpc HTTP/1.1
> Content-Type: application/json
> Content-Length: 75
> 
> {"id":1, "src":"user_1", "method":"Switch.Set","params":{"id":1,"on":true}}
< HTTP/1.1 200 OK
< Content-Type: application/json
< Content-Length: 56
< Connection: close
< 
< {"id":1,"src":"sonoffmini1gsp-acebe61fae74","result":{}}
```

应答也是完整的应答帧。

示例：

设置环境变量用于连接设备 IP 地址 192.168.33.1：

```bash
export SONOFF=192.168.33.1
```

HTTP POST 请求调用 Switch.Set 方法：

```bash
curl -X POST -d '{"id":2, "src":"user_1", "method":"Switch.Set", "params":{"id":1, "on":true}}' "http://${SONOFF}/rpc"
```

## WebSocket

在整个通信过程中（不仅限于单个请求-响应对），连接始终保持活跃，这与本地网页界面的使用方式一致。每个 Sonoff 设备都提供一个 WebSocket 端点，客户端可通过连接该端点与设备进行通信。此通道支持通过 [摘要认证](Authentication.md) 进行保护。

WebSocket 通道的服务地址为 `ws://${SONOFF}/rpc`。客户端必须至少发送一个包含有效 `src` 字段的请求帧，才能接收来自设备的通知。

示例：

通过 WebSocket 连接到设备并调用 Switch.Set 方法：

```bash
websocat ws://${SONOFF}/rpc
{"id":2, "src":"user_1", "method":"Switch.Set", "params":{"id":1, "on":true}}
```

## MQTT

这是一种基于发布-订阅模式的通信方式。每个客户端都可以订阅和发布到特定的主题。连接由客户端建立，用于订阅主题或在 MQTT 代理上向主题发布消息。客户端要与设备通信，设备和客户端必须连接到同一个 MQTT 代理，或一组互联的代理。

+ **请求发布主题**：`<sonoff-id>/rpc`
    要向设备发送请求，必须向此主题发布请求帧，将 `<sonoff-id>` 替换为设备的 ID。例如：`sonoffmini1gsp-acebe61fae74/rpc`。

+ **响应接收主题**：`<src>/rpc`
    要接收所发送请求的响应，必须订阅此主题，将 `<src>` 替换为请求帧中定义的来源。例如，若请求帧包含 `"src":"user_1"`，则主题为 `user_1/rpc`。

+ **通知接收主题**：`<sonoff-id>/events/rpc`
    要接收设备的通知，必须订阅此主题，将 `<sonoff-id>` 替换为设备的 ID。例如：`sonoffmini1gsp-acebe61fae74/events/rpc`。

+ **在线状态主题**：`<sonoff-id>/online`
    设备在此主题上发布 `online` 表示已连接至 MQTT；当发生以下任一情况时，代理将作为设备的“遗言”(LWT)消息发布 `offline`：
    + 代理检测到 I/O 错误或网络故障。
    + 客户端未在设定的保活期内进行通信。
    + 客户端关闭网络连接前未发送 DISCONNECT 数据包。
    + 代理因协议错误关闭网络连接。

示例 1：

设置环境变量存放要连接的 MQTT 服务器和端口：

```bash
export MQTT_SERVER="broker.hivemq.com"
export MQTT_PORT=1883
```

示例 2：

请求调用 Switch.Set 方法，发布到主题 `sonoffmini1gsp-acebe61fae74/rpc`：

```bash
mosquitto_pub -h ${MQTT_SERVER} -p ${MQTT_PORT} -t sonoffmini1gsp-acebe61fae74/rpc \
 -m '{"id":123, "src":"user_1", "method":"Switch.Set", "params":{"id":1,"on":true}}'
```

应答：

```bash
On topic user_1/rpc:
payload {"id":123,"src":"sonoffmini1gsp-acebe61fae74","dst":"user_1","result":{}}
```

示例 3：

订阅主题 `user_1/rpc` 来接收应答：

```bash
mosquitto_sub -h ${MQTT_SERVER} -p ${MQTT_PORT} -t user_1/rpc
```

示例 4：

订阅主题 `sonoffmini1gsp-acebe61fae74/events/rpc` 来接收通知：

```bash
mosquitto_sub -h ${MQTT_SERVER} -p ${MQTT_PORT} -t sonoffmini1gsp-acebe61fae74/events/rpc
```

## 实用工具

有多种工具可用于向 Sonoff 设备发送请求并接收响应。

> **说明：** 以下命令基于 Unix 风格环境（Linux / macOS，或 Windows 上的 WSL / Git Bash）。Windows 10 及以上自带 `curl`；`websocat`、`mosquitto` 等工具需另行安装。

### curl

`curl` 是一个命令行工具和库，用于通过 URL 传输数据。可用于通过 HTTP 调用 RPC 方法。

提示：你可以通过设置 `SONOFF` 环境变量来方便地执行 `curl` 示例：

```bash
export SONOFF=yourSonoffIPOrHostname
```

### websocat

`websocat` 是一个命令行 WebSocket 多功能工具。

提示：你可以通过设置 `SONOFF` 环境变量来方便地执行 `websocat` 示例：

```bash
export SONOFF=yourSonoffIPOrHostname
```

### mosquitto

MQTT 代理和客户端工具。包含 CLI 工具：`mosquitto_pub` 和 `mosquitto_sub`。在 Ubuntu 上，这些工具打包为 `mosquitto-clients`。

提示：你可以通过设置以下环境变量来方便地执行 `mosquitto` 示例：

```bash
export MQTT_SERVER=yourMQTTServer
export MQTT_PORT=yourPort
```
