# System

System 组件提供设备运行状态查询、时间与时区配置、设备重启和恢复出厂设置等功能。

| Method | Description |
| --- | --- |
| System.GetStatus | 获取设备当前的所有运行时状态 |
| System.GetConfig | 获取系统的配置参数 |
| System.SetConfig | 更新系统配置 |
| System.SetTime | 设置系统时间 |
| System.SetTimeZone | 设置时区 |
| System.GetTimeZone | 获取时区信息 |
| System.Control | 系统控制 |




## 方法
System 组件支持的方法如下。

### System.GetStatus
获取设备当前的所有运行时状态。

**请求**

无。

**响应**

| Property | Type | Description |
| --- | --- | --- |
| reboot_reason | string | 重启原因（仅针对电池供电设备）。可选值：`poweron`、`software_restart`、`deepsleep_wake`、`internal`、`unknown` |
| time | string | 当前时间，为设备的本地时间。格式：`YYYY/MM/DD HH:MM:SS` |
| unixtime | number | Unix时间戳（UTC），当时间未从NTP服务器同步时或未设置时为null |
| timezone_info | object | 时区相关的信息。详见timezone_info |
| last_sync_ts | number | 上次系统从NTP服务器同步的时间（UTC），当未从NTP服务器同步时间时为null |
| uptime | number | 自上次重新启动以来的时间（秒） |
| flash_size | number | Flash大小，单位MB |
| app_size | number | 固件分区大小，单位KB |
| app_free | number | 固件分区剩余空间，单位KB |
| ram_size | number | 系统RAM大小，单位Byte |
| ram_free | number | 系统RAM剩余大小，单位Byte |
| ram_min_free | number | 历史中内存剩余最少值，单位Byte |
| ram_largest_block | number | 剩余最大连续块大小，单位Byte |


### System.GetConfig
获取系统的配置参数。

**请求**

无。

**响应**

| Property | Type | Description |
| --- | --- | --- |
| config | object | 系统配置对象。详见config |


### System.SetConfig
更新系统配置。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| config | object | 系统配置对象。详见config |


**响应**

响应内容请参考应答帧。

### System.SetTime
设置系统时间。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| unixtime | number | Unix时间戳（UTC），设置为当前时间，单位为秒 |


**响应**

响应内容请参考应答帧。

注意：如果设备从 NTP 获取时间，该设置将被覆盖。

### System.SetTimeZone
设置时区。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| timezone_id | string | 时区字符串，例如 `Asia/Shanghai` |
| timezone_offset | number or null | 时区偏移量，单位分钟，值为正负整数，取值范围为 [-720, 840]。当该字段为 null 时，由设备根据 timezone_id 从网络中查询实际时区信息。 |


**响应**

响应内容请参考应答帧。

### System.GetTimeZone
获取时区信息。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| timezone_id | string | 时区字符串，例如 `Asia/Shanghai`，当需要设备自动检测时，使用空字符串 |


**响应**

`System.GetTimeZone` 的响应内容请参阅 `timezone_info` 数据结构。

### System.Control
系统控制。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| action | string | 控制动作。可选值：`reboot`（系统重启）、`factory_reset`（恢复出厂配置） |


**响应**

响应内容请参考应答帧。



## 数据结构
System 组件相关的数据结构如下。

### config
| Property | Type | Description |
| --- | --- | --- |
| sntp | object | 配置NTP服务器地址。详见sntp |
| debug | object | 配置debug日志功能。详见debug |
| domain | string | mDNS域名（其中.local在web前端固定不要用户输入），最大长度为60个字符。 |




**sntp**

| Property | Type | Description |
| --- | --- | --- |
| server1 | string | 主NTP服务器地址，最大长度为63个字符。 |
| server2 | string | 从NTP服务器地址，最大长度为63个字符。 |




**debug**

| Property | Type | Description |
| --- | --- | --- |
| websocket_enable | boolean | Debug日志开关。`true`：启用通过WebSocket输出debug日志，`false`：禁用 |


### timezone_info
| Property | Type | Description |
| --- | --- | --- |
| id | string | 时区ID。例如`Asia/Chongqing` |
| utc | string | 服务器当前时间，UTC标准时间，ISO8601格式 |
| dst | number | 当前是否处于夏令时。`0`：所在时区没有夏令时，`1`：处于夏令时，`2`：不处于夏令时 |
| offset | number | 当前的时间偏移量，单位分钟，值为正负整数，包含了时区偏移量和夏令时的偏移量，取值范围：−840 到 +840 |
| nextDst | string | 夏令时切换的时间，标准时间。如果dst=0则没有该字段 |
| nextOffset | number | 夏令时切换后的时间偏移量，单位分钟，值为正负整数。如果dst=0则没有该字段，取值范围：-840 到 +720 |


## MQTT Control
启用 MQTT 后，可通过 Topic 重启设备。`<topic_root>` 和连接参数请参考 MQTT 文档中的 MQTT Control。

### Topic 与方向
| 方向 | Topic | 载荷 | 作用 |
| --- | --- | --- | --- |
| 订阅 | `<topic_root>/online` | `online` 或 `offline` | 观察设备 MQTT 在线状态和重启后的重新上线 |
| 发布 | `<topic_root>/cmd/reboot` | `PRESS` | 立即重启设备 |

重启命令没有独立响应。客户端必须在发送命令前订阅在线状态，否则可能错过设备离线过程。`<topic_root>/online` 是保留 Topic，`offline` 同时作为 MQTT 遗嘱载荷使用。

### 操作步骤
1. 订阅 `<topic_root>/online`，确认当前载荷为 `online`。
2. 向 `<topic_root>/cmd/reboot` 发布 `PRESS`。
3. 等待设备断开连接，在线状态变为 `offline`。
4. 等待设备完成重启并重新连接 Broker，在线状态恢复为 `online`。

重启会中断设备当前连接和正在执行的业务，请谨慎使用。

### 重启示例

```bash
mosquitto_sub -h ${MQTT_SERVER} -p ${MQTT_PORT} -v \
  -t "${SONOFF_ID}/online"

mosquitto_pub -h ${MQTT_SERVER} -p ${MQTT_PORT} \
  -t "${SONOFF_ID}/cmd/reboot" \
  -m "PRESS"
```


## 示例
System 组件各方法的示例。

### System.GetStatus 示例
**请求**

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "src": "user_1",
  "method": "System.GetStatus",
  "params": {}
}
```

**响应**

```json
{
  "id": 4,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {
    "reboot_reason": "poweron",
    "time": "2026/04/20 11:42:46",
    "unixtime": 1776656566,
    "last_sync_ts": null,
    "uptime": 1011,
    "flash_size": 8,
    "app_size": 3392,
    "app_free": 0,
    "ram_size": 327680,
    "ram_free": 69608,
    "timezone_info": {
      "id": "Asia/Shanghai",
      "utc": "2026-04-20T03:42:46.000Z",
      "dst": 0,
      "offset": 480
    }
  }
}
```



### System.GetConfig 示例
**请求**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "src": "user_1",
  "method": "System.GetConfig",
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
    "config": {
        "sntp": {
          "server1": "0.pool.ntp.org",
          "server2": "1.pool.ntp.org"
        },
        "debug": {
          "websocket_enable": false
        },
        "domain": "sonoff-mini1gsp"
      }
  }
}
```



### System.SetConfig 示例
**请求**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "src": "user_1",
  "method": "System.SetConfig",
  "params": {
    "config": {
      "sntp": {
        "server1": "0.pool.ntp.org",
        "server2": "1.pool.ntp.org"
      },
      "debug": {
        "websocket_enable": true
      },
      "domain": "sonoff-mini1gsp"
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



### System.SetTime 示例
**请求**

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "src": "user_1",
  "method": "System.SetTime",
  "params": {
    "unixtime": 1776656566
  }
}
```

**响应**

```json
{
  "id": 3,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {}
}
```



### System.SetTimeZone 示例
**请求**

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "src": "user_1",
  "method": "System.SetTimeZone",
  "params": {
    "timezone_id": "Asia/Shanghai"
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

### System.GetTimeZone 示例
**请求**

```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "src": "user_1",
  "method": "System.GetTimeZone",
  "params": {
    "timezone_id": "Asia/Shanghai"
  }
}
```

**响应**

```json
{
  "id": 6,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {
      "id": "Asia/Shanghai",
      "utc": "2026-04-20T03:42:46.000Z",
      "dst": 0,
      "offset": 480
  }
}
```



### System.Control 示例
**请求**

系统重启：

```json
{
  "jsonrpc": "2.0",
  "id": 7,
  "src": "user_1",
  "method": "System.Control",
  "params": {
    "action": "reboot"
  }
}
```

**请求**

恢复出厂配置：

```json
{
  "jsonrpc": "2.0",
  "id": 8,
  "src": "user_1",
  "method": "System.Control",
  "params": {
    "action": "factory_reset"
  }
}
```

**响应**

```json
{
  "id": 7,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {}
}
```
