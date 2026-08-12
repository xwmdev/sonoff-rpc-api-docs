# Cloud

The Cloud component manages the eWeLink cloud connection, including enabling or disabling cloud functionality, querying cloud online status, and QR code pairing.

| Method | Description |
| --- | --- |
| Cloud.SetConfig | Set cloud configuration |
| Cloud.GetConfig | Get cloud configuration |
| Cloud.GetStatus | Get cloud status |
| Cloud.GetPairCode | Get cloud pairing QR code |


## Methods
Methods supported by the Cloud component.

### Cloud.SetConfig
Enable or disable the eWeLink cloud connection.

**Request**

| Property | Type | Description |
| --- | --- | --- |
| enable | boolean | true: enable cloud connection<br/>false: disable cloud connection |


**Response**

Refer to the response frame.

### Cloud.GetConfig
Get the current cloud connection configuration.

**Request**

None.

**Response**

| Property | Type | Description |
| --- | --- | --- |
| enable | boolean | true: enable cloud connection<br/>false: disable cloud connection |


### Cloud.GetStatus
Get the cloud pairing status and online status.

**Request**

None.

**Response**

| Property | Type | Description |
| --- | --- | --- |
| pair_status | boolean | true: device has been paired with eWeLink<br/>false: device has not been paired with eWeLink |
| online_status | boolean | true: device is online on CoolKit Cloud<br/>false: device is offline on CoolKit Cloud |


### Cloud.GetPairCode
Get the Cloud component's cloud pairing QR code and start the QR code pairing process.
After obtaining the cloud pairing QR code, scan it within five minutes using the eWeLink app. The device will emit QR code pairing event notifications based on the real-time scanning and pairing status.

Specific notifications include:

* scan_pair_fail
* scan_pair_timeout
* scan_pair_success

See the event notification description for details.

> Note: This interface involves the device accessing cloud servers, so the correct response data can only be obtained through this method when the device has internet access.

**Request**

None.

**Response**

| Property | Type | Description |
| --- | --- | --- |
| QRcode | string | Text representation of the cloud pairing QR code |


## Event Notifications
Event notifications supported by the Cloud component.

### scan_pair_fail
QR code pairing failure event. When a QR code is obtained using `Cloud.GetPairCode`, if scanning via the eWeLink app results in a pairing failure, the device emits a scan_pair_fail event.

### scan_pair_timeout
QR code pairing timeout event. When a QR code is obtained using `Cloud.GetPairCode`, if no scan is performed via the eWeLink app within the time limit or a network timeout occurs, the device emits a scan_pair_timeout event after five minutes.

### scan_pair_success
QR code pairing success event. When a QR code is obtained using `Cloud.GetPairCode`, if scanning via the eWeLink app results in a successful pairing, the device emits a scan_pair_success event.

## Status Notifications
When the cloud goes online or offline, or when the Cloud component configuration changes, a status notification is triggered. The data carried is as follows:

| Property | Type | Description |
| --- | --- | --- |
| enable | boolean | true: enable cloud connection<br/>false: disable cloud connection |
| pair_status | boolean | true: device has been paired with eWeLink<br/>false: device has not been paired with eWeLink |
| online_status | boolean | true: device is online on CoolKit Cloud<br/>false: device is offline on CoolKit Cloud |


## Examples
Request and response examples for each Cloud component method.

### Cloud.SetConfig Example
**Request**

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

**Response**

```json
{
   "id": 1,
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "result": {}
}
```

### Cloud.GetConfig Example
**Request**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Cloud.GetConfig"
}
```

**Response**

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

### Cloud.GetStatus Example
**Request**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Cloud.GetStatus"
}
```

**Response**

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

### Cloud.GetPairCode Example
**Request**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Cloud.GetPairCode"
}
```

**Response**

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

### Notification Examples
#### scan_pair_fail Example
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

#### scan_pair_timeout Example
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

#### scan_pair_success Example
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

#### Status Notification Example
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
