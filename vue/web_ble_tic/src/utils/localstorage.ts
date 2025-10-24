export default class Localstorage {
  // constructor() {}
  static setLocalStorage(key: any, value: any) {
    window.localStorage.setItem(key, value)
  }
  static getLocalStorage(key: any) {
    return window.localStorage.getItem(key)
  }
  static removeLocalStorage(key: any) {
    window.localStorage.removeItem(key)
  }
  static removeAll() {
    window.localStorage.clear()
  }
}
