import WARN from '@/assets/images/warning.png'
export const customConfirm = (config: any) => {
  const defaultOptions: any = {
    title: '是否确认删除除?',
    // icon: <img className="anticon confirmIcon" src={WARN_ICON} alt="" />,
    message: '删除之后将不可恢复',
    confirmButtonText: '好的 ',
    cancelButtonText: '取消 ',
    showClose: false,
    type: ''
  }
  Object.assign(defaultOptions, config)
  const okFunc = defaultOptions.onOk
  const cancelFunc = defaultOptions.onCancel
  if (okFunc) {
    delete defaultOptions.onOk
  }
  if (cancelFunc) {
    delete defaultOptions.onCancel
  }
  setTimeout(() => {
    const objArr: any = document.getElementsByClassName('el-message-box__title')
    const obj = objArr[objArr.length - 1]
    obj.style.background = `url(${WARN}) no-repeat`
    obj.style.backgroundSize = `22px 24px`
    obj.style.backgroundPosition = `0px -1px`
    obj.style.paddingLeft = `34px`
    obj.style.lineHeight = `1.3`
  }, 0)
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(defaultOptions.title, defaultOptions.okType, {
      ...defaultOptions
    })
      .then(() => {
        resolve('ok')
        okFunc && okFunc()
      })
      .catch(() => {
        console.log('Cancel')
        reject()
        cancelFunc && cancelFunc()
      })
  })
}
