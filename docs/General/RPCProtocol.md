---
sidebar_position: 1
---

# RPC 协议

设备通过 **JSON-RPC 2.0** 协议进行监控和控制。

根据规范约定，每个过程都是一个方法，具有方法名（如 `Switch.GetConfig`），接受一个 JSON 对象作为参数（如 `{"id":1}`），并返回一个 JSON 对象作为结果（如 `{}`）。方法按命名空间组织，例如：

+ `Sonoff` — 设备管理
    + `Sonoff.GetDeviceInfo`
    + `Sonoff.GetConfig`
    + `Sonoff.SetAuth` 等
+ `Switch` — 开关(继电器)组件
    + `Switch.Set`
    + `Switch.GetConfig` 等
+ `System` — 系统组件
    + `System.GetStatus`
    + `System.GetConfig` 等

用户与设备之间的通信中有三种类型的帧：

+ 请求帧(Request Frame)
+ 应答帧(Response Frame)
+ 通知帧(Notification Frame)

## 请求帧

请求帧是一个 JSON 对象，包含以下属性：

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `jsonrpc` | _string_ | _2.0_。使用的 jsonrpc 版本。**可省略** |
| `id` | _number 或 string_ | 此请求的标识符，用于匹配应答帧。**必需** |
| `src` | _string_ | 请求来源的名称（你可以选择任意字符串来标识自己作为请求来源）。**必需** |
| `method` | _string_ | 要调用的过程名称。**必需** |
| `params` | _object_ | 方法所需的参数（如有）。**可选** |

示例 1：

调用 Switch.GetConfig 方法的请求帧：

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Switch.GetConfig",
   "params": {
      "id":1
   }
}
```

示例 2：

调用 Switch.Set 方法的请求帧：

```json
{
   "id": 2,
   "src":"user_1",
   "method":"Switch.Set",
   "params": {
     "id":1,
     "on":true
   }
}
```

## 应答帧

应答帧是一个 JSON 对象，包含以下属性：

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `id` | _number 或 string_ | 通信的标识符 |
| `src` | _string_ | 应答来源的名称 |
| `dst` | _string_ | 目标名称（即请求的来源） |
| `result` | _object_ | 调用过程的结果，请求成功时返回。`result` 与 `error` 互斥 |
| `error` | _object_ | 包含所发生错误的描述，请求失败时返回。`result` 与 `error` 互斥。更多错误码参见[通用错误码](ErrorCode) |

示例 1：

请求成功返回结果对象：

```json
{
   "id": 2,
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "result": {}
}
```

示例 2：

请求失败返回错误对象：

```json
{
   "id": 1,
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "error": {
      "code": -100,
      "message": "any error"
   }
}
```

## 通知帧

通知帧是一个 JSON 对象，类似于请求但不期待响应。它包含以下属性：

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `src` | _string_ | 通知来源的名称。**必需** |
| `dst` | _string_ | 目标名称。**必需** |
| `method` | _string_ | 调用的方法。**必需** |
| `params` | _object_ | 通知的参数。**必需** |

示例 1：

状态变化的通知帧：

```json
{
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "method": "NotifyStatus",
   "params": {
      "ts": 1626221112,
      "switch:1": {
         "id": 1,
         "on": true
      }
   }
}
```

示例 2：

事件发生的通知帧：

```json
{
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "method": "NotifyEvent",
   "params": {
      "ts": 1626221112,
      "events": [
         {
            "component": "switch:1",
            "id": 1,
            "event": "config_changed",
            "ts": 1626221112
         }
      ]
   }
}
```
