import { validateNull } from './validate'
import * as CryptoJS from 'crypto-js'

/**
 * 判断是否是移动端
 */
export function isMobile() {
  const reg = /phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone/i
  return reg.test(navigator.userAgent)
}

/**
 * 打开小窗口
 */
export function openWindow(url: string, title: string, w: number, h: number) {
  const dualScreenLeft = window.screenLeft ?? screen.left
  const dualScreenTop = window.screenTop ?? screen.top

  const width = window.innerWidth ?? document.documentElement.clientWidth ?? screen.width
  const height = window.innerHeight ?? document.documentElement.clientHeight ?? screen.height

  const left = width / 2 - w / 2 + dualScreenLeft
  const top = height / 2 - h / 2 + dualScreenTop

  return window.open(
    url,
    title,
    `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`,
  )
}

/**
 * 加密处理
 */
export function encryption(src: string, keyWord: string) {
  const key = CryptoJS.enc.Utf8.parse(keyWord)
  const encrypted = CryptoJS.AES.encrypt(src, key, {
    iv: key,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.NoPadding,
  })
  return encrypted.toString()
}

/**
 * 解密
 */
export function decryption(src: string, keyWord: string) {
  const key = CryptoJS.enc.Utf8.parse(keyWord)
  const decryptd = CryptoJS.AES.decrypt(src, key, {
    iv: key,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.NoPadding,
  })
  return decryptd.toString(CryptoJS.enc.Utf8)
}

/**
 * Base64 加密
 */
export function base64Encrypt(src: string) {
  const encodedWord = CryptoJS.enc.Utf8.parse(src)
  return CryptoJS.enc.Base64.stringify(encodedWord)
}

/**
 * 生成唯一 uuid
 */
export function generateUUID() {
  if (typeof crypto === 'object') {
    if (typeof crypto.randomUUID === 'function')
      return crypto.randomUUID()

    if (typeof crypto.getRandomValues === 'function' && typeof Uint8Array === 'function') {
      const callback = (c: string) => {
        const num = Number(c)
        return (num ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))).toString(16)
      }
      return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, callback)
    }
  }

  let timestamp = Date.now()
  const performanceNow = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let random = Math.random() * 16
    if (timestamp > 0) {
      random = (timestamp + random) % 16 | 0
      timestamp = Math.floor(timestamp / 16)
    }
    else {
      random = (performanceNow + random) % 16 | 0
    }
    return (c === 'x' ? random : (random & 0x3) | 0x8).toString(16)
  })
}

/**
 * 获取 URL 参数
 */
export function getQueryString(url: string, paraName: string) {
  const arrObj = url.split('?')
  if (arrObj.length <= 1)
    return ''

  const arrPara = arrObj[1].split('&')
  for (let i = 0; i < arrPara.length; i++) {
    const arr = arrPara[i].split('=')
    if (arr != null && arr[0] === paraName)
      return arr[1]
  }
  return ''
}

/**
 * 列表结构转树结构
 */
export function handleTree(
  data: any[],
  id = 'id',
  parentId = 'parentId',
  children = 'children',
  rootId?: number,
) {
  const cloneData = JSON.parse(JSON.stringify(data))

  if (!rootId) {
    rootId = Math.min(...cloneData.map(item => item[parentId])) || 0
  }

  const treeData = cloneData.filter((father) => {
    const branchArr = cloneData.filter(child => father[id] === child[parentId])
    if (branchArr.length > 0)
      father[children] = branchArr

    return father[parentId] === rootId
  })

  return treeData.length > 0 ? treeData : data
}

/**
 * 驼峰转下划线
 */
export function toUnderline(str: string) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase()
}

/**
 * 自动适配不同的后端架构
 */
export function adaptationUrl(originUrl?: string) {
  const isMicro = import.meta.env.VITE_IS_MICRO
  if (validateNull(isMicro) || isMicro === 'true')
    return originUrl

  return `/admin/${originUrl?.split('/').splice(2).join('/')}`
}

/**
 * 获取不重复的id
 */
export function getNonDuplicateID(length = 8) {
  let idStr = Date.now().toString(36)
  idStr += Math.random().toString(36).substring(3, length)
  return idStr
}

/**
 * 添加单位
 */
export function addUnit(value: string | number, unit = 'px') {
  return Number.isNaN(Number(value)) ? value : `${value}${unit}`
}

/**
 * 解析所有太监节点ID
 */
export function resolveAllEunuchNodeId(json: any[], idArr: any[], temp: any[] = []) {
  for (const item of json) {
    if (item.children && item.children.length !== 0) {
      resolveAllEunuchNodeId(item.children, idArr, temp)
    }
    else {
      temp.push(...idArr.filter(id => id === item.id))
    }
  }
  return temp
}

/**
 * 统一批量导出
 */
const other = {
  isMobile,
  encryption,
  decryption,
  base64Encrypt,
  toUnderline,
  openWindow,
  getQueryString,
  adaptationUrl,
  resolveAllEunuchNodeId,
  getNonDuplicateID,
  addUnit,
}

export default other
