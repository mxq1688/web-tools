import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface QuickSendItem {
  name: string
  content: string
  hex: boolean
}

export interface QuickSendGroup {
  name: string
  list: QuickSendItem[]
}

export const useQuickSendStore = defineStore(
  'quickSend',
  () => {
    // 快捷发送分组列表
    const groups = ref<QuickSendGroup[]>([
      {
        name: '录音笔',
        list: [
          { name: '读RTL8722固件版本', content: 'AT+FTEST=VERSION', hex: false },
          { name: '读nRF52810固件版本', content: 'AT+FTEST=BVERSION', hex: false },
          { name: '读当前USB模式', content: 'AT+FTEST=USBMS', hex: false },
          { name: '串口模式', content: 'AT+FTEST=USBMS,0', hex: false },
          { name: '一次性USB模式', content: 'AT+FTEST=USBMS,1', hex: false },
          { name: '永久U盘模式，拔出USB会重启', content: 'AT+FTEST=USBMS,2', hex: false },
          { name: '永久U盘模式，拔出USB不会重启，用于DFU升级', content: 'AT+FTEST=USBMS,3', hex: false },
          { name: '拆分固件包', content: 'AT+FTEST=DFU,SPLITE', hex: false },
          { name: '升级RTL8722固件', content: 'AT+FTEST=DFU,RTL', hex: false },
          { name: '升级nRF52810固件', content: 'AT+FTEST=DFU,BLE', hex: false },
          { name: 'RTL8722固件编译时间', content: 'AT+FTEST=FWBTIME', hex: false },
          { name: '重启', content: 'AT+FTEST=POWER,RESET', hex: false },
          { name: '读SN', content: 'AT+FTEST=SNR', hex: false },
          { name: '读SSN', content: 'AT+FTEST=SSNR', hex: false },
          { name: '格式化', content: 'AT+FTEST=FS,CLEAR', hex: false },
          { name: '按键测试', content: 'AT+FTEST=KEY,0', hex: false },
          { name: '切换BLE', content: 'AT+FTEST=SWITCH,BLE', hex: false },
          { name: '切换WIFI', content: 'AT+FTEST=SWITCH,WIFI', hex: false },
          { name: '写SN示例', content: 'AT+FTEST=SNW,5211234567890223', hex: false },
        ],
      },
      {
        name: '4G模块',
        list: [
         
        ],
      }
    ])

    // 当前选中的分组索引
    const currentGroupIndex = ref(0)

    // 获取当前分组
    const currentGroup = () => {
      return groups.value[currentGroupIndex.value]
    }

    // 添加分组
    const addGroup = (name: string) => {
      groups.value.push({
        name,
        list: [],
      })
    }

    // 重命名分组
    const renameGroup = (index: number, name: string) => {
      if (groups.value[index]) {
        groups.value[index].name = name
      }
    }

    // 删除分组
    const removeGroup = (index: number) => {
      if (groups.value.length > 1) {
        groups.value.splice(index, 1)
        if (currentGroupIndex.value >= groups.value.length) {
          currentGroupIndex.value = groups.value.length - 1
        }
      }
    }

    // 添加快捷发送项
    const addItem = (groupIndex: number, item: QuickSendItem) => {
      if (groups.value[groupIndex]) {
        groups.value[groupIndex].list.push(item)
      }
    }

    // 更新快捷发送项
    const updateItem = (groupIndex: number, itemIndex: number, item: Partial<QuickSendItem>) => {
      if (groups.value[groupIndex]?.list[itemIndex]) {
        groups.value[groupIndex].list[itemIndex] = {
          ...groups.value[groupIndex].list[itemIndex],
          ...item,
        }
      }
    }

    // 删除快捷发送项
    const removeItem = (groupIndex: number, itemIndex: number) => {
      if (groups.value[groupIndex]) {
        groups.value[groupIndex].list.splice(itemIndex, 1)
      }
    }

    // 导出当前分组
    const exportGroup = (groupIndex: number) => {
      return groups.value[groupIndex]?.list || []
    }

    // 导入到当前分组
    const importToGroup = (groupIndex: number, items: QuickSendItem[]) => {
      if (groups.value[groupIndex]) {
        groups.value[groupIndex].list.push(...items)
      }
    }

    return {
      groups,
      currentGroupIndex,
      currentGroup,
      addGroup,
      renameGroup,
      removeGroup,
      addItem,
      updateItem,
      removeItem,
      exportGroup,
      importToGroup,
    }
  },
  {
    persist: {
      key: 'quick-send-list',
      storage: localStorage,
      paths: ['groups', 'currentGroupIndex'],
    },
  },
)

