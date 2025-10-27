// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///Users/meng/stu/web-tools/vue/web_ble/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/meng/stu/web-tools/vue/web_ble/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///Users/meng/stu/web-tools/vue/web_ble/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import AutoImport from "file:///Users/meng/stu/web-tools/vue/web_ble/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///Users/meng/stu/web-tools/vue/web_ble/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///Users/meng/stu/web-tools/vue/web_ble/node_modules/unplugin-vue-components/dist/resolvers.js";
import ElementPlus from "file:///Users/meng/stu/web-tools/vue/web_ble/node_modules/unplugin-element-plus/dist/vite.mjs";
import basicSsl from "file:///Users/meng/stu/web-tools/vue/web_ble/node_modules/@vitejs/plugin-basic-ssl/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///Users/meng/stu/web-tools/vue/web_ble/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    basicSsl(),
    // HTTPS 支持
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: [
        "vue",
        // 导入内置的所有api
        "vue-router",
        "pinia",
        {
          "@/api/index.ts": [["*", "api"]],
          // 导入指定文件下的api，并重命名
          "@/stores/index.ts": [["*", "store"]]
        }
      ],
      include: [/\.vue$/, /\.ts$/, /\.tsx$/],
      // 匹配的文件，也就是哪些后缀的文件需要自动引入
      dts: "src/auto-import.d.ts"
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: "./src/components.d.ts"
    }),
    // 按需定制主题配置
    ElementPlus({
      useSource: true
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
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
        `
      }
    }
  },
  server: {
    port: 8086,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    host: "0.0.0.0"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWVuZy9zdHUvd2ViLXRvb2xzL3Z1ZS93ZWJfYmxlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbWVuZy9zdHUvd2ViLXRvb2xzL3Z1ZS93ZWJfYmxlL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tZW5nL3N0dS93ZWItdG9vbHMvdnVlL3dlYl9ibGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcblxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xuaW1wb3J0IEVsZW1lbnRQbHVzIGZyb20gJ3VucGx1Z2luLWVsZW1lbnQtcGx1cy92aXRlJ1xuaW1wb3J0IGJhc2ljU3NsIGZyb20gJ0B2aXRlanMvcGx1Z2luLWJhc2ljLXNzbCdcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICBiYXNpY1NzbCgpLCAvLyBIVFRQUyBcdTY1MkZcdTYzMDFcbiAgICB2dWUoKSxcbiAgICB2dWVKc3goKSxcbiAgICBBdXRvSW1wb3J0KHtcbiAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0sXG4gICAgICBpbXBvcnRzOiBbXG4gICAgICAgICd2dWUnLCAvLyBcdTVCRkNcdTUxNjVcdTUxODVcdTdGNkVcdTc2ODRcdTYyNDBcdTY3MDlhcGlcbiAgICAgICAgJ3Z1ZS1yb3V0ZXInLFxuICAgICAgICAncGluaWEnLFxuICAgICAgICB7XG4gICAgICAgICAgJ0AvYXBpL2luZGV4LnRzJzogW1snKicsICdhcGknXV0sIC8vIFx1NUJGQ1x1NTE2NVx1NjMwN1x1NUI5QVx1NjU4N1x1NEVGNlx1NEUwQlx1NzY4NGFwaVx1RkYwQ1x1NUU3Nlx1OTFDRFx1NTQ3RFx1NTQwRFxuICAgICAgICAgICdAL3N0b3Jlcy9pbmRleC50cyc6IFtbJyonLCAnc3RvcmUnXV0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgaW5jbHVkZTogWy9cXC52dWUkLywgL1xcLnRzJC8sIC9cXC50c3gkL10sIC8vIFx1NTMzOVx1OTE0RFx1NzY4NFx1NjU4N1x1NEVGNlx1RkYwQ1x1NEU1Rlx1NUMzMVx1NjYyRlx1NTRFQVx1NEU5Qlx1NTQwRVx1N0YwMFx1NzY4NFx1NjU4N1x1NEVGNlx1OTcwMFx1ODk4MVx1ODFFQVx1NTJBOFx1NUYxNVx1NTE2NVxuICAgICAgZHRzOiAnc3JjL2F1dG8taW1wb3J0LmQudHMnLFxuICAgIH0pLFxuICAgIENvbXBvbmVudHMoe1xuICAgICAgcmVzb2x2ZXJzOiBbRWxlbWVudFBsdXNSZXNvbHZlcigpXSxcbiAgICAgIGR0czogJy4vc3JjL2NvbXBvbmVudHMuZC50cycsXG4gICAgfSksXG4gICAgLy8gXHU2MzA5XHU5NzAwXHU1QjlBXHU1MjM2XHU0RTNCXHU5ODk4XHU5MTREXHU3RjZFXG4gICAgRWxlbWVudFBsdXMoe1xuICAgICAgdXNlU291cmNlOiB0cnVlLFxuICAgIH0pLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgIH0sXG4gIH0sXG4gIGNzczoge1xuICAgIC8vIGNzc1x1OTg4NFx1NTkwNFx1NzQwNlx1NTY2OFxuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgIHNjc3M6IHtcbiAgICAgICAgYWRkaXRpb25hbERhdGE6IGBcbiAgICAgICAgICBAdXNlIFwiQC9hc3NldHMvc3R5bGVzL21peGluLnNjc3NcIiBhcyAqO1xuICAgICAgICAgIEB1c2UgXCJAL2Fzc2V0cy9zdHlsZXMvdmFyLnNjc3NcIiBhcyAqO1xuICAgICAgICAgIEB1c2UgXCJAL2Fzc2V0cy9zdHlsZXMvdGhlbWUvaGFuZGxlLnNjc3NcIiBhcyAqO1xuICAgICAgICAgIEB1c2UgXCJAL2Fzc2V0cy9zdHlsZXMvZWxlbWVudC10aGVtZS90aGVtZS5zY3NzXCIgYXMgKjtcbiAgICAgICAgYCxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogODA4NixcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuICAgIH0sXG4gICAgaG9zdDogJzAuMC4wLjAnLFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVMsU0FBUyxlQUFlLFdBQVc7QUFFcFUsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLDJCQUEyQjtBQUNwQyxPQUFPLGlCQUFpQjtBQUN4QixPQUFPLGNBQWM7QUFUNkosSUFBTSwyQ0FBMkM7QUFVbk8sSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsU0FBUztBQUFBO0FBQUEsSUFDVCxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxXQUFXO0FBQUEsTUFDVCxXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxNQUNqQyxTQUFTO0FBQUEsUUFDUDtBQUFBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsVUFDRSxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDO0FBQUE7QUFBQSxVQUMvQixxQkFBcUIsQ0FBQyxDQUFDLEtBQUssT0FBTyxDQUFDO0FBQUEsUUFDdEM7QUFBQSxNQUNGO0FBQUEsTUFDQSxTQUFTLENBQUMsVUFBVSxTQUFTLFFBQVE7QUFBQTtBQUFBLE1BQ3JDLEtBQUs7QUFBQSxJQUNQLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNULFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQztBQUFBLE1BQ2pDLEtBQUs7QUFBQSxJQUNQLENBQUM7QUFBQTtBQUFBLElBRUQsWUFBWTtBQUFBLE1BQ1YsV0FBVztBQUFBLElBQ2IsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQUEsRUFDQSxLQUFLO0FBQUE7QUFBQSxJQUVILHFCQUFxQjtBQUFBLE1BQ25CLE1BQU07QUFBQSxRQUNKLGdCQUFnQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQU1sQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixTQUFTO0FBQUEsTUFDUCwrQkFBK0I7QUFBQSxJQUNqQztBQUFBLElBQ0EsTUFBTTtBQUFBLEVBQ1I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
