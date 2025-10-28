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
        <!-- 录音模式 -->
        <div v-if="bleStore.deviceDetail?.audioType" class="mode-indicator">
          <el-icon :size="16" color="#409eff">
            <component :is="'Microphone'" />
          </el-icon>
          <span>{{ bleStore.deviceDetail.audioType === 1 ? '录音模式' : '会议模式' }}</span>
        </div>

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

    <!-- 设备详细信息 -->
    <div v-if="bleStore.deviceDetail?.generalSettings || bleStore.deviceDetail?.storageInfo || bleStore.deviceDetail?.systemVersion" class="device-settings">
      <div class="settings-title">设备信息</div>
      <div class="settings-grid">
        <!-- 通用设置 -->
        <template v-if="bleStore.deviceDetail?.generalSettings">
          <div class="setting-item">
            <span class="setting-label">录音场景:</span>
            <span class="setting-value">
              {{ bleStore.deviceDetail.generalSettings.rec_scene === 1 ? '录音模式' : '会议模式' }}
            </span>
          </div>
          <div class="setting-item">
            <span class="setting-label">麦克风增益:</span>
            <span class="setting-value">{{ bleStore.deviceDetail.generalSettings.dmic_mode }}</span>
          </div>
          <div class="setting-item">
            <span class="setting-label">LED状态:</span>
            <span class="setting-value">
              {{ bleStore.deviceDetail.generalSettings.rec_led_status ? '开启' : '关闭' }}
            </span>
          </div>
          <div class="setting-item">
            <span class="setting-label">录音模式:</span>
            <span class="setting-value">{{ bleStore.deviceDetail.generalSettings.rec_mode }}</span>
          </div>
        </template>

        <!-- 存储信息 -->
        <template v-if="bleStore.deviceDetail?.storageInfo">
          <div class="setting-item">
            <span class="setting-label">总空间:</span>
            <span class="setting-value">
              {{ (bleStore.deviceDetail.storageInfo.totalSpace / 1024 / 1024).toFixed(2) }} MB
            </span>
          </div>
          <div class="setting-item">
            <span class="setting-label">已使用:</span>
            <span class="setting-value">
              {{ (bleStore.deviceDetail.storageInfo.used / 1024 / 1024).toFixed(2) }} MB
            </span>
          </div>
          <div class="setting-item">
            <span class="setting-label">剩余空间:</span>
            <span class="setting-value">
              {{ (bleStore.deviceDetail.storageInfo.free / 1024 / 1024).toFixed(2) }} MB
            </span>
          </div>
          <div class="setting-item">
            <span class="setting-label">使用率:</span>
            <span class="setting-value" :style="{ color: getStorageColor(bleStore.deviceDetail.storageInfo.useRate) }">
              {{ bleStore.deviceDetail.storageInfo.useRate }}%
            </span>
          </div>
        </template>

        <!-- 系统版本 -->
        <div v-if="bleStore.deviceDetail?.systemVersion" class="setting-item">
          <span class="setting-label">系统版本:</span>
          <span class="setting-value">{{ bleStore.deviceDetail.systemVersion }}</span>
        </div>

        <!-- LED灯效 -->
        <div v-if="bleStore.deviceDetail?.ledEnabled !== undefined" class="setting-item">
          <span class="setting-label">录音灯效:</span>
          <span class="setting-value">{{ bleStore.deviceDetail.ledEnabled ? '开启' : '关闭' }}</span>
        </div>
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
      <div class="action-group">
        <div class="action-group-title">基础信息</div>
        <el-button size="small" @click="handleGetBattery">获取电量</el-button>
        <el-button size="small" @click="handleGetDeviceStatus">获取状态</el-button>
        <el-button size="small" @click="handleGetGeneralSetting">获取设置</el-button>
        <el-button size="small" @click="handleGetStorageVolume">获取存储</el-button>
        <el-button size="small" @click="handleGetSystemVersion">获取版本</el-button>
      </div>

      <div class="action-group">
        <div class="action-group-title">灯效控制</div>
        <el-button size="small" @click="handleGetRecordLed">获取灯效</el-button>
        <el-button size="small" type="success" @click="handleSetRecordLed(true)">开启灯效</el-button>
        <el-button size="small" type="warning" @click="handleSetRecordLed(false)">关闭灯效</el-button>
      </div>

      <div class="action-group">
        <div class="action-group-title">WiFi管理</div>
        <el-button size="small" type="primary" @click="handleOpenWifi">打开WiFi</el-button>
        <el-button size="small" type="danger" @click="handleCloseWifi">关闭WiFi</el-button>
      </div>

      <div class="action-group">
        <div class="action-group-title">文件管理</div>
        <el-button size="small" type="primary" @click="handleGetSessionList">获取文件列表</el-button>
        <el-button 
          size="small" 
          type="warning" 
          @click="handleStopSyncFile"
          :disabled="!bleStore.syncingFileId"
        >
          停止同步
        </el-button>
      </div>

      <div class="action-group">
        <div class="action-group-title">其他</div>
        <el-button size="small" @click="showAdvertisementInfo = !showAdvertisementInfo">
          {{ showAdvertisementInfo ? '隐藏' : '查看' }} 广播信息
        </el-button>
      </div>
    </div>

    <!-- 文件列表 -->
    <div v-if="bleStore.fileList.length > 0" class="file-list">
      <div class="file-list-header">
        <h3>录音文件列表</h3>
        <span class="file-count">共 {{ bleStore.fileList.length }} 个文件</span>
      </div>
      
      <div class="file-items">
        <div 
          v-for="file in bleStore.fileList" 
          :key="file.sessionId" 
          class="file-item"
          :class="{ 
            syncing: file.isDownloading,
            completed: file.isCompleted 
          }"
        >
          <div class="file-info">
            <div class="file-id">
              <span class="label">会话ID:</span>
              <span class="value">{{ file.sessionId }}</span>
            </div>
            <div class="file-time">
              <span class="label">录音时间:</span>
              <span class="value">{{ formatTimestamp(file.sessionId) }}</span>
            </div>
            <div class="file-size">
              <span class="label">大小:</span>
              <span class="value">{{ formatFileSize(file.fileSize) }}</span>
            </div>
            <div class="file-attr">
              <span class="label">属性:</span>
              <span class="value">{{ file.attr }}</span>
            </div>
            <div v-if="file.isDownloading || file.isCompleted" class="file-progress">
              <span class="label">进度:</span>
              <span class="value">{{ file.downloadProgress || 0 }}%</span>
            </div>
          </div>
          
          <!-- 下载进度条 -->
          <div v-if="file.isDownloading" class="progress-bar-wrapper">
            <el-progress 
              :percentage="file.downloadProgress || 0" 
              :color="getProgressColor(file.downloadProgress || 0)"
              :stroke-width="8"
            />
          </div>
          
          <div class="file-actions">
            <!-- 同步按钮 -->
            <el-button 
              v-if="!file.isCompleted"
              size="small" 
              type="success" 
              @click="handleDownloadFile(file.sessionId)"
              :loading="file.isDownloading"
              :disabled="!!bleStore.syncingFileId"
            >
              {{ file.isDownloading ? '传输中' : '传输' }}
            </el-button>
            
            <!-- 下载到本地按钮 -->
            <el-button 
              v-if="file.isCompleted"
              size="small" 
              type="primary" 
              @click="handleSaveFile(file)"
            >
              下载到本地
            </el-button>
            
            <!-- 删除按钮 -->
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDeleteFile(file.sessionId)"
              :disabled="file.isDownloading"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>
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
import { ElMessageBox, ElMessage } from 'element-plus'
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

// 存储空间使用率颜色
function getStorageColor(useRate: number) {
  if (useRate >= 90) return '#f56c6c'
  if (useRate >= 70) return '#e6a23c'
  return '#67c23a'
}

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

function handleGetStorageVolume() {
  bleStore.getStorageVolume()
}

function handleGetSystemVersion() {
  bleStore.getSystemVersion()
}

function handleOpenWifi() {
  bleStore.openWifi()
}

function handleCloseWifi() {
  bleStore.closeWifi()
}

function handleGetRecordLed() {
  bleStore.getRecordLed()
}

function handleSetRecordLed(enabled: boolean) {
  bleStore.setRecordLed(enabled)
}

function handleGetSessionList() {
  bleStore.getSessionList()
}

function handleStopSyncFile() {
  bleStore.stopSyncFile()
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// 格式化时间戳
function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000) // 秒级时间戳转毫秒
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 开始传输文件
async function handleDownloadFile(sessionId: number) {
  try {
    // 开始同步文件
    await bleStore.syncFile(sessionId, 0, 0, 0)
  } catch (error) {
    console.error('传输文件失败:', error)
    ElMessage.error('传输文件失败')
  }
}

// 保存文件到本地
function handleSaveFile(file: any) {
  try {
    if (!file.data || !file.isCompleted) {
      ElMessage.warning('文件数据不完整')
      return
    }
    
    // 创建 Blob 对象
    const blob = new Blob([file.data], { type: 'application/octet-stream' })
    
    // 创建下载链接
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    // 使用时间戳作为文件名
    link.download = `${file.sessionId}.avo`
    
    // 触发下载
    document.body.appendChild(link)
    link.click()
    
    // 清理
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    ElMessage.success('文件已保存')
  } catch (error) {
    console.error('保存文件失败:', error)
    ElMessage.error('保存文件失败')
  }
}

// 删除文件
async function handleDeleteFile(sessionId: number) {
  try {
    await ElMessageBox.confirm(
      `确定要删除会话 ${sessionId} 的录音文件吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    bleStore.deleteRecord(sessionId)
  } catch {
    // 用户取消删除
  }
}

// 获取进度条颜色
function getProgressColor(percentage: number) {
  if (percentage < 30) return '#f56c6c'
  if (percentage < 70) return '#e6a23c'
  return '#67c23a'
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

  .mode-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 10px;
    background: #ecf5ff;
    border-radius: 6px;
    font-size: 12px;
    color: #409eff;
    font-weight: 500;
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
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;

  .action-group {
    .action-group-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--el-text-color-regular);
      margin-bottom: 8px;
    }

    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;

    .el-button {
      flex: 0 0 auto;
    }
  }
}

.device-settings {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;

  .settings-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-bottom: 12px;
  }

  .settings-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;

    .setting-item {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .setting-label {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }

      .setting-value {
        font-size: 14px;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }
    }
  }
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

.file-list {
  margin-top: 24px;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #ebeef5;

  .file-list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid #e4e7ed;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .file-count {
      font-size: 14px;
      color: var(--el-text-color-secondary);
      background: #f5f7fa;
      padding: 4px 12px;
      border-radius: 12px;
    }
  }

  .file-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .file-item {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e4e7ed;
    transition: all 0.3s;

    &:hover {
      background: #f0f2f5;
      border-color: #d0d3d9;
      transform: translateX(4px);
    }

    &.syncing {
      background: #e6f7ff;
      border-color: #91d5ff;
    }

    &.completed {
      background: #f0f9ff;
      border-color: #67c23a;
    }

    .file-info {
      display: flex;
      gap: 24px;
      flex: 1;
      flex-wrap: wrap;

      > div {
        display: flex;
        align-items: center;
        gap: 8px;

        .label {
          font-size: 13px;
          color: var(--el-text-color-secondary);
        }

        .value {
          font-size: 14px;
          font-weight: 500;
          color: var(--el-text-color-primary);
        }
      }

      .file-id .value {
        color: #409eff;
        font-weight: 600;
      }

      .file-time .value {
        color: #909399;
        font-family: 'Courier New', monospace;
      }

      .file-size .value {
        color: #67c23a;
      }

      .file-progress .value {
        color: #409eff;
        font-weight: 600;
      }
    }

    .progress-bar-wrapper {
      width: 100%;
      padding: 0 4px;
    }

    .file-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;

      .el-button {
        min-width: 100px;
      }
    }
  }
}
</style>

