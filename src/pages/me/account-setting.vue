<template>
  <!-- 页面独立弹窗容器，解决useToast上下文丢失 -->
  <wd-toast />
  <view class="page-account-setting">
    <!-- 安全设置分组 -->
    <wd-cell-group title="账号安全设置">
      <wd-cell title="修改登录密码" is-link @click="toChangePwd" />
      <wd-cell title="登录设备管理" is-link @click="toDeviceList" />
      <wd-cell title="绑定手机/邮箱" is-link @click="toBindInfo" />
    </wd-cell-group>

    <wd-cell-group title="安全策略">
      <wd-cell title="登录二次验证" is-link @click="toLoginVerify" />
    </wd-cell-group>

    <!-- 退出登录区域 -->
    <view class="logout-wrap">
      <wd-button type="error" block @click="handleLogout">退出当前账号</wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { t } from '@/locale'
import { useTokenStore } from '@/store/token'
import { useToast } from '@wot-ui/ui'

// 页面内同步初始化toast，绑定当前页面wd-toast，彻底规避undefined报错
const toast = useToast()
const tokenStore = useTokenStore()

definePage({
  navigationBarTitleText: '账号安全设置',
})

// 跳转：修改密码
function toChangePwd() {
  uni.navigateTo({ url: '/pages/me/pwd' })
}

// 跳转：登录设备管理
function toDeviceList() {
  toast.info('设备管理功能开发中')
}

// 跳转：绑定信息
function toBindInfo() {
  toast.info('绑定信息修改功能开发中')
}

// 跳转：登录二次验证
function toLoginVerify() {
  toast.info('登录验证功能开发中')
}

// 退出登录弹窗确认
function handleLogout() {
  uni.showModal({
    title: '安全提示',
    content: '退出后需要重新登录，确认退出当前账号？',
    confirmText: '确认退出',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        // 清除token、登录状态
        tokenStore.logout()
        toast.success('已安全退出账号')
        setTimeout(() => {
          uni.reLaunch({ url: '/pages/auth/login' })
        }, 1000)
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.page-account-setting {
  padding: 30rpx;
}
.logout-wrap {
  margin-top: 60rpx;
  padding: 0 20rpx;
}
</style>
