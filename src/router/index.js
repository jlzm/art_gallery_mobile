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
  let path = to.path;
  const isLogin = store.state.userInfo;
  const isAccount = store.state.userAccountInfo;
  console.log('from', from  );
  if (path == '/login') {
    if(Object.keys(isAccount).length) {
      switch (isLogin.role) {
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
          console.log('isLogin', isLogin);
          console.log('path', path);
          console.log(path.indexOf(isLogin.role));
            if(path.indexOf(isLogin.role) != -1) {
              console.log('from.pathaaa', from.path);
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
