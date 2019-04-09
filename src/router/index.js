import Vue from 'vue';
import Router from 'vue-router';
import teacher from './teacher';
import parent from './parent';
import store from '../store/index';

Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '*',
      redirect: {
        name: 'login'
      }
    },
    {
    path: '/login',
    name: 'login',
    component: resolve => require(['../page/login'], resolve),
    meta: {
      title: '登录'
    }
  }].concat(teacher, parent)
});


/**路由守卫 */
router.beforeEach((to, from, next) => {
  // let path = to.path;
  // const isLogin = store.state.userInfo;
  // console.log('from', from  );
  // if (path == '/login') {
  //   switch (isLogin.role) {
  //     case 'teacher':
  //       next({
  //         name: 'teacher'
  //       })
  //       break;

  //     case 'parent':
  //       next({
  //         name: 'parent'
  //       })
  //       break;
    
  //     default:
  //       next(false);
  //       break;
  //   }

  // } else {
  //     if(isLogin) {
  //       console.log(isLogin.role);
  //       console.log('path', path);
  //         if(path.indexOf(isLogin.role) != -1) {
  //           next();
  //         } else {
  //           console.log('from.path', from.path);
  //           next({
  //             path: from.path
  //           });
  //         }
  //     } else {
  //       next({
  //         name: 'login'
  //       })
  //     }
  // }

  document.title = to.meta.title || '主页';
  next();
});
export default router;
