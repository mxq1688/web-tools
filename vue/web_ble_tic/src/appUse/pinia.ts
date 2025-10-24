import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { myPiniaPlugin } from '@/stores/plugins'

const pinia = createPinia()
const persist = createPersistedState()
// persist全局配置
// const persist = createPersistedState({
//   storage: sessionStorage,
// })
pinia.use(persist)
pinia.use(myPiniaPlugin)

export const usePinia = (app: any) => {
  app.use(pinia)
}

export default pinia
