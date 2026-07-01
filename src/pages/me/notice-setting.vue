<template>
  <wd-toast />
  <view class="page-notice-setting">
    <wd-cell-group title="消息通知设置">
      <wd-cell title="系统通知">
        <wd-switch
          title="系统通知"
          size="medium"
          v-model="switchConfig.systemNotice"
          @change="onSwitchChange('系统通知', $event)"
        />
      </wd-cell>
      <wd-cell title="安全告警通知">
        <wd-switch
          title="安全告警通知"
          size="medium"
          v-model="switchConfig.securityNotice"
          @change="onSwitchChange('安全告警通知', $event)"
        />
      </wd-cell>
      <wd-cell title="业务审批通知">
        <wd-switch
          title="业务审批通知"
          size="medium"
          v-model="switchConfig.approveNotice"
          @change="onSwitchChange('业务审批通知', $event)"
        />
      </wd-cell>
      <wd-cell title="活动营销推送">
        <wd-switch
          title="活动营销推送"
          size="medium"
          v-model="switchConfig.marketNotice"
          @change="onSwitchChange('活动营销推送', $event)"
        />
      </wd-cell>
    </wd-cell-group>

    <wd-cell-group title="通知接收方式">
      <wd-cell title="App推送">
        <wd-switch
          title="App推送"
          size="medium"
          v-model="receiveType.appPush"
          @change="onReceiveChange('App推送', $event)"
        />
      </wd-cell>
      <wd-cell title="短信通知">
        <wd-switch
          title="短信通知"
          size="medium"
          v-model="receiveType.sms"
          @change="onReceiveChange('短信通知', $event)"
        />
      </wd-cell>
      <wd-cell title="站内消息">
        <wd-switch
          title="站内消息"
          size="medium"
          v-model="receiveType.innerMsg"
          @change="onReceiveChange('站内消息', $event)"
        />
      </wd-cell>
    </wd-cell-group>

    <view class="tip-text">
      <text>关闭对应分类后，将不再接收该类消息推送；安全告警无法完全关闭</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useToast } from '@wot-ui/ui'

const toast = useToast()

definePage({
  navigationBarTitleText: '消息通知设置',
})

// 消息开关配置
const switchConfig = ref({
  systemNotice: true,
  securityNotice: true,
  approveNotice: true,
  marketNotice: true,
})

// 接收渠道
const receiveType = ref({
  appPush: true,
  sms: true,
  innerMsg: true,
})

// 开关切换回调
function onSwitchChange(name: string, val: boolean) {
  // 安全告警强制不可关闭
  if (name === '安全告警通知' && !val) {
    switchConfig.value.securityNotice = true
    toast.error('安全告警通知不可关闭，用于账号风险提醒')
    return
  }
  toast.success(`${name}已${val ? '开启' : '关闭'}`)
  // 此处可调用接口保存配置
}

// 接收渠道切换
function onReceiveChange(name: string, val: boolean) {
  toast.success(`${name}接收已${val ? '开启' : '关闭'}`)
  // 此处可调用接口保存配置
}
</script>

<style lang="scss" scoped>
.page-notice-setting {
  padding: 30rpx;
}
.tip-text {
  margin-top: 40rpx;
  padding: 20rpx;
  font-size: 24rpx;
  color: #999;
  line-height: 1.6;
}
</style>
