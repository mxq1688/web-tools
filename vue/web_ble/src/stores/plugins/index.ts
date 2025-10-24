export function myPiniaPlugin(context: any) {
  const { store } = context
  store.newAction = () => {
    console.log('This is a new action added by the plugin.')
  }
}
