<template>
  <!-- 页面独立弹窗容器，解决useToast上下文丢失 -->
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
      <wd-button v-if="tokenStore.hasLogin" type="danger" block size="large" @click="handleLogout">
        {{ $t("mine.logout") }}
      </wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { t } from '@/locale'
import { LOGIN_PAGE } from '@/router/config'
import { useTokenStore } from '@/store/token'

// 页面内同步初始化toast，绑定当前页面wd-toast，彻底规避undefined报错
const toast = useToast()
const tokenStore = useTokenStore()

definePage({
  style: {
    navigationBarTitleText: '账号安全设置',
  },
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
    title: t('msg.toast_title'),
    content: t('mine.logout_confirm'),
    success: (res) => {
      if (res.confirm) {
        useTokenStore().logout()
        // 执行退出登录逻辑
        toast.success(t('mine.logout_success'))
        uni.navigateTo({ url: LOGIN_PAGE })
      }
    },
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
