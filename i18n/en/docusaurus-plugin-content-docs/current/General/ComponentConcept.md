---
sidebar_position: 4
---

# Component Concept

A component is an encapsulated functional unit that exposes methods for communicating with the outside world. Each component has a status and a configuration. Most components support the following common methods: `<ComponentName>.GetStatus`, `<ComponentName>.GetConfig`, `<ComponentName>.SetConfig`. The behavior of these methods is consistent, differing only in the format of the configuration and status structures. However, not every component supports all three of these methods; for the methods actually supported, refer to the corresponding component documentation.

## Status

Status contains all runtime characteristics of a component. To obtain a component's status, use the **`<ComponentName>.GetStatus`** method. Since status characteristics are runtime properties, they cannot be set directly; therefore, the device only supports the `<ComponentName>.GetStatus` method (not `<ComponentName>.SetStatus`).

The `<ComponentName>.GetStatus` method returns an object specific to the selected component. If there are multiple instances of the component in the device, an `id` parameter is required. Otherwise, `<ComponentName>.GetStatus` takes no parameters. For example, to get the status of the Switch instance with `id=1`:

```
curl -X POST -d '{"id":1, "method":"Switch.GetStatus", "params":{"id":1}}' http://${SONOFF}/rpc
```

For components with only a single instance (e.g. Cloud), the request frame does not require an `id` parameter:

```
curl -X POST -d '{"id":1, "method":"Cloud.GetStatus"}' http://${SONOFF}/rpc
```

## Configuration

Configuration contains all the configuration parameters of a component. Use **`<ComponentName>.GetConfig`** to obtain a component's configuration, and **`<ComponentName>.SetConfig`** to update the component's configuration parameters.

### `<ComponentName>.GetConfig`

Similar to `<ComponentName>.GetStatus`, if there are multiple component instances in the device, `<ComponentName>.GetConfig` requires an `id` parameter. Otherwise, no parameters are needed. The response will contain the configuration structure.

```
curl -X POST -d '{"id":1, "method":"Switch.GetConfig", "params":{"id":1}}' http://${SONOFF}/rpc
```

### `<ComponentName>.SetConfig`

A component's configuration can be set via the **`<ComponentName>.SetConfig`** method. If needed, it also accepts the component's `id` as a parameter. Additionally, it requires the **required** `config` parameter — a JSON object containing the configuration to apply. The structure of this object should match the JSON structure returned by `<ComponentName>.GetConfig`, but only needs to include the fields being modified. Note: Different components pass parameters differently — some place configuration fields directly into `params`, while others require wrapping the configuration object in `params.config`. Please refer to the individual component documentation for details. The response of `<ComponentName>.SetConfig` is a JSON object.

Set the power-on behavior of the Switch component with id=1 to stay-on:

```
curl -X POST -d '{"id":1, "method":"Switch.SetConfig", "params":{"id":1, "config":{"startup":{"startup":"stay"}}}}' http://${SONOFF}/rpc
```
