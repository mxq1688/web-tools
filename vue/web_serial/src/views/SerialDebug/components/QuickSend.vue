<template>
  <div>
    <!-- 分组选择工具栏 -->
    <div class="btn-toolbar mb-2">
      <div class="flex-grow-1 input-group input-group-sm me-2">
        <span class="input-group-text">选择分组</span>
        <select v-model.number="quickSendStore.currentGroupIndex" class="form-select">
          <option v-for="(group, index) in quickSendStore.groups" :key="index" :value="index">
            {{ group.name }}
          </option>
        </select>
      </div>

      <div class="btn-group">
        <button class="btn btn-sm btn-outline-secondary" @click="addGroup">新增</button>
        <button class="btn btn-sm btn-outline-secondary" @click="renameGroup">改名</button>
        <button class="btn btn-sm btn-outline-secondary" @click="removeGroup">删除</button>
      </div>
    </div>

    <!-- 导入导出按钮 -->
    <div class="d-flex mt-2 mb-2">
      <button class="btn btn-sm btn-outline-secondary me-5" @click="addItem">
        <i class="bi bi-plus-square"></i> 增加一条
      </button>
      <button class="btn btn-sm btn-outline-secondary me-2 flex-grow-1" @click="triggerImport">
        <i class="bi bi-folder-plus"></i> 导入
      </button>
      <input ref="importInput" type="file" style="display: none" accept="application/json" @change="importItems" />
      <button class="btn btn-sm btn-outline-secondary flex-grow-1" @click="exportItems">
        <i class="bi bi-folder-symlink"></i> 导出
      </button>
    </div>

    <!-- 列表标题 -->
    <div class="mt-2">
      <div class="d-flex">
        <span class="me-2 ms-3">移除</span>
        <span class="flex-grow-1 me-1">发送内容，点击修改，双击改名</span>
        <span class="flex-shrink-0 me-3">显示名称</span>
        <span class="flex-shrink-0 me-2">HEX</span>
      </div>
    </div>

    <!-- 快捷发送列表 -->
    <div class="flex-grow-1 border border-2 p-2 rounded overflow-auto" style="max-height: calc(100vh - 300px)">
      <div v-for="(item, index) in currentGroup?.list" :key="index" class="d-flex p-1 border-bottom quick-item">
        <!-- 删除按钮 -->
        <button
          type="button"
          title="移除该项"
          class="btn btn-sm btn-outline-secondary me-1"
          @click="removeItem(index)"
        >
          <i class="bi bi-x"></i>
        </button>

        <!-- 发送内容输入框 -->
        <input
          v-model="item.content"
          class="form-control form-control-sm me-1"
          placeholder="要发送的内容"
          @dblclick="renameItem(index)"
        />

        <!-- 发送按钮 -->
        <button
          class="flex-shrink-0 me-1 align-self-center btn btn-secondary btn-sm"
          :title="item.name"
          @click="sendItem(item)"
        >
          {{ item.name }}
        </button>

        <!-- HEX 复选框 -->
        <input v-model="item.hex" class="form-check-input flex-shrink-0 align-self-center" type="checkbox" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuickSendStore, type QuickSendItem } from '@/stores/quickSend'
import { serialManager } from '@/utils/serial'
import { hexToUint8Array, textToUint8Array, saveJSON } from '@/utils/serial/converter'

const quickSendStore = useQuickSendStore()
const importInput = ref<HTMLInputElement>()

// 当前分组
const currentGroup = computed(() => quickSendStore.currentGroup())

// 添加分组
const addGroup = async () => {
  try {
    const { value: name } = await ElMessageBox.prompt('请输入分组名称', '新增分组', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /.+/,
      inputErrorMessage: '分组名称不能为空',
    })
    if (name) {
      quickSendStore.addGroup(name)
      ElMessage.success('添加成功')
    }
  } catch (e) {
    // 用户取消
  }
}

// 重命名分组
const renameGroup = async () => {
  try {
    const currentName = currentGroup.value?.name || ''
    const { value: name } = await ElMessageBox.prompt('请输入新的分组名称', '重命名分组', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValue: currentName,
      inputPattern: /.+/,
      inputErrorMessage: '分组名称不能为空',
    })
    if (name) {
      quickSendStore.renameGroup(quickSendStore.currentGroupIndex, name)
      ElMessage.success('重命名成功')
    }
  } catch (e) {
    // 用户取消
  }
}

// 删除分组
const removeGroup = async () => {
  if (quickSendStore.groups.length === 1) {
    ElMessage.warning('至少保留一个分组')
    return
  }

  try {
    await ElMessageBox.confirm('确定要删除该分组吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    quickSendStore.removeGroup(quickSendStore.currentGroupIndex)
    ElMessage.success('删除成功')
  } catch (e) {
    // 用户取消
  }
}

// 添加快捷发送项
const addItem = () => {
  quickSendStore.addItem(quickSendStore.currentGroupIndex, {
    name: '发送',
    content: '',
    hex: false,
  })
}

// 删除快捷发送项
const removeItem = (index: number) => {
  quickSendStore.removeItem(quickSendStore.currentGroupIndex, index)
}

// 重命名快捷发送项
const renameItem = async (index: number) => {
  const item = currentGroup.value?.list[index]
  if (!item) return

  try {
    const { value: name } = await ElMessageBox.prompt('请输入新的名称', '重命名', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValue: item.name,
      inputPattern: /.+/,
      inputErrorMessage: '名称不能为空',
    })
    if (name) {
      quickSendStore.updateItem(quickSendStore.currentGroupIndex, index, { name })
      ElMessage.success('重命名成功')
    }
  } catch (e) {
    // 用户取消
  }
}

// 发送快捷项
const sendItem = async (item: QuickSendItem) => {
  if (!item.content) {
    ElMessage.warning('发送内容为空')
    return
  }

  let data: Uint8Array | null = null

  if (item.hex) {
    data = hexToUint8Array(item.content)
    if (!data) {
      ElMessage.error('HEX格式错误')
      return
    }
  } else {
    data = textToUint8Array(item.content)
  }

  const success = await serialManager.write(data)
  if (!success) {
    ElMessage.error('发送失败，请确认串口已打开')
  }
}

// 触发导入
const triggerImport = () => {
  importInput.value?.click()
}

// 导入快捷项
const importItems = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = e.target?.result as string
      const items = JSON.parse(data) as QuickSendItem[]
      quickSendStore.importToGroup(quickSendStore.currentGroupIndex, items)
      ElMessage.success('导入成功')
    } catch (error) {
      ElMessage.error('导入失败：文件格式错误')
    }
  }
  reader.readAsText(file)

  // 清空文件选择
  target.value = ''
}

// 导出快捷项
const exportItems = () => {
  const items = quickSendStore.exportGroup(quickSendStore.currentGroupIndex)
  const groupName = currentGroup.value?.name || 'default'
  saveJSON(items, `${groupName}.json`)
  ElMessage.success('导出成功')
}
</script>

<style scoped>
.quick-item {
  transition: background-color 0.2s;
}

.quick-item:hover {
  background-color: #f8f9fa;
}
</style>

