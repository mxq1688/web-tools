import { createI18n } from 'vue-i18n'
import en from '@/language/en'
import zh_CN from '@/language/zh-CN'
import zh_TN from '@/language/zh-TN'

import { useLangStore } from '@/stores/lang'

// const env = import.meta.env.VITE_ENV
// const language =
//   localStorage.getItem('language') || (env !== 'intl' ? 'ZH_CN' : 'EN') || navigator.language
const i18n = createI18n({
  legacy: false, // 默认设置false使用 composition API，不启用旧版的 API 兼容模式，是 vue-i18n v9 引入的，为了更好地与 Vue 3 的设计理念保持一致。使用 Composition API 可以提供更灵活的代码组织和更好的类型支持。
  // locale: language, // 当前使用的语言
  fallbackLocale: 'zh_CN', // 找不到对应的语言时，使用 fallbackLocale对应的语言
  messages: {
    zh_CN,
    zh_TN,
    en,
  },
})

export const useI18ns = (app: any) => {
  const langStore: any = useLangStore()
  console.log('useI18ns', langStore.localLang)
  i18n.global.locale.value = langStore.localLang
  app.use(i18n)
}

export default i18n
