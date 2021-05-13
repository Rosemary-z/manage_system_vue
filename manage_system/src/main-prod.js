import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/reset.less'
// import './plugins/element'
import './assets/icon/iconfont.css' // 导入字体图标
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import TreeTable from 'vue-table-with-tree-grid' // 树状表格
Vue.use(VueQuillEditor) // 全局注册富文本组件
Vue.component('tree-table', TreeTable)
import http from './api/request_new.js'
Vue.prototype.$http = http;
Vue.config.productionTip = true
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')