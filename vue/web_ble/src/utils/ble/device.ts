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
   * 设备握手绑定
   * 参考 Flutter bindDevice 方法
   */
  async bindDevice(): Promise<void> {
    if (!bleConnection.isConnected) {
      console.log('⚠️ 设备未连接，跳过握手')
      return
    }
    
    try {
      console.log('🤝 开始设备握手绑定...')
      
      // 第一步：发送初次握手命令 (firstHander)
      // 参考 Flutter firstHander: [1, 1, 0, platformType, bleVersion, 0]
      const firstHanderArr = new Uint8Array(6)
      let offset = 0
      
      // 类型 (1 byte)
      firstHanderArr[offset++] = 1
      
      // 命令 (2 bytes) - 1 = 0x01 (握手命令)
      firstHanderArr[offset++] = 1 & 0xff
      firstHanderArr[offset++] = (1 >>> 8) & 0xff
      
      // deviceType (1 byte) - Web平台类型
      firstHanderArr[offset++] = 3  // Web平台
      
      // bleVersion (1 byte)
      firstHanderArr[offset++] = 1
      
      // 初次握手标志 (1 byte)
      firstHanderArr[offset++] = 0
      
      console.log('🤝 发送初次握手命令:', firstHanderArr)
      await bleConnection.writeData(firstHanderArr)
      console.log('✅ 初次握手命令发送成功')
      
      // 等待握手响应
      console.log('⏳ 等待握手响应...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 第二步：发送Token (sendToken)
      // 参考 Flutter sendToken: [1, 1, 0, platformType, bleVersion, 1, token(16), 0, deviceToken(8), nameLength, name]
      const token = "1234567890000000"
      const deviceName = "Web BLE Debug Tool"
      const nameBytes = new TextEncoder().encode(deviceName)
      
      const tokenArr = new Uint8Array(6 + 16 + 1 + 8 + 1 + nameBytes.length)
      offset = 0
      
      // 类型 (1 byte)
      tokenArr[offset++] = 1
      
      // 命令 (2 bytes) - 1 = 0x01 (握手命令)
      tokenArr[offset++] = 1 & 0xff
      tokenArr[offset++] = (1 >>> 8) & 0xff
      
      // deviceType (1 byte) - Web平台类型
      tokenArr[offset++] = 3  // Web平台
      
      // bleVersion (1 byte)
      tokenArr[offset++] = 1
      
      // 校验通过标志 (1 byte)
      tokenArr[offset++] = 1
      
      // Token (16 bytes)
      for (let i = 0; i < 16; i++) {
        tokenArr[offset++] = token.charCodeAt(i)
      }
      
      // Long_audio (1 byte)
      tokenArr[offset++] = 0
      
      // Device_token (8 bytes) - 扫码绑定传过来的笔端token，非扫码绑定写8个0
      for (let i = 0; i < 8; i++) {
        tokenArr[offset++] = 0
      }
      
      // 设备名称长度 (1 byte)
      tokenArr[offset++] = nameBytes.length
      
      // 设备名称
      for (let i = 0; i < nameBytes.length; i++) {
        tokenArr[offset++] = nameBytes[i]
      }
      
      console.log('🔑 发送Token命令:', tokenArr)
      await bleConnection.writeData(tokenArr)
      console.log('✅ Token命令发送成功')
      
      console.log('✅ 设备握手绑定完成')
    } catch (error: any) {
      console.log('⚠️ 设备握手绑定失败，但不影响连接:', error)
      // 不抛出错误，避免影响连接状态
    }
  }

  /**
   * 同步时间
   * 参考 Flutter syncTime 方法
   */
  async syncTime(): Promise<void> {
    if (!bleConnection.isConnected) {
      console.log('⚠️ 设备未连接，跳过时间同步')
      return
    }
    
    try {
      console.log('⏰ 开始时间同步...')
      
      // 获取当前时间和时区信息
      const now = new Date()
      const gmtTimestamp = Math.floor(now.getTime() / 1000) // 秒级时间戳
      const timeZoneOffset = -now.getTimezoneOffset() / 60 // 时区偏移（小时）
      
      console.log('⏰ 时间信息:', {
        timestamp: gmtTimestamp,
        timeZone: timeZoneOffset,
        date: now.toISOString()
      })
      
      // 构建时间同步命令（参考 Flutter 协议）
      // [1, 4, 0, timestamp(4), timeZone(1)]
      const arr = new Uint8Array(8)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 4 = 0x04 (时间同步)
      arr[offset++] = 4 & 0xff
      arr[offset++] = (4 >>> 8) & 0xff
      
      // GMT时间戳 (4 bytes) - 手机时间标准(UTC)
      arr[offset++] = gmtTimestamp & 0xff
      arr[offset++] = (gmtTimestamp >>> 8) & 0xff
      arr[offset++] = (gmtTimestamp >>> 16) & 0xff
      arr[offset++] = (gmtTimestamp >>> 24) & 0xff
      
      // 时区 (1 byte)
      arr[offset++] = timeZoneOffset & 0xff
      
      console.log('⏰ 发送时间同步命令:', arr)
      console.log('⏰ 命令详情:', {
        type: 1,
        command: 4,
        timestamp: gmtTimestamp,
        timeZone: timeZoneOffset
      })
      
      await bleConnection.writeData(arr)
      console.log('✅ 时间同步命令发送成功')
      
      console.log('✅ 时间同步完成')
    } catch (error: any) {
      console.log('⚠️ 时间同步失败，但不影响连接:', error)
      // 不抛出错误，避免影响连接状态
    }
  }

  /**
   * 加载设备文件
   * 参考 Flutter loadDeviceFile 方法
   */
  async loadDeviceFile(): Promise<void> {
    if (!bleConnection.isConnected) {
      console.log('⚠️ 设备未连接，跳过文件加载')
      return
    }
    
    try {
      console.log('📁 开始加载设备文件...')
      
      // 获取当前时间前180天的时间戳（参考Flutter默认值）
      const now = new Date()
      const daysAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
      const startTime = Math.floor(daysAgo.getTime() / 1000)
      
      console.log('📁 文件查询时间范围:', {
        startTime,
        startDate: daysAgo.toISOString(),
        days: 180
      })
      
      // 构建获取录音文件命令（参考 Flutter getRecfile）
      // 命令26: 获取录音文件列表
      const arr = new Uint8Array(7)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 26 = 0x1A (获取录音文件)
      arr[offset++] = 26 & 0xff
      arr[offset++] = (26 >>> 8) & 0xff
      
      // 开始时间戳 (4 bytes)
      arr[offset++] = startTime & 0xff
      arr[offset++] = (startTime >>> 8) & 0xff
      arr[offset++] = (startTime >>> 16) & 0xff
      arr[offset++] = (startTime >>> 24) & 0xff
      
      console.log('📁 发送获取文件列表命令:', arr)
      console.log('📁 命令详情:', {
        type: 1,
        command: 26,
        startTime,
        startDate: daysAgo.toISOString()
      })
      
      await bleConnection.writeData(arr)
      console.log('✅ 获取文件列表命令发送成功')
      
      console.log('✅ 设备文件加载完成')
    } catch (error: any) {
      console.log('⚠️ 加载设备文件失败，但不影响连接:', error)
      // 不抛出错误，避免影响连接状态
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
        if (bytes.length >= 4) {
          const charging = bytes[2]  // 充电状态 (0=未充电, 1=充电中)
          const level = bytes[3]     // 电量等级 (0-100)
          console.log('🔋 电池电量:', { charging, level })
          
          return {
            type: 'battery',
            data: { 
              charging: charging === 1,
              level: level,
              batteryLevel: level  // 保持向后兼容
            }
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
