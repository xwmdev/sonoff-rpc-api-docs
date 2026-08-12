# Meter

The Meter component manages power metering, supporting configuration updates and queries, real-time electrical parameter queries, and historical energy data retrieval.

| Method | Description |
| --- | --- |
| Meter.SetConfig | Update component configuration |
| Meter.GetConfig | Get component configuration |
| Meter.GetStatus | Get component status |
| Meter.ResetCounters | Reset counters (clears energy data and electricity cost, including historical data) |
| Meter.GetRecords | Get historical data records (by hour, day, or month) |
| Meter.Download | Batch download energy consumption historical data |




## Methods
Methods supported by the Meter component.

### Meter.SetConfig
Update the meter configuration, including reverse metering display and electricity pricing information.



**Request**

| Property | Type | Description |
| --- | --- | --- |
| id | number | Component instance ID |
| config | object | Configuration parameters object. See the config data structure for details |


**Response**

For the response content, refer to the response frame.

### Meter.GetConfig
Get the meter configuration.



**Request**

| Property | Type | Description |
| --- | --- | --- |
| id | number | Component instance ID |


**Response**

| Property | Type | Description |
| --- | --- | --- |
| id | number | Component instance ID |
| config | object | Configuration parameters object. See the config data structure for details |


### Meter.GetStatus
Get real-time electrical parameters and cumulative energy data.



**Request**

| Property | Type | Description |
| --- | --- | --- |
| id | number | Component instance ID |




**Response**

The response content is the expanded content of the `status` data structure, as shown below:

| Property | Type | Description |
| --- | --- | --- |
| id | number | Component instance ID |
| voltage | number | Last measured voltage, unit V (volts), precision 0.01, actual value * 100 |
| current | number | Last measured current, unit A (amperes), precision 0.01, actual value * 100 |
| power | number | Last measured instantaneous active power, unit W (watts), precision 0.01, actual value * 100 |
| freq | number | Last measured grid frequency, precision 0.01, actual value * 100, unit Hz |
| total_energy | number | Cumulative forward energy consumption, unit 0.01 kWh |
| total_supply | number | Cumulative energy supply, unit 0.01 kWh |
| day_energy | number | Daily forward energy consumption, unit 0.01 kWh |
| day_supply | number | Daily energy supply, unit 0.01 kWh |
| day_cost | number | Daily electricity cost |
| day_run_time_sec | number | Daily runtime, unit seconds |
| month_energy | number | Monthly forward energy consumption, unit 0.01 kWh |
| month_supply | number | Monthly energy supply, unit 0.01 kWh |
| month_cost | number | Monthly electricity cost |
| total_run_time_sec | number | Total runtime, unit seconds |


### Meter.ResetCounters
Reset counters, clearing energy data, electricity cost, and historical data.



**Request**

| Property | Type | Description |
| --- | --- | --- |
| id | number | Component instance ID |




**Response**

For the response content, refer to the response frame.

### Meter.GetRecords
Get historical data records (by hour, day, or month dimension).



**Request**

| Property | Type | Description |
| --- | --- | --- |
| id | number | Component instance ID |
| type | string | Record type. Options: `hour` (hourly), `day` (daily), `month` (monthly) |
| start_time | string | Start date. Format: `YYYY-MM-DD` (year-month-day).<br/>- When `type` is `hour`, only `start_time` is used, returning that day's hourly energy consumption;<br/>- When `type` is `month`, the day portion of the date is ignored |
| end_time | string | End date. Format: `YYYY-MM-DD` (year-month-day).<br/>- When `type` is `hour`, only `start_time` is used, returning that day's hourly energy consumption;<br/>- When `type` is `month`, the day portion of the date is ignored |




**Response**

| Property | Type | Description |
| --- | --- | --- |
| id | number | Component instance ID |
| records | array of object | Array of unit historical data. See the records data structure for details |


### Meter.Download
Batch download energy consumption historical data.



**Request**

| Property | Type | Description |
| --- | --- | --- |
| id | number | Component instance ID |
| type | number | Download type. `0`: download by hour, `1`: download by day |
| offset | number | Starting index (0 means start from the most recent record) |
| count | number | Requested count; historical data must be downloaded in packets, with a maximum of 32 per packet |




**Response**

| Property | Type | Description |
| --- | --- | --- |
| id | number | Component instance ID |
| next_offset | number | Starting index for the next request (returns total_count if no more data) |
| total_count | number | Total number of historical data records |
| entries | array of array | Record array, each entry is `[energy_unit, supply_unit, cost_cent]` |




## Data Structures
Data structures related to the Meter component.

### config
| Property | Type | Description |
| --- | --- | --- |
| id | number | Component instance ID |
| reversed | boolean | Reverse metering display switch. `true`: enabled, `false`: disabled. Default: disabled |
| price_info | object | Electricity pricing configuration. See the price_info data structure for details |




**price_info**

| Property | Type | Description |
| --- | --- | --- |
| effective_time | string | Effective date. Format: `YYYY-MM-DD` (year-month-day), takes effect at midnight. Can be set from 30 days before the current date to 30 days after |
| normal_price | number | Base electricity price, unit 0.01 |
| use_weekend | boolean | Whether to differentiate weekends. `true`: differentiate, `false`: do not differentiate |
| workday_slots | array of object | Weekday configuration, up to 5 segments. See time_slot |
| weekend_slots | array of object | Weekend configuration, up to 5 segments. See time_slot |




**time_slot**

| Property | Type | Description |
| --- | --- | --- |
| start | number | Start time (hour) |
| end | number | End time (hour) |
| price | number | Electricity price, unit 0.01 |




### status
| Property | Type | Description |
| --- | --- | --- |
| id | number | Component instance ID |
| voltage | number | Last measured voltage, unit V (volts), precision 0.01, actual value * 100 |
| current | number | Last measured current, unit A (amperes), precision 0.01, actual value * 100 |
| power | number | Last measured instantaneous active power, unit W (watts), precision 0.01, actual value * 100 |
| freq | number | Last measured grid frequency, precision 0.01, actual value * 100 |
| total_energy | number | Cumulative forward energy consumption, unit 0.01 kWh |
| total_supply | number | Cumulative energy supply, unit 0.01 kWh |
| day_energy | number | Daily forward energy consumption, unit 0.01 kWh |
| day_supply | number | Daily energy supply, unit 0.01 kWh |
| day_cost | number | Daily electricity cost |
| day_run_time_sec | number | Daily runtime, unit seconds |
| month_energy | number | Monthly forward energy consumption, unit 0.01 kWh |
| month_supply | number | Monthly energy supply, unit 0.01 kWh |
| month_cost | number | Monthly electricity cost |
| total_run_time_sec | number | Total runtime, unit seconds |




### records
| Property | Type | Description |
| --- | --- | --- |
| energy_unit | number | Unit energy consumption, unit 0.01 kWh |
| supply_unit | number | Unit energy supply, unit 0.01 kWh |
| cost_cent | number | Electricity cost, unit 0.01 |




## Status Notifications
When the device's power status changes, a status notification is triggered. The data carried is as follows:

| Property | Type | Description |
| --- | --- | --- |
| status | object | See the status description below for details |


## Examples
Examples of Meter component methods and status notifications.

### Meter.SetConfig Example
Request to call the Meter.SetConfig method:

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "src": "user_1",
  "method": "Meter.SetConfig",
  "params": {
    "id": 1,
    "config": {
      "price_info": {
        "effective_time": "2025-04-10",
        "normal_price": 55,
        "use_weekend": false,
        "workday_slots": []
      }
    }
  }
}
```

**Success Response**

```json
{
  "id": 4,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {}
}
```

**Error Response**

```json
{
  "id": 4,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "error": {
    "code": -101,
    "message": "Configuration parameter error"
  }
}
```

### Meter.GetConfig Example
Request to call the Meter.GetConfig method:

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "src": "user_1",
  "method": "Meter.GetConfig",
  "params": {
    "id": 1
  }
}
```

**Success Response**

```json
{
  "id": 5,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {
    "id": 1,
    "config": {
      "reversed": true,
      "price_info": {
        "effective_time": "2026-03-01",
        "normal_price": 55,
        "use_weekend": true,
        "workday_slots": [
          { "start": 0, "end": 18, "price": 100 },
          { "start": 18, "end": 24, "price": 50 }
        ],
        "weekend_slots": [
          { "start": 0, "end": 24, "price": 60 }
        ]
      }
    }
  }
}
```

**Error Response**

```json
{
  "id": 5,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "error": {
    "code": -100,
    "message": "Failed to get configuration"
  }
}
```

### Meter.GetStatus Example
Request to call the Meter.GetStatus method:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "src": "user_1",
  "method": "Meter.GetStatus",
  "params": {
    "id": 1
  }
}
```

**Success Response**

```json
{
  "id": 1,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {
    "id": 1,
    "voltage": 22000,
    "current": 5000,
    "power": 1100000,
    "freq": 5000,
    "total_energy": 12345,
    "total_supply": 0,
    "day_energy": 120,
    "day_supply": 0,
    "day_cost": 60,
    "day_run_time_sec": 43200,
    "month_energy": 3500,
    "month_supply": 0,
    "month_cost": 1600,
    "total_run_time_sec": 864000
  }
}
```

**Error Response**

```json
{
  "id": 1,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "error": {
    "code": -100,
    "message": "Failed to get status"
  }
}
```

### Meter.ResetCounters Example
Request to call the Meter.ResetCounters method:

```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "src": "user_1",
  "method": "Meter.ResetCounters",
  "params": {
    "id": 1
  }
}
```

**Success Response**

```json
{
  "id": 6,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {}
}
```

**Error Response**

```json
{
  "id": 6,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "error": {
    "code": -104,
    "message": "Failed to reset counters"
  }
}
```

### Meter.GetRecords Example
Request to call the Meter.GetRecords method:

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "src": "user_1",
  "method": "Meter.GetRecords",
  "params": {
    "id": 1,
    "type": "hour",
    "start_time": "2025-12-01",
    "end_time": "2025-12-01"
  }
}
```

**Success Response**

```json
{
  "id": 2,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {
    "id": 1,
    "records": [
      { "energy_unit": 3, "supply_unit": 0, "cost_cent": 2 },
      { "energy_unit": 4, "supply_unit": 0, "cost_cent": 3 }
    ]
  }
}
```

**Error Response**

```json
{
  "id": 2,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "error": {
    "code": -100,
    "message": "Failed to get records"
  }
}
```

### Meter.Download Example
Request to call the Meter.Download method:

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "src": "user_1",
  "method": "Meter.Download",
  "params": {
    "id": 1,
    "type": 1,
    "offset": 0,
    "count": 2
  }
}
```

**Success Response**

```json
{
  "id": 3,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "result": {
    "id": 1,
    "next_offset": 2,
    "total_count": 5000,
    "entries": [
      [10, 0, 5],
      [12, 0, 6]
    ]
  }
}
```

**Error Response**

```json
{
  "id": 3,
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "error": {
    "code": -100,
    "message": "Failed to download historical data"
  }
}
```

### Notification Example
#### Status Notification Example
When the power status changes, the device sends the following notification:

```json
{
  "src": "sonoffmini1gsp-acebe61fae74",
  "dst": "user_1",
  "method": "NotifyStatus",
  "params": {
    "ts": 1776657162,
    "meter": {
      "status": {
        "id": 1,
        "voltage": 21972,
        "current": 7,
        "power": 828,
        "freq": 4988,
        "total_energy": 0,
        "total_supply": 0,
        "day_energy": 0,
        "day_supply": 0,
        "day_cost": 0,
        "month_energy": 0,
        "month_supply": 0,
        "month_cost": 0,
        "day_run_time_sec": 148,
        "total_run_time_sec": 1911
      }
    }
  }
}
```
