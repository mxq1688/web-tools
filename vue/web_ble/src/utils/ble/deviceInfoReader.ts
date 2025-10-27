/**
 * 设备信息服务获取器
 * 获取设备的真实序列号、制造商等信息
 */

// 设备信息服务 UUID (使用小写格式)
const DEVICE_INFO_SERVICE_UUID = '0000180a-0000-1000-8000-00805f9b34fb'

// 设备信息特征值 UUID (使用小写格式)
const DEVICE_INFO_CHARACTERISTICS = {
  MANUFACTURER_NAME: '00002a29-0000-1000-8000-00805f9b34fb',  // 制造商名称
  MODEL_NUMBER: '00002a24-0000-1000-8000-00805f9b34fb',        // 型号
  SERIAL_NUMBER: '00002a25-0000-1000-8000-00805f9b34fb',      // 序列号
  HARDWARE_REVISION: '00002a27-0000-1000-8000-00805f9b34fb',  // 硬件版本
  FIRMWARE_REVISION: '00002a26-0000-1000-8000-00805f9b34fb',  // 固件版本
  SOFTWARE_REVISION: '00002a28-0000-1000-8000-00805f9b34fb',  // 软件版本
  SYSTEM_ID: '00002a23-0000-1000-8000-00805f9b34fb',          // 系统ID
  IEEE_11073_20601: '00002a2a-0000-1000-8000-00805f9b34fb',  // IEEE标准
}

export interface DeviceInfoData {
  manufacturerName?: string
  modelNumber?: string
  serialNumber?: string
  hardwareRevision?: string
  firmwareRevision?: string
  softwareRevision?: string
  systemId?: string
  ieee11073?: string
}

export class DeviceInfoReader {
  /**
   * 获取设备信息
   */
  static async getDeviceInfo(server: BluetoothRemoteGATTServer): Promise<DeviceInfoData> {
    try {
      console.log('🔍 开始获取设备信息...')
      
      // 检查服务器是否连接
      if (!server.connected) {
        console.log('⚠️ GATT服务器未连接')
        return {}
      }
      
      // 获取设备信息服务
      const service = await server.getPrimaryService(DEVICE_INFO_SERVICE_UUID)
      console.log('✅ 找到设备信息服务')
      
      const deviceInfo: DeviceInfoData = {}
      
      // 并行获取所有可用的设备信息
      const promises = Object.entries(DEVICE_INFO_CHARACTERISTICS).map(async ([key, uuid]) => {
        try {
          const characteristic = await service.getCharacteristic(uuid)
          const value = await characteristic.readValue()
          const text = new TextDecoder().decode(value).trim()
          
          if (text) {
            deviceInfo[key.toLowerCase() as keyof DeviceInfoData] = text
            console.log(`📋 ${key}: ${text}`)
          }
        } catch (error) {
          console.log(`⚠️ 无法读取 ${key}:`, error)
        }
      })
      
      await Promise.allSettled(promises)
      
      console.log('✅ 设备信息获取完成:', deviceInfo)
      return deviceInfo
      
    } catch (error) {
      console.log('⚠️ 设备不支持标准设备信息服务，这是正常的:', error.message)
      return {}
    }
  }
  
  /**
   * 获取设备序列号
   */
  static async getSerialNumber(server: BluetoothRemoteGATTServer): Promise<string | null> {
    try {
      const deviceInfo = await this.getDeviceInfo(server)
      return deviceInfo.serialNumber || null
    } catch (error) {
      console.error('❌ 获取序列号失败:', error)
      return null
    }
  }
  
  /**
   * 获取制造商名称
   */
  static async getManufacturerName(server: BluetoothRemoteGATTServer): Promise<string | null> {
    try {
      const deviceInfo = await this.getDeviceInfo(server)
      return deviceInfo.manufacturerName || null
    } catch (error) {
      console.error('❌ 获取制造商名称失败:', error)
      return null
    }
  }
}
