import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import zhCn from 'element-plus/es/locale/lang/zh-cn.mjs'
import en from 'element-plus/es/locale/lang/en.mjs'
export const useLangStore = defineStore(
  'lang',
  () => {
    const localLang = ref(navigator.language)
    function setLocalLang(val: string) {
      localLang.value = val
      localStorage.setItem('language', val)
    }
    const elLang = computed(() => {
      if (localLang.value == 'en') {
        return en
      }
      return zhCn
    })
    return { localLang, elLang, setLocalLang }
  },
  {
    persist: true,
  },
)
