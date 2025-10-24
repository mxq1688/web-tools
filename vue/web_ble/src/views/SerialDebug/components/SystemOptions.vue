<template>
  <div>
    <h5>系统配置</h5>

    <button class="btn btn-sm btn-outline-secondary me-2" @click="resetConfig">
      <i class="bi bi-arrow-repeat"></i> 重置参数
    </button>

    <button class="btn btn-sm btn-outline-secondary me-2" @click="exportConfig">
      <i class="bi bi-folder-symlink"></i> 导出配置
    </button>

    <button class="btn btn-sm btn-outline-secondary me-2" @click="triggerImport">
      <i class="bi bi-folder-plus"></i> 导入配置
    </button>

    <input ref="importInput" type="file" style="display: none" accept="application/json" @change="importConfig" />

    <div class="mt-4">
      <h6>使用说明</h6>
      <ul class="list-unstyled small text-muted">
        <li>• 重置参数：清空所有配置恢复默认</li>
        <li>• 导出配置：保存当前所有配置到文件</li>
        <li>• 导入配置：从文件恢复配置</li>
      </ul>
    </div>

    <div class="mt-4">
      <h6>快捷键</h6>
      <ul class="list-unstyled small text-muted">
        <li>• Ctrl/Cmd + Enter：发送数据</li>
        <li>• Ctrl/Cmd + L：清空日志</li>
        <li>• Ctrl/Cmd + S：导出日志</li>
      </ul>
    </div>

    <div class="mt-4">
      <h6>关于</h6>
      <p class="small text-muted">
        Web Serial Debug - 浏览器串口调试工具<br />
        基于 Web Serial API<br />
        支持 Chrome、Edge 等浏览器
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSerialStore } from '@/stores/serial'
import { useSerialLogStore } from '@/stores/serialLog'
import { useQuickSendStore } from '@/stores/quickSend'
import { saveJSON } from '@/utils/serial/converter'

const serialStore = useSerialStore()
const logStore = useSerialLogStore()
const quickSendStore = useQuickSendStore()
const importInput = ref<HTMLInputElement>()

// 重置配置
const resetConfig = async () => {
  try {
    await ElMessageBox.confirm('确定要重置所有参数吗？此操作不可恢复！', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    // 清空 localStorage
    localStorage.removeItem('serial-config')
    localStorage.removeItem('serial-log-config')
    localStorage.removeItem('quick-send-list')
    localStorage.removeItem('serial-send-config')
    localStorage.removeItem('serial-code')

    // 重置 stores
    serialStore.reset()
    logStore.clearLogs()

    ElMessage.success('重置成功，建议刷新页面')

    // 刷新页面
    setTimeout(() => {
      location.reload()
    }, 1000)
  } catch (e) {
    // 用户取消
  }
}

// 导出配置
const exportConfig = () => {
  const config = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    serialOptions: serialStore.options,
    logConfig: {
      logType: logStore.logType,
      autoScroll: logStore.autoScroll,
      packetTimeout: logStore.packetTimeout,
    },
    quickSendGroups: quickSendStore.groups,
    sendConfig: JSON.parse(localStorage.getItem('serial-send-config') || '{}'),
    code: localStorage.getItem('serial-code') || '',
  }

  saveJSON(config, `web-serial-debug-config-${Date.now()}.json`)
  ElMessage.success('导出成功')
}

// 触发导入
const triggerImport = () => {
  importInput.value?.click()
}

// 导入配置
const importConfig = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const data = e.target?.result as string
      const config = JSON.parse(data)

      // 验证配置格式
      if (!config.version) {
        throw new Error('无效的配置文件')
      }

      // 应用配置
      if (config.serialOptions) {
        serialStore.updateOptions(config.serialOptions)
      }

      if (config.logConfig) {
        logStore.logType = config.logConfig.logType
        logStore.autoScroll = config.logConfig.autoScroll
        logStore.packetTimeout = config.logConfig.packetTimeout
      }

      if (config.quickSendGroups) {
        quickSendStore.groups = config.quickSendGroups
      }

      if (config.sendConfig) {
        localStorage.setItem('serial-send-config', JSON.stringify(config.sendConfig))
      }

      if (config.code) {
        localStorage.setItem('serial-code', config.code)
      }

      ElMessage.success('导入成功，建议刷新页面')

      // 刷新页面
      setTimeout(() => {
        location.reload()
      }, 1000)
    } catch (error: any) {
      ElMessage.error('导入失败：' + error.message)
    }
  }
  reader.readAsText(file)

  // 清空文件选择
  target.value = ''
}
</script>

<style scoped>
.gap-2 {
  gap: 0.5rem;
}

h6 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
</style>

