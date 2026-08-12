---
sidebar_position: 1
---

# RPC Protocol

The device is monitored and controlled via the **JSON-RPC 2.0** protocol.

According to the specification, each procedure is a method with a method name (e.g. `Switch.GetConfig`), accepting a JSON object as parameters (e.g. `{"id":1}`), and returning a JSON object as the result (e.g. `{}`). Methods are organized by namespace, for example:

+ `Sonoff` — Device management
    + `Sonoff.GetDeviceInfo`
    + `Sonoff.GetConfig`
    + `Sonoff.SetAuth` and more
+ `Switch` — Switch (relay) component
    + `Switch.Set`
    + `Switch.GetConfig` and more
+ `System` — System component
    + `System.GetStatus`
    + `System.GetConfig` and more

There are three types of frames in the communication between the user and the device:

+ Request Frame
+ Response Frame
+ Notification Frame

## Request Frame

A request frame is a JSON object containing the following properties:

| Property | Type | Description |
| --- | --- | --- |
| `jsonrpc` | _string_ | _2.0_. The jsonrpc version used. **May be omitted** |
| `id` | _number or string_ | Identifier for this request, used to match the response frame. **Required** |
| `src` | _string_ | Name of the request source (you can choose any string to identify yourself as the request source). **Required** |
| `method` | _string_ | Name of the procedure to invoke. **Required** |
| `params` | _object_ | Parameters required by the method (if any). **Optional** |

Example 1:

Request frame calling the Switch.GetConfig method:

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Switch.GetConfig",
   "params": {
      "id":1
   }
}
```

Example 2:

Request frame calling the Switch.Set method:

```json
{
   "id": 2,
   "src":"user_1",
   "method":"Switch.Set",
   "params": {
     "id":1,
     "on":true
   }
}
```

## Response Frame

A response frame is a JSON object containing the following properties:

| Property | Type | Description |
| --- | --- | --- |
| `id` | _number or string_ | Communication identifier |
| `src` | _string_ | Name of the response source |
| `dst` | _string_ | Destination name (i.e. the source of the request) |
| `result` | _object_ | Result of the procedure invocation, returned on success. `result` and `error` are mutually exclusive |
| `error` | _object_ | Contains a description of the error that occurred, returned on failure. `result` and `error` are mutually exclusive. See [Common Error Codes](ErrorCode) for more error codes |

Example 1:

Request succeeds, returning a result object:

```json
{
   "id": 2,
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "result": {}
}
```

Example 2:

Request fails, returning an error object:

```json
{
   "id": 1,
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "error": {
      "code": -100,
      "message": "any error"
   }
}
```

## Notification Frame

A notification frame is a JSON object, similar to a request but not expecting a response. It contains the following properties:

| Property | Type | Description |
| --- | --- | --- |
| `src` | _string_ | Name of the notification source. **Required** |
| `dst` | _string_ | Destination name. **Required** |
| `method` | _string_ | Method being called. **Required** |
| `params` | _object_ | Parameters of the notification. **Required** |

Example 1:

Notification frame for a state change:

```json
{
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "method": "NotifyStatus",
   "params": {
      "ts": 1626221112,
      "switch:1": {
         "id": 1,
         "on": true
      }
   }
}
```

Example 2:

Notification frame for an event occurrence:

```json
{
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "method": "NotifyEvent",
   "params": {
      "ts": 1626221112,
      "events": [
         {
            "component": "switch:1",
            "id": 1,
            "event": "config_changed",
            "ts": 1626221112
         }
      ]
   }
}
```
