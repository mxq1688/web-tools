/**
 * BLE 设备信息管理
 */

import { ElMessage } from 'element-plus'
import { bleConnection } from './connection'

export class BleDevice {
  /**
   * 获取设备状态
   * 参考 Flutter reSyncRecStatus 方法
   */
  async getDeviceStatus(): Promise<void> {
    if (!bleConnection.isConnected) {
      return
    }
    
    try {
      // 构建获取设备状态命令（参考 Flutter 协议）
      const arr = new Uint8Array(3)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 3 = 0x03
      arr[offset++] = 3 & 0xff
      arr[offset++] = (3 >>> 8) & 0xff
      
      console.log('📊 发送获取设备状态命令:', arr)
      await bleConnection.writeData(arr)
      
      console.log('📊 正在获取设备状态...')
    } catch (error: any) {
      console.error('获取设备状态失败:', error)
      throw error
    }
  }

  /**
   * 获取其他配置（麦克风增益、录音模式等）
   * 参考 Flutter getGeneralSetting 方法
   */
  async getGeneralSetting(): Promise<void> {
    if (!bleConnection.isConnected) {
      return
    }
    
    try {
      // 构建获取通用设置命令（参考 Flutter 协议）
      const arr = new Uint8Array(4)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 8 = 0x08
      arr[offset++] = 8 & 0xff
      arr[offset++] = (8 >>> 8) & 0xff
      
      // 参数 (1 byte) - 1
      arr[offset++] = 1 & 0xff
      
      console.log('⚙️ 发送获取通用设置命令:', arr)
      await bleConnection.writeData(arr)
      
      console.log('⚙️ 正在获取通用设置...')
    } catch (error: any) {
      console.error('获取通用设置失败:', error)
      throw error
    }
  }

  /**
   * 获取电池电量
   * 参考 Flutter writeBle.dart getBatt 方法
   */
  async getBatteryLevel(): Promise<void> {
    if (!bleConnection.isConnected) {
      ElMessage.warning('设备未连接')
      return
    }
    
    try {
      // 构建获取电池电量命令（参考 Flutter 协议）
      const arr = new Uint8Array(3)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 9 = 0x09
      arr[offset++] = 9 & 0xff
      arr[offset++] = (9 >>> 8) & 0xff
      
      console.log('🔋 发送获取电池电量命令:', arr)
      await bleConnection.writeData(arr)
      
      console.log('🔋 正在获取电池电量...')
    } catch (error: any) {
      console.error('获取电池电量失败:', error)
      throw error
    }
  }

  /**
   * 设置 USB 模式
   * 参考 Flutter setUsbMode 方法
   */
  async setUsbMode(): Promise<void> {
    if (!bleConnection.isConnected) {
      return
    }
    
    try {
      // 构建设置 USB 模式命令（参考 Flutter 协议）
      const arr = new Uint8Array(4)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 12 = 0x0C
      arr[offset++] = 12 & 0xff
      arr[offset++] = (12 >>> 8) & 0xff
      
      // USB 模式 (1 byte) - 0 = 关闭 USB
      arr[offset++] = 0 & 0xff
      
      console.log('🔌 发送设置 USB 模式命令:', arr)
      await bleConnection.writeData(arr)
      
      console.log('🔌 正在设置 USB 模式...')
    } catch (error: any) {
      console.error('设置 USB 模式失败:', error)
      throw error
    }
  }

  /**
   * 解析设备响应数据
   * 参考 Flutter 代码中的响应处理
   */
  parseDeviceResponse(bytes: Uint8Array): {
    type: 'deviceStatus' | 'battery' | 'recording' | 'generalSetting' | 'usbMode' | 'unknown'
    data?: any
  } {
    if (bytes.length < 2) {
      return { type: 'unknown' }
    }

    const command = bytes[1] // 命令码
    
    switch (command) {
      case 3: // 设备状态响应
        if (bytes.length >= 4) {
          const state = (bytes[2] << 8) | bytes[3] // 状态值（2字节）
          console.log('📊 设备状态响应:', state.toString(16))
          
          return {
            type: 'deviceStatus',
            data: {
              state,
              isRecording: state === 0x1003,
              isCharging: state === 0x2001,
              isOta: state === 0x2003
            }
          }
        }
        break
        
      case 8: // 通用设置响应
        if (bytes.length >= 7) {
          const settings = {
            rec_led_status: bytes[2],
            rec_scene: bytes[3],
            rec_mode: bytes[4],
            row_data: bytes[5],
            dmic_mode: bytes[6]
          }
          console.log('⚙️ 通用设置响应:', settings)
          
          return {
            type: 'generalSetting',
            data: settings
          }
        }
        break
        
      case 9: // 电池电量响应
        if (bytes.length >= 3) {
          const batteryLevel = bytes[2]
          console.log('🔋 电池电量:', batteryLevel)
          
          return {
            type: 'battery',
            data: { batteryLevel }
          }
        }
        break
        
      case 12: // USB 模式响应
        console.log('🔌 USB 模式设置响应')
        return {
          type: 'usbMode',
          data: { success: true }
        }
        
      case 21: // 录音暂停响应
        console.log('📩 录音暂停响应')
        return {
          type: 'recording',
          data: { status: 'paused' }
        }
        
      case 22: // 录音恢复响应
        console.log('📩 录音恢复响应')
        return {
          type: 'recording',
          data: { status: 'recording' }
        }
        
      case 23: // 录音停止响应
        console.log('📩 录音停止响应')
        return {
          type: 'recording',
          data: { status: 'stopped' }
        }
        
      default:
        console.log('📩 未知响应:', command)
        return { type: 'unknown' }
    }

    return { type: 'unknown' }
  }
}

// 单例实例
export const bleDevice = new BleDevice()
