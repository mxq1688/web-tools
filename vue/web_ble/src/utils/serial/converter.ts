/**
 * 数据转换工具类
 */

// Hex 转 Uint8Array
export function hexToUint8Array(hex: string): Uint8Array | null {
  const value = hex.replace(/\s+/g, '')
  if (/^[0-9A-Fa-f]+$/.test(value) && value.length % 2 === 0) {
    const data: number[] = []
    for (let i = 0; i < value.length; i += 2) {
      data.push(parseInt(value.substring(i, i + 2), 16))
    }
    return Uint8Array.from(data)
  }
  return null
}

// Uint8Array 转 Hex
export function uint8ArrayToHex(data: Uint8Array): string {
  const dataHex: string[] = []
  for (const d of data) {
    // 转16进制并补0
    dataHex.push(('0' + d.toString(16).toUpperCase()).slice(-2))
  }
  return dataHex.join(' ')
}

// Text 转 Uint8Array
export function textToUint8Array(text: string): Uint8Array {
  const encoder = new TextEncoder()
  return encoder.encode(text)
}

// Uint8Array 转 Text
export function uint8ArrayToText(data: Uint8Array): string {
  const decoder = new TextDecoder()
  return decoder.decode(data)
}

// HTML 转义
export function htmlEncode(html: string): string {
  const temp = document.createElement('div')
  if (temp.textContent !== null) {
    temp.textContent = html
  } else {
    temp.innerText = html
  }
  const output = temp.innerHTML
  return output
}

// HTML 反转义
export function htmlDecode(text: string): string {
  const temp = document.createElement('div')
  temp.innerHTML = text
  const output = temp.innerText || temp.textContent || ''
  return output
}

// 格式化时间（精确到毫秒，与原版一致）
export function formatDate(date: Date): string {
  const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  const millisecond = ('00' + date.getMilliseconds()).slice(-3)
  return `${hour}:${minute}:${second}.${millisecond}`
}

// 格式化完整日期时间
export function formatDateTime(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  const ms = String(date.getMilliseconds()).padStart(3, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${ms}`
}

// 保存文本为文件
export function saveText(text: string, filename: string = 'serial-log.txt') {
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// 保存 JSON 为文件
export function saveJSON(data: any, filename: string = 'data.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

