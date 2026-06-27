import type { uniappRequestAdapter } from '@alova/adapter-uniapp'
import type { IResponse } from './types'
import AdapterUniapp from '@alova/adapter-uniapp'
import { createAlova } from 'alova'
import { createServerTokenAuthentication } from 'alova/client'
import VueHook from 'alova/vue'
import { toLoginPage } from '@/utils/toLoginPage'
import { ContentTypeEnum, ResultEnum, ShowMessage } from './tools/enum'

export const API_DOMAINS = {
  DEFAULT: import.meta.env.VITE_SERVER_BASEURL,
  SECONDARY: import.meta.env.VITE_SERVER_BASEURL_SECONDARY,
}

// 1. 重写认证配置（强制指定 token 格式 + 兼容 424）
const { onAuthRequired, onResponseRefreshToken } = createServerTokenAuthentication<
  typeof VueHook,
  typeof uniappRequestAdapter
>({
  // 🔥 关键1：指定 token 格式为 Bearer {token}
  token: () => {
    const token = uni.getStorageSync('token') || ''
    return token ? `Bearer ${token}` : '' // 直接返回完整的 Authorization 值
  },
  // 🔥 关键2：424 也判定为 token 过期
  refreshTokenOnError: {
    isExpired: (error) => {
      return error.response?.status === ResultEnum.Unauthorized || error.response?.status === 424
    },
    handler: async () => {
      try {
        // 刷新 token 逻辑（后续补充）
        const tokenStore = (await import('@/stores/token')).useTokenStore()
        await tokenStore.refreshToken()
      }
      catch (error) {
        toLoginPage({ mode: 'reLaunch' })
        throw error
      }
    },
  },
  // 🔥 关键3：强制设置 Authorization 头的 key
  authHeader: 'Authorization',
})

// 2. 创建 alova 实例
const alovaInstance = createAlova({
  baseURL: API_DOMAINS.DEFAULT,
  ...AdapterUniapp(),
  timeout: 5000,
  statesHook: VueHook,

  beforeRequest: onAuthRequired((method) => {
    // 🔥 修复：Content-Type 字段名错误（ContentType → Content-Type）
    method.config.headers = {
      'Content-Type': ContentTypeEnum.JSON,
      'Accept': 'application/json, text/plain, */*',
      ...method.config.headers,
    }

    // 处理动态域名
    const { config } = method
    if (config.meta?.domain) {
      method.baseURL = config.meta.domain
    }

    // 🔥 关键4：登录接口强制跳过认证（避免循环加 token）
    if (method.url?.includes('oauth2/token')) {
      method.config.meta = { ...method.config.meta, ignoreAuth: true }
    }
  }),

  responded: onResponseRefreshToken((response, method) => {
    const { config } = method
    const { requestType } = config
    const {
      statusCode,
      data: rawData,
      errMsg,
    } = response as UniNamespace.RequestSuccessCallbackResult

    // 处理上传/下载
    if (requestType === 'upload' || requestType === 'download') {
      return response
    }

    // 🔥 关键5：兼容 424 状态码（业务自定义 token 过期码，不拦截）
    if (statusCode >= 400 && statusCode < 500 && statusCode !== 424 || statusCode >= 500) {
      const errorMessage = ShowMessage(statusCode) || `HTTP请求错误[${statusCode}]`
      console.error('errorMessage===>', errorMessage)
      uni.showToast({
        title: errorMessage,
        icon: 'error',
      })
      throw new Error(`${errorMessage}：${errMsg}`)
    }

    // 🔥 关键6：兼容登录接口无 code 的响应
    if (method.url?.includes('oauth2/token')) {
      return rawData // 登录接口直接返回，不判断 code
    }

    // 正常接口处理 code
    const { code, message, data } = rawData as IResponse
    if (code !== ResultEnum.Success0 && code !== ResultEnum.Success200) {
      if (config.meta?.toast !== false) {
        uni.showToast({
          title: message,
          icon: 'none',
        })
      }
      throw new Error(`请求错误[${code}]：${message}`)
    }
    return data
  }),
})

export const http = alovaInstance
