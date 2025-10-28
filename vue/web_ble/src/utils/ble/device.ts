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
   * 获取存储空间
   * 参考 Flutter getStorageVolume 方法
   */
  async getStorageVolume(): Promise<void> {
    if (!bleConnection.isConnected) {
      return
    }
    
    try {
      // 构建获取存储空间命令（参考 Flutter 协议）
      const arr = new Uint8Array(3)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 6 = 0x06
      arr[offset++] = 6 & 0xff
      arr[offset++] = (6 >>> 8) & 0xff
      
      console.log('💾 发送获取存储空间命令:', arr)
      await bleConnection.writeData(arr)
      
      console.log('💾 正在获取存储空间...')
    } catch (error: any) {
      console.error('获取存储空间失败:', error)
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
   * 获取系统版本号
   * 参考 Flutter 命令 13
   */
  async getSystemVersion(): Promise<void> {
    if (!bleConnection.isConnected) {
      return
    }
    
    try {
      const arr = new Uint8Array(3)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 13 = 0x0D
      arr[offset++] = 13 & 0xff
      arr[offset++] = (13 >>> 8) & 0xff
      
      console.log('📱 发送获取系统版本命令:', arr)
      await bleConnection.writeData(arr)
      
      console.log('📱 正在获取系统版本...')
    } catch (error: any) {
      console.error('获取系统版本失败:', error)
      throw error
    }
  }

  /**
   * 打开WiFi热点
   * 参考 Flutter openWifi 方法
   */
  async openWifi(): Promise<void> {
    if (!bleConnection.isConnected) {
      return
    }
    
    try {
      const arr = new Uint8Array(3)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 10 = 0x0A
      arr[offset++] = 10 & 0xff
      arr[offset++] = (10 >>> 8) & 0xff
      
      console.log('📶 发送打开WiFi命令:', arr)
      await bleConnection.writeData(arr)
      
      console.log('📶 正在打开WiFi...')
    } catch (error: any) {
      console.error('打开WiFi失败:', error)
      throw error
    }
  }

  /**
   * 关闭WiFi热点
   * 参考 Flutter 命令 14
   */
  async closeWifi(): Promise<void> {
    if (!bleConnection.isConnected) {
      return
    }
    
    try {
      const arr = new Uint8Array(3)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 14 = 0x0E
      arr[offset++] = 14 & 0xff
      arr[offset++] = (14 >>> 8) & 0xff
      
      console.log('📶 发送关闭WiFi命令:', arr)
      await bleConnection.writeData(arr)
      
      console.log('📶 正在关闭WiFi...')
    } catch (error: any) {
      console.error('关闭WiFi失败:', error)
      throw error
    }
  }

  /**
   * 获取录音灯效状态
   * 参考 Flutter 命令 33
   */
  async getRecordLed(): Promise<void> {
    if (!bleConnection.isConnected) {
      return
    }
    
    try {
      const arr = new Uint8Array(3)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 33 = 0x21
      arr[offset++] = 33 & 0xff
      arr[offset++] = (33 >>> 8) & 0xff
      
      console.log('💡 发送获取录音灯效命令:', arr)
      await bleConnection.writeData(arr)
      
      console.log('💡 正在获取录音灯效状态...')
    } catch (error: any) {
      console.error('获取录音灯效失败:', error)
      throw error
    }
  }

  /**
   * 设置录音灯效
   * 参考 Flutter 命令 34
   */
  async setRecordLed(enabled: boolean): Promise<void> {
    if (!bleConnection.isConnected) {
      return
    }
    
    try {
      const arr = new Uint8Array(4)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 34 = 0x22
      arr[offset++] = 34 & 0xff
      arr[offset++] = (34 >>> 8) & 0xff
      
      // 灯效状态 (1 byte) - 0=关闭, 1=开启
      arr[offset++] = enabled ? 1 : 0
      
      console.log('💡 发送设置录音灯效命令:', arr, enabled ? '开启' : '关闭')
      await bleConnection.writeData(arr)
      
      console.log('💡 正在设置录音灯效...')
    } catch (error: any) {
      console.error('设置录音灯效失败:', error)
      throw error
    }
  }

  /**
   * 解绑设备
   * 参考 Flutter unbind 方法
   */
  async unbindDevice(cleanType: number = 0): Promise<void> {
    if (!bleConnection.isConnected) {
      return
    }
    
    try {
      const arr = new Uint8Array(4)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 5 = 0x05
      arr[offset++] = 5 & 0xff
      arr[offset++] = (5 >>> 8) & 0xff
      
      // cleanType (1 byte) - 清除类型
      arr[offset++] = cleanType & 0xff
      
      console.log('🔓 发送解绑设备命令:', arr)
      await bleConnection.writeData(arr)
      
      ElMessage.success('设备已解绑')
    } catch (error: any) {
      console.error('解绑设备失败:', error)
      throw error
    }
  }

  /**
   * 重置密码
   * 参考 Flutter resetPassword 方法
   */
  async resetPassword(): Promise<void> {
    if (!bleConnection.isConnected) {
      return
    }
    
    try {
      const arr = new Uint8Array(3)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 7 = 0x07
      arr[offset++] = 7 & 0xff
      arr[offset++] = (7 >>> 8) & 0xff
      
      console.log('🔑 发送重置密码命令:', arr)
      await bleConnection.writeData(arr)
      
      console.log('🔑 正在重置密码...')
    } catch (error: any) {
      console.error('重置密码失败:', error)
      throw error
    }
  }

  /**
   * 配置WiFi
   * 参考 Flutter configWifi 方法
   */
  async configWifi(ssid: string, password: string, testServer: number = 0): Promise<void> {
    if (!bleConnection.isConnected) {
      return
    }
    
    try {
      // SSID和密码各占33字节
      const arr = new Uint8Array(3 + 33 + 33 + 1)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 14 = 0x0E
      arr[offset++] = 14 & 0xff
      arr[offset++] = (14 >>> 8) & 0xff
      
      // SSID (33 bytes, 固定长度，不足补0)
      const ssidBytes = new TextEncoder().encode(ssid)
      for (let i = 0; i < 33; i++) {
        arr[offset++] = i < ssidBytes.length ? ssidBytes[i] : 0
      }
      
      // Password (33 bytes, 固定长度，不足补0)
      const passwordBytes = new TextEncoder().encode(password)
      for (let i = 0; i < 33; i++) {
        arr[offset++] = i < passwordBytes.length ? passwordBytes[i] : 0
      }
      
      // testServer (1 byte)
      arr[offset++] = testServer & 0xff
      
      console.log('📶 发送配置WiFi命令:', { ssid, password: '***', testServer })
      await bleConnection.writeData(arr)
      
      ElMessage.success('WiFi配置已发送')
    } catch (error: any) {
      console.error('配置WiFi失败:', error)
      throw error
    }
  }

  /**
   * 搜索WiFi
   * 参考 Flutter searchWifi 方法
   */
  async searchWifi(): Promise<void> {
    if (!bleConnection.isConnected) {
      return
    }
    
    try {
      const arr = new Uint8Array(3)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 15 = 0x0F
      arr[offset++] = 15 & 0xff
      arr[offset++] = (15 >>> 8) & 0xff
      
      console.log('📶 发送搜索WiFi命令:', arr)
      await bleConnection.writeData(arr)
      
      console.log('📶 正在搜索WiFi...')
    } catch (error: any) {
      console.error('搜索WiFi失败:', error)
      throw error
    }
  }

  /**
   * 删除录音
   * 参考 Flutter delRecord 方法
   */
  async deleteRecord(sessionId: number): Promise<void> {
    if (!bleConnection.isConnected) {
      return
    }
    
    try {
      const arr = new Uint8Array(7)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 30 = 0x1E
      arr[offset++] = 30 & 0xff
      arr[offset++] = (30 >>> 8) & 0xff
      
      // sessionId (4 bytes)
      arr[offset++] = sessionId & 0xff
      arr[offset++] = (sessionId >>> 8) & 0xff
      arr[offset++] = (sessionId >>> 16) & 0xff
      arr[offset++] = (sessionId >>> 24) & 0xff
      
      console.log('🗑️ 发送删除录音命令:', sessionId)
      await bleConnection.writeData(arr)
      
      ElMessage.success('删除命令已发送')
    } catch (error: any) {
      console.error('删除录音失败:', error)
      throw error
    }
  }

  /**
   * 获取会话文件列表
   * 参考 Flutter getSesionList 方法
   */
  async getSessionList(uid: number = 0, sessionId: number = 0, onlyOne: number = 0): Promise<void> {
    if (!bleConnection.isConnected) {
      return
    }
    
    try {
      const arr = new Uint8Array(12)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 26 = 0x1A
      arr[offset++] = 26 & 0xff
      arr[offset++] = (26 >>> 8) & 0xff
      
      // uid (4 bytes)
      arr[offset++] = uid & 0xff
      arr[offset++] = (uid >>> 8) & 0xff
      arr[offset++] = (uid >>> 16) & 0xff
      arr[offset++] = (uid >>> 24) & 0xff
      
      // sessionId (4 bytes)
      arr[offset++] = sessionId & 0xff
      arr[offset++] = (sessionId >>> 8) & 0xff
      arr[offset++] = (sessionId >>> 16) & 0xff
      arr[offset++] = (sessionId >>> 24) & 0xff
      
      // onlyOne (1 byte)
      arr[offset++] = onlyOne & 0xff
      
      console.log('📋 发送获取文件列表命令:', { uid, sessionId, onlyOne })
      await bleConnection.writeData(arr)
      
      console.log('📋 正在获取文件列表...')
    } catch (error: any) {
      console.error('获取文件列表失败:', error)
      throw error
    }
  }

  /**
   * 同步文件
   * 参考 Flutter syncFile 方法
   */
  async syncFile(sessionId: number, start: number, end: number, noOggHeader: number = 0): Promise<void> {
    if (!bleConnection.isConnected) {
      return
    }
    
    try {
      const arr = new Uint8Array(14)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 28 = 0x1C
      arr[offset++] = 28 & 0xff
      arr[offset++] = (28 >>> 8) & 0xff
      
      // sessionId (4 bytes)
      arr[offset++] = sessionId & 0xff
      arr[offset++] = (sessionId >>> 8) & 0xff
      arr[offset++] = (sessionId >>> 16) & 0xff
      arr[offset++] = (sessionId >>> 24) & 0xff
      
      // start (4 bytes)
      arr[offset++] = start & 0xff
      arr[offset++] = (start >>> 8) & 0xff
      arr[offset++] = (start >>> 16) & 0xff
      arr[offset++] = (start >>> 24) & 0xff
      
      // end (4 bytes)
      arr[offset++] = end & 0xff
      arr[offset++] = (end >>> 8) & 0xff
      arr[offset++] = (end >>> 16) & 0xff
      arr[offset++] = (end >>> 24) & 0xff
      
      // noOggHeader (1 byte)
      arr[offset++] = noOggHeader & 0xff
      
      console.log('📥 发送同步文件命令:', { sessionId, start, end, noOggHeader })
      await bleConnection.writeData(arr)
      
      console.log('📥 正在同步文件...')
    } catch (error: any) {
      console.error('同步文件失败:', error)
      throw error
    }
  }

  /**
   * 停止同步文件
   * 参考 Flutter syncFileStop 方法
   */
  async stopSyncFile(): Promise<void> {
    if (!bleConnection.isConnected) {
      return
    }
    
    try {
      const arr = new Uint8Array(3)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 29 = 0x1D
      arr[offset++] = 29 & 0xff
      arr[offset++] = (29 >>> 8) & 0xff
      
      console.log('⏹️ 发送停止同步文件命令:', arr)
      await bleConnection.writeData(arr)
      
      ElMessage.success('已停止同步')
    } catch (error: any) {
      console.error('停止同步失败:', error)
      throw error
    }
  }

  /**
   * 清除设备数据
   * 参考 Flutter clearData 方法
   */
  async clearDeviceData(): Promise<void> {
    if (!bleConnection.isConnected) {
      return
    }
    
    try {
      const arr = new Uint8Array(3)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 104 = 0x68
      arr[offset++] = 104 & 0xff
      arr[offset++] = (104 >>> 8) & 0xff
      
      console.log('🗑️ 发送清除数据命令:', arr)
      await bleConnection.writeData(arr)
      
      ElMessage.success('清除命令已发送')
    } catch (error: any) {
      console.error('清除数据失败:', error)
      throw error
    }
  }

  /**
   * 发送心跳包
   * 参考 Flutter 命令 110
   */
  async sendHeartbeat(): Promise<void> {
    if (!bleConnection.isConnected) {
      return
    }
    
    try {
      const arr = new Uint8Array(3)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 110 = 0x6E
      arr[offset++] = 110 & 0xff
      arr[offset++] = (110 >>> 8) & 0xff
      
      console.log('💓 发送心跳包:', arr)
      await bleConnection.writeData(arr)
    } catch (error: any) {
      console.error('发送心跳包失败:', error)
      // 心跳包失败不抛出错误
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
    type: 'deviceStatus' | 'battery' | 'recording' | 'generalSetting' | 'usbMode' | 'storage' | 'wifi' | 'led' | 'version' | 'heartbeat' | 'timeSync' | 'fileList' | 'syncFile' | 'syncFileEnd' | 'stopSync' | 'deleteConfirm' | 'fileData' | 'unknown'
    data?: any
  } {
    if (bytes.length < 3) {
      return { type: 'unknown' }
    }

    // 数据结构: [type(1字节), cmd_low(1字节), cmd_high(1字节), ...数据]
    const type = bytes[0]
    
    // 类型2: 文件数据流
    if (type === 2) {
      // 数据结构: [type(1), sessionId(4), offset(4), size(2), data(...)]
      if (bytes.length >= 11) {
        const sessionId = bytes[1] | (bytes[2] << 8) | (bytes[3] << 16) | (bytes[4] << 24)
        const offset = bytes[5] | (bytes[6] << 8) | (bytes[7] << 16) | (bytes[8] << 24)
        const size = bytes[9] | (bytes[10] << 8)
        const data = bytes.slice(11, 11 + size)
        
        console.log('📦 文件数据块:', { sessionId, offset, size, dataLength: data.length })
        
        return {
          type: 'fileData',
          data: { sessionId, offset, size, data }
        }
      }
      return { type: 'unknown' }
    }
    
    const command = bytes[1] | (bytes[2] << 8) // 命令码（小端序，2字节）
    
    console.log('📦 解析响应数据:', { 
      type, 
      command, 
      length: bytes.length,
      hex: Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ')
    })
    
    switch (command) {
      case 3: // 设备状态响应
        if (bytes.length >= 11) {
          // 数据结构: [type(1), cmd_low(1), cmd_high(1), state(4), udisk(1), privacy(1), privacy1(1), keyState(1)]
          // 读取 state (4字节，小端序)
          const state = bytes[3] | (bytes[4] << 8) | (bytes[5] << 16) | (bytes[6] << 24)
          const udisk = bytes[7]
          const privacy = bytes[8]
          const privacy1 = bytes[9]
          const keyState = bytes[10]
          
          console.log('📊 设备状态响应:', { 
            state: state.toString(16), 
            udisk, 
            privacy, 
            privacy1, 
            keyState 
          })
          
          return {
            type: 'deviceStatus',
            data: {
              state,
              udisk,
              privacy,
              privacy1,
              keyState,
              isRecording: state === 0x1003,
              isCharging: state === 0x2001,
              isOta: state === 0x2003
            }
          }
        }
        break
        
      case 8: // 通用设置响应
        if (bytes.length >= 8) {
          // 数据结构: [type(1), cmd_low(1), cmd_high(1), rec_led_status(1), rec_scene(1), rec_mode(1), row_data(1), dmic_mode(1)]
          const settings = {
            rec_led_status: bytes[3],
            rec_scene: bytes[4],
            rec_mode: bytes[5],
            row_data: bytes[6],
            dmic_mode: bytes[7]
          }
          console.log('⚙️ 通用设置响应:', settings)
          
          return {
            type: 'generalSetting',
            data: settings
          }
        }
        break
        
      case 9: // 电池电量响应
        if (bytes.length >= 5) {
          // 数据结构: [type(1), cmd_low(1), cmd_high(1), charging(1), level(1)]
          const charging = bytes[3]  // 充电状态 (0=未充电, 1=充电中)
          const level = bytes[4]     // 电量等级 (0-100)
          console.log('🔋 电池电量响应:', { charging, level })
          
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
        
      case 20: // 录音开始响应
        if (bytes.length >= 11) {
          // 数据结构: [type(1), cmd_low(1), cmd_high(1), sessionId(4), scene(1), startTime(4), status(1)]
          const sessionId = bytes[3] | (bytes[4] << 8) | (bytes[5] << 16) | (bytes[6] << 24)
          const scene = bytes[7]
          const startTime = bytes[8] | (bytes[9] << 8) | (bytes[10] << 16) | (bytes[11] << 24)
          const status = bytes.length >= 13 ? bytes[12] : 0
          
          console.log('🎤 录音开始响应:', { sessionId, scene, startTime, status })
          
          return {
            type: 'recording',
            data: { status: 'started', sessionId, scene, startTime }
          }
        }
        break
        
      case 21: // 录音暂停响应
        if (bytes.length >= 11) {
          // 数据结构: [type(1), cmd_low(1), cmd_high(1), sessionId(4), status(1), size(4)]
          const sessionId = bytes[3] | (bytes[4] << 8) | (bytes[5] << 16) | (bytes[6] << 24)
          const pauseStatus = bytes[7]
          const size = bytes[8] | (bytes[9] << 8) | (bytes[10] << 16) | (bytes[11] << 24)
          
          console.log('⏸️ 录音暂停响应:', { sessionId, pauseStatus, size })
          
          return {
            type: 'recording',
            data: { status: 'paused', sessionId, size }
          }
        }
        break
        
      case 22: // 录音恢复响应
        if (bytes.length >= 11) {
          // 数据结构: [type(1), cmd_low(1), cmd_high(1), sessionId(4), status(1), size(4)]
          const sessionId = bytes[3] | (bytes[4] << 8) | (bytes[5] << 16) | (bytes[6] << 24)
          const resumeStatus = bytes[7]
          const size = bytes[8] | (bytes[9] << 8) | (bytes[10] << 16) | (bytes[11] << 24)
          
          console.log('▶️ 录音恢复响应:', { sessionId, resumeStatus, size })
          
          return {
            type: 'recording',
            data: { status: 'recording', sessionId, size }
          }
        }
        break
        
      case 23: // 录音停止响应
        if (bytes.length >= 12) {
          // 数据结构: [type(1), cmd_low(1), cmd_high(1), sessionId(4), status(1), isSave(1), fileSize(4)]
          const sessionId = bytes[3] | (bytes[4] << 8) | (bytes[5] << 16) | (bytes[6] << 24)
          const stopStatus = bytes[7]
          const isSave = bytes[8]
          const fileSize = bytes[9] | (bytes[10] << 8) | (bytes[11] << 16) | (bytes[12] << 24)
          
          console.log('⏹️ 录音停止响应:', { sessionId, stopStatus, isSave, fileSize })
          
          return {
            type: 'recording',
            data: { status: 'stopped', sessionId, isSave, fileSize }
          }
        }
        break
        
      case 26: // 获取文件列表响应
        if (bytes.length >= 11) {
          // 数据结构: [type(1), cmd_low(1), cmd_high(1), uid(4), totals(2), start(2), items...]
          const uid = bytes[3] | (bytes[4] << 8) | (bytes[5] << 16) | (bytes[6] << 24)
          const totals = bytes[7] | (bytes[8] << 8)
          const start = bytes[9] | (bytes[10] << 8)
          
          const items: Array<{sessionId: number, fileSize: number, attr: number}> = []
          const len = Math.min(totals - start, 7)
          
          let offset = 11
          for (let i = 0; i < len; i++) {
            if (offset + 10 <= bytes.length) {
              const sessionId = bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24)
              const fileSize = bytes[offset + 4] | (bytes[offset + 5] << 8) | (bytes[offset + 6] << 16) | (bytes[offset + 7] << 24)
              const attr = bytes[offset + 8] | (bytes[offset + 9] << 8)
              items.push({ sessionId, fileSize, attr })
              offset += 10
            }
          }
          
          console.log('📋 获取文件列表响应:', { uid, totals, start, items })
          
          return {
            type: 'fileList',
            data: { uid, totals, start, items }
          }
        }
        break
        
      case 28: // 同步文件响应
        if (bytes.length >= 8) {
          // 数据结构: [type(1), cmd_low(1), cmd_high(1), sessionId(4), status(1)]
          const sessionId = bytes[3] | (bytes[4] << 8) | (bytes[5] << 16) | (bytes[6] << 24)
          const status = bytes[7]
          
          console.log('📥 同步文件响应:', { sessionId, status })
          
          return {
            type: 'syncFile',
            data: { sessionId, status }
          }
        }
        break
        
      case 29: // 同步文件尾响应
        if (bytes.length >= 9) {
          // 数据结构: [type(1), cmd_low(1), cmd_high(1), sessionId(4), crc(2)]
          const sessionId = bytes[3] | (bytes[4] << 8) | (bytes[5] << 16) | (bytes[6] << 24)
          const crc = bytes[7] | (bytes[8] << 8)
          
          console.log('📦 同步文件尾响应:', { sessionId, crc })
          
          return {
            type: 'syncFileEnd',
            data: { sessionId, crc }
          }
        }
        break
        
      case 30: // 停止同步文件响应
        console.log('⏹️ 停止同步文件响应')
        return {
          type: 'stopSync',
          data: {}
        }
        
      case 31: // 删除文件确认响应
        if (bytes.length >= 7) {
          // 数据结构: [type(1), cmd_low(1), cmd_high(1), sessionId(4)]
          const sessionId = bytes[3] | (bytes[4] << 8) | (bytes[5] << 16) | (bytes[6] << 24)
          
          console.log('🗑️ 删除文件确认响应:', { sessionId })
          
          return {
            type: 'deleteConfirm',
            data: { sessionId }
          }
        }
        break
        
      case 4: // 时间同步响应
        if (bytes.length >= 8) {
          // 数据结构: [type(1), cmd_low(1), cmd_high(1), timeStamp(4), hasStat(1)]
          const timeStamp = bytes[3] | (bytes[4] << 8) | (bytes[5] << 16) | (bytes[6] << 24)
          const hasStat = bytes[7]
          console.log('🕒 时间同步响应:', { timeStamp, hasStat })
          
          return {
            type: 'timeSync',
            data: { timeStamp, hasStat }
          }
        }
        break
        
      case 6: // 存储空间响应
        if (bytes.length >= 15) {
          // 数据结构: [type(1), cmd_low(1), cmd_high(1), totalSpace(4), free(4), useRate(4), isFull(1)]
          const totalSpace = bytes[3] | (bytes[4] << 8) | (bytes[5] << 16) | (bytes[6] << 24)
          const free = bytes[7] | (bytes[8] << 8) | (bytes[9] << 16) | (bytes[10] << 24)
          // useRate 从设备返回的数据不可靠，前端计算
          const used = totalSpace - free
          const useRate = totalSpace > 0 ? Math.round((used / totalSpace) * 100) : 0
          const isFull = bytes[15]
          
          console.log('💾 存储空间响应:', { 
            totalSpace: `${(totalSpace / 1024 / 1024).toFixed(2)}MB`,
            free: `${(free / 1024 / 1024).toFixed(2)}MB`,
            used: `${(used / 1024 / 1024).toFixed(2)}MB`,
            useRate: `${useRate}%`,
            isFull: isFull === 1 
          })
          
          return {
            type: 'storage',
            data: { totalSpace, free, used, useRate, isFull }
          }
        }
        break
        
      case 10: // WiFi热点开启响应
        if (bytes.length >= 4) {
          const status = bytes[3]
          console.log('📶 WiFi热点开启响应:', status)
          
          return {
            type: 'wifi',
            data: { action: 'opened', status }
          }
        }
        break
        
      case 14: // WiFi关闭响应
        if (bytes.length >= 4) {
          const status = bytes[3]
          console.log('📶 WiFi关闭响应:', status)
          
          return {
            type: 'wifi',
            data: { action: 'closed', status }
          }
        }
        break
        
      case 13: // 系统版本号响应
        if (bytes.length >= 6) {
          // 数据结构: [type(1), cmd_low(1), cmd_high(1), version(3)]
          const version = [bytes[3], bytes[4], bytes[5]]
          const versionStr = version.join('.')
          console.log('📱 系统版本号:', versionStr)
          
          return {
            type: 'version',
            data: { version, versionStr }
          }
        }
        break
        
      case 33: // 获取录音灯效响应
        if (bytes.length >= 4) {
          const onoff = bytes[3]
          console.log('💡 录音灯效状态:', onoff ? '开启' : '关闭')
          
          return {
            type: 'led',
            data: { action: 'get', enabled: onoff === 1 }
          }
        }
        break
        
      case 34: // 设置录音灯效响应
        if (bytes.length >= 4) {
          const onoff = bytes[3]
          console.log('💡 设置录音灯效:', onoff ? '开启' : '关闭')
          
          return {
            type: 'led',
            data: { action: 'set', enabled: onoff === 1 }
          }
        }
        break
        
      case 110: // 心跳包响应
        console.log('💓 心跳包响应')
        return {
          type: 'heartbeat',
          data: { received: true }
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
