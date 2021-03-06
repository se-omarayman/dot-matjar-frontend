
import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import axios from 'axios';
import vaxios from 'vue-axios';
import vuetify from './plugins/vuetify';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
//import { library } from '@fortawesome/fontawesome-svg-core'
//import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
// import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
//import VueApexCharts from 'vue-apexcharts'
// import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas"
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import "vue-swatches/dist/vue-swatches.css"
//import Moment from 'moment'
import VueCarousel from 'vue-carousel';
import i18n from './i18n'

Vue.use(VueCarousel);

// Vue.use(VueApexCharts)
// Vue.component('apexchart', VueApexCharts)

Vue.use(Loading)
Vue.component('loading', Loading)

//Vue.config.productionTip = false
// Vue.use(BootstrapVue)

// Vue.use(IconsPlugin)

//Vue.use(Moment);

//library.add(faUserSecret)

Vue.component('font-awesome-icon', FontAwesomeIcon)

//Vue.config.productionTip = false
//Vue.prototype.$store = store
//Vue.config.productionTip = false
Vue.use(vaxios, axios);
Vue.prototype.$axios = axios;


router.beforeEach((to, from, next) => {
  let language = to.params.lang;
  if (!language) {
    language = localStorage.getItem('language') ? localStorage.getItem('language') : 'en'
  }

  i18n.locale = language
  next()
})


new Vue({
  icons: {
    iconfont: 'fa' // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },

  router,
  store,
  vuetify,

  created: () => {

  },

  i18n,
  render: h => h(App)
}).$mount('#app')