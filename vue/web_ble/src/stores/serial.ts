import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface SerialOptions {
  baudRate: number
  dataBits: number
  stopBits: number
  parity: 'none' | 'even' | 'odd'
  bufferSize: number
  flowControl: 'none' | 'hardware'
}

export interface SerialStatus {
  isOpen: boolean
  isConnected: boolean
  portInfo: string
  error: string | null
}

export const useSerialStore = defineStore(
  'serial',
  () => {
    // 串口配置
    const options = ref<SerialOptions>({
      baudRate: 115200,
      dataBits: 8,
      stopBits: 1,
      parity: 'none',
      bufferSize: 1024,
      flowControl: 'none',
    })

    // 串口状态
    const status = ref<SerialStatus>({
      isOpen: false,
      isConnected: false,
      portInfo: '未选择串口',
      error: null,
    })

    // 串口实例
    const port = ref<SerialPort | null>(null)

    // 更新配置
    const updateOptions = (newOptions: Partial<SerialOptions>) => {
      options.value = { ...options.value, ...newOptions }
    }

    // 更新状态
    const updateStatus = (newStatus: Partial<SerialStatus>) => {
      status.value = { ...status.value, ...newStatus }
    }

    // 重置
    const reset = () => {
      options.value = {
        baudRate: 115200,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        bufferSize: 1024,
        flowControl: 'none',
      }
      status.value = {
        isOpen: false,
        isConnected: false,
        portInfo: '未选择串口',
        error: null,
      }
      port.value = null
    }

    return {
      options,
      status,
      port,
      updateOptions,
      updateStatus,
      reset,
    }
  },
  {
    persist: {
      key: 'serial-config',
      storage: localStorage,
      paths: ['options'],
    },
  },
)

