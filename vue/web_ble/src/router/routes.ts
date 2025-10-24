// 路由配置
const routes: any[] = [
  {
    path: '/',
    name: 'Home',
    redirect: '/ble-debug',
  },
  {
    path: '/serial-debug',
    name: 'SerialDebug',
    component: () => import('@/views/SerialDebug/index.vue'),
    meta: {
      title: 'Web Serial Debug - 串口调试工具',
    },
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
