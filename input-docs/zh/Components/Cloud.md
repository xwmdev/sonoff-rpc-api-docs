# Cloud

Cloud 组件用于管理易微联云端连接，包括启用或禁用云端功能、查询云端在线状态以及扫码配对。

| Method | Description |
| --- | --- |
| Cloud.SetConfig | 设置云端配置 |
| Cloud.GetConfig | 获取云端配置 |
| Cloud.GetStatus | 获取云端状态 |
| Cloud.GetPairCode | 获取云端配对二维码 |


## 方法
Cloud 组件支持的方法如下。

### Cloud.SetConfig
启用或禁用易微联云端连接。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| enable | boolean | true: 开启云端连接<br/>false: 关闭云端连接 |


**响应**

请参考应答帧。

### Cloud.GetConfig
获取当前云端连接配置。

**请求**

无。

**响应**

| Property | Type | Description |
| --- | --- | --- |
| enable | boolean | true: 开启云端连接<br/>false: 关闭云端连接 |


### Cloud.GetStatus
获取云端配对状态与在线状态。

**请求**

无。

**响应**

| Property | Type | Description |
| --- | --- | --- |
| pair_status | boolean | true: 设备已经配对过易微联<br/>false: 设备还未配对过易微联 |
| online_status | boolean | true: 设备在酷宅云已上线<br/>false: 设备在酷宅云已离线 |


### Cloud.GetPairCode
获取 Cloud 组件云端配对二维码，并启动扫码配对流程。
在获取到云端配对二维码后，需要使用易微联APP在五分钟内扫描该二维码，此时设备会根据扫描配对的实时状态，发出扫码配对事件通知。

具体通知包含：

* scan_pair_fail
* scan_pair_timeout
* scan_pair_success

详情见事件通知中描述。

> 注意：该接口涉及到设备访问云端服务器，所以必须在设备互联网可达时，才能通过该方法获取到正确的响应数据。

**请求**

无。

**响应**

| Property | Type | Description |
| --- | --- | --- |
| QRcode | string | 云端配对二维码的文本表示 |


## 事件通知
Cloud 组件支持的事件通知如下。

### scan_pair_fail
扫码配对失败事件。当使用`Cloud.GetPairCode`方法获取到二维码信息后，如果通过易微联APP扫码但配对失败，则设备会发出扫码配对失败事件。

### scan_pair_timeout
扫码配对超时事件。当使用`Cloud.GetPairCode`方法获取到二维码信息后，如果一直未使用易微联APP扫码或者网络超时，则设备会在五分钟后发出扫码配对超时事件。

### scan_pair_success
扫码配对成功事件。当使用`Cloud.GetPairCode`方法获取到二维码信息后，如果通过易微联APP扫码并且配对成功，则设备会发出扫码配对成功事件。

## 状态通知
云端上线或离线、Cloud 组件配置变更时，将触发状态通知。携带数据如下：

| Property | Type | Description |
| --- | --- | --- |
| enable | boolean | true: 开启云端连接<br/>false: 关闭云端连接 |
| pair_status | boolean | true: 设备已经配对过易微联<br/>false: 设备还未配对过易微联 |
| online_status | boolean | true: 设备在酷宅云已上线<br/>false: 设备在酷宅云已离线 |


## 示例
Cloud 组件各方法的请求与响应示例。

### Cloud.SetConfig 示例
**请求**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Cloud.SetConfig",
   "params": {
      "enable":true
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

### Cloud.GetConfig 示例
**请求**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Cloud.GetConfig"
}
```

**响应**

```json
{
   "id": 1,
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "result": {
      "enable": false
   }
}
```

### Cloud.GetStatus 示例
**请求**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Cloud.GetStatus"
}
```

**响应**

```json
{
   "id": 1,
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "result": {
       "pair_status": true,
       "online_status": true
   }
}
```

### Cloud.GetPairCode 示例
**请求**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Cloud.GetPairCode"
}
```

**响应**

```json
{
   "id": 1,
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "result": {
      "QRcode": "xxxxxxx"
   }
}
```

### 通知示例
#### scan_pair_fail 示例
```json
{
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "method": "NotifyEvent",
   "params": {
      "ts": 1234567890,
      "events": [
         {
            "component": "cloud",
            "event": "scan_pair_fail",
            "ts": 1234567890
         }
      ]
   }
}
```

#### scan_pair_timeout 示例
```json
{
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "method": "NotifyEvent",
   "params": {
      "ts": 1234567890,
      "events": [
         {
            "component": "cloud",
            "event": "scan_pair_timeout",
            "ts": 1234567890
         }
      ]
   }
}
```

#### scan_pair_success 示例
```json
{
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "method": "NotifyEvent",
   "params": {
      "ts": 1234567890,
      "events": [
         {
            "component": "cloud",
            "event": "scan_pair_success",
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
      "cloud": {
         "enable": true,
         "pair_status": true,
         "online_status": true
      }
   }
}
```

