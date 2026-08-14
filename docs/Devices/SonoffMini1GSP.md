# SonoffMini1GSP

Sonoff MINI 1GSP 是一款功能丰富的单通道设备。该设备内置电能计量功能，可实时测量该通道的功率和能耗。

## 组件列表

Sonoff MINI 1GSP 提供以下组件：

* [Sonoff](../Components/Sonoff.md) — 设备管理（基础组件，所有设备通用）
* [System](../Components/System.md) — 系统状态、时间与时区、重启与恢复出厂
* [WiFi](../Components/WiFi.md) — 网络配置
* [Cloud](../Components/Cloud.md) — 易微联云端连接
* [Matter](../Components/Matter.md) — Matter 配网
* [MQTT](../Components/MQTT.md) — 第三方 MQTT Broker 连接
* [WebSocket](../Components/WebSocket.md) — 出站 WebSocket
* [Switch (switch:1)](../Components/Switch.md) — 开关（继电器）组件，实例固定为 `1`
* [Input (input:1)](../Components/Input.md) — 外接开关组件，实例固定为 `1`
* [Meter](../Components/Meter.md) — 电量计量组件
* [Timer](../Components/Timer.md) — 定时器
* [Ota](../Components/Ota.md) — 固件升级

## 使用说明

- 首次使用设备前，需先完成联网与初始配置并设置访问密码，具体流程见[快速开始](../QuickStart.md)。
- 本设备为单通道设备，`Switch` 与 `Input` 组件均只有实例 `id=1`，调用相关方法时需传入 `"id":1`。
- 设备内置电能计量，可通过 [Meter](../Components/Meter.md) 组件查询电压、电流、功率和用电量等数据。
- 组件的取值范围（如最大开关数、定时器数量等）以各组件文档及设备实际能力为准。

## 例外与注意事项

- 通用方法（`GetStatus`、`GetConfig`、`SetConfig`）的具体支持情况以各组件文档为准。
- [Cloud](../Components/Cloud.md)、[MQTT](../Components/MQTT.md)、[Matter](../Components/Matter.md) 等组件需要设备可访问互联网才能正常工作。
- 各通道（HTTP / WebSocket / MQTT）的支持范围与用法见 [RPC 传输通道](../General/RPCChannels.md)。
