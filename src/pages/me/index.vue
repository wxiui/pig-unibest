<template>
  <view class="page-mine">
    <!-- 顶部用户信息卡片 -->
    <view class="user-card">
      <!-- 右上角设置 -->
      <view class="setting-btn" @click="goSetting">
        <wd-icon name="settings" color="#fff" size="64rpx" />
      </view>

      <!-- 头像+核心信息 -->
      <view class="user-info">
        <wd-avatar size="120rpx" round :src="userInfo?.avatar" />
        <view class="user-detail">
          <text class="username">{{ userInfo?.name }}</text>
          <view class="user-role-wrap">
            <wd-tag type="primary" size="small">
              {{ userInfo?.roleList[0]?.roleName }}
            </wd-tag>
            <text class="user-dept">{{ userInfo?.dept?.name }}</text>
          </view>
        </view>
      </view>

      <!-- 三栏统计 -->
      <view class="stat-row">
        <view class="stat-item" @click="goCard">
          <text class="stat-num">0</text>
          <text class="stat-label">{{ $t("mine.msg_notice") }}</text>
        </view>
        <view class="stat-item split" @click="goFriend">
          <text class="stat-num">0</text>
          <text class="stat-label">{{ $t("mine.train") }}</text>
        </view>
        <view class="stat-item" @click="goRecord">
          <text class="stat-num">0</text>
          <text class="stat-label">{{ $t("mine.certificate") }}</text>
        </view>
      </view>
    </view>

    <!-- 个人核心数据统计（仅和用户本人相关） -->
    <view class="stat-section">
      <wd-grid :column="4" custom-class="stat-grid">
        <wd-grid-item v-for="(item, index) in userStats" :key="index" @click="goStatPage(item.path)">
          <view class="stat-item">
            <text class="stat-num">{{ item.num }}</text>
            <text class="stat-label">{{ item.name }}</text>
          </view>
        </wd-grid-item>
      </wd-grid>
    </view>

    <!-- 个人功能列表（左右布局，仅和用户相关的操作） -->
    <view class="list-section">
      <!-- 我的业务相关 -->
      <wd-cell-group custom-class="cell-group">
        <wd-cell
          is-link
          @click="goPage('/pages/me/todo-hazard')"
        >
          <template #default>
            <view class="cell-left-wrap">
              <view class="custom-prefix-icon">
                <wd-icon name="info-circle-fill" color="#1890ff" size="40rpx" />
              </view>
              <text class="cell-title">{{ t('mine.my_todo_hazard') }}</text>
            </view>
          </template>
          <template #right>
            <wd-badge :value="todoCount" type="danger" />
          </template>
        </wd-cell>
        <wd-cell
          is-link
          @click="goPage('/pages/me/my-task')"
        >
          <template #default>
            <view class="cell-left-wrap">
              <view class="custom-prefix-icon">
                <wd-icon name="check-circle" color="#52c41a" size="40rpx" />
              </view>
              <text class="cell-title">{{ t('mine.my_check_task') }}</text>
            </view>
          </template>
        </wd-cell>
        <wd-cell
          is-link
          @click="goPage('/pages/me/train-record')"
        >
          <template #default>
            <view class="cell-left-wrap">
              <view class="custom-prefix-icon">
                <wd-icon name="book" color="#1890ff" size="40rpx" />
              </view>
              <text class="cell-title">{{ t('mine.my_train_record') }}</text>
            </view>
          </template>
        </wd-cell>
        <wd-cell
          is-link
          @click="goPage('/pages/me/emergency-record')"
        >
          <template #default>
            <view class="cell-left-wrap">
              <view class="custom-prefix-icon">
                <wd-icon name="Fire" color="#f53f3f" size="40rpx" />
              </view>
              <text class="cell-title">{{ t('mine.my_emergency_handle') }}</text>
            </view>
          </template>
        </wd-cell>
      </wd-cell-group>

      <!-- 账号与设置相关 -->
      <wd-cell-group custom-class="cell-group">
        <wd-cell
          is-link
          @click="goPage('/pages/me/account-setting')"
        >
          <template #default>
            <view class="cell-left-wrap">
              <view class="custom-prefix-icon">
                <wd-icon name="lock" color="#666" size="40rpx" />
              </view>
              <text class="cell-title">{{ t('mine.account_security') }}</text>
            </view>
          </template>
        </wd-cell>
        <wd-cell
          is-link
          @click="goPage('/pages/me/pwd')"
        >
          <template #default>
            <view class="cell-left-wrap">
              <view class="custom-prefix-icon">
                <wd-icon name="edit" color="#666" size="40rpx" />
              </view>
              <text class="cell-title">{{ t('mine.change_password') }}</text>
            </view>
          </template>
        </wd-cell>
        <wd-cell
          is-link
          @click="goPage('/pages/me/notice-setting')"
        >
          <template #default>
            <view class="cell-left-wrap">
              <view class="custom-prefix-icon">
                <wd-icon name="notification" color="#666" size="40rpx" />
              </view>
              <text class="cell-title">{{ t('mine.notice_setting') }}</text>
            </view>
          </template>
        </wd-cell>
      </wd-cell-group>

      <!-- 系统与帮助相关 -->
      <wd-cell-group custom-class="cell-group">
        <wd-cell
          is-link
          @click="goPage('/pages/me/feedback')"
        >
          <template #default>
            <view class="cell-left-wrap">
              <view class="custom-prefix-icon">
                <wd-icon name="email" color="#666" size="40rpx" />
              </view>
              <text class="cell-title">{{ t('mine.help_feedback') }}</text>
            </view>
          </template>
        </wd-cell>
        <wd-cell
          is-link
          @click="goPage('/pages/me/about')"
        >
          <template #default>
            <view class="cell-left-wrap">
              <view class="custom-prefix-icon">
                <wd-icon name="info-circle" color="#666" size="40rpx" />
              </view>
              <text class="cell-title">{{ t('mine.about_us') }}</text>
            </view>
          </template>
        </wd-cell>
        <wd-cell
          is-link
          @click="checkUpdate"
        >
          <template #default>
            <view class="cell-left-wrap">
              <view class="custom-prefix-icon">
                <wd-icon name="refresh" color="#666" size="40rpx" />
              </view>
              <text class="cell-title">{{ t('mine.version_update') }}</text>
            </view>
          </template>
          <template #right>
            <text class="version-text">V1.0.0</text>
          </template>
        </wd-cell>
      </wd-cell-group>
    </view>

    <!-- 底部退出登录 -->
    <view class="logout-wrap">
      <wd-button v-if="tokenStore.hasLogin" type="danger" block size="large" @click="handleLogout">
        {{ $t("mine.logout") }}
      </wd-button>
      <button v-else type="primary" class="w-full" @click="handleLogin">
        {{ $t("mine.login") }}
      </button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { t } from '@/locale'
import { storeToRefs } from 'pinia'
import { LOGIN_PAGE } from '@/router/config'
import { useUserStore } from '@/store'
import { useTokenStore } from '@/store/token'

definePage({
  style: {
    navigationStyle: 'custom',
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
  await uni.navigateTo({
    url: `${LOGIN_PAGE}`,
  })
  // #endif
}

// 待办数量
const todoCount = ref(3)

// 用户个人统计数据
const userStats = ref([
  { name: t('mine.todo_hazard'), num: 3, path: '/pages/me/todo-hazard' },
  { name: t('mine.check_task'), num: 12, path: '/pages/me/my-task' },
  { name: t('mine.train_record'), num: 8, path: '/pages/me/train-record' },
  { name: t('mine.emergency_handle'), num: 2, path: '/pages/me/emergency-record' },
])

// 页面跳转
function goPage(url: string) {
  uni.navigateTo({ url })
}

function goSetting() {
  uni.navigateTo({ url: '/pages/me/account-setting' })
}

function goStatPage(url: string) {
  uni.navigateTo({ url })
}

// 检查更新
function checkUpdate() {
  uni.showToast({ title: t('mine.latest_version'), icon: 'success' })
}

// 退出登录
function handleLogout() {
  uni.showModal({
    title: t('msg.toast_title'),
    content: t('mine.logout_confirm'),
    success: (res) => {
      if (res.confirm) {
        useTokenStore().logout()
        // 执行退出登录逻辑
        uni.showToast({
          title: t('msg.logout_success'),
          icon: 'success',
        })
        uni.navigateTo({ url: LOGIN_PAGE })
      }
    },
  })
}
// 页面加载时获取用户信息
onMounted(() => {
  // 这里可以调用接口获取用户真实信息
  // getUserInfo()
})
</script>

<style lang="scss" scoped>
.page-mine {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

// 顶部用户卡片
.user-card {
  padding: 80rpx 32rpx 80rpx;
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  position: relative;
  overflow: hidden;

  .setting-btn {
    position: absolute;
    top: 50rpx;
    right: 32rpx;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 24rpx;

    .user-detail {
      display: flex;
      flex-direction: column;
      gap: 12rpx;

      .username {
        font-size: 44rpx;
        color: #fff;
        font-weight: 600;
      }

      .user-role-wrap {
        display: flex;
        align-items: center;
        gap: 12rpx;

        .user-dept {
          font-size: 24rpx;
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
  }

  .stat-row {
    display: flex;
    justify-content: space-around;
    margin: 10px 0 5rpx;
    width: 75%;

    .stat-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rpx;

      .stat-num {
        font-size: 36rpx;
        color: #fff;
      }
      .stat-label {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.85);
      }
    }
    .split {
      border-left: 1rpx solid rgba(255, 255, 255, 0.3);
      border-right: 1rpx solid rgba(255, 255, 255, 0.3);
    }
  }
}

// 统计数据区
.stat-section {
  // 【关键修改2】margin-top设为-40rpx，实现往上移的效果，可自行调整数值（比如-50rpx移得更高）
  margin: -60rpx 24rpx 32rpx;
  // 强制四个角完整圆角，覆盖组件默认样式
  border-radius: 24rpx !important;
  // 强制overflow:hidden，内部内容不会撑破圆角
  overflow: hidden !important;
  // 【关键修改3】设置相对定位+高z-index，让卡片浮在蓝色头部之上，顶部圆角完全可见
  position: relative;
  z-index: 10;
  background: #fff;
  // 增强阴影，浮起来的效果更明显
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.12);

  .stat-grid {
    padding: 24rpx 0;

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8rpx;

      .stat-num {
        font-size: 36rpx;
        color: #1890ff;
        font-weight: 600;
      }

      .stat-label {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

.list-section {
  .cell-group {
    margin: 0 24rpx 24rpx;
    border-radius: 16rpx;
    overflow: hidden;
  }

  // 缩小cell整体左右内边距，释放宽度
  :deep(.wd-cell) {
    padding: 32rpx 20rpx !important;
  }

  // 缩小右侧箭头容器宽度，给文字腾出大量空间
  :deep(.wd-cell__right) {
    flex-shrink: 0;
    width: 40rpx !important;
  }

  // 左侧外层撑满剩余全部宽度
  :deep(.wd-cell__left) {
    flex: 1 !important;
  }

  .cell-left-wrap {
    display: flex;
    align-items: flex-start;
    gap: 16rpx;
    width: 100%;
  }

  .custom-prefix-icon {
    flex-shrink: 0;
    width: 40rpx;
    height: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateY(5rpx);
  }

  .cell-title {
    flex: 1;
    white-space: normal;
    word-break: normal;
    overflow-wrap: break-word;
    line-height: 1.35;
    font-size: 32rpx;
    color: #333;
    text-align: left;
  }

  .version-text {
    font-size: 26rpx;
    color: #999;
    margin-right: 12rpx;
  }
}

// 退出登录
.logout-wrap {
  padding: 40rpx 24rpx 0;
}
</style>
