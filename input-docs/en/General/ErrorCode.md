# Error Codes

Each RPC request may succeed or fail.

+ On success: the response frame contains a `result` object, which may be an empty object if no specific parameters need to be returned.
+ On failure: the response frame contains an `error` object (see RPC Protocol)

Each `error` object contains:

+ `code`: number, a code indicating the type of error
+ `message`: string, a description of the error

Below are errors that Sonoff devices may return when processing requests.

## Basic Error Codes

| Error Code | Error Name | Meaning | Description |
| --- | --- | --- | --- |
| -103 | INVALID ARGUMENT | Invalid Argument | Returned when the parameters sent in a request do not match the parameters required by the method. |
| -104 | DEADLINE EXCEEDED | Timeout | Returned when the request times out. Typically occurs when fetching external resources via `HTTP.GET` or `HTTP.POST` in a script. |
| -105 | NOT FOUND | Not Found | Returned when the instance specified in the request does not exist. |
| -108 | RESOURCE EXHAUSTED | Resource Exhausted | Returned when the required resource reaches its limit. |
| -109 | FAILED PRECONDITION | Precondition Failed | Returned when a precondition for the requested operation is not met. For example: attempting to turn on a switch while in overpower state, or the device is scheduled to restart and is shutting down. |
| -114 | UNAVAILABLE | Service Unavailable | Returned when the service is unavailable. The service may be:   Internal service (e.g. sensor unreachable)<br/>   External service (e.g. timezone info, firmware update, HTTP requests in scripts) |

## RPC Protocol Error Codes

| Error Code | Error Name | Meaning | Description |
| --- | --- | --- | --- |
| -12801 | RPC_ERR_PARSE_ERROR      | JSON Parse Error | |
| -12802 | RPC_ERR_INVALID_REQUEST  | Invalid RPC Request Format | |
| -12803 | RPC_ERR_METHOD_NOT_FOUND | Method Not Found | |
| -12804 | RPC_ERR_INVALID_PARAMS   | Invalid Method Parameters | |
| -12805 | RPC_ERR_INTERNAL         | RPC Internal Error | |
| -12806 | RPC_ERR_SERVER_BUSY      | Server Busy (Queue Full) | |
| -12807 | RPC_ERR_TIMEOUT          | Request Timeout | |
| -12808 | RPC_ERR_DST_INVALID      | Invalid Destination Address | |
| -12809 | RPC_ERR_ACCESS_DENIED    | Access Denied (Authentication Failed) | |
| -12810 | RPC_ERR_QUEUE_FULL       | Request Queue Full | |
| -12811 | RPC_ERR_NOT_INITED       | RPC Bus Not Initialized | |
| -12812 | RPC_ERR_INVALID_STATE    | Operation Not Allowed in Current State | |
| -12813 | RPC_ERR_NO_MEMORY        | Insufficient Memory | |
| -12814 | RPC_ERR_NOT_SUPPORTED    | Unsupported Operation | |
| -12815 | RPC_ERR_INVALID_SIZE     | Request Data Size Exceeds Limit or Is Invalid | |
| -12816 | RPC_ERR_CHECKSUM_FAILED  | Data Checksum Failed (SHA256/CRC, etc.) | |
| -12817 | RPC_ERR_DECRYPT_FAILED   | Data Decryption Failed | |
| -12818 | RPC_ERR_MODEL_FAILED     | Device Model Mismatch | |
| -12819 | RPC_ERR_VERSION_FAILED   | Device Version Mismatch | |
| -12820 | RPC_ERR_NO_PASSWORD      | No Password Set, Access Denied | |



