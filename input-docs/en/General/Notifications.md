# Notifications

Sonoff components support two types of notifications via the `NotifyStatus` and `NotifyEvent` methods. The structure of notification frames is described in detail on the [RPC Protocol](RPCProtocol#notification-frame) page. For more information about sending notifications over each channel, see the [RPC Channels](RPCChannels) page.

Brief description:

+ Notifications cannot be received via HTTP;
+ To receive notifications via WebSocket, you must send at least one request frame containing a valid `src`;
+ To receive notifications via MQTT, you must subscribe to the topic `<sonoff-id>/events/rpc`.

## NotifyStatus

This method is used to notify changes in component state, carrying the changed information. It is defined as follows:

+ `method`: "NotifyStatus"
+ `params`:

| Property | Type | Description |
| --- | --- | --- |
| `ts` | _number_ | Unix timestamp (UTC), in seconds |
| `<component>` | _object_ | Same structure as the component state object. `<component>` should be replaced with the component type (e.g. `cloud`, `wifi`, `mqtt`). If there are multiple instances of this component type, `<component>` will be replaced with `component_type:id` (e.g. `switch:1`, `input:1`) |

The intended use of these notifications is to overlay changes from `NotifyStatus` onto the known state; the result should be consistent with calling a fresh `GetStatus`.

Example 1:

Notifying a Switch state change:

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

Notifying a Cloud component state change:

```json
{
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "method": "NotifyStatus",
   "params": {
      "ts": 1234567890,
      "cloud": {
         "enable": true,
         "pair_status": true,
         "online_status": true
      }
   }
}
```

## NotifyEvent

This method is used to notify that an event has occurred which is not reflected in the component's state (e.g. button press, configuration change, etc.). It is defined as follows:

+ `method`: "NotifyEvent"
+ `params`:

| Property | Type | Description |
| --- | --- | --- |
| `ts` | _number_ | Unix timestamp (UTC), in seconds |
| `events` | _array of objects_ | Contains all events that occurred. Each JSON object describes one event and contains different properties depending on the event type |

Each JSON object in the `events` array has the following common properties:

| Property | Type | Description |
| --- | --- | --- |
| `ts` | _number_ | Unix timestamp (UTC) when the event occurred, in seconds |
| `component` | _string_ | Component key (`component_type[:id]`, e.g. `switch:1`, `input:1`, `cloud`) |
| `event` | _string_ | Event name |

Some events also contain an `id` field indicating the specific component instance.

Example 1:

Notifying that the Input component configuration has changed:

```json
{
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "method": "NotifyEvent",
   "params": {
      "ts": 1626221112,
      "events": [
         {
            "component": "input:1",
            "id": 1,
            "event": "config_changed",
            "ts": 1626221112
         }
      ]
   }
}
```

### Common Event Notifications

The following notifications are common to all functional components and system components.

#### Configuration Changed (config_changed)

When a component's configuration changes, the device will emit this event notification. Upon receiving a configuration change event, the receiver should call the corresponding component's `GetConfig` to obtain the latest configuration.

Example:

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
