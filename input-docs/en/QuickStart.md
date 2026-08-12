# Quick Start

This guide helps you quickly verify protocol connectivity.

## Prerequisites

- A powered-on Sonoff device.
- A computer on the same LAN as the device, with `curl` (or `websocat` / Python 3) installed.
- The device is connected to the network, and the computer can reach the device.

> **Note:** The example commands are based on Unix-style environments (Linux / macOS, or WSL / Git Bash on Windows). Windows 10 and above include `curl`, but commands such as `export`, `websocat`, and `sha256sum` are not available in the native command line (cmd / PowerShell). It is recommended to run the examples through WSL or Git Bash, or replace the environment variables in the examples with actual values directly.

## Get the Device IP

Before using the device for the first time, you need to complete the initial setup (network connection). The initial setup procedure may vary by device model; please refer to the corresponding device manual for details. Devices typically support the Web backend and AP mode: when using for the first time, you can connect to the AP hotspot emitted by the device, access the device web page via a browser to complete the initial login and network configuration, without relying on other apps or ecosystems.

Once the device is connected to the network, you can obtain the device IP by any of the following methods:

- Device list in the router admin panel;
- Device details page in the device web backend or the manufacturer's app.

After obtaining the IP, export the environment variable first (all subsequent examples depend on it):

```bash
export SONOFF=192.168.1.100
```

## Verify Protocol Connectivity

The device exposes the RPC endpoint `/rpc` over the HTTP channel. Call `Sonoff.GetDeviceInfo`, which does not require authentication, to confirm the device is online:

```bash
curl -X POST -d '{"id":1,"src":"user_1","method":"Sonoff.GetDeviceInfo"}' http://${SONOFF}/rpc
```

Example response:

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

Pay attention to the following fields:

| Field | Description |
| --- | --- |
| `id` | Device ID, formatted as `sonoffmodel-macaddress`, used in subsequent authentication and other scenarios |
| `ver` | Firmware version |
| `initial_password` | `false` means no password has been set yet; you need to set one in the next step |

`Sonoff.GetDeviceInfo` is one of the few methods that do not require authentication. All other interfaces require authentication credentials once authentication is enabled.

## Set an Access Password

Only perform this step if `initial_password` was `false` in the previous step.
If you have already set a password via the web interface, you can skip this step.

Call `Sonoff.SetAuth` to set a password. `user` is always `admin`, and `realm` is the device ID:

```bash
curl -X POST -d '{"id":2,"src":"user_1","method":"Sonoff.SetAuth","params":{"user":"admin","realm":"sonoffmini1gsp-acebe61fae74","ha1":"<computed ha1>"}}' http://${SONOFF}/rpc
```

`ha1` is calculated as follows (see [Authentication](General/Authentication) for full details):

```
ha1 = SHA256(admin:<realm>:<password>)
```

For example, if the password is `12345678`:

```bash
echo -n "admin:sonoffmini1gsp-acebe61fae74:12345678" | sha256sum
```

## First Authenticated Call

After setting a password, protected methods require authentication credentials. The following examples demonstrate calling `Sonoff.GetConfig` over HTTP and WebSocket respectively.

### HTTP

`curl`'s `--digest` automatically completes the 401 challenge-response flow and retries the request:

```bash
curl -X POST --digest -u admin:12345678 \
     -d '{"id":1,"src":"user_1","method":"Sonoff.GetConfig"}' http://${SONOFF}/rpc
```

### WebSocket

After connecting to WebSocket, first send a request without authentication, extract `nonce`, `nc`, and `realm` from the returned 401 error, calculate the `auth` field, then send again:

```bash
websocat ws://${SONOFF}/rpc
# First attempt (no auth):
{"id":1, "src":"user_1", "method":"Sonoff.GetConfig"}
# With auth:
{"id":2, "src":"user_1", "method":"Sonoff.GetConfig", "auth": {"realm":"sonoffmini1gsp-acebe61fae74","username":"admin","nonce":"<nonce>","nc":1,"cnonce":<random>,"response":"<computed>","algorithm":"SHA-256"}}
```

For the full calculation of the `auth` field, see [Authentication](General/Authentication).

## Next Steps

- Learn the three frame structures (request, response, notification): [RPC Protocol](General/RPCProtocol)
- Choose a communication method: [RPC Transport Channels](General/RPCChannels)
- Look up component interfaces: component documentation under `Components/`
- Check the component range supported by a device: `Devices/`
