<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useTokenStore } from '@/store/token'
import { generateUUID } from '@/utils/other'
import { FORGET_PAGE, LOGIN_PAGE } from '@/router/config'

definePage({
  style: {
    navigationStyle: 'custom',
  },
})
const loginLoading = ref(false)
const agreeProtocol = ref(true)

// 环境变量：是否开启验证码
const verifyEnable = ref(import.meta.env.VITE_VERIFY_ENABLE === 'true')
// 验证码图片地址
const imgSrc = ref('')

// 表单数据（新增验证码code、随机串randomStr）
const formState = reactive({
  username: '',
  password: '',
  code: '',
  randomStr: '',
})

// 获取、刷新验证码
function getVerifyCode() {
  formState.randomStr = generateUUID()
  imgSrc.value = `${import.meta.env.VITE_APP_PROXY_PREFIX}${import.meta.env.VITE_IS_MICRO === 'false' ? '/admin' : '/auth'}/code/image?randomStr=${formState.randomStr}`
}

const tokenStore = useTokenStore()
async function doLogin() {
  if (tokenStore.hasLogin) {
    await uni.navigateBack()
    return
  }
  if (!agreeProtocol.value) {
    await uni.showToast({ title: '请同意用户协议和隐私协议', icon: 'none' })
    return
  }

  let name = formState.username.trim()
  const pwd = formState.password.trim()
  const code_number = formState.code.trim()
  name = 'admin'
  if (!name) {
    await uni.showToast({ title: '请输入用户名/手机号', icon: 'none' })
    return
  }
  if (!pwd) {
    await uni.showToast({ title: '请输入密码', icon: 'none' })
    return
  }
  // 开启验证码时，校验验证码非空
  if (verifyEnable.value && !code_number) {
    await uni.showToast({ title: '请输入图形验证码', icon: 'none' })
    return
  }

  loginLoading.value = true
  try {
    // 调用登录接口
    await tokenStore.login({
      username: name,
      password: pwd,
      grant_type: 'password',
      code: code_number,
      randomStr: formState.randomStr,
    })
    await uni.navigateBack()
  }
  catch (error) {
    // 在这里处理验证码刷新，页面自有 verifyEnable / getVerifyCode
    const errData = error?.data || error?.response?.data
    const errMsg = errData?.msg || ''
    if (errMsg.includes('用户名或密码错误') && verifyEnable.value) {
      getVerifyCode()
    }
  }
  // 新增：无论成功、失败，都关闭loading转圈
  finally {
    loginLoading.value = false
  }
}

function goForget() {
  uni.navigateTo({
    url: FORGET_PAGE,
  })
}
function goSmsLogin() {
  uni.navigateTo({
    url: LOGIN_PAGE,
  })
}
function thirdLogin(type: string) {}
function goProtocol(type: string) {}

// 页面挂载自动拉取验证码
onMounted(() => {
  if (verifyEnable.value) {
    getVerifyCode()
  }
})
</script>

<template>
  <view class="login-page">
    <view class="banner-wrap">
      <view class="banner-title">
        <text>您好，</text>
        <text class="title-line">欢迎登录~</text>
      </view>
      <image src="/static/login/machine_bg.png" mode="widthFix" class="banner-machine-img" />
    </view>

    <view class="form-wrap">
      <!-- 用户名 -->
      <view class="input-block">
        <view class="input-label">
          用户名/手机号
        </view>
        <view class="input-box">
          <input v-model="formState.username" value="admin" type="text" placeholder="请输入手机号" class="native-input">
        </view>
      </view>

      <!-- 密码 -->
      <view class="input-block">
        <view class="input-label flex-between">
          <text>密码</text>
        </view>
        <view class="input-box">
          <input v-model="formState.password" class="native-input" placeholder="请输入密码" type="safe-password">
        </view>
      </view>

      <!-- 图形验证码（开启时显示） -->
      <view v-if="verifyEnable" class="input-block">
        <view class="input-label">
          图形验证码
        </view>
        <view class="code-row flex-between">
          <view class="input-box code-input">
            <input
              v-model="formState.code" class="native-input" placeholder="请输入4位验证码"
              type="number"
            >
          </view>
          <image class="code-img" :src="imgSrc" mode="widthFix" @click="getVerifyCode" />
        </view>
      </view>

      <view class="protocol-row">
        <wd-checkbox v-model="agreeProtocol" shape="circle" />
        <text class="protocol-text">
          同意并阅读
          <text class="protocol-link" @click="goProtocol('用户协议')">《用户协议》</text>
          和
          <text class="protocol-link" @click="goProtocol('隐私协议')">《隐私协议》</text>
        </text>
      </view>

      <wd-button block size="large" :loading="loginLoading" class="login-btn" @click="doLogin">
        登录
      </wd-button>

      <view class="switch-row flex-between">
        <text class="switch-link" @click="goSmsLogin">短信登录</text>
        <text class="switch-link" @click="goForget">忘记密码</text>
      </view>

      <view class="divider-row">
        <view class="divider-line" />
        <text class="divider-text">其它登录方式</text>
        <view class="divider-line" />
      </view>

      <view class="third-icon-row flex-between">
        <view class="third-icon-box" @click="thirdLogin('QQ')" />
        <view class="third-icon-box" @click="thirdLogin('微信')" />
        <view class="third-icon-box" @click="thirdLogin('微博')" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.login-page {
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.banner-wrap {
  width: 100%;
  height: 340rpx;
  background: linear-gradient(180deg, #c0e0f0 0%, #ffffff 100%);
  position: relative;
  padding: 70rpx 48rpx 0;
  overflow: hidden;
  .banner-title {
    font-size: 34rpx;
    color: #000;
    z-index: 2;
    position: relative;
    top: 180rpx;
    .title-line {
      display: block;
      margin-top: 10rpx;
    }
  }
  .banner-machine-img {
    position: absolute;
    right: -40rpx;
    top: 20rpx;
    width: 720rpx;
    opacity: 0.7;
    z-index: 1;
  }
}

.form-wrap {
  flex: 1;
  padding: 24rpx 48rpx;
  margin-top: 10rpx;
}

.input-block {
  margin-bottom: 30rpx;
  .input-label {
    font-size: 30rpx;
    color: #111;
    margin-bottom: 20rpx;
  }
}

.input-box {
  width: 100%;
  background: #f0f5ff;
  border-radius: 12rpx;
  padding: 21rpx 24rpx;
  box-sizing: border-box;
}
// 验证码输入框缩小宽度
.code-input {
  width: 62%;
}
// 验证码图片
.code-img {
  width: 34%;
  height: 86rpx;
  border-radius: 12rpx;
}
.code-row {
  gap: 20rpx;
}

.native-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 26rpx;
  color: #222;
  box-sizing: border-box;
}
.native-input::placeholder {
  color: #b4c2d8;
  font-size: 26rpx;
}

.protocol-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin: 24rpx 0 60rpx;
  .protocol-text {
    font-size: 24rpx;
    color: #333;
  }
  .protocol-link {
    color: #0066ee;
  }
}

.login-btn {
  height: 100rpx;
  font-size: 32rpx;
  border-radius: 16rpx;
  background-color: #0066ee;
  border: none;
}

.switch-row {
  margin: 50rpx 0;
  .switch-link {
    font-size: 26rpx;
    color: #0066ee;
  }
}

.divider-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin: 90rpx 0 70rpx;
  .divider-line {
    flex: 1;
    height: 1rpx;
    background: #e5e7eb;
  }
  .divider-text {
    font-size: 24rpx;
    color: #999;
  }
}

.third-icon-row {
  padding: 0 60rpx;
  .third-icon-box {
    width: 110rpx;
    height: 110rpx;
    border-radius: 50%;
    background: #f0f5ff;
  }
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
