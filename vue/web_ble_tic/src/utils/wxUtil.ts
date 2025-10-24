import {
  showToast,
  showLoadingToast,
  showConfirmDialog,
  allowMultipleToast
} from 'vant'
import wx from 'weixin-js-sdk-ts'

export const toast = (msg: string) => {
  showToast(msg)
}
export const myconfirm = (data: any) => {
  return showConfirmDialog(data)
}

export const navigateTo = (url: any) => {
  wx.miniProgram.navigateTo({
    url,
    complete: function (res) {}
  })
}

export const postMessage = (data: any) => {
  wx.miniProgram.postMessage({
    data
  })
}

export function uint8arrayToBase64(u8Arr: any) {
  let CHUNK_SIZE = 0x8000 //arbitrary number
  let index = 0
  let length = u8Arr.length
  let result = ''
  let slice
  while (index < length) {
    slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length))
    result += String.fromCharCode.apply(null, slice)
    index += CHUNK_SIZE
  }
  // web image base64图片格式: "data:image/png;base64," + b64encoded;
  // return  "data:image/png;base64," + btoa(result);
  return btoa(result)
}

/**
 * base64图片转成file文件
 * @param dataStr
 */
export const base64ToFile = (dataStr: string) => {
  if (dataStr.indexOf('data:image') != 0) {
    //判断是否有这样的头部
    dataStr = 'data:image/jpeg;base64,' + dataStr
  }
  let arr: any = dataStr.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  let fileName = new Date().getTime().toString()

  return new File([u8arr], fileName, { type: mime })
}

/**
 *
 * @param dataStr
 * @returns
 */
export const base64ToBlob = (dataStr: string) => {
  let arr: any = dataStr.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new Blob([u8arr], { type: mime })
}
let _toast: any = null
export const showLoading = (message = '加载中...', duration = 3000) => {
  allowMultipleToast()
  _toast = showLoadingToast({
    message,
    duration,
    forbidClick: true
  })
}
export const closeLoading = () => {
  if (_toast) {
    _toast.close()
    _toast = null
  }
}
export const timeFormat = (millisecond: number) => {
  let time = millisecond
  let hour = Math.floor(time / 60 / 60)
  let minute = Math.floor(time / 60) % 60
  let second = Math.floor(time) % 60
  let res = `0${minute}`.slice(-2) + ':' + `0${second}`.slice(-2)
  if (hour > 0) {
    res = `0${hour}`.slice(-2) + ':' + res
  }
  return res
}

export const isAndroid = (): boolean => {
  return /android/.test(navigator.userAgent.toLowerCase())
}

export const isIOS = (): boolean => {
  return /ios|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
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

export const getQueryString = (name: string) => {
  let querySearch =
    location.search.substr(1) || location.hash.split('?')[1] || ''
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let r = querySearch.match(reg)
  if (r != null) {
    return unescape(r[2])
  }
  return null
}

// 判断当前页面是否处在微信中
export function isMiniprogram() {
  const ua: any = window.navigator.userAgent.toLowerCase()
  let isInMiniprogram = false

  if (ua.match(/miniProgram/i) == 'miniprogram') {
    isInMiniprogram = true
  }
  return isInMiniprogram
}
