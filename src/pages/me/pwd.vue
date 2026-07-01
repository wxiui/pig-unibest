<template>
  <wd-form ref="form" :model="form" :schema="schema">
    <!-- 表单区域 -->
    <wd-cell-group border>
      <wd-form-item :title="t('changePwd.oldPwd')" prop="password">
        <wd-input
          v-model="form.password"
          :label="t('changePwd.oldPwd')"
          type="password"
          placeholder="******"
          clearable
        />
      </wd-form-item>
      <wd-form-item :title="t('changePwd.newPwd')" prop="newpassword1">
        <wd-input
          v-model="form.newpassword1"
          type="password"
          placeholder="******"
          clearable
        />
      </wd-form-item>
      <wd-form-item :title="t('changePwd.confirmPwd')" prop="newpassword2">
        <wd-input
          v-model="form.newpassword2"
          type="password"
          placeholder="******"
          clearable
        />
      </wd-form-item>
      <wd-cell title-width="0px">
        <view class="footer">
          <wd-button
            type="primary"
            block
            size="large"
            class="submit-btn"
            @click="submit"
          >
            {{ t('changePwd.submit') }}
          </wd-button>
        </view>
      </wd-cell>
    </wd-cell-group>
  </wd-form>
</template>

<script lang="ts" setup>
import { t } from '@/locale'
import { ref } from 'vue'
import { useTokenStore } from '@/store/token'
import { updateUserPassword } from '@/api/user'

definePage({
  style: {
    navigationBarTitleText: '修改密码',
  },
})

// 表单数据
const form = ref({
  password: '',
  newpassword1: '',
  newpassword2: '',
})
const tokenStore = useTokenStore()
const toast = useToast()

// 提交修改密码
function submit() {
  const { password, newpassword1, newpassword2 } = form.value
  // 基础校验
  if (!password) {
    toast.show(t('changePwd.oldPwdTip'))
    return
  }
  if (!newpassword1) {
    toast.show(t('changePwd.newPwdTip'))
    return
  }
  if (newpassword1 !== newpassword2) {
    toast.show(t('changePwd.pwdNotMatch'))
    return
  }
  if (newpassword1.length < 6 || newpassword1.length > 20) {
    toast.show(t('changePwd.pwdLengthTip'))
    return
  }

  try {
    updateUserPassword(form.value)
    toast.show(t('changePwd.success'))
    // 修改成功后退出登录，返回登录页
    setTimeout(() => {
      tokenStore.logout()
      uni.navigateTo({ url: '/pages/auth/login' })
    }, 1200)
  }
  catch (error) {
    console.log(error)
    // 4. 显示精准错误提示
    toast.show(t('changePwd.fail'))
  }
}
</script>

<style lang="scss" scoped>
.submit-btn {
  border-radius: 12rpx;
}
</style>
