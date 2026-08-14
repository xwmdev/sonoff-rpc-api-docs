---
sidebar_position: 10
---

# Timer

The Timer component is used for creating, reading, updating, and deleting various types of timers.

| Method | Description |
| --- | --- |
| Timer.GetStatus | Get timer status |
| Timer.Update | Update timers, including add, modify, and delete operations |
| Timer.Query | Query timers |


## Methods
The methods supported by the Timer component are as follows.

### Timer.GetStatus
Get basic configuration information of the Timer component, including the maximum number of timers, the number of enabled timers, and the maximum number of timers that can be processed in a single `Timer.Update` or `Timer.Query` request.

**Request**

None. Before updating or querying timers, it is recommended to call this method first to obtain the timer count limit, enabled timer count, and the maximum number of batch operations per request.

**Response**

| Property | Type | Description |
| --- | --- | --- |
| max | number | Maximum number of timers (including enabled and disabled) |
| enable | number | Number of timers allowed to be enabled |
| batch | number | Number of timers that can be modified in a single request |
| revision | string | Timer revision number |


### Timer.Update
Update timer configurations. When multiple timer configurations need to be updated in batch and the data volume is large, this method can be called multiple times to complete a single update.

**Request**

| Property | Type | Description |
| --- | --- | --- |
| timer_list | array of object | Required. Timer list, content is timer_item |
| end | boolean | true: last request<br/>false: not the last request<br/>If the number of timers modified in one batch exceeds the device's batch value, the requester needs to send the modification requests in multiple batches. If it is the last request, the request must include "end": true. If it is not the last request, the request may include "end": false, or the field may be absent. |


For more details about the `timer_item` property, see the `timer_item` data structure.

**Response**

| Property | Type | Description |
| --- | --- | --- |
| revision | string | Timer revision number |


### Timer.Query
Query timers.

**Request**

| Property | Type | Description |
| --- | --- | --- |
| index | number | Required. Starting timer index for the query, range: 0 ~ maximum number of timers - 1 |


**Response**

| Property | Type | Description |
| --- | --- | --- |
| timer_list | array of object | Required. Timer list, content is timer_item |
| revision | string | Timer revision number |
| next | number | Next timer index to query<br/>-1 if all timers have been queried |


For more details about the `timer_item` property, see the `timer_item` data structure.

## Data Structures
The data structures related to the Timer component are as follows.

### timer_item
Data structures for various timer types, where the fields differ slightly for each timer type.
1. `index` is the timer index. When modifying multiple timers simultaneously, they must be arranged in strictly ascending index order.
2. `at` is the timer execution time, always representing local time (not UTC), and the string format may differ for each timer type.
3. The `do`, `startDo`, and `endDo` fields represent the actions the timer needs to execute, in the format: `{"switches":[{"id":num, "switch": str}]}`, where `id` represents the switch number to operate on, counting from 1; `switch` represents the operation to perform, which can be `on` or `off`.
4. When deleting a timer, only the `index` and `__del` fields need to be included.

#### One-Time Timer
| Property | Type | Description |
| --- | --- | --- |
| index | number | Timer index, range: 0 ~ maximum number of timers - 1 |
| enable | boolean | Timer enabled state<br/>true: enable this timer<br/>false: disable this timer |
| type | string | Timer type<br/>Fixed as "once", representing a one-time timer |
| at | string | Execution time, representing local time (not UTC)<br/>Format: `yyyy-mm-ddThh:mm:ss`<br/>e.g.: "2025-05-22T14:33:00" |
| do | object | Action to execute<br/>Format e.g.: {"switches":[{"id":1, "switch": "off"}]} |
| __del | boolean | Whether to delete this timer (only allowed when deletion is needed)<br/>true: delete timer |


#### Delay Timer
| Property | Type | Description |
| --- | --- | --- |
| index | number | Timer index, range: 0 ~ maximum number of timers - 1 |
| enable | boolean | Timer enabled state<br/>true: enable this timer<br/>false: disable this timer |
| type | string | Timer type<br/>Fixed as "delay", representing a delay timer |
| at | string | Execution time, representing local time (not UTC)<br/>Format: `yyyy-mm-ddThh:mm:ss`<br/>e.g.: "2025-05-22T14:33:00" |
| period | string | Delay duration, unit: minutes<br/>The actual execution time of the delay timer should be based on the at field<br/>Range: 1~1440 |
| do | object | Action to execute<br/>e.g.: {"switches":[{"id":1, "switch": "off"}]} |
| __del | boolean | Whether to delete this timer (only allowed when deletion is needed)<br/>true: delete timer |


#### Recurring Timer (Alternating)
When modifying a recurring alternating timer, the `period`, `end`, `startDo`, and `endDo` fields must all be present and must not be confused with a recurring repeating timer.
| Property | Type | Description |
| --- | --- | --- |
| index | number | Timer index, range: 0 ~ maximum number of timers - 1 |
| enable | boolean | Timer enabled state<br/>true: enable this timer<br/>false: disable this timer |
| type | string | Timer type<br/>Fixed as "duration", representing a recurring timer |
| at | string | Timer effective time, representing local time (not UTC)<br/>Format: `yyyy-mm-ddThh:mm:ss`<br/>e.g.: "2025-05-22T14:33:00" |
| period | string | Execute the start action at this cycle, unit: minutes<br/>Range: 1~1440 |
| end | string | Execute the end action at this minute within the cycle, unit: minutes<br/>Range: 1~1440 |
| startDo | object | Start action<br/>e.g.: {"switches":[{"id":1, "switch": "off"}]} |
| endDo | object | End action<br/>e.g.: {"switches":[{"id":1, "switch": "off"}]} |
| __del | boolean | Whether to delete this timer (only allowed when deletion is needed)<br/>true: delete timer |


#### Recurring Timer (Repeating)
When modifying a recurring repeating timer, the `interval` and `do` fields must both be present and must not be confused with a recurring alternating timer.
| Property | Type | Description |
| --- | --- | --- |
| index | number | Timer index, range: 0 ~ maximum number of timers - 1 |
| enable | boolean | Timer enabled state<br/>true: enable this timer<br/>false: disable this timer |
| type | string | Timer type<br/>Fixed as "duration", representing a recurring timer |
| at | string | Start execution time, representing local time (not UTC)<br/>Format: `yyyy-mm-ddThh:mm:ss`<br/>e.g.: "2025-05-22T14:33:00" |
| interval | string | Repeat the action at this interval, unit: minutes<br/>Range: 1~1440 |
| do | object | Action to execute<br/>e.g.: {"switches":[{"id":1, "switch": "off"}]} |
| __del | boolean | Whether to delete this timer (only allowed when deletion is needed)<br/>true: delete timer |


#### Repeat Timer
| Property | Type | Description |
| --- | --- | --- |
| index | number | Timer index, range: 0 ~ maximum number of timers - 1 |
| enable | boolean | Timer enabled state<br/>true: enable this timer<br/>false: disable this timer |
| type | string | Timer type<br/>Fixed as "repeat", representing a repeat timer |
| at | string | Execution time, cron expression (non-standard implementation)<br/>Format: `minute hour * * day_of_week`<br/>1. Minutes and hours support at most one leading zero<br/>2. Minute range [0,59]<br/>3. Hour range [0,23]<br/>4. Day of week format is `0,1,2,3,4,5,6`, where 0 represents Sunday<br/>e.g.:<br/>"30 15 * * 0,1,2,3,4,5,6", means execute the timer action at 15:30 every Monday to Sunday<br/>"01 09 * * 0,3,4,6", means execute the timer action at 09:01 every Wednesday, Thursday, Saturday, and Sunday |
| do | object | Action to execute<br/>e.g.: {"switches":[{"id":1, "switch": "off"}]} |
| __del | boolean | Whether to delete this timer (only allowed when deletion is needed)<br/>true: delete timer |


#### Random Timer (One-Time)
| Property | Type | Description |
| --- | --- | --- |
| index | number | Timer index, range: 0 ~ maximum number of timers - 1 |
| enable | boolean | Timer enabled state<br/>true: enable this timer<br/>false: disable this timer |
| type | string | Timer type<br/>Fixed as "random", representing a random timer |
| iterate | string | Timer subtype<br/>Fixed as "once" |
| once.startAt | string | Daily timer effective time, representing local time<br/>Format: `yyyy-mm-ddThh:mm:ss`<br/>e.g.: "2025-05-22T14:33:00" |
| once.endAt | string | Daily timer expiration time, representing local time<br/>Format: `yyyy-mm-ddThh:mm:ss`<br/>e.g.: "2025-05-22T15:33:00" |
| period | string | Duration of the start action, unit: minutes<br/>1. Minimum duration cannot be less than 10 minutes, maximum cannot exceed the effective period<br/>2. The timer's execution time will be randomly generated within the effective period |
| startDo | object | Start action<br/>e.g.: {"switches":[{"id":1, "switch": "on"}]} |
| endDo | object | End action<br/>e.g.: {"switches":[{"id":1, "switch": "off"}]} |
| __del | boolean | Whether to delete this timer (only allowed when deletion is needed)<br/>true: delete timer |


#### Random Timer (Repeat)
| Property | Type | Description |
| --- | --- | --- |
| index | number | Timer index, range: 0 ~ maximum number of timers - 1 |
| enable | boolean | Timer enabled state<br/>true: enable this timer<br/>false: disable this timer |
| type | string | Timer type<br/>Fixed as "random", representing a random timer |
| iterate | string | Timer subtype<br/>Fixed as "week" |
| week.date | string | Weekly timer effective days<br/>Format: `0,1,2,3,4,5,6`, where 0 represents Sunday<br/>e.g.: "0,1,3,4,6", means execute the timer every Monday, Wednesday, Thursday, Saturday, and Sunday |
| week.startAt | string | Daily timer effective time, representing local time<br/>Format: `hh:mm`<br/>e.g.: "14:33" |
| week.endAt | string | Daily timer expiration time, representing local time<br/>Format: `hh:mm`<br/>e.g.: "15:33" |
| period | string | Duration of the start action, unit: minutes<br/>1. Minimum duration cannot be less than 10 minutes, maximum cannot exceed the effective period<br/>2. The timer's execution time will be randomly generated within the effective period |
| startDo | object | Start action<br/>e.g.: {"switches":[{"id":1, "switch": "on"}]} |
| endDo | object | End action<br/>e.g.: {"switches":[{"id":1, "switch": "off"}]} |
| __del | boolean | Whether to delete this timer (only allowed when deletion is needed)<br/>true: delete timer |


## Event Notifications
The event notifications supported by the Timer component are as follows.

### revision_update
This event is emitted when any timer is modified using `Timer.Update`, or when a one-time timer has finished executing. The data carried is as follows:

| Property | Type | Description |
| --- | --- | --- |
| revision | string | Timer revision number |


## Examples
Examples of the Timer component methods and events.

### Timer.GetStatus Example
**Request**

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Timer.GetStatus",
   "params": {}
}
```

**Response**

```json
{
   "id": 1,
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "result": {
      "max": 24,
      "enable": 24,
      "batch": 3,
      "revision": "1234567890"
   }
}
```

### Timer.Update Example
Request template, only serves as an example for batch modifying timers. It includes ellipsis `...` and comment notations `\\` and should not be used directly as request content:

```json
{
   "jsonrpc":"2.0",
   "id": 2,
   "src":"user_1",
   "method":"Timer.Update",
   "params": {
      "timer_list": [
        {"index":0, ...},                 //Add or modify timer
        {"index":1, ...},                 //Add or modify timer, indices do not need to be consecutive but must be ascending
        {"index":3,"__del": true}  	      //Delete timer
      ],
      "end": true                         //This field is only present in the final update
   }
}
```

**Response**

```json
{
   "id": 2,
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "result": {
     "revision": "1234567890"
   }
}
```

#### Modify One-Time Timer Example
```json
{
   "jsonrpc":"2.0",
   "id": 100,
   "src":"user_1",
   "method":"Timer.Update",
   "params": {
      "timer_list": [
         {
            "index": 0,
            "enable": true,
            "type": "once",
            "at": "2026-03-26T20:30:00",
            "do": {
               "switches": [
                  { "id": 1, "switch": "on" }
               ]
            }
         }
      ],
      "end": true
   }
}
```

#### Modify Delay Timer Example
```json
{
   "jsonrpc":"2.0",
   "id": 101,
   "src":"user_1",
   "method":"Timer.Update",
   "params": {
      "timer_list": [
         {
            "index": 2,
            "enable": true,
            "type": "delay",
            "at": "2026-03-25T22:00:00",
            "period": "15",
            "do": {
               "switches": [
                  { "id": 1, "switch": "off" }
               ]
            }
         }
      ],
      "end": true
   }
}
```

#### Modify Recurring Timer (Alternating) Example
```json
{
   "jsonrpc": "2.0",
   "id": 102,
   "src": "user_1",
   "method": "Timer.Update",
   "params": {
      "timer_list": [
         {
            "index": 3,
            "enable": true,
            "type": "duration",
            "at": "2026-03-26T08:00:00",
            "period": "120",
            "end": "30",
            "startDo": {
               "switches": [
                  { "id": 1, "switch": "on" }
               ]
            },
            "endDo": {
               "switches": [
                  { "id": 1, "switch": "off" }
               ]
            }
         }
      ],
      "end": true
   }
}
```

#### Modify Recurring Timer (Repeating) Example
```json
{
   "jsonrpc": "2.0",
   "id": 103,
   "src": "user_1",
   "method": "Timer.Update",
   "params": {
      "timer_list": [
         {
            "index": 4,
            "enable": true,
            "type": "duration",
            "at": "2026-03-26T09:00:00",
            "interval": "45",
            "do": {
               "switches": [
                  { "id": 1, "switch": "on" }
               ]
            }
         }
      ],
      "end": true
   }
}
```

#### Modify Repeat Timer Example
```json
{
   "jsonrpc":"2.0",
   "id": 104,
   "src":"user_1",
   "method":"Timer.Update",
   "params": {
      "timer_list": [
         {
            "index": 1,
            "enable": true,
            "type": "repeat",
            "at": "30 18 * * 1,2,3,4,5",
            "do": {
               "switches": [
                  { "id": 1, "switch": "off" }
               ]
            }
         }
      ],
      "end": true
   }
}
```

#### Modify Random Timer (One-Time) Example
```json
{
   "jsonrpc": "2.0",
   "id": 105,
   "src": "user_1",
   "method": "Timer.Update",
   "params": {
      "timer_list": [
         {
            "index": 5,
            "enable": true,
            "type": "random",
            "iterate": "once",
            "once": {
               "startAt": "2026-03-27T19:00:00",
               "endAt": "2026-03-27T21:00:00"
            },
            "period": "20",
            "startDo": {
               "switches": [
                  { "id": 1, "switch": "on" }
               ]
            },
            "endDo": {
               "switches": [
                  { "id": 1, "switch": "off" }
               ]
            }
         }
      ],
      "end": true
   }
}
```

#### Modify Random Timer (Repeat) Example
```json
{
   "jsonrpc": "2.0",
   "id": 106,
   "src": "user_1",
   "method": "Timer.Update",
   "params": {
      "timer_list": [
         {
            "index": 6,
            "enable": true,
            "type": "random",
            "iterate": "week",
            "week": {
               "date": "1,2,3,4,5",
               "startAt": "18:30",
               "endAt": "23:00"
            },
            "period": "25",
            "startDo": {
               "switches": [
                  { "id": 1, "switch": "on" }
               ]
            },
            "endDo": {
               "switches": [
                  { "id": 1, "switch": "off" }
               ]
            }
         }
      ],
      "end": true
   }
}
```

#### Delete Timer Example
```json
{
   "jsonrpc": "2.0",
   "id": 107,
   "src": "user_1",
   "method": "Timer.Update",
   "params": {
      "timer_list": [
         {
            "index": 1,
            "__del": true
         }
      ],
      "end": true
   }
}
```

### Timer.Query Example
Start querying from index 0, request:

```json
{
   "jsonrpc":"2.0",
   "id": 1,
   "src":"user_1",
   "method":"Timer.Query",
   "params": {
      "index": 0
   }
}
```

When all timers have been queried, the `next` field value is `-1`; otherwise it is the timer index for the next query.

**Response**

```json
{
   "id": 1,
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "result": {
      "timer_list": [
        {"index":0, ...},
        {"index":1, ...},
        {"index":3, ...}
      ],
      "revision": "1234567890",
      "next": 4
   }
}
```

### Notification Example
#### revision_update Example
```json
{
   "src": "sonoffmini1gsp-acebe61fae74",
   "dst": "user_1",
   "method": "NotifyEvent",
   "params": {
      "ts": 1234567890,
      "events": [
         {
            "component": "timer",
            "event": "revision_update",
            "ts": 1234567890,
            "revision": "1234567890"
         }
      ]
   }
}
```
