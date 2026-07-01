import { createSSRApp } from 'vue'
import App from './App.vue'
import { requestInterceptor } from './http/interceptor'
import { routeInterceptor } from './router/interceptor'

import store from './store'
import '@/style/index.scss'
import 'virtual:uno.css'
import i18n from './locale/index'

// 导出全局 toast 实例，给 http.ts 导入使用,只声明，不初始化,App.vue 的 setup 内部初始
// 用const对象包裹，对象属性可修改，不会触发导入只读报错
export const globalStore = {
  $toast: null as ReturnType<typeof useToast> | null
}

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.use(routeInterceptor)
  app.use(requestInterceptor)
  app.use(i18n)

  return {
    app,
  }
}
