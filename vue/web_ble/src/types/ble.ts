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

// BLE 录音模式
export enum BleRecordingMode {
  RECORDING = 1, // 录音模式
  CONFERENCE = 2, // 会议模式
}

// BLE 通用设置
export interface BleGeneralSettings {
  rec_led_status: number // 录音LED状态
  rec_scene: number // 录音场景 (1=录音, 2=会议)
  rec_mode: number // 录音模式
  row_data: number // 原始数据
  dmic_mode: number // 麦克风增益/模式
}

// BLE 设备详细信息
export interface BleDeviceDetail {
  sn: string
  name: string
  version?: string
  batteryLevel: number
  chargeStatus: number // 0:未充电 1:充电中
  audioType?: number // 1:录音模式 2:会议模式
  audioStatus: BleAudioStatus
  connectionStatus: BleConnectionStatus
  generalSettings?: BleGeneralSettings // 通用设置
  storageInfo?: BleStorageInfo // 存储信息
  ledEnabled?: boolean // LED灯效状态
  systemVersion?: string // 系统版本
}

// BLE 存储信息
export interface BleStorageInfo {
  totalSpace: number // 总空间（字节）
  free: number // 剩余空间（字节）
  used: number // 已使用空间（字节）
  useRate: number // 使用率（百分比，0-100）
  isFull: number // 是否已满
}

// BLE 文件信息
export interface BleFileInfo {
  sessionId: number // 会话ID
  fileSize: number // 文件大小（字节）
  attr: number // 文件属性
  downloadProgress?: number // 下载进度 (0-100)
  isDownloading?: boolean // 是否正在下载
  isCompleted?: boolean // 是否下载完成
  data?: Uint8Array // 下载的文件数据
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

