// 路由配置
const routes: any[] = [
  {
    path: '/',
    name: 'Home',
    redirect: '/serial-debug',
  },
  {
    path: '/serial-debug',
    name: 'SerialDebug',
    component: () => import('@/views/SerialDebug/index.vue'),
    meta: {
      title: 'Web Serial Debug - 串口调试工具',
    },
  },
]

export default routes
