import Vue from 'vue'
import { init as initSentry } from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
import errorHandler from './utils/vueErrorHandler'
import { app } from '@/services/firebase'
import logger from './utils/vueLogger'
import config from './config'
import router from './router'
import store from './store'
import App from './App.vue'
import './registerServiceWorker'
import './registerPlugins'
import './registerComponents'

logger(
  "Hello, fellow developer 👋🏻\nInterested how this app is build? Well, it's open source! Go check it out on https://github.com/morkro/happy-plants 🤙🏼"
)
logger(`Initialising Firebase App ${app.name}`)

Vue.config.productionTip = config.isProduction
Vue.config.devtools = true
Vue.config.errorHandler = errorHandler

if (config.isProduction) {
  logger('Initialising Sentry')
  initSentry({
    release: 'pkg.version',
    dsn: config.sentry.dsn,
    integrations: [new Integrations.Vue({ Vue, attachProps: true })],
  })
}

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
