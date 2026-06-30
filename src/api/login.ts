import type {
  IAuthLoginRes,
  ICaptcha,
  IUpdateInfo,
  IUserInfoRes,
} from './types/login'
import { http } from '@/http/http'
import * as CryptoJS from 'crypto-js'
import other from '@/utils/other'

/**
 * https://www.ietf.org/rfc/rfc6749.txt
 * OAuth 协议 4.3.1 要求格式为 form 而不是 JSON 注意！
 */
const FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded';

/**
 * 登录表单类型定义
 */
export interface ILoginForm {
  username: string
  password: string
  grant_type: string
  code: string
  randomStr: string
}

/**
 * 获取验证码
 * @returns Promise<ICaptcha> 验证码信息
 */
export function getCode(): Promise<ICaptcha> {
  return http.get<ICaptcha>('/user/getCode')
}

/**
 * 用户登录
 * @param loginForm 登录表单数据
 * @returns Promise<IAuthLoginRes> 登录结果
 */
/**
 * 用户登录（最终修复版）
 * @param loginForm 登录表单数据
 * @returns Promise<IAuthLoginRes> 登录结果
 */
export function login(loginForm: ILoginForm): Promise<IAuthLoginRes> {
  // 1. 复制表单数据，避免修改原对象
  const data = { ...loginForm }

  // 2. 密码加密（和Web端同步）
  if (import.meta.env.VITE_PWD_ENC_KEY) {
    data.password = other.encryption(data.password, import.meta.env.VITE_PWD_ENC_KEY)
  }

  // 3. 生成 Basic Auth 头（修复 CryptoJS 未定义问题）
  const client = import.meta.env.VITE_OAUTH2_PASSWORD_CLIENT || '' // 兜底避免空值
  console.log('CryptoJS:', CryptoJS) // 现在能打印出对象，不会是 undefined
  const basicAuth = `Basic ${CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(client))}`
  uni.setStorageSync('basicAuth', basicAuth)
  console.log(data)
  // 4. 发起请求，补充所有必要头信息
  return http.post<IAuthLoginRes>(
    '/auth/oauth2/token',
    data,
    {},
    {
      'skipToken': true,
      'Authorization': basicAuth,
      'Content-Type': FORM_CONTENT_TYPE,
    },
  )
}

/**
 * 刷新Token
 * @param refreshToken 刷新令牌
 * @returns Promise<IDoubleTokenRes> 新的Token信息
 */
export function refreshToken(refreshToken: string): Promise<IAuthLoginRes> {
  const grant_type = 'refresh_token'
  const scope = 'server'
  // 1. 复制表单数据，避免修改原对象
  const data = { refreshToken, grant_type, scope }
  // 获取当前选中的 basic 认证信息
  const basicAuth = uni.getStorageSync('basicAuth')
  return http.post<IAuthLoginRes>(
    '/auth/oauth2/token',
    data,
    {},
    {
      'skipToken': true,
      'Authorization': basicAuth,
      'Content-Type': FORM_CONTENT_TYPE,
    },
  )
}

/**
 * 获取用户信息
 * @returns Promise<IUserInfoRes> 用户信息
 */
export function getUserInfo(): Promise<IUserInfoRes> {
  return http.get<IUserInfoRes>('/admin/user/info')
}

/**
 * 退出登录
 * @returns Promise<void>
 */
export function logout(): Promise<void> {
  return http.delete<void>('/auth/token/logout')
}

/**
 * 修改用户信息
 * @param data 用户信息修改参数
 * @returns Promise<any>
 */
export function updateInfo(data: IUpdateInfo): Promise<any> {
  return http.post('/user/updateInfo', data)
}

/**
 * 获取微信登录凭证
 * @returns Promise<UniApp.LoginRes> 包含微信登录code的结果
 */
export function getWxCode(): Promise<UniApp.LoginRes> {
  return new Promise<UniApp.LoginRes>((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: res => resolve(res),
      fail: err => reject(new Error(err.errMsg || '微信登录获取凭证失败')),
    })
  })
}

/**
 * 微信登录
 * @param data 微信登录参数（包含code）
 * @returns Promise<IAuthLoginRes> 微信登录结果
 */
export function wxLogin(data: { code: string }): Promise<IAuthLoginRes> {
  return http.post<IAuthLoginRes>('/auth/wxLogin', data)
}
