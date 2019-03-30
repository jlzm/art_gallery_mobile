<template>
  <div>
    <!-- 头部导航 start -->
    <div class="header-wrap">
      <div class="header-nav">
        <x-header style="background-color:#f9f9f9" :left-options="{ showBack: false}">
          <span class="title-txt dib"> {{titleTxt}}</span>
        </x-header>
      </div>
    </div>
    <!-- 头部导航 end -->
  </div>
</template>

<script>
  // 组件
  import {
    XHeader,
    TransferDom,
    Actionsheet
  } from "vux";
  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Actionsheet
    },

    props: {
      titleTxt: {
        type: String,
        default: '会员中心'
      },
      preventGoBack: {
        type: String,
        default: 'false'
      }
    },
    data() {
      return {
        headShowMore: false,
        menus: {
          menu1: "退出登入"
        },
      }
    }
  }

</script>

<style lang="less" scoped>
  .header-wrap {
    
    height: 46px;
    .header-nav {
      position: fixed;
      width: 100%;
      z-index: 999;
    }
  }

  .title-txt {
    color: #000;
    font-size: 17px;
    font-weight: bold;
  }

</style>
