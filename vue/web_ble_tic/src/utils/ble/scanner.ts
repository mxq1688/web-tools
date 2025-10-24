/**
 * BLE 设备扫描器
 * 参考 Flutter deviceSearch_page.dart
 */

import type { BleDeviceInfo, BleScanOptions } from '@/types/ble'

// 临时类型声明
declare global {
  interface Navigator {
    bluetooth: Bluetooth
  }
  
  interface Bluetooth {
    requestDevice(options?: RequestDeviceOptions): Promise<BluetoothDevice>
    getAvailability(): Promise<boolean>
  }
  
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
  
  interface RequestDeviceOptions {
    filters?: BluetoothLEScanFilter[]
    optionalServices?: string[]
    acceptAllDevices?: boolean
  }
  
  interface BluetoothLEScanFilter {
    services?: string[]
    name?: string
    namePrefix?: string
    manufacturerData?: ManufacturerDataFilter[]
    serviceData?: ServiceDataFilter[]
  }
  
  interface ManufacturerDataFilter {
    companyIdentifier: number
    dataPrefix?: BufferSource
    mask?: BufferSource
  }
  
  interface ServiceDataFilter {
    service: string
    dataPrefix?: BufferSource
    mask?: BufferSource
  }
}
import { BLE_CONFIG, BLE_ERRORS, DEVICE_CLEANUP_INTERVAL, NEAREST_UPDATE_INTERVAL } from './config'

export class BleScanner {
  private devices: Map<string, BleDeviceInfo> = new Map()
  private cleanupTimer: number | null = null
  private nearestUpdateTimer: number | null = null
  private lastNearestUpdateTime = 0
  private isScanning = false
  private scanAbortController: AbortController | null = null
  private onDeviceFoundCallback?: (devices: BleDeviceInfo[]) => void
  private onErrorCallback?: (error: Error) => void

  /**
   * 检查浏览器是否支持 Web Bluetooth
   */
  static async isSupported(): Promise<boolean> {
    if (!navigator.bluetooth) {
      return false
    }
    try {
      return await navigator.bluetooth.getAvailability()
    } catch {
      return false
    }
  }

  /**
   * 开始扫描设备
   */
  async startScan(options?: BleScanOptions): Promise<void> {
    // 检查支持性
    if (!await BleScanner.isSupported()) {
      throw new Error(BLE_ERRORS.NOT_SUPPORTED)
    }

    // 如果已经在扫描，先停止
    if (this.isScanning) {
      this.stopScan()
    }

    this.isScanning = true
    this.devices.clear()
    this.scanAbortController = new AbortController()

    // 启动定时清理超时设备
    this.startCleanupTimer()

    console.log('🔍 开始扫描 BLE 设备...')

    try {
      // 构建过滤器
      const filters = this.buildScanFilters(options)
      
      console.log('🔍 扫描过滤器:', filters)
      
      // 请求设备（这会打开系统的蓝牙设备选择器）
      // 注意：optionalServices 必须包含，否则连接后无法访问这些服务
      const device = await navigator.bluetooth.requestDevice({
        filters,
        optionalServices: [
          BLE_CONFIG.serviceUUID,
          BLE_CONFIG.notifyUUID,
          BLE_CONFIG.writeUUID,
        ],
      })

      // Web Bluetooth API 只能选择单个设备，不支持批量扫描
      // 这是 Web API 的限制
      if (device) {
        this.handleDeviceFound(device, options)
      }
    } catch (error: any) {
      this.isScanning = false
      this.stopCleanupTimer()

      // 用户取消不算错误，静默处理
      if (error.name === 'NotFoundError') {
        console.log('⚠️ 用户取消选择或未找到符合条件的设备')
        this.onErrorCallback?.(new Error('用户取消或未找到设备'))
        return // 不抛出错误
      } else if (error.name === 'NotAllowedError') {
        const err = new Error(BLE_ERRORS.PERMISSION_DENIED)
        this.onErrorCallback?.(err)
        throw err
      } else {
        const err = new Error(error.message || '扫描失败')
        this.onErrorCallback?.(err)
        throw err
      }
    }
  }

  /**
   * 停止扫描
   */
  stopScan(): void {
    console.log('⏹️ 停止扫描')
    this.isScanning = false
    this.scanAbortController?.abort()
    this.scanAbortController = null
    this.stopCleanupTimer()
    this.stopNearestUpdateTimer()
  }

  /**
   * 构建扫描过滤器
   * 注意：暂时不使用服务UUID过滤，只按设备名称过滤
   */
  private buildScanFilters(options?: BleScanOptions): BluetoothLEScanFilter[] {
    // 支持的设备名称前缀（参考 Flutter processDeviceList）
    const devicePrefixes = ['']
    
    const filters: BluetoothLEScanFilter[] = []

    // 为每个设备名称前缀创建过滤器（不使用服务UUID过滤）
    if (options?.namePrefix) {
      filters.push({
        namePrefix: options.namePrefix,
        // 不添加 services 字段，让扫描范围更广
      })
    } else {
      // 如果没有指定前缀，为所有支持的设备名称创建过滤器
      devicePrefixes.forEach(prefix => {
        filters.push({
          namePrefix: prefix,
          // 不添加 services 字段
        })
      })
    }

    // 如果没有任何过滤器，使用 acceptAllDevices（不推荐，但可以看到所有设备）
    if (filters.length === 0) {
      // 返回空数组，让 requestDevice 使用 acceptAllDevices
      return []
    }

    return filters
  }

  /**
   * 处理发现的设备
   * 参考 Flutter processDeviceList 的过滤逻辑
   */
  private handleDeviceFound(device: BluetoothDevice, options?: BleScanOptions): void {
    const deviceId = device.id
    const deviceName = device.name || '未知设备'

    // 检查设备名称是否符合要求（参考 Flutter 逻辑）
    const validNames = ['']
    const isValidDevice = validNames.some(name => deviceName.includes(name))
    
    if (!isValidDevice) {
      console.log(`⚠️ 设备名称不匹配，跳过: ${deviceName}`)
      return
    }

    // 模拟 RSSI（Web Bluetooth API 不直接提供 RSSI）
    // 在实际使用中，需要通过连接后的其他方式获取
    const rssi = -60 // 默认值

    const deviceInfo: BleDeviceInfo = {
      id: deviceId,
      name: deviceName,
      rssi,
      lastSeen: Date.now(),
      isNearest: false,
      device,
      connected: false,
    }

    // 检查最小信号强度
    const minRssi = options?.minRssi || BLE_CONFIG.minRssi
    if (rssi < minRssi) {
      return
    }

    this.devices.set(deviceId, deviceInfo)
    console.log(`📱 发现设备: ${deviceName} (${deviceId})`)

    // 更新最近设备
    this.updateNearestDevice()

    // 触发回调
    this.notifyDeviceListChanged()
  }

  /**
   * 清理超时设备
   */
  private cleanupTimeoutDevices(): void {
    const now = Date.now()
    const timeoutMs = BLE_CONFIG.deviceTimeout * 1000
    let hasChanges = false

    this.devices.forEach((device, id) => {
      if (now - device.lastSeen > timeoutMs) {
        console.log(`⏰ 设备超时被移除: ${device.name}`)
        this.devices.delete(id)
        hasChanges = true
      }
    })

    if (hasChanges) {
      this.updateNearestDevice()
      this.notifyDeviceListChanged()
    }
  }

  /**
   * 更新最近设备标记
   */
  private updateNearestDevice(): void {
    const now = Date.now()
    
    // 限制更新频率
    if (now - this.lastNearestUpdateTime < NEAREST_UPDATE_INTERVAL) {
      return
    }

    this.lastNearestUpdateTime = now

    if (this.devices.size === 0) return

    // 找到信号最强的设备（RSSI 最大）
    let maxRssi = -200
    let nearestId: string | null = null

    this.devices.forEach((device, id) => {
      // 重置所有设备的 isNearest 标记
      device.isNearest = false

      // 只考虑信号强度 > -80 的设备
      if (device.rssi > maxRssi && device.rssi > -80) {
        maxRssi = device.rssi
        nearestId = id
      }
    })

    // 标记最近的设备
    if (nearestId) {
      const nearest = this.devices.get(nearestId)
      if (nearest) {
        nearest.isNearest = true
        console.log(`📍 最近设备: ${nearest.name} (RSSI: ${nearest.rssi})`)
      }
    }
  }

  /**
   * 启动清理定时器
   */
  private startCleanupTimer(): void {
    this.stopCleanupTimer()
    this.cleanupTimer = window.setInterval(() => {
      this.cleanupTimeoutDevices()
    }, DEVICE_CLEANUP_INTERVAL)
  }

  /**
   * 停止清理定时器
   */
  private stopCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = null
    }
  }

  /**
   * 停止最近设备更新定时器
   */
  private stopNearestUpdateTimer(): void {
    if (this.nearestUpdateTimer) {
      clearInterval(this.nearestUpdateTimer)
      this.nearestUpdateTimer = null
    }
  }

  /**
   * 通知设备列表变化
   */
  private notifyDeviceListChanged(): void {
    const deviceList = this.getDeviceList()
    this.onDeviceFoundCallback?.(deviceList)
  }

  /**
   * 获取设备列表（按信号强度排序）
   */
  getDeviceList(): BleDeviceInfo[] {
    return Array.from(this.devices.values()).sort((a, b) => {
      // 最近的设备排在最前面
      if (a.isNearest && !b.isNearest) return -1
      if (!a.isNearest && b.isNearest) return 1
      // 按信号强度排序
      return b.rssi - a.rssi
    })
  }

  /**
   * 获取指定ID的设备
   */
  getDevice(id: string): BleDeviceInfo | undefined {
    return this.devices.get(id)
  }

  /**
   * 设置设备发现回调
   */
  onDeviceFound(callback: (devices: BleDeviceInfo[]) => void): void {
    this.onDeviceFoundCallback = callback
  }

  /**
   * 设置错误回调
   */
  onError(callback: (error: Error) => void): void {
    this.onErrorCallback = callback
  }

  /**
   * 清空设备列表
   */
  clear(): void {
    this.devices.clear()
    this.notifyDeviceListChanged()
  }

  /**
   * 获取扫描状态
   */
  get scanning(): boolean {
    return this.isScanning
  }

  /**
   * 销毁扫描器
   */
  destroy(): void {
    this.stopScan()
    this.devices.clear()
    this.onDeviceFoundCallback = undefined
    this.onErrorCallback = undefined
  }
}

// 导出单例
export const bleScanner = new BleScanner()

