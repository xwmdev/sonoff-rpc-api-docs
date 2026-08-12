# Ota

Ota 组件提供固件更新状态查询、自动更新时段配置和 OTA 升级服务。

| Method | Description |
| --- | --- |
| Ota.SetConfig | 设置 OTA 配置，或触发 OTA 升级动作 |
| Ota.GetConfig | 获取 OTA 自动更新配置 |
| Ota.GetStatus | 获取 OTA 状态和可升级版本信息 |


## 方法
Ota 组件支持的方法如下。

### Ota.SetConfig
设置 OTA 配置，或触发一次 OTA 升级动作。

请求必须使用 `params.config` 包裹配置对象。未携带的字段保持当前值不变。

`start` 是一次性动作字段，不会作为持久配置保存；`auto` 和 `time` 是自动更新配置字段。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| config | object | OTA 配置对象，必填 |

更多关于 `config` 属性的内容，请参阅 `config` 数据结构。

**响应**

`Ota.SetConfig` 的响应内容请参阅 `config` 数据结构。


### Ota.GetConfig
获取当前 OTA 自动更新配置。

**请求**

无。

**响应**

`Ota.GetConfig` 的响应内容请参阅 `config` 数据结构。


### Ota.GetStatus
获取当前 OTA 状态和可升级版本信息。

调用该接口时，响应会立即返回当前缓存快照，不等待后台查询任务完成。

**请求**

无。

**响应**

| Property | Type | Description |
| --- | --- | --- |
| available_update | string or null | 可升级版本号，最长 15 字节；当前产品使用 `x.y.z` 格式。无可用更新时为 `null` |
| changelog_url | string or null | 可升级版本的更新说明 URL。无可用更新时为 `null` |
| status | string | OTA 运行状态。`stop`：未在升级；`start`：正在升级 |


## 数据结构
Ota 组件相关的数据结构如下。

### config
`config` 用于 `Ota.SetConfig` 请求，以及 `Ota.GetConfig`、`Ota.SetConfig` 响应。

| Property | Type | Description |
| --- | --- | --- |
| auto | boolean | 是否启用自动更新 |
| time | string | 按设备本地时区执行的自动更新时间段，格式为 `HH:MM-HH:MM`，例如 `02:00-04:00`。起止时间只允许整点，间隔至少 1 小时，不支持跨天，结束时间必须晚于开始时间 |
| start | boolean | `true` 表示触发一次 OTA 升级。响应中固定返回 `false` |


### status
`status` 用于 `Ota.GetStatus` 响应。

| Property | Type | Description |
| --- | --- | --- |
| available_update | string or null | 可升级版本号，最长 15 字节；当前产品使用 `x.y.z` 格式，例如 `1.0.6`。无可用更新时为 `null` |
| changelog_url | string or null | 可升级版本的更新说明 URL。无可用更新时为 `null` |
| status | string | OTA 运行状态。`stop`：未在升级；`start`：正在升级 |


### 其他
#### ota_notify_status
`ota_notify_status` 用于 OTA 进度状态通知中的 `status.status` 字段。

| Value | Description |
| --- | --- |
| stop | 未在升级 |
| start | 正在升级 |
| success | 升级成功 |
| fail | 升级失败 |
| timeout | 升级超时 |


## MQTT Control
启用 MQTT 后，可通过命令 Topic 查询和安装固件更新。`<topic_root>` 和连接参数请参考 MQTT 文档中的 MQTT Control。

### Topic 与方向
| 方向 | Topic | 载荷或字段 | 作用 |
| --- | --- | --- | --- |
| 订阅 | `<topic_root>/status` | `firmware_installed_version`、`firmware_latest_version`、`firmware_update_available`、`firmware_update_running` | 获取查询结果并跟踪升级状态 |
| 发布 | `<topic_root>/cmd/firmware_query` | `PRESS` | 在后台查询可用固件更新 |
| 发布 | `<topic_root>/cmd/firmware_install` | `INSTALL` | 安装已查询到的可用固件更新 |

查询和安装均为异步操作，命令 Topic 不返回独立响应，必须通过状态 Topic 判断结果。

### 操作步骤
1. 订阅 `<topic_root>/status`，记录当前安装版本和升级状态。
2. 向 `<topic_root>/cmd/firmware_query` 发布 `PRESS`。
3. 等待状态 Topic 更新，检查 `firmware_latest_version` 和 `firmware_update_available`。
4. 仅当 `firmware_update_available` 为 `true` 时，向 `<topic_root>/cmd/firmware_install` 发布 `INSTALL`。
5. 持续订阅状态 Topic；`firmware_update_running` 为 `true` 表示正在升级。设备升级重启并重新上线后，检查 `firmware_installed_version` 是否已更新。

未先查询到可用版本时，不应直接发送安装命令。升级过程中不要重启设备或断开设备电源。

### 查询和安装示例

```bash
mosquitto_sub -h ${MQTT_SERVER} -p ${MQTT_PORT} -v \
  -t "${SONOFF_ID}/status"

mosquitto_pub -h ${MQTT_SERVER} -p ${MQTT_PORT} \
  -t "${SONOFF_ID}/cmd/firmware_query" \
  -m "PRESS"
```

确认状态消息中的 `firmware_update_available` 为 `true` 后，再执行：

```bash
mosquitto_pub -h ${MQTT_SERVER} -p ${MQTT_PORT} \
  -t "${SONOFF_ID}/cmd/firmware_install" \
  -m "INSTALL"
```


## 事件通知
Ota 组件支持的事件通知如下。

### autoupgrade_changed
自动更新配置变化后触发。

| Property | Type | Description |
| --- | --- | --- |
| component | string | 固定为 `ota` |
| id | number | 固定为 `1` |
| event | string | 固定为 `autoupgrade_changed` |
| ts | number | UTC Unix 时间戳，单位秒，使用 10 位整数 |


## 状态通知
Ota 组件在升级开始、进度变化、成功、失败或超时时，会通过 `NotifyStatus` 推送状态。`params.status` 包含 Ota 组件内部状态数据：

| Property | Type | Description |
| --- | --- | --- |
| status | object | Ota 组件状态对象，位于 `NotifyStatus.params.status` |
| status.component | string | 固定为 `Ota` |
| status.progress | number | OTA 进度，范围 `0` 到 `100` |
| status.status | string | OTA 状态：`stop`、`start`、`success`、`fail`、`timeout` |


## 示例
Ota 组件各方法与事件的示例。

### Ota.SetConfig 示例
请求开启自动更新并设置时间段：

```json
{
  "jsonrpc": "2.0",
  "id": 24,
  "src": "web",
  "method": "Ota.SetConfig",
  "params": {
    "config": {
      "auto": true,
      "time": "02:00-04:00"
    }
  }
}
```

请求开始 OTA 升级：

```json
{
  "jsonrpc": "2.0",
  "id": 25,
  "src": "web",
  "method": "Ota.SetConfig",
  "params": {
    "config": {
      "start": true
    }
  }
}
```

**响应成功**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 25,
  "result": {
    "config": {
      "auto": true,
      "time": "02:00-04:00",
      "start": false
    }
  }
}
```

失败响应示例：

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 25,
  "error": {
    "code": -32602,
    "message": "no available update"
  }
}
```

### Ota.GetConfig 示例
**请求**

```json
{
  "jsonrpc": "2.0",
  "id": 22,
  "src": "web",
  "method": "Ota.GetConfig",
  "params": {}
}
```

**响应成功**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 22,
  "result": {
    "config": {
      "auto": false,
      "time": "02:00-04:00",
      "start": false
    }
  }
}
```

### Ota.GetStatus 示例
**请求**

```json
{
  "jsonrpc": "2.0",
  "id": 21,
  "src": "web",
  "method": "Ota.GetStatus",
  "params": {}
}
```

**响应成功**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 21,
  "result": {
    "available_update": "1.0.6",
    "changelog_url": "https://appcms.coolkit.cn/fwupdate/1399.html",
    "status": "stop"
  }
}
```

### 通知示例
#### autoupgrade_changed 示例
```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "method": "NotifyEvent",
  "params": {
    "ts": 1626221112,
    "events": [
      {
        "component": "ota",
        "id": 1,
        "event": "autoupgrade_changed",
        "ts": 1626221112
      }
    ]
  }
}
```

#### 状态通知 示例
```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "method": "NotifyStatus",
  "params": {
    "ts": 1626221112,
    "status": {
      "component": "Ota",
      "progress": 100,
      "status": "success"
    }
  }
}
```
