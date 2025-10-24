/*
 * @Title:
 * @Author: Liy
 * @Date: 2022-01-05 16:35:31
 * @Description:
 */

import { computed } from "vue";

export const formatDate = function (d: any, f?: any) {
  const formatType = f || "YYYY-MM-DD HH:mm:ss";
  const date = new Date(d);
  const YY = date.getFullYear() + "-";
  const MM =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  const DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  const hh =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  const mm =
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
    ":";
  const ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  if (formatType === "YYYY-MM-DD") {
    return YY + MM + DD;
  } else {
    return YY + MM + DD + " " + hh + mm + ss;
  }
};


export const SessionSet = (key = '', data) => {
  window.sessionStorage.setItem(key, JSON.stringify(data))
}

export const SessionGet = (key = '') => {
  return JSON.parse(window.sessionStorage.getItem(key) || '{}')
}

const getFileSize = (fileSize) => {
  let size = Number(fileSize)
  if (size < 1024) {
    return `${size}B`
  } else if (size >= 1024 && size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)}KB`
  } else {
    return `${(size / 1024 / 1024).toFixed(2)}MB`
  }
}

export const setMoney = (money) => {
  let m = Number(money)
  if (m < 10000) {
    return `${m}元`
  } else if (m >= 10000) {
    return `${(m / 10000).toFixed(2)}万元`
  }
}

export const getFormatMoney = computed(() => {
  return (money) => setMoney(money)

})

export const filesSize = computed(() => {
  return (size) => getFileSize(size)
})


export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
export const isSupportMse =
  window.MediaSource &&
  window.MediaSource.isTypeSupported(
    'video/mp4; codecs="avc1.42E01E,mp4a.40.2"'
  )

export const getQueryParam = (key: string) => {
  const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return decodeURI(r[2])
  }
  return null
}

export function getHashParams(key: string) {
  const hash = window.location.hash.substring(1); // 移除开头的 '#'
  const query = hash.split('?')[1]
  const regex = /([^&=]+)=([^&]*)/g; // 正则表达式匹配键值对
  let match;
  const params = {};
  while ((match = regex.exec(query)) !== null) {
      const key = decodeURIComponent(match[1]);
      const value = decodeURIComponent(match[2]);
      params[key] = value;
  }
  return params[key];
}