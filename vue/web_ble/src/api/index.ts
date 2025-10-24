const api = {}

const filesList = import.meta.glob('./**/**.ts')
Object.keys(filesList).forEach((route) => {
  if (route.startsWith('./index.ts')) {
    return
  }
  const arr = route.split('/')
  const apiList = filesList[route]
  api[arr[1]] = apiList
})

console.log('api........', api)

export default api

