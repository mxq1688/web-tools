/**
 * BLE 状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BleDeviceInfo, BleDeviceDetail, BleConnectionStatus, BleAudioStatus, BleFileInfo } from '@/types/ble'
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
  
  // 文件列表
  const fileList = ref<BleFileInfo[]>([])
  
  // 正在同步的文件
  const syncingFileId = ref<number | null>(null)

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
      
      // 6. 获取存储空间
      await bleDevice.getStorageVolume()
      
      // 7. 获取系统版本
      await bleDevice.getSystemVersion()
      
      // 8. 设置 USB 模式
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
        
        // 保存通用设置到设备详情
        if (deviceDetail.value) {
          deviceDetail.value.generalSettings = settings
          
          // 根据 rec_scene 更新录音模式
          // rec_scene: 1=录音模式, 2=会议模式
          deviceDetail.value.audioType = settings.rec_scene
          
          // 更新录音控制类的场景设置
          bleRecording.setRecordingScene(settings.rec_scene)
          
          console.log('📋 录音模式:', settings.rec_scene === 1 ? '录音模式' : '会议模式')
          console.log('🎚️ 麦克风增益:', settings.dmic_mode)
          console.log('💡 LED状态:', settings.rec_led_status)
        }
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
        const { status: recordStatus, sessionId: recSessionId } = response.data
        console.log('🎙️ 录音状态更新:', recordStatus, response.data)
        
        // 如果响应中包含 sessionId，更新到录音控制类
        if (recSessionId !== undefined) {
          bleRecording.setCurrentSessionId(recSessionId)
        }
        
        switch (recordStatus) {
          case 'started':
            audioStatus.value = 2
            if (deviceDetail.value) {
              deviceDetail.value.audioStatus = 2
            }
            break
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
        
      case 'storage':
        const storageData = response.data
        console.log('💾 存储空间更新:', storageData)
        if (deviceDetail.value) {
          deviceDetail.value.storageInfo = storageData
        }
        break
        
      case 'wifi':
        console.log('📶 WiFi操作响应:', response.data.action, response.data.status)
        break
        
      case 'led':
        const ledData = response.data
        console.log('💡 录音灯效响应:', ledData)
        if (deviceDetail.value && ledData.action === 'get') {
          deviceDetail.value.ledEnabled = ledData.enabled
        }
        break
        
      case 'version':
        const versionData = response.data
        console.log('📱 系统版本:', versionData.versionStr)
        if (deviceDetail.value) {
          deviceDetail.value.systemVersion = versionData.versionStr
        }
        break
        
      case 'heartbeat':
        console.log('💓 心跳响应')
        break
        
      case 'timeSync':
        console.log('🕒 时间同步完成:', response.data)
        break
        
      case 'fileList':
        console.log('📋 文件列表:', response.data)
        fileList.value = response.data.items || []
        ElMessage.success(`获取到 ${response.data.items.length} 个文件`)
        break
        
      case 'syncFile':
        console.log('📥 同步文件:', response.data)
        const syncSessionId = response.data.sessionId
        syncingFileId.value = syncSessionId
        
        // 初始化文件下载状态
        const syncFile = fileList.value.find(f => f.sessionId === syncSessionId)
        if (syncFile) {
          syncFile.isDownloading = true
          syncFile.downloadProgress = 0
          syncFile.isCompleted = false
          syncFile.data = new Uint8Array(syncFile.fileSize)
        }
        
        ElMessage.success('开始同步文件')
        break
        
      case 'fileData':
        // 接收文件数据块
        const { sessionId: dataSessionId, offset, size, data: fileData } = response.data
        const downloadingFile = fileList.value.find(f => f.sessionId === dataSessionId)
        
        if (downloadingFile && downloadingFile.data) {
          console.log('📦 接收文件数据块:', {
            sessionId: dataSessionId,
            offset,
            size,
            dataLength: fileData.length,
            bufferSize: downloadingFile.data.length,
            fileSize: downloadingFile.fileSize
          })
          
          // 边界检查：确保写入不会超出缓冲区
          if (offset + fileData.length <= downloadingFile.data.length) {
            // 将数据块写入对应位置
            downloadingFile.data.set(fileData, offset)
            
            // 计算进度
            const receivedSize = offset + fileData.length
            downloadingFile.downloadProgress = Math.min(
              Math.round((receivedSize / downloadingFile.fileSize) * 100),
              100
            )
            
            console.log(`📦 文件下载进度: ${downloadingFile.downloadProgress}%`, {
              receivedSize,
              totalSize: downloadingFile.fileSize
            })
          } else {
            console.error('❌ 数据写入越界:', {
              offset,
              dataLength: fileData.length,
              bufferSize: downloadingFile.data.length,
              wouldWriteTo: offset + fileData.length
            })
            ElMessage.error('文件数据写入错误，请重新传输')
          }
        } else {
          console.warn('⚠️ 找不到对应的下载文件或缓冲区未初始化:', dataSessionId)
        }
        break
        
      case 'syncFileEnd':
        console.log('📦 文件同步完成:', response.data)
        const endSessionId = response.data.sessionId
        const completedFile = fileList.value.find(f => f.sessionId === endSessionId)
        
        if (completedFile) {
          completedFile.isDownloading = false
          completedFile.isCompleted = true
          completedFile.downloadProgress = 100
        }
        
        syncingFileId.value = null
        ElMessage.success('文件同步完成，可以下载到本地')
        break
        
      case 'stopSync':
        console.log('⏹️ 停止同步')
        
        // 清除正在同步的文件状态
        if (syncingFileId.value) {
          const stoppedFile = fileList.value.find(f => f.sessionId === syncingFileId.value)
          if (stoppedFile) {
            stoppedFile.isDownloading = false
            stoppedFile.data = undefined
          }
        }
        
        syncingFileId.value = null
        ElMessage.info('已停止同步')
        break
        
      case 'deleteConfirm':
        console.log('🗑️ 删除文件确认:', response.data)
        // 从文件列表中移除已删除的文件
        const deletedId = response.data.sessionId
        fileList.value = fileList.value.filter(file => file.sessionId !== deletedId)
        ElMessage.success('文件删除成功')
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
   * 获取通用设置（录音模式等）
   */
  async function getGeneralSetting() {
    try {
      await bleDevice.getGeneralSetting()
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 获取存储空间
   */
  async function getStorageVolume() {
    try {
      await bleDevice.getStorageVolume()
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 获取系统版本
   */
  async function getSystemVersion() {
    try {
      await bleDevice.getSystemVersion()
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 打开WiFi热点
   */
  async function openWifi() {
    try {
      await bleDevice.openWifi()
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 关闭WiFi热点
   */
  async function closeWifi() {
    try {
      await bleDevice.closeWifi()
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 获取录音灯效状态
   */
  async function getRecordLed() {
    try {
      await bleDevice.getRecordLed()
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 设置录音灯效
   */
  async function setRecordLed(enabled: boolean) {
    try {
      await bleDevice.setRecordLed(enabled)
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 获取文件列表
   */
  async function getSessionList(uid: number = 0, sessionId: number = 0, onlyOne: number = 0) {
    try {
      await bleDevice.getSessionList(uid, sessionId, onlyOne)
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 同步文件
   */
  async function syncFile(sessionId: number, start: number, end: number, noOggHeader: number = 0) {
    try {
      await bleDevice.syncFile(sessionId, start, end, noOggHeader)
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 停止同步文件
   */
  async function stopSyncFile() {
    try {
      await bleDevice.stopSyncFile()
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * 删除录音
   */
  async function deleteRecord(sessionId: number) {
    try {
      await bleDevice.deleteRecord(sessionId)
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
    fileList,
    syncingFileId,
    
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
    getGeneralSetting,
    getStorageVolume,
    getSystemVersion,
    openWifi,
    closeWifi,
    getRecordLed,
    setRecordLed,
    getSessionList,
    syncFile,
    stopSyncFile,
    deleteRecord,
    reset,
  }
})

