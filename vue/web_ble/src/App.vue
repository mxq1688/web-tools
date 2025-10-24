<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useLangStore } from '@/stores/lang'
import { useUserStore } from '@/stores/user'
import userHooks from './hooks/userHooks'
const userStore = useUserStore()

const { setLanguage } = userHooks()

const defaultTheme = userStore.curTheme
if (defaultTheme) {
  userStore.curTheme = defaultTheme
  document.documentElement.setAttribute('data-theme', userStore.curTheme)
}

//换肤
const setTheme = (key: any) => {
  key = !key ? 'light' : key
  document.documentElement.setAttribute('data-theme', key)
  userStore.curTheme = key
}

//语言
const langStore = useLangStore()
const { localLang, elLang } = storeToRefs(langStore)

const doscordLogin = () => {
  // doscord 1321362398296150057 5QNuq-uQF0S0jqFo1FgjEdxAJVOE813A
  const redirect_uri = encodeURIComponent(`http://localhost:8086/`)
  const url = `https://discord.com/oauth2/authorize?client_id=1321362398296150057&response_type=code&redirect_uri=${redirect_uri}&scope=identify`
  window.open(url, '_self')
}

// Sign in with Apple
const appleLogin = () => {
  // doscord 1321362398296150057 5QNuq-uQF0S0jqFo1FgjEdxAJVOE813A
  const redirect_uri = encodeURIComponent(`http://localhost:8086/`)
  const client_id = ''
  const url = `https://appleid.apple.com/auth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=name%20email`
  window.open(url, '_self')
}

// facebookLogin() {
//       const redirect_uri = encodeURIComponent(`${this.$configs.siteFacebook}/bindEmail?codeType=5`)
//       const url = `https://www.facebook.com/v14.0/dialog/oauth?client_id=710776999993575&redirect_uri=${redirect_uri}&state=&response_type=code`
//       window.open(url, '_self')
//     }
// googleLogin() {
//   const redirect_uri = encodeURIComponent(`${this.$configs.siteGoogle}/bindEmail?codeType=6`)
//   const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=xxx&scope=openid%20email&redirect_uri=${redirect_uri}&state=`
//   window.open(url, '_self')
// }
</script>

<template>
  <el-config-provider :locale="elLang">
    <!-- <el-button @click="setTheme('')">默认皮肤</el-button>
    <el-button @click="setTheme('dark')">换黑</el-button>
    <el-button type="primary">Primary</el-button>
    <div class="aaa">{{ $t('index.title') }}</div>

    <el-button @click="setLanguage('zh_CN')">默认中文</el-button>
    <el-button @click="setLanguage('en')">英文</el-button> -->

    <RouterView />
  </el-config-provider>
</template>

<style lang="scss" scoped>
.aaa {
  // background_color对应handle.scss 文件中的属性，'bg-color' 对应theme.scss中的属性
  @include background_color('bg-color');
  @include font_color('font-color');
}

@media (min-width: 1024px) {
}
</style>
