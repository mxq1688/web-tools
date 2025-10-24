import Http from '@/services/http'
import axios from 'axios'
import MittTool from '@/utils/mittTool'
const { CancelToken } = axios
/*
  充值记录
*/
export const rechargeList = (params?: {}) => {
  return Http.request({
    url: 'core/order/rechargeList',
    params,
    method: 'get'
  })
}

/*
  消费记录
*/
export const costList = (params?: {}) => {
  return Http.request({
    url: 'core/order/costList',
    params,
    method: 'get'
  })
}

/*
  消费|退豆记录
*/
export const detailList = (params?: {}) => {
  return Http.request({
    url: 'core/order/detailList',
    params,
    method: 'get'
  })
}

/*
  获取商品
*/
export const coinList = (params?: {}) => {
  return Http.request({
    url: 'user/sku/coinList/1',
    params,
    method: 'get'
  })
}

/*
  获取会员列表
*/
export const vipList = (params?: {}) => {
  return Http.request({
    url: 'user/sku/vipList/1',
    params,
    method: 'get'
  })
}

/*
  创建订单
  payType 支付方式 2:微信支付 3支付宝支付
  skuCounts sku个数，默认1
  skuId
*/
export const createOrder = (params?: {}) => {
  return Http.request({
    url: 'core/order/submit',
    params,
    method: 'post'
  })
}

/*
  订单状态
*/
export const orderStatus = (params: any) => {
  return Http.request({
    url: 'core/order/status/' + params.orderId,
    params,
    method: 'get'
  })
}

/*
  申请体验
  "destination": "string",
  "name": "string",
  "position": "string"
*/
export const applyUse = (params: any) => {
  return Http.request({
    url: 'user/account/applyUse',
    params,
    method: 'post'
  })
}

/*
  举报反馈
  {
    reportedReason
    taskId
  }
*/
export const report = (params: any) => {
  return Http.request({
    url: 'core/image/result/report',
    params,
    method: 'post'
  })
}
