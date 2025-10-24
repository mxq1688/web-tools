# Web Serial API 串口通信方法（通俗版）

## 什么是 Web Serial API？

就是让网页能够通过串口（COM口/USB转串口）和硬件设备通信的浏览器功能。

---

## 第一步：选择串口

### 让用户选择串口

```typescript
const port = await navigator.serial.requestPort()
```

**作用：** 浏览器会弹出一个窗口，让用户选择要连接的串口设备（比如 COM3、COM4）

---

### 查看已经授权的串口

```typescript
const ports = await navigator.serial.getPorts()
```

**作用：** 获取之前用户已经授权过的串口列表（不会弹窗）

---

## 第二步：打开串口

```typescript
// port 是第一步用户选择的那个串口（比如 COM3）
await port.open({
  baudRate: 115200,    // 通信速度（波特率）
  dataBits: 8,         // 数据位（通常是8）
  stopBits: 1,         // 停止位（通常是1）
  parity: 'none'       // 校验位（通常不校验）
})
```

**作用：** 打开第一步选择的串口，让数据可以通过这个串口进出

**注意：** `port.open()` 打开的是哪个串口？就是第一步 `requestPort()` 时用户选择的那个串口

**波特率常用值：** 
- `9600` - 慢速（老设备常用）
- `115200` - 快速（最常用）

---

## 第三步：接收数据

```typescript
// 获取一个"阅读器"
const reader = port.readable.getReader()

// 循环读取数据
while (true) {
  const { value, done } = await reader.read()
  
  if (done) {
    break  // 读完了
  }
  
  console.log('收到的数据:', value)  // value 是 Uint8Array 字节数组
}

// 用完要释放
reader.releaseLock()
```

**作用：** 就像一直监听，有数据来就接收

**value 是什么？** 
- 是一个字节数组（Uint8Array），比如 `[72, 101, 108, 108, 111]`
- 如果是文本，需要转换：`new TextDecoder().decode(value)`

---

## 第四步：发送数据

```typescript
// 获取一个"写入器"
const writer = port.writable.getWriter()

// 发送数据（必须是字节数组）
const data = new Uint8Array([72, 101, 108, 108, 111])  // "Hello"
await writer.write(data)

// 用完要释放
writer.releaseLock()
```

**作用：** 向串口发送数据

**发送文本：**
```typescript
const text = 'Hello'
const data = new TextEncoder().encode(text)  // 文本转字节
await writer.write(data)
```

---

## 第五步：关闭串口

```typescript
await port.close()
```

**作用：** 关闭串口，释放资源

---

## 完整例子（收发数据）

```typescript
// 1. 选择串口
const port = await navigator.serial.requestPort()

// 2. 打开串口
await port.open({ baudRate: 115200 })

// 3. 发送 "Hello"
const writer = port.writable.getWriter()
const text = new TextEncoder().encode('Hello')
await writer.write(text)
writer.releaseLock()

// 4. 接收数据
const reader = port.readable.getReader()
const { value } = await reader.read()
const received = new TextDecoder().decode(value)
console.log('收到回复:', received)
reader.releaseLock()

// 5. 关闭
await port.close()
```

---

## 监听串口连接/断开

```typescript
// 设备插入时触发
navigator.serial.addEventListener('connect', () => {
  console.log('串口已连接')
})

// 设备拔出时触发
navigator.serial.addEventListener('disconnect', () => {
  console.log('串口已断开')
})
```

---

## 文本和字节的转换

### 文本 → 字节数组

```typescript
const encoder = new TextEncoder()
const bytes = encoder.encode('Hello')
// 结果: Uint8Array [72, 101, 108, 108, 111]
```

### 字节数组 → 文本

```typescript
const decoder = new TextDecoder()
const text = decoder.decode(new Uint8Array([72, 101, 108, 108, 111]))
// 结果: "Hello"
```

---

## 常见问题

### 1. 为什么要用 Uint8Array？

串口通信是以**字节**为单位的，一个字节是 0-255 的数字。
- 字母 'H' 对应的字节是 72
- 字母 'e' 对应的字节是 101

### 2. 波特率是什么？

就是通信速度，类似网速。两端（电脑和设备）必须用相同的波特率才能正常通信。

### 3. 为什么要 releaseLock()？

`reader` 和 `writer` 会"锁定"串口，用完必须释放，否则别人用不了。

### 4. 什么时候用 getReader() 和 getWriter()？

- **读数据** → 用 `port.readable.getReader()`
- **写数据** → 用 `port.writable.getWriter()`

---

## 支持的浏览器

✅ **支持：** Chrome、Edge、Opera（版本 89+）  
❌ **不支持：** Safari、Firefox

⚠️ **注意：** 正式网站必须用 HTTPS，本地测试可以用 localhost

---

## 参考资料

- [MDN 官方文档](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API)
- [本项目 GitHub](https://github.com/mxq1688/web-tools/tree/main/vue/web_serial)

