# SonoffMini1GSP

The Sonoff MINI 1GSP is a feature-rich single-channel device. The device has built-in energy metering capabilities, allowing real-time measurement of power and energy consumption on this channel.

## Component List

The Sonoff MINI 1GSP provides the following components:

* [Sonoff](../Components/Sonoff.md) — Device management (base component, common to all devices)
* [System](../Components/System.md) — System status, time and timezone, reboot and factory reset
* [WiFi](../Components/WiFi.md) — Network configuration
* [Cloud](../Components/Cloud.md) — eWeLink cloud connection
* [Matter](../Components/Matter.md) — Matter commissioning
* [MQTT](../Components/MQTT.md) — Third-party MQTT Broker connection
* [WebSocket](../Components/WebSocket.md) — Outbound WebSocket
* [Switch (switch:1)](../Components/Switch.md) — Switch (relay) component, instance fixed to `1`
* [Input (input:1)](../Components/Input.md) — External switch component, instance fixed to `1`
* [Meter](../Components/Meter.md) — Energy metering component
* [Timer](../Components/Timer.md) — Timers
* [Ota](../Components/Ota.md) — Firmware updates

## Usage Notes

- Before first use, connect the device to the network, complete the initial configuration and set an access password. See [Quick Start](../QuickStart.md).
- This is a single-channel device; both the `Switch` and `Input` components only have instance `id=1`. Pass `"id":1` when calling the related methods.
- The device has built-in energy metering. Use the [Meter](../Components/Meter.md) component to query voltage, current, power and energy consumption data.
- Value ranges of a component (such as the maximum number of switches or timers) depend on the component documentation and the actual device capabilities.

## Exceptions and Notes

- Whether the common methods (`GetStatus`, `GetConfig`, `SetConfig`) are supported depends on each component's documentation.
- Components such as [Cloud](../Components/Cloud.md), [MQTT](../Components/MQTT.md) and [Matter](../Components/Matter.md) require the device to have internet access to work properly.
- The supported channels and usage (HTTP / WebSocket / MQTT) are described in [RPC Transport Channels](../General/RPCChannels.md).
