import Http from '@/services/http'

// 注销账号
export const accountClose = (params: any) => {
  return Http.request({
    url: '/user/account/accountClose',
    params,
    method: 'post'
  })
}

// 注销获取验证码
export const getCloseCode = (params: any) => {
  return Http.request({
    url: '/user/account/accountClose/sendSms',
    params,
    method: 'get',
    returnAll: true
  })
}

// 获取验证码
export const getCode = (params: any) => {
  return Http.request({
    url: '/user/account/sendSms',
    params,
    method: 'get',
    returnAll: true
  })
}
/**
 * 登录
 * */
export const login = (params: any) => {
  return Http.request({
    url:
      '/user/account/login?companyId=' +
      (['employee-paint.mobvoi.com'].includes(location.hostname)
        ? 'employee'
        : ''),
    params,
    method: 'post',
    returnAll: true
  })
}

export const getUserInfo = (params?: any) => {
  return Http.request({
    url: '/user/account/userinfo',
    params,
    method: 'get',
    returnAll: true
  })
}
