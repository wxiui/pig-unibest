import type { CustomRequestOptions } from '@/http/types'
import { useTokenStore } from '@/store'
import { getEnvBaseUrl } from '@/utils'
import { stringifyQuery } from './tools/queryString'
import other from '@/utils/other'

// 请求基准地址
const baseUrl = getEnvBaseUrl()

// 拦截器配置
const httpInterceptor = {
  // 拦截前触发
  invoke(options: CustomRequestOptions) {
    // 如果您使用了alova，则请把下面的代码放开注释
    // alova 执行流程：alova beforeRequest --> 本拦截器 --> alova responded
    // return options
    options.url = other.adaptationUrl(options.url)
    // 非 alova 请求，正常执行
    // 接口请求支持通过 query 参数配置 queryString
    if (options.query) {
      const queryStr = stringifyQuery(options.query)
      if (options.url.includes('?')) {
        options.url += `&${queryStr}`
      }
      else {
        options.url += `?${queryStr}`
      }
    }
    // 非 http 开头需拼接地址
    if (!options.url.startsWith('http')) {
      // #ifdef H5
      if (JSON.parse(import.meta.env.VITE_APP_PROXY_ENABLE)) {
        // 自动拼接代理前缀
        options.url = import.meta.env.VITE_APP_PROXY_PREFIX + options.url
      }
      else {
        options.url = baseUrl + options.url
      }
      // #endif
      // 非H5正常拼接
      // #ifndef H5
      options.url = baseUrl + options.url
      // #endif
      // TIPS: 如果需要对接多个后端服务，也可以在这里处理，拼接成所需要的地址
    }

    // 1. 请求超时
    options.timeout = 60000 // 60s
    // 2. （可选）添加小程序端请求头标识
    options.header = {
      ...options.header,
    }

    if (!options.header.skipToken) {
      const tokenStore = useTokenStore().updateNowTime()
      const tokenInfo = tokenStore.tokenInfo
      let token = ''
      if (import.meta.env.VITE_AUTH_MODE === 'double') {
        token = (tokenInfo as any)?.accessToken ?? ''
      }
      else {
        token = (tokenInfo as any)?.token ?? ''
      }

      // 兜底：读取独立存储的纯access_token（修复Pinia key冲突，不再读'token'键）
      if (!token) {
        token = uni.getStorageSync('access_token')
      }

      if (token) {
        options.header.Authorization = `Bearer ${token}`
      }
    }

    // 3. 对齐Web：处理Enc-Flag 报文加密逻辑（新增缺失分支）
    const ENC_FLAG = 'Enc-Flag'
    if (options.header[ENC_FLAG]) {
      const enc = other.encryption(JSON.stringify(options.data), import.meta.env.VITE_PWD_ENC_KEY)
      options.data = { encryption: enc }
    }
    return options
  },
}

export const requestInterceptor = {
  install() {
    // 拦截 request 请求
    uni.addInterceptor('request', httpInterceptor)
    // 拦截 uploadFile 文件上传
    uni.addInterceptor('uploadFile', httpInterceptor)
  },
}
