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
        <wd-avatar size="120rpx" round  />
        <view class="user-detail">
          <text class="username"></text>
          <view class="user-role-wrap">
            <wd-tag type="primary" size="small">
            </wd-tag>
            <text class="user-dept"></text>
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
      <!-- 点检巡检 -->
      <view class="block-title">
        点检巡检
      </view>
      <view class="grid-row">
        <view v-for="item in checkList" :key="item.path" class="grid-item" @click="navTo(item.path)">
          <view class="icon-box" :style="{ backgroundColor: item.color }">
            <text class="iconfont">{{ item.icon }}</text>
          </view>
          <text class="item-text">{{ item.label }}</text>
        </view>
      </view>
    </view>

    <view class="page-index-menu">
      <!-- 点检巡检 -->
      <view class="menu-block">
        <view class="block-title">
          点检巡检
        </view>
        <view class="grid-row">
          <view v-for="item in checkList" :key="item.path" class="grid-item" @click="navTo(item.path)">
            <view class="icon-box" :style="{ backgroundColor: item.color }">
              <text class="iconfont">{{ item.icon }}</text>
            </view>
            <text class="item-text">{{ item.label }}</text>
          </view>
        </view>
      </view>

      <view class="menu-block">
        <view class="block-title">
          计划任务
        </view>
        <view class="grid-row">
          <view v-for="item in taskList" :key="item.path" class="grid-item" @click="navTo(item.path)">
            <view class="icon-box" :style="{ backgroundColor: item.color }">
              <text class="iconfont">{{ item.icon }}</text>
            </view>
            <text class="item-text">{{ item.label }}</text>
          </view>
        </view>
      </view>

      <view class="menu-block">
        <view class="block-title">
          缺陷故障
        </view>
        <view class="grid-row">
          <view v-for="item in defectList" :key="item.path" class="grid-item" @click="navTo(item.path)">
            <view class="icon-box" :style="{ backgroundColor: item.color }">
              <wd-icon :name="item.icon" color="#ffffff" size="56rpx" />
            </view>
            <text class="item-text">{{ item.label }}</text>
          </view>
        </view>
      </view>

      <!-- 备品备件 -->
      <view class="menu-block">
        <view class="block-title">
          备品备件
        </view>
        <view class="grid-row">
          <view v-for="item in spareList" :key="item.path" class="grid-item" @click="navTo(item.path)">
            <view class="icon-box" :style="{ backgroundColor: item.color }">
              <text class="iconfont">{{ item.icon }}</text>
            </view>
            <text class="item-text">{{ item.label }}</text>
          </view>
        </view>
      </view>

      <!-- 统计 -->
      <view class="menu-block">
        <view class="block-title">
          统计
        </view>
        <view class="grid-row">
          <view v-for="item in statList" :key="item.path" class="grid-item" @click="navTo(item.path)">
            <view class="icon-box" :style="{ backgroundColor: item.color }">
              <text class="iconfont">{{ item.icon }}</text>
            </view>
            <text class="item-text">{{ item.label }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
definePage({
  style: {
    navigationBarTitleText: '设备管理首页',
  },
})

// 点检巡检 5列
const checkList = [
  { label: '日常巡视', color: '#10c9b9', icon: '', path: '/pages/check/daily' },
  { label: '特殊巡检', color: '#ff722e', icon: '', path: '/pages/check/special' },
  { label: '巡检日历', color: '#5472e8', icon: '', path: '/pages/check/calendar' },
  { label: '巡视轨迹', color: '#4270e6', icon: '', path: '/pages/check/track' },
  { label: '离线巡检', color: '#3b86e8', icon: '', path: '/pages/check/offline' },
]
// 计划任务 3列
const taskList = [
  { label: '快速工单', color: '#ff722e', icon: '', path: '/pages/task/fast' },
  { label: '保养计划', color: '#10c9b9', icon: '', path: '/pages/task/plan' },
  { label: '保养工单', color: '#4270e6', icon: '', path: '/pages/task/maintain' },
]
// 缺陷故障 5列
const defectList = [
  { label: '上报', color: '#9076e8', icon: 'file', path: '/pages/defect/report' },
  { label: '审核派单', color: '#36b968', icon: '', path: '/pages/defect/audit' },
  { label: '处理', color: '#4270e6', icon: '', path: '/pages/defect/handle' },
  { label: '验收', color: '#ff722e', icon: '', path: '/pages/defect/check' },
  { label: '我的缺陷', color: '#36b968', icon: '', path: '/pages/defect/my' },
]
// 备品备件 5列
const spareList = [
  { label: '领用', color: '#f79432', icon: '', path: '/pages/spare/borrow' },
  { label: '领用记录', color: '#4270e6', icon: '', path: '/pages/spare/borrow-log' },
  { label: '退还', color: '#10c9b9', icon: '', path: '/pages/spare/return' },
  { label: '库存查询', color: '#4270e6', icon: '', path: '/pages/spare/stock' },
  { label: '库存盘点', color: '#ff722e', icon: '', path: '/pages/spare/check' },
]
// 统计 5列
const statList = [
  { label: '设备统计', color: '#f77333', icon: '', path: '/pages/stat/device' },
  { label: '巡检统计', color: '#f79432', icon: '', path: '/pages/stat/check' },
  { label: '维修统计', color: '#4270e6', icon: '', path: '/pages/stat/repair' },
  { label: '保养统计', color: '#10c9b9', icon: '', path: '/pages/stat/maintain' },
  { label: '备品统计', color: '#4270e6', icon: '', path: '/pages/stat/spare' },
]

// 页面跳转
function navTo(url: string) {
  uni.navigateTo({ url })
}
</script>

<style lang="scss" scoped>
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
  padding: 50rpx 30rpx;
}

.page-index-menu {
  padding: 30rpx;
}

.menu-block {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
}
.block-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #222;
  margin-bottom: 10rpx;
}
.grid-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}
// 5等分布局
.grid-item {
  width: calc((100% - 80rpx) / 5);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.icon-box {
  width: 80rpx;
  height: 80rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}
.iconfont {
  font-size: 48rpx;
  color: #fff;
}
.item-text {
  font-size: 26rpx;
  color: #333;
  text-align: center;
}
</style>
