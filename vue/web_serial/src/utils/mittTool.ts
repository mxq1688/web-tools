import mitt from 'mitt'

const _emitter = mitt()

const EVENTS: any = {
  REFRESH_TASK: 'refresh_task',

  RATIO: 'ratio',
  ISLOADING: 'isLoading',
  IMGLIST: 'imgList',
  IMGSHOW: 'imgShow',
  IMGNUM: 'imgNum',
  CANCEL_TOKEN: 'cancel_token',
  ISERROR: 'is_error',
  CREATED: 'created',
  DELETE_IMG: 'delete_img',

  RATIO_SIMILAR: 'ratio_similar',
  ISLOADING_SIMILAR: 'isLoading_similar',
  IMGLIST_SIMILAR: 'imgList_similar',
  IMGSHOW_SIMILAR: 'imgShow_similar',
  IMGNUM_SIMILAR: 'imgNum_similar',
  CANCEL_TOKEN_SIMILAR: 'cancel_token_similar',
  ISERROR_SIMILAR: 'is_error_similar',
  CREATED_SIMILAR: 'created_similar',
  DELETE_SIMILAR_IMG: 'delete_similar_img',

  RATIO_APPLY: 'ratio_apply',
  ISLOADING_APPLY: 'isLoading_apply',
  IMGLIST_APPLY: 'imgList_apply',
  IMGSHOW_APPLY: 'imgShow_apply',
  IMGNUM_APPLY: 'imgNum_apply',
  CANCEL_TOKEN_APPLY: 'cancel_token_apply',
  ISERROR_APPLY: 'is_error_apply',
  CREATED_APPLY: 'created_apply',
  DELETE_APPLY_IMG: 'delete_apply_img',

  RATIO_REPLACE: 'ratio_replace',
  ISLOADING_REPLACE: 'isLoading_replace',
  IMGLIST_REPLACE: 'imgList_replace',
  IMGSHOW_REPLACE: 'imgShow_replace',
  IMGNUM_REPLACE: 'imgNum_replace',
  CANCEL_TOKEN_REPLACE: 'cancel_token_replace',
  ISERROR_REPLACE: 'is_error_replace',
  CREATED_REPLACE: 'created_replace',
  DELETE_REPLACE_IMG: 'delete_replace_img',

  PAY_SUCCESS: 'pay_success'
}

export default {
  on: _emitter.on,
  off: _emitter.off,
  emit: _emitter.emit,
  EVENTS
}
