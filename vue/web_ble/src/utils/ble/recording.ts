/**
 * BLE 录音控制
 */

import { ElMessage } from 'element-plus'
import { bleConnection } from './connection'

export class BleRecording {
  /**
   * 开始录音
   * 参考 Flutter writeBle.dart recordStart 方法
   */
  async startRecord(): Promise<void> {
    if (!bleConnection.isConnected) {
      ElMessage.warning('设备未连接')
      return
    }
    
    try {
      // 生成 sessionId（时间戳）
      const sessionId = Math.floor(Date.now() / 1000)
      
      // 构建录音开始命令（参考 Flutter 协议）
      const arr = new Uint8Array(9)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 20 = 0x14
      arr[offset++] = 20 & 0xff
      arr[offset++] = (20 >>> 8) & 0xff
      
      // type (1 byte) - 录音类型
      arr[offset++] = 1 & 0xff
      
      // sence (1 byte) - 录音场景
      arr[offset++] = 1 & 0xff
      
      // sessionId (4 bytes)
      arr[offset++] = sessionId & 0xff
      arr[offset++] = (sessionId >>> 8) & 0xff
      arr[offset++] = (sessionId >>> 16) & 0xff
      arr[offset++] = (sessionId >>> 24) & 0xff
      
      console.log('🎤 发送开始录音命令:', arr)
      await bleConnection.writeData(arr)
      
      ElMessage.success('开始录音')
    } catch (error: any) {
      ElMessage.error('开始录音失败')
      console.error(error)
      throw error
    }
  }

  /**
   * 暂停录音
   * 参考 Flutter writeBle.dart recordPause 方法
   */
  async pauseRecord(): Promise<void> {
    if (!bleConnection.isConnected) {
      return
    }
    
    try {
      // 生成 sessionId（时间戳）
      const sessionId = Math.floor(Date.now() / 1000)
      
      // 构建暂停录音命令（参考 Flutter 协议）
      const arr = new Uint8Array(7)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 21 = 0x15
      arr[offset++] = 21 & 0xff
      arr[offset++] = (21 >>> 8) & 0xff
      
      // sessionId (4 bytes)
      arr[offset++] = sessionId & 0xff
      arr[offset++] = (sessionId >>> 8) & 0xff
      arr[offset++] = (sessionId >>> 16) & 0xff
      arr[offset++] = (sessionId >>> 24) & 0xff
      
      console.log('⏸️ 发送暂停录音命令:', arr)
      await bleConnection.writeData(arr)
      
      ElMessage.success('暂停录音')
    } catch (error: any) {
      ElMessage.error('暂停录音失败')
      console.error(error)
      throw error
    }
  }

  /**
   * 恢复录音
   * 参考 Flutter writeBle.dart recordRestore 方法
   */
  async resumeRecord(): Promise<void> {
    if (!bleConnection.isConnected) {
      return
    }
    
    try {
      // 生成 sessionId（时间戳）
      const sessionId = Math.floor(Date.now() / 1000)
      
      // 构建恢复录音命令（参考 Flutter 协议）
      const arr = new Uint8Array(8)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 22 = 0x16
      arr[offset++] = 22 & 0xff
      arr[offset++] = (22 >>> 8) & 0xff
      
      // sessionId (4 bytes)
      arr[offset++] = sessionId & 0xff
      arr[offset++] = (sessionId >>> 8) & 0xff
      arr[offset++] = (sessionId >>> 16) & 0xff
      arr[offset++] = (sessionId >>> 24) & 0xff
      
      // sence (1 byte) - 录音场景
      arr[offset++] = 1 & 0xff
      
      console.log('▶️ 发送恢复录音命令:', arr)
      await bleConnection.writeData(arr)
      
      ElMessage.success('继续录音')
    } catch (error: any) {
      ElMessage.error('继续录音失败')
      console.error(error)
      throw error
    }
  }

  /**
   * 停止录音
   * 参考 Flutter writeBle.dart recordEnd 方法
   */
  async stopRecord(): Promise<void> {
    if (!bleConnection.isConnected) {
      return
    }
    
    try {
      // 构建停止录音命令（参考 Flutter 协议）
      const arr = new Uint8Array(3)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 23 = 0x17
      arr[offset++] = 23 & 0xff
      arr[offset++] = (23 >>> 8) & 0xff
      
      console.log('⏹️ 发送停止录音命令:', arr)
      await bleConnection.writeData(arr)
      
      ElMessage.success('停止录音')
    } catch (error: any) {
      ElMessage.error('停止录音失败')
      console.error(error)
      throw error
    }
  }
}

// 单例实例
export const bleRecording = new BleRecording()
