import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const isLogin = computed(() => token.value)
    function setToken(res: string) {
      token.value = res
    }

    const curTheme = ref('')

    return { token, isLogin, setToken, curTheme }
  },
  {
    persist: true, //启用数据持久化
    // persist: {
    //   key: 'my-app-token', // 自定义存储键名
    //   storage: 'localStorage',
    //   paths: ['token'],    // 仅持久化 token 字段
    //   debug: true,
    // },
  },
)
