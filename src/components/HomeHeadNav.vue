<template>
  <div>
    <!-- 头部导航 start -->
    <div class="header-wrap">
      <div class="header-nav">
        <x-header
          @on-click-more="headShowMore = true"
          style="background-color:#f9f9f9"
          :left-options="{ showBack: false}"
          :right-options="{ showMore: showMore }"
        >
          <span class="title-txt dib">{{titleTxt}}</span>
        </x-header>
      </div>
    </div>
    <!-- 头部导航 end -->

    <!-- 导航打开更多 start -->
    <div v-transfer-dom>
      <actionsheet
        @on-click-menu-menu1="loginOut()"
        :menus="menus"
        v-model="headShowMore"
        show-cancel
      ></actionsheet>
    </div>
    <!-- 导航打开更多 end -->
  </div>
</template>

<script>
// 公共方法
import pubilcFn from "../mixins/pulicFn";

// 组件
import { XHeader, TransferDom, Actionsheet } from "vux";

import { mapState } from "vuex";
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
      default: "会员中心"
    },
    showMore: {
      type: Boolean,
      default: true
    },
    preventGoBack: {
      type: String,
      default: "false"
    }
  },
  data() {
    return {
      headShowMore: false,
      menus: {
        menu1: "退出登入"
      }
    };
  },

  computed: {
    ...mapState({
      userInfo: "userInfo"
    })
  },

  methods: {
    /**
     * 退出登入
     */
    loginOut() {
      this.$store.commit("login", {});
      this.$store.commit("accountInfo", {});
      this.$vux.toast.text("成功登出", "top");
      this.$router.push({
        path: "/login"
      });
    }
  }
};
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
