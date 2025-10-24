import { createApp } from 'vue'

import App from './App.vue'
import './appUse/style'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { usePinia } from '@/appUse/pinia'
import { useI18ns } from '@/appUse/i18n'
import { useRouter } from '@/router/index'
import useIndex from '@/appUse/index'

const app = createApp(App)

usePinia(app)
useI18ns(app)
useRouter(app)
useIndex(app)

app.mount('#app')
