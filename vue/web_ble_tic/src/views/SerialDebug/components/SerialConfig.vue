<template>
  <div id="serial-options" class="col-auto m-0 bg-light sidebar">
    <div class="collapse show p-2 float-start">
      <!-- 波特率 -->
      <div class="input-group mb-3">
        <span class="input-group-text">波特率</span>
        <input
          v-model.number="serialStore.options.baudRate"
          type="number"
          class="form-control"
          placeholder="选择波特率"
          list="baud-list"
          @change="onOptionsChange"
        />
        <datalist id="baud-list">
          <option>110</option>
          <option>300</option>
          <option>600</option>
          <option>1200</option>
          <option>2400</option>
          <option>4800</option>
          <option>7200</option>
          <option>9600</option>
          <option>14400</option>
          <option>19200</option>
          <option>28800</option>
          <option>38400</option>
          <option>56000</option>
          <option>57600</option>
          <option>76800</option>
          <option>115200</option>
          <option>230400</option>
          <option>460800</option>
        </datalist>
      </div>

      <!-- 数据位 -->
      <div class="input-group mb-3">
        <span class="input-group-text">数据位</span>
        <select v-model.number="serialStore.options.dataBits" class="form-select" @change="onOptionsChange">
          <option :value="8">8</option>
          <option :value="7">7</option>
        </select>
      </div>

      <!-- 停止位 -->
      <div class="input-group mb-3">
        <span class="input-group-text">停止位</span>
        <select v-model.number="serialStore.options.stopBits" class="form-select" @change="onOptionsChange">
          <option :value="1">1</option>
          <option :value="2">2</option>
        </select>
      </div>

      <!-- 校验位 -->
      <div class="input-group mb-3">
        <span class="input-group-text">校验位</span>
        <select v-model="serialStore.options.parity" class="form-select" @change="onOptionsChange">
          <option value="none">None</option>
          <option value="even">Even</option>
          <option value="odd">Odd</option>
        </select>
      </div>

      <!-- 缓冲区 -->
      <div class="input-group mb-3">
        <span class="input-group-text">缓冲区</span>
        <input
          v-model.number="serialStore.options.bufferSize"
          type="number"
          class="form-control"
          placeholder="缓冲区大小"
          list="buffer-size-list"
          max="1677216"
          @change="onOptionsChange"
        />
        <datalist id="buffer-size-list">
          <option>255</option>
          <option>512</option>
          <option>1024</option>
          <option>2048</option>
          <option>4096</option>
          <option>8192</option>
        </datalist>
      </div>

      <!-- 流控制 -->
      <div class="input-group mb-3">
        <span class="input-group-text">流控制</span>
        <select v-model="serialStore.options.flowControl" class="form-select" @change="onOptionsChange">
          <option value="none">None</option>
          <option value="hardware">HardWare</option>
        </select>
      </div>

      <!-- 操作按钮 -->
      <div class="d-flex mt-2">
        <button class="btn btn-secondary me-3" @click="selectPort">选择串口</button>
        <button
          class="btn flex-grow-1"
          :class="serialStore.status.isOpen ? 'btn-danger' : 'btn-primary'"
          @click="togglePort"
        >
          {{ serialStore.status.isOpen ? '关闭串口' : '打开串口' }}
        </button>
      </div>

      <!-- 状态显示 -->
      <div id="serial-status" class="mt-2">
        <div
          class="alert"
          :class="{
            'alert-info': !serialStore.port,
            'alert-success': serialStore.status.isConnected,
            'alert-danger': serialStore.port && !serialStore.status.isConnected,
          }"
          role="alert"
        >
          {{ serialStore.status.portInfo }}
        </div>
      </div>
    </div>

    <!-- 折叠按钮 -->
    <button class="toggle-button float-end" title="隐藏/打开边栏" @click="toggleSidebar">
      <i class="bi bi-chevron-compact-left"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useSerialStore } from '@/stores/serial'
import { serialManager } from '@/utils/serial'

const serialStore = useSerialStore()

// 初始化时检查已授权的串口
onMounted(async () => {
  const ports = await serialManager.getPorts()
  if (ports.length > 0) {
    serialStore.port = ports[0]
    serialStore.updateStatus({
      isConnected: true,
      portInfo: '设备已连接',
    })
  }

  // 设置状态变化回调
  serialManager.setOnStatusChange((isConnected) => {
    serialStore.updateStatus({
      isConnected,
      portInfo: isConnected ? '设备已连接' : '设备已断开',
    })
  })
})

// 选择串口
const selectPort = async () => {
  try {
    const port = await serialManager.requestPort()
    if (port) {
      serialStore.port = port
      serialStore.updateStatus({
        isConnected: true,
        portInfo: '设备已连接',
      })
    }
  } catch (error: any) {
    ElMessage.error('获取串口权限失败: ' + error.message)
  }
}

// 打开/关闭串口
const togglePort = async () => {
  if (!serialStore.port) {
    ElMessage.warning('请先选择串口')
    return
  }

  if (serialStore.status.isOpen) {
    // 关闭串口
    await serialManager.close()
    serialStore.updateStatus({
      isOpen: false,
    })
  } else {
    // 打开串口
    const success = await serialManager.open(serialStore.options)
    if (success) {
      serialStore.updateStatus({
        isOpen: true,
      })
      ElMessage.success('串口已打开')
    } else {
      ElMessage.error('打开串口失败')
    }
  }
}

// 配置变化时，如果串口已打开，需要重新打开
const onOptionsChange = async () => {
  if (serialStore.status.isOpen) {
    await serialManager.close()
    setTimeout(async () => {
      await serialManager.open(serialStore.options)
    }, 50)
  }
}

// 折叠侧边栏
const toggleSidebar = (e: Event) => {
  const button = e.currentTarget as HTMLElement
  const parent = button.parentElement
  const sidebar = parent?.querySelector('.collapse')
  const icon = button.querySelector('i')
  sidebar?.classList.toggle('show')
  icon?.classList.toggle('bi-chevron-compact-right')
  icon?.classList.toggle('bi-chevron-compact-left')
}
</script>

<style scoped>
/* 不要设置 min-width，让 col-auto 自动控制宽度 */
</style>

