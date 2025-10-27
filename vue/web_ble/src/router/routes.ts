// 路由配置
const routes: any[] = [
  {
    path: '/',
    name: 'Home',
    redirect: '/ble-debug',
  },
  {
    path: '/ble-debug',
    name: 'BleDebug',
    component: () => import('@/views/BleDebug/index.vue'),
    meta: {
      title: 'Web Bluetooth Debug - 蓝牙调试工具',
    },
  },
]

export default routes