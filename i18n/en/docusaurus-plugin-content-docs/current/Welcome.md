---
slug: /
sidebar_position: 1
---

# Document Guide

Welcome to the Sonoff Device RPC API Reference.

This document describes how to monitor and control Sonoff devices through the RPC API.

## Document Structure

- `General/`: General protocols and common notes, such as RPC protocol, transport channels, authentication, error codes, debug logs, etc.
- `Components/`: API documentation for each functional component.
- `Devices/`: Device documentation, describing the components supported by each device and how to use them.
- `Changelog.md`: Changelog.

## Recommended Reading Order

1. Quick Start: Start with [Quick Start](QuickStart.md) to connect the device to the network, set a password, and verify protocol connectivity.
2. Understand the Protocol: Start with [RPC Protocol](General/RPCProtocol.md) to learn about the JSON-RPC 2.0 protocol and the three frame types: request frame, response frame, and notification frame; then read [Component Concept](General/ComponentConcept.md) to understand the "status" and "configuration" of components.
3. Choose a Communication Method: Read [RPC Transport Channels](General/RPCChannels.md) to learn how to use HTTP, WebSocket, and MQTT channels.
4. Master Authentication: Before development and debugging, read [Authentication](General/Authentication.md) first, follow the steps to set a password, and learn how to supply the `auth` field (omitted in body examples).
5. Actual Development: Look up the API documentation for required components under `Components/`.
6. Device Integration: Refer to the corresponding device documentation under `Devices/` for components supported by each device and any exceptions to be aware of.

## Reading Conventions

- Method names use the format `Component.Method`, for example `Switch.Set`; `GetStatus`, `GetConfig`, `SetConfig` are common base methods shared by all components.
- Component documentation has a fixed structure: Feature Overview → Method List → Methods → Data Structures → Event Notifications → Status Notifications → Examples. You can jump directly to sections as needed.
- The `auth` field may be omitted in request examples; add `auth` as described in the authentication documentation.

## Placeholders and Environment Variables

There are two types of patterns that need to be replaced in the documentation. Both must be replaced with actual values before use:

- **Placeholders** (angle bracket form, e.g. `<component>`): Used in descriptive text.
- **Environment variables** (`${...}` form, e.g. `${SONOFF}`): Used in command examples. Export or replace them with actual values before execution.

### Placeholders

| Placeholder | Meaning | Example |
| --- | --- | --- |
| `<component>` | Component type | `cloud`, `wifi`, `switch` |
| `<sonoff-id>` | Device ID, formatted as `sonoffdevicemodel-XXXXXXXXXXXX` | `sonoffmini1gsp-acebe61fae74` |

### Environment Variables

| Variable | Meaning | Example |
| --- | --- | --- |
| ${SONOFF} | Device IP address | `192.168.1.100` |
| ${SONOFF_ID} | Device ID, formatted as `sonoffdevicemodel-XXXXXXXXXXXX` | `sonoffmini1gsp-acebe61fae74` |

Note: Placeholders and environment variables are used only for documentation purposes. They must be replaced with actual values when making real calls.
