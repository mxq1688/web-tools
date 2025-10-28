/**
 * BLE 录音控制
 */

import { ElMessage } from 'element-plus'
import { bleConnection } from './connection'

export class BleRecording {
  // 当前录音的 sessionId（从设备响应中获取）
  private currentSessionId: number = 0
  // 当前录音场景
  private currentScene: number = 1

  /**
   * 设置当前录音的 sessionId（从设备响应中更新）
   */
  setCurrentSessionId(sessionId: number): void {
    this.currentSessionId = sessionId
    console.log('📝 更新当前 sessionId:', sessionId)
  }

  /**
   * 设置录音场景（从通用设置中获取）
   */
  setRecordingScene(scene: number): void {
    this.currentScene = scene
    console.log('📝 更新录音场景:', scene === 1 ? '录音模式' : '会议模式')
  }

  /**
   * 开始录音
   * 参考 Flutter writeBle.dart recordStart 方法
   */
  async startRecord(scene?: number): Promise<void> {
    if (!bleConnection.isConnected) {
      ElMessage.warning('设备未连接')
      return
    }
    
    try {
      // 使用传入的场景或当前场景
      const recordScene = scene !== undefined ? scene : this.currentScene
      
      // 构建录音开始命令（参考 Flutter 协议）
      const arr = new Uint8Array(9)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 20 = 0x14
      arr[offset++] = 20 & 0xff
      arr[offset++] = (20 >>> 8) & 0xff
      
      // type (1 byte) - 录音类型，固定为 1
      arr[offset++] = 1 & 0xff
      
      // scene (1 byte) - 录音场景 (1=录音模式, 2=会议模式)
      arr[offset++] = recordScene & 0xff
      
      // sessionId (4 bytes) - 开始录音时传 0，设备会返回新的 sessionId
      arr[offset++] = 0
      arr[offset++] = 0
      arr[offset++] = 0
      arr[offset++] = 0
      
      console.log('🎤 发送开始录音命令:', {
        scene: recordScene === 1 ? '录音模式' : '会议模式',
        bytes: Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join(' ')
      })
      
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
    
    if (this.currentSessionId === 0) {
      ElMessage.warning('没有正在进行的录音')
      return
    }
    
    try {
      // 构建暂停录音命令（参考 Flutter 协议）
      const arr = new Uint8Array(7)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 21 = 0x15
      arr[offset++] = 21 & 0xff
      arr[offset++] = (21 >>> 8) & 0xff
      
      // sessionId (4 bytes) - 使用当前录音的 sessionId
      arr[offset++] = this.currentSessionId & 0xff
      arr[offset++] = (this.currentSessionId >>> 8) & 0xff
      arr[offset++] = (this.currentSessionId >>> 16) & 0xff
      arr[offset++] = (this.currentSessionId >>> 24) & 0xff
      
      console.log('⏸️ 发送暂停录音命令:', {
        sessionId: this.currentSessionId,
        bytes: Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join(' ')
      })
      
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
    
    if (this.currentSessionId === 0) {
      ElMessage.warning('没有可恢复的录音')
      return
    }
    
    try {
      // 构建恢复录音命令（参考 Flutter 协议）
      const arr = new Uint8Array(8)
      let offset = 0
      
      // 类型 (1 byte)
      arr[offset++] = 1
      
      // 命令 (2 bytes) - 22 = 0x16
      arr[offset++] = 22 & 0xff
      arr[offset++] = (22 >>> 8) & 0xff
      
      // sessionId (4 bytes) - 使用当前录音的 sessionId
      arr[offset++] = this.currentSessionId & 0xff
      arr[offset++] = (this.currentSessionId >>> 8) & 0xff
      arr[offset++] = (this.currentSessionId >>> 16) & 0xff
      arr[offset++] = (this.currentSessionId >>> 24) & 0xff
      
      // scene (1 byte) - 使用当前录音场景
      arr[offset++] = this.currentScene & 0xff
      
      console.log('▶️ 发送恢复录音命令:', {
        sessionId: this.currentSessionId,
        scene: this.currentScene === 1 ? '录音模式' : '会议模式',
        bytes: Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join(' ')
      })
      
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
      
      console.log('⏹️ 发送停止录音命令:', {
        bytes: Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join(' ')
      })
      
      await bleConnection.writeData(arr)
      
      // 停止录音后重置 sessionId
      this.currentSessionId = 0
      
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
