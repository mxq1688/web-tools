import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface SerialLogItem {
  id: number
  timestamp: number
  type: 'send' | 'receive'
  data: Uint8Array
  text?: string
  hex?: string
}

export const useSerialLogStore = defineStore(
  'serialLog',
  () => {
    // 日志列表
    const logs = ref<SerialLogItem[]>([])
    let logIdCounter = 0

    // 日志显示类型
    const logType = ref<'hex&text' | 'hex' | 'text' | 'ansi'>('hex&text')

    // 自动滚动
    const autoScroll = ref(true)

    // 分包超时时间（毫秒）
    const packetTimeout = ref(50)

    // 添加日志
    const addLog = (type: 'send' | 'receive', data: Uint8Array, text?: string, hex?: string) => {
      logs.value.push({
        id: logIdCounter++,
        timestamp: Date.now(),
        type,
        data,
        text,
        hex,
      })
    }

    // 清空日志
    const clearLogs = () => {
      logs.value = []
      logIdCounter = 0
    }

    // 导出日志
    const exportLogs = () => {
      return logs.value.map((log) => ({
        timestamp: new Date(log.timestamp).toLocaleString(),
        type: log.type,
        data: log.hex || log.text || '',
      }))
    }

    return {
      logs,
      logType,
      autoScroll,
      packetTimeout,
      addLog,
      clearLogs,
      exportLogs,
    }
  },
  {
    persist: {
      key: 'serial-log-config',
      storage: localStorage,
      paths: ['logType', 'autoScroll', 'packetTimeout'],
    },
  },
)

