# WiFi

WiFi 组件提供设备 STA 接入、AP 热点配置、网络状态查询和附近热点扫描服务。

| Method | Description |
| --- | --- |
| WiFi.SetConfig | 更新 AP 基础参数或 STA 配置 |
| WiFi.SetApEnable | 设置 AP 是否启动 |
| WiFi.SetApAutoOff | 设置 AP 是否自动关闭 |
| WiFi.GetConfig | 获取 WiFi 配置 |
| WiFi.GetStatus | 获取 WiFi 状态 |
| WiFi.Scan | 扫描附近 WiFi 热点 |


## 方法
WiFi 组件支持的方法如下。

### WiFi.SetConfig
更新 AP 的 SSID、密码和开放状态，或者更新 STA 配置。请求必须使用 `params.config` 包裹配置对象，不支持直接在 `params` 下传 `ap` 或 `sta`。

配置 AP 和 STA 时应分别调用 `WiFi.SetConfig`。单次请求的 `config` 中建议只携带 `ap` 或 `sta`，尽量不要同时携带两者。

AP 的三类配置必须通过三条独立协议设置：

| Configuration | Method | Request fields |
| --- | --- | --- |
| AP 名称、密码和开放状态 | WiFi.SetConfig | `config.ap.ssid`、`config.ap.pass`、`config.ap.is_open` |
| AP 自动关闭 | WiFi.SetApAutoOff | `enable` |
| AP 启停 | WiFi.SetApEnable | `enable` |

`WiFi.SetConfig` 的 `config.ap` 中不要携带 `enable` 或 `auto_off`。需要同时修改上述三类配置时，必须分别发送三次独立请求。未携带的字段保持当前值不变。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| config | object | WiFi 配置对象，必填。设置 AP 时仅携带 `ssid`、`pass`、`is_open` |

更多关于 `config` 属性的内容，请参阅 `config` 数据结构。

**响应**

`WiFi.SetConfig` 的响应内容请参阅 `config` 数据结构。

**说明：** 成功响应会返回完整的当前 `config`，其中的 `ap.enable` 和 `ap.auto_off` 只是状态回显，不表示它们由本次 `WiFi.SetConfig` 请求修改。

**说明：** `static` 字段用于保留静态 IPv4 配置，当前 ESP32 端口的 STA 接入流程主要支持 DHCP。



### WiFi.SetApEnable
独立设置设备 AP 是否启动。该设置不通过 `WiFi.SetConfig` 下发。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| enable | boolean | `true`：启动 AP；`false`：关闭 AP |


**响应**

`WiFi.SetApEnable` 的响应内容请参阅 `config` 数据结构。


### WiFi.SetApAutoOff
独立设置 AP 是否允许自动关闭。该设置不通过 `WiFi.SetConfig` 下发。

**请求**

| Property | Type | Description |
| --- | --- | --- |
| enable | boolean | `true`：无客户端连接时允许自动关闭 AP；`false`：不自动关闭 AP |


**响应**

`WiFi.SetApAutoOff` 的响应内容请参阅 `config` 数据结构。


### WiFi.GetConfig
获取当前 WiFi 配置。

**请求**

无。

**响应**

`WiFi.GetConfig` 的响应内容请参阅 `config` 数据结构。


**说明：** `WiFi.GetConfig` 不返回 AP 密码；STA 密码固定返回 `null`。

### WiFi.GetStatus
获取当前 WiFi 运行状态。

**请求**

无。

**响应**

| Property | Type | Description |
| --- | --- | --- |
| sta_ip | string or null | 当前 STA IPv4 地址，点分十进制格式，最长 15 字节；未连接时为 `null` |
| status | string | STA 连接状态。`Disconnected`：未连接；`Connecting`：正在连接或尚未获取 IPv4 地址；`Got ip`：已获取 IPv4 地址但互联网连通性尚未确认；`Connected`：互联网连通性检测通过 |
| network_status | string | 网络连通性状态。`none`：无可用连接或尚未获取 IP；`lan_only`：仅局域网可达；`internet`：互联网可达 |
| ssid | string or null | 当前已连接热点名称，最长 32 字节；未连接时为 `null` |
| bssid | string or null | 当前已连接热点 BSSID，格式如 `30:07:5C:43:AC:4E`；未连接时为 `null` |
| rssi | number | 当前信号强度，单位 dBm，典型范围 `-127` 到 `0`；未连接或无有效值时为 `0` |
| ap_client_count | number | 当前连接到设备 AP 的客户端数量，范围 `0` 到 `8` |


### WiFi.Scan
扫描附近 WiFi 热点。

**请求**

无。

**响应**

| Property | Type | Description |
| --- | --- | --- |
| results | array of object | 扫描结果数组，最多返回 15 个热点 |
| results[].ssid | string or null | 热点名称，最长 32 字节 |
| results[].bssid | string | 热点 BSSID，格式如 `30:07:5C:43:AC:4E` |
| results[].auth | number | 认证模式：<br>`0` OPEN<br>`1` WEP<br>`2` WPA_PSK<br>`3` WPA2_PSK<br>`4` WPA_WPA2_PSK<br>`5` WPA2_ENTERPRISE<br>`6` WPA3_PSK<br>`7` WPA2_WPA3_PSK<br>`8` WAPI_PSK<br>`9` OWE<br>`10` WPA3_ENT_192<br>`11` WPA3_EXT_PSK<br>`12` WPA3_EXT_PSK_MIXED_MODE<br>`13` DPP<br>`14` WPA3_ENTERPRISE<br>`15` WPA2_WPA3_ENTERPRISE |
| results[].channel | number | 热点信道，范围 `1` 到 `14`，实际可用范围受地区法规配置限制 |
| results[].rssi | number | 信号强度，单位 dBm，典型范围 `-127` 到 `0` |


**说明：** 扫描结果会过滤空 SSID；如果设备当前已连接某个 WiFi，扫描结果中会过滤该已连接热点，避免用户重复选择当前 WiFi。

## 数据结构
WiFi 组件相关的数据结构如下。

### config
`config` 用于 `WiFi.SetConfig` 请求，以及 `WiFi.SetConfig`、`WiFi.SetApEnable`、`WiFi.SetApAutoOff` 和 `WiFi.GetConfig` 响应。响应中的 `config` 是完整状态快照；请求中的 `config.ap` 只能设置 `ssid`、`pass` 和 `is_open`，不能设置 `enable` 或 `auto_off`。

| Property | Type | Description |
| --- | --- | --- |
| ap | object | AP 配置。`WiFi.SetConfig` 请求中可选 |
| ap.enable | boolean | AP 是否启用。仅在响应中返回；请使用 `WiFi.SetApEnable` 设置 |
| ap.ssid | string | AP 热点名称，最长 32 字节。请求中可选；启用 AP 时不能为空，仅允许字母、数字、`-`、`_` |
| ap.pass | string or null | AP 密码。仅用于 `WiFi.SetConfig` 请求；开放 AP 时传空字符串或 `null`，密码 AP 应为 8 到 63 个字符。响应不回显 AP 密码 |
| ap.is_open | boolean | AP 是否为开放热点。请求中可选；`true` 表示开放 AP 并清空密码，`false` 时最终状态由 `pass` 是否为空决定 |
| ap.auto_off | boolean | AP 是否允许自动关闭。仅在响应中返回；请使用 `WiFi.SetApAutoOff` 设置 |
| sta | object | STA 配置。`WiFi.SetConfig` 请求中可选 |
| sta.enable | boolean | 是否启用 STA 并尝试连接。请求中可选 |
| sta.ssid | string | 目标路由 SSID，最长 32 字节。请求中可选；启用 STA 时不能为空 |
| sta.pass | string or null | 路由密码，最长 64 字节。请求中可选；开放网络传空字符串或 `null`，普通 WPA/WPA2 密码为 8 到 63 个字符，64 字符仅用于十六进制 PSK。响应固定为 `null` |
| sta.is_open | boolean | STA 目标网络是否为开放网络。请求中可选；`true` 且未同时传入非空 `pass` 时清空密码，非空 `pass` 优先 |
| sta.ipv4mode | string | IPv4 模式，仅支持 `dhcp`、`static`。请求中可选；未传时保留当前值，空值按 `dhcp` 处理 |
| sta.ip | string or null | static 模式 IP，点分十进制 IPv4 格式，每段范围 `0` 到 `255`，最长 15 字节；未配置时响应为 `null` |
| sta.netmask | string or null | static 模式子网掩码，点分十进制 IPv4 格式，每段范围 `0` 到 `255`，最长 15 字节；未配置时响应为 `null` |
| sta.gw | string or null | static 模式网关，点分十进制 IPv4 格式，每段范围 `0` 到 `255`，最长 15 字节；未配置时响应为 `null` |
| sta.nameserver | string or null | static 模式 DNS，点分十进制 IPv4 格式，每段范围 `0` 到 `255`，最长 15 字节；未配置时响应为 `null` |


### 其他
#### SwitchWiFiRsp
`SwitchWiFiRsp` 是切换 WiFi 失败并回退旧 WiFi 后的通知数据。

| Property | Type | Description |
| --- | --- | --- |
| id | number | 固定为 `1` |
| error | number | 错误码。`400`：密码错误；`401`：目标 AP 未找到；`402`：其他连接失败或超时 |


## 事件通知
WiFi 组件支持的事件通知如下。

### config_changed
WiFi 配置变化后，设备会发送 `NotifyEvent` 事件通知。

| Property | Type | Description |
| --- | --- | --- |
| component | string | 固定为 `wifi` |
| id | number | 固定为 `1` |
| event | string | 固定为 `config_changed` |
| ts | number | 事件时间戳 |


## 状态通知
切换 WiFi 失败并回退旧 WiFi 后，设备通过 `NotifyStatus` 推送结果，`params.SwitchWiFiRsp` 包含 WiFi 组件内部的切换结果数据。该通知不是 `WiFi.GetStatus` 的状态快照。

## 示例
WiFi 组件各方法与事件的示例。

### WiFi.SetConfig 示例
设置 STA 为 DHCP 连接：

```json
{
  "jsonrpc": "2.0",
  "id": 11,
  "src": "web",
  "method": "WiFi.SetConfig",
  "params": {
    "config": {
      "sta": {
        "enable": true,
        "ssid": "MyRouter",
        "pass": "12345678",
        "is_open": false,
        "ipv4mode": "dhcp"
      }
    }
  }
}
```

**响应成功**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 11,
  "result": {
    "config": {
      "ap": {
        "enable": true,
        "ssid": "SONOFF_1GSP_F91F",
        "is_open": false,
        "auto_off": true
      },
      "sta": {
        "enable": true,
        "ssid": "MyRouter",
        "pass": null,
        "is_open": false,
        "ipv4mode": "dhcp",
        "ip": null,
        "netmask": null,
        "gw": null,
        "nameserver": null
      }
    }
  }
}
```

设置带密码的 AP 名称、密码和开放状态。本请求不会修改 AP 启停状态或自动关闭状态：

```json
{
  "jsonrpc": "2.0",
  "id": 35,
  "src": "web",
  "method": "WiFi.SetConfig",
  "params": {
    "config": {
      "ap": {
        "ssid": "SONOFF_1GSP_F91F",
        "pass": "11111111",
        "is_open": false
      }
    }
  }
}
```

**响应成功**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 35,
  "result": {
    "config": {
      "ap": {
        "enable": true,
        "ssid": "SONOFF_1GSP_F91F",
        "is_open": false,
        "auto_off": true
      },
      "sta": {
        "enable": true,
        "ssid": "MyRouter",
        "pass": null,
        "is_open": false,
        "ipv4mode": "dhcp",
        "ip": null,
        "netmask": null,
        "gw": null,
        "nameserver": null
      }
    }
  }
}
```

响应中的 `ap.enable` 和 `ap.auto_off` 是设备当前状态的完整回显，不是本次 `WiFi.SetConfig` 设置的内容。设置开放 AP 时，使用空字符串 `pass` 并将 `is_open` 设为 `true`。

### WiFi.SetApEnable 示例
```json
{
  "jsonrpc": "2.0",
  "id": 43,
  "src": "web",
  "method": "WiFi.SetApEnable",
  "params": {
    "enable": true
  }
}
```

**响应成功**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 43,
  "result": {
    "config": {
      "ap": {
        "enable": true,
        "ssid": "SONOFF_1GSP_F91F",
        "is_open": false,
        "auto_off": true
      },
      "sta": {
        "enable": true,
        "ssid": "MyRouter",
        "pass": null,
        "is_open": false,
        "ipv4mode": "dhcp",
        "ip": null,
        "netmask": null,
        "gw": null,
        "nameserver": null
      }
    }
  }
}
```

### WiFi.SetApAutoOff 示例
```json
{
  "jsonrpc": "2.0",
  "id": 40,
  "src": "web",
  "method": "WiFi.SetApAutoOff",
  "params": {
    "enable": false
  }
}
```

**响应成功**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 40,
  "result": {
    "config": {
      "ap": {
        "enable": true,
        "ssid": "SONOFF_1GSP_F91F",
        "is_open": false,
        "auto_off": false
      },
      "sta": {
        "enable": true,
        "ssid": "MyRouter",
        "pass": null,
        "is_open": false,
        "ipv4mode": "dhcp",
        "ip": null,
        "netmask": null,
        "gw": null,
        "nameserver": null
      }
    }
  }
}
```

### WiFi.GetConfig 示例
```json
{
  "jsonrpc": "2.0",
  "id": 15,
  "src": "web",
  "method": "WiFi.GetConfig",
  "params": {}
}
```

**响应成功**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 15,
  "result": {
    "config": {
      "ap": {
        "enable": true,
        "ssid": "SONOFF_1GSP_F91F",
        "is_open": false,
        "auto_off": true
      },
      "sta": {
        "enable": true,
        "ssid": "MyRouter",
        "pass": null,
        "is_open": false,
        "ipv4mode": "dhcp",
        "ip": null,
        "netmask": null,
        "gw": null,
        "nameserver": null
      }
    }
  }
}
```

### WiFi.GetStatus 示例
```json
{
  "jsonrpc": "2.0",
  "id": 16,
  "src": "web",
  "method": "WiFi.GetStatus",
  "params": {}
}
```

**响应成功**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 16,
  "result": {
    "sta_ip": "192.168.3.88",
    "status": "Connected",
    "network_status": "internet",
    "ssid": "MyRouter",
    "bssid": "30:07:5C:43:AC:4E",
    "rssi": -42,
    "ap_client_count": 0
  }
}
```

### WiFi.Scan 示例
```json
{
  "jsonrpc": "2.0",
  "id": 17,
  "src": "web",
  "method": "WiFi.Scan",
  "params": {}
}
```

**响应成功**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 17,
  "result": {
    "results": [
      {
        "ssid": "Router_2.4G",
        "bssid": "30:07:5C:43:AC:4E",
        "auth": 3,
        "channel": 6,
        "rssi": -42
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
        "component": "wifi",
        "id": 1,
        "event": "config_changed",
        "ts": 1626221112
      }
    ]
  }
}
```

#### SwitchWiFiRsp 示例
```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "method": "NotifyStatus",
  "params": {
    "ts": 1626221112,
    "SwitchWiFiRsp": {
      "id": 1,
      "error": 400
    }
  }
}
```
