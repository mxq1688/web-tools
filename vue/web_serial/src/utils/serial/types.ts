/**
 * 串口相关类型定义
 */

export interface SerialOptions {
  baudRate: number
  dataBits: 7 | 8
  stopBits: 1 | 2
  parity: 'none' | 'even' | 'odd'
  bufferSize: number
  flowControl: 'none' | 'hardware'
}

export interface SerialPortInfo {
  usbVendorId?: number
  usbProductId?: number
}

export type DataReceivedCallback = (data: Uint8Array) => void
export type ErrorCallback = (error: Error) => void
export type StatusChangeCallback = (isConnected: boolean) => void

