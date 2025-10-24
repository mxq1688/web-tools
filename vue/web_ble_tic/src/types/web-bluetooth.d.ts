/**
 * Web Bluetooth API 全局类型声明
 */

declare global {
  interface Navigator {
    bluetooth: Bluetooth
  }
}

interface Bluetooth {
  requestDevice(options?: RequestDeviceOptions): Promise<BluetoothDevice>
  getAvailability(): Promise<boolean>
}

interface BluetoothDevice {
  id: string
  name?: string
  gatt?: BluetoothRemoteGATTServer
  addEventListener(type: 'gattserverdisconnected', listener: (event: Event) => void): void
  removeEventListener(type: 'gattserverdisconnected', listener: (event: Event) => void): void
}

interface BluetoothRemoteGATTServer {
  device: BluetoothDevice
  connected: boolean
  connect(): Promise<BluetoothRemoteGATTServer>
  disconnect(): void
  getPrimaryService(service: string | number): Promise<BluetoothRemoteGATTService>
}

interface BluetoothRemoteGATTService {
  uuid: string
  getCharacteristic(characteristic: string | number): Promise<BluetoothRemoteGATTCharacteristic>
}

interface BluetoothRemoteGATTCharacteristic {
  uuid: string
  value?: DataView
  startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>
  stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>
  writeValue(value: BufferSource): Promise<void>
  writeValueWithoutResponse(value: BufferSource): Promise<void>
  writeValueWithResponse(value: BufferSource): Promise<void>
  readValue(): Promise<DataView>
  addEventListener(type: 'characteristicvaluechanged', listener: (event: Event) => void): void
  removeEventListener(type: 'characteristicvaluechanged', listener: (event: Event) => void): void
}

interface RequestDeviceOptions {
  filters?: BluetoothLEScanFilter[]
  optionalServices?: string[]
  acceptAllDevices?: boolean
}

interface BluetoothLEScanFilter {
  services?: string[]
  name?: string
  namePrefix?: string
  manufacturerData?: ManufacturerDataFilter[]
  serviceData?: ServiceDataFilter[]
}

interface ManufacturerDataFilter {
  companyIdentifier: number
  dataPrefix?: BufferSource
  mask?: BufferSource
}

interface ServiceDataFilter {
  service: string
  dataPrefix?: BufferSource
  mask?: BufferSource
}

export {}

