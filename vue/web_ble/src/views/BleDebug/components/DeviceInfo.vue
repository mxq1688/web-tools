<template>
  <div class="device-info-card">
    <div class="device-header">
      <div class="device-left">
        <div class="device-avatar">
          <el-icon :size="32">
            <component :is="'Connection'" />
          </el-icon>
        </div>
        <div class="device-details">
          <h3>{{ bleStore.deviceDetail?.name }}</h3>
          <p class="device-sn">SN: {{ bleStore.deviceDetail?.sn }}</p>
        </div>
      </div>

      <div class="device-right">
        <!-- 电池电量 -->
        <div class="battery-indicator">
          <el-icon :size="20" :color="getBatteryColor">
            <component :is="'Operation'" />
          </el-icon>
          <span class="battery-text">{{ bleStore.deviceDetail?.batteryLevel || '--' }}%</span>
        </div>
        
        <!-- 充电状态 -->
        <div v-if="bleStore.deviceDetail?.chargeStatus" class="charge-indicator">
          <el-icon :size="16" color="#67c23a">
            <component :is="'Connection'" />
          </el-icon>
          <span>充电中</span>
        </div>

        <!-- 断开连接按钮 -->
        <el-button
          type="danger"
          size="small"
          @click="handleDisconnect"
        >
          断开连接
        </el-button>
      </div>
    </div>

    <!-- 录音控制 -->
    <div class="record-controls">
      <el-button
        v-if="bleStore.audioStatus === 0 || bleStore.audioStatus === 1"
        type="primary"
        size="large"
        :icon="VideoPlay"
        @click="handleStartRecord"
      >
        开始录音
      </el-button>

      <template v-else>
        <!-- 暂停/继续 -->
        <el-button
          v-if="bleStore.audioStatus === 2"
          type="warning"
          size="large"
          :icon="VideoPause"
          @click="handlePauseRecord"
        >
          暂停录音
        </el-button>
        <el-button
          v-else
          type="primary"
          size="large"
          :icon="VideoPlay"
          @click="handleResumeRecord"
        >
          继续录音
        </el-button>

        <!-- 停止 -->
        <el-button
          type="danger"
          size="large"
          :icon="Close"
          @click="handleStopRecord"
        >
          停止录音
        </el-button>
      </template>
    </div>

    <!-- 设备信息操作 -->
    <div class="device-actions">
      <el-button
        type="info"
        size="default"
        :icon="'Battery'"
        @click="handleGetBattery"
      >
        获取电池电量
      </el-button>
      <el-button
        type="success"
        size="default"
        :icon="'Refresh'"
        @click="handleGetDeviceStatus"
      >
        获取设备状态
      </el-button>
      <el-button
        type="warning"
        size="default"
        :icon="'Setting'"
        @click="handleGetGeneralSetting"
      >
        获取通用设置
      </el-button>
      <el-button
        type="primary"
        size="default"
        :icon="'View'"
        @click="showAdvertisementInfo = !showAdvertisementInfo"
      >
        {{ showAdvertisementInfo ? '隐藏' : '查看' }} 广播信息
      </el-button>
    </div>

    <!-- 广播信息 -->
    <AdvertisementInfo 
      v-if="showAdvertisementInfo" 
      :advertisement-data="advertisementData" 
    />

    <!-- 录音状态 -->
    <div v-if="bleStore.audioStatus === 2 || bleStore.audioStatus === 3" class="record-status">
      <div class="status-indicator" :class="{ recording: bleStore.audioStatus === 2 }">
        <span class="status-dot"></span>
        <span class="status-text">
          {{ bleStore.audioStatus === 2 ? '录音中' : '已暂停' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VideoPlay, VideoPause, Close } from '@element-plus/icons-vue'
import { useBleStore } from '@/stores/ble'
import { computed, ref } from 'vue'
import AdvertisementInfo from './AdvertisementInfo.vue'
import { AdvertisementParser } from '@/utils/ble/advertisementParser'

const bleStore = useBleStore()
const showAdvertisementInfo = ref(false)

// 广播数据
const advertisementData = computed(() => {
  if (!bleStore.deviceDetail) return undefined
  
  // 模拟获取广播数据
  const mockDevice = {
    id: bleStore.deviceDetail.sn,
    name: bleStore.deviceDetail.name,
  } as BluetoothDevice
  
  return AdvertisementParser.parseAdvertisementData(mockDevice)
})

// 电池电量颜色
const getBatteryColor = computed(() => {
  const level = bleStore.deviceDetail?.batteryLevel || 0
  if (level <= 20) return '#f56c6c'
  if (level <= 50) return '#e6a23c'
  return '#67c23a'
})

function handleDisconnect() {
  bleStore.disconnect()
}

function handleStartRecord() {
  bleStore.startRecord()
}

function handlePauseRecord() {
  bleStore.pauseRecord()
}

function handleResumeRecord() {
  bleStore.resumeRecord()
}

function handleStopRecord() {
  bleStore.stopRecord()
}

function handleGetBattery() {
  bleStore.getBatteryLevel()
}

function handleGetDeviceStatus() {
  bleStore.getDeviceStatus()
}

function handleGetGeneralSetting() {
  bleStore.getGeneralSetting()
}
</script>

<style scoped lang="scss">
.device-info-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.device-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.device-left {
  display: flex;
  align-items: center;
  gap: 16px;

  .device-avatar {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }

  .device-details {
    h3 {
      margin: 0 0 4px 0;
      font-size: 20px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .device-sn {
      margin: 0;
      font-size: 13px;
      color: var(--el-text-color-secondary);
    }
  }
}

.device-right {
  display: flex;
  align-items: center;
  gap: 16px;

  .battery-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: #f5f7fa;
    border-radius: 8px;

    .battery-text {
      font-size: 14px;
      font-weight: 600;
    }
  }

  .charge-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 10px;
    background: #f0f9ff;
    border-radius: 6px;
    font-size: 12px;
    color: #67c23a;
  }
}

.record-controls {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 16px;

  .el-button {
    min-width: 140px;
  }
}

.device-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 16px;
}

.record-status {
  text-align: center;

  .status-indicator {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #f5f7fa;
    border-radius: 20px;

    &.recording {
      background: #fef0f0;

      .status-dot {
        background: #f56c6c;
        animation: pulse 1.5s ease-in-out infinite;
      }

      .status-text {
        color: #f56c6c;
      }
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #e6a23c;
    }

    .status-text {
      font-size: 14px;
      font-weight: 500;
      color: #e6a23c;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}
</style>

