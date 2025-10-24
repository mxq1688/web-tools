<template>
  <div class="advertisement-info">
    <div class="info-header">
      <h3>📡 广播信息</h3>
      <el-button 
        v-if="!isExpanded" 
        type="primary" 
        size="small" 
        @click="isExpanded = true"
      >
        查看详情
      </el-button>
      <el-button 
        v-else 
        type="info" 
        size="small" 
        @click="isExpanded = false"
      >
        收起
      </el-button>
    </div>

    <!-- 基本信息 -->
    <div class="basic-info">
      <div class="info-item">
        <span class="label">设备名称:</span>
        <span class="value">{{ advertisementData?.completeLocalName || '未知' }}</span>
      </div>
      <div class="info-item">
        <span class="label">传输功率:</span>
        <span class="value">{{ advertisementData?.txPowerLevel || '未知' }} dBm</span>
      </div>
      <div class="info-item">
        <span class="label">广播标志:</span>
        <span class="value">0x{{ (advertisementData?.flags || 0).toString(16).toUpperCase() }}</span>
      </div>
    </div>

    <!-- 详细信息 (可展开) -->
    <div v-if="isExpanded" class="detailed-info">
      <!-- 制造商数据 -->
      <div v-if="advertisementData?.manufacturerData?.length" class="info-section">
        <h4>🏭 制造商数据</h4>
        <div 
          v-for="(mfg, index) in advertisementData.manufacturerData" 
          :key="index"
          class="manufacturer-item"
        >
          <div class="manufacturer-header">
            <span class="company-name">{{ mfg.companyName || '未知制造商' }}</span>
            <span class="company-id">(0x{{ mfg.companyId.toString(16).toUpperCase() }})</span>
          </div>
          <div class="manufacturer-data">
            <span class="data-label">数据:</span>
            <code class="data-hex">{{ formatHexData(mfg.data) }}</code>
          </div>
        </div>
      </div>

      <!-- 服务UUID -->
      <div v-if="advertisementData?.serviceUuids?.length" class="info-section">
        <h4>🔧 服务UUID</h4>
        <div class="service-list">
          <div 
            v-for="(uuid, index) in advertisementData.serviceUuids" 
            :key="index"
            class="service-item"
          >
            <span class="service-index">{{ index + 1 }}.</span>
            <code class="service-uuid">{{ uuid }}</code>
            <span class="service-name">{{ getServiceName(uuid) }}</span>
          </div>
        </div>
      </div>

      <!-- 服务数据 -->
      <div v-if="advertisementData?.serviceData?.length" class="info-section">
        <h4>📊 服务数据</h4>
        <div 
          v-for="(service, index) in advertisementData.serviceData" 
          :key="index"
          class="service-data-item"
        >
          <div class="service-data-header">
            <code class="service-uuid">{{ service.serviceUuid }}</code>
            <span class="service-name">{{ getServiceName(service.serviceUuid) }}</span>
          </div>
          <div class="service-data-content">
            <span class="data-label">数据:</span>
            <code class="data-hex">{{ formatHexData(service.data) }}</code>
          </div>
        </div>
      </div>

      <!-- 设备外观 -->
      <div v-if="advertisementData?.appearance !== undefined" class="info-section">
        <h4>👁️ 设备外观</h4>
        <div class="appearance-item">
          <span class="appearance-value">0x{{ advertisementData.appearance.toString(16).toUpperCase() }}</span>
          <span class="appearance-desc">{{ getAppearanceDescription(advertisementData.appearance) }}</span>
        </div>
      </div>

      <!-- 原始数据 -->
      <div class="info-section">
        <h4>🔍 原始数据</h4>
        <div class="raw-data">
          <el-button 
            type="text" 
            size="small" 
            @click="showRawData = !showRawData"
          >
            {{ showRawData ? '隐藏' : '显示' }} 原始数据
          </el-button>
          <pre v-if="showRawData" class="raw-data-content">{{ rawDataText }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { BleAdvertisementData } from '@/types/ble'
import { AdvertisementParser } from '@/utils/ble/advertisementParser'

interface Props {
  advertisementData?: BleAdvertisementData
}

const props = defineProps<Props>()

const isExpanded = ref(false)
const showRawData = ref(false)

// 格式化十六进制数据
function formatHexData(data: Uint8Array): string {
  return Array.from(data)
    .map(b => b.toString(16).padStart(2, '0'))
    .join(' ')
    .toUpperCase()
}

// 获取服务名称
function getServiceName(uuid: string): string {
  const serviceNames: Record<string, string> = {
    '0000180F-0000-1000-8000-00805F9B34FB': '电池服务',
    '0000180A-0000-1000-8000-00805F9B34FB': '设备信息服务',
    '0000180D-0000-1000-8000-00805F9B34FB': '心率服务',
    '0000180E-0000-1000-8000-00805F9B34FB': '血压服务',
    '0000180B-0000-1000-8000-00805F9B34FB': '人体测量服务',
    '0000180C-0000-1000-8000-00805F9B34FB': '用户数据服务',
    '0000180G-0000-1000-8000-00805F9B34FB': '血糖服务',
    '0000180H-0000-1000-8000-00805F9B34FB': '温度服务',
  }
  return serviceNames[uuid] || '未知服务'
}

// 获取设备外观描述
function getAppearanceDescription(appearance: number): string {
  const appearances: Record<number, string> = {
    0x0000: '未知设备',
    0x0040: '电话',
    0x0080: '计算机',
    0x00C0: '手表',
    0x0100: '时钟',
    0x0140: '显示器',
    0x0180: '遥控器',
    0x01C0: '游戏控制器',
    0x0200: '数字媒体播放器',
    0x0240: '音频设备',
    0x0280: '车载设备',
    0x02C0: '健康设备',
    0x0300: '血糖仪',
    0x0340: '血压计',
    0x0380: '体温计',
    0x03C0: '心率监测器',
    0x0400: '血氧仪',
    0x0440: '体重秤',
    0x0480: '步数计',
    0x04C0: '运动传感器',
    0x0500: '运动设备',
    0x0540: '自行车',
    0x0580: '环境传感器',
    0x05C0: '光传感器',
    0x0600: '运动传感器',
    0x0640: '压力传感器',
    0x0680: '温度传感器',
    0x06C0: '湿度传感器',
    0x0700: '风速传感器',
    0x0740: '气压传感器',
    0x0780: '高度计',
    0x07C0: '重力传感器',
    0x0800: '运动传感器',
    0x0840: '陀螺仪',
    0x0880: '磁力计',
    0x08C0: '运动传感器',
    0x0900: '运动传感器',
    0x0940: '运动传感器',
    0x0980: '运动传感器',
    0x09C0: '运动传感器',
    0x0A00: '运动传感器',
    0x0A40: '运动传感器',
    0x0A80: '运动传感器',
    0x0AC0: '运动传感器',
    0x0B00: '运动传感器',
    0x0B40: '运动传感器',
    0x0B80: '运动传感器',
    0x0BC0: '运动传感器',
    0x0C00: '运动传感器',
    0x0C40: '运动传感器',
    0x0C80: '运动传感器',
    0x0CC0: '运动传感器',
    0x0D00: '运动传感器',
    0x0D40: '运动传感器',
    0x0D80: '运动传感器',
    0x0DC0: '运动传感器',
    0x0E00: '运动传感器',
    0x0E40: '运动传感器',
    0x0E80: '运动传感器',
    0x0EC0: '运动传感器',
    0x0F00: '运动传感器',
    0x0F40: '运动传感器',
    0x0F80: '运动传感器',
    0x0FC0: '运动传感器',
  }
  return appearances[appearance] || '未知设备类型'
}

// 原始数据文本
const rawDataText = computed(() => {
  if (!props.advertisementData) return ''
  return AdvertisementParser.formatAdvertisementData(props.advertisementData)
})
</script>

<style scoped lang="scss">
.advertisement-info {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;

  .info-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .basic-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
    margin-bottom: 16px;

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: #f5f7fa;
      border-radius: 6px;

      .label {
        font-weight: 500;
        color: var(--el-text-color-secondary);
      }

      .value {
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }
  }

  .detailed-info {
    .info-section {
      margin-bottom: 20px;

      h4 {
        margin: 0 0 12px 0;
        font-size: 14px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        border-bottom: 1px solid #e4e7ed;
        padding-bottom: 4px;
      }
    }

    .manufacturer-item {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 8px;

      .manufacturer-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        .company-name {
          font-weight: 600;
          color: var(--el-text-color-primary);
          margin-right: 8px;
        }

        .company-id {
          font-size: 12px;
          color: var(--el-text-color-secondary);
          font-family: monospace;
        }
      }

      .manufacturer-data {
        display: flex;
        align-items: center;
        gap: 8px;

        .data-label {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }

        .data-hex {
          font-family: monospace;
          font-size: 12px;
          background: #e9ecef;
          padding: 2px 6px;
          border-radius: 3px;
        }
      }
    }

    .service-list {
      .service-item {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        background: #f8f9fa;
        border-radius: 6px;
        margin-bottom: 6px;

        .service-index {
          font-weight: 600;
          color: var(--el-text-color-secondary);
          margin-right: 8px;
          min-width: 20px;
        }

        .service-uuid {
          font-family: monospace;
          font-size: 12px;
          color: var(--el-color-primary);
          margin-right: 8px;
        }

        .service-name {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
    }

    .service-data-item {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 8px;

      .service-data-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        .service-uuid {
          font-family: monospace;
          font-size: 12px;
          color: var(--el-color-primary);
          margin-right: 8px;
        }

        .service-name {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }

      .service-data-content {
        display: flex;
        align-items: center;
        gap: 8px;

        .data-label {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }

        .data-hex {
          font-family: monospace;
          font-size: 12px;
          background: #e9ecef;
          padding: 2px 6px;
          border-radius: 3px;
        }
      }
    }

    .appearance-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      background: #f8f9fa;
      border-radius: 6px;

      .appearance-value {
        font-family: monospace;
        font-weight: 600;
        color: var(--el-color-primary);
      }

      .appearance-desc {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }

    .raw-data {
      .raw-data-content {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 6px;
        padding: 12px;
        font-family: monospace;
        font-size: 12px;
        line-height: 1.4;
        color: var(--el-text-color-primary);
        white-space: pre-wrap;
        word-break: break-all;
        max-height: 200px;
        overflow-y: auto;
      }
    }
  }
}
</style>
