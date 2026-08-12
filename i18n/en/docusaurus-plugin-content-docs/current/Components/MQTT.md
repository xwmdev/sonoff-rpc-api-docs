# MQTT

The MQTT component provides third-party MQTT Broker connection, status publishing, remote control, TLS certificate management, and runtime status query services, and can enable Home Assistant MQTT auto-discovery.

| Method | Description |
| --- | --- |
| MQTT.SetConfig | Set MQTT configuration |
| MQTT.GetConfig | Get MQTT configuration |
| MQTT.GetStatus | Get MQTT runtime status |
| MQTT.GetCertsInfo | Query uploaded certificate filenames |
| MQTT.PutUserCA | Upload or delete custom CA certificate |
| MQTT.PutTLSClientCert | Upload or delete TLS client certificate |
| MQTT.PutTLSClientKey | Upload or delete TLS client private key |


## Methods
Methods supported by the MQTT component.

### MQTT.SetConfig
Set MQTT configuration. Requests must wrap the configuration object using `params.config`; passing configuration fields directly under `params` is not supported.

Fields not included in `config` retain their current values; passing `null` for string fields clears them.

**Request**

| Property | Type | Description |
| --- | --- | --- |
| config | object | MQTT configuration object, required |

For more information on the `config` property, refer to the `config` data structure.

**Response**

| Property | Type | Description |
| --- | --- | --- |
| - | object | Returns empty object `{}` on success |


### MQTT.GetConfig
Get the current MQTT configuration.

**Request**

None.

**Response**

The response content of `MQTT.GetConfig` is described in the `config` data structure.

**Note:** The `pass` field in the response always returns `null`; the MQTT password is never echoed back.

### MQTT.GetStatus
Get the current runtime status of the MQTT component.

**Request**

None.

**Response**

> **Compatibility Note:** The documentation only defines and recommends using `connected`. The actual content returned by the device may include additional fields, but other fields are not recommended for use and will be removed in future versions; use the corresponding component's configuration or status query methods for related configuration and status.

| Property | Type | Description |
| --- | --- | --- |
| connected | boolean | Whether MQTT is connected to the Broker |


### MQTT.GetCertsInfo
Query the currently saved MQTT TLS certificate filenames.

**Request**

None.

**Response**

| Property | Type | Description |
| --- | --- | --- |
| ca_cert_name | string or null | Custom CA certificate filename. `null` if not uploaded |
| client_cert_name | string or null | TLS client certificate filename. `null` if not uploaded |
| client_key_name | string or null | TLS client private key filename. `null` if not uploaded |


### MQTT.PutUserCA
Upload or delete MQTT custom CA certificate PEM data. This certificate is used when `ssl_ca` is set to `user_ca.pem`.

**Request**

| Property | Type | Description |
| --- | --- | --- |
| name | string | Filename, cannot be empty, maximum 64 bytes |
| data | string or null | PEM content. Passing `null` deletes the certificate |
| append | boolean | Whether to append as a sub-packet. `true`: append; `false` or omitted: end of packet and save |


**Note:** When `append=true`, `data` cannot be `null`. The maximum total length of a single certificate PEM is 4096 bytes.

**Response**

| Property | Type | Description |
| --- | --- | --- |
| len | number | Current saved or received data length, range `0` to `4096`; `0` on successful deletion |


### MQTT.PutTLSClientCert
Upload or delete MQTT TLS client certificate PEM data. Used for Brokers that require mutual TLS authentication.

**Request**

| Property | Type | Description |
| --- | --- | --- |
| name | string | Filename, cannot be empty, maximum 64 bytes |
| data | string or null | PEM content. Passing `null` deletes the certificate |
| append | boolean | Whether to append as a sub-packet. `true`: append; `false` or omitted: end of packet and save |


**Note:** When `append=true`, `data` cannot be `null`. The maximum total length of a client certificate PEM is 4096 bytes.

**Response**

| Property | Type | Description |
| --- | --- | --- |
| len | number | Current saved or received data length, range `0` to `4096`; `0` on successful deletion |


### MQTT.PutTLSClientKey
Upload or delete MQTT TLS client private key PEM data. Used for Brokers that require mutual TLS authentication.

**Request**

| Property | Type | Description |
| --- | --- | --- |
| name | string | Filename, cannot be empty, maximum 64 bytes |
| data | string or null | PEM content. Passing `null` deletes the private key |
| append | boolean | Whether to append as a sub-packet. `true`: append; `false` or omitted: end of packet and save |


**Note:** When `append=true`, `data` cannot be `null`. The maximum total length of a client private key PEM is 4096 bytes.



**Response**

| Property | Type | Description |
| --- | --- | --- |
| len | number | Current saved or received data length, range `0` to `4096`; `0` on successful deletion |


## Data Structures
Data structures related to the MQTT component.

### config
`config` is used in `MQTT.SetConfig` requests and `MQTT.GetConfig` responses.

| Property | Type | Description |
| --- | --- | --- |
| enable | boolean | Whether to enable the MQTT connection. Optional in `MQTT.SetConfig` requests |
| enable_ha | boolean | Whether to enable Home Assistant MQTT auto-discovery. Optional in `MQTT.SetConfig` requests |
| rpc_ntf | boolean | Whether to allow sending RPC notifications via MQTT. Optional in `MQTT.SetConfig` requests |
| status_ntf | boolean | Whether to allow automatic publishing of MQTT status. Optional in `MQTT.SetConfig` requests |
| debug_output | boolean | Whether to output livelog debug logs via MQTT. Optional in `MQTT.SetConfig` requests |
| server | string or null | Broker address, format `host` or `host:port`; `host` maximum 128 bytes, total string length not exceeding 128 bytes, port range `1` to `65535`. Passing `null` in a request clears it; `null` in response when not configured |
| userName | string or null | Broker username, maximum 64 bytes. Passing `null` in a request clears it; `null` in response when not configured |
| pass | string or null | Broker password, maximum 64 bytes. Passing `null` in a request clears it; always `null` in response (password is never echoed) |
| clientId | string or null | MQTT Client ID, maximum 64 bytes. Passing `null` or an empty string in a request auto-generates it on the device; `null` in response when not configured |
| ssl_ca | string or null | TLS CA source. `null` or empty string: TLS disabled; `*`: system CA Bundle; `ca.pem`: built-in firmware CA; `user_ca.pem`: user-uploaded CA |


## MQTT Setup and Usage
This section provides a complete example of configuring a device to connect to an MQTT Broker, checking the connection status, subscribing to device messages, and calling device methods via MQTT.

The example uses the following parameters:

| Parameter | Example value |
| --- | --- |
| Device IP | `172.20.66.148` |
| MQTT Broker | `broker.hivemq.com:1883` |
| Device ID (Topic root path) | `sonoffmini1gsp-acebe61fae74` |
| MQTT RPC request source | `sonoff-doc-client` |

> **Note:** Public Brokers are only suitable for functional verification. In actual deployments, use a controlled private Broker and configure username, password, or TLS according to security requirements.

### Step 1: Prepare MQTT Broker and Client Tools
Ensure both the device and the test computer can reach the target Broker, and install Mosquitto client tools (including `mosquitto_pub` and `mosquitto_sub`) on the computer.

The following commands use these environment variables:

```bash
export MQTT_SERVER="broker.hivemq.com"
export MQTT_PORT=1883
export SONOFF_ID="sonoffmini1gsp-acebe61fae74"
export RPC_SRC="sonoff-doc-client"
```

If the Broker requires a username and password, add `-u <username> -P <password>` to each subsequent `mosquitto_pub` and `mosquitto_sub` command.

### Step 2: Query the Current MQTT Configuration
Use a WebSocket RPC client to connect to `ws://172.20.66.148/rpc`, then send:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "src": "web",
  "method": "MQTT.GetConfig",
  "params": {}
}
```

Focus on checking the `config.enable` and `config.server` values in the response. If MQTT is not enabled or the Broker address is incorrect, proceed to the next step.

### Step 3: Set Up MQTT Connection
The following request enables MQTT, status publishing, RPC notifications, and Home Assistant auto-discovery, and sets up a plain TCP Broker without authentication:

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "src": "web",
  "method": "MQTT.SetConfig",
  "params": {
    "config": {
      "enable": true,
      "enable_ha": true,
      "server": "broker.hivemq.com:1883",
      "userName": null,
      "pass": null,
      "clientId": "mini-1gsp-demo",
      "ssl_ca": null,
      "rpc_ntf": true,
      "status_ntf": true,
      "debug_output": false
    }
  }
}
```

If the Broker requires authentication, replace `userName` and `pass` with the actual credentials. After successful configuration, the device automatically rebuilds the MQTT connection without requiring a device restart. For TLS and mutual TLS configuration, refer to the certificate upload methods and `config.ssl_ca` description in this document.

### Step 4: Check If MQTT Is Connected
After waiting a few seconds, send via the device WebSocket RPC channel:

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "src": "web",
  "method": "MQTT.GetStatus",
  "params": {}
}
```

When the `connected` value in the response is `true`, the device has connected to the Broker. If `false`, check the Broker address and port, network reachability, username and password, and TLS certificate configuration.

### Step 5: Subscribe to Online Status and Device Status
The device publishes online status to `<sonoff-id>/online` and device status to `<sonoff-id>/status`. Run:

```bash
mosquitto_sub -h ${MQTT_SERVER} -p ${MQTT_PORT} -v \
  -t "${SONOFF_ID}/online" \
  -t "${SONOFF_ID}/status"
```

When the device is online, the payload of `<sonoff-id>/online` is `online`; when the device disconnects abnormally, the Broker publishes `offline` via the last will message. With `status_ntf` enabled, `<sonoff-id>/status` receives retained JSON status data.

### Step 6: Call Device Methods via MQTT
First subscribe to `<src>/rpc` to receive request responses:

```bash
mosquitto_sub -h ${MQTT_SERVER} -p ${MQTT_PORT} -v \
  -t "${RPC_SRC}/rpc"
```

In another terminal, publish a request to `<sonoff-id>/rpc`, for example, querying the switch status:

```bash
mosquitto_pub -h ${MQTT_SERVER} -p ${MQTT_PORT} \
  -t "${SONOFF_ID}/rpc" \
  -m '{"jsonrpc":"2.0","id":100,"src":"sonoff-doc-client","method":"Switch.GetStatus","params":{"id":1}}'
```

The device publishes the response to `sonoff-doc-client/rpc`. Device notifications are published to `<sonoff-id>/events/rpc`; refer to the general RPC documentation for the complete rules on MQTT RPC requests, responses, and notifications.


## MQTT Control
MQTT Control provides a simplified control method that does not require constructing complete RPC requests. External systems publish text payloads to fixed command topics to control the corresponding component. Before using this feature, `config.enable` in the MQTT configuration must be set to `true`.

The default `<topic_root>` is the same as the device ID, which can be confirmed from the `src` field of device RPC responses. Command topics do not return independent responses; after the command is successfully executed, the device publishes the updated retained state to `<topic_root>/status`. Invalid payloads may be ignored; the controlling side should confirm the final result via the status topic.

Boolean commands uniformly support case-insensitive `ON`, `OFF`, `true`, `false`, as well as `1`, `0`.

### Common Topics
| Topic | Payload | Description |
| --- | --- | --- |
| `<topic_root>/status` | JSON object | Device status, retained message; see the status definitions in this document for field descriptions |
| `<topic_root>/online` | `online` or `offline` | MQTT online status, retained message; `offline` is also used as a last will message |


## Event Notifications
Event notifications supported by the MQTT component.

### config_changed
After the MQTT configuration changes, the device sends a `NotifyEvent` event notification.

The `component` in the event item is always `mqtt`, `id` is always `1`, and `event` is always `config_changed`, with no additional business fields. The `ts` in the notification and event items is a UTC Unix timestamp in seconds, which may include decimals.



## Examples
Examples of MQTT component methods and events.

### MQTT.SetConfig Example
Setting up a plain MQTT connection:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "src": "web",
  "method": "MQTT.SetConfig",
  "params": {
    "config": {
      "enable": true,
      "enable_ha": true,
      "server": "192.168.3.29:1883",
      "userName": "mqtt_user",
      "pass": "mqtt_password",
      "clientId": "mini-1gsp-demo",
      "ssl_ca": null,
      "rpc_ntf": true,
      "status_ntf": true,
      "debug_output": false
    }
  }
}
```

**Success Response**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 1,
  "result": {}
}
```

Setting up a TLS MQTT connection with a custom CA:

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "src": "web",
  "method": "MQTT.SetConfig",
  "params": {
    "config": {
      "enable": true,
      "server": "192.168.3.29:8883",
      "ssl_ca": "user_ca.pem"
    }
  }
}
```

### MQTT.GetConfig Example
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "src": "web",
  "method": "MQTT.GetConfig",
  "params": {}
}
```

**Success Response**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 3,
  "result": {
    "config": {
      "enable": true,
      "enable_ha": true,
      "rpc_ntf": true,
      "status_ntf": true,
      "debug_output": false,
      "server": "192.168.3.29:1883",
      "userName": "mqtt_user",
      "pass": null,
      "clientId": "mini-1gsp-demo",
      "ssl_ca": null
    }
  }
}
```

### MQTT.GetStatus Example
```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "src": "web",
  "method": "MQTT.GetStatus",
  "params": {}
}
```

**Success Response**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 4,
  "result": {
    "connected": true
  }
}
```

### MQTT.GetCertsInfo Example
```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "src": "web",
  "method": "MQTT.GetCertsInfo",
  "params": {}
}
```

**Success Response**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 5,
  "result": {
    "ca_cert_name": "ca.crt",
    "client_cert_name": "device.crt",
    "client_key_name": "device.key"
  }
}
```

### MQTT.PutUserCA Example
Uploading a custom CA:

```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "src": "web",
  "method": "MQTT.PutUserCA",
  "params": {
    "name": "ca.crt",
    "append": false,
    "data": "-----BEGIN CERTIFICATE-----\nMIIC...\n-----END CERTIFICATE-----\n"
  }
}
```

**Success Response**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 6,
  "result": {
    "len": 1024
  }
}
```

Deleting a custom CA:

```json
{
  "jsonrpc": "2.0",
  "id": 7,
  "src": "web",
  "method": "MQTT.PutUserCA",
  "params": {
    "name": "ca.crt",
    "data": null
  }
}
```

**Success Response**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 7,
  "result": {
    "len": 0
  }
}
```

### MQTT.PutTLSClientCert Example
```json
{
  "jsonrpc": "2.0",
  "id": 8,
  "src": "web",
  "method": "MQTT.PutTLSClientCert",
  "params": {
    "name": "device.crt",
    "append": false,
    "data": "-----BEGIN CERTIFICATE-----\nMIIC...\n-----END CERTIFICATE-----\n"
  }
}
```

**Success Response**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 8,
  "result": {
    "len": 1024
  }
}
```

### MQTT.PutTLSClientKey Example
```json
{
  "jsonrpc": "2.0",
  "id": 9,
  "src": "web",
  "method": "MQTT.PutTLSClientKey",
  "params": {
    "name": "device.key",
    "append": false,
    "data": "-----BEGIN PRIVATE KEY-----\nMIGH...\n-----END PRIVATE KEY-----\n"
  }
}
```

**Success Response**

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "web",
  "id": 9,
  "result": {
    "len": 1024
  }
}
```

### Notification Example
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
        "component": "mqtt",
        "id": 1,
        "event": "config_changed",
        "ts": 1626221112
      }
    ]
  }
}
```
