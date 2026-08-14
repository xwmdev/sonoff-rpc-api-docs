---
sidebar_position: 3
---

# 认证

通过 API 访问设备时，需要进行身份认证。本文档介绍如何通过 HTTP 和 WebSocket 进行身份认证。


## 适用通信方式

以下两种通信方式需要通过 [RFC7616](https://datatracker.ietf.org/doc/html/rfc7616) 中定义的 SHA256 hmac 算法的摘要认证机制进行身份认证：

+ `HTTP`
+ `WebSocket`

以下几种情况不需要进行身份认证：

+ RPC协议 `Sonoff.GetDeviceInfo`
+ `出站WebSocket`
+ `MQTT通信`


## 设置密码

首次使用设备时(未配置登录密码)，必须先通过 [Sonoff.SetAuth](../Components/Sonoff.md#sonoffsetauth) 设置密码。流程如下：

1. 调用 [Sonoff.GetDeviceInfo](../Components/Sonoff.md#sonoffgetdeviceinfo) 获取设备信息，确认 `initial_password` 字段：
   + `false`：尚未设置密码，需执行第 2 步
   + `true`：已设置过密码，可直接进入[认证流程](#认证流程)

2. 调用 [Sonoff.SetAuth](../Components/Sonoff.md#sonoffsetauth) 设置密码，传入参数：
   + `user`：固定为 `admin`
   + `realm`：设备 ID，从第 1 步获取
   + `ha1`：`SHA256(admin:<设备ID>:<密码>)` ，计算方式见 [HA1 计算方法](#ha1-计算方法)

3. 设置成功后，后续调用受保护的 RPC 方法需携带摘要认证凭据。

## HA1 计算方法

HA1 是 SHA256 哈希值，计算公式为：

```
ha1 = SHA256(admin:<realm>:<password>)
```

其中 `<realm>` 为设备 ID（如 `sonoffmini1gsp-acebe61fae74`），`<password>` 为通过 `Sonoff.SetAuth` 设置的密码。

Javascript 示例：

```javascript
let crypto = require('crypto');
let username = 'admin'; // 固定为 admin
let password = 'mysecretpassword'; // 设置的密码
let realm = 'sonoffmini1gsp-acebe61fae74';
let ha1 = crypto.createHash("sha256").update(`${username}:${realm}:${password}`).digest("hex");
console.log(ha1);
```

## 认证流程

1. 客户端向设备请求受保护资源（不带认证凭据）
2. 设备返回 401 错误（未授权），响应中包含 `realm` 和 `nonce`
3. 客户端携带摘要认证凭据重新请求受保护资源
4. 设备验证通过，返回成功结果


### HTTP 身份认证

以下以请求 `Sonoff.GetConfig` 为例，演示 POST 方式发送完整 RPC 帧的认证流程。

首次请求不带认证凭据：

```bash
curl -X POST -d '{"id":1,"src":"user_1","method":"Sonoff.GetConfig"}' -i http://${SONOFF}/rpc
```

```bash
HTTP/1.1 401 Unauthorized
Server: SonoffHTTP/1.0.0
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: *
Content-Length: 0
Connection: close
WWW-Authenticate: Digest qop="auth", realm="sonoffmini1gsp-acebe61fae74", nonce="2dswss384", algorithm=SHA-256
```

服务端返回 401，并在响应头 `WWW-Authenticate` 中提供 `realm` 和 `nonce`。

现在携带摘要认证凭据发起请求：

```bash
curl -X POST -d '{"id":1,"src":"user_1","method":"Sonoff.GetConfig"}' \
     --digest -u admin:${password} -i http://${SONOFF}/rpc
```

```json
{
    "id": 1,
    "src": "sonoffmini1gsp-acebe61fae74",
    "dst": "user_1",
    "result": {
        "config": {
            "name": "MINI-1GSP"
        }
    }
}
```

> 提示：`--digest` 中的 `password` 即通过 [Sonoff.SetAuth](../Components/Sonoff.md#sonoffsetauth) 设置的密码。curl 会自动完成 401 质询-应答流程并重试请求。

### WebSocket 身份认证

WebSocket 的身份验证需将摘要认证的计算结果放入请求帧的 `auth` 字段内。

**步骤 1：获取质询信息**

连接 WebSocket 并发送不带认证的请求：

```bash
websocat ws://${SONOFF}/rpc
# 连接成功后输入：
{"id":1, "src":"user_1", "method":"Sonoff.GetConfig"}
```

设备返回 401 错误，包含质询信息：

```json
{
   "id": 1,
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "error": {
      "code": 401,
      "message": "{\"auth_type\":\"digest\",\"nonce\":\"BMWOplDD{@Xg*R$f\",\"nc\":1,\"realm\":\"sonoffmini1gsp-acebe61fae74\",\"algorithm\":\"SHA-256\"}"
   }
}
```

**步骤 2：计算 auth 并发起认证请求**

从 `error.message` 中提取 `nonce`、`nc`、`realm`，结合已知密码计算 `auth` 字段（HA1 计算方法见 [HA1 计算方法](#ha1-计算方法)），在同一 WebSocket 会话中继续输入：

```bash
{"id":2, "src":"user_1", "method":"Sonoff.GetConfig", "auth": {"realm": "sonoffmini1gsp-acebe61fae74", "username": "admin", "nonce": "BMWOplDD{@Xg*R$f", "nc": 1, "cnonce": 1786349688, "response": "<计算结果>", "algorithm": "SHA-256"}}
```

设备认证通过后返回正常结果。

> 注意：`cnonce` 为客户端生成的随机数（可用时间戳），`nonce` 由服务端每次质询时重新生成，`response` 需根据实际参数重新计算。

auth 字段内应包含以下几个参数：

+ `realm`：string，设备 ID（即 `<sonoff-id>`，如 `sonoffmini1gsp-acebe61fae74`）
+ `username`：string，固定为 `admin`
+ `nonce`：string，从服务端 401 错误信息中获取
+ `cnonce`：number，客户端生成的随机数
+ `nc`：number，客户端递增序号，参与拼接时转为十进制字符串（不补 0）
+ `response`：string，由 `{ha1}:{nonce}:{nc}:{cnonce}:auth:{ha2}` 构成的 SHA-256 加密结果
    + `ha1`：`SHA256(admin:<realm>:<密码>)`，见 [HA1 计算方法](#ha1-计算方法)
    + `ha2`：`SHA256(<method1>:<method2>)`，如方法 `Sonoff.GetConfig` 时 method1=`Sonoff`，method2=`GetConfig`
+ `algorithm`：string，固定为 `SHA-256`

> **注意：** `auth` 字段的 `ha2` 使用 `SHA256(<method1>:<method2>)` 计算，与 RFC 7616 标准（`SHA256(method:uri)`）不同。通用摘要认证库通常无法直接用于计算 WebSocket 的 `auth` 字段，请按上文说明自行实现，参见下方代码示例。HTTP 通道使用 `curl --digest` 等标准客户端即可。

## 代码示例
### HTTP 请求示例

> 运行前需安装依赖：`pip install requests`

```python
import os
import requests
from requests.auth import HTTPDigestAuth

SONOFF = "192.168.50.190"  # 设备 IP 地址
username = "admin"
password = "12345678"

url = f"http://{SONOFF}/rpc"
payload = {"id": 1, "src": "user_1", "method": "Sonoff.GetConfig"}

if __name__ == "__main__":
    response = requests.post(
        url=url,
        json=payload,
        auth=HTTPDigestAuth(username, password)
    )
    print(response.status_code)
    print(response.text)
```

### WebSocket 请求示例

> 运行前需安装依赖：`pip install websocket-client`
>
> `websocket-client` 非 Python 标准库，建议在 Python 虚拟环境中安装：
>
> ```bash
> python3 -m venv venv
> source venv/bin/activate
> pip install websocket-client
> ```

```python
import os
import json
import hashlib
import time
import websocket

SONOFF = "192.168.50.190"  # 设备 IP 地址
username = "admin"
password = "12345678"

ws_url = f"ws://{SONOFF}/rpc"


def sha256_hex(data: str) -> str:
    """
    SHA256加密
    :param data: 待加密数据
    """
    return hashlib.sha256(data.encode("utf-8")).hexdigest()


def compute_auth(method:str, nonce, nc, realm) -> dict:
    """
    计算加密
    :param method: 接口方法
    """
    cnonce = int(time.time())
    method1, method2 = method.split(".")


    ha1 = sha256_hex(f"{username}:{realm}:{password}")
    ha2 = sha256_hex(f"{method1}:{method2}")

    hashed = sha256_hex(
        f"{ha1}:{nonce}:{nc}:{cnonce}:auth:{ha2}"
    )

    return {
        "realm": realm,
        "username": username,
        "nonce": nonce,
        "nc": nc,
        "cnonce": cnonce,
        "response": hashed,
        "algorithm": "SHA-256"
    }


if __name__ == "__main__":

    ws = websocket.WebSocket()
    ws.connect(ws_url, timeout=5)

    ws.send(json.dumps({
        "id": 1,
        "src": "script",
        "method":"Sonoff.GetConfig"
    }))
    resp = json.loads(ws.recv())
    message = json.loads(resp["error"]["message"])


    ws.send(json.dumps({
        "id": 1,
        "src": "script",
        "method":"Sonoff.GetConfig",
        "auth": compute_auth("Sonoff.GetConfig", message["nonce"],message["nc"],message["realm"])
    }))

    print("recv:", ws.recv())

    ws.close()
```
