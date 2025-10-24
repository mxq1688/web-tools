<template>
  <div class="d-flex flex-column h-100">
    <!-- 代码编辑区域 -->
    <div ref="editorContainer" class="editor-container flex-grow-1 mb-2">
      <textarea ref="codeEditor" placeholder="在此输入要执行的代码脚本"></textarea>
    </div>

    <!-- 操作按钮 -->
    <div class="mt-2">
      <input ref="fileInput" type="file" class="d-none" accept=".js,.txt" @change="loadFile" />
      <button class="btn btn-sm btn-outline-secondary me-2" @click="openFile">
        <i class="bi bi-folder2-open"></i> 打开文件
      </button>
      <button
        class="btn btn-sm float-end"
        :class="isRunning ? 'btn-danger' : 'btn-primary'"
        @click="toggleScript"
      >
        <i :class="isRunning ? 'bi bi-stop' : 'bi bi-play'"></i>
        {{ isRunning ? '停止' : '运行' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { serialManager } from '@/utils/serial'
import { hexToUint8Array, textToUint8Array } from '@/utils/serial/converter'
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/addon/selection/active-line.js'
import 'codemirror/addon/edit/matchbrackets.js'

const defaultCode = `addEventListener('message', function ({data}) {
  if(data.type=='uart_receive') {
    postMessage({type:'log', data:'消息长度:'+data.data.length});
    // 原文答复
    postMessage({type:'uart_send', data:data.data});
  }
})

// 定时发送示例
// setInterval(function(){
//   postMessage({type:'uart_send_txt', data:'hello world'});
// }, 1000);`

const codeEditor = ref<HTMLTextAreaElement>()
const editorContainer = ref<HTMLDivElement>()
const fileInput = ref<HTMLInputElement>()
const isRunning = ref(false)

let editor: CodeMirror.EditorFromTextArea | null = null
let worker: Worker | null = null

// 运行/停止脚本
const toggleScript = () => {
  if (isRunning.value) {
    stopScript()
  } else {
    runScript()
  }
}

// 运行脚本
const runScript = () => {
  if (!editor) return

  const code = editor.getValue()
  if (!code.trim()) {
    ElMessage.warning('脚本内容为空')
    return
  }

  try {
    // 设置编辑器为只读模式
    editor.setOption('readOnly', 'nocursor' as any)
    editor.getWrapperElement().classList.add('CodeMirror-readonly')

    // 保存脚本
    localStorage.setItem('serial-code', code)

    // 创建 Worker
    const blob = new Blob([code], { type: 'text/javascript' })
    worker = new Worker(URL.createObjectURL(blob))

    // 监听 Worker 消息
    worker.onmessage = (e) => {
      handleWorkerMessage(e.data)
    }

    // 监听错误
    worker.onerror = (error) => {
      ElMessage.error('脚本执行错误: ' + error.message)
      stopScript()
    }

    isRunning.value = true
    ElMessage.success('脚本已启动')
  } catch (error: any) {
    ElMessage.error('启动脚本失败: ' + error.message)
  }
}

// 停止脚本
const stopScript = () => {
  if (worker) {
    worker.terminate()
    worker = null
  }

  // 恢复编辑器可编辑
  if (editor) {
    editor.setOption('readOnly', false)
    editor.getWrapperElement().classList.remove('CodeMirror-readonly')
  }

  isRunning.value = false
  ElMessage.info('脚本已停止')
}

// 处理 Worker 消息
const handleWorkerMessage = async (message: any) => {
  switch (message.type) {
    case 'uart_send':
      // 发送字节数据
      await serialManager.write(new Uint8Array(message.data))
      break

    case 'uart_send_txt':
      // 发送文本
      await serialManager.write(textToUint8Array(message.data))
      break

    case 'uart_send_hex':
      // 发送 HEX
      const data = hexToUint8Array(message.data)
      if (data) {
        await serialManager.write(data)
      } else {
        console.error('HEX格式错误:', message.data)
      }
      break

    case 'log':
      // 打印日志
      console.log('[Worker]', message.data)
      ElMessage.info(message.data)
      break

    default:
      console.warn('未知的消息类型:', message.type)
  }
}

// 保存原始的数据接收回调
let originalDataCallback: ((data: Uint8Array) => void) | null = null

// 数据接收回调（转发给 Worker）
const handleDataReceived = (data: Uint8Array) => {
  // 先调用原始回调（用于正常的日志显示）
  if (originalDataCallback) {
    originalDataCallback(data)
  }

  // 如果脚本正在运行，转发给 Worker
  if (isRunning.value && worker) {
    worker.postMessage({
      type: 'uart_receive',
      data: Array.from(data), // Worker 不能直接传递 Uint8Array
    })
  }
}

// 打开文件
const openFile = () => {
  fileInput.value?.click()
}

// 加载文件
const loadFile = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    if (editor) {
      editor.setValue(content)
    }
    ElMessage.success('文件加载成功')
  }
  reader.readAsText(file)

  // 清空文件选择
  target.value = ''
}

onMounted(() => {
  // 使用 setTimeout 确保 DOM 完全渲染
  setTimeout(() => {
    // 初始化 CodeMirror 编辑器
    if (codeEditor.value) {
      try {
        editor = CodeMirror.fromTextArea(codeEditor.value, {
          lineNumbers: true, // 显示行号
          indentUnit: 4, // 缩进单位为4
          styleActiveLine: true, // 当前行背景高亮
          matchBrackets: true, // 括号匹配
          mode: 'javascript', // JavaScript 语法高亮
          theme: 'default',
          tabSize: 2,
          lineWrapping: true, // 自动换行
        })

        // 加载保存的脚本
        const saved = localStorage.getItem('serial-code')
        if (saved) {
          editor.setValue(saved)
        } else {
          editor.setValue(defaultCode)
        }

        // 监听内容变化，自动保存
        editor.on('change', () => {
          if (editor && !isRunning.value) {
            localStorage.setItem('serial-code', editor.getValue())
          }
        })

        // 确保编辑器可编辑
        editor.setOption('readOnly', false)

        // 刷新编辑器（确保正确显示）
        setTimeout(() => {
          editor?.refresh()
          console.log('CodeMirror 编辑器初始化成功，可编辑状态:', !editor?.getOption('readOnly'))
          console.log('编辑器元素:', editor?.getWrapperElement())
        }, 50)
      } catch (error) {
        console.error('CodeMirror 初始化失败:', error)
      }
    } else {
      console.error('未找到 textarea 元素')
    }
  }, 100)

  // 保存原始的数据接收回调
  originalDataCallback = (serialManager as any).onDataReceived

  // 注册新的数据接收回调（包装原始回调）
  serialManager.setOnDataReceived(handleDataReceived)
})

onUnmounted(() => {
  // 停止脚本
  if (isRunning.value) {
    stopScript()
  }
})
</script>

<style scoped>
/* 编辑器容器 */
.editor-container {
  overflow: hidden;
}

/* CodeMirror 编辑器样式 */
.editor-container :deep(.CodeMirror) {
  height: 100%;
}

:deep(.CodeMirror-readonly) {
  background-color: var(--bs-light-rgb);
  cursor: not-allowed;
}
</style>

