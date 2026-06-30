<template>
  <view class="mine-page" style="padding-bottom: 60px;">
    <wd-card title="生活记录" type="rectangle">
      <view class="list-group">
        <view class="list-item">
          <wd-avatar size="large" :src="userInfo?.avatar" @click="chooseAvatar" />
          <view class="list-item__content">
            <view class="list-item__title">今天天气真好</view>
            <view class="list-item__desc">2026年2月11日 晴天 22℃</view>
          </view>
        </view>
      </view>
      <template #footer>
        <wd-button size="small" plain>点赞</wd-button>
      </template>
    </wd-card>
    <wd-cell-group :border="false">
      <wd-gap height="20" bg-color="#f5f5f5" />
      <wd-cell title="公司" value="科技有限公司" :title-width="180" :arrow="false" />
      <wd-cell title="所属部门" value="人事部" :title-width="180" is-link />
      <wd-cell title="岗位" value="秘书" is-link />
      <wd-cell title="手机" value="15389457063" :title-width="180" @click="navTo('/pages/sys/user/modify')" />
      <wd-cell title="邮箱" :title-width="180" />
      <wd-gap height="20" bg-color="#f5f5f5" />
    </wd-cell-group>
  </view>
</template>

<script>
import { storeToRefs } from 'pinia'
import { LOGIN_PAGE } from '@/router/config'
import { useUserStore } from '@/store'
import { useTokenStore } from '@/store/token'

definePage({
  style: {
    navigationBarTitleText: '我的',
  },
})

const userStore = useUserStore()
const tokenStore = useTokenStore()
// 使用storeToRefs解构userInfo
const { userInfo } = storeToRefs(userStore)

// 微信小程序下登录
async function handleLogin() {
  // #ifdef MP-WEIXIN
  // 微信登录
  await tokenStore.wxLogin()

  // #endif
  // #ifndef MP-WEIXIN
  uni.navigateTo({
    url: `${LOGIN_PAGE}`,
  })
  // #endif
}

function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // 清空用户信息
        useTokenStore().logout()
        // 执行退出登录逻辑
        uni.showToast({
          title: '退出登录成功',
          icon: 'success',
        })
        // #ifdef MP-WEIXIN
        // 微信小程序，去首页
        // uni.reLaunch({ url: '/pages/index/index' })
        // #endif
        // #ifndef MP-WEIXIN
        // 非微信小程序，去登录页
        // uni.navigateTo({ url: LOGIN_PAGE })
        // #endif
      }
    },
  })
}

function chooseAvatar() {
  this.$u.route({
    url: '/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
    params: {
      destWidth: 200, // 输出图片宽高
      rectWidth: 200, // 裁剪框的宽高
      fileType: 'jpg', // 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
    },
  })
}
</script>

<style lang="scss" scoped>
page {
  background-color: #f5f5f5;
}
.list-group {
  .list-item{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    gap: 12px;
  }
}
.mine-page {
  background-color: #f5f5f5;
  padding: 0 20rpx;
}
</style>
