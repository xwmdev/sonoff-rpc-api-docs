# 错误码

每个 RPC 请求都可能成功或失败。

+ 成功时：响应帧中包含 `result` 对象, 如果没有具体参数要返回可以返回`result` 空对象。
+ 失败时：响应帧中包含 `error` 对象（见 RPC Protocol）

每个 `error` 对象包含：

+ `code`：数字，表示错误类型的代码
+ `message`：字符串，表示错误描述

以下是 Sonoff 设备在处理请求时可能返回的错误。

## 基础错误码

| 错误码 | 错误码名称 | 含义 | 描述 |
| --- | --- | --- | --- |
| -103 | INVALID ARGUMENT | 无效参数 | 当请求中发送的参数与该方法要求的参数不匹配时，会返回此错误。 |
| -104 | DEADLINE EXCEEDED | 超时 | 当请求超时时，会返回此错误。通常发生在脚本中通过 `HTTP.GET` 或 `HTTP.POST` 获取外部资源时。 |
| -105 | NOT FOUND | 未找到 | 当请求中指定的实例不存在时，会返回此错误。 |
| -108 | RESOURCE EXHAUSTED | 资源耗尽 | 当所需资源达到上限时，会返回此错误。 |
| -109 | FAILED PRECONDITION | 前置条件失败 | 当请求操作的前置条件不满足时，会返回此错误。例如：在过功率（overpower）状态下尝试打开开关，或设备已计划重启并正在关机。 |
| -114 | UNAVAILABLE | 服务不可用 | 当服务不可用时，会返回此错误。服务可能是：   内部服务（例如传感器不可达）<br/>   外部服务（例如时区信息、固件更新、脚本中的 HTTP 请求） |

## RPC协议错误码

| 错误码 | 错误码名称 | 含义 | 描述 |
| --- | --- | --- | --- |
| -12801 | RPC_ERR_PARSE_ERROR      | JSON解析错误 | |
| -12802 | RPC_ERR_INVALID_REQUEST  | RPC请求格式无效 | |
| -12803 | RPC_ERR_METHOD_NOT_FOUND | 方法未找到 | |
| -12804 | RPC_ERR_INVALID_PARAMS   | 方法参数无效 | |
| -12805 | RPC_ERR_INTERNAL         | RPC内部错误 | |
| -12806 | RPC_ERR_SERVER_BUSY      | 服务器繁忙（队列满） | |
| -12807 | RPC_ERR_TIMEOUT          | 请求超时 | |
| -12808 | RPC_ERR_DST_INVALID      | 无效的目标地址 | |
| -12809 | RPC_ERR_ACCESS_DENIED    | 访问被拒绝（认证失败） | |
| -12810 | RPC_ERR_QUEUE_FULL       | 请求队列已满 | |
| -12811 | RPC_ERR_NOT_INITED       | RPC总线未初始化 | |
| -12812 | RPC_ERR_INVALID_STATE    | 当前状态不允许执行此操作 | |
| -12813 | RPC_ERR_NO_MEMORY        | 内存不足 | |
| -12814 | RPC_ERR_NOT_SUPPORTED    | 不支持的操作 | |
| -12815 | RPC_ERR_INVALID_SIZE     | 请求数据大小超过限制或不对 | |
| -12816 | RPC_ERR_CHECKSUM_FAILED  | 数据校验失败（SHA256/CRC等） | |
| -12817 | RPC_ERR_DECRYPT_FAILED   | 数据解密失败 | |
| -12818 | RPC_ERR_MODEL_FAILED     | 设备型号不匹配 | |
| -12819 | RPC_ERR_VERSION_FAILED   | 设备版本不匹配 | |
| -12820 | RPC_ERR_NO_PASSWORD      | 未设置密码，访问被拒绝 | |


  
 

