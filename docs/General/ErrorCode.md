---
sidebar_position: 7
---

# 错误码

每个 RPC 请求都可能成功或失败。

+ 成功时：响应帧中包含 `result` 对象，如果没有具体参数要返回，则返回空对象 `{}`。
+ 失败时：响应帧中包含 `error` 对象，帧结构见 [RPC 协议](RPCProtocol.md#应答帧)。

每个 `error` 对象包含：

+ `code`：数字，表示错误类型的代码
+ `message`：字符串，表示错误描述

以下是 Sonoff 设备在处理请求时可能返回的错误。

## RPC协议错误码

| 错误码 | 错误码名称 | 含义 | 描述 |
| --- | --- | --- | --- |
| -12801 | RPC_ERR_PARSE_ERROR | JSON解析错误 | 请求体不是合法的 JSON，或无法解析 |
| -12802 | RPC_ERR_INVALID_REQUEST | RPC请求格式无效 | 请求不是合法的 RPC 请求帧（如缺少 `method` 等必需字段） |
| -12803 | RPC_ERR_METHOD_NOT_FOUND | 方法未找到 | 调用的方法名不存在或拼写错误 |
| -12804 | RPC_ERR_INVALID_PARAMS | 方法参数无效 | 参数缺失、类型错误或超出取值范围 |
| -12805 | RPC_ERR_INTERNAL | RPC内部错误 | 设备处理请求时发生内部错误 |
| -12806 | RPC_ERR_SERVER_BUSY | 服务器繁忙（队列满） | 设备同时处理的请求过多 |
| -12807 | RPC_ERR_TIMEOUT | 请求超时 | 请求在规定时间内未得到处理 |
| -12808 | RPC_ERR_DST_INVALID | 无效的目标地址 | 请求帧中的目标地址无效 |
| -12809 | RPC_ERR_ACCESS_DENIED | 访问被拒绝（认证失败） | 未携带有效的认证凭据或凭据验证失败 |
| -12810 | RPC_ERR_QUEUE_FULL | 请求队列已满 | 请求队列已满，暂无法接收新请求 |
| -12811 | RPC_ERR_NOT_INITED | RPC总线未初始化 | RPC 总线尚未初始化 |
| -12812 | RPC_ERR_INVALID_STATE | 当前状态不允许执行此操作 | 设备当前状态不支持该操作 |
| -12813 | RPC_ERR_NO_MEMORY | 内存不足 | 设备可用内存不足 |
| -12814 | RPC_ERR_NOT_SUPPORTED | 不支持的操作 | 当前设备型号或固件不支持该操作 |
| -12815 | RPC_ERR_INVALID_SIZE | 请求数据大小超过限制或不对 | 请求数据长度不符合要求 |
| -12816 | RPC_ERR_CHECKSUM_FAILED | 数据校验失败（SHA256/CRC等） | 数据完整性校验失败 |
| -12817 | RPC_ERR_DECRYPT_FAILED | 数据解密失败 | 数据解密失败 |
| -12818 | RPC_ERR_MODEL_FAILED | 设备型号不匹配 | 请求与设备型号不匹配 |
| -12819 | RPC_ERR_VERSION_FAILED | 设备版本不匹配 | 请求与固件版本不匹配 |
| -12820 | RPC_ERR_NO_PASSWORD | 未设置密码，访问被拒绝 | 设备尚未设置初始密码，受保护的请求被拒绝 |
