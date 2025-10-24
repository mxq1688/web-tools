<template>
  <div class="flex-shrink-0 mb-2">
    <!-- 发送内容输入框 -->
    <textarea
      v-model="sendContent"
      class="form-control"
      rows="3"
      style="resize: none"
      placeholder="在此输入要发送的内容，可以是字符串(如:你好,世界!)，也可以是HEX(如:49544C4447)"
    ></textarea>

    <!-- 发送选项和按钮 -->
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-1 pb-1 mb-1 flex-shrink-0"
    >
      <div class="btn-toolbar">
        <!-- 末尾加回车换行 -->
        <div class="form-check align-self-center me-2">
          <input v-model="addCRLF" class="form-check-input" type="checkbox" id="serial-add-crlf" />
          <label class="form-check-label" for="serial-add-crlf"> 末尾加回车换行 </label>
        </div>

        <!-- HEX发送 -->
        <div class="form-check align-self-center me-2">
          <input v-model="hexSend" class="form-check-input" type="checkbox" id="serial-hex-send" />
          <label class="form-check-label" for="serial-hex-send"> HEX发送 </label>
        </div>

        <!-- 循环发送 -->
        <div class="form-check align-self-center me-2">
          <input v-model="loopSend" class="form-check-input" type="checkbox" id="serial-loop-send" />
          <label class="form-check-label" for="serial-loop-send"> 循环发送 </label>
        </div>

        <!-- 发送间隔 -->
        <div class="input-group input-group-sm">
          <span class="input-group-text">发送间隔(MS)</span>
          <input
            v-model.number="loopSendTime"
            type="number"
            class="form-control"
            placeholder=""
            min="1"
            style="width: 100px"
          />
        </div>
      </div>

      <!-- 发送按钮 -->
      <button class="btn btn-primary h-10 px-5" @click="send">
        <i class="bi bi-send"></i> 发送
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSerialStore } from '@/stores/serial'
import { useSerialLogStore } from '@/stores/serialLog'
import { serialManager } from '@/utils/serial'
import { hexToUint8Array, textToUint8Array, uint8ArrayToHex, uint8ArrayToText, htmlEncode } from '@/utils/serial/converter'

const serialStore = useSerialStore()
const logStore = useSerialLogStore()

// 发送相关状态
const sendContent = ref('')
const addCRLF = ref(false)
const hexSend = ref(false)
const loopSend = ref(false)
const loopSendTime = ref(1000)

let loopSendTimer: any = null

// 发送数据
const send = async () => {
  if (!sendContent.value) {
    ElMessage.warning('发送内容为空')
    return
  }

  if (!serialStore.status.isOpen) {
    ElMessage.warning('请先打开串口')
    return
  }

  if (hexSend.value) {
    await sendHex(sendContent.value)
  } else {
    await sendText(sendContent.value)
  }
}

// 发送 HEX
const sendHex = async (hex: string) => {
  const data = hexToUint8Array(hex)
  if (data) {
    await writeData(data)
  } else {
    ElMessage.error('HEX格式错误: ' + hex)
  }
}

// 发送文本
const sendText = async (text: string) => {
  const data = textToUint8Array(text)
  await writeData(data)
}

// 写入数据
const writeData = async (data: Uint8Array) => {
  let finalData = data

  // 如果需要添加回车换行
  if (addCRLF.value) {
    finalData = new Uint8Array([...data, 0x0d, 0x0a])
  }

  const success = await serialManager.write(finalData)
  if (success) {
    // 添加发送日志
    const hex = uint8ArrayToHex(finalData)
    const text = htmlEncode(uint8ArrayToText(finalData))
    logStore.addLog('send', finalData, text, hex)
  } else {
    ElMessage.error('发送失败')
  }
}

// 重置循环发送定时器
const resetLoopSend = () => {
  if (loopSendTimer) {
    clearInterval(loopSendTimer)
    loopSendTimer = null
  }

  if (loopSend.value && loopSendTime.value > 0) {
    loopSendTimer = setInterval(() => {
      send()
    }, loopSendTime.value)
  }
}

// 监听循环发送和间隔变化
watch([loopSend, loopSendTime], () => {
  resetLoopSend()
})

onMounted(() => {
  // 从 localStorage 恢复配置
  const saved = localStorage.getItem('serial-send-config')
  if (saved) {
    try {
      const config = JSON.parse(saved)
      sendContent.value = config.sendContent || ''
      addCRLF.value = config.addCRLF || false
      hexSend.value = config.hexSend || false
      loopSend.value = config.loopSend || false
      loopSendTime.value = config.loopSendTime || 1000
    } catch (e) {
      console.error('加载发送配置失败', e)
    }
  }
})

onUnmounted(() => {
  // 保存配置
  localStorage.setItem(
    'serial-send-config',
    JSON.stringify({
      sendContent: sendContent.value,
      addCRLF: addCRLF.value,
      hexSend: hexSend.value,
      loopSend: loopSend.value,
      loopSendTime: loopSendTime.value,
    }),
  )

  // 清理定时器
  if (loopSendTimer) {
    clearInterval(loopSendTimer)
  }
})

// 暴露发送方法供外部调用
defineExpose({
  send,
  sendHex,
  sendText,
})
</script>

<style scoped>
.btn-toolbar {
  gap: 0.5rem;
}
</style>

