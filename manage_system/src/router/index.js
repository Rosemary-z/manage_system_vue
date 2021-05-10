import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '@/components/Login'
const Login = () => import( /* webpackChunkName: "login_homePage_home" */ '@/components/Login')
// import HomePage from '@/components/main/HomePage'
const HomePage = () => import( /* webpackChunkName: "login_homePage_home" */ '@/components/main/HomePage')
// import Home from '@/components/Home'
const Home = () => import( /* webpackChunkName: "login_homePage_home" */ '@/components/Home')

// import Users from '@/components/aside/user/Users'
const Users = () => import( /* webpackChunkName: "users_rights_roles" */ '@/components/aside/user/Users')
// import Rights from '@/components/aside/permission/Rights'
const Rights = () => import( /* webpackChunkName: "users_rights_roles" */ '@/components/aside/permission/Rights')
// import Roles from '@/components/aside/permission/Roles'
const Roles = () => import( /* webpackChunkName: "users_rights_roles" */ '@/components/aside/permission/Roles')

// import Categories from '@/components/aside/goods/Categories'
const Categories = () => import( /* webpackChunkName: "catgories_goodsList_params_addGoods" */ '@/components/aside/goods/Categories')
// import GoodsList from '@/components/aside/goods/GoodsList'
const GoodsList = () => import( /* webpackChunkName: "catgories_goodsList_params_addGoods" */ '@/components/aside/goods/GoodsList')
// import Params from '@/components/aside/goods/Params'
const Params = () => import( /* webpackChunkName: "catgories_goodsList_params_addGoods" */ '@/components/aside/goods/Params')
// import AddGoods from '@/components/aside/goods/AddGoods'
const AddGoods = () => import( /* webpackChunkName: "catgories_goodsList_params_addGoods" */ '@/components/aside/goods/AddGoods')

// import Orders from '@/components/aside/order/Orders'
const Orders = () => import( /* webpackChunkName: "orders_reports" */ '@/components/aside/order/Orders')
// import Reports from '@/components/aside/data/Reports'
const Reports = () => import( /* webpackChunkName: "orders_reports" */ '@/components/aside/data/Reports')

// import ErrorPage from '@/components/404Page';
const ErrorPage = () => import( /* webpackChunkName: "errorPage" */ '@/components/404Page')
Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/homepage',
    children: [{
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: GoodsList
      },
      {
        path: '/addgoods',
        component: AddGoods
      },
      {
        path: '/orders',
        component: Orders
      },
      {
        path: '/reports',
        component: Reports
      },
      {
        path: '/home',
        component: HomePage //默认显示首页
      },
    ]
  },
  {
    path: '*',
    component: ErrorPage,
  },
  {
    path: '/404',
    component: ErrorPage
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// 挂载导航守卫
router.beforeEach((to, from, next) => {
  // 判断用户访问的是哪个页面，如果是非登录页，判断是否当前有token值，有才允许放行
  const tokenStr = window.sessionStorage.getItem('token');
  if (to.path === '/login') {
    if (tokenStr) {
      sessionStorage.clear()
      return next()
    }
    return next()
  }
  if (!tokenStr) return next('/login')
  next()
})

export default router