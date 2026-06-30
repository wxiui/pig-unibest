import type {
  IUpdatePassword,
} from './types/login'
import { http } from '@/http/http'
/**
 * 修改用户密码
 * @param data 密码修改参数
 * @returns Promise<any>
 */
export function updateUserPassword(data: IUpdatePassword): Promise<any> {
  return http.put('/admin/user/password', data)
}
