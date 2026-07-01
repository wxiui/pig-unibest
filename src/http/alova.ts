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

// 创建toast实例
const toast = useToast()

// 1. 重写认证配置（强制指定 token 格式 + 兼容 424）
const { onAuthRequired, onResponseRefreshToken } = createServerTokenAuthentication<
  typeof VueHook,
  typeof uniappRequestAdapter
>({
  // 如果下面拦截不到，请使用 refreshTokenOnSuccess by 群友@琛
  refreshTokenOnError: {
    isExpired: (error) => {
      return error.response?.status === ResultEnum.Unauthorized
    },
    handler: async () => {
      try {
        // await authLogin();
      }
      catch (error) {
        // 切换到登录页
        toLoginPage({ mode: 'reLaunch' })
        throw error
      }
    },
  },
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

    const ignoreAuth = !config.meta?.ignoreAuth
    console.log('ignoreAuth===>', ignoreAuth)
    // 处理认证信息   自行处理认证问题
    if (ignoreAuth) {
      const token = 'getToken()'
      if (!token) {
        throw new Error('[请求错误]：未登录')
      }
      // method.config.headers.token = token;
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
    // eslint-disable-next-line style/no-mixed-operators
    if (statusCode !== 424 && statusCode < 500 && statusCode >= 400 || statusCode >= 500) {
      const errorMessage = ShowMessage(statusCode) || `HTTP请求错误[${statusCode}]`
      console.error('errorMessage===>', errorMessage)
      toast.error(errorMessage)
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
        toast.show(message)
      }
      throw new Error(`请求错误[${code}]：${message}`)
    }
    return data
  }),
})

export const http = alovaInstance
