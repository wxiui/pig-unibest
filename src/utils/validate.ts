import type { RuleItem } from 'async-validator'

/**
 * 判断是否为空
 * @param val 数据
 */
export function validateNull(val: any) {
  if (typeof val === 'boolean')
    return false

  if (typeof val === 'number')
    return false

  if (Array.isArray(val))
    return val.length === 0

  if (typeof val === 'object' && val !== null)
    return JSON.stringify(val) === '{}'

  return val === 'null' || val == null || val === 'undefined' || val === undefined || val === ''
}

/**
 * 表单校验规则集合
 */
export const rule = {
  /**
   * 校验长度不超过255
   */
  overLength(rule: RuleItem, value: any, callback: (error?: Error) => void) {
    if (value?.length > 255)
      callback(new Error('输入内容过长，请重新输入'))
    else
      callback()
  },

  /**
   * 校验：中文、英文、数字、下划线
   */
  validatorNameCn(rule: RuleItem, value: any, callback: (error?: Error) => void) {
    const reg = /^[\u4E00-\u9FA5\w]+$/
    if (value && !reg.test(value))
      callback(new Error('请输入中文、英文、数字包括下划线'))
    else
      callback()
  },

  /**
   * 校验：大写英文、下划线
   */
  validatorCapital(rule: RuleItem, value: any, callback: (error?: Error) => void) {
    const reg = /^[A-Z_]+$/
    if (value && !reg.test(value))
      callback(new Error('请输入大写英文、下划线'))
    else
      callback()
  },

  /**
   * 校验：小写英文、下划线
   */
  validatorLowercase(rule: RuleItem, value: any, callback: (error?: Error) => void) {
    const reg = /^[a-z_]+$/
    if (value && !reg.test(value))
      callback(new Error('请输入小写英文、下划线'))
    else
      callback()
  },

  /**
   * 校验：纯小写英文
   */
  validatorLower(rule: RuleItem, value: any, callback: (error?: Error) => void) {
    const reg = /^[a-z]+$/
    if (value && !reg.test(value))
      callback(new Error('请输入小写英文'))
    else
      callback()
  },

  /**
   * 校验：首尾不能有空格
   */
  checkSpace(rule: RuleItem, value: any, callback: (error?: Error) => void) {
    const reg = /\S+$/
    if (!reg.test(value))
      callback(new Error('请输入非空格信息'))
    else
      callback()
  },

  /**
   * 校验手机号
   */
  validatePhone(rule: RuleItem, value: any, callback: (error?: Error) => void) {
    const reg = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/

    if (value.includes('****'))
      return callback()

    if (!reg.test(value))
      callback(new Error('请输入合法手机号'))
    else
      callback()
  },

  /** 数字 */
  number(rule: RuleItem, value: any, callback: (error?: Error) => void) {
    validateFn('number', rule, value, callback, '包含非数字字符')
  },

  /** 字母 */
  letter(rule: RuleItem, value: any, callback: (error?: Error) => void) {
    validateFn('letter', rule, value, callback, '包含非字母字符')
  },

  /** 字母+数字 */
  letterAndNumber(rule: RuleItem, value: any, callback: (error?: Error) => void) {
    validateFn('letterAndNumber', rule, value, callback, '只能输入字母或数字')
  },

  /** 手机号 */
  mobilePhone(rule: RuleItem, value: any, callback: (error?: Error) => void) {
    validateFn('mobilePhone', rule, value, callback, '手机号码格式有误')
  },

  /** 字母开头，可包含数字 */
  letterStartNumberIncluded(rule: RuleItem, value: any, callback: (error?: Error) => void) {
    validateFn('letterStartNumberIncluded', rule, value, callback, '必须以字母开头，可包含数字')
  },

  /** 禁止中文 */
  noChinese(rule: RuleItem, value: any, callback: (error?: Error) => void) {
    validateFn('noChinese', rule, value, callback, '不可输入中文字符')
  },

  /** 必须中文 */
  chinese(rule: RuleItem, value: any, callback: (error?: Error) => void) {
    validateFn('chinese', rule, value, callback, '只能输入中文字符')
  },

  /** 邮箱 */
  email(rule: RuleItem, value: any, callback: (error?: Error) => void) {
    validateFn('email', rule, value, callback, '邮箱格式有误')
  },

  /** URL */
  url(rule: RuleItem, value: any, callback: (error?: Error) => void) {
    validateFn('url', rule, value, callback, 'URL格式有误')
  },

  /** 自定义正则 */
  regExp(rule: RuleItem & { regExp?: string, errorMsg?: string }, value: any, callback: (error?: Error) => void) {
    if (validateNull(value) || value.length <= 0) {
      callback()
      return
    }

    const pattern = new RegExp(rule.regExp || '')
    if (!pattern.test(value)) {
      const errTxt = rule.errorMsg || 'invalid value'
      callback(new Error(errTxt))
    }
    else {
      callback()
    }
  },
}

const commonRegExp = {
  number: '^[-]?\\d+(\\.\\d+)?$',
  letter: '^[A-Za-z]+$',
  letterAndNumber: '^[A-Za-z0-9]+$',
  mobilePhone: '^[1][3-9][0-9]{9}$',
  letterStartNumberIncluded: '^[A-Za-z]+[A-Za-z\\d]*$',
  noChinese: '^[^\u4E00-\u9FA5]+$',
  chinese: '^[\u4E00-\u9FA5]+$',
  email: '^([-_A-Za-z0-9.]+)@([_A-Za-z0-9]+\\.)+[A-Za-z0-9]{2,3}$',
  url: '(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]',
}

/**
 * 获取正则表达式
 * @param validatorName 校验规则名称
 */
export function getRegExp(validatorName: keyof typeof commonRegExp) {
  return commonRegExp[validatorName]
}

/**
 * 统一校验方法
 */
function validateFn(
  validatorName: keyof typeof commonRegExp,
  rule: RuleItem,
  value: any,
  callback: (error?: Error) => void,
  defaultErrorMsg: string,
) {
  if (validateNull(value) || value.length <= 0) {
    callback()
    return
  }

  const reg = new RegExp(getRegExp(validatorName))
  if (!reg.test(value)) {
    const errTxt = (rule as any).errorMsg || defaultErrorMsg
    callback(new Error(errTxt))
  }
  else {
    callback()
  }
}
