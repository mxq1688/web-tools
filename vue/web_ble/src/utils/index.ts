export function debounce(fn: any, delay: any) {
  let timer: any = null //借助闭包
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(fn, delay)
  }
}

export function throttle(fn: any, delay: any) {
  let valid = true
  return function () {
    if (!valid) {
      //休息时间 暂不接客
      return false
    }
    // 工作时间，执行函数并且在间隔期内把状态位设为无效
    valid = false
    setTimeout(() => {
      fn()
      valid = true
    }, delay)
  }
}

export const verification = (reg: any) => {
  return (str: string): boolean => {
    if (reg.test(str)) {
      return true
    }
    return false
  }
}

export function swapArray(array: any, index1: number, index2: number) {
  // arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  console.log(index1, index2)
  ;[array[index1], array[index2]] = [array[index2], array[index1]]
  return array
}

export const removeArray = (arr: any, item: number) => {
  if (arr.includes(item)) {
    const index = arr.indexOf(item)
    arr.splice(index, 1)
  }
}

// 文件流转blob对象下载
export function downloadFile(data: any, type: any, fileName?: any) {
  // const blob = new Blob([data], { type: 'application/octet-stream;charset=utf-8' });
  // const blob = new Blob([data], { type: `charset=utf-8` })
  // 获取heads中的filename文件名
  const downloadElement = document.createElement('a')
  const urlObject = window.URL || window.webkitURL || window
  // 创建下载的链接
  const href = urlObject.createObjectURL(data)
  downloadElement.href = href
  // 下载后文件名
  downloadElement.download = fileName
  document.body.appendChild(downloadElement)
  // 点击下载
  downloadElement.click()
  // 下载完成移除元素
  document.body.removeChild(downloadElement)
  // 释放掉blob对象
  urlObject.revokeObjectURL(href)
}

export const download = (link: any, picName: any) => {
  let img = new Image()
  img.setAttribute('crossOrigin', 'Anonymous')
  img.onload = function () {
    let canvas = document.createElement('canvas')
    let context: any = canvas.getContext('2d')
    canvas.width = img.width
    canvas.height = img.height
    context.drawImage(img, 0, 0, img.width, img.height)
    let url = canvas.toDataURL('images/png')
    let a = document.createElement('a')
    let event = new MouseEvent('click')
    a.download = picName || 'default.png'
    a.href = url
    a.dispatchEvent(event)
  }
  img.src = link + '?v=' + Date.now()
}

// 回到顶部
export const scrollTopTo = (data: any) => {
  window.scrollTo({
    top: data.top || 0,
    behavior: data.behavior || 'smooth'
  })
}

export const getOpacityColor = (thisColor: any, thisOpacity: any) => {
  if (!thisColor) {
    return 'transparent'
  }
  let theColor = thisColor.toLowerCase()
  //十六进制颜色值的正则表达式
  let r = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  // 如果是16进制颜色
  if (theColor && r.test(theColor)) {
    if (theColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += theColor.slice(i, i + 1).concat(theColor.slice(i, i + 1))
      }
      theColor = sColorNew
    }
    //处理六位的颜色值
    let sColorChange = []
    for (let j = 1; j < 7; j += 2) {
      sColorChange.push(parseInt('0x' + theColor.slice(j, j + 2)))
    }
    return 'rgba(' + sColorChange.join(',') + ',' + thisOpacity + ')'
  }
  // 如果是rgba或者rgb
  if (theColor.startsWith('rgb')) {
    let numbers = theColor.match(/(\d(\.\d+)?)+/g)
    numbers = numbers.slice(0, 3).concat(thisOpacity)
    return 'rgba(' + numbers.join(',') + ')'
  }

  return theColor
}

/**
 * 手机号检测
 * @param phoneNumber
 * @returns
 */
export const checkPhone = (phoneNumber: any) => {
  const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
  return reg.test(phoneNumber)
}

/**
 * 邮箱检测
 * @param emailNumber
 * @returns
 */
export const checkEmail = (emailNumber: any) => {
  const reg =
    /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*(\.[a-zA-Z0-9]{2,9}){1,2}$/
  return reg.test(emailNumber)
}

// 加密手机号
export const encryptionPhone = (phone: any) => {
  let newPhone = ''
  if (phone) newPhone = phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
  return newPhone
}

export const getImgWH = (url: any) => {
  return new Promise((resolve, reject) => {
    let image = new Image()
    let imgSize = {
      width: 0,
      height: 0
    }
    image.onload = () => {
      imgSize = {
        width: image.width,
        height: image.height
      }
      resolve(imgSize)
    }
    image.src = url
  })
}

/**
 * 判断是否为微信浏览器
 * 兼容ios
 * */
export function isWeiXin() {
  return (
    /micromessenger/i.test(navigator.userAgent.toLowerCase()) ||
    typeof (navigator as any).wxuserAgent !== 'undefined'
  )
}

export const getQueryParam = (key: string) => {
  const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return decodeURI(r[2])
  }
  return null
}

export const limitIpt = (e: any) => {
  const g = /^(?:-1|[1-9]\d*|0)$/
  if (!g.test(e)) return ''
  else if (e > 2147483647) return ''
  else return e
}

export const isMobile = () => {
  const mobile = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
  return mobile
}

export const changeParam = (param: any) => {
  return JSON.stringify(param)
    .replace(/:/g, '=')
    .replace(/,/g, '&')
    .replace(/{/g, '?')
    .replace(/}/g, '')
    .replace(/"/g, '')
}

/**讲对象转换为url参数形式
 * @property {Object} param 将要转换为URL参数的字符串对象
 * @property {String} key URL 参数字符串的前缀
 * @property {Boolean} encode 是否进行URL编码，默认为true
 * @return {String} URL参数字符串
 */
export const urlEncode = (param: any, key: any, encode: boolean) => {
  if (param == null) return ''
  let paramStr = ''
  let t = typeof param
  if (t == 'string' || t == 'number' || t == 'boolean') {
    paramStr +=
      '&' +
      key +
      '=' +
      (encode == null || encode ? encodeURIComponent(param) : param)
  } else {
    for (let i in param) {
      let k =
        key == null
          ? i
          : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
      paramStr += urlEncode(param[i], k, encode)
    }
  }
  return paramStr
}
