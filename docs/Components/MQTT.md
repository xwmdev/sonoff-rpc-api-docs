---
sidebar_position: 8
---

# MQTT

MQTT 组件提供第三方 MQTT Broker 连接、状态发布、远程控制、TLS 证书管理和运行状态查询服务，并可启用 Home Assistant MQTT 自动发现。

| Method | Description |
| --- | --- |
| MQTT.SetConfig | 设置 MQTT 配置 |
| MQTT.GetConfig | 获取 MQTT 配置 |
| MQTT.GetStatus | 获取 MQTT 运行状态 |
| MQTT.GetCertsInfo | 查询已上传证书文件名 |
| MQTT.PutUserCA | 上传或删除自定义 CA 证书 |
| MQTT.PutTLSClientCert | 上传或删除 TLS 客户端证书 |
| MQTT.PutTLSClientKey | 上传或删除 TLS 客户端私钥 |


## 方法
MQTT 组件支持的方法如下。

### MQTT.SetConfig
设置 MQTT 配置。请求必须使用 `params.config` 包裹配置对象，不支持直接在 `params` 下传配置字段。

未携带的 `config` 字段保持当前值不变；字符串字段传 `null` 表示清空。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| config | object | MQTT 配置对象，必填 |

更多关于 `config` 属性的内容，请参阅 `config` 数据结构。

**响应**

| Property | Type | Description |
| --- | --- | --- |
| - | object | 成功时返回空对象 `{}` |


### MQTT.GetConfig
获取当前 MQTT 配置。

**请求**

无。

**响应**

`MQTT.GetConfig` 的响应内容请参阅 `config` 数据结构。

**说明：** 响应中 `pass` 固定返回 `null`，不会回显 MQTT 密码。

### MQTT.GetStatus
获取 MQTT 组件当前运行状态。

**请求**

无。

**响应**

> **兼容性说明：** 除本文档明确列出的字段外，设备响应中可能还包含其它保留字段。这些字段未纳入公开接口规范，可能在后续固件版本中调整或移除，请勿依赖。

| Property | Type | Description |
| --- | --- | --- |
| connected | boolean | MQTT 是否已连接 Broker |


### MQTT.GetCertsInfo
查询当前已保存的 MQTT TLS 证书文件名。

**请求**

无。

**响应**

| Property | Type | Description |
| --- | --- | --- |
| ca_cert_name | string or null | 自定义 CA 证书文件名。未上传时为 `null` |
| client_cert_name | string or null | TLS 客户端证书文件名。未上传时为 `null` |
| client_key_name | string or null | TLS 客户端私钥文件名。未上传时为 `null` |


### MQTT.PutUserCA
上传或删除 MQTT 自定义 CA 证书 PEM 数据。该证书用于 `ssl_ca` 设置为 `user_ca.pem` 的场景。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| name | string | 必填。文件名称，不能为空，最长 64 字节 |
| data | string or null | PEM 内容。传 `null` 表示删除该证书 |
| append | boolean | 是否追加分包。`true`：追加；`false` 或不传：本包结束并保存 |


**说明：** `append=true` 时 `data` 不能为 `null`。单个证书 PEM 总长度最大 4096 字节。

**响应**

| Property | Type | Description |
| --- | --- | --- |
| len | number | 当前已保存或已接收的数据长度，范围 `0` 到 `4096`；删除成功时为 `0` |


### MQTT.PutTLSClientCert
上传或删除 MQTT TLS 客户端证书 PEM 数据。用于需要双向 TLS 认证的 Broker。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| name | string | 必填。文件名称，不能为空，最长 64 字节 |
| data | string or null | PEM 内容。传 `null` 表示删除该证书 |
| append | boolean | 是否追加分包。`true`：追加；`false` 或不传：本包结束并保存 |


**说明：** `append=true` 时 `data` 不能为 `null`。客户端证书 PEM 总长度最大 4096 字节。

**响应**

| Property | Type | Description |
| --- | --- | --- |
| len | number | 当前已保存或已接收的数据长度，范围 `0` 到 `4096`；删除成功时为 `0` |


### MQTT.PutTLSClientKey
上传或删除 MQTT TLS 客户端私钥 PEM 数据。用于需要双向 TLS 认证的 Broker。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| name | string | 必填。文件名称，不能为空，最长 64 字节 |
| data | string or null | PEM 内容。传 `null` 表示删除该私钥 |
| append | boolean | 是否追加分包。`true`：追加；`false` 或不传：本包结束并保存 |


**说明：** `append=true` 时 `data` 不能为 `null`。客户端私钥 PEM 总长度最大 4096 字节。



**响应**

| Property | Type | Description |
| --- | --- | --- |
| len | number | 当前已保存或已接收的数据长度，范围 `0` 到 `4096`；删除成功时为 `0` |


## 数据结构
MQTT 组件相关的数据结构如下。

### config
`config` 用于 `MQTT.SetConfig` 请求和 `MQTT.GetConfig` 响应。

| Property | Type | Description |
| --- | --- | --- |
| enable | boolean | 是否启用 MQTT 连接。`MQTT.SetConfig` 请求中可选 |
| enable_ha | boolean | 是否启用 Home Assistant MQTT 自动发现。`MQTT.SetConfig` 请求中可选 |
| rpc_ntf | boolean | 是否允许通过 MQTT 发送 RPC 通知。`MQTT.SetConfig` 请求中可选 |
| status_ntf | boolean | 是否允许自动发布 MQTT 状态。`MQTT.SetConfig` 请求中可选 |
| debug_output | boolean | 是否通过 MQTT 输出 livelog 调试日志。`MQTT.SetConfig` 请求中可选 |
| server | string or null | Broker 地址，格式为 `host` 或 `host:port`；`host` 最长 128 字节，完整字符串总长度不超过 128 字节，端口范围为 `1` 到 `65535`。请求中传 `null` 表示清空；未配置时响应为 `null` |
| userName | string or null | Broker 用户名，最长 64 字节。请求中传 `null` 表示清空；未配置时响应为 `null` |
| pass | string or null | Broker 密码，最长 64 字节。请求中传 `null` 表示清空；响应中固定为 `null`，不回显密码 |
| clientId | string or null | MQTT Client ID，最长 64 字节。请求中传 `null` 或空字符串时由设备自动生成；未配置时响应为 `null` |
| ssl_ca | string or null | TLS CA 来源。`null` 或空字符串：不启用 TLS；`*`：系统 CA Bundle；`ca.pem`：固件内置 CA；`user_ca.pem`：用户上传 CA |


## MQTT 设置与使用
本节通过一个完整示例说明如何配置设备连接 MQTT Broker、检查连接状态、订阅设备消息以及通过 MQTT 调用设备方法。

示例使用以下参数：

| Parameter | Example value |
| --- | --- |
| 设备 IP | `172.20.66.148` |
| MQTT Broker | `broker.hivemq.com:1883` |
| 设备 ID（Topic 根路径） | `sonoffmini1gsp-acebe61fae74` |
| MQTT RPC 请求来源 | `sonoff-doc-client` |

> **说明：** 公共 Broker 仅适合功能验证。实际部署时应使用受控的私有 Broker，并根据安全要求配置用户名、密码或 TLS。

### 步骤 1：准备 MQTT Broker 和客户端工具
确认设备和测试电脑都能访问目标 Broker，并在电脑上安装包含 `mosquitto_pub` 和 `mosquitto_sub` 的 Mosquitto 客户端工具。

后续命令使用以下环境变量：

```bash
export MQTT_SERVER="broker.hivemq.com"
export MQTT_PORT=1883
export SONOFF_ID="sonoffmini1gsp-acebe61fae74"
export RPC_SRC="sonoff-doc-client"
```

如果 Broker 要求用户名和密码，请在后续每条 `mosquitto_pub` 和 `mosquitto_sub` 命令中增加 `-u <username> -P <password>`。

### 步骤 2：查询当前 MQTT 配置
使用 WebSocket RPC 客户端连接 `ws://172.20.66.148/rpc`，然后发送：

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "src": "web",
  "method": "MQTT.GetConfig",
  "params": {}
}
```

重点检查响应中的 `config.enable` 和 `config.server`。如果 MQTT 未启用或 Broker 地址不正确，请继续执行下一步。

### 步骤 3：设置 MQTT 连接
以下请求启用 MQTT、状态发布、RPC 通知和 Home Assistant 自动发现，并设置一个无需鉴权的普通 TCP Broker：

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "src": "web",
  "method": "MQTT.SetConfig",
  "params": {
    "config": {
      "enable": true,
      "enable_ha": true,
      "server": "broker.hivemq.com:1883",
      "userName": null,
      "pass": null,
      "clientId": "mini-1gsp-demo",
      "ssl_ca": null,
      "rpc_ntf": true,
      "status_ntf": true,
      "debug_output": false
    }
  }
}
```

如果 Broker 要求鉴权，请将 `userName` 和 `pass` 替换为实际凭据。配置成功后设备会自动重建 MQTT 连接，不需要重启设备。TLS 和双向 TLS 的配置方式请参考本文件中的证书上传方法与 `config.ssl_ca` 说明。

### 步骤 4：检查 MQTT 是否连接成功
等待数秒后，通过设备 WebSocket RPC 通道发送：

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "src": "web",
  "method": "MQTT.GetStatus",
  "params": {}
}
```

当响应中的 `connected` 为 `true` 时，表示设备已经连接 Broker。若为 `false`，请检查 Broker 地址和端口、网络可达性、用户名和密码，以及 TLS 证书配置。

### 步骤 5：订阅在线状态和设备状态
设备在 `<sonoff-id>/online` 发布在线状态，在 `<sonoff-id>/status` 发布设备状态。执行：

```bash
mosquitto_sub -h ${MQTT_SERVER} -p ${MQTT_PORT} -v \
  -t "${SONOFF_ID}/online" \
  -t "${SONOFF_ID}/status"
```

设备在线时，`<sonoff-id>/online` 的载荷为 `online`；设备异常断开时，Broker 通过遗嘱消息发布 `offline`。启用 `status_ntf` 后，`<sonoff-id>/status` 会收到保留的 JSON 状态数据。

### 步骤 6：通过 MQTT 调用设备方法
先订阅 `<src>/rpc` 接收请求响应：

```bash
mosquitto_sub -h ${MQTT_SERVER} -p ${MQTT_PORT} -v \
  -t "${RPC_SRC}/rpc"
```

在另一个终端向 `<sonoff-id>/rpc` 发布请求，例如查询开关状态：

```bash
mosquitto_pub -h ${MQTT_SERVER} -p ${MQTT_PORT} \
  -t "${SONOFF_ID}/rpc" \
  -m '{"jsonrpc":"2.0","id":100,"src":"sonoff-doc-client","method":"Switch.GetStatus","params":{"id":1}}'
```

设备会把响应发布到 `sonoff-doc-client/rpc`。设备通知发布到 `<sonoff-id>/events/rpc`；MQTT RPC 请求、响应和通知的完整规则请参考通用 RPC 文档。


## MQTT Control
MQTT Control 提供不需要构造完整 RPC 请求的简化控制方式。外部系统向固定命令 Topic 发布文本载荷，即可控制对应组件。使用该功能前，应将 MQTT 配置中的 `config.enable` 设置为 `true`。

默认 `<topic_root>` 与设备 ID 相同，可从设备 RPC 响应的 `src` 字段确认。命令 Topic 不返回独立响应；命令执行成功后，设备会在 `<topic_root>/status` 发布更新后的保留状态。无效载荷可能被忽略，控制端应通过状态 Topic 确认最终结果。

布尔命令统一支持不区分大小写的 `ON`、`OFF`、`true`、`false`，以及 `1`、`0`。

### 通用 Topic
| Topic | Payload | Description |
| --- | --- | --- |
| `<topic_root>/status` | JSON object | 设备状态，保留消息；字段说明参考本文件中的状态定义 |
| `<topic_root>/online` | `online` 或 `offline` | MQTT 在线状态，保留消息；`offline` 也作为遗嘱消息使用 |


## 事件通知
MQTT 组件支持的事件通知如下。

### config_changed
MQTT 配置变化后，设备会发送 `NotifyEvent` 事件通知。

事件项的 `component` 固定为 `mqtt`、`id` 固定为 `1`、`event` 固定为 `config_changed`，不携带额外业务字段。通知及事件项中的 `ts` 为 UTC Unix 时间戳，单位秒，可带小数。



## 示例
MQTT 组件各方法与事件的示例。

### MQTT.SetConfig 示例
设置普通 MQTT 连接：

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "src": "web",
  "method": "MQTT.SetConfig",
  "params": {
    "config": {
      "enable": true,
      "enable_ha": true,
      "server": "192.168.3.29:1883",
      "userName": "mqtt_user",
      "pass": "mqtt_password",
      "clientId": "mini-1gsp-demo",
      "ssl_ca": null,
      "rpc_ntf": true,
      "status_ntf": true,
      "debug_output": false
    }
  }
}
```

**响应**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 1,
  "result": {}
}
```

设置 TLS MQTT 连接并使用自定义 CA：

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "src": "web",
  "method": "MQTT.SetConfig",
  "params": {
    "config": {
      "enable": true,
      "server": "192.168.3.29:8883",
      "ssl_ca": "user_ca.pem"
    }
  }
}
```

### MQTT.GetConfig 示例
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "src": "web",
  "method": "MQTT.GetConfig",
  "params": {}
}
```

**响应**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 3,
  "result": {
    "config": {
      "enable": true,
      "enable_ha": true,
      "rpc_ntf": true,
      "status_ntf": true,
      "debug_output": false,
      "server": "192.168.3.29:1883",
      "userName": "mqtt_user",
      "pass": null,
      "clientId": "mini-1gsp-demo",
      "ssl_ca": null
    }
  }
}
```

### MQTT.GetStatus 示例
```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "src": "web",
  "method": "MQTT.GetStatus",
  "params": {}
}
```

**响应**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 4,
  "result": {
    "connected": true
  }
}
```

### MQTT.GetCertsInfo 示例
```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "src": "web",
  "method": "MQTT.GetCertsInfo",
  "params": {}
}
```

**响应**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 5,
  "result": {
    "ca_cert_name": "ca.crt",
    "client_cert_name": "device.crt",
    "client_key_name": "device.key"
  }
}
```

### MQTT.PutUserCA 示例
上传自定义 CA：

```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "src": "web",
  "method": "MQTT.PutUserCA",
  "params": {
    "name": "ca.crt",
    "append": false,
    "data": "-----BEGIN CERTIFICATE-----\nMIIC...\n-----END CERTIFICATE-----\n"
  }
}
```

**响应**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 6,
  "result": {
    "len": 1024
  }
}
```

删除自定义 CA：

```json
{
  "jsonrpc": "2.0",
  "id": 7,
  "src": "web",
  "method": "MQTT.PutUserCA",
  "params": {
    "name": "ca.crt",
    "data": null
  }
}
```

**响应**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 7,
  "result": {
    "len": 0
  }
}
```

### MQTT.PutTLSClientCert 示例
```json
{
  "jsonrpc": "2.0",
  "id": 8,
  "src": "web",
  "method": "MQTT.PutTLSClientCert",
  "params": {
    "name": "device.crt",
    "append": false,
    "data": "-----BEGIN CERTIFICATE-----\nMIIC...\n-----END CERTIFICATE-----\n"
  }
}
```

**响应**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 8,
  "result": {
    "len": 1024
  }
}
```

### MQTT.PutTLSClientKey 示例
```json
{
  "jsonrpc": "2.0",
  "id": 9,
  "src": "web",
  "method": "MQTT.PutTLSClientKey",
  "params": {
    "name": "device.key",
    "append": false,
    "data": "-----BEGIN PRIVATE KEY-----\nMIGH...\n-----END PRIVATE KEY-----\n"
  }
}
```

**响应**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 9,
  "result": {
    "len": 1024
  }
}
```

### 通知示例
#### config_changed 示例
```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "method": "NotifyEvent",
  "params": {
    "ts": 1626221112,
    "events": [
      {
        "component": "mqtt",
        "id": 1,
        "event": "config_changed",
        "ts": 1626221112
      }
    ]
  }
}
```
