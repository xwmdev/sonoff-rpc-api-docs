# WebSocket

The WebSocket component is used to control enabling and disabling outbound WebSocket, and to get the connection status of outbound WebSocket.

| Method | Description |
| --- | --- |
| WebSocket.SetConfig | Update configuration |
| WebSocket.GetConfig | Get configuration |
| WebSocket.GetStatus | Get status |


## Methods
The methods supported by the WebSocket component are as follows.

### WebSocket.SetConfig
Update WebSocket component configuration.

**Request**

| Property | Type | Description |
| --- | --- | --- |
| config | object | Configuration parameters |


For more details about the `config` property, see the `config` data structure.

**Response**

Please refer to the response frame.

### WebSocket.GetConfig
Get WebSocket component configuration.

**Request**

None.

**Response**

| Property | Type | Description |
| --- | --- | --- |
| config | object | Configuration parameters |


For more details about the `config` property, see the `config` data structure.

### WebSocket.GetStatus
Get WebSocket component status.

**Request**

None.

**Response**

For the response content of `WebSocket.GetStatus`, see the `status` data structure.

## Data Structures
The data structures related to the WebSocket component are as follows.

### config
| Property | Type | Description |
| --- | --- | --- |
| enable | boolean | true: enable outbound websocket<br/>false: disable outbound websocket |
| server | string or null | websocket server hostname |
| ssl_ca | string or null | Connection mode<br/>null: no TLS (default)<br/>*: TLS without verification<br/>user_ca.pem: user-defined TLS<br/>ca.pem: use built-in CA certificate bundle for TLS connection |


### status
| Property | Type | Description |
| --- | --- | --- |
| connected | boolean | true: outbound websocket connected<br/>false: outbound websocket not connected |


## Event Notifications
The event notifications supported by the WebSocket component are as follows.

### config_changed
After modifying the configuration using `WebSocket.SetConfig`, an outbound WebSocket configuration update event will be emitted.

## Status Notifications
When an outbound WebSocket connection is established or disconnected, a status notification will be triggered. For the data carried, see the `status` data structure.

## Examples
Examples of the WebSocket component methods and events.

### WebSocket.SetConfig Example
**Request**

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

**Success Response**

```json
{
   "id": 1,
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "result": {}
}
```

### WebSocket.GetConfig Example
**Request**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"WebSocket.GetConfig",
   "params": {}
}
```

**Success Response**

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

### WebSocket.GetStatus Example
**Request**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"WebSocket.GetStatus",
   "params": {}
}
```

**Success Response**

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

### Notification Examples
#### config_changed Example
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

#### Status Notification Example
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
