// import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import VueRouter from 'vue-router'
import './assets/css/reset.less'
// import './plugins/element'
// import 'element-ui/lib/theme-chalk/index.css' // elementui样式需要单独导入
import './assets/icon/iconfont.css' // 导入字体图标
// // 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme
import TreeTable from 'vue-table-with-tree-grid' // 树状表格
// // 导入NProgress包对应的js和css
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
// // 配置axios
import axios from 'axios';
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 为请求拦截器添加token，保证拥有获取数据的权限
axios.interceptors.request.use(config => {
  // 在request拦截器中，显示进度条
  NProgress.start();
  // 为所有请求设置请求头对象，添加token验证的Authorizaion字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在response拦截器中，隐藏进度条
axios.interceptors.response.use(config => {
  NProgress.done();
  return config;
})
Vue.use(VueQuillEditor) // 全局注册富文本组件
Vue.component('tree-table', TreeTable)
Vue.prototype.$http = axios;
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')