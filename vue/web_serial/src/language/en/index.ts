// const modules = import.meta.glob('./*.json')
// const messages: any = {}

// for (const path in modules) {
//   modules[path]().then((mod: any) => {
//     const key = path.replace('./', '').replace('.json', '')
//     messages[key] = mod.default
//   })
// }

// export default messages

import index from './index.json'

export default {
  index,
}
