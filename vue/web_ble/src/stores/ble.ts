/**
 * BLE 状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BleDeviceInfo, BleDeviceDetail, BleConnectionStatus, BleAudioStatus } from '@/types/ble'
import { bleScanner, bleConnection, bleRecording, bleDevice } from '@/utils/ble'
import { DeviceInfoReader } from '@/utils/ble/deviceInfoReader'
import { ElMessage } from 'element-plus'

export const useBleStore = defineStore('ble', () => {
  // ==================== 状态 ====================
  
  // 扫描状态
  const isScanning = ref(false)
  
  // 设备列表
  const devices = ref<BleDeviceInfo[]>([])
  
  // 设备详细信息
  const deviceDetail = ref<BleDeviceDetail | null>(null)
  
  // 连接状态
  const connectionStatus = ref<BleConnectionStatus>(0) // 0: 未连接, 1: 连接中, 2: 已连接
  
  // 录音状态
  const audioStatus = ref<BleAudioStatus>(0) // 0: 空闲, 1: 就绪, 2: 录音中, 3: 暂停

  // ==================== 计算属性 ====================
  
  // 是否有已连接的设备
  const hasDevice = computed(() => connectionStatus.value === 2)
  
  // 是否支持 Web Bluetooth
  const isSupported = computed(() => 'bluetooth' in navigator)
  
  // 最近的设备
  const nearestDevice = computed(() => devices.value.find((d) => d.isNearest))

  // ==================== 方法 ====================
  
  /**
   * 开始扫描设备
   */
  async function startScan() {
    try {
      isScanning.value = true
      
      // 设置回调
      bleScanner.onDeviceFound((deviceList) => {
        devices.value = deviceList
      })
      
      // 设置错误回调
      bleScanner.onError((error) => {
        console.log('扫描过程错误:', error.message)
      })
      
      console.log('📱 准备扫描设备...')
      console.log('⚠️ 提示：点击后会弹出系统蓝牙设备选择器')
      
      await bleScanner.startScan()
      
      // 如果没有抛出错误，说明用户选择了设备
      if (devices.value.length > 0) {
        ElMessage.success('设备已添加')
      }
    } catch (error: any) {
      console.error('扫描失败:', error)
      ElMessage.error(error.message || '扫描失败')
      isScanning.value = false
    } finally {
      isScanning.value = false
    }
  }
  
  /**
   * 停止扫描
   */
  function stopScan() {
    bleScanner.stopScan()
    isScanning.value = false
  }
  
  /**
   * 连接设备
   */
  async function connectDevice(deviceInfo: BleDeviceInfo) {
    try {
      connectionStatus.value = 1 // 连接中
      
      // 设置连接回调
      bleConnection.onDisconnected(() => {
        connectionStatus.value = 0
        audioStatus.value = 0
        deviceDetail.value = null
      })
      
      bleConnection.onNotification((bytes) => {
        const response = bleDevice.parseDeviceResponse(bytes)
        handleDeviceResponse(response)
      })
      
      // 连接设备
      await bleConnection.connect(deviceInfo)
      
      connectionStatus.value = 2 // 已连接
      audioStatus.value = 1 // 就绪
      
      // 设置设备详情（先用设备ID作为临时SN）
      deviceDetail.value = {
        sn: deviceInfo.sn || deviceInfo.id,  // 临时使用设备ID
        name: deviceInfo.name,
        batteryLevel: 100, // 默认值，等待获取真实电量
        chargeStatus: 0,   // 默认值，等待获取真实充电状态
        audioStatus: 1,    // 默认就绪状态，等待获取真实录音状态
        connectionStatus: 2,
      }
      
      // 连接成功后自动获取设备信息（参考 Flutter connectSuccess）
      console.log('🔍 开始连接成功后的初始化操作...')
      
      // 0. 获取真实设备序列号 (可选，不影响连接)
      try {
        // 从设备对象获取 GATT 服务器
        const server = deviceInfo.device?.gatt
        if (server && server.connected) {
          console.log('🔍 尝试获取真实设备序列号...')
          const realSerialNumber = await DeviceInfoReader.getSerialNumber(server)
          if (realSerialNumber) {
            deviceDetail.value.sn = realSerialNumber
            console.log('✅ 获取到真实序列号:', realSerialNumber)
          } else {
            console.log('⚠️ 无法获取真实序列号，使用设备ID')
          }
        } else {
          console.log('⚠️ GATT服务器未连接，无法获取序列号')
        }
      } catch (error) {
        console.log('⚠️ 获取序列号失败，继续使用设备ID:', error)
        // 不抛出错误，继续执行后续操作
      }
      
      // 连接成功后自动获取设备信息（参考 Flutter connectSuccess）
      console.log('🔍 开始连接成功后的初始化操作...')
      
      // 1. 设备握手绑定 (参考 Flutter bindDevice)
      try {
        await bleDevice.bindDevice()
        console.log('✅ 设备握手完成')
      } catch (error) {
        console.log('⚠️ 设备握手失败:', error)
      }
      
      // 2. 同步时间 (参考 Flutter syncTime)
      try {
        await bleDevice.syncTime()
        console.log('✅ 时间同步完成')
      } catch (error) {
        console.log('⚠️ 时间同步失败:', error)
      }
      
      // 3. 获取设备状态（录音状态、充电状态等）
      await bleDevice.getDeviceStatus()
      
      // 4. 获取其他配置（麦克风增益、录音模式等）
      await bleDevice.getGeneralSetting()
      
      // 5. 获取电池电量
      await bleDevice.getBatteryLevel()
      
      // 6. 设置 USB 模式
      await bleDevice.setUsbMode()
      
      // 7. 加载设备文件 (参考 Flutter loadDeviceFile)
      try {
        await bleDevice.loadDeviceFile()
        console.log('✅ 设备文件加载完成')
      } catch (error) {
        console.log('⚠️ 设备文件加载失败:', error)
      }
      
      // 停止扫描
      stopScan()
    } catch (error: any) {
      console.error('连接失败:', error)
      ElMessage.error(error.message || '连接失败')
      connectionStatus.value = 0
      deviceDetail.value = null
    }
  }
  
  /**
   * 断开连接
   */
  function disconnect() {
    bleConnection.disconnect()
    connectionStatus.value = 0
    audioStatus.value = 0
    deviceDetail.value = null
  }
  
  /**
   * 处理设备响应
   */
  function handleDeviceResponse(response: { type: string; data?: any }) {
    console.log('📨 处理设备响应:', response.type, response.data)
    
    switch (response.type) {
      case 'deviceStatus':
        const { isRecording, isCharging } = response.data
        console.log('📊 设备状态更新:', { isRecording, isCharging })
        audioStatus.value = isRecording ? 2 : 1
        if (deviceDetail.value) {
          deviceDetail.value.audioStatus = isRecording ? 2 : 1
          deviceDetail.value.chargeStatus = isCharging ? 1 : 0
        }
        break
        
      case 'generalSetting':
        const settings = response.data
        console.log('⚙️ 收到通用设置:', settings)
        // 可以在这里处理通用设置，如录音模式、麦克风增益等
        break
        
      case 'battery':
        const { batteryLevel } = response.data
        console.log('🔋 电池电量更新:', batteryLevel + '%')
        if (deviceDetail.value) {
          deviceDetail.value.batteryLevel = batteryLevel
        }
        break
        
      case 'usbMode':
        console.log('🔌 USB 模式设置完成')
        break
        
      case 'recording':
        const { status } = response.data
        console.log('🎙️ 录音状态更新:', status)
        switch (status) {
          case 'paused':
            audioStatus.value = 3
            if (deviceDetail.value) {
              deviceDetail.value.audioStatus = 3
            }
            break
          case 'recording':
            audioStatus.value = 2
            if (deviceDetail.value) {
              deviceDetail.value.audioStatus = 2
            }
            break
          case 'stopped':
            audioStatus.value = 1
            if (deviceDetail.value) {
              deviceDetail.value.audioStatus = 1
            }
            break
        }
        break
        
      case 'unknown':
        console.log('❓ 收到未知响应数据')
        break
        
      default:
        console.log('⚠️ 未处理的响应类型:', response.type)
        break
    }
  }
  
  /**
   * 发送数据到设备
   */
  async function writeData(data: Uint8Array) {
    await bleConnection.writeData(data)
  }
  
  /**
   * 开始录音
   */
  async function startRecord() {
    try {
      await bleRecording.startRecord()
      audioStatus.value = 2
      if (deviceDetail.value) {
        deviceDetail.value.audioStatus = 2
      }
    } catch (error) {
      console.error(error)
    }
  }
  
  /**
   * 暂停录音
   */
  async function pauseRecord() {
    try {
      await bleRecording.pauseRecord()
      audioStatus.value = 3
      if (deviceDetail.value) {
        deviceDetail.value.audioStatus = 3
      }
    } catch (error) {
      console.error(error)
    }
  }
  
  /**
   * 恢复录音
   */
  async function resumeRecord() {
    try {
      await bleRecording.resumeRecord()
      audioStatus.value = 2
      if (deviceDetail.value) {
        deviceDetail.value.audioStatus = 2
      }
    } catch (error) {
      console.error(error)
    }
  }
  
  /**
   * 停止录音
   */
  async function stopRecord() {
    try {
      await bleRecording.stopRecord()
      audioStatus.value = 1
      if (deviceDetail.value) {
        deviceDetail.value.audioStatus = 1
      }
    } catch (error) {
      console.error(error)
    }
  }
  
  /**
   * 获取设备状态
   */
  async function getDeviceStatus() {
    try {
      await bleDevice.getDeviceStatus()
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 获取电池电量
   */
  async function getBatteryLevel() {
    try {
      await bleDevice.getBatteryLevel()
    } catch (error) {
      console.error(error)
    }
  }
  
  /**
   * 重置状态
   */
  function reset() {
    stopScan()
    disconnect()
    devices.value = []
  }

  return {
    // 状态
    isScanning,
    devices,
    deviceDetail,
    connectionStatus,
    audioStatus,
    
    // 计算属性
    hasDevice,
    isSupported,
    nearestDevice,
    
    // 方法
    startScan,
    stopScan,
    connectDevice,
    disconnect,
    writeData,
    startRecord,
    pauseRecord,
    resumeRecord,
    stopRecord,
    getDeviceStatus,
    getBatteryLevel,
    reset,
  }
})

