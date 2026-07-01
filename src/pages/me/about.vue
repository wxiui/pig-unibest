<template>
  <wd-toast />
  <view class="page-about">
    <!-- Logo区域 -->
    <view class="logo-wrap">
      <view class="logo-box"></view>
      <text class="app-name">管理系统</text>
      <text class="version">当前版本：V1.0.0</text>
    </view>

    <wd-cell-group title="关于我们">
      <wd-cell title="公司简介" is-link @click="toCompanyDesc" />
      <wd-cell title="用户协议" is-link @click="toUserAgree" />
      <wd-cell title="隐私政策" is-link @click="toPrivacy" />
    </wd-cell-group>

    <wd-cell-group title="联系我们">
      <wd-cell title="客服电话">
        <text class="right-text">400-888-8888</text>
      </wd-cell>
      <wd-cell title="工作邮箱">
        <text class="right-text">service@xxx.com</text>
      </wd-cell>
    </wd-cell-group>

    <view class="copyright">
      <text>©2026 某某科技 版权所有</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useToast } from '@wot-ui/ui'

const toast = useToast()

definePage({
  style: {
    navigationBarTitleText: '关于我们',
  },
})

// 公司简介
function toCompanyDesc() {
  toast.info('页面开发中')
}
// 用户协议
function toUserAgree() {
  toast.info('页面开发中')
}
// 隐私政策
function toPrivacy() {
  toast.info('页面开发中')
}
</script>

<style lang="scss" scoped>
.page-about {
  padding: 30rpx;
  min-height: 100vh;
  background: #fff;
}
.logo-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 80rpx 0 100rpx;
}
.logo-box {
  width: 160rpx;
  height: 160rpx;
  background: #409eff;
  border-radius: 32rpx;
  margin-bottom: 30rpx;
}
.app-name {
  font-size: 40rpx;
  font-weight: 500;
  color: #333;
}
.version {
  font-size: 26rpx;
  color: #999;
  margin-top: 16rpx;
}
.right-text {
  font-size: 28rpx;
  color: #666;
}
.copyright {
  text-align: center;
  margin-top: 120rpx;
  font-size: 24rpx;
  color: #999;
}
</style>
