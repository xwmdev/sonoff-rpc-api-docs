# 通知

Sonoff 组件通过 `NotifyStatus` 和 `NotifyEvent` 两种方法支持两种类型的通知。通知帧的结构在 [RPC 协议](RPCProtocol#通知帧)页面中有详细描述。关于各通道发送通知的更多信息，请参见 [RPC 通道](RPCChannels)页面。

简要说明：

+ 通知无法通过 HTTP 接收；
+ 要通过 WebSocket 接收通知，你必须至少发送一个包含有效 `src` 的请求帧；
+ 要通过 MQTT 接收通知，你必须订阅主题 `<sonoff-id>/events/rpc`。

## NotifyStatus

此方法用于通知组件状态的变化，并携带发生变更的信息。其定义如下：

+ `method`："NotifyStatus"
+ `params`：

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `ts` | _number_ | Unix 时间戳（UTC），单位秒 |
| `<component>` | _object_ | 与组件状态对象结构相同。`<component>` 需替换为组件类型（例如 `cloud`、`wifi`、`mqtt`）。如果有多个该类型组件的实例，`<component>` 将替换为 `组件类型:id`（例如 `switch:1`、`input:1`） |

这些通知的预期用途是将 `NotifyStatus` 的变更叠加到已知的状态之上，其结果应与调用全新的 `GetStatus` 得到的结果一致。

示例 1：

通知 Switch 状态变化：

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

通知 Cloud 组件状态变化：

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

## NotifyEvent

此方法用于通知发生了某个事件，该事件不反映在组件的状态中（例如按钮按下、配置变更等）。其定义如下：

+ `method`："NotifyEvent"
+ `params`：

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `ts` | _number_ | Unix 时间戳（UTC），单位秒 |
| `events` | _array of objects_ | 包含所有发生的事件。每个 JSON 对象描述一个事件，并根据事件类型包含不同的属性 |

`events` 数组中每个 JSON 对象共有以下属性：

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `ts` | _number_ | 事件发生时的 Unix 时间戳（UTC），单位秒 |
| `component` | _string_ | 组件 key（`组件类型[:id]`，例如 `switch:1`、`input:1`、`cloud`） |
| `event` | _string_ | 事件名称 |

部分事件还会包含 `id` 字段，表示具体组件实例。

示例 1：

通知 Input 组件配置已变更：

```json
{
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "method": "NotifyEvent",
   "params": {
      "ts": 1626221112,
      "events": [
         {
            "component": "input:1",
            "id": 1,
            "event": "config_changed",
            "ts": 1626221112
         }
      ]
   }
}
```

### 公共事件通知

以下通知对所有功能组件和系统组件都是通用的。

#### 配置变更（config_changed）

当组件配置发生改变时设备会发出此事件通知。接收端收到配置变更事件后应调用对应组件的 `GetConfig` 获取最新配置。

示例：

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
