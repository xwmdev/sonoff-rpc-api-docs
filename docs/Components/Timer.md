---
sidebar_position: 10
---

# Timer

Timer 组件用于管理各类定时器的增删改查。

| Method | Description |
| --- | --- |
| Timer.GetStatus | 获取定时器状态 |
| Timer.Update | 更新定时器，包含增加、修改、删除操作 |
| Timer.Query | 查询定时器 |


## 方法
Timer 组件支持的方法如下。

### Timer.GetStatus
获取 Timer 组件基本配置信息，包括定时器最大数量、已启用定时器数量，以及 `Timer.Update` 和 `Timer.Query` 单次请求可处理的最大定时器个数。

**请求**

无。更新或查询定时器前，建议先调用此方法获取定时器数量上限、可启用定时器数量及单次批量操作数量上限。

**响应**

| Property | Type | Description |
| --- | --- | --- |
| max | number | 定时器的最大数量（包括启用和未启用的） |
| enable | number | 允许启用的定时器数量 |
| batch | number | 单次请求可以修改的定时器数量 |
| revision | string | 定时器版本修订号 |


### Timer.Update
更新定时器配置。需要批量更新多个定时器配置且数据量较大时，可分多次调用本方法以完成一次更新。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| timer_list | array of object | 必填。定时器列表，内容为 timer_item |
| end | boolean | true: 最后一次请求<br/>false: 非最后一次请求<br/>如果一次修改的定时器数量超过了设备的 batch 值，那么 请求方需要分多次发送修改请求。如果是最后一次请求，那么请求中必须填写 "end": true。如果非最后一次请求，那么请求中可以填写"end": false，或者不存在该字段。 |


更多关于 `timer_item` 属性的内容，请参阅 `timer_item` 数据结构。

**响应**

| Property | Type | Description |
| --- | --- | --- |
| revision | string | 定时器版本修订号 |


### Timer.Query
查询定时器。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| index | number | 必填。开始查询的定时器序号，范围从 0~最大定时器数量-1 |


**响应**

| Property | Type | Description |
| --- | --- | --- |
| timer_list | array of object | 必填。定时器列表，内容为 timer_item |
| revision | string | 定时器版本修订号 |
| next | number | 接下来需要查询的定时器序号<br/>如果已查询完成所有定时器则为-1 |


更多关于 `timer_item` 属性的内容，请参阅 `timer_item` 数据结构。

## 数据结构
Timer 组件相关的数据结构如下。

### timer_item
各类定时器的数据结构，每种定时器内容的字段略有差异。
1. `index` 为定时器序号，同时修改多个定时器时，必须按序号严格递增排列。
2. `at` 为定时器执行时间，始终代表本地时间（非 UTC），且每种类型的定时器字符串格式可能不同。
3. `do`、`startDo`、`endDo` 字段表示定时器需要执行的动作，格式为：`{"switches":[{"id":num, "switch": str}]}`，其中 `id` 表示需要执行操作的开关序号，从 1 开始计数；`switch` 表示需要执行的操作，可以为 `on` 或 `off`。
4. 删除某个定时器时，可仅包含 `index` 和 `__del` 字段。

#### 单次定时器
| Property | Type | Description |
| --- | --- | --- |
| index | number | 定时器序号，范围从 0~最大定时器数量-1 |
| enable | boolean | 定时器启用状态<br/>true：启用此定时器<br/>false：禁用此定时器 |
| type | string | 定时器类型<br/>固定为"once"，代表单次定时器 |
| at | string | 执行的时间，表示本地时间(非UTC)<br/>格式为：`yyyy-mm-ddThh:mm:ss`<br/>例如："2025-05-22T14:33:00" |
| do | object | 执行的动作<br/>格式例如：{"switches":[{"id":1, "switch": "off"}]} |
| __del | boolean | 决定是否删除该定时器(仅在需要删除时才允许存在)<br/>true: 删除定时器 |


#### 延时定时器
| Property | Type | Description |
| --- | --- | --- |
| index | number | 定时器序号，范围从 0~最大定时器数量-1 |
| enable | boolean | 定时器启用状态<br/>true：启用此定时器<br/>false：禁用此定时器 |
| type | string | 定时器类型<br/>固定为"delay"，代表延时定时器 |
| at | string | 执行的时间，表示的是本地时间(非UTC)<br/>格式为：`yyyy-mm-ddThh:mm:ss`<br/>例如："2025-05-22T14:33:00" |
| period | string | 延时时长，单位分钟<br/>实际延时定时器的执行时间应该以at字段为准<br/>取值范围：1~1440 |
| do | object | 执行的动作<br/>例如：{"switches":[{"id":1, "switch": "off"}]} |
| __del | boolean | 决定是否删除该定时器(仅在需要删除时才允许存在)<br/>true: 删除定时器 |


#### 循环定时器（交替定时）
修改循环交替定时器时，`period`、`end`、`startDo`、`endDo` 字段必须同时存在，且不能与循环重复定时器混淆。
| Property | Type | Description |
| --- | --- | --- |
| index | number | 定时器序号，范围从 0~最大定时器数量-1 |
| enable | boolean | 定时器启用状态<br/>true：启用此定时器<br/>false：禁用此定时器 |
| type | string | 定时器类型<br/>固定为"duration"，代表循环定时器 |
| at | string | 定时器生效时间，表示的是本地时间(非UTC)<br/>格式为：`yyyy-mm-ddThh:mm:ss`<br/>例如："2025-05-22T14:33:00" |
| period | string | 以此周期执行开始动作，单位分钟<br/>取值范围：1~1440 |
| end | string | 周期中第几分钟执行结束动作，单位分钟<br/>取值范围：1~1440 |
| startDo | object | 开始动作<br/>例如：{"switches":[{"id":1, "switch": "off"}]} |
| endDo | object | 结束动作<br/>例如：{"switches":[{"id":1, "switch": "off"}]} |
| __del | boolean | 决定是否删除该定时器(仅在需要删除时才允许存在)<br/>true: 删除定时器 |


#### 循环定时器（重复定时）
修改循环重复定时器时，`interval`、`do` 字段必须同时存在，且不能与循环交替定时器混淆。
| Property | Type | Description |
| --- | --- | --- |
| index | number | 定时器序号，范围从 0~最大定时器数量-1 |
| enable | boolean | 定时器启用状态<br/>true：启用此定时器<br/>false：禁用此定时器 |
| type | string | 定时器类型<br/>固定为"duration"，代表循环定时器 |
| at | string | 开始执行的时间，表示的是本地时间(非UTC)<br/>格式为：`yyyy-mm-ddThh:mm:ss`<br/>例如："2025-05-22T14:33:00" |
| interval | string | 以此间隔重复执行动作，单位分钟<br/>取值范围：1~1440 |
| do | object | 执行动作<br/>例如：{"switches":[{"id":1, "switch": "off"}]} |
| __del | boolean | 决定是否删除该定时器(仅在需要删除时才允许存在)<br/>true: 删除定时器 |


#### 重复定时器
| Property | Type | Description |
| --- | --- | --- |
| index | number | 定时器序号，范围从 0~最大定时器数量-1 |
| enable | boolean | 定时器启用状态<br/>true：启用此定时器<br/>false：禁用此定时器 |
| type | string | 定时器类型<br/>固定为"repeat"，代表重复定时器 |
| at | string | 执行的时间，cron表达式(非标准实现)<br/>格式为：`分 时 * * 星期`<br/>1. 分钟和小时最多支持一个前导零<br/>2. 分钟取值范围[0,59]<br/>3. 小时取值范围[0,23]<br/>4. 星期格式为`0,1,2,3,4,5,6`，其中0表示周日<br/>例如：<br/>"30 15 * * 0,1,2,3,4,5,6"，表示每周一到周日的15:30执行该定时器动作<br/>"01 09 * * 0,3,4,6"，表示每周三、周四、周六、周日的09:01执行该定时器动作 |
| do | object | 执行的动作<br/>例如：{"switches":[{"id":1, "switch": "off"}]} |
| __del | boolean | 决定是否删除该定时器(仅在需要删除时才允许存在)<br/>true: 删除定时器 |


#### 随机定时器（单次定时）
| Property | Type | Description |
| --- | --- | --- |
| index | number | 定时器序号，范围从 0~最大定时器数量-1 |
| enable | boolean | 定时器启用状态<br/>true：启用此定时器<br/>false：禁用此定时器 |
| type | string | 定时器类型<br/>固定为"random"，代表随机定时器 |
| iterate | string | 定时器子类型<br/>固定为"once" |
| once.startAt | string | 每天定时器生效时间，表示的是本地时间<br/>格式为：`yyyy-mm-ddThh:mm:ss`<br/>例如："2025-05-22T14:33:00" |
| once.endAt | string | 每天定时器失效时间，表示的是本地时间<br/>格式为：`yyyy-mm-ddThh:mm:ss`<br/>例如："2025-05-22T15:33:00" |
| period | string | 持续开始动作的时间，单位为分钟<br/>1. 最短不能小于10分钟，最长不能超过生效时长<br/>2. 定时器的执行时间会在生效时间段内随机生成 |
| startDo | object | 开始动作<br/>例如：{"switches":[{"id":1, "switch": "on"}]} |
| endDo | object | 结束动作<br/>例如：{"switches":[{"id":1, "switch": "off"}]} |
| __del | boolean | 决定是否删除该定时器(仅在需要删除时才允许存在)<br/>true: 删除定时器 |


#### 随机定时器（重复定时）
| Property | Type | Description |
| --- | --- | --- |
| index | number | 定时器序号，范围从 0~最大定时器数量-1 |
| enable | boolean | 定时器启用状态<br/>true：启用此定时器<br/>false：禁用此定时器 |
| type | string | 定时器类型<br/>固定为"random"，代表随机定时器 |
| iterate | string | 定时器子类型<br/>固定为"week" |
| week.date | string | 每周定时器生效时间<br/>格式为：`0,1,2,3,4,5,6`，其中0表示周日<br/>例如："0,1,3,4,6"，表示每周一、周三、周四、周六、周日执行该定时器 |
| week.startAt | string | 每天定时器生效时间，表示的是本地时间<br/>格式为：`hh:mm`<br/>例如："14:33" |
| week.endAt | string | 每天定时器失效时间，表示的是本地时间<br/>格式为：`hh:mm`<br/>例如："15:33" |
| period | string | 持续开始动作的时间，单位为分钟<br/>1. 最短不能小于10分钟，最长不能超过生效时长<br/>2. 定时器的执行时间会在生效时间段内随机生成 |
| startDo | object | 开始动作<br/>例如：{"switches":[{"id":1, "switch": "on"}]} |
| endDo | object | 结束动作<br/>例如：{"switches":[{"id":1, "switch": "off"}]} |
| __del | boolean | 决定是否删除该定时器(仅在需要删除时才允许存在)<br/>true: 删除定时器 |


## 事件通知
Timer 组件支持的事件通知如下。

### revision_update
使用 `Timer.Update` 修改任一定时器，或单次定时器执行完毕后，都会发出此事件。携带的数据内容如下：

| Property | Type | Description |
| --- | --- | --- |
| revision | string | 定时器版本修订号 |


## 示例
Timer 组件各方法与事件的示例。

### Timer.GetStatus 示例
**请求**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Timer.GetStatus",
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
      "max": 24,
      "enable": 24,
      "batch": 3,
      "revision": "1234567890"
   }
}
```

### Timer.Update 示例
请求模板，仅作为批量修改定时器的示例，其中包含省略符号 `...` 以及注释说明 `\\`，不能直接作为请求内容：

```json
{
   "jsonrpc":"2.0",
   "id": 2,
   "src":"user_1",
   "method":"Timer.Update",
   "params": {
      "timer_list": [
        {"index":0, ...},                 //增加或修改定时器
        {"index":1, ...},                 //增加或修改定时器，序号可以不连续，但必须递增
        {"index":3,"__del": true}  	      //删除定时器
      ],
      "end": true                         //如果是最后更新一次才有该字段
   }
}
```

**响应**

```json
{
   "id": 2,
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "result": {
     "revision": "1234567890"
   }
}
```

#### 修改单次定时器 示例
```json
{
   "jsonrpc":"2.0",
   "id": 100,
   "src":"user_1",
   "method":"Timer.Update",
   "params": {
      "timer_list": [
         {
            "index": 0,
            "enable": true,
            "type": "once",
            "at": "2026-03-26T20:30:00",
            "do": {
               "switches": [
                  { "id": 1, "switch": "on" }
               ]
            }
         }
      ],
      "end": true
   }
}
```

#### 修改延时定时器 示例
```json
{
   "jsonrpc":"2.0",
   "id": 101,
   "src":"user_1",
   "method":"Timer.Update",
   "params": {
      "timer_list": [
         {
            "index": 2,
            "enable": true,
            "type": "delay",
            "at": "2026-03-25T22:00:00",
            "period": "15",
            "do": {
               "switches": [
                  { "id": 1, "switch": "off" }
               ]
            }
         }
      ],
      "end": true
   }
}
```

#### 修改循环定时器（交替） 示例
```json
{
   "jsonrpc": "2.0",
   "id": 102,
   "src": "user_1",
   "method": "Timer.Update",
   "params": {
      "timer_list": [
         {
            "index": 3,
            "enable": true,
            "type": "duration",
            "at": "2026-03-26T08:00:00",
            "period": "120",
            "end": "30",
            "startDo": {
               "switches": [
                  { "id": 1, "switch": "on" }
               ]
            },
            "endDo": {
               "switches": [
                  { "id": 1, "switch": "off" }
               ]
            }
         }
      ],
      "end": true
   }
}
```

#### 修改循环定时器（重复） 示例
```json
{
   "jsonrpc": "2.0",
   "id": 103,
   "src": "user_1",
   "method": "Timer.Update",
   "params": {
      "timer_list": [
         {
            "index": 4,
            "enable": true,
            "type": "duration",
            "at": "2026-03-26T09:00:00",
            "interval": "45",
            "do": {
               "switches": [
                  { "id": 1, "switch": "on" }
               ]
            }
         }
      ],
      "end": true
   }
}
```

#### 修改重复定时器 示例
```json
{
   "jsonrpc":"2.0",
   "id": 104,
   "src":"user_1",
   "method":"Timer.Update",
   "params": {
      "timer_list": [
         {
            "index": 1,
            "enable": true,
            "type": "repeat",
            "at": "30 18 * * 1,2,3,4,5",
            "do": {
               "switches": [
                  { "id": 1, "switch": "off" }
               ]
            }
         }
      ],
      "end": true
   }
}
```

#### 修改随机定时器（单次） 示例
```json
{
   "jsonrpc": "2.0",
   "id": 105,
   "src": "user_1",
   "method": "Timer.Update",
   "params": {
      "timer_list": [
         {
            "index": 5,
            "enable": true,
            "type": "random",
            "iterate": "once",
            "once": {
               "startAt": "2026-03-27T19:00:00",
               "endAt": "2026-03-27T21:00:00"
            },
            "period": "20",
            "startDo": {
               "switches": [
                  { "id": 1, "switch": "on" }
               ]
            },
            "endDo": {
               "switches": [
                  { "id": 1, "switch": "off" }
               ]
            }
         }
      ],
      "end": true
   }
}
```

#### 修改随机定时器（重复） 示例
```json
{
   "jsonrpc": "2.0",
   "id": 106,
   "src": "user_1",
   "method": "Timer.Update",
   "params": {
      "timer_list": [
         {
            "index": 6,
            "enable": true,
            "type": "random",
            "iterate": "week",
            "week": {
               "date": "1,2,3,4,5",
               "startAt": "18:30",
               "endAt": "23:00"
            },
            "period": "25",
            "startDo": {
               "switches": [
                  { "id": 1, "switch": "on" }
               ]
            },
            "endDo": {
               "switches": [
                  { "id": 1, "switch": "off" }
               ]
            }
         }
      ],
      "end": true
   }
}
```

#### 删除定时器 示例
```json
{
   "jsonrpc": "2.0",
   "id": 107,
   "src": "user_1",
   "method": "Timer.Update",
   "params": {
      "timer_list": [
         {
            "index": 1,
            "__del": true
         }
      ],
      "end": true
   }
}
```

### Timer.Query 示例
从序号 0 开始依次查询，请求：

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Timer.Query",
   "params": {
      "index": 0
   }
}
```

当所有定时器已经查询完成时，`next` 字段的数值为 `-1`，否则为下次需要查询的定时器序号。

**响应**

```json
{
   "id": 1,
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "result": {
      "timer_list": [
        {"index":0, ...},
        {"index":1, ...},
        {"index":3, ...}
      ],
      "revision": "1234567890",
      "next": 4
   }
}
```

### 通知示例
#### revision_update 示例
```json
{
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "method": "NotifyEvent",
   "params": {
      "ts": 1234567890,
      "events": [
         {
            "component": "timer",
            "event": "revision_update",
            "ts": 1234567890,
            "revision": "1234567890"
         }
      ]
   }
}
```

