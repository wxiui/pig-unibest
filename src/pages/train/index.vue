<template>
  <view class="page-train-index">
    <!-- 顶部轮播Banner 修复swiper-item -->
    <wd-swiper circular autoplay interval="3000" height="320rpx" custom-class="banner-swiper">
      <swiper-item v-for="(img, idx) in bannerList" :key="idx">
        <image :src="img" mode="aspectFill" class="banner-img" />
      </swiper-item>
    </wd-swiper>

    <!-- 数据统计模块 -->
    <view class="stat-wrap">
      <wd-grid column="4" custom-class="stat-grid">
        <wd-grid-item v-for="stat in statList" :key="stat.key">
          <view class="stat-card">
            <text class="stat-num">{{ stat.num }}</text>
            <text class="stat-label">{{ t(stat.labelKey) }}</text>
          </view>
        </wd-grid-item>
      </wd-grid>
    </view>

    <!-- 功能入口栅格 -->
    <view class="menu-wrap">
      <view class="block-title">
        {{ t('train.function_title') }}
      </view>
      <wd-grid column="4" custom-class="menu-grid">
        <wd-grid-item v-for="item in menuList" :key="item.path" @click="goPage(item.path)">
          <view class="menu-item">
            <view class="icon-box" :style="{ backgroundColor: item.color }">
              <wd-icon :name="item.icon" size="44rpx" color="#fff" />
            </view>
            <text class="menu-text">{{ t(item.labelKey) }}</text>
          </view>
        </wd-grid-item>
      </wd-grid>
    </view>

    <!-- 培训课程列表 -->
    <view class="course-wrap">
      <view class="block-title">
        <text>{{ t('train.course_title') }}</text>
        <text class="more-text" @click="goAllCourse">{{ t('common.more') }} ></text>
      </view>
      <scroll-view scroll-y class="course-scroll">
        <view v-for="course in courseList" :key="course.id" class="course-card" @click="goCourseDetail(course.id)">
          <image :src="course.cover" class="course-cover" mode="aspectFill" />
          <view class="course-info">
            <text class="course-name">{{ course.name }}</text>
            <text class="course-desc">{{ course.desc }}</text>
            <view class="course-tag-row">
              <wd-tag size="small" type="primary">
                {{ course.typeName }}
              </wd-tag>
              <text class="course-time">{{ course.time }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { t } from '@/locale'

definePage({
  style: {
    navigationBarTitleText: "培训中心",
  },
})

// 轮播图
const bannerList = ref([
  '/static/train/banner1.png',
  '/static/train/banner2.png',
])

// 统计数据
const statList = ref([
  { key: 'totalTrain', num: 28, labelKey: 'train.stat_total' },
  { key: 'myJoin', num: 12, labelKey: 'train.stat_join' },
  { key: 'finished', num: 8, labelKey: 'train.stat_finish' },
  { key: 'cert', num: 5, labelKey: 'train.stat_cert' },
])

// 功能菜单
const menuList = ref([
  { icon: 'add-circle', color: '#1890ff', labelKey: 'train.menu_create', path: '/pages/train/create' },
  { icon: 'calendar', color: '#52c41a', labelKey: 'train.menu_plan', path: '/pages/train/plan' },
  { icon: 'user-group', color: '#f79432', labelKey: 'train.menu_sign', path: '/pages/train/sign' },
  { icon: 'document', color: '#666', labelKey: 'train.menu_record', path: '/pages/me/train-record' },
])

// 课程列表模拟
const courseList = ref([
  {
    id: 1,
    cover: '/static/train/course1.png',
    name: '设备安全操作规范培训',
    desc: '新员工必备设备操作、风险识别实操教学',
    typeName: '实操培训',
    time: '2026-07-05 14:00',
  },
  {
    id: 2,
    cover: '/static/train/course2.png',
    name: '安全生产法规线上课程',
    desc: '最新安全法规、责任划分、应急处置讲解',
    typeName: '线上课程',
    time: '长期可观看',
  },
])

// 页面跳转
function goPage(url: string) {
  uni.navigateTo({ url })
}
function goAllCourse() {
  uni.navigateTo({ url: '/pages/train/list' })
}
function goCourseDetail(id: number) {
  uni.navigateTo({ url: `/pages/train/detail?id=${id}` })
}
</script>

<style lang="scss" scoped>
.page-train-index {
  background: #f5f6f8;
  min-height: 100vh;
  padding-bottom: 160rpx;
}
// 轮播
.banner-swiper {
  margin: 24rpx;
  border-radius: 16rpx;
  overflow: hidden;
}
.banner-img {
  width: 100%;
  height: 320rpx;
}

// 统计卡片
.stat-wrap {
  margin: 0 24rpx 32rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx 0;
  overflow: hidden;
  :deep(.wd-grid-item) {
    display: flex;
    justify-content: center;
  }
  .stat-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;
    .stat-num {
      font-size: 44rpx;
      font-weight: 600;
      color: #1890ff;
    }
    .stat-label {
      font-size: 26rpx;
      color: #666;
    }
  }
}

// 通用区块标题
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

// 功能栅格
.menu-wrap {
  margin-bottom: 32rpx;
  background: #fff;
  padding: 32rpx 0;
  border-radius: 16rpx;
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

// 课程列表
.course-wrap {
  background: #fff;
  margin: 0 24rpx;
  border-radius: 16rpx;
  padding: 32rpx 0;
  .course-scroll {
    max-height: 600rpx;
    padding: 0 24rpx;
  }
  .course-card {
    display: flex;
    gap: 24rpx;
    padding-bottom: 32rpx;
    border-bottom: 1rpx solid #f2f2f2;
    margin-bottom: 32rpx;
    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }
    .course-cover {
      width: 180rpx;
      height: 130rpx;
      border-radius: 12rpx;
      flex-shrink: 0;
    }
    .course-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12rpx;
      .course-name {
        font-size: 32rpx;
        color: #222;
        font-weight: 500;
      }
      .course-desc {
        font-size: 26rpx;
        color: #666;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .course-tag-row {
        display: flex;
        align-items: center;
        gap: 16rpx;
        .course-time {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }
}
</style>
