# WebSocket

WebSocket 组件用于控制出站 WebSocket 的启用、禁用，以及获取出站 WebSocket 的连接状态。

| Method | Description |
| --- | --- |
| WebSocket.SetConfig | 更新配置 |
| WebSocket.GetConfig | 获取配置 |
| WebSocket.GetStatus | 获取状态 |


## 方法
WebSocket 组件支持的方法如下。

### WebSocket.SetConfig
更新 WebSocket 组件配置。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| config | object | 配置参数 |


更多关于 `config` 属性的内容，请参阅 `config` 数据结构。

**响应**

请参考应答帧。

### WebSocket.GetConfig
获取 WebSocket 组件配置。

**请求**

无。

**响应**

| Property | Type | Description |
| --- | --- | --- |
| config | object | 配置参数 |


更多关于 `config` 属性的内容，请参阅 `config` 数据结构。

### WebSocket.GetStatus
获取 WebSocket 组件状态。

**请求**

无。

**响应**

`WebSocket.GetStatus` 的响应内容请参阅 `status` 数据结构。

## 数据结构
WebSocket 组件相关的数据结构如下。

### config
| Property | Type | Description |
| --- | --- | --- |
| enable | boolean | true: 启用出站websocket<br/>false: 禁用出站websocket |
| server | string or null | websocket服务器主机名称 |
| ssl_ca | string or null | 连接方式<br/>null ： 无TLS（默认）  <br/>* ：TLS不校验<br/>user_ca.pem ： 用户自定义TLS<br/>ca.pem：使用内置CA 证书包 进行TLS连接 |


### status
| Property | Type | Description |
| --- | --- | --- |
| connected | boolean | true: 出站websocket已连接<br/>false: 出站websocket未连接 |


## 事件通知
WebSocket 组件支持的事件通知如下。

### config_changed
使用 `WebSocket.SetConfig` 修改配置后，会发出出站 WebSocket 配置更新事件。

## 状态通知
当出站 WebSocket 建立连接或断开连接后，会触发状态通知。携带的数据请参阅 `status` 数据结构。

## 示例
WebSocket 组件各方法与事件的示例。

### WebSocket.SetConfig 示例
**请求**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"WebSocket.SetConfig",
   "params": {
      "config": {
          "enable": true,
          "server": "ws://172.20.66.65:8080/",
          "ssl_ca": null
      }
   }
}
```

**响应**

```json
{
   "id": 1,
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "result": {}
}
```

### WebSocket.GetConfig 示例
**请求**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"WebSocket.GetConfig",
   "params": {}
}
```

**响应**

```json
{
   "id": 1,
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "result": {
      "config": {
          "enable": true,
          "server": "ws://172.20.66.65:8080/",
          "ssl_ca": null
      }
   }
}
```

### WebSocket.GetStatus 示例
**请求**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"WebSocket.GetStatus",
   "params": {}
}
```

**响应**

```json
{
   "id": 1,
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "result": {
      "connected": true
   }
}
```

### 通知示例
#### config_changed 示例
```json
{
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "method": "NotifyEvent",
   "params": {
      "ts": 1234567890,
       "events": [
         {
          "component": "websocket",
          "event": "config_changed",
          "ts": 1234567890
         }
      ]
   }
}
```

#### 状态通知 示例
```json
{
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "method": "NotifyStatus",
   "params": {
      "ts": 1234567890,
      "websocket": {
          "connected": false
      }
   }
}
```

