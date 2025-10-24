import * as directives from '@/directive/index'
import Validator from '@/utils/validator'
import api from '@/api/index.js'
import Bus from '@/utils/eventBus'
// import env from '@/env'
export default (app: any) => {
  // for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  //   app.component(key, component)
  // }

  app.config.globalProperties.$Validator = Validator
  app.config.globalProperties.$api = api
  app.config.globalProperties.$bus = new Bus()
  // app.config.globalProperties.$env = env

  const directivesCopy: any = directives
  Object.keys(directivesCopy).forEach((vo) => {
    app.directive(vo, directivesCopy[vo])
  })
}
