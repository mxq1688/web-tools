<template>
  <header
    v-if="showHeader"
    class="bd-header bg-dark py-3 d-flex align-items-stretch border-bottom border-dark"
  >
    <div class="container-fluid d-flex align-items-center">
      <h1 class="d-flex align-items-center fs-4 text-white mb-0">Web Serial Debug</h1>
      <span class="ms-auto">
        <span class="link-light">代码已开源:</span>
        <a
          href="https://github.com/mxq1688/web-tools/tree/main/vue/web_serial"
          target="_blank"
          class="link-light ms-2"
          >Github</a
        >
        <a href="javascript:void(0)" class="link-light ms-3" @click="hideHeader">隐藏头部</a>
      </span>
    </div>
  </header>
</template>

<script setup lang="ts">
const showHeader = ref(true)

const hideHeader = () => {
  showHeader.value = false
  // 更新 CSS 变量
  document.documentElement.style.setProperty('--top-height', '0px')
}

onMounted(() => {
  // 设置初始高度
  if (showHeader.value) {
    document.documentElement.style.setProperty('--top-height', '63px')
  }
})
</script>

<style scoped>
.bd-header {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.link-light {
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
}

.link-light:hover {
  color: #fff;
  text-decoration: underline;
}
</style>

