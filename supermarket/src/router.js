import Vue from 'vue'
import Router from 'vue-router'
// import Login from './views/Login/Login.vue'
//使用路由
Vue.use(Router)
//渲染到页面
export default new Router({
  routes: [
    //登录页面
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login/Login.vue')
    },
    {
      // 主页
      path: '/',
      component: () => import('./views/Index/Index.vue'),
      children: [{
        path: '',
        name: 'home',
        component: () => import('./views/Home/Home.vue')
      },
      // 账号管理
      {
        path: '/accountmanage',
        name: 'accountmanage',
        component: () => import('./views/AccountManage/AccountManage.vue')
      },
      // //添加账号
      {
        path: '/accountAdd',
        name: 'accountAdd',
        component: () => import('./views/AccountAdd/AccountAdd.vue')

      }
        // //密码修改
        , {
        path: '/passwordModify',
        name: 'passwordModify',
        component: () => import('./views/PasswordModify/PasswordModify.vue')
      },
      // //商品管理
      {
        path: '/goodsmanage',
        name: 'goodsmanage',
        component: () => import('./views/GoodsManage/GoodsManage.vue')
      },
      // //添加商品
      {
        path: '/goodsAdd',
        name: 'goodsAdd',
        component: () => import('./views/GoodsAdd/GoodsAdd.vue')

      },
      //销售统计
      {
        path: '/salesStatistics',
        name: 'salesStatistics',
        component: () => import('./views/SalesStatistics/SalesStatistics.vue')
      },
      //进货统计
      {
        path: '/incomingStatistics',
        name: 'incomingStatistics',
        component: () => import('./views/IncomingStatistics/IncomingStatistics.vue')
      },//进货管理
      {
        path: '/stockmanage',
        name: 'stockmanage',
        component: () => import('./views/StockManage/stockmanage.vue')
      },//添加库存
      {
        path: '/addInventory',
        name: 'addInventory',
        component: () => import('./views/AddInventory/addInventory.vue')
      }
      
      ,//个人中心
      {
        path: '/personal',
        name: 'personal',
        component: () => import('./views/Personal/Personal.vue')
      }
      ],

    }
  ]
})
