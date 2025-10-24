import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useLangStore } from '@/stores/lang'
import { useI18n } from 'vue-i18n'
import i18n from '@/appUse/i18n'
export default () => {
  const userStore = useUserStore()
  const langStore = useLangStore()
  const { locale } = useI18n()
  const token: ComputedRef<string> = computed(() => userStore.token)

  const setLanguage = (val: any) => {
    console.log('setLanguage', val)

    locale.value = val
    // i18n.global.locale.value = val

    langStore.setLocalLang(val)
  }
  const isH5 = () => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|OperaMini/i.test(navigator.userAgent))
      return true
    return false
  }

  const isMobile = computed(() => {
    const userAgentInfo: any = navigator.userAgent
    const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
    return Agents.some((i) => userAgentInfo.includes(i))
  })

  return {
    token,
    isH5,
    isMobile,
    setLanguage,
  }
}
