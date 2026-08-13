# Meter

Meter 组件用于电量管理，支持配置更新与查询、实时电参数查询和电量历史数据获取。

| Method | Description |
| --- | --- |
| Meter.SetConfig | 更新组件配置 |
| Meter.GetConfig | 获取组件配置 |
| Meter.GetStatus | 获取组件状态 |
| Meter.ResetCounters | 复位计数器（清除设备的电量数据和电费，包含历史数据） |
| Meter.GetRecords | 获取历史数据记录（按小时、天、月单元获取） |
| Meter.Download | 批量下载用电量历史数据 |




## 方法
Meter 组件支持的方法如下。

### Meter.SetConfig
更新电量计配置，包括反向计量显示和电价信息。



**请求**

| Property | Type | Description |
| --- | --- | --- |
| id | number | 组件实例ID |
| config | object | 配置参数对象。详见config数据结构 |


**响应**

响应内容请参考应答帧。

### Meter.GetConfig
获取电量计配置。



**请求**

| Property | Type | Description |
| --- | --- | --- |
| id | number | 组件实例ID |


**响应**

| Property | Type | Description |
| --- | --- | --- |
| id | number | 组件实例ID |
| config | object | 配置参数对象。详见config数据结构 |


### Meter.GetStatus
获取实时电参数与累计用电数据。



**请求**

| Property | Type | Description |
| --- | --- | --- |
| id | number | 组件实例ID |




**响应**

响应内容为 `status` 数据结构的展开内容，如下所示：

| Property | Type | Description |
| --- | --- | --- |
| id | number | 组件实例ID |
| voltage | number | 上次测量的电压，单位V（伏特），精度0.01，真实数值*100 |
| current | number | 上次测量的电流，单位A（安培），精度0.01，真实数值*100 |
| power | number | 上次测量的瞬时有功功率，单位W（瓦），精度0.01，真实数值*100 |
| freq | number | 上次测量的电网频率，精度0.01，真实数值*100，单位Hz |
| total_energy | number | 累计正向用电量，单位0.01kWh |
| total_supply | number | 累计供电量，单位0.01kWh |
| day_energy | number | 当日正向用电量，单位0.01kWh |
| day_supply | number | 当日供电量，单位0.01kWh |
| day_cost | number | 当日电费，单位0.01（按配置货币的最小单位，例如0.01元/0.01美元） |
| day_run_time_sec | number | 当日运行时长，单位秒 |
| month_energy | number | 当月正向用电量，单位0.01kWh |
| month_supply | number | 当月供电量，单位0.01kWh |
| month_cost | number | 当月电费，单位0.01（按配置货币的最小单位，例如0.01元/0.01美元） |
| total_run_time_sec | number | 总运行时长，单位秒 |


### Meter.ResetCounters
复位计数器，清除电量、电费及历史数据。



**请求**

| Property | Type | Description |
| --- | --- | --- |
| id | number | 组件实例ID |




**响应**

响应内容请参考应答帧。

### Meter.GetRecords
获取历史数据记录（按小时、天、月维度获取）。



**请求**

| Property | Type | Description |
| --- | --- | --- |
| id | number | 组件实例ID |
| type | string | 记录类型。可选值：`hour`（小时维度）、`day`（天维度）、`month`（月维度） |
| start_time | string | 开始日期。格式：`YYYY-MM-DD`（年-月-日）。<br/>- 当 `type` 为 `hour` 时，仅以 `start_time` 为准，返回该天的小时级用电量；<br/>- 当 `type` 为 `month` 时，会忽略日期中的天部分 |
| end_time | string | 结束日期。格式：`YYYY-MM-DD`（年-月-日）。<br/>- 当 `type` 为 `hour` 时，仅以 `start_time` 为准，返回该天的小时级用电量；<br/>- 当 `type` 为 `month` 时，会忽略日期中的天部分 |




**响应**

| Property | Type | Description |
| --- | --- | --- |
| id | number | 组件实例ID |
| records | array of object | 单位历史数据数组。详见records数据结构 |


### Meter.Download
批量下载用电量历史数据。



**请求**

| Property | Type | Description |
| --- | --- | --- |
| id | number | 组件实例ID |
| type | number | 下载类型。`0`：按小时单位下载，`1`：按天单位下载 |
| offset | number | 起始索引（0表示从最新的记录开始） |
| count | number | 请求数量，历史数据需要分包下载，最大一包不大于32 |




**响应**

| Property | Type | Description |
| --- | --- | --- |
| id | number | 组件实例ID |
| next_offset | number | 下一次请求的起始索引（若已无更多数据，返回total_count） |
| total_count | number | 总的历史数据数量 |
| entries | array of array | 记录数组，每项为`[energy_unit, supply_unit, cost_cent]` |




## 数据结构
Meter 组件相关的数据结构如下。

### config
| Property | Type | Description |
| --- | --- | --- |
| id | number | 组件实例ID |
| reversed | boolean | 反向计量数据显示开关。`true`：开启，`false`：关闭。默认关闭 |
| price_info | object | 电价配置。详见price_info数据结构 |




**price_info**

| Property | Type | Description |
| --- | --- | --- |
| effective_time | string | 生效日期。格式：`YYYY-MM-DD`（年-月-日），当天零点生效。可设置从当前日期往前30天和往后30天 |
| normal_price | number | 基础电价，单位0.01 |
| use_weekend | boolean | 是否区分周末。`true`：区分，`false`：不区分 |
| workday_slots | array of object | 工作日配置，允许最多设置5个段。详见time_slot |
| weekend_slots | array of object | 周末配置，允许最多设置5个段。详见time_slot |




**time_slot**

| Property | Type | Description |
| --- | --- | --- |
| start | number | 开始时间（几点） |
| end | number | 结束时间（几点） |
| price | number | 电价，单位0.01 |




### status
| Property | Type | Description |
| --- | --- | --- |
| id | number | 组件实例ID |
| voltage | number | 上次测量的电压，单位V（伏特），精度0.01，真实数值*100 |
| current | number | 上次测量的电流，单位A（安培），精度0.01，真实数值*100 |
| power | number | 上次测量的瞬时有功功率，单位W（瓦），精度0.01，真实数值*100 |
| freq | number | 上次测量的电网频率，精度0.01，真实数值*100 |
| total_energy | number | 累计正向用电量，单位0.01kWh |
| total_supply | number | 累计供电量，单位0.01kWh |
| day_energy | number | 当日正向用电量，单位0.01kWh |
| day_supply | number | 当日供电量，单位0.01kWh |
| day_cost | number | 当日电费，单位0.01（按配置货币的最小单位，例如0.01元/0.01美元） |
| day_run_time_sec | number | 当日运行时长，单位秒 |
| month_energy | number | 当月正向用电量，单位0.01kWh |
| month_supply | number | 当月供电量，单位0.01kWh |
| month_cost | number | 当月电费，单位0.01（按配置货币的最小单位，例如0.01元/0.01美元） |
| total_run_time_sec | number | 总运行时长，单位秒 |




### records
| Property | Type | Description |
| --- | --- | --- |
| energy_unit | number | 单位用电量，单位0.01kWh |
| supply_unit | number | 单位供电量，单位0.01kWh |
| cost_cent | number | 电费，单位0.01（按配置货币的最小单位，例如0.01元/0.01美元） |




## 状态通知
设备电量状态变化时，将触发状态通知。携带数据如下：

| Property | Type | Description |
| --- | --- | --- |
| status | object | 详见下面status描述 |


## 示例
Meter 组件各方法及状态通知的示例。

### Meter.SetConfig 示例
**请求**

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "src": "user_1",
  "method": "Meter.SetConfig",
  "params": {
    "id": 1,
    "config": {
      "price_info": {
        "effective_time": "2025-04-10",
        "normal_price": 55,
        "use_weekend": false,
        "workday_slots": []
      }
    }
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

### Meter.GetConfig 示例
**请求**

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "src": "user_1",
  "method": "Meter.GetConfig",
  "params": {
    "id": 1
  }
}
```

**响应**

```json
{
  "id": 5,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {
    "id": 1,
    "config": {
      "reversed": true,
      "price_info": {
        "effective_time": "2026-03-01",
        "normal_price": 55,
        "use_weekend": true,
        "workday_slots": [
          { "start": 0, "end": 18, "price": 100 },
          { "start": 18, "end": 24, "price": 50 }
        ],
        "weekend_slots": [
          { "start": 0, "end": 24, "price": 60 }
        ]
      }
    }
  }
}
```

### Meter.GetStatus 示例
**请求**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "src": "user_1",
  "method": "Meter.GetStatus",
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
  "dst": "user_1",
  "result": {
    "id": 1,
    "voltage": 22000,
    "current": 5000,
    "power": 1100000,
    "freq": 5000,
    "total_energy": 12345,
    "total_supply": 0,
    "day_energy": 120,
    "day_supply": 0,
    "day_cost": 60,
    "day_run_time_sec": 43200,
    "month_energy": 3500,
    "month_supply": 0,
    "month_cost": 1600,
    "total_run_time_sec": 864000
  }
}
```

### Meter.ResetCounters 示例
**请求**

```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "src": "user_1",
  "method": "Meter.ResetCounters",
  "params": {
    "id": 1
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

### Meter.GetRecords 示例
**请求**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "src": "user_1",
  "method": "Meter.GetRecords",
  "params": {
    "id": 1,
    "type": "hour",
    "start_time": "2025-12-01",
    "end_time": "2025-12-01"
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
    "id": 1,
    "records": [
      { "energy_unit": 3, "supply_unit": 0, "cost_cent": 2 },
      { "energy_unit": 4, "supply_unit": 0, "cost_cent": 3 }
    ]
  }
}
```

### Meter.Download 示例
**请求**

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "src": "user_1",
  "method": "Meter.Download",
  "params": {
    "id": 1,
    "type": 1,
    "offset": 0,
    "count": 2
  }
}
```

**响应**

```json
{
  "id": 3,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {
    "id": 1,
    "next_offset": 2,
    "total_count": 5000,
    "entries": [
      [10, 0, 5],
      [12, 0, 6]
    ]
  }
}
```

### 通知示例
#### 状态通知 示例
当电量状态发生变化时，设备会发送如下通知：

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "method": "NotifyStatus",
  "params": {
    "ts": 1776657162,
    "meter": {
      "status": {
        "id": 1,
        "voltage": 21972,
        "current": 7,
        "power": 828,
        "freq": 4988,
        "total_energy": 0,
        "total_supply": 0,
        "day_energy": 0,
        "day_supply": 0,
        "day_cost": 0,
        "month_energy": 0,
        "month_supply": 0,
        "month_cost": 0,
        "day_run_time_sec": 148,
        "total_run_time_sec": 1911
      }
    }
  }
}
```

