export const inputNum = (value: any, pointLength?: number) => {
  if (value == undefined) return
  value = value
    .replace(/[^\d.]/g, '')
    .replace(/\.{2,}/g, '.')
    .replace('.', '$#$')
    .replace(/\./g, '')
    .replace('$#$', '.')
    .replace(/^\./g, '')

  if (pointLength && pointLength >= 0)
    return value.match(/^\d*(\.?\d{0,2})/g)[0]
  else return value
}

const strategies: any = {
  isNonEmpty: function (value: string, errMsg?: string) {
    if (
      value === '' ||
      value === undefined ||
      value === null ||
      value.length == 0
    ) {
      return errMsg || true
    }
  },
  minLenth: function (value: string, length: number, errMsg?: string) {
    if (value.length < length) {
      return errMsg || true
    }
  },
  isMobile: function (value: string, errMsg?: string) {
    if (!/^1[3|5|8][0-9]{9}$/.test(value)) {
      return errMsg || true
    }
  }
}
export default class Validator {
  cache: any[]
  constructor() {
    this.cache = []
  }

  add(value: any, rule: any, errMsg?: string) {
    const arr = rule.split(':')
    this.cache.push(() => {
      const strategy = arr.shift()
      arr.unshift(value)
      arr.push(errMsg)

      return strategies[strategy](...arr)
    })
  }
  addBatch(dom: any, values: any[], rule: any, errMsg?: string) {
    values.forEach((item) => {
      this.add(eval('dom.' + item), rule, errMsg)
    })
  }

  start() {
    for (let i = 0; i < this.cache.length; i++) {
      const msg = this.cache[i]()
      if (msg) return msg
    }
  }
}

// const validator = new Validator();
// 	validator.add(form.userName, 'isNonEmpty', '用户名不能为空');
// 	validator.add(form.password, 'minLength:6', '密码长度不能少于6位');
// 	validator.add(form.phoneNumber, 'isMobile', '手机号码格式不正确');
// 	const errMsg = validator.start();
// 	if (errMsg) {
// 		alert(errMsg);
// 		return false;
// 	}
