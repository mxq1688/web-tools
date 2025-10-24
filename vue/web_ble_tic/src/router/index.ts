import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { getQueryParam } from '@/utils'
import { useLangStore } from '@/stores/lang'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
  // scrollBehavior(to: any, from: any, savedPosition: any) {
  //   return { top: 0 }
  // },
})

const dellPromot = () => {
  // 从 url 中获取 promottype(推广渠道 code) && promotsource(渠道来源)
  const promottype = getQueryParam('promottype')
  const promotSource = getQueryParam('promotsource')
  // store.commit('userInfo/setPromot', { promottype, promotSource })
}

router.beforeEach(async (to: any, from: any, next: any) => {
  const langStore = useLangStore()
  const userStore = useUserStore()
  console.log('消费Store', langStore, userStore)

  dellPromot()
  // const { config, userInfo }: any = store.state

  // if (to.meta.auth) {
  //   if (!userInfo.token) {
  //     store.commit('userInfo/setOpenLoginPanel', true)
  //     next('/')
  //     return
  //   }
  // }

  // if (userInfo.token) {
  //   if (
  //     userInfo.userInfo &&
  //     userInfo.userInfo.unlocked == 0 &&
  //     to.path != '/applyuse' &&
  //     to.path != '/'
  //   ) {
  //     store.commit('userInfo/setOpenAuthPanel', true)
  //     next('/')
  //     return
  //   }
  //   // 获取用户信息
  //   await store.dispatch('userInfo/getUserInfo')
  // }

  next()
})

export const useRouter = (app: any) => {
  app.use(router)
}

export default router
