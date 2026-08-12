# 快速开始

本指南帮助你快速完成协议联通验证。

## 前提条件

- 一台已上电的 Sonoff 设备。
- 与设备在同一局域网的电脑，装有 `curl`（或 `websocat` / Python 3）。
- 设备已联网，且电脑可访问设备。

> **说明：** 示例命令基于 Unix 风格环境（Linux / macOS，或 Windows 上的 WSL / Git Bash）。Windows 10 及以上自带 `curl`，但 `export`、`websocat`、`sha256sum` 等命令在原生命令行（cmd / PowerShell）中不可用。建议通过 WSL 或 Git Bash 运行示例，或将示例中的环境变量直接替换为实际值。

## 获取设备 IP

首次使用设备前，需先完成初始配置（联网）。不同型号设备的初始配置方式可能有差异，具体请以对应设备说明书为准。设备通常支持 Web 后台与 AP 模式：首次使用时可连接设备发射的 AP 热点，用浏览器访问设备网页完成首次登录与联网配置，无需依赖其它 App 或生态。

设备联网成功后，可通过以下任一方式获取设备 IP：

- 路由器后台的设备列表；
- 设备 Web 后台或厂商 App 的设备详情页。

获取 IP 后，先导出环境变量（后续示例均依赖它）：

```bash
export SONOFF=192.168.1.100
```

## 验证协议联通

设备对 HTTP 通道开放 RPC 端点 `/rpc`。调用无需鉴权的 `Sonoff.GetDeviceInfo` 确认设备在线：

```bash
curl -X POST -d '{"id":1,"src":"user_1","method":"Sonoff.GetDeviceInfo"}' http://${SONOFF}/rpc
```

返回示例：

```json
{
    "src": "sonoffmini1gsp-acebe61fae74",
    "dst": "user_1",
    "id": 1,
    "result": {
        "name": "MINI-1GSP",
        "model": "mini1gsp",
        "id": "sonoffmini1gsp-acebe61fae74",
        "ver": "0.5.0",
        "ip": "192.168.1.100",
        "mac": "ac:eb:e6:1f:ae:74",
        "auth_en": false,
        "auth_domain": null,
        "initial_password": false
    }
}
```

重点确认以下字段：

| 字段 | 说明 |
| --- | --- |
| `id` | 设备 ID，格式 `sonoff产品型号-mac地址`，后续鉴权等场景会用到 |
| `ver` | 固件版本 |
| `initial_password` | `false` 表示尚未设置密码，下一步需要设置 |

`Sonoff.GetDeviceInfo` 是少数无需鉴权的方法，其余接口在启用鉴权后都需要携带认证凭据。

## 设置访问密码

仅当上一步 `initial_password` 为 `false` 时执行。
如果你之前已通过web端设置过密码，可以跳过此步。

调用 `Sonoff.SetAuth` 设置密码，`user` 固定为 `admin`，`realm` 为设备 ID：

```bash
curl -X POST -d '{"id":2,"src":"user_1","method":"Sonoff.SetAuth","params":{"user":"admin","realm":"sonoffmini1gsp-acebe61fae74","ha1":"<计算得到的ha1>"}}' http://${SONOFF}/rpc
```

`ha1` 按以下方式计算（完整说明见[认证](General/Authentication)）：

```
ha1 = SHA256(admin:<realm>:<password>)
```

例如密码为 `12345678` 时：

```bash
echo -n "admin:sonoffmini1gsp-acebe61fae74:12345678" | sha256sum
```

## 第一次受控调用

设置密码后，受保护的方法需携带认证凭据。以下分别通过 HTTP 与 WebSocket 调用 `Sonoff.GetConfig` 演示。

### HTTP

`curl` 的 `--digest` 会自动完成 401 质询-应答流程并重试请求：

```bash
curl -X POST --digest -u admin:12345678 \
     -d '{"id":1,"src":"user_1","method":"Sonoff.GetConfig"}' http://${SONOFF}/rpc
```

### WebSocket

连接 WebSocket 后，先发送不带认证的请求，从返回的 401 错误中提取 `nonce`、`nc`、`realm`，计算 `auth` 字段后再发送：

```bash
websocat ws://${SONOFF}/rpc
# 第一次（无认证）：
{"id":1, "src":"user_1", "method":"Sonoff.GetConfig"}
# 携带 auth：
{"id":2, "src":"user_1", "method":"Sonoff.GetConfig", "auth": {"realm":"sonoffmini1gsp-acebe61fae74","username":"admin","nonce":"<nonce>","nc":1,"cnonce":<随机数>,"response":"<计算结果>","algorithm":"SHA-256"}}
```

`auth` 字段的完整计算方式见[认证](General/Authentication)。

## 下一步

- 了解请求、应答、通知三种帧结构：[RPC 协议](General/RPCProtocol)
- 确定通信方式：[RPC 传输通道](General/RPCChannels)
- 查阅组件接口：`Components/` 下各组件文档
- 确认设备支持的组件范围：`Devices/`
