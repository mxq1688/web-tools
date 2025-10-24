<template>
  <div class="flex-grow-1 d-flex flex-column" style="min-height: 0; overflow: hidden">
    <!-- 工具栏 -->
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-1 pb-1 mb-1 flex-shrink-0"
    >
      <h1 class="h3">串口日志</h1>

      <div class="btn-toolbar">
        <!-- 分包超时 -->
        <div class="input-group input-group-sm me-2">
          <span class="input-group-text">分包超时</span>
          <input
            v-model.number="logStore.packetTimeout"
            type="number"
            class="form-control"
            placeholder="0不分包"
            style="width: 100px"
          />
        </div>

        <!-- 日志类型 -->
        <div class="input-group input-group-sm me-2">
          <span class="input-group-text">日志类型</span>
          <select v-model="logStore.logType" class="form-select" style="width: 120px" @change="onLogTypeChange">
            <option value="hex&text">Hex和Text</option>
            <option value="hex">Hex</option>
            <option value="text">Text</option>
            <option value="ansi">彩色Ansi</option>
          </select>
        </div>

        <!-- 操作按钮 -->
        <div class="btn-group">
          <button class="btn btn-sm btn-outline-secondary" @click="toggleAutoScroll">
            {{ logStore.autoScroll ? '自动滚动' : '暂停滚动' }}
          </button>
          <button class="btn btn-sm btn-outline-secondary" @click="clearLogs">清空</button>
          <button class="btn btn-sm btn-outline-secondary" @click="copyLogs">复制</button>
          <button class="btn btn-sm btn-outline-secondary" @click="exportLogs">导出</button>
        </div>
      </div>
    </div>

    <!-- 日志显示区域 -->
    <div
      id="serial-logs"
      ref="logsContainer"
      class="flex-grow-1 border border-2 rounded mb-2"
      :class="{ ansi: logStore.logType === 'ansi' }"
    >
      <div v-for="log in logStore.logs" :key="log.id">
        <div>
          <span :class="log.type === 'send' ? 'text-primary' : 'text-success'">
            {{ formatTime(log.timestamp) }}&nbsp;{{ log.type === 'send' ? '→' : '←' }}
          </span>
          <br />
          <!-- Hex 显示 -->
          <template v-if="logStore.logType.includes('hex')">
            <span v-if="logStore.logType.includes('&')">HEX:</span>{{ log.hex }}<br v-if="logStore.logType.includes('&')" />
          </template>
          <!-- Text 显示 -->
          <template v-if="logStore.logType.includes('text') && !logStore.logType.includes('ansi')">
            <span v-if="logStore.logType.includes('&')">TEXT:</span><span v-html="log.text"></span>
          </template>
          <!-- ANSI 显示 -->
          <template v-if="logStore.logType === 'ansi'">
            <span v-html="log.text"></span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSerialLogStore } from '@/stores/serialLog'
import { serialManager } from '@/utils/serial'
import { uint8ArrayToHex, uint8ArrayToText, htmlEncode, formatDate, saveText } from '@/utils/serial/converter'
import { AnsiUp } from '@/utils/serial/ansi'

const logStore = useSerialLogStore()
const logsContainer = ref<HTMLElement>()

let serialData: number[] = []
let serialTimer: any = null

// 使用 AnsiUp 库进行 ANSI 转换
const ansiUp = new AnsiUp()

// ANSI 转换函数
const ansiToHtml = (text: string): string => {
  return ansiUp.ansi_to_html(text)
}

// 处理接收到的数据（分包合并）
const handleDataReceived = (data: Uint8Array) => {
  serialData.push(...data)

  if (logStore.packetTimeout === 0) {
    // 不分包，立即添加日志
    addLog(Uint8Array.from(serialData), 'receive')
    serialData = []
    return
  }

  // 清除之前的定时器
  clearTimeout(serialTimer)
  serialTimer = setTimeout(() => {
    // 超时发出
    addLog(Uint8Array.from(serialData), 'receive')
    serialData = []
  }, logStore.packetTimeout)
}

// 添加日志
const addLog = (data: Uint8Array, type: 'send' | 'receive') => {
  const hex = uint8ArrayToHex(data)
  let text = ''

  if (logStore.logType === 'ansi') {
    // ANSI 模式需要特殊处理
    const rawText = uint8ArrayToText(data)
    // 使用自定义的 ANSI 转换函数
    text = ansiToHtml(rawText)
  } else {
    text = htmlEncode(uint8ArrayToText(data))
  }

  logStore.addLog(type, data, text, hex)

  // 自动滚动
  if (logStore.autoScroll) {
    nextTick(() => {
      if (logsContainer.value) {
        logsContainer.value.scrollTop = logsContainer.value.scrollHeight
      }
    })
  }
}

// 格式化时间
const formatTime = (timestamp: number) => {
  return formatDate(new Date(timestamp))
}

// 切换自动滚动
const toggleAutoScroll = () => {
  logStore.autoScroll = !logStore.autoScroll
}

// 清空日志
const clearLogs = () => {
  logStore.clearLogs()
}

// 复制日志
const copyLogs = async () => {
  if (!logsContainer.value) return

  const text = logsContainer.value.innerText
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('复制成功')
  } catch {
    ElMessage.error('复制失败')
  }
}

// 导出日志
const exportLogs = () => {
  if (logStore.logs.length === 0) {
    ElMessage.warning('没有日志可导出')
    return
  }

  const logs = logStore.exportLogs()
  const text = logs.map((log) => `${log.timestamp} ${log.type}: ${log.data}`).join('\n')
  saveText(text, `serial-log-${Date.now()}.txt`)
  ElMessage.success('导出成功')
}

// 日志类型变化
const onLogTypeChange = () => {
  // 可以在这里处理日志类型变化后的逻辑
}

// 暴露添加日志方法供外部调用
defineExpose({
  addLog,
})

onMounted(() => {
  // 设置数据接收回调
  serialManager.setOnDataReceived(handleDataReceived)
})

onUnmounted(() => {
  // 清理定时器
  if (serialTimer) {
    clearTimeout(serialTimer)
  }
})
</script>

<style scoped>
#serial-logs {
  overflow-y: scroll;
  white-space: pre-wrap;
  word-break: break-all;
  background: #fff;
  padding: 8px;
}

#serial-logs.ansi {
  background-color: #000;
  color: #fff;
}

.text-primary {
  color: #0d6efd !important;
}

.text-success {
  color: #198754 !important;
}
</style>

