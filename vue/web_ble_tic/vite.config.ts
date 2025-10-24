import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
export default defineConfig({
  plugins: [
    basicSsl(), // HTTPS 支持
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: [
        'vue', // 导入内置的所有api
        'vue-router',
        'pinia',
        {
          '@/api/index.ts': [['*', 'api']], // 导入指定文件下的api，并重命名
          '@/stores/index.ts': [['*', 'store']],
        },
      ],
      include: [/\.vue$/, /\.ts$/, /\.tsx$/], // 匹配的文件，也就是哪些后缀的文件需要自动引入
      dts: 'src/auto-import.d.ts',
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: './src/components.d.ts',
    }),
    // 按需定制主题配置
    ElementPlus({
      useSource: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    // css预处理器
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/assets/styles/mixin.scss" as *;
          @use "@/assets/styles/var.scss" as *;
          @use "@/assets/styles/theme/handle.scss" as *;
          @use "@/assets/styles/element-theme/theme.scss" as *;
        `,
      },
    },
  },
  server: {
    port: 8086,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    host: '0.0.0.0',
  },
})
