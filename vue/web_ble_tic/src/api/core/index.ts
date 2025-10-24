import Http from '@/services/http'
import axios from 'axios'
import MittTool from '@/utils/mittTool'
const { CancelToken } = axios
/*
  获取config
*/
export const getConfig = (params?: {}) => {
  return Http.request({
    url: 'core/image/param/config',
    params,
    method: 'get'
  })
}

/*
  智能补全
  {
    text
  }
*/
export const completion = (params?: {}) => {
  return Http.request({
    url: 'core/image/core/intelligent/completion',
    params,
    method: 'post'
  })
}

/*
  文生图
  moduleType 1 文生图 2相似图片 3图片完善 4局部替换
  {
    mask_image  string  遮挡图片，只生成mask部分的图片，base64编码，可选
    model   string  选用的模型，默认是古风人物模型，可选
    negative_prompt string  反向提示文案，可选
    num_images_per_prompt   integerint32    每个prompt生成图片的数量，默认是1，可选
    original_image  string  原始图片，用于图生图，base64编码，可选
    prompt  string  提示文案，必选
    ratio   string  比例1:1
    strength    numberfloat   对原始图片的扰动系数（0-1），用于图生图，默认0.8，0改动最小，1改动最大，可选
    style   string  生成的风格，比如：二次元、古风等，可选
    use_matting boolean 是否使用抠图 默认false
    visual  string  视角
    width_height    string  比例像素，默认512:512
  }
*/
export const text2pic = (params?: {}, moduleType?: any, config: {} = {}) => {
  return Http.request({
    url: '/core/image/core/text2pic/' + moduleType,
    params,
    method: 'post',
    config: {
      timeout: 0,
      ...config
    }
  })
}

/*
  批量保存
  {
    batchCancelUsingPOSTResultids
  }
*/
export const batchSave = (params?: {}) => {
  return Http.request({
    url: '/core/image/result/batch/save',
    params,
    method: 'post'
  })
}

/*
  批量下载 超分图 批量zip  单张 png
  {
  }
*/
export const batchDownload = (params?: any) => {
  return Http.request({
    url: '/core/image/result/download',
    params,
    method: 'post',
    returnAll: true,
    config: {
      responseType: 'blob',
      timeout: 0
    }
  })
}

/*
  点赞
  {
    resultId
  }
*/
export const thumbsup = (params?: any) => {
  return Http.request({
    url: 'core/image/result/thumbsup?resultId=' + params?.resultId,
    params,
    method: 'post'
  })
}
/*
  差评
  {
    resultId
  }
*/
export const negative = (params?: any) => {
  return Http.request({
    url: 'core/image/result/negative?resultId=' + params?.resultId,
    params,
    method: 'post'
  })
}

/*
  图片详情
  {
    resultId
  }
*/
export const imgDetail = (params?: any) => {
  return Http.request({
    url: 'core/image/result/detail/' + params?.resultId,
    params,
    method: 'get'
  })
}

/*
  图片生成文本
  {
    resultId
  }
*/
export const imgCreateText = (params?: any) => {
  return Http.request({
    url: 'core/image/core/img2prompt',
    params,
    method: 'post'
  })
}

// 模型
export const modelToImg = (params?: any) => {
  return Http.request({
    url: 'core/model/inference',
    params,
    method: 'post',
    config: {
      timeout: 0
    }
  })
}

export const modelToImgProgress = (params?: any) => {
  return Http.request({
    url: 'core/model/inferprogress',
    params,
    method: 'get',
    returnAll: true
  })
}

export const modelTrain = (params?: any) => {
  return Http.request({
    url: 'core/model/train',
    params,
    method: 'post',
    config: {
      timeout: 0
    }
  })
}

// api_run_name
export const modelTrainProgress = (params?: any) => {
  return Http.request({
    url: 'core/model/trainprogress',
    params,
    method: 'get',
    returnAll: true
  })
}

export const modelList = (params?: any) => {
  return Http.request({
    url: 'core/model/modelList',
    params,
    method: 'get'
  })
}

//获取生成图片扣减sku详情
export const genSku = (params?: any) => {
  return Http.request({
    url: 'user/sku/genSku',
    params,
    method: 'get'
  })
}

//获取订单详情
export const getOrderDetail = (params?: any) => {
  return Http.request({
    url: 'core/order/h5Info/' + params.taskId,
    params,
    method: 'get'
  })
}

//alipay h5
export const aliPay = (params?: any) => {
  return Http.request({
    url: 'core/order/alipay/h5/' + params.taskId,
    params,
    method: 'post'
  })
}

/**
 * 获取会员等级列表
 * @returns
 */
export function getVipList(params: any) {
  return Http.request({
    url: '/user/sku/vipList/2',
    method: 'GET',
    params
  })
}

/**
 * 获取画豆套餐
 * @returns
 */
export function getCoinList(params: any) {
  return Http.request({
    url: '/user/sku/coinList/2',
    method: 'GET',
    params
  })
}

/**
 * 私人画展列表
 * @returns
 */
export function getPhotoList(params: any) {
  return Http.request({
    url: `/core/image/result/pagelist/${params.moduleType}`,
    method: 'get',
    params
  })
}

/**
 * 删除画展图片
 * @returns
 */
export function delPhoto(params: any) {
  return Http.request({
    url: `/core/image/result/check/cancel`,
    method: 'POST',
    params,
    withGetParams: true
  })
}

/**
 * 下载图片 小图  超分图 批量zip  单张 png
 * @returns
 */
export function batchOriginDownload(params: any) {
  return Http.request({
    url: `/core/image/result/origin/download`,
    method: 'POST',
    params,
    returnAll: true,
    config: {
      responseType: 'blob',
      timeout: 0
    }
  })
}

/**
 * 下载图片 小图 单个下载
 * @returns
 */
export function singleOriginDownload(params: any) {
  return Http.request({
    url: `/core/image/result/single/download`,
    method: 'get',
    params,
    config: {
      responseType: 'blob',
      timeout: 0
    }
  })
}

/**
 * 任务列表
 * @returns
 */
export function getTaskList(params: any) {
  return Http.request({
    url: `/core/image/result/taskPage/${params.moduleType}`,
    method: 'get',
    params
  })
}

/**
 * 删除任务
 * @returns
 */
export function delTask(params: any) {
  return Http.request({
    url: `/core/image/result/task/delete/${params.taskId}`,
    method: 'POST',
    params
  })
}

/**
 * 删除任务
 * @returns
 */
export function delTaskBatch(params: any) {
  return Http.request({
    url: `/core/image/result/task/batchDelete`,
    method: 'POST',
    params
  })
}

/**
 * 任务详情
 * @returns
 */
export function getTaskDetail(params: any) {
  return Http.request({
    url: `/core/image/result/protocol/${params.taskId}`,
    method: 'get',
    params
  })
}

/**
 * 风格
 * @returns
 */
export function getStyleList(params?: any) {
  return Http.request({
    url: `/core/gwskip/ig/style/dataList`,
    method: 'get',
    params
  })
}
