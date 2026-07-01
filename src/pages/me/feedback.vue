<template>
  <view class="page-feedback">
    <view class="group-title">反馈类型</view>

    <!-- 纯flex左右布局，不用wd-cell、不用插槽 -->
    <view class="row-item" @click="selectType('bug')">
      <text class="label">功能故障</text>
      <view class="radio-circle" :class="{ active: feedbackType === 'bug' }"></view>
    </view>
    <view class="row-item" @click="selectType('suggest')">
      <text class="label">需求建议</text>
      <view class="radio-circle" :class="{ active: feedbackType === 'suggest' }"></view>
    </view>
    <view class="row-item" @click="selectType('other')">
      <text class="label">其他问题</text>
      <view class="radio-circle" :class="{ active: feedbackType === 'other' }"></view>
    </view>

    <!-- 输入框区域 -->
    <view class="input-wrap">
      <textarea
        v-model="content"
        placeholder="请详细描述您遇到的问题或建议，不少于10个字"
        class="feedback-textarea"
        maxlength="300"
      />
      <view class="count-tip">{{ content.length }}/300</view>
    </view>

    <view class="group-title">联系方式（选填）</view>
    <view class="row-item">
      <text class="label">手机号</text>
      <input
        v-model="phone"
        type="number"
        placeholder="方便我们联系您"
        class="phone-input"
      />
    </view>

    <view class="submit-wrap">
      <wd-button type="primary" block size="large" @click="submitFeedback">
        提交反馈
      </wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { t } from "@/locale"

const toast = useToast()

definePage({
  style: {
    navigationBarTitleText: '帮助与反馈',
  },
})

const feedbackType = ref('bug')
const content = ref('')
const phone = ref('')

// 点击行切换单选
function selectType(val: string) {
  feedbackType.value = val
}

function submitFeedback() {
  const text = content.value.trim()
  if (text.length < 10) {
    toast.error('反馈内容至少10个字')
    return
  }
  toast.success('反馈提交成功，我们会尽快处理')
  feedbackType.value = 'bug'
  content.value = ''
  phone.value = ''
  setTimeout(() => uni.navigateBack(), 1200)
}
</script>

<style lang="scss" scoped>
.page-feedback {
  padding: 30rpx;
  background: #fff;
  min-height: 100vh;
}
.group-title {
  font-size: 30rpx;
  font-weight: 500;
  margin: 40rpx 0 20rpx;
}
// 左右弹性行
.row-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #eee;
}
.label {
  font-size: 28rpx;
}
// 原生单选圆圈
.radio-circle {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 2rpx solid #ccc;
  position: relative;
  &.active {
    border-color: #007aff;
    &::after {
      content: '';
      width: 16rpx;
      height: 16rpx;
      background: #007aff;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
.input-wrap {
  margin: 40rpx 0;
  padding: 30rpx;
  background: #f8f8f8;
  border-radius: 16rpx;
}
.feedback-textarea {
  width: 100%;
  height: 220rpx;
  font-size: 28rpx;
  background: transparent;
}
.count-tip {
  text-align: right;
  font-size: 24rpx;
  color: #999;
  margin-top: 20rpx;
}
.phone-input {
  width: 240rpx;
  font-size: 28rpx;
  color: #666;
}
.submit-wrap {
  margin-top: 80rpx;
}
</style>
