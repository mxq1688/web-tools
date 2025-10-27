/**
 * BLE 配置文件
 */

import type { BleConfig } from '@/types/ble'

// BLE UUID 配置（来自 blueKey.dart，Web Bluetooth API要求小写格式）
export const BLE_CONFIG: BleConfig = {
  // 服务UUID（连接后使用，扫描时不作为过滤条件）
  serviceUUID: '00001910-0000-1000-8000-00805f9b34fb',
  
  // 通知特征UUID（用于接收数据）
  notifyUUID: '00002bb0-0000-1000-8000-00805f9b34fb',
  
  // 写入特征UUID（用于发送数据）
  writeUUID: '00002bb1-0000-1000-8000-00805f9b34fb',
  
  // 设备名称前缀过滤
  // 扫描时只按名称过滤，不使用服务UUID过滤（让扫描范围更广）
  deviceNamePrefix: '',  // 留空以支持所有预定义的设备名称
  
  // 扫描超时时间（毫秒）
  scanTimeout: 30000, // 30秒
  
  // 设备超时时间（秒）- 超过此时间未发现的设备将被移除
  deviceTimeout: 10,
  
  // 最小信号强度（RSSI）
  minRssi: -100, // dBm
}

// BLE 错误信息
export const BLE_ERRORS = {
  NOT_SUPPORTED: '当前浏览器不支持 Web Bluetooth API',
  NOT_AVAILABLE: '蓝牙不可用，请确保设备已开启蓝牙',
  PERMISSION_DENIED: '用户拒绝了蓝牙访问权限',
  NOT_FOUND: '未找到符合条件的设备',
  CONNECTION_FAILED: '设备连接失败',
  DISCONNECTED: '设备已断开连接',
  SERVICE_NOT_FOUND: '未找到指定的服务',
  CHARACTERISTIC_NOT_FOUND: '未找到指定的特征值',
  WRITE_FAILED: '数据写入失败',
  READ_FAILED: '数据读取失败',
}

// 设备超时清理间隔（毫秒）
export const DEVICE_CLEANUP_INTERVAL = 3000 // 3秒

// 最近设备更新间隔（毫秒）
export const NEAREST_UPDATE_INTERVAL = 5000 // 5秒

