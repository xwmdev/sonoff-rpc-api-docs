---
slug: /
sidebar_position: 1
---

# 文档导读

欢迎使用 Sonoff 设备 RPC API 接口文档。

本文档介绍如何通过 RPC API 接口监控和控制 Sonoff 设备。

## 文档结构

- `文档导读`：本页面。
- `快速开始`：指引进行快速上手验证和调试。
- `通用说明/`：通信协议与公共说明，如 RPC 协议、传输通道、认证、错误码、调试日志等。
- `组件与服务/`：各功能组件和服务的接口文档。
- `设备/`：设备文档，说明每款设备支持的组件或服务与使用方式，以及设备的一些例外和特殊说明。
- `变更记录`：此文档协议版本变更记录。

## 推荐阅读顺序

1. 快速开始：先通过 [快速开始](QuickStart.md) 完成设备联网、设置密码并验证协议联通。
2. 理解协议：从 [RPC 协议](General/RPCProtocol.md) 开始，了解 JSON-RPC 2.0 协议与请求帧、应答帧、通知帧三种帧结构；再阅读 [组件概念](General/ComponentConcept.md)，理解组件的「状态」与「配置」。
3. 确定通信方式：通过 [RPC 传输通道](General/RPCChannels.md) 了解 HTTP、WebSocket、MQTT 各通道的用法。
4. 掌握鉴权：开发调试前，先阅读 [认证](General/Authentication.md)，按步骤完成密码设置并掌握 `auth` 字段的补充方式（正文示例中已省略该字段）。
5. 实际开发：在 `组件与服务/` 中查阅所需组件的接口文档。
6. 设备联调：以 `设备/` 中对应设备的文档描述设备支持的组件，以及例外情况，需要加以注意。

## 阅读规则

- 方法名格式为 `组件.方法`，例如 `Switch.Set`；`GetStatus`、`GetConfig`、`SetConfig` 是各组件通用的基础方法。
- 组件文档结构固定：功能简介 → 方法列表 → 方法 → 数据结构 → 事件通知 → 状态通知 → 示例，可按需直接跳转。
- 请求示例中可能省略 `auth` 鉴权参数字段；需按认证说明补充 `auth`。

## 占位符与环境变量

文档中存在两种需要替换的写法，使用前都必须替换为实际值：

- **占位符**（尖括号形式，如 `<component>`）：用于正文描述。
- **环境变量**（`${...}` 形式，如 `${SONOFF}`）：用于命令示例，需先导出或替换为实际值再执行。

### 占位符

| Placeholder | Meaning | Example |
| --- | --- | --- |
| `<component>` | 组件类型 | `cloud`、`wifi`、`switch` |
| `<sonoff-id>` | 设备 ID，形如 `sonoffdevicemodel-XXXXXXXXXXXX` | `sonoffmini1gsp-acebe61fae74` |

### 环境变量

| Variable | Meaning | Example |
| --- | --- | --- |
| ${SONOFF} | 设备 IP 地址 | `192.168.1.100` |
| ${SONOFF_ID} | 设备 ID，形如 `sonoffdevicemodel-XXXXXXXXXXXX` | `sonoffmini1gsp-acebe61fae74` |

注意：占位符与环境变量仅用于文档说明，实际调用时必须替换为真实值。
