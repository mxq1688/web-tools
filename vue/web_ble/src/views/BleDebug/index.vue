<template>
  <div class="ble-debug">
    <div class="ble-header">
      <h1>蓝牙调试工具</h1>
      <p class="subtitle">基于 Web Bluetooth API 的蓝牙设备管理工具</p>
    </div>

    <!-- 已连接设备信息 -->
    <div v-if="bleStore.hasDevice" class="device-connected">
      <DeviceInfo />
    </div>

    <!-- 设备搜索 -->
    <DeviceSearch />

    <!-- 开发提示 -->
    <el-alert
      type="info"
      :closable="false"
      style="margin-top: 24px"
    >
      <template #title>
        <strong>开发提示</strong>
      </template>
      <ul style="margin: 8px 0; padding-left: 20px;">
        <li>Web Bluetooth API 需要在 HTTPS 环境或 localhost 下运行</li>
        <li>扫描设备需要用户手势触发（点击按钮）</li>
        <li>请确保您的设备支持蓝牙并已开启</li>
        <li>部分浏览器可能需要在设置中启用实验性功能</li>
      </ul>
    </el-alert>
  </div>
</template>

<script setup lang="ts">
import DeviceSearch from './components/DeviceSearch.vue'
import DeviceInfo from './components/DeviceInfo.vue'
import { useBleStore } from '@/stores/ble'
import { onBeforeUnmount } from 'vue'

const bleStore = useBleStore()

// 页面卸载时清理
onBeforeUnmount(() => {
  bleStore.stopScan()
})
</script>

<style scoped lang="scss">
.ble-debug {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32px 16px;
}

.ble-header {
  text-align: center;
  color: #fff;
  margin-bottom: 32px;

  h1 {
    font-size: 36px;
    font-weight: 700;
    margin: 0 0 12px 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .subtitle {
    font-size: 16px;
    opacity: 0.9;
    margin: 0;
  }
}

.device-connected {
  max-width: 1200px;
  margin: 0 auto 24px;
}
</style>

