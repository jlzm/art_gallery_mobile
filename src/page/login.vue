<template>
  <div>
    <!-- 头部导航 start -->
    <HomeHeadNav titleTxt="登入"/>
    <!-- 头部导航 end -->
    <div class="login">
      <div class="login-ctn">
        <group>
          <form @submit.stop="bind()">
            <!-- <x-input v-model="loginForm.name" placeholder="请输入姓名" required :is-type="name">
            <label slot="label"><img src="../assets/images/personal.png" alt=""></label>
            </x-input>-->
            <x-input v-model="loginForm.phone" placeholder="请输入手机号码" required :is-type="mobile">
              <label slot="label">
                <img src="../assets/images/phone.png" alt>
              </label>
            </x-input>
            <x-input v-model="loginForm.codes" placeholder="验证码" required :is-type="code">
              <label slot="label">
                <img src="../assets/images/code.png" alt>
              </label>
              <x-button action-type="button" @click.native.stop="getPhoneCode()" slot="right" type="primary" plain mini>发送验证码</x-button>
            </x-input>
            <x-button action-type="submit" type="primary" class="bind" @click.native.stop="bind()">绑定</x-button>
          </form>
        </group>
      </div>
    </div>
  </div>
</template>

<script>
import HomeHeadNav from "../components/HomeHeadNav";

import { Group, Cell, XInput, XButton } from "vux";
import API from "@/api/apiFactory";

export default {
  name: "login",
  components: {
    Group,
    Cell,
    XInput,
    XButton,
    HomeHeadNav
  },
  data() {
    return {
      validate: {
        name: {
          valid: false,
          msg: "请输入用户名"
        },
        phone: {
          valid: false,
          msg: "请输入电话号码"
        },
        code: {
          valid: false,
          msg: "请输入验证码"
        }
      },
      loginForm: {
        name: "",
        phone: "",
        codes: ""
      },
      canCommit: true
    };
  },
  methods: {
    /**
     * 获取手机验证码
     */
    getPhoneCode() {
      let phone = this.loginForm.phone;
      let reg = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/;

      if(!phone) {
          this.$vux.toast.text("请输入手机号", "middle");
        return false;
      } else if(!phone.match(reg)){
          this.$vux.toast.text("请输入正确手机格式", "middle");
        return  false;
      }

      let propsData = {
        phone: phone
      }
      API.homeAPI.getPhoneCode(propsData).then(res => {
        console.log('res', res);
      })
    },

    // rules
    mobile(val) {
      let reg = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/;
      this.validate.phone.valid = false;
      if (!val) {
        this.validate.phone.msg = "请输入手机号";
      } else {
        if (!val.match(reg)) {
          this.validate.phone.msg = "请输入正确手机格式";
        } else {
          this.validate.phone.valid = true;
        }
      }
      return this.validate.phone;
    },
    
    code(val) {
      this.validate.code.valid = false;
      let reg = /^\d*$/;
      if (!val) {
        this.validate.code.msg = "请输入验证码";
      } else if (!val.match(reg)) {
        this.validate.code.msg = "验证码必须为数字";
      } else {
        this.validate.code.valid = true;
      }
      return this.validate.code;
    },
    // name(val) {
    //   this.validate.name.valid = false;
    //   if (!val) {
    //     this.validate.name.msg = "请输入用户名";
    //   } else {
    //     this.validate.name.valid = true;
    //   }
    //   return this.validate.name;
    // },

    bind() {
      //  && this.validate.name.valid
      if (this.validate.code.valid && this.validate.phone.valid) {
        this.postLogin();
      } else {
        this.$vux.toast.text("请完善输入框", "middle");
      }
    },

    /* API */
    // 登录
    postLogin() {
      if (!this.canCommit) {
        this.$vux.toast.text("请勿重复提交", "middle");
        return;
      }
      this.canCommit = false;

      let propsData = {
        validate: this.loginForm.codes,
        phone: this.loginForm.phone,
        openid: ""
      };

      console.log('propsData', propsData);
      API.homeAPI.login(propsData).then(data => {
        console.log("data", data);
        this.canCommit = true;
        if (data && parseInt(data.code) === 1) {
          this.$vux.toast.text("成功登入", "top");
          if (data.wxUser.role) {
            this.$store.commit("login", data.wxUser);
            this.$router.push("./" + data.wxUser.role);
          }
        } else {
          this.$vux.toast.text(data.msg, "middle");
        }
      });
    }
  }
};
</script>

<style scope lang="less">
.login {
  height: 100vh;
  background: url(../assets/images/login.png);
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;

  input::-webkit-input-placeholder {
    /* placeholder颜色  */
    color: #aab2bd;
    font-size: 0.3rem;
  }

  .weui-cells {
    background: none;
    padding: 0 0.32rem;
    margin-top: 0;
    margin-bottom: 1rem;

    &:before {
      display: none;
    }

    &:after {
      display: none;
    }

    .weui-btn {
      &.bind {
        color: #fff;
        border-color: #4bb9c2;
        background-color: #4bb9c2;
        margin-top: 0.92rem;
      }
    }

    .weui-cell {
      &:before {
        display: none;
      }

      &:after {
        display: none;
      }

      .weui-btn_plain-primary {
        color: #4bb9c2;
        border-color: #4bb9c2;
      }
    }

    .vux-x-input {
      background: rgba(0, 0, 0, 0.5);
      border: none;
      margin: 0.52rem 0;
      color: #fff;
      height: 0.96rem;
      box-sizing: border-box;
      width: 6.5rem;

      label {
        display: flex;
        align-items: center;

        img {
          width: 0.32rem;
          margin-right: 0.1rem;
        }
      }
    }
  }
}
</style>
