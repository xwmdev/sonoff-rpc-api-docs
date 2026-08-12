# Switch
Switch 组件用于管理开关（继电器）的配置与状态。

| Method | Description |
| --- | --- |
| Switch.SetConfig | 配置开关 |
| Switch.GetConfig | 获取开关配置 |
| Switch.Set | 设置开关 |
| Switch.Toggle | 翻转开关 |
| Switch.GetStatus | 获取开关状态 |
| Switch.GetRecords | 获取历史开关操作记录 |




## 方法
Switch 组件支持的方法如下。

### Switch.SetConfig
配置开关，包括通电反应和点动设置。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| id | number | 开关id<br/>取值范围：1 ~ max (不同的产品最大输入输出数量max取值不同) |
| config | object | 开关配置 |


更多关于 `config` 属性的内容，请参阅 `config` 数据结构。

**响应**

响应内容请参考应答帧。



### Switch.GetConfig
获取开关配置。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| id | number | 开关id<br/>取值范围：1 ~ max (不同的产品最大输入输出数量max取值不同) |


**响应**

`Switch.GetConfig` 的响应内容请参阅 `config` 数据结构。



### Switch.Set
设置开关状态（打开或关闭）。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| id | number | 开关id<br/>取值范围：1 ~ max (不同的产品最大输入输出数量max取值不同) |
| on | boolean | 开关状态<br/>true: 打开<br/>false: 关闭 |


**响应**

响应内容请参考应答帧。



### Switch.Toggle
翻转开关状态。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| id | number | 开关id<br/>取值范围：1 ~ max (不同的产品最大输入输出数量max取值不同) |


**响应**

响应内容请参考应答帧。



### Switch.GetStatus
获取开关状态。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| id | number | 开关id<br/>取值范围：1 ~ max (不同的产品最大输入输出数量max取值不同) |


**响应**

| Property | Type | Description |
| --- | --- | --- |
| id | number | 开关id<br/>取值范围：1 ~ max (不同的产品最大输入输出数量max取值不同) |
| on | boolean | 开关状态<br/>true: 打开<br/>false: 关闭 |




### Switch.GetRecords
获取历史开关操作记录。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| offset | number | 起始索引(0 表示从最新的记录开始) |
| count | number | 请求数量，最大值为100<br/>需要分批下载，一般建议一包不大于30 |


**响应**

| Property | Type | Description |
| --- | --- | --- |
| next_offset | number | 下一次请求的起始索引（若已无更多数据，返回total_count） |
| total_count | number | 总的记录数量 |
| records | array of object | 记录数组 |




## 数据结构
Switch 组件相关的数据结构如下。

### config
| Property | Type | Description |
| --- | --- | --- |
| startup | object | 通电反应配置 |
| pulse | object | 点动配置 |


更多关于 `startup` 属性的内容，请参阅 `startup` 数据结构。

更多关于 `pulse` 属性的内容，请参阅 `pulse` 数据结构。



### startup
| Property | Type | Description |
| --- | --- | --- |
| startup | string | on ：上电开，<br/>off： 上电关，<br/>stay：上电保持，恢复断电前的状态<br/>invert ：翻转 （按需实现） |
| enable_delay | boolean | （按需实现）<br/>true：启用延时<br/>false：禁用延时 |
| delay_width | number | （按需实现）<br/>延时执行通电反应<br/>单位 毫秒，仅支持设置取值500毫秒（即0.5秒）的整数倍   取值范围：0 ~ 3599500 毫秒， |




### pulse
| Property | Type | Description |
| --- | --- | --- |
|   enable | boolean | 点动功能开关   true: 启用点动<br/>false: 禁用点动 |
|   on | boolean | 点动结束后开关的状态<br/>true: 打开<br/>false: 关闭 |
|   width | number | 点动时间   单位毫秒，仅支持设置取值500毫秒（即0.5秒）的整数倍   当enable为false 禁用点动时，此值为0。      取值范围：0.5 秒 ~ 23 时 59 分 59.5 秒 |


### 其他数据结构
**records**

| Property | Type | Description |
| --- | --- | --- |
| id | number | 开关id<br/>取值范围：1 ~ max (不同的产品最大输入输出数量max取值不同) |
| on | boolean | 开关状态<br/>true: 打开<br/>false: 关闭 |
| trigger_type | string | 触发源<br/>button: 设备按钮<br/>input： 外接开关<br/>fastgo: fastgo遥控器<br/>timer: 定时器<br/>startup:通电反应<br/>pulse:点动<br/>fastScene:自动断电（快速场景）<br/>Overcurrent protection: 过流保护<br/>Overpower protection: 过载保护<br/>Overvoltage protection: 过压保护<br/>Undervoltage protection: 欠压保护<br/>overheat protection:过热保护<br/>Auto Recovery：自动恢复<br/>eWeLink<br/>Matter<br/>Mqtt<br/>websocket<br/>http |
| ts | number | 操作时间<br/>时间戳，单位ms |




## MQTT Control
启用 MQTT 后，可通过 Topic 控制开关组件。`<topic_root>` 和连接参数请参考 MQTT 文档中的 MQTT Control。

### Topic 与方向
从 MQTT 客户端角度，向命令 Topic **发布**控制载荷，**订阅**状态 Topic 确认设备是否执行成功。

| 方向 | Topic | 载荷或字段 | 作用 |
| --- | --- | --- | --- |
| 订阅 | `<topic_root>/status` | `switch`、`power_on_behavior`、`startup_delay_enable`、`startup_delay_time` | 接收设备保留状态，确认控制结果 |
| 发布 | `<topic_root>/cmd/switch` | `ON`、`OFF`、`true`、`false`、`1` 或 `0` | 打开或关闭设备开关 |
| 发布 | `<topic_root>/cmd/power_on_behavior` | `off`、`on`、`stay` 或 `invert` | 设置设备通电后的开关状态 |
| 发布 | `<topic_root>/cmd/power_on_delay` | `ON`、`OFF`、`true`、`false`、`1` 或 `0` | 启用或禁用通电延时 |
| 发布 | `<topic_root>/cmd/power_on_delay_time` | `0` 到 `3599.5`，单位秒，步进 `0.5` | 设置通电延时时间 |

命令 Topic 不返回独立响应，应以 `<topic_root>/status` 中对应字段的更新作为执行结果。

### 操作步骤
1. 订阅 `<topic_root>/status`，先获取设备当前状态。
2. 向需要控制的命令 Topic 发布载荷。
3. 等待状态 Topic 更新，并检查对应状态字段。

设置通电延时时存在前后关系：先向 `<topic_root>/cmd/power_on_delay` 发布 `ON`，确认 `startup_delay_enable` 为 `true`；再向 `<topic_root>/cmd/power_on_delay_time` 发布时间。延时未启用时，设备会忽略延时时间设置。

### 开关控制示例
先订阅状态，再打开开关：

```bash
mosquitto_sub -h ${MQTT_SERVER} -p ${MQTT_PORT} -v \
  -t "${SONOFF_ID}/status"

mosquitto_pub -h ${MQTT_SERVER} -p ${MQTT_PORT} \
  -t "${SONOFF_ID}/cmd/switch" \
  -m "ON"
```

当状态消息中的 `switch` 变为 `true` 时，表示开关已打开。


## 事件通知
Switch 组件支持的事件通知如下。

### config_changed
Switch 组件配置变更时，设备将发出此事件。



## 状态通知
Switch 组件状态变化时，将触发状态通知。携带数据如下：

| Property | Type | Description |
| --- | --- | --- |
| id | number | 开关id<br/>取值范围：1 ~ max (不同的产品最大输入输出数量max取值不同) |
| on | boolean | 开关状态<br/>true: 打开<br/>false: 关闭 |


## 示例
Switch 组件各方法与事件的示例。

### Switch.SetConfig 示例
**请求**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Switch.SetConfig",
   "params": {
      "id":1,
      "config":{
        "startup": {
          "startup":"stay",
          "enable_delay":false,
          "delay_width":500
        },
        "pulse":{
          "enable":false,
          "on":false,
          "width":5000
        }
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

### Switch.GetConfig 示例
**请求**

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

**响应**

```json
{
  "id": 1,
  "src": "sonoffmini1gsp-acebe61fae74",
  "result": {
      "id":1,
      "config":{
        "startup": {
          "startup":"stay",
          "enable_delay":false,
          "delay_width":500
        },
        "pulse":{
          "enable":false,
          "on":false,
          "width":5000
        }
      }
   }
}
```

### Switch.Set 示例
**请求**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Switch.Set",
   "params": {
      "id":1,
      "on":true
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

### Switch.Toggle 示例
**请求**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Switch.Toggle",
   "params": {
      "id":1
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

### Switch.GetStatus 示例
**请求**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Switch.GetStatus",
   "params": {
      "id":1
   }
}
```

**响应**

```json
{
  "id": 1,
  "src": "sonoffmini1gsp-acebe61fae74",
  "result": {
      "id":1,
      "on":true
  }
}
```



### Switch.GetRecords 示例
**请求**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Switch.GetRecords",
   "params": {
      "offset":0,
      "count":30
   }
}
```

**响应**

```json
{
  "id": 1,
  "src": "sonoffmini1gsp-acebe61fae74",
  "result": {
      "next_offset":1,
      "total_count":50,
      "records":[
        {
          "id":1,
          "on":true,
          "trigger_type":"button",
          "ts":1626221112
        },
        {
          "id":1,
          "on":false,
          "trigger_type":"input",
          "ts":1626331112
        }
      ]
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
            "component": "switch:1",
            "id": 1,
            "event": "config_changed",
            "ts": 1626221112
         }
      ]
   }
}
```

接收端收到配置变更事件后，可调用 `Switch.GetConfig` 获取最新配置。



#### 状态通知 示例
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
