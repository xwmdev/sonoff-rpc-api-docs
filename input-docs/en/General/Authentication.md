# Authentication

When accessing the device via API, authentication is required. This document describes how to authenticate via HTTP and WebSocket.


## Applicable Communication Methods

The following two communication methods require authentication using the SHA256 HMAC digest authentication mechanism defined in [RFC7616](https://datatracker.ietf.org/doc/html/rfc7616):

+ `HTTP`
+ `WebSocket`

Authentication is not required in the following cases:

+ RPC protocol `Sonoff.GetDeviceInfo`
+ `Outbound WebSocket`
+ `MQTT communication`


## Setting a Password

When using the device for the first time (login password not yet configured), you must first set a password via [Sonoff.SetAuth](../Components/Sonoff#sonoffsetauth). The process is as follows:

1. Call [Sonoff.GetDeviceInfo](../Components/Sonoff#sonoffgetdeviceinfo) to obtain device information, and check the `initial_password` field:
   + `false`: Password not yet set, proceed to step 2
   + `true`: Password already set, proceed directly to [Authentication Flow](#authentication-flow)

2. Call [Sonoff.SetAuth](../Components/Sonoff#sonoffsetauth) to set the password, passing parameters:
   + `user`: fixed to `admin`
   + `realm`: device ID, obtained from step 1
   + `ha1`: `SHA256(admin:<device ID>:<password>)`, see [HA1 Calculation](#ha1-calculation) for the calculation method

3. After successful setup, subsequent calls to protected RPC methods must carry digest authentication credentials.

## HA1 Calculation

HA1 is a SHA256 hash value calculated as:

```
ha1 = SHA256(admin:<realm>:<password>)
```

Where `<realm>` is the device ID (e.g. `sonoffmini1gsp-acebe61fae74`), and `<password>` is the password set via `Sonoff.SetAuth`.

JavaScript example:

```javascript
let crypto = require('crypto');
let username = 'admin'; // fixed to admin
let password = 'mysecretpassword'; // the password set
let realm = 'sonoffmini1gsp-acebe61fae74';
let ha1 = crypto.createHash("sha256").update(`${username}:${realm}:${password}`).digest("hex");
console.log(ha1);
```

## Authentication Flow

1. Client requests a protected resource from the device (without authentication credentials)
2. Device returns a 401 error (Unauthorized), with `realm` and `nonce` in the response
3. Client re-requests the protected resource with digest authentication credentials
4. Device verifies and returns a success result


### HTTP Authentication

The following uses requesting `Sonoff.GetConfig` as an example to demonstrate the authentication flow of sending a full RPC frame via POST.

First request without authentication credentials:

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

The server returns 401, providing `realm` and `nonce` in the `WWW-Authenticate` response header.

Now send a request with digest authentication credentials:

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

> Tip: The `password` in `--digest` is the password set via [Sonoff.SetAuth](../Components/Sonoff#sonoffsetauth). curl will automatically complete the 401 challenge-response flow and retry the request.

### WebSocket Authentication

For WebSocket authentication, the computed digest authentication result must be placed in the `auth` field of the request frame.

**Step 1: Obtain challenge information**

Connect to WebSocket and send a request without authentication:

```bash
websocat ws://${SONOFF}/rpc
# After connecting, enter:
{"id":1, "src":"user_1", "method":"Sonoff.GetConfig"}
```

The device returns a 401 error containing challenge information:

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

**Step 2: Compute auth and send an authentication request**

Extract `nonce`, `nc`, `realm` from `error.message`, combine with the known password to compute the `auth` field (see [HA1 Calculation](#ha1-calculation) for HA1 calculation), and continue entering in the same WebSocket session:

```bash
{"id":2, "src":"user_1", "method":"Sonoff.GetConfig", "auth": {"realm": "sonoffmini1gsp-acebe61fae74", "username": "admin", "nonce": "BMWOplDD{@Xg*R$f", "nc": 1, "cnonce": 1786349688, "response": "<computed result>", "algorithm": "SHA-256"}}
```

After device authentication passes, the normal result is returned.

> Note: `cnonce` is a random number generated by the client (timestamp can be used), `nonce` is regenerated by the server on each challenge, and `response` must be recomputed based on actual parameters.

The `auth` field should contain the following parameters:

+ `realm`: string, device ID (i.e. `<sonoff-id>`, e.g. `sonoffmini1gsp-acebe61fae74`)
+ `username`: string, fixed to `admin`
+ `nonce`: string, obtained from the server's 401 error information
+ `cnonce`: string, random number generated by the client
+ `nc`: number, client increment counter, converted to a decimal string (no zero-padding) when concatenating
+ `response`: string, SHA-256 encrypted result composed of `{ha1}:{nonce}:{nc}:{cnonce}:auth:{ha2}`
    + `ha1`: `SHA256(admin:<realm>:<password>)`, see [HA1 Calculation](#ha1-calculation)
    + `ha2`: `SHA256(<method1>:<method2>)`, e.g. for method `Sonoff.GetConfig`, method1=`Sonoff`, method2=`GetConfig`
+ `algorithm`: string, fixed to `SHA-256`

## Code Examples
### HTTP Request Example

> Dependencies required before running: `pip install requests`

```python
import os
import requests
from requests.auth import HTTPDigestAuth

SONOFF = "192.168.50.190"  # Device IP address
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

### WebSocket Request Example

> Dependencies required before running: `pip install websocket-client`
>
> `websocket-client` is not a Python standard library. It is recommended to install it in a Python virtual environment:
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

SONOFF = "192.168.50.190"  # Device IP address
username = "admin"
password = "12345678"

ws_url = f"ws://{SONOFF}/rpc"


def sha256_hex(data: str) -> str:
    """
    SHA256 encryption
    :param data: Data to be encrypted
    """
    return hashlib.sha256(data.encode("utf-8")).hexdigest()


def compute_auth(method:str, nonce, nc, realm) -> dict:
    """
    Compute encryption
    :param method: Interface method
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
