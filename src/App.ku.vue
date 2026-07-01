<script setup lang="ts">
import { getCurrentInstance, ref } from 'vue'
import FgTabbar from '@/tabbar/index.vue'
import { isPageTabbar } from './tabbar/store'
import { currRoute } from './utils'
// 导入包裹对象，不再直接导入$toast
import { globalStore } from '@/main'

const toastIns = useToast()
// 修改对象内部属性，合法
globalStore.$toast = toastIns
const instance = getCurrentInstance()
if (instance) {
  instance.appContext.config.globalProperties.$toast = toastIns
}

const isCurrentPageTabbar = ref(true)
onShow(() => {
  const { path } = currRoute()
  // “蜡笔小开心”提到本地是 '/pages/index/index'，线上是 '/' 导致线上 tabbar 不见了
  // 所以这里需要判断一下，如果是 '/' 就当做首页，也要显示 tabbar
  if (path === '/') {
    isCurrentPageTabbar.value = true
  }
  else {
    isCurrentPageTabbar.value = isPageTabbar(path)
  }
})

const helloKuRoot = ref('Hello AppKuVue')

const exposeRef = ref('this is form app.Ku.vue')

defineExpose({
  exposeRef,
})
</script>

<template>
  <view>
    <!-- 全局仅放一次 wd-toast，所有页面共用，不用每页写 -->
    <wd-toast />
    <!-- 这个先隐藏了，知道这样用就行 -->
    <view class="hidden text-center">
      {{ helloKuRoot }}，这里可以配置全局的东西
    </view>

    <KuRootView />

    <FgTabbar v-if="isCurrentPageTabbar" />
  </view>
</template>
