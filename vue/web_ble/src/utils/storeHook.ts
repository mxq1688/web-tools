import { computed } from 'vue'
import { useStore } from 'vuex'
const mapGettersHook = () => {
  const store = useStore()
  return Object.fromEntries(
    Object.keys(store.getters).map((getter) => [
      getter,
      computed(() => store.getters[getter])
    ])
  )
}

export { mapGettersHook }
