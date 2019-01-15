// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import qs from 'qs'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import $ from 'jquery'
import 'element-ui/lib/theme-chalk/index.css'
// import './common/font-awesome-4.7.0/css/font-awesome.css'
import 'babel-polyfill'
import './common/scss/reset.scss'
import './common/scss/icon.scss'
import './common/scss/common.scss'
// import './common/js/utils'
// import utils from './common/js/utils'
import axios from "axios"
import Cookies from 'js-cookie'
//将axios挂载到原型上
Vue.prototype.$axios = axios;
Vue.prototype.$cookie = Cookies;
 
//配置全局的axios默认值（可选）
 
// Axios.defaults.baseURL = 'https://wx.chinaxywl.com';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

Vue.config.productionTip = false
Vue.use(ElementUI)
// Vue.use(utils)
axios.defaults.timeout = 5000
 
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  config.headers.authorization = localStorage.getItem('authorization');
  // config.data.school_id = localStorage.getItem('_school_id');
  // config.data.area_id = localStorage.getItem('area_id');
  // 参数格式转换
  if(config.method === 'post') {
    let data = qs.parse(config.data)

    config.data = qs.stringify({
      school_id: localStorage.getItem('_school_id'),
        area_id: localStorage.getItem('area_id'),
        ...data
    })
} else if(config.method === 'get') {
    config.params = {
      school_id: localStorage.getItem('_school_id') ,
      area_id: localStorage.getItem('area_id'),
        ...config.params
    }
}
  // if(config.method=="post"){
  //   config.data = qs.stringify(config.data);
  // }else if(config.method=="get"){
  //   config.data = JSON.stringify(config.data);
  // }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加一个响应拦截器
axios.interceptors.response.use(function (res) {
  console.log("请求成功")
  if(res.headers.authorization){
    localStorage.setItem('authorization',res.headers.authorization);
  }
  return res;
}, function (err) {
  console.log("请求失败",err)
  // router.replace({
  //   path: '/login'
  // })
  if(err.response.data){
    if (err.response.data.status_code==433) {
      alert('错误信息：' + err.response.data.message)
    }
    if (err.response.data.status_code==401) {
      router.replace({
        path: '/login'
      })
    }
    if(err.response.data.message=="Token has expired"||err.response.data.message=="The token has been blacklisted"||err.response.data.message=="The token could not be parsed from the request") {
      router.replace({
        path: '/login'
      })
    }
  }
  return err;
  // return Promise.reject(err);
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
