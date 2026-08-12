---
sidebar_position: 2
---

# RPC Transport Channels

The device supports communication over multiple RPC channels.

## HTTP

HTTP is used for one-shot request-response calls. It does not support maintaining a persistent connection, and notifications cannot be sent or received over this channel. When authentication is enabled, it is protected by [HTTP Digest Authentication](Authentication).

The client POSTs to the device endpoint `/rpc`, providing the entire JSON RPC call frame as the payload:

```shell
> POST /rpc HTTP/1.1
> Content-Type: application/json
> Content-Length: 75
> 
> {"id":1, "src":"user_1", "method":"Switch.Set","params":{"id":1,"on":true}}
< HTTP/1.1 200 OK
< Content-Type: application/json
< Content-Length: 56
< Connection: close
< 
< {"id":1,"src":"sonoffmini1gsp-acebe61fae74","result":{}}
```

The response is also a full response frame.

Example:

Set an environment variable for connecting to the device IP address 192.168.33.1:

```bash
export SONOFF=192.168.33.1
```

HTTP POST request calling the Switch.Set method:

```bash
curl -X POST -d '{"id":2, "src":"user_1", "method":"Switch.Set", "params":{"id":1, "on":true}}' "http://${SONOFF}/rpc"
```

## WebSocket

The connection remains active throughout the entire communication process (not limited to a single request-response pair), consistent with how the local web interface works. Each Sonoff device provides a WebSocket endpoint that clients can connect to for communication with the device. This channel supports protection via [Digest Authentication](Authentication).

The WebSocket channel service address is `ws://${SONOFF}/rpc`. The client must send at least one request frame containing a valid `src` field in order to receive notifications from the device.

Example:

Connect to the device via WebSocket and call the Switch.Set method:

```bash
websocat -c ws://${SONOFF}/rpc
{"id":2, "src":"user_1", "method":"Switch.Set", "params":{"id":1, "on":true}}
```

## MQTT

This is a publish-subscribe based communication method. Each client can subscribe to and publish to specific topics. The connection is established by the client for subscribing to topics or publishing messages to topics on the MQTT broker. For a client to communicate with a device, both the device and client must be connected to the same MQTT broker, or a set of interconnected brokers.

+ **Request Publish Topic**: `<sonoff-id>/rpc`
     To send a request to the device, publish a request frame to this topic, replacing `<sonoff-id>` with the device's ID. For example: `sonoffmini1gsp-acebe61fae74/rpc`.

+ **Response Receive Topic**: `<src>/rpc`
     To receive responses to sent requests, subscribe to this topic, replacing `<src>` with the source defined in the request frame. For example, if the request frame contains `"src":"user_1"`, the topic is `user_1/rpc`.

+ **Notification Receive Topic**: `<sonoff-id>/events/rpc`
     To receive notifications from the device, subscribe to this topic, replacing `<sonoff-id>` with the device's ID. For example: `sonoffmini1gsp-acebe61fae74/events/rpc`.

+ **Online Status Topic**: `<sonoff-id>/online`
     The device publishes `online` on this topic to indicate that it is connected to MQTT; when any of the following occurs, the broker will publish `offline` as the device's Last Will and Testament (LWT) message:
    + The broker detects an I/O error or network failure.
    + The client fails to communicate within the defined keep-alive period.
    + The client closes the network connection without sending a DISCONNECT packet.
    + The broker closes the network connection due to a protocol error.

Example 1:

Set environment variables for the MQTT server and port to connect to:

```bash
export MQTT_SERVER="broker.hivemq.com"
export MQTT_PORT=1883
```

Example 2:

Request to call the Switch.Set method, publish to topic `sonoffmini1gsp-acebe61fae74/rpc`:

```bash
mosquitto_pub -h ${MQTT_SERVER} -p ${MQTT_PORT} -t sonoffmini1gsp-acebe61fae74/rpc \
 -m '{"id":123, "src":"user_1", "method":"Switch.Set", "params":{"id":1,"on":true}}'
```

Response:

```bash
On topic user_1/rpc:
payload {"id":123,"src":"sonoffmini1gsp-acebe61fae74","dst":"user_1","result":{}}
```

Example 3:

Subscribe to topic `user_1/rpc` to receive responses:

```bash
mosquitto_sub -h ${MQTT_SERVER} -p ${MQTT_PORT} -t user_1/rpc
```

Example 4:

Subscribe to topic `sonoffmini1gsp-acebe61fae74/events/rpc` to receive notifications:

```bash
mosquitto_sub -h ${MQTT_SERVER} -p ${MQTT_PORT} -t sonoffmini1gsp-acebe61fae74/events/rpc
```

## Utilities

Various tools are available for sending requests to Sonoff devices and receiving responses.

> **Note:** The following commands are based on Unix-style environments (Linux / macOS, or WSL / Git Bash on Windows). Windows 10 and above include `curl` by default; tools like `websocat` and `mosquitto` must be installed separately.

### curl

`curl` is a command-line tool and library for transferring data via URLs. It can be used to call RPC methods over HTTP.

Tip: You can set the `SONOFF` environment variable to conveniently run `curl` examples:

```bash
export SONOFF=yourSonoffIPOrHostname
```

### websocat

`websocat` is a command-line WebSocket multi-purpose tool.

Tip: You can set the `SONOFF` environment variable to conveniently run `websocat` examples:

```bash
export SONOFF=yourSonoffIPOrHostname
```

### mosquitto

MQTT broker and client tools. Includes CLI tools: `mosquitto_pub` and `mosquitto_sub`. On Ubuntu, these tools are packaged as `mosquitto-clients`.

Tip: You can set the following environment variables to conveniently run `mosquitto` examples:

```bash
export MQTT_SERVER=yourMQTTServer
export MQTT_PORT=yourPort
```
