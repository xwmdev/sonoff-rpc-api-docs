# Sonoff

The Sonoff component is common to all devices and is used for device management.

| Method | Description |
| --- | --- |
| Sonoff.GetDeviceInfo | Get device information |
| Sonoff.SetConfig | Configure the device |
| Sonoff.GetConfig | Get device configuration |
| Sonoff.SetAuth | Set authentication parameters |
| Sonoff.ReSetAuth | Reset authentication parameters (reset password) |
| Sonoff.ForgetAuth | Forget password (requires physical operation for authorization) |


## Methods
The methods supported by the Sonoff component are as follows.

### Sonoff.GetDeviceInfo
Get device information.

**Request**

None.

**Response**

| Property | Type | Description |
| --- | --- | --- |
| name | string | Device name, max length 20 |
| model | string | Device model, read-only |
| id | string | Device ID. Format: `sonoff_product_model-mac_address`. Example: `sonoffmini1gsp-acebe61fae74` |
| ver | string | Firmware version. Format: `major.minor.patch`. Range: `0.0.0` ~ `99.99.99` |
| ip | string | IP address, IPv4 type. Range: `0.0.0.0` ~ `255.255.255.255` |
| mac | string | MAC address, lowercase letters, separated by `:` |
| auth_en | boolean | Authentication switch.<br/> `true`: Authentication enabled.<br/> `false`: Authentication not enabled. Only in the unenabled state when no initial password has been set; authentication cannot be actively disabled. |
| auth_domain | string | Domain name. null when authentication is not enabled |
| initial_password | boolean | Whether an initial password has been set:<br/> `true`: Password has been set.<br/> `false`: Password not set; password setup is required on first login. |

Note: This method response contains other undocumented fields and their use is not recommended at this time.


When no password has been set, all RPC requests, except for interfaces that do not require authentication, will return a `No password configured, access denied` error.

### Sonoff.SetConfig
Configure the device.

**Request**

| Property | Type | Description |
| --- | --- | --- |
| config | object | Device configuration object. See config for details |


**Response**

For the response content, please refer to the response frame.

### Sonoff.GetConfig
Get device configuration.

**Request**

None.

**Response**

| Property | Type | Description |
| --- | --- | --- |
| config | object | Device configuration object. See config for details |


### Sonoff.SetAuth
Set authentication parameters.

**Request**

| Property | Type | Description |
| --- | --- | --- |
| user | string | Username. Fixed as: `admin` |
| realm | string | Device ID. Use the id field obtained from the Sonoff.GetDeviceInfo method |
| ha1 | string or null | `"user:realm:password"` encoded as SHA256. |


**Response**

For the response content, please refer to the response frame.

### Sonoff.ReSetAuth
Reset authentication parameters (reset password).

This command does not require interface authentication, but a physical authorization operation must be performed within 10 seconds for it to execute normally and respond with success.

After the user enters and confirms a new password, the frontend initiates this reset request, prompts the user to perform the operation, and displays a waiting countdown.

**Request**

| Property | Type | Description |
| --- | --- | --- |
| user | string | Username. Fixed as: `admin` |
| realm | string | Device ID |
| ha1 | string | `"user:realm:password"` encoded as SHA256. |


**Response**

For the response content, please refer to the response frame.

### Sonoff.ForgetAuth
Forget password (requires physical operation for authorization).

This command does not require interface authentication.

**Request**

| Property | Type | Description |
| --- | --- | --- |
| state | string |  waiting, indicates waiting for double-click to confirm password reset<br/> done, indicates completion. The timeout period is a fixed device value of 10 seconds and is not configurable. |


**Response**

For the response content, please refer to the response frame.

**Operation Flow**

1. When you need to forget the password, send a `Sonoff.ForgetAuth` request to the device.
2. After the device responds to `Sonoff.ForgetAuth`, the web interface pops up a dialog showing a 10-second countdown.
3. Within 10 seconds, the device only responds to double-click operations on the device button and reports the double-click event for authorization.
4. After authorization, the device allows the use of `Sonoff.ReSetAuth` to reset the password within 10 minutes. After this period, password reset requests are no longer accepted (this 10-minute period is a fixed device value and is not configurable).



## Data Structures
The data structures related to the Sonoff component are as follows.

### config
| Property | Type | Description |
| --- | --- | --- |
| name | string | Device name, max length 20. Setting this field will update the name field in Sonoff.GetDeviceInfo |




## Event Notifications
The event notifications supported by the Sonoff component are as follows.

### reset_auth_succ
When the new password is set successfully, the device will emit this event.

### reset_auth_fail
When the new password setting fails, the device will emit this event.

## Examples
Examples of the Sonoff component methods and events.

### Sonoff.GetDeviceInfo Example
**Request**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "src": "user_1",
  "method": "Sonoff.GetDeviceInfo",
  "params": {}
}
```

**Response**

```json
{
  "id": 1,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {
    "name": "MINI-1GSP",
    "model": "SN-ESP32C6-MINI1GSP-01",
    "id": "sonoffmini1gsp-acebe61fae74",
    "ver": "0.0.1",
    "ip": "192.168.50.15",
    "mac": "ac:eb:e6:1f:ae:74",
    "auth_en": false,
    "auth_domain": null,
    "initial_password":false
  }
}
```

### Sonoff.SetConfig Example
**Request**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "src": "user_1",
  "method": "Sonoff.SetConfig",
  "params": {
    "config": {
      "name": "MINI-1GSP"
    }
  }
}
```

**Response**

```json
{
  "id": 2,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {}
}
```

### Sonoff.GetConfig Example
**Request**

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "src": "user_1",
  "method": "Sonoff.GetConfig",
  "params": {}
}
```

**Response**

```json
{
  "id": 3,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {
    "config": {
      "name": "MINI-1GSP"
    }
  }
}
```

### Sonoff.SetAuth Example
**Request**

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "src": "user_1",
  "method": "Sonoff.SetAuth",
  "params": {
    "user": "admin",
    "realm": "sonoffmini1gsp-acebe61fae74",
    "ha1": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  }
}
```

**Response**

```json
{
  "id": 4,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {}
}
```

### Sonoff.ReSetAuth Example
**Request**

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "src": "user_1",
  "method": "Sonoff.ReSetAuth",
  "params": {
    "user": "admin",
    "realm": "sonoffmini1gsp-acebe61fae74",
    "ha1": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  }
}
```

**Response**

```json
{
  "id": 5,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {}
}
```

### Sonoff.ForgetAuth Example
**Request**

Start the forget password process:

```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "src": "user_1",
  "method": "Sonoff.ForgetAuth",
  "params": {
    "state": "waiting"
  }
}
```

**Response**

```json
{
  "id": 6,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {}
}
```

**Request**

Cancel the forget password process:

```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "src": "user_1",
  "method": "Sonoff.ForgetAuth",
  "params": {
    "state": "done"
  }
}
```

**Response**

```json
{
  "id": 6,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {}
}
```



### Notification Examples
#### reset_auth_succ Example
When the new password is set successfully, the device will send the following notification:

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "method": "NotifyEvent",
  "params": {
    "ts": 1626221112,
    "events": [
      {
        "component": "sonoff",
        "event": "reset_auth_succ",
        "ts": 1626221112
      }
    ]
  }
}
```

#### reset_auth_fail Example
When the new password setting fails, the device will send the following notification:

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "method": "NotifyEvent",
  "params": {
    "ts": 1626221112,
    "events": [
      {
        "component": "sonoff",
        "event": "reset_auth_fail",
        "ts": 1626221112
      }
    ]
  }
}
```
