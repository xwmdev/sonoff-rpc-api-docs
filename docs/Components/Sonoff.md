# Sonoff

Sonoff 组件为所有设备通用，用于设备管理。

| Method | Description |
| --- | --- |
| Sonoff.GetDeviceInfo | 获取设备信息 |
| Sonoff.SetConfig | 配置设备 |
| Sonoff.GetConfig | 获取设备配置 |
| Sonoff.SetAuth | 设置认证参数 |
| Sonoff.ReSetAuth | 重设置认证参数（重设密码） |
| Sonoff.ForgetAuth | 忘记密码（需要物理操作确权） |


## 方法
Sonoff 组件支持的方法如下。

### Sonoff.GetDeviceInfo
获取设备信息。

**请求**

无。

**响应**

| Property | Type | Description |
| --- | --- | --- |
| name | string | 设备名称，最大长度20 |
| model | string | 设备型号，只读 |
| id | string | 设备ID。格式：`sonoff产品型号-mac地址`。示例：`sonoffmini1gsp-acebe61fae74` |
| ver | string | 固件版本。格式：`主版本.次版本.修订版本`。取值范围：`0.0.0` ~ `99.99.99` |
| ip | string | IP地址，IPv4类型。取值范围：`0.0.0.0` ~ `255.255.255.255` |
| mac | string | MAC地址，英文字母为小写，用`:`分隔 |
| auth_en | boolean | 认证开关。<br/> `true`：启用认证。<br/> `false`：未启用认证，只在未设置初始密码的时候处于未启用状态，不能主动禁用认证。 |
| auth_domain | string | 域名名称。未启用认证时为null |
| initial_password | boolean | 是否已经设置初始密码：<br/> `true`：已经设置密码。<br/> `false`：未设置密码，在首次登录时要求设置密码。 |

> **兼容性说明：** 除本文档明确列出的字段外，设备响应中可能还包含其它保留字段。这些字段未纳入公开接口规范，可能在后续固件版本中调整或移除，请勿依赖。


未设置密码时，除无需认证的接口外，其它 RPC 请求都会返回 `No password configured, access denied` 错误。

### Sonoff.SetConfig
配置设备。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| config | object | 设备配置对象。详见config |


**响应**

响应内容请参考应答帧。

### Sonoff.GetConfig
获取设备配置。

**请求**

无。

**响应**

| Property | Type | Description |
| --- | --- | --- |
| config | object | 设备配置对象。详见config |


### Sonoff.SetAuth
设置认证参数。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| user | string | 用户名。固定为：`admin` |
| realm | string | 设备ID。使用Sonoff.GetDeviceInfo方法获取到的id字段 |
| ha1 | string or null | `"user:realm:password"`编码为SHA256。 |


**响应**

响应内容请参考应答帧。

### Sonoff.ReSetAuth
重置认证参数（重设密码）。

该指令不需要接口认证，但需要在10秒内进行确权操作，才会正常执行并响应成功。

前端在用户输入新密码并确认后，发起该重设请求，同时提示用户操作，并显示等待与倒计时。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| user | string | 用户名。固定为：`admin` |
| realm | string | 设备ID |
| ha1 | string | `"user:realm:password"`编码为SHA256。 |


**响应**

响应内容请参考应答帧。

### Sonoff.ForgetAuth
忘记密码（需要物理操作确权）。

该指令不需要接口认证。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| state | string |  waiting，表示等待双击确认修改密码<br/> done 表示结束。超时时间为设备固定值10秒，不可配置。 |


**响应**

响应内容请参考应答帧。

**操作流程说明**

1. 需要忘记密码时，向设备发送 `Sonoff.ForgetAuth` 请求。
2. 设备响应 `Sonoff.ForgetAuth` 后，Web 界面弹窗显示 10 秒倒计时。
3. 设备在 10 秒内仅响应设备按钮的双击操作，上报双击事件用于确权。
4. 设备确权后在 10 分钟内允许使用 `Sonoff.ReSetAuth` 重设密码，超时后不再接受重设密码请求（该 10 分钟为设备固定值，不可配置）。



## 数据结构
Sonoff 组件相关的数据结构如下。

### config
| Property | Type | Description |
| --- | --- | --- |
| name | string | 设备名称，最大长度20。设置此字段会更新到Sonoff.GetDeviceInfo的name字段 |




## 事件通知
Sonoff 组件支持的事件通知如下。

### reset_auth_succ
新密码设置成功时，设备将发出此事件。

### reset_auth_fail
新密码设置失败时，设备将发出此事件。

## 示例
Sonoff 组件各方法与事件的示例。

### Sonoff.GetDeviceInfo 示例
**请求**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "src": "user_1",
  "method": "Sonoff.GetDeviceInfo",
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

### Sonoff.SetConfig 示例
**请求**

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

**响应**

```json
{
  "id": 2,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {}
}
```

### Sonoff.GetConfig 示例
**请求**

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "src": "user_1",
  "method": "Sonoff.GetConfig",
  "params": {}
}
```

**响应**

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

### Sonoff.SetAuth 示例
**请求**

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

**响应**

```json
{
  "id": 4,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {}
}
```

### Sonoff.ReSetAuth 示例
**请求**

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

**响应**

```json
{
  "id": 5,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {}
}
```

### Sonoff.ForgetAuth 示例
**请求**

开始忘记密码流程：

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

**响应**

```json
{
  "id": 6,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {}
}
```

**请求**

取消忘记密码流程：

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

**响应**

```json
{
  "id": 6,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {}
}
```



### 通知示例
#### reset_auth_succ 示例
当新密码设置成功时，设备会发送如下通知：

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

#### reset_auth_fail 示例
当新密码设置失败时，设备会发送如下通知：

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
