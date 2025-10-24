import Http from '@/services/http'
import { changeParam } from '@/utils'
/*
  小文件上传
*/
export const upload = (params: { file: any }, progressCallback?: Function) => {
  return Http.upload(
    {
      url: 'core/imageUpload/file/upload',
      params
    },
    progressCallback
  )
}
/*
  小文件上传
*/
export const uploadcheck = (
  params: { file: any },
  progressCallback?: Function
) => {
  return Http.upload(
    {
      url: 'core/imageUpload/file/checkPng',
      params
    },
    progressCallback
  )
}

/*
  上传初始化
  {
    fileName  文件名
    fileSize  文件大小 单位 B
  }
*/
export const multiInit = (params: { file: any }) => {
  return Http.upload({
    url: 'core/imageUpload/multi/init',
    params
  })
}

/*
  上传分片
  {
    partNumber  分片号
    uploadId  分片id
    file
  }
*/
export const multiUpload = (params: { file: any }) => {
  return Http.upload({
    url: 'core/imageUpload/multi/upload',
    params
  })
}

/*
  上传分片小文件
  {
    partNumber  分片号
    uploadId  分片id
    file
  }
*/
export const multiUploadFile = (params: { file: any }) => {
  return Http.upload({
    url: 'core/imageUpload/multi/upload/file',
    params
  })
}

/*
  完成分片
*/
export const multiFinish = (params: { file: any }) => {
  return Http.upload({
    url: 'core/imageUpload/multi/finish',
    params
  })
}

/*
  在下咨询
*/
export const contact = (params: any) => {
  return Http.request({
    url: '/core/page/contact',
    params,
    method: 'post',
    returnAll: true
  })
}

export const getSchemeUrl = (params: any) => {
  return Http.request({
    url: `/wxacess${changeParam(params)}`,
    params,
    method: 'post'
  })
}
