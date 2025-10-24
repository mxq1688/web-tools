<template>
  <div>
    <!-- 头部导航 -->
    <Header />

    <!-- 主内容区域 -->
    <div id="main" class="d-flex">
      <!-- 左侧串口配置 -->
      <SerialConfig />

      <!-- 中间串口日志和发送区域 -->
      <div id="log-main" class="flex-fill px-md-2">
        <SerialLog />
        <SerialSend />
      </div>

      <!-- 右侧工具栏 -->
      <SerialTools />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SerialManager } from '@/utils/serial'
import Header from '@/layout/Header.vue'
import SerialConfig from './components/SerialConfig.vue'
import SerialLog from './components/SerialLog.vue'
import SerialSend from './components/SerialSend.vue'
import SerialTools from './components/SerialTools.vue'

// 检查浏览器支持
onMounted(() => {
  if (!SerialManager.isSupported()) {
    ElMessage.error('当前浏览器不支持串口操作，请使用 Chrome 或 Edge 浏览器')
  }
})

onUnmounted(() => {
  // 组件卸载时的清理工作
})
</script>

<style scoped>
#main {
  height: calc(100vh - var(--top-height, 63px));
  overflow: hidden;
}

#log-main {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
</style>

