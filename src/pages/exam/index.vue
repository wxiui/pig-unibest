<template>
  <view class="page-exam-index">
    <!-- 顶部用户+倒计时横幅 -->
    <view class="top-banner">
      <view class="user-info">
        <wd-avatar size="96rpx" round :src="userInfo?.avatar" />
        <view class="user-text">
          <text class="username">{{ userInfo?.name }}</text>
          <text class="user-dept">{{ userInfo?.dept?.name }}</text>
        </view>
      </view>
      <view v-if="examCount > 0" class="time-box">
        <text class="time-label">{{ t('exam.has_unfinished') }}</text>
        <text class="time-num">{{ examCount }}</text>
      </view>
    </view>

    <!-- 待进行考试区块 垂直布局，无横向滚动，彻底消除右侧空白 -->
    <view class="block-title">
      <text>{{ t('exam.unfinished_title') }}</text>
    </view>
    <view v-if="unFinishList.length > 0" class="section-wrap">
      <view class="exam-list-vertical">
        <view
          v-for="item in unFinishList"
          :key="item.id"
          class="exam-card"
          @click="goExamPaper(item.id)"
        >
          <view class="card-top">
            <text class="exam-name">{{ item.title }}</text>
            <wd-tag size="small" type="primary">
              {{ item.typeName }}
            </wd-tag>
          </view>
          <view class="card-row">
            <wd-icon name="calendar" size="28rpx" color="#999" />
            <text class="card-desc">{{ item.startTime }} ~ {{ item.endTime }}</text>
          </view>
          <view class="card-row">
            <wd-icon name="clock" size="28rpx" color="#999" />
            <text class="card-desc">{{ t("exam.duration") }}：{{ item.duration }}分钟</text>
          </view>
          <view class="card-bottom">
            <wd-button size="small" type="primary">
              {{ t('exam.start') }}
            </wd-button>
          </view>
        </view>
      </view>
    </view>

    <!-- 功能栅格：在线考试 / 历史成绩 / 考试须知 -->
    <view class="menu-wrap">
      <view class="block-title">
        {{ t('exam.function_title') }}
      </view>
      <wd-grid column="3" custom-class="menu-grid">
        <wd-grid-item @click="goAllExam">
          <view class="menu-item">
            <view class="icon-box" style="background:#1890ff">
              <wd-icon name="edit-pencil" size="44rpx" color="#fff" />
            </view>
            <text class="menu-text">{{ t('exam.menu_all') }}</text>
          </view>
        </wd-grid-item>
        <wd-grid-item @click="goScoreRecord">
          <view class="menu-item">
            <view class="icon-box" style="background:#52c41a">
              <wd-icon name="chart-line" size="44rpx" color="#fff" />
            </view>
            <text class="menu-text">{{ t('exam.menu_score') }}</text>
          </view>
        </wd-grid-item>
        <wd-grid-item @click="goNotice">
          <view class="menu-item">
            <view class="icon-box" style="background:#f79432">
              <wd-icon name="document-text" size="44rpx" color="#fff" />
            </view>
            <text class="menu-text">{{ t('exam.menu_notice') }}</text>
          </view>
        </wd-grid-item>
      </wd-grid>
    </view>

    <!-- 最近考试成绩列表 -->
    <view class="section-wrap">
      <view class="block-title">
        <text>{{ t('exam.recent_score') }}</text>
        <text class="more-text" @click="goScoreRecord">{{ t('common.more') }} ></text>
      </view>
      <view class="score-list">
        <view
          v-for="score in scoreList"
          :key="score.id"
          class="score-card"
          @click="goScoreDetail(score.id)"
        >
          <view class="score-left">
            <text class="score-name">{{ score.examName }}</text>
            <text class="score-date">{{ score.createTime }}</text>
          </view>
          <view class="score-right">
            <text class="score-num" :class="{ pass: score.score >= score.passLine }">
              {{ score.score }}
            </text>
            <text class="score-line">/{{ score.fullScore }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { t } from '@/locale'
import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'

definePage({
  style: {
    navigationBarTitleText: '在线考试',
  },
})

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

// 待考试列表
const unFinishList = ref([
  {
    id: 1,
    title: '设备安全理论闭卷考试',
    typeName: '闭卷',
    startTime: '2026-07-01 09:00',
    endTime: '2026-07-01 17:00',
    duration: 90,
  },
])
const examCount = ref(unFinishList.value.length)

// 历史成绩列表
const scoreList = ref([
  {
    id: 101,
    examName: '新员工安全入门考试',
    createTime: '2026-06-25',
    score: 92,
    fullScore: 100,
    passLine: 60,
  },
  {
    id: 102,
    examName: '特种设备操作考核',
    createTime: '2026-06-20',
    score: 55,
    fullScore: 100,
    passLine: 60,
  },
])

// 跳转
function goExamPaper(id: number) {
  uni.navigateTo({ url: `/pages/exam/paper?id=${id}` })
}
function goAllExam() {
  uni.navigateTo({ url: '/pages/exam/list' })
}
function goScoreRecord() {
  uni.navigateTo({ url: '/pages/exam/score-list' })
}
function goScoreDetail(id: number) {
  uni.navigateTo({ url: `/pages/exam/score-detail?id=${id}` })
}
function goNotice() {
  uni.navigateTo({ url: '/pages/exam/notice' })
}
</script>

<style lang="scss" scoped>
.page-exam-index {
  background: #f5f6f8;
  min-height: 100vh;
  padding-bottom: 160rpx;
}
// 顶部横幅
.top-banner {
  margin: 24rpx;
  padding: 32rpx;
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  border-radius: 16rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .user-info {
    display: flex;
    align-items: center;
    gap: 20rpx;
    .user-text {
      display: flex;
      flex-direction: column;
      gap: 8rpx;
      .username {
        font-size: 36rpx;
        color: #fff;
        font-weight: 500;
      }
      .user-dept {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
  .time-box {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 12rpx;
    padding: 12rpx 20rpx;
    text-align: center;
    .time-label {
      font-size: 24rpx;
      color: #fff;
    }
    .time-num {
      font-size: 40rpx;
      color: #fff;
      font-weight: 600;
    }
  }
}

.block-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 34rpx;
  font-weight: 500;
  padding: 0 24rpx 24rpx;
  .more-text {
    font-size: 26rpx;
    color: #999;
  }
}

// 待考试区块 垂直列表 无横向滚动空白
.section-wrap {
  margin: 0 24rpx 32rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx 0;
  overflow: hidden;
  .exam-list-vertical {
    padding: 0 24rpx;
    display: flex;
    flex-direction: column;
    gap: 24rpx;
  }
  .exam-card {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .exam-name {
        font-size: 32rpx;
        font-weight: 500;
        color: #222;
      }
    }
    .card-row {
      display: flex;
      align-items: center;
      gap: 12rpx;
      .card-desc {
        font-size: 26rpx;
        color: #666;
      }
    }
    .card-bottom {
      margin-top: 12rpx;
    }
  }
}

// 功能栅格
.menu-wrap {
  margin: 0 24rpx 32rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx 0;
  overflow: hidden;
  .menu-grid {
    padding: 0 24rpx;
  }
  .menu-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16rpx;
    .icon-box {
      width: 88rpx;
      height: 88rpx;
      border-radius: 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .menu-text {
      font-size: 28rpx;
      color: #333;
    }
  }
}

// 成绩列表
.score-list {
  padding: 0 24rpx;
  .score-card {
    padding: 32rpx 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1rpx solid #f2f2f2;
    &:last-child {
      border-bottom: none;
    }
    .score-left {
      display: flex;
      flex-direction: column;
      gap: 8rpx;
      .score-name {
        font-size: 30rpx;
        color: #222;
      }
      .score-date {
        font-size: 24rpx;
        color: #999;
      }
    }
    .score-right {
      display: flex;
      align-items: flex-end;
      .score-num {
        font-size: 48rpx;
        font-weight: 600;
        color: #f53f3f;
        &.pass {
          color: #52c41a;
        }
      }
      .score-line {
        font-size: 28rpx;
        color: #999;
        margin-left: 8rpx;
      }
    }
  }
}
</style>
