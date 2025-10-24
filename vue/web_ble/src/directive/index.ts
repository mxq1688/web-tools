// // import store from '@/store'
// export const focus = {
//   mounted(el: any) {
//     setTimeout(() => {
//       el.querySelector('input').focus()
//     }, 0)
//   }
// }
export const errorImg = {
  mounted(el: any, binding: any) {
    el.onerror = function () {
      el.src = binding.value
    }
  },
}

// /*
// 滚动指令
// 指令使用
// 1、{childDom: '',load: func}
// 2、func
// */
// export const loadMore = {
//   mounted(el: any, binding: any) {
//     let selectWrap = el
//     if (typeof binding.value === 'object') {
//       selectWrap = el.querySelector(binding.value.childDom)
//     }
//     binding.selectWrap = selectWrap
//     binding.scroll = function () {
//       let sign = 0
//       const scrollDistance =
//         selectWrap.scrollHeight - selectWrap.scrollTop - selectWrap.clientHeight
//       if (scrollDistance <= sign) {
//         if (typeof binding.value === 'object') {
//           binding.value.load()
//         } else {
//           binding.value()
//         }
//       }
//     }
//     selectWrap.addEventListener('scroll', binding.scroll)
//   },
//   unmounted(el: any, binding: any) {
//     binding.selectWrap &&
//       binding.selectWrap.removeEventListener('scroll', binding.scroll)
//   },
//   deactivated(el: any, binding: any) {
//     binding.selectWrap &&
//       binding.selectWrap.removeEventListener('scroll', binding.scroll)
//   }
// }

// export const dialogdrag = {
//   mounted(el: any, binding: any) {
//     console.log(el, 123)

//     // binding.arg
//     // binding.value
//     // 可视窗口的宽度
//     const clientWidth = document.documentElement.clientWidth
//     // 可视窗口的高度
//     const clientHeight = document.documentElement.clientHeight
//     // 记录坐标
//     let domset = {
//       x: clientWidth / 4, // 默认width 50%
//       y: (clientHeight * 15) / 100 // 根据 15vh 计算
//     }

//     // 弹窗的容器
//     const domDrag = el.firstElementChild.firstElementChild
//     // 重新设置上、左距离
//     domDrag.style.marginTop = domset.y + 'px'
//     domDrag.style.marginLeft = domset.x + 'px'

//     // 记录拖拽开始的光标坐标，0 表示没有拖拽
//     let start = { x: 0, y: 0 }
//     // 移动中记录偏移量
//     let move = { x: 0, y: 0 }

//     // 鼠标按下，开始拖拽
//     domDrag.onmousedown = (e: any) => {
//       // 判断对话框是否重新打开
//       if (domDrag.style.marginTop === '15vh') {
//         // 重新打开，设置 domset.y  top
//         domset.y = (clientHeight * 15) / 100
//       }
//       start.x = e.clientX
//       start.y = e.clientY
//       domDrag.style.cursor = 'move' // 改变光标形状
//     }

//     // 鼠标移动，实时跟踪
//     domDrag.onmousemove = (e: any) => {
//       if (start.x === 0) {
//         // 不是拖拽状态
//         return
//       }
//       move.x = e.clientX - start.x
//       move.y = e.clientY - start.y

//       // 初始位置 + 拖拽距离
//       domDrag.style.marginLeft = domset.x + move.x + 'px'
//       domDrag.style.marginTop = domset.y + move.y + 'px'
//     }
//     // 鼠标抬起，结束拖拽
//     domDrag.onmouseup = (e: any) => {
//       move.x = e.clientX - start.x
//       move.y = e.clientY - start.y

//       // 记录新坐标，作为下次拖拽的初始位置
//       domset.x += move.x
//       domset.y += move.y
//       domDrag.style.cursor = '' // 恢复光标形状
//       domDrag.style.marginLeft = domset.x + 'px'
//       domDrag.style.marginTop = domset.y + 'px'
//       // 结束拖拽
//       start.x = 0
//     }
//   }
// }

// //懒加载
// export const lazyload = {
//   mounted(el: any, binding: any) {
//     let lazyImageObserver = new IntersectionObserver((entries, observer) => {
//       entries.forEach((entry, index) => {
//         let lazyImage: any = entry.target
//         // 相交率，默认是相对于浏览器视窗
//         if (entry.intersectionRatio > 0) {
//           lazyImage.src = binding.value
//           // 当前图片加载完之后需要去掉监听
//           lazyImageObserver.unobserve(lazyImage)
//         }
//       })
//     })
//     lazyImageObserver.observe(el)
//   }
// }

// export const interImage = {
//   mounted(el: any, binding: any) {
//     el.addEventListener('load', () => {
//       let width = el.naturalWidth
//       let height = el.naturalHeight
//       // 获取父元素的设定宽度
//       let parentWidth = Number(
//         window.getComputedStyle(el.parentNode).width.replace('px', '')
//       )
//       let parentHeight = Number(
//         window.getComputedStyle(el.parentNode).height.replace('px', '')
//       )
//       // 获取父元素宽高比例
//       let scale = binding.value
//         ? binding.value.scale
//         : parentHeight / parentWidth
//       // 清除元素style值
//       el.style = ''
//       if (height / width < scale) {
//         el.style.height = '100%'
//         // 获取图片放入后实际的宽度
//         // let imgWidth = Number(window.getComputedStyle(el).width.replace('px', ''));
//         let imgWidth = (width * parentHeight) / height
//         el.style.marginLeft = `${(parentWidth - imgWidth) / 2}px`
//       } else if (height / width > scale) {
//         el.style.width = '100%'
//       } else {
//         el.style.width = '100%'
//         el.style.height = '100%'
//       }
//     })
//   }
// }
