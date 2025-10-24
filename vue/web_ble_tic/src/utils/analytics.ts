import store from '@/store'
const w: any = window

export const initCollect = () => {
  w.collectEvent('init', {
    app_id: process.env.VUE_APP_TICO_ENV !== 'prd' ? 510558 : 510556,
    channel: 'cn',
    log: process.env.VUE_APP_TICO_ENV !== 'prd' ? true : false,
    autotrack: false //默认关闭，需要热力图及圈选功能可开启
  })
  w.collectEvent('start')
  w.collectEvent('config', {
    disable_auto_pv: true
  })
}
// w.collectEvent('beconEvent','login_succeed') //页面在跳转前上报

export const loginEvent = (method: string = '') => {
  w.collectEvent('login', {
    method
  })
}

export const setUuid = (userId: any = '') => {
  w.collectEvent('config', {
    user_unique_id: userId //设置唯一用户ID
  })
}

export const promotEvent = (params: {}) => {
  w.collectEvent('promot', {
    ...params
  })
}

export const pageEvent = (name: string = '', path: string = '') => {
  w.collectEvent('predefinePageView', {
    title: name,
    url_path: path
  })
}

export const buttonClickEvent = (button_name: any) => {
  w.collectEvent('button_click', {
    button_name
  })
}

//页面停留时间统计事件
export const keepTimeEvent = (
  type: any,
  url_path: any,
  title: any,
  standing_time: any,
  previous_page?: any
) => {
  if (type == 'jump') {
    w.collectEvent('beconEvent', 'keep_time', {
      url_path,
      title,
      standing_time,
      previous_page
    })
  } else {
    w.collectEvent('keep_time', {
      url_path,
      title,
      standing_time,
      previous_page
    })
  }
}

//成功的操作 事件  //登录成功 支付成功
export const successEvent = (
  success_event_name: any,
  click_time: any,
  params?: any
) => {
  w.collectEvent('success', {
    success_event_name, //成功的事件名
    click_time, //成功使用的时间
    ...params //其他参数
  })
}

//关闭页面事件
export const closePageEvent = (url_path: any, title: any) => {
  w.collectEvent('beconEvent', 'close_page', {
    url_path,
    title
  })
}

//统计下载点击次数
export const downLoadEvent = (resources_type: any, resources_url: any) => {
  w.collectEvent('download_num', {
    resources_type,
    resources_url
  })
}
