<template>
  <div class="device-search">
    <!-- 扫描按钮区域 -->
    <div class="search-header">
      <el-button
        v-if="!bleStore.isScanning"
        type="primary"
        size="large"
        :icon="Search"
        @click="handleStartScan"
        :disabled="!bleStore.isSupported"
      >
        选择蓝牙设备
      </el-button>
      <el-button
        v-else
        type="danger"
        size="large"
        :icon="Close"
        @click="handleStopScan"
      >
        停止扫描
      </el-button>
      
      <div v-if="!bleStore.isSupported" class="not-supported">
        <el-alert
          title="当前浏览器不支持 Web Bluetooth API，请使用 Chrome、Edge 或 Opera 浏览器"
          type="error"
          :closable="false"
          show-icon
        />
      </div>
      
      <!-- 使用说明 -->
      <div class="usage-tip" v-if="!bleStore.isScanning && bleStore.devices.length === 0">
        <el-alert
          type="info"
          :closable="false"
        >
          <template #title>
            <div style="font-size: 14px;">
              <strong>💡 使用说明</strong>
            </div>
          </template>
          <div style="font-size: 13px; line-height: 1.6;">
            <p style="margin: 4px 0;">1. 确保设备蓝牙已开启</p>
            <p style="margin: 4px 0;">3. 点击按钮后，在弹出的系统窗口中选择您的设备</p>
            <p style="margin: 4px 0;">4. 如果没有看到设备，请检查设备是否开机和蓝牙是否可见</p>
          </div>
        </el-alert>
      </div>
    </div>

    <!-- 扫描动画 -->
    <div v-if="bleStore.isScanning" class="scanning-animation">
      <div class="radar-container">
        <div class="radar-wave"></div>
        <div class="radar-wave delay-1"></div>
        <div class="radar-wave delay-2"></div>
        <div class="radar-center"></div>
      </div>
      <p class="scanning-text">正在扫描设备...</p>
    </div>

    <!-- 设备列表 -->
    <div v-if="bleStore.devices.length > 0" class="device-list">
      <h3>已发现设备 ({{ bleStore.devices.length }})</h3>
      
      <div
        v-for="device in bleStore.devices"
        :key="device.id"
        class="device-item"
        :class="{ 
          nearest: device.isNearest,
          connected: device.id === bleStore.currentDevice?.id 
        }"
        @click="handleConnectDevice(device)"
      >
        <div class="device-icon">
          <el-icon :size="32">
            <component :is="'Connection'" />
          </el-icon>
          
          <!-- 最近设备标记 -->
          <span v-if="device.isNearest" class="nearest-badge">
            最近
          </span>
        </div>
        
        <div class="device-info">
          <div class="device-name">{{ device.name }}</div>
          <div class="device-id">ID: {{ device.id }}</div>
          <div class="device-sn" v-if="device.sn">SN: {{ device.sn }}</div>
        </div>
        
        <div class="device-signal">
          <div class="signal-icon" :class="getSignalClass(device.rssi)">
            <div class="signal-bar bar-1"></div>
            <div class="signal-bar bar-2"></div>
            <div class="signal-bar bar-3"></div>
            <div class="signal-bar bar-4"></div>
          </div>
          <div class="signal-text">{{ device.rssi }} dBm</div>
        </div>
        
        <div class="device-action">
          <el-button
            v-if="device.id !== bleStore.currentDevice?.id"
            type="primary"
            size="small"
            :loading="bleStore.connectionStatus === 1"
          >
            连接
          </el-button>
          <el-tag v-else type="success">已连接</el-tag>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!bleStore.isScanning" class="empty-state">
      <el-icon :size="64" color="#C0C4CC">
        <Search />
      </el-icon>
      <p>暂无设备</p>
      <p class="empty-tip">点击上方按钮选择蓝牙设备</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, Close } from '@element-plus/icons-vue'
import { useBleStore } from '@/stores/ble'
import type { BleDeviceInfo } from '@/types/ble'

const bleStore = useBleStore()

/**
 * 开始扫描
 */
async function handleStartScan() {
  await bleStore.startScan()
}

/**
 * 停止扫描
 */
function handleStopScan() {
  bleStore.stopScan()
}

/**
 * 连接设备
 */
async function handleConnectDevice(device: BleDeviceInfo) {
  if (device.id === bleStore.currentDevice?.id) {
    return
  }
  await bleStore.connectDevice(device)
}

/**
 * 获取信号强度样式类
 */
function getSignalClass(rssi: number): string {
  if (rssi >= -60) return 'signal-excellent'
  if (rssi >= -70) return 'signal-good'
  if (rssi >= -80) return 'signal-fair'
  return 'signal-poor'
}
</script>

<style scoped lang="scss">
.device-search {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.search-header {
  text-align: center;
  margin-bottom: 32px;

  .el-button {
    min-width: 180px;
  }

  .not-supported {
    margin-top: 16px;
  }

  .usage-tip {
    margin-top: 24px;
    text-align: left;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
}

// 扫描动画
.scanning-animation {
  text-align: center;
  margin: 48px 0;

  .radar-container {
    position: relative;
    width: 150px;
    height: 150px;
    margin: 0 auto 24px;
  }

  .radar-wave {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    border: 2px solid var(--el-color-primary);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: radar-pulse 2s ease-out infinite;
    opacity: 0;

    &.delay-1 {
      animation-delay: 0.5s;
    }

    &.delay-2 {
      animation-delay: 1s;
    }
  }

  .radar-center {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    background: var(--el-color-primary);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: radar-center-pulse 2s ease-in-out infinite;
  }

  .scanning-text {
    font-size: 16px;
    color: var(--el-color-primary);
    font-weight: 500;
  }
}

@keyframes radar-pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.3);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

@keyframes radar-center-pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
  }
}

// 设备列表
.device-list {
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: var(--el-text-color-primary);
  }
}

.device-item {
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 12px;
  background: #fff;
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--el-color-primary);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  &.nearest {
    border-color: #67c23a;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2f1 100%);
  }

  &.connected {
    border-color: var(--el-color-success);
    background: #f0f9ff;
  }

  .device-icon {
    position: relative;
    margin-right: 16px;
    color: var(--el-color-primary);

    .nearest-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      padding: 2px 6px;
      background: #67c23a;
      color: #fff;
      font-size: 10px;
      border-radius: 8px;
      white-space: nowrap;
    }
  }

  .device-info {
    flex: 1;
    min-width: 0;

    .device-name {
      font-size: 16px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .device-id,
    .device-sn {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .device-signal {
    margin: 0 16px;
    text-align: center;

    .signal-icon {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      height: 24px;
      margin-bottom: 4px;

      .signal-bar {
        width: 4px;
        margin: 0 1px;
        background: #dcdfe6;
        border-radius: 2px;
        transition: background 0.3s;

        &.bar-1 { height: 6px; }
        &.bar-2 { height: 12px; }
        &.bar-3 { height: 18px; }
        &.bar-4 { height: 24px; }
      }

      &.signal-excellent .signal-bar {
        background: #67c23a;
      }

      &.signal-good .signal-bar {
        &.bar-1, &.bar-2, &.bar-3 {
          background: #409eff;
        }
      }

      &.signal-fair .signal-bar {
        &.bar-1, &.bar-2 {
          background: #e6a23c;
        }
      }

      &.signal-poor .signal-bar.bar-1 {
        background: #f56c6c;
      }
    }

    .signal-text {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }

  .device-action {
    margin-left: 8px;
  }
}

// 空状态
.empty-state {
  text-align: center;
  padding: 64px 24px;
  color: var(--el-text-color-secondary);

  p {
    margin-top: 16px;
    font-size: 16px;
  }

  .empty-tip {
    font-size: 14px;
    color: var(--el-text-color-placeholder);
  }
}
</style>

