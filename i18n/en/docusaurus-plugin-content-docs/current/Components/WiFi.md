# WiFi

The WiFi component provides device STA connection, AP hotspot configuration, network status queries, and nearby hotspot scanning services.

| Method | Description |
| --- | --- |
| WiFi.SetConfig | Update AP basic parameters or STA configuration |
| WiFi.SetApEnable | Set whether AP is enabled |
| WiFi.SetApAutoOff | Set whether AP auto-off is enabled |
| WiFi.GetConfig | Get WiFi configuration |
| WiFi.GetStatus | Get WiFi status |
| WiFi.Scan | Scan nearby WiFi hotspots |


## Methods
The methods supported by the WiFi component are as follows.

### WiFi.SetConfig
Update the AP SSID, password, and open status, or update the STA configuration. Requests must use `params.config` to wrap the configuration object; passing `ap` or `sta` directly under `params` is not supported.

When configuring AP and STA, `WiFi.SetConfig` should be called separately. It is recommended that a single request's `config` carries only `ap` or `sta` and should avoid carrying both as much as possible.

The three categories of AP configuration must be set via three separate protocol calls:

| Configuration | Method | Request fields |
| --- | --- | --- |
| AP name, password, and open status | WiFi.SetConfig | `config.ap.ssid`, `config.ap.pass`, `config.ap.is_open` |
| AP auto-off | WiFi.SetApAutoOff | `enable` |
| AP enable/disable | WiFi.SetApEnable | `enable` |

Do not carry `enable` or `auto_off` within `config.ap` of `WiFi.SetConfig`. When all three configuration categories need to be modified, three separate requests must be sent. Fields not carried will keep their current values unchanged.

**Request**

| Property | Type | Description |
| --- | --- | --- |
| config | object | WiFi configuration object, required. When setting AP, only carry `ssid`, `pass`, `is_open` |

For more details about the `config` property, see the `config` data structure.

**Response**

For the response content of `WiFi.SetConfig`, see the `config` data structure.

**Note:** A successful response returns the complete current `config`, in which `ap.enable` and `ap.auto_off` are only status echoes and do not indicate that they were modified by this `WiFi.SetConfig` request.

**Note:** The `static` field is used to retain static IPv4 configuration. The current STA connection process on the ESP32 port primarily supports DHCP.



### WiFi.SetApEnable
Independently set whether the device AP is enabled. This setting is not issued via `WiFi.SetConfig`.

**Request**

| Property | Type | Description |
| --- | --- | --- |
| enable | boolean | `true`: enable AP; `false`: disable AP |


**Response**

For the response content of `WiFi.SetApEnable`, see the `config` data structure.


### WiFi.SetApAutoOff
Independently set whether the AP is allowed to auto-off. This setting is not issued via `WiFi.SetConfig`.

**Request**

| Property | Type | Description |
| --- | --- | --- |
| enable | boolean | `true`: allow auto-off of AP when no clients are connected; `false`: do not auto-off AP |


**Response**

For the response content of `WiFi.SetApAutoOff`, see the `config` data structure.


### WiFi.GetConfig
Get the current WiFi configuration.

**Request**

None.

**Response**

For the response content of `WiFi.GetConfig`, see the `config` data structure.


**Note:** `WiFi.GetConfig` does not return the AP password; the STA password always returns `null`.

### WiFi.GetStatus
Get the current WiFi running status.

**Request**

None.

**Response**

| Property | Type | Description |
| --- | --- | --- |
| sta_ip | string or null | Current STA IPv4 address, dotted-decimal format, max 15 bytes; `null` when not connected |
| status | string | STA connection status. `Disconnected`: not connected; `Connecting`: connecting or has not yet obtained an IPv4 address; `Got ip`: IPv4 address obtained but internet connectivity not yet confirmed; `Connected`: internet connectivity check passed |
| network_status | string | Network connectivity status. `none`: no available connection or IP not yet obtained; `lan_only`: LAN only reachable; `internet`: internet reachable |
| ssid | string or null | Currently connected hotspot name, max 32 bytes; `null` when not connected |
| bssid | string or null | Currently connected hotspot BSSID, format like `30:07:5C:43:AC:4E`; `null` when not connected |
| rssi | number | Current signal strength, unit: dBm, typical range `-127` to `0`; `0` when not connected or no valid value |
| ap_client_count | number | Number of clients currently connected to the device AP, range `0` to `8` |


### WiFi.Scan
Scan nearby WiFi hotspots.

**Request**

None.

**Response**

| Property | Type | Description |
| --- | --- | --- |
| results | array of object | Scan result array, up to 15 hotspots returned |
| results[].ssid | string or null | Hotspot name, max 32 bytes |
| results[].bssid | string | Hotspot BSSID, format like `30:07:5C:43:AC:4E` |
| results[].auth | number | Authentication mode:<br>`0` OPEN<br>`1` WEP<br>`2` WPA_PSK<br>`3` WPA2_PSK<br>`4` WPA_WPA2_PSK<br>`5` WPA2_ENTERPRISE<br>`6` WPA3_PSK<br>`7` WPA2_WPA3_PSK<br>`8` WAPI_PSK<br>`9` OWE<br>`10` WPA3_ENT_192<br>`11` WPA3_EXT_PSK<br>`12` WPA3_EXT_PSK_MIXED_MODE<br>`13` DPP<br>`14` WPA3_ENTERPRISE<br>`15` WPA2_WPA3_ENTERPRISE |
| results[].channel | number | Hotspot channel, range `1` to `14`, actual available range subject to regional regulatory configuration |
| results[].rssi | number | Signal strength, unit: dBm, typical range `-127` to `0` |


**Note:** Scan results will filter out empty SSIDs; if the device is currently connected to a WiFi network, that connected hotspot will be filtered out of the scan results to avoid the user reselecting the current WiFi.

## Data Structures
The data structures related to the WiFi component are as follows.

### config
`config` is used in `WiFi.SetConfig` requests, and in `WiFi.SetConfig`, `WiFi.SetApEnable`, `WiFi.SetApAutoOff`, and `WiFi.GetConfig` responses. The `config` in the response is a complete status snapshot; in requests, `config.ap` can only set `ssid`, `pass`, and `is_open`, and cannot set `enable` or `auto_off`.

| Property | Type | Description |
| --- | --- | --- |
| ap | object | AP configuration. Optional in `WiFi.SetConfig` requests |
| ap.enable | boolean | Whether AP is enabled. Only returned in responses; please use `WiFi.SetApEnable` to set |
| ap.ssid | string | AP hotspot name, max 32 bytes. Optional in requests; cannot be empty when AP is enabled, only letters, digits, `-`, `_` allowed |
| ap.pass | string or null | AP password. Only used in `WiFi.SetConfig` requests; pass empty string or `null` for open AP, password AP should be 8 to 63 characters. Responses do not echo AP password |
| ap.is_open | boolean | Whether AP is an open hotspot. Optional in requests; `true` means open AP and clears the password, `false` means final status is determined by whether `pass` is empty |
| ap.auto_off | boolean | Whether AP is allowed to auto-off. Only returned in responses; please use `WiFi.SetApAutoOff` to set |
| sta | object | STA configuration. Optional in `WiFi.SetConfig` requests |
| sta.enable | boolean | Whether to enable STA and attempt connection. Optional in requests |
| sta.ssid | string | Target router SSID, max 32 bytes. Optional in requests; cannot be empty when STA is enabled |
| sta.pass | string or null | Router password, max 64 bytes. Optional in requests; pass empty string or `null` for open network, normal WPA/WPA2 password is 8 to 63 characters, 64 characters only for hexadecimal PSK. Response always returns `null` |
| sta.is_open | boolean | Whether the STA target network is an open network. Optional in requests; `true` and no non-empty `pass` simultaneously clears the password, non-empty `pass` takes precedence |
| sta.ipv4mode | string | IPv4 mode, only supports `dhcp`, `static`. Optional in requests; retains current value if not passed, empty value treated as `dhcp` |
| sta.ip | string or null | static mode IP, dotted-decimal IPv4 format, per-segment range `0` to `255`, max 15 bytes; response is `null` when not configured |
| sta.netmask | string or null | static mode subnet mask, dotted-decimal IPv4 format, per-segment range `0` to `255`, max 15 bytes; response is `null` when not configured |
| sta.gw | string or null | static mode gateway, dotted-decimal IPv4 format, per-segment range `0` to `255`, max 15 bytes; response is `null` when not configured |
| sta.nameserver | string or null | static mode DNS, dotted-decimal IPv4 format, per-segment range `0` to `255`, max 15 bytes; response is `null` when not configured |


### Other
#### SwitchWiFiRsp
`SwitchWiFiRsp` is the notification data after a WiFi switch fails and falls back to the old WiFi.

| Property | Type | Description |
| --- | --- | --- |
| id | number | Fixed as `1` |
| error | number | Error code. `400`: wrong password; `401`: target AP not found; `402`: other connection failure or timeout |


## Event Notifications
The event notifications supported by the WiFi component are as follows.

### config_changed
After the WiFi configuration changes, the device will send a `NotifyEvent` event notification.

| Property | Type | Description |
| --- | --- | --- |
| component | string | Fixed as `wifi` |
| id | number | Fixed as `1` |
| event | string | Fixed as `config_changed` |
| ts | number | Event timestamp |


## Status Notifications
After a WiFi switch fails and falls back to the old WiFi, the device pushes the result via `NotifyStatus`, with `params.SwitchWiFiRsp` containing the switch result data internal to the WiFi component. This notification is not a status snapshot from `WiFi.GetStatus`.

## Examples
Examples of the WiFi component methods and events.

### WiFi.SetConfig Example
Set STA to DHCP connection:

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

**Response**

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

Set AP name, password, and open status with a password. This request will not modify the AP enable/disable status or the auto-off status:

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

**Response**

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

The `ap.enable` and `ap.auto_off` in the response are a complete echo of the device's current state, not the content set by this `WiFi.SetConfig` request. When setting an open AP, use an empty string `pass` and set `is_open` to `true`.

### WiFi.SetApEnable Example
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

**Response**

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

### WiFi.SetApAutoOff Example
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

**Response**

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

### WiFi.GetConfig Example
```json
{
  "jsonrpc": "2.0",
  "id": 15,
  "src": "web",
  "method": "WiFi.GetConfig",
  "params": {}
}
```

**Response**

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

### WiFi.GetStatus Example
```json
{
  "jsonrpc": "2.0",
  "id": 16,
  "src": "web",
  "method": "WiFi.GetStatus",
  "params": {}
}
```

**Response**

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

### WiFi.Scan Example
```json
{
  "jsonrpc": "2.0",
  "id": 17,
  "src": "web",
  "method": "WiFi.Scan",
  "params": {}
}
```

**Response**

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

### Notification Examples
#### config_changed Example
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

#### SwitchWiFiRsp Example
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
