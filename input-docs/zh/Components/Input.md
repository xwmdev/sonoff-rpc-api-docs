# Input

Input 组件用于配置外接开关，以适配自锁开关、瞬态开关等不同类型的外接开关。

可启用继电器分离功能。启用后，外接开关不再直接控制设备内置继电器，而是作为场景触发条件，用于控制其他设备或触发特定场景。

| Method | Description |
| --- | --- |
| Input.SetConfig | 设置外接开关 |
| Input.GetConfig | 获取外接开关配置 |




## 方法
Input 组件支持的方法如下。

### Input.SetConfig
**请求**

| Property | Type | Description |
| --- | --- | --- |
| id | number | 输入通道id<br/>取值范围：1 ~ max (不同的产品最大输入通道数量max取值不同) |
| config | object | 输入通道配置 |


更多关于 `config` 属性的内容，请参阅 `config` 数据结构。

**响应**

响应内容请参考应答帧。



### Input.GetConfig
**请求**

| Property | Type | Description |
| --- | --- | --- |
| id | number | 输入通道id<br/>取值范围：1 ~ max (不同的产品最大输入通道数量max取值不同) |


**响应**

`Input.GetConfig` 的响应内容请参阅 `config` 数据结构。



## 数据结构
Input 组件相关的数据结构如下。

### config
| Property | Type | Description |
| --- | --- | --- |
| external_switch_mode | string | 外接开关模式<br/>取值范围：<br/>"edge"  边缘模式，可外接自锁开关、单刀双掷开关，常用于接灯具双控开关。触发时翻转继电器状态。<br/><br/>"pulse"  脉冲模式，可外接瞬时开关、回弹开关，常用于门禁开关。触发时翻转继电器状态。启用继电器分离后在脉冲模式下支持单击、双击、长按操作。禁用继电器分离后则只有单击操作。<br/>   "follow" 跟随模式，可外接自锁开关、传统机械开关，或干节点信号传感器。触发时，继电器跟随外接开关状态。 |
| reverse | boolean | 只有在"follow" 跟随模式下此字段才必须存在。   true：启用反转，跟随模式下，继电器与外接开关状态相反。<br/>false：禁用反转，跟随模式下，继电器跟随外接开关状态。 |
| relay_separate | boolean | 继电器分离配置<br/>true：启用分离<br/>设备继电器和设备外接开关分离，外接开关操作不再控制设备继电器。   <br/>false：禁用分离<br/>外接开关操作可控制设备继电器开和关。 |




## MQTT Control
启用 MQTT 后，可通过命令 Topic 配置外接开关，并通过事件 Topic 接收外接开关操作。`<topic_root>` 和连接参数请参考 MQTT 文档中的 MQTT Control。

### Topic 与方向
| 方向 | Topic | 载荷或字段 | 作用 |
| --- | --- | --- | --- |
| 订阅 | `<topic_root>/status` | `switch_mode`、`relay_separation` | 接收设备保留状态，确认配置结果 |
| 订阅 | `<topic_root>/event/external_switch` | `{"event_type":"<type>"}` | 接收外接开关触发事件 |
| 发布 | `<topic_root>/cmd/switch_mode` | `edge`、`follow`、`follow reverse` 或 `pulse` | 设置外接开关模式；`follow reverse` 表示反向跟随 |
| 发布 | `<topic_root>/cmd/relay_separation` | `ON`、`OFF`、`true`、`false`、`1` 或 `0` | 启用或禁用继电器分离 |

`event_type` 可为 `Single Click`、`Double Click`、`Long Press`、`On` 或 `Off`。事件 Topic 用于设备向 MQTT 客户端发布操作事件，客户端不应向该 Topic 发布控制载荷。

### 操作步骤
1. 订阅 `<topic_root>/status` 和 `<topic_root>/event/external_switch`。
2. 向 `<topic_root>/cmd/switch_mode` 发布目标模式。
3. 如需让外接开关只作为事件输入而不直接控制继电器，向 `<topic_root>/cmd/relay_separation` 发布 `ON`。
4. 从状态 Topic 确认 `switch_mode` 和 `relay_separation` 已更新。
5. 操作设备的外接开关，从事件 Topic 接收对应的 `event_type`。

脉冲模式下，启用继电器分离后支持 `Single Click`、`Double Click` 和 `Long Press`；未启用继电器分离时仅产生单击操作。

### 配置和事件订阅示例
先订阅状态与事件，再设置外接开关为脉冲模式：

```bash
mosquitto_sub -h ${MQTT_SERVER} -p ${MQTT_PORT} -v \
  -t "${SONOFF_ID}/status" \
  -t "${SONOFF_ID}/event/external_switch"

mosquitto_pub -h ${MQTT_SERVER} -p ${MQTT_PORT} \
  -t "${SONOFF_ID}/cmd/switch_mode" \
  -m "pulse"
```

状态消息中的 `switch_mode` 变为 `pulse` 表示配置成功；随后操作外接开关可在事件 Topic 收到事件消息。


## 事件通知
Input 组件支持的事件通知如下。

### config_changed
外接开关配置变更时，设备将发出此事件。

## 示例
Input 组件各方法与事件的示例。

### Input.SetConfig 示例
**请求**

```json
{
  "jsonrpc":"2.0",
  "id": 1,
  "src":"user_1",
  "method":"Input.SetConfig",
  "params": {
    "id": 1,
    "config": {
      "external_switch_mode":"edge",
      "relay_separate":true
    }
  }
}
```

**响应**

```json
{
  "id": 1,
  "src": "sonoffmini1gsp-acebe61fae74",
  "result": {
  }
}
```



### Input.GetConfig 示例
**请求**

```json
{
  "jsonrpc":"2.0",
  "id": 1,
  "src":"user_1",
  "method":"Input.GetConfig",
  "params": {
    "id": 1
  }
}
```

**响应**

```json
{
  "id": 1,
  "src": "sonoffmini1gsp-acebe61fae74",
  "result": {
    "id": 1,
    "config": {
      "external_switch_mode":"edge",
      "relay_separate":true
    }
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
            "component": "input:1",
            "id": 1,
            "event": "config_changed",
            "ts": 1626221112
         }
      ]
   }
}
```

接收端收到配置变更事件后，可调用 `Input.GetConfig` 获取最新配置。
