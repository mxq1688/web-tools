import Cookie from 'js-cookie'

export default class CookieUtils {
  // constructor() {}
  static setCookie(key: any, value: any, minute = 30) {
    Cookie.set(key, value, { expires: minute / 24 / 60 })
  }
  static getCookie(key: any) {
    return Cookie.get(key)
  }
  static removeCookie(key: any) {
    Cookie.remove(key)
  }
  static setLocalStorage(key: any, value: any) {
    window.localStorage.setItem(key, value)
  }
  static getLocalStorage(key: any) {
    return window.localStorage.getItem(key)
  }
  static removeLocalStorage(key: any) {
    window.localStorage.removeItem(key)
  }
  static removeAllLocalStorage() {
    window.localStorage.clear()
  }
}
