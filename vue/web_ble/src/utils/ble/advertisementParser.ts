/**
 * BLE 广播数据解析器
 * 解析蓝牙设备的广播数据包
 */

import type { BleAdvertisementData, BleManufacturerData, BleServiceData, BleCustomData } from '@/types/ble'

// AD 类型定义 (Advertising Data Types)
export const AD_TYPES = {
  FLAGS: 0x01,
  INCOMPLETE_LIST_OF_16_BIT_SERVICE_CLASS_UUIDS: 0x02,
  COMPLETE_LIST_OF_16_BIT_SERVICE_CLASS_UUIDS: 0x03,
  INCOMPLETE_LIST_OF_32_BIT_SERVICE_CLASS_UUIDS: 0x04,
  COMPLETE_LIST_OF_32_BIT_SERVICE_CLASS_UUIDS: 0x05,
  INCOMPLETE_LIST_OF_128_BIT_SERVICE_CLASS_UUIDS: 0x06,
  COMPLETE_LIST_OF_128_BIT_SERVICE_CLASS_UUIDS: 0x07,
  SHORTENED_LOCAL_NAME: 0x08,
  COMPLETE_LOCAL_NAME: 0x09,
  TX_POWER_LEVEL: 0x0A,
  MANUFACTURER_SPECIFIC_DATA: 0xFF,
  SERVICE_DATA: 0x16,
  APPEARANCE: 0x19,
} as const

// 制造商ID映射
const MANUFACTURER_NAMES: Record<number, string> = {
  0x004C: 'Apple',
  0x0006: 'Microsoft',
  0x000F: 'Broadcom',
  0x0075: 'Samsung',
  0x00E0: 'Google',
  0x000D: 'Texas Instruments',
  0x000A: 'Nordic Semiconductor',
  0x0059: 'Nordic Semiconductor ASA',
  0x0001: 'Nokia Mobile Phones',
  0x0002: 'Ericsson Technology Licensing',
  0x0003: 'Intel Corp.',
  0x0004: 'IBM Corp.',
  0x0005: 'Toshiba Corp.',
  0x0007: 'Microsoft Corp.',
  0x0008: 'Lucent',
  0x0009: 'Motorola',
  0x000B: 'Lucent Technologies',
  0x000C: 'Lucent Technologies',
  0x000E: 'Lucent Technologies',
  0x000F: 'Lucent Technologies',
}

export class AdvertisementParser {
  /**
   * 解析广播数据
   */
  static parseAdvertisementData(device: BluetoothDevice): BleAdvertisementData {
    const result: BleAdvertisementData = {}

    // 注意：Web Bluetooth API 不直接提供广播数据
    // 这里我们模拟解析过程，实际应用中需要其他方式获取
    console.log('📡 解析设备广播数据:', device.name, device.id)

    // 模拟广播数据解析
    result.flags = 0x06 // 一般广播标志
    result.completeLocalName = device.name || '未知设备'
    result.txPowerLevel = -59 // 模拟传输功率
    result.manufacturerData = this.parseManufacturerData(device)
    result.serviceUuids = this.parseServiceUuids(device)
    result.serviceData = this.parseServiceData(device)
    result.appearance = 0x0000 // 未知设备外观

    return result
  }

  /**
   * 解析制造商数据
   */
  private static parseManufacturerData(device: BluetoothDevice): BleManufacturerData[] {
    // 模拟制造商数据
    const manufacturerData: BleManufacturerData[] = []
    
    // 根据设备名称推断制造商
    const deviceName = device.name?.toLowerCase() || ''
    let companyId = 0x0000
    let companyName = '未知制造商'

    if (deviceName.includes('apple') || deviceName.includes('iphone') || deviceName.includes('ipad')) {
      companyId = 0x004C
      companyName = 'Apple'
    } else if (deviceName.includes('samsung') || deviceName.includes('galaxy')) {
      companyId = 0x0075
      companyName = 'Samsung'
    } else if (deviceName.includes('google') || deviceName.includes('pixel')) {
      companyId = 0x00E0
      companyName = 'Google'
    } else if (deviceName.includes('microsoft') || deviceName.includes('surface')) {
      companyId = 0x0006
      companyName = 'Microsoft'
    }

    if (companyId !== 0x0000) {
      manufacturerData.push({
        companyId,
        data: new Uint8Array([0x01, 0x02, 0x03, 0x04]), // 模拟数据
        companyName
      })
    }

    return manufacturerData
  }

  /**
   * 解析服务UUID
   */
  private static parseServiceUuids(device: BluetoothDevice): string[] {
    // 模拟服务UUID列表
    const serviceUuids: string[] = []
    
    // 添加一些常见的服务UUID
    serviceUuids.push('0000180F-0000-1000-8000-00805F9B34FB') // Battery Service
    serviceUuids.push('0000180A-0000-1000-8000-00805F9B34FB') // Device Information Service
    
    // 如果有自定义服务，添加进去
    if (device.name?.includes('Custom')) {
      serviceUuids.push('00001910-0000-1000-8000-00805F9B34FB') // 自定义服务
    }

    return serviceUuids
  }

  /**
   * 解析服务数据
   */
  private static parseServiceData(device: BluetoothDevice): BleServiceData[] {
    const serviceData: BleServiceData[] = []
    
    // 模拟服务数据
    serviceData.push({
      serviceUuid: '0000180F-0000-1000-8000-00805F9B34FB',
      data: new Uint8Array([0x64]) // 电池电量 100%
    })

    return serviceData
  }

  /**
   * 格式化广播数据为可读文本
   */
  static formatAdvertisementData(data: BleAdvertisementData): string {
    const lines: string[] = []
    
    lines.push('📡 广播数据信息:')
    lines.push('─'.repeat(30))
    
    if (data.flags !== undefined) {
      lines.push(`🏷️  标志: 0x${data.flags.toString(16).toUpperCase()}`)
    }
    
    if (data.completeLocalName) {
      lines.push(`📱 设备名称: ${data.completeLocalName}`)
    }
    
    if (data.txPowerLevel !== undefined) {
      lines.push(`📶 传输功率: ${data.txPowerLevel} dBm`)
    }
    
    if (data.manufacturerData && data.manufacturerData.length > 0) {
      lines.push('🏭 制造商数据:')
      data.manufacturerData.forEach((mfg, index) => {
        lines.push(`   ${index + 1}. ${mfg.companyName || '未知'} (0x${mfg.companyId.toString(16).toUpperCase()})`)
        lines.push(`      数据: ${Array.from(mfg.data).map(b => b.toString(16).padStart(2, '0')).join(' ').toUpperCase()}`)
      })
    }
    
    if (data.serviceUuids && data.serviceUuids.length > 0) {
      lines.push('🔧 服务UUID:')
      data.serviceUuids.forEach((uuid, index) => {
        lines.push(`   ${index + 1}. ${uuid}`)
      })
    }
    
    if (data.serviceData && data.serviceData.length > 0) {
      lines.push('📊 服务数据:')
      data.serviceData.forEach((service, index) => {
        lines.push(`   ${index + 1}. ${service.serviceUuid}`)
        lines.push(`      数据: ${Array.from(service.data).map(b => b.toString(16).padStart(2, '0')).join(' ').toUpperCase()}`)
      })
    }
    
    if (data.appearance !== undefined) {
      lines.push(`👁️  设备外观: 0x${data.appearance.toString(16).toUpperCase()}`)
    }
    
    return lines.join('\n')
  }

  /**
   * 获取制造商名称
   */
  static getManufacturerName(companyId: number): string {
    return MANUFACTURER_NAMES[companyId] || `未知制造商 (0x${companyId.toString(16).toUpperCase()})`
  }

  /**
   * 解析原始广播数据包 (如果有的话)
   */
  static parseRawAdvertisementData(rawData: Uint8Array): BleAdvertisementData {
    const result: BleAdvertisementData = {}
    let offset = 0

    while (offset < rawData.length) {
      if (offset + 1 >= rawData.length) break

      const length = rawData[offset]
      if (length === 0) break

      if (offset + length >= rawData.length) break

      const type = rawData[offset + 1]
      const data = rawData.slice(offset + 2, offset + length + 1)

      switch (type) {
        case AD_TYPES.FLAGS:
          result.flags = data[0]
          break

        case AD_TYPES.COMPLETE_LOCAL_NAME:
          result.completeLocalName = new TextDecoder().decode(data)
          break

        case AD_TYPES.SHORTENED_LOCAL_NAME:
          result.shortLocalName = new TextDecoder().decode(data)
          break

        case AD_TYPES.TX_POWER_LEVEL:
          result.txPowerLevel = data[0]
          break

        case AD_TYPES.MANUFACTURER_SPECIFIC_DATA:
          if (data.length >= 2) {
            const companyId = data[0] | (data[1] << 8)
            const manufacturerData: BleManufacturerData = {
              companyId,
              data: data.slice(2),
              companyName: this.getManufacturerName(companyId)
            }
            result.manufacturerData = result.manufacturerData || []
            result.manufacturerData.push(manufacturerData)
          }
          break

        case AD_TYPES.SERVICE_DATA:
          if (data.length >= 2) {
            const serviceUuid = data.slice(0, 2)
            const serviceData: BleServiceData = {
              serviceUuid: Array.from(serviceUuid).map(b => b.toString(16).padStart(2, '0')).join(''),
              data: data.slice(2)
            }
            result.serviceData = result.serviceData || []
            result.serviceData.push(serviceData)
          }
          break

        case AD_TYPES.APPEARANCE:
          if (data.length >= 2) {
            result.appearance = data[0] | (data[1] << 8)
          }
          break
      }

      offset += length + 1
    }

    return result
  }
}
