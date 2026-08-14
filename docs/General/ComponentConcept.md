---
sidebar_position: 4
---

# 组件概念

组件是一个封装的功能单元，它对外暴露方法用于与外部通信。每个组件都有一个状态(status)和一个配置(configuration)。大多数组件都支持以下通用方法：`<组件名>.GetStatus`、`<组件名>.GetConfig`、`<组件名>.SetConfig`。这些方法的行为是一致的，仅在配置和状态结构的格式上有所不同。但并非每个组件都完整支持这三个方法，具体支持的方法以各组件文档为准。

## 状态(Status)

状态包含组件的所有运行时特征。要获取组件的状态，可以使用 **`<组件名>.GetStatus`** 方法。由于状态特征是运行时的，它们不能被直接设置，因此设备只支持 `<组件名>.GetStatus` 方法（不支持 `<组件名>.SetStatus`）。

`<组件名>.GetStatus` 方法返回一个特定于所选组件的对象。如果设备中有多个该组件的实例，则需要传入 `id` 参数。否则，`<组件名>.GetStatus` 不需要参数。例如，要获取 `id=1` 的 Switch 实例状态：

```
curl -X POST -d '{"id":1, "src":"user_1", "method":"Switch.GetStatus", "params":{"id":1}}' http://${SONOFF}/rpc
```

对于只有单一实例的组件（如 Cloud），请求帧无需 `id` 参数：

```
curl -X POST -d '{"id":1, "src":"user_1", "method":"Cloud.GetStatus"}' http://${SONOFF}/rpc
```

## 配置(Configuration)

配置包含组件的所有配置参数。使用 **`<组件名>.GetConfig`** 可以获取组件配置，使用 **`<组件名>.SetConfig`** 可以更新组件的配置参数。

### `<组件名>.GetConfig`

与 `<组件名>.GetStatus` 类似，如果设备中有多个组件实例，`<组件名>.GetConfig` 需要传入 `id` 参数。否则，不需要参数。响应将包含配置结构。

```
curl -X POST -d '{"id":1, "src":"user_1", "method":"Switch.GetConfig", "params":{"id":1}}' http://${SONOFF}/rpc
```

### `<组件名>.SetConfig`

组件的配置可以通过 **`<组件名>.SetConfig`** 方法进行设置。如果需要，它也接受组件的 `id` 作为参数。此外，它还需要 **必需的** `config` 参数——一个 JSON 对象，包含要应用的配置。该对象的结构应与 `<组件名>.GetConfig` 返回的 JSON 结构一致，但只需包含需要修改的字段。注意：不同组件的传参方式有所不同——部分组件直接将配置字段放入 `params` 中，而另一些组件需要通过 `params.config` 包裹配置对象。详情请参阅各组件文档。`<组件名>.SetConfig` 的响应是一个 JSON 对象。

将 id=1 的 Switch 组件通电反应设置为上电保持：

```
curl -X POST -d '{"id":1, "src":"user_1", "method":"Switch.SetConfig", "params":{"id":1, "config":{"startup":{"startup":"stay"}}}}' http://${SONOFF}/rpc
```
