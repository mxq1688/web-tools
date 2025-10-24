/**
 * 串口管理类
 */
import type { SerialOptions, DataReceivedCallback, ErrorCallback, StatusChangeCallback } from './types'

export class SerialManager {
  private port: SerialPort | null = null
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null
  private isOpen: boolean = false
  private isManualClose: boolean = true
  private onDataReceived: DataReceivedCallback | null = null
  private onError: ErrorCallback | null = null
  private onStatusChange: StatusChangeCallback | null = null

  constructor() {
    this.initSerialEvents()
  }

  /**
   * 检查浏览器是否支持 Web Serial API
   */
  static isSupported(): boolean {
    return 'serial' in navigator
  }

  /**
   * 初始化串口事件监听
   */
  private initSerialEvents() {
    if (!SerialManager.isSupported()) return

    // 监听串口连接
    navigator.serial.addEventListener('connect', (e) => {
      this.port = e.target as SerialPort
      this.onStatusChange?.(true)
      // 如果不是手动关闭，自动重连
      if (!this.isManualClose) {
        setTimeout(() => {
          this.open()
        }, 100)
      }
    })

    // 监听串口断开
    navigator.serial.addEventListener('disconnect', () => {
      this.onStatusChange?.(false)
      setTimeout(() => {
        this.close()
      }, 500)
    })
  }

  /**
   * 获取已授权的串口列表
   */
  async getPorts(): Promise<SerialPort[]> {
    if (!SerialManager.isSupported()) return []
    return await navigator.serial.getPorts()
  }

  /**
   * 请求选择串口
   */
  async requestPort(): Promise<SerialPort | null> {
    try {
      this.port = await navigator.serial.requestPort()
      this.onStatusChange?.(true)
      return this.port
    } catch (error) {
      console.error('选择串口失败:', error)
      this.onError?.(error as Error)
      return null
    }
  }

  /**
   * 打开串口
   */
  async open(options?: Partial<SerialOptions>): Promise<boolean> {
    if (!this.port) {
      this.onError?.(new Error('请先选择串口'))
      return false
    }

    const defaultOptions: SerialOptions = {
      baudRate: 115200,
      dataBits: 8,
      stopBits: 1,
      parity: 'none',
      bufferSize: 1024,
      flowControl: 'none',
    }

    const serialOptions = { ...defaultOptions, ...options }

    try {
      // Web Serial API 的 open 方法不接受 bufferSize 参数
      const { bufferSize, ...portOptions } = serialOptions
      await this.port.open(portOptions)
      this.isOpen = true
      this.isManualClose = false
      this.startReading()
      return true
    } catch (error) {
      console.error('打开串口失败:', error)
      this.onError?.(error as Error)
      return false
    }
  }

  /**
   * 关闭串口
   */
  async close(): Promise<void> {
    if (this.isOpen) {
      this.isOpen = false
      this.isManualClose = true
      await this.reader?.cancel()
      this.reader = null
    }
  }

  /**
   * 开始读取数据
   */
  private async startReading() {
    if (!this.port || !this.port.readable) return

    while (this.isOpen && this.port.readable) {
      this.reader = this.port.readable.getReader()
      try {
        while (true) {
          const { value, done } = await this.reader.read()
          if (done) break
          if (value && this.onDataReceived) {
            this.onDataReceived(value)
          }
        }
      } catch (error) {
        console.error('读取数据错误:', error)
        this.onError?.(error as Error)
      } finally {
        this.reader.releaseLock()
        this.reader = null
      }
    }

    if (this.port) {
      await this.port.close()
    }
  }

  /**
   * 写入数据
   */
  async write(data: Uint8Array): Promise<boolean> {
    if (!this.port || !this.port.writable) {
      this.onError?.(new Error('串口未打开或不可写'))
      return false
    }

    try {
      const writer = this.port.writable.getWriter()
      await writer.write(data)
      writer.releaseLock()
      return true
    } catch (error) {
      console.error('写入数据失败:', error)
      this.onError?.(error as Error)
      return false
    }
  }

  /**
   * 设置数据接收回调
   */
  setOnDataReceived(callback: DataReceivedCallback) {
    this.onDataReceived = callback
  }

  /**
   * 设置错误回调
   */
  setOnError(callback: ErrorCallback) {
    this.onError = callback
  }

  /**
   * 设置状态变化回调
   */
  setOnStatusChange(callback: StatusChangeCallback) {
    this.onStatusChange = callback
  }

  /**
   * 获取当前串口状态
   */
  getStatus() {
    return {
      isOpen: this.isOpen,
      hasPort: !!this.port,
      isWritable: !!this.port?.writable,
      isReadable: !!this.port?.readable,
    }
  }

  /**
   * 获取当前串口
   */
  getPort() {
    return this.port
  }
}

// 导出单例
export const serialManager = new SerialManager()

