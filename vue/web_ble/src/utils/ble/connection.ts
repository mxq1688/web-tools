/**
 * BLE 连接管理
 */

import { ElMessage } from 'element-plus'
import type { BleDeviceInfo } from '@/types/ble'

// 临时类型声明
declare global {
  interface BluetoothDevice {
    id: string
    name?: string
    gatt?: BluetoothRemoteGATTServer
    addEventListener(type: 'gattserverdisconnected', listener: (event: Event) => void): void
    removeEventListener(type: 'gattserverdisconnected', listener: (event: Event) => void): void
  }
  
  interface BluetoothRemoteGATTServer {
    device: BluetoothDevice
    connected: boolean
    connect(): Promise<BluetoothRemoteGATTServer>
    disconnect(): void
    getPrimaryService(service: string | number): Promise<BluetoothRemoteGATTService>
  }
  
  interface BluetoothRemoteGATTService {
    uuid: string
    getCharacteristic(characteristic: string | number): Promise<BluetoothRemoteGATTCharacteristic>
  }
  
  interface BluetoothRemoteGATTCharacteristic {
    uuid: string
    value?: DataView
    startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>
    stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>
    writeValue(value: BufferSource): Promise<void>
    writeValueWithoutResponse(value: BufferSource): Promise<void>
    writeValueWithResponse(value: BufferSource): Promise<void>
    readValue(): Promise<DataView>
    addEventListener(type: 'characteristicvaluechanged', listener: (event: Event) => void): void
    removeEventListener(type: 'characteristicvaluechanged', listener: (event: Event) => void): void
  }
}

export class BleConnection {
  private gattServer: BluetoothRemoteGATTServer | null = null
  private notifyCharacteristic: BluetoothRemoteGATTCharacteristic | null = null
  private writeCharacteristic: BluetoothRemoteGATTCharacteristic | null = null
  private currentDevice: BluetoothDevice | null = null

  // 回调函数
  private onDisconnectedCallback?: () => void
  private onNotificationCallback?: (data: Uint8Array) => void

  // UUID 常量
  private readonly SERVICE_UUID = '00001910-0000-1000-8000-00805f9b34fb'
  private readonly NOTIFY_UUID = '00002bb0-0000-1000-8000-00805f9b34fb'
  private readonly WRITE_UUID = '00002bb1-0000-1000-8000-00805f9b34fb'

  /**
   * 连接设备
   */
  async connect(deviceInfo: BleDeviceInfo): Promise<void> {
    if (!deviceInfo.device) {
      throw new Error('无效的设备对象')
    }

    try {
      console.log('🔗 连接设备:', deviceInfo.name)
      
      // 连接 GATT 服务器
      const server = await deviceInfo.device.gatt?.connect()
      if (!server) {
        throw new Error('无法连接到设备')
      }
      
      this.gattServer = server
      this.currentDevice = deviceInfo.device
      
      // 监听断开连接事件
      deviceInfo.device.addEventListener('gattserverdisconnected', this.handleDisconnected.bind(this))
      
      // 获取服务
      const service = await server.getPrimaryService(this.SERVICE_UUID)
      console.log('✅ 已获取服务')
      
      // 获取通知特征
      const notifyChar = await service.getCharacteristic(this.NOTIFY_UUID)
      this.notifyCharacteristic = notifyChar
      
      // 启动通知
      await notifyChar.startNotifications()
      notifyChar.addEventListener('characteristicvaluechanged', this.handleNotification.bind(this))
      console.log('✅ 已启动通知')
      
      // 获取写入特征
      const writeChar = await service.getCharacteristic(this.WRITE_UUID)
      this.writeCharacteristic = writeChar
      console.log('✅ 已获取写入特征')
      
      ElMessage.success(`已连接到 ${deviceInfo.name}`)
    } catch (error: any) {
      console.error('连接失败:', error)
      this.cleanup()
      throw error
    }
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.gattServer?.connected) {
      this.gattServer.disconnect()
      console.log('🔌 主动断开连接')
    }
    this.cleanup()
    ElMessage.info('已断开连接')
  }

  /**
   * 发送数据到设备
   */
  async writeData(data: Uint8Array): Promise<void> {
    if (!this.writeCharacteristic) {
      throw new Error('写入特征未初始化')
    }
    
    try {
      await this.writeCharacteristic.writeValue(data as BufferSource)
      console.log('📤 发送数据:', data)
    } catch (error) {
      console.error('写入失败:', error)
      throw error
    }
  }

  /**
   * 设置断开连接回调
   */
  onDisconnected(callback: () => void): void {
    this.onDisconnectedCallback = callback
  }

  /**
   * 设置通知回调
   */
  onNotification(callback: (data: Uint8Array) => void): void {
    this.onNotificationCallback = callback
  }

  /**
   * 获取连接状态
   */
  get isConnected(): boolean {
    return this.gattServer?.connected || false
  }

  /**
   * 获取当前设备
   */
  get device(): BluetoothDevice | null {
    return this.currentDevice
  }

  /**
   * 处理断开连接事件
   */
  private handleDisconnected(): void {
    console.log('🔌 设备已断开连接')
    this.cleanup()
    this.onDisconnectedCallback?.()
    ElMessage.warning('设备已断开连接')
  }

  /**
   * 处理通知数据
   */
  private handleNotification(event: Event): void {
    const target = event.target as unknown as BluetoothRemoteGATTCharacteristic
    const value = target.value
    
    if (!value) return
    
    const bytes = new Uint8Array(value.buffer)
    console.log('📩 收到数据:', bytes)
    
    this.onNotificationCallback?.(bytes)
  }

  /**
   * 清理连接相关资源
   */
  private cleanup(): void {
    if (this.notifyCharacteristic) {
      this.notifyCharacteristic.removeEventListener(
        'characteristicvaluechanged',
        this.handleNotification.bind(this)
      )
    }
    
    if (this.currentDevice) {
      this.currentDevice.removeEventListener('gattserverdisconnected', this.handleDisconnected.bind(this))
    }
    
    this.gattServer = null
    this.currentDevice = null
    this.notifyCharacteristic = null
    this.writeCharacteristic = null
  }
}

// 单例实例
export const bleConnection = new BleConnection()
