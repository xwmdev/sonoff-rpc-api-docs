# Matter

The Matter component manages Matter commissioning and Fabric, including querying pairing status, getting pairing codes, removing Fabrics, and opening pairing windows.

| Method | Description |
| --- | --- |
| Matter.GetStatus | Get Matter status |
| Matter.GetSetupCode | Get Matter setup code |
| Matter.RemoveFabric | Remove Matter fabric |
| Matter.OpenPair | Open Matter pairing |


## Methods
Methods supported by the Matter component.

### Matter.GetStatus
**Request**

None.

**Response**

The response properties of `Matter.GetStatus` are described in the `status` data structure.



### Matter.GetSetupCode
**Request**

None.

**Response**

The response content is as follows:

| Property | Type | Description |
| --- | --- | --- |
| qr_code | string | Text representation of the Matter QR code. |
| manual_code | string | Matter manual code, which can be used together with or in place of the QR code in some cases. |


Notes:

1. This setup code can only be used for commissioning after the Matter service is enabled. See `status` for details.



### Matter.RemoveFabric
**Request**

| Property | Type | Description |
| --- | --- | --- |
| fabric_list | array | List of Matter fabrics to remove |


For more information on the `fabric_list` property, refer to the `fabric_list` data structure.

**Response**

For the response content, refer to the response frame.



### Matter.OpenPair
**Request**

| Property | Type | Description |
| --- | --- | --- |
| mode | string | Pairing mode<br/>`BCM` (Basic Commissioning Mode): Opens the Matter commissioning window. |

> **BCM Concept Description:**
>
> BCM is a device commissioning mode defined by the Matter specification. When the device enters BCM:
>
> + It broadcasts the `_matter._tcp` service via mDNS (DNS-SD), announcing the device's discriminator, vendor ID, product ID, and other information
> + After discovering the device, a Matter controller (such as Apple Home or Google Home) uses the PIN in the Matter Setup Code to authenticate and commission the device
> + The device and controller establish a secure session through Certificate Authenticated Session Establishment (CASE)
> + After successful commissioning, the device joins the controller's fabric and the BCM window automatically closes
> + If commissioning is not completed within 10 minutes, the window automatically times out and closes
> + As long as the device has available fabric slots (i.e., it has not reached the maximum number of registrations), the BCM window can be reopened for commissioning. When the device's fabrics are full, BCM can no longer be opened. Use [Matter.GetStatus](#mattergetstatus) to check the current fabric count (`num_fabrics`) and maximum supported count (`max_fabrics`).


**Response**

For the response content, refer to the response frame.





## Data Structures
Data structures related to the Matter component.



### status
| Property | Type | Description |
| --- | --- | --- |
| max_fabrics | number | Maximum number of Matter fabrics the device supports |
| num_fabrics | number | Number of Matter fabrics the device has already joined |
| commissionable | boolean | true:  the device can be added to an existing fabric<br/>false: the device has already joined a fabric, or the Matter commissioning window has closed due to timeout, or the device needs to be restarted before being added to a fabric. |
| fabric_list | object | List of Matter fabrics that have been joined |


For more information on the `fabric_list` property, refer to the `fabric_list` data structure.



### fabric_list
| Property | Type | Description |
| --- | --- | --- |
| compressed_fabric_id | string | Fabric network ID |
| vendor_id | string | Fabric network vendor, decimal string |
| label | string | Fabric label |
| create_at | string | 13-digit timestamp of creation |




## Event Notifications
Event notifications supported by the Matter component.

### config_changed
When the Matter component configuration changes, the device emits this event.



## Status Notifications
When the Matter component status changes, a status notification is triggered. The data carried is as follows:

| Property | Type | Description |
| --- | --- | --- |
| Matter | object | The Matter object's content is the fabric_list sub-object; see fabric_list for the detailed structure |




## Examples
Examples of Matter component methods and events.

### Matter.GetStatus Example
**Request**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Matter.GetStatus"
}
```

**Response**

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



### Matter.GetSetupCode Example
**Request**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Matter.GetSetupCode"
}
```

**Response**

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

### Matter.RemoveFabric Example
**Request**

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

**Response**

```json
{
  "id": 1,
  "src": "sonoffmini1gsp-acebe61fae74",
  "result": {
  }
}
```



### Matter.OpenPair Example
**Request**

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

**Response**

```json
{
  "id": 1,
  "src": "sonoffmini1gsp-acebe61fae74",
  "result": {
  }
}
```



### Notification Examples
#### config_changed Example
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







#### Status Notification Example
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
