# Web 蓝牙 API 总结

## 核心 API

### navigator.bluetooth
```javascript
// 检查蓝牙是否可用 (返回Promise<boolean>)
navigator.bluetooth.getAvailability()

// 请求设备 (弹出系统设备选择器，用户选择后返回设备对象)
// 扫描时只使用 filters，不使用服务UUID过滤
navigator.bluetooth.requestDevice({
  filters: [{ namePrefix: '' }],  // 设备名称过滤
  optionalServices: ['0000180F-0000-1000-8000-00805F9B34FB']  // 可选服务
})
```

### BluetoothDevice
```javascript
device.id                    // 设备唯一ID (string)
device.name                  // 设备名称 (string)
device.gatt                  // GATT服务器对象
device.addEventListener('gattserverdisconnected', callback)  // 监听断开事件
```

### BluetoothRemoteGATTServer
```javascript
server.device               // 关联的设备对象
server.connected            // 连接状态 (boolean)
server.connect()            // 连接设备 (返回Promise)
server.disconnect()         // 断开连接 (void)
server.getPrimaryService('0000180F-0000-1000-8000-00805F9B34FB')  // 获取主服务
```

### BluetoothRemoteGATTService
```javascript
service.uuid                // 服务UUID (string)
service.getCharacteristic('00002A19-0000-1000-8000-00805F9B34FB')  // 获取特征值
```

### BluetoothRemoteGATTCharacteristic
```javascript
characteristic.uuid                    // 特征值UUID (string)
characteristic.value                   // 当前值 (DataView)
characteristic.readValue()             // 读取数据 (返回Promise<DataView>)
characteristic.writeValue(data)       // 写入数据 (返回Promise)
characteristic.writeValueWithResponse(data)    // 带响应写入 (等待确认)
characteristic.writeValueWithoutResponse(data) // 无响应写入 (快速发送)
characteristic.startNotifications()   // 开始接收通知 (返回Promise)
characteristic.stopNotifications()    // 停止通知 (返回Promise)
```

## 完整使用流程

```javascript
// 1. 检查支持性
if (!navigator.bluetooth) {
  throw new Error('不支持Web蓝牙')
}

// 2. 请求设备 (用户选择设备)
const device = await navigator.bluetooth.requestDevice({
  filters: [{ namePrefix: '' }],  // 空字符串表示接受所有设备
  optionalServices: ['0000180F-0000-1000-8000-00805F9B34FB']
})

// 3. 连接设备 (自动连接用户选择的设备)
const server = await device.gatt.connect()

// 4. 获取服务
const service = await server.getPrimaryService('0000180F-0000-1000-8000-00805F9B34FB')

// 5. 获取特征值
const characteristic = await service.getCharacteristic('00002A19-0000-1000-8000-00805F9B34FB')

// 6. 读取数据
const value = await characteristic.readValue()
const batteryLevel = value.getUint8(0)  // 读取第一个字节

// 7. 写入数据
const data = new Uint8Array([0x01, 0x02])
await characteristic.writeValue(data)

// 8. 订阅通知
await characteristic.startNotifications()
characteristic.addEventListener('characteristicvaluechanged', (event) => {
  const value = event.target.value
  console.log('收到数据:', value)
})
```

## 事件类型

### BluetoothDevice 事件
- `gattserverdisconnected` - 服务器断开连接时触发

### BluetoothRemoteGATTCharacteristic 事件
- `characteristicvaluechanged` - 特征值数据变化时触发 (需要先调用startNotifications)

## 错误类型
- `NotFoundError` - 未找到符合条件的设备
- `NotAllowedError` - 用户拒绝了蓝牙权限
- `NotSupportedError` - 浏览器不支持蓝牙
- `NetworkError` - 网络连接错误
- `SecurityError` - 安全策略错误 (非HTTPS环境)

## 限制
- 仅支持 HTTPS/localhost 环境
- 需要用户手势触发 (点击按钮)
- 一次只能选择一个设备
- 不支持直接访问广播数据
- 部分浏览器需要启用实验性功能
