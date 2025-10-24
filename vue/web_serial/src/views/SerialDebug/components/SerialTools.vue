<template>
  <div id="serial-tools" class="col-auto m-0 bg-light sidebar">
    <!-- 折叠按钮 -->
    <button class="toggle-button float-start" title="隐藏/打开边栏" @click="toggleSidebar">
      <i class="bi bi-chevron-compact-right"></i>
    </button>

    <div class="collapse show p-1 float-start overflow-hidden" style="width: 428px">
      <!-- Tab 导航 -->
      <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <button
            class="nav-link active"
            id="nav-quick-send-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-quick-send"
            type="button"
            role="tab"
            aria-controls="nav-quick-send"
            aria-selected="true"
          >
            快捷发送
          </button>
          <button
            class="nav-link"
            id="nav-options-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-options"
            type="button"
            role="tab"
            aria-controls="nav-options"
            aria-selected="false"
          >
            系统选项
          </button>
          <button
            class="nav-link"
            id="nav-code-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-code"
            type="button"
            role="tab"
            aria-controls="nav-code"
            aria-selected="false"
          >
            代码脚本
          </button>
        </div>
      </nav>

      <!-- Tab 内容 -->
      <div class="tab-content pt-2 flex-fill" id="nav-tabContent">
        <!-- 快捷发送 -->
        <div class="tab-pane fade show active" id="nav-quick-send" role="tabpanel" aria-labelledby="nav-quick-send-tab">
          <QuickSend />
        </div>

        <!-- 系统选项 -->
        <div class="tab-pane fade" id="nav-options" role="tabpanel" aria-labelledby="nav-options-tab">
          <SystemOptions />
        </div>

        <!-- 代码脚本 -->
        <div class="tab-pane fade" id="nav-code" role="tabpanel" aria-labelledby="nav-code-tab">
          <CodeScript />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import QuickSend from './QuickSend.vue'
import SystemOptions from './SystemOptions.vue'
import CodeScript from './CodeScript.vue'

// 折叠侧边栏
const toggleSidebar = (e: Event) => {
  const button = e.currentTarget as HTMLElement
  const parent = button.parentElement
  const sidebar = parent?.querySelector('.collapse')
  const icon = button.querySelector('i')
  sidebar?.classList.toggle('show')
  icon?.classList.toggle('bi-chevron-compact-right')
  icon?.classList.toggle('bi-chevron-compact-left')
}
</script>

<style scoped>
/* 不要设置额外样式，让 col-auto 自动控制宽度 */
</style>

