import type { IUserInfoRes } from '@/api/types/login'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getUserInfo,
} from '@/api/login'

// 初始化状态
const userInfoState: IUserInfoRes = {
  userId: -1,
  username: '',
  nickname: '',
  name: '',
  avatar: '/static/images/default-avatar.png',
  phone: null,
  email: null,
  salt: null,
  wxOpenid: null,
  qqOpenid: null,
  giteeOpenId: null,
  oscOpenId: null,
  createTime: '',
  updateTime: '',
  delFlag: '0',
  lockFlag: '0',
  companyId: '',
  dept: undefined,
  roleList: [],
  postList: [],
  dutyList: [],
  jobTypeList: [],
  permissions: [],
}

export const useUserStore = defineStore(
  'user',
  () => {
    // 定义用户信息
    const userInfo = ref<IUserInfoRes>({ ...userInfoState })
    // 设置用户信息
    const setUserInfo = (val: IUserInfoRes) => {
      console.log('设置用户信息JSON.stringify(val)', JSON.stringify(val))
      // 若头像为空 则使用默认头像
      console.log('val.avatar', val.avatar)
      if (!val.avatar) {
        console.log('val.avatar2', val.avatar)
        val.avatar = userInfoState.avatar
      }
      // 全部数据写入store
      console.log('val', val.avatar)
      userInfo.value = { ...val }
      console.log('userInfo.value', val.avatar)
    }
    const setUserAvatar = (avatar: string) => {
      userInfo.value.avatar = avatar
      console.log('设置用户头像', avatar)
      console.log('userInfo', userInfo.value)
    }
    // 删除用户信息
    const clearUserInfo = () => {
      userInfo.value = { ...userInfoState }
      uni.removeStorageSync('user')
    }

    /**
     * 获取用户信息
     */
    const fetchUserInfo = async () => {
      const res = await getUserInfo()
      setUserInfo(res)
      return res
    }

    return {
      userInfo,
      clearUserInfo,
      fetchUserInfo,
      setUserInfo,
      setUserAvatar,
    }
  },
  {
    persist: true,
  },
)
