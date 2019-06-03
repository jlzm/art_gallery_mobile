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
      },
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
  if (to.meta.title) {
    document.title = to.meta.title
  }
  let path = to.path;
  const isLogin = store.state.userInfo;
  const isAccount = store.state.userAccountInfo;
  if (path == '/login') {
    if(Object.keys(isAccount).length) {
      switch (isLogin && isLogin.role) {
        case 'teacher':
          next({
            path: '/teacher/home'
          })
          break;
  
        case 'parent':
          next({
            path: '/parent/home'
          })
          break;
      
        default:
          next();
          break;
      }
    } else {
      next();
    }
  }

  // } else {
  //     // if(isLogin) {
  //     //   console.log(isLogin.role);
  //     //   console.log('path', path);
  //     //     if(path.indexOf(isLogin.role) != -1) {
  //     //       next();
  //     //     } else {
  //     //       console.log('from.path', from.path);
  //     //       next({
  //     //         path: from.path
  //     //       });
  //     //     }
  //     // } else {
  //     //   // next({
  //     //   //   path: '/login'
  //     //   // })
  //     //   next(false);
  //     // }
  // }
  else {

    if(Object.keys(isLogin).length) {
            if(path.indexOf(isLogin.role) != -1) {
              next();
            } else {
              next({
                path: from.path
              })
            }
        } else {
          // next('/login');
          next();
          return;
        }
  }

  // document.title = to.meta.title || '主页';
  // next();
});
export default router;
