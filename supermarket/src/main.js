import Vue from 'vue';
//引入axios
import axios from 'axios';
// 引入elementui的组件 和 样式
import ElementUI from 'element-ui'; // 组件文件（js）
import 'element-ui/lib/theme-chalk/index.css'; // 样式文件
//引入顶级组件
import App from './App.vue'
// 引入路由文件
import router from './router'
//引入公用样式
import '@/style/common.less';
//解构引入组件
import {Message} from 'element-ui';

// 注册（使用）elementui
Vue.use(ElementUI);
//把axios挂在Vue原型上，所有的vue实例对象共享
Vue.prototype.axios = axios;

//全局路由守卫 拦截所有路由 如果不登录就只能返回到登录页面
router.beforeEach((to, from, next) => {

  //获取token
  const token = window.localStorage.getItem('token')
  // console.log(token);
  // //判断有token就放行
  if (token) {
    next();
  } else {
    //如果没有token 去的是登录页面 就让它去
    if (to.path === '/login') {
      next();
    } else {//如果去的是其他页面 就直接跳到登录页面
     Message.error('请您登录以后再操作哦！')
     
      return next({ 'path': '/login' });
    }
  }
})
//阻止生产提示
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

