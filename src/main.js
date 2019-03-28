// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import FastClick from 'fastclick';
import util from './util/util';
import store from './store/index';
import {Toast, ToastPlugin, LoadingPlugin} from 'vux';

// css
import "./assets/css/public.css";
// 或者umd方式
// 引入构建的js文件


Vue.use(LoadingPlugin);
import './assets/css/rewirete.css';
import VueVideoPlayer from 'vue-video-player';

Vue.use(VueVideoPlayer);
// import {vux} from 'vux'
// Vue.use(vux)
// FastClick.attach(document.body)
Vue.config.productionTip = false;
Vue.prototype.dbClick = util.fDbClick;
Vue.use(ToastPlugin);
Vue.component('toast', Toast);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  store,
  template: '<App/>'
});
