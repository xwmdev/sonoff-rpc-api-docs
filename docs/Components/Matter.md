# Matter

Matter 组件用于管理 Matter 配网与 Fabric，包括查询配对状态、获取配对码、移除 Fabric 和打开配对窗口。

| Method | Description |
| --- | --- |
| Matter.GetStatus | 获取matter状态 |
| Matter.GetSetupCode | 获取matter 设置代码 |
| Matter.RemoveFabric | 移除matter fabric |
| Matter.OpenPair | 打开matter配对 |


## 方法
Matter 组件支持的方法如下。

### Matter.GetStatus
**请求**

无。

**响应**

`Matter.GetStatus` 的响应属性请参阅 `status` 数据结构。



### Matter.GetSetupCode
**请求**

无。

**响应**

响应内容如下：

| Property | Type | Description |
| --- | --- | --- |
| qr_code | string | matter 二维码的文本表示方式。 |
| manual_code | string | matter 手动码，可以在某些情况下与二维码一起使用或代替二维码使用。 |


备注：

1. 仅在启用 Matter 服务后才能使用此设置代码配网，详情请参阅 `status`。



### Matter.RemoveFabric
**请求**

| Property | Type | Description |
| --- | --- | --- |
| fabric_list | array | 需要删除的matter fabric列表 |


更多关于 `fabric_list` 属性的内容，请参阅 `fabric_list` 数据结构。

**响应**

响应内容请参考应答帧。



### Matter.OpenPair
**请求**

| Property | Type | Description |
| --- | --- | --- |
| mode | string | 配对模式<br/>`BCM`（Basic Commissioning Mode，基础配网模式）：打开 Matter 配网窗口。 |

> **BCM 概念说明：**
>
> BCM 是 Matter 规范定义的一种设备配网模式。设备进入 BCM 后：
>
> + 通过 mDNS（DNS-SD）广播 `_matter._tcp` 服务，对外宣告设备的鉴别码（discriminator）、厂商 ID、产品 ID 等信息
> + Matter 控制器（如 Apple Home、Google Home）发现设备后，使用 Matter 设置代码（Setup Code）中的 PIN 码对设备进行入网认证
> + 设备与控制器通过证书认证交换（Certificate Authenticated Session Establishment, CASE）建立安全会话
> + 配网成功后设备加入该控制器的 fabric，BCM 窗口自动关闭
> + 若 10 分钟内未完成配网，窗口自动超时关闭
> + 只要设备还有空闲的 fabric 位置（即未达到最大注册数量），就可以反复打开 BCM 窗口进行配网。设备 fabric 已满时，无法再打开 BCM。可通过 [Matter.GetStatus](#mattergetstatus) 查看当前 fabric 数量（`num_fabrics`）和最大支持数量（`max_fabrics`）。


**响应**

响应内容请参考应答帧。





## 数据结构
Matter 组件相关的数据结构如下。



### status
| Property | Type | Description |
| --- | --- | --- |
| max_fabrics | number | 设备支持matter fabric最大数量 |
| num_fabrics | number | 设备已经加入的matter fabric数量 |
| commissionable | boolean | true:  设备可以被加入到已存在的fabric<br/>false: 设备已经加入fabric，或者matter配网窗口因为超时而关闭，或者设备在添加到fabric之前需要重启。 |
| fabric_list | object | 已经加入的matter fabric列表 |


更多关于 `fabric_list` 属性的内容，请参阅 `fabric_list` 数据结构。



### fabric_list
| Property | Type | Description |
| --- | --- | --- |
| compressed_fabric_id | string | Fabric 网络ID |
| vendor_id | string | Fabric 网络厂商,10进制字符串 |
| label | string | Fabric 标签 |
| create_at | string | 创建的13位时间戳 |




## 事件通知
Matter 组件支持的事件通知如下。

### config_changed
Matter 组件配置变更时，设备将发出此事件。



## 状态通知
Matter 组件状态变化时，将触发状态通知。携带数据如下：

| Property | Type | Description |
| --- | --- | --- |
| Matter | object | Matter对象内容为 fabric_list 子对象，详细结构请看 fabric_list |




## 示例
Matter 组件各方法与事件的示例。

### Matter.GetStatus 示例
**请求**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Matter.GetStatus"
}
```

**响应**

```json
{
  "id": 1,
  "src": "sonoffmini1gsp-acebe61fae74",
  "result": {
    "max_fabrics":5,
    "num_fabrics":1,
    "commissionable":false,
    "fabric_list":[
      {
        "compressed_fabric_id":"2906C488DDE90E01",
        "vendor_id":"4742",
        "label":"switch",
        "create_at":"0123456789123"
      }
    ]
  }
}
```



### Matter.GetSetupCode 示例
**请求**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Matter.GetSetupCode"
}
```

**响应**

```json
{
  "id": 1,
  "src": "sonoffmini1gsp-acebe61fae74",
  "result": {
    "qr_code":"MT:Y.K9042C00KA0648G00",
    "manual_code":"34970112332"
  }
}
```

### Matter.RemoveFabric 示例
**请求**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Matter.RemoveFabric",
   "params": {
      "fabric_list":[
      {
        "compressed_fabric_id":"2906C488DDE90E01",
        "vendor_id":"4742",
        "label":"switch",
        "create_at":"0123456789123"
      }
      ]
   }
}
```

**响应**

```json
{
  "id": 1,
  "src": "sonoffmini1gsp-acebe61fae74",
  "result": {
  }
}
```



### Matter.OpenPair 示例
**请求**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Matter.OpenPair",
   "params": {
      "mode":"BCM"
   }
}
```

**响应**

```json
{
  "id": 1,
  "src": "sonoffmini1gsp-acebe61fae74",
  "result": {
  }
}
```



### 通知示例
#### config_changed 示例
```json
{
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "web",
   "method": "NotifyEvent",
   "params": {
      "ts": 1626221112,
      "events": [
         {
            "component": "matter",
            "event": "config_changed",
            "ts": 1626221112
         }
      ]
   }
}
```







#### 状态通知 示例
```json
{   
"src": "sonoffmini1gsp-acebe61fae74",   
"dst": "user_1",   
"method": "NotifyStatus",   
"params": {      
  "ts": 1626221112,      
  "matter": {         
     "fabric_list":[
        {
          "compressed_fabric_id":"2906C488DDE90E01",
          "vendor_id":"4742",
          "label":"switch",
          "create_at":"0123456789123"
        }
      ]
  }   
}
}
```

