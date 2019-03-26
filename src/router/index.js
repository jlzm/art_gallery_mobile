import Vue from 'vue'
import Router from 'vue-router'
import teacher from './teacher'
import parent from './parent'
import store from '../store/index'
Vue.use(Router)
const router = new Router({
  routes: [{
    path: '/login',
    name: 'login',
    component: resolve => require(['../page/login'], resolve),
    meta: {
      title: '登录'
    }
  }].concat(teacher, parent)
})
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '主页'
  next()
})
export default router