/**
 * BLE 类型定义
 */

// BLE 设备信息
export interface BleDeviceInfo {
  id: string // 设备ID
  name: string // 设备名称
  rssi: number // 信号强度
  sn?: string // 设备序列号
  isNearest?: boolean // 是否是最近的设备
  lastSeen: number // 最后发现时间戳
  connected?: boolean // 是否已连接
  device?: BluetoothDevice // 原始设备对象
  advertisementData?: BleAdvertisementData // 广播数据
}

// BLE 广播数据结构
export interface BleAdvertisementData {
  flags?: number // 广播标志
  completeLocalName?: string // 完整设备名称
  shortLocalName?: string // 短设备名称
  txPowerLevel?: number // 传输功率
  manufacturerData?: BleManufacturerData[] // 制造商数据
  serviceUuids?: string[] // 服务UUID列表
  serviceData?: BleServiceData[] // 服务数据
  appearance?: number // 设备外观
  customData?: BleCustomData[] // 自定义数据
}

// 制造商数据
export interface BleManufacturerData {
  companyId: number // 公司ID
  data: Uint8Array // 数据
  companyName?: string // 公司名称
}

// 服务数据
export interface BleServiceData {
  serviceUuid: string // 服务UUID
  data: Uint8Array // 数据
}

// 自定义数据
export interface BleCustomData {
  type: number // 数据类型
  data: Uint8Array // 数据
  description?: string // 描述
}

// BLE 连接状态
export enum BleConnectionStatus {
  DISCONNECTED = 0, // 未连接
  CONNECTING = 1, // 连接中
  CONNECTED = 2, // 已连接
}

// BLE 录音状态
export enum BleAudioStatus {
  IDLE = 0, // 空闲
  READY = 1, // 就绪
  RECORDING = 2, // 录音中
  PAUSED = 3, // 已暂停
}

// BLE 设备详细信息
export interface BleDeviceDetail {
  sn: string
  name: string
  version?: string
  batteryLevel: number
  chargeStatus: number // 0:未充电 1:充电中
  audioType?: number // 1:通话模式 2:会议模式
  audioStatus: BleAudioStatus
  connectionStatus: BleConnectionStatus
}

// 扫描选项
export interface BleScanOptions {
  namePrefix?: string // 设备名称前缀过滤
  services?: string[] // 服务UUID列表
  minRssi?: number // 最小信号强度
  timeout?: number // 扫描超时时间（毫秒）
  deviceTimeout?: number // 设备超时时间（秒）
}

// BLE 配置
export interface BleConfig {
  serviceUUID: string
  notifyUUID: string
  writeUUID: string
  deviceNamePrefix: string
  scanTimeout: number
  deviceTimeout: number
  minRssi: number
}

