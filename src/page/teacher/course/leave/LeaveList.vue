<template>
  <div class="sign">
    <!-- 头部导航 start -->
    <HeaderNav titleTxt="请假列表"/>
    <!-- 头部导航 end -->
    <card class="card">
    </card>
    <div class="student-list">
      <div class="wrapper" ref="wrapper">
         {{signed}}
        <group>
          <checker
            v-model="signed"
            default-item-class="signed-item"
            selected-item-class="signed-item-selected"
            @on-change="changeValue"
            type="checkbox"
          >
            <checker-item
              v-for="(item, index) in signStudentList"
              :key="index"
              :value="item.sid"
              :disabled="item.ifsign == 1"
            >
              <cell>
                <div class="avatar" slot="icon">
                  <img :src="item.headimgurl" @error="'../../../../assets/images/avatar.png'" alt v-if="item.headimgurl">
                  <img src="../../../../assets/images/avatar.png" alt v-else>
                </div>
                <div slot="title">{{item.sname}}</div>
                <div>
                  <icon type="success" v-show="(~signed.indexOf(item.sid))"></icon>
                  <icon type="success" v-show="!(~signed.indexOf(item.sid))" class="not-check"></icon>
                </div>
              </cell>
            </checker-item>
          </checker>
        </group>
      </div>
    </div>
    <div class="btn" v-if="type === 'teacher'">
      <x-button class="disabled" v-if="isSign == signStudentList.length" type="primary" disabled>审批完毕</x-button>
      <x-button v-else type="primary" @click.native="apply()">同意</x-button>
    </div>
  </div>
</template>

<script>
import HeaderNav from "../../../../components/HeadNav";
import {
  Card,
  Group,
  Cell,
  CheckIcon,
  Checker,
  CheckerItem,
  Icon,
  XButton
} from "vux";
import util from "../../../../util/util";
import BScroll from "better-scroll";
import { mapState } from "vuex";
import typeMixin from "@/mixins/typeMixin";
import API from "@/api/apiFactory";
export default {
  name: "teacherleaveList",
  mixins: [typeMixin],
  mounted() {
    this.getLeaveData();
    this.initScroll(); //bs 和 checker一起用的时候会在安卓手机上出现问题

  },
  components: {
    Card,
    Group,
    Cell,
    CheckIcon,
    Checker,
    CheckerItem,
    Icon,
    XButton,
    HeaderNav
  },
  data() {
    return {
      isSign: 0,
      studentList: [],
      commonList: [],
      signed: [],
      // 登录页面信息 老师还是家长
      type: "",
      // 当前课程id
      crid: "",
      signStudentList: [],
      scroll: {}
    };
  },
  methods: {
    changeValue(val) {

    },
    // bScroll
    initScroll() {
      this.$nextTick(() => {
        const options = {
          scrollY: true, // 因为scrollY默认为true，其实可以省略
          click: true
        };
        const topHeight = util.getStyle(
          this.$el.querySelector(".weui-panel"),
          "height"
        );
        const winHeight = window.innerHeight;
        let bottomHeight = 0;
        if (this.type === "teacher") {
          bottomHeight = util.getStyle(
            this.$el.querySelector(".btn"),
            "height"
          );
        }
        this.$refs.wrapper.style.height =
          window.innerHeight -
          parseFloat(topHeight) - 100 - 
          parseFloat(bottomHeight || 0) +
          "px";
        this.scroll = new BScroll(this.$refs.wrapper, options);
      });
    },
    
    getLeaveData() {
      this.signed = [];
      this.isSign = 0;

      let porpsData = {
        crid: this.crid
      }
      API.post('/getLeaveByPage', porpsData)
        .then(data => {
            console.log(data);
          if (data.rows.length) {
            data.rows.forEach((item, index) => {
              // 签到学生推入
              if (item.ifsign) {
                this.signed.push(item.sid);
                this.isSign++;
              }
            });
            this.signStudentList = data.rows;
            console.log('signStudentList', this.signStudentList);
          }
        });

    },

    /**
     * 同意
     */
    apply() {
      if (this.signed.length) {
        let porpsData = {
            sid: this.signed.join(","),
            crid: this.crid,
            tid: this.currentCourse.tid,
            status: '1'
          };
        API.post('updataLeave', porpsData)
          .then(data => {
            if (data && data.code == 1) {
              this.$vux.toast.show({
                text: "操作成功",
                time: 2000,
                width: "2.5rem"
              });
              this.getLeaveData();
            } else {
                this.$vux.toast.text("操作失败", data.msg);
              this.getLeaveData();
            }
          });
      } else {
        this.$vux.toast.text("请选择学生后再操作", "middle");
      }
    }
  },
  computed: {
    // 未签到人数
    notSigned() {
      return this.signStudentList.length - this.signed.length;
    },
    ...mapState({
      currentCourse: "currentCourse"
    })
  },
  watch: {
    $route: {
      deep: true,
      immediate: true,
      handler(val) {
        this.type = val.meta.type;
        this.crid = val.params.crid;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~vux/src/styles/1px.less";
.sign {
  height: 100vh;
  background-color: #f5f7fa;
  overflow: hidden;
  .card-demo-flex {
    display: flex;
  }
  .card-demo-content01 {
    padding: 0.2rem 0;
  }
  .card-padding {
    padding: 0.3rem;
  }
  .card-demo-flex > div {
    flex: 1;
    text-align: center;
    color: #666666;
    font-size: 0.2rem;
    span {
      font-size: 0.32rem;
      color: #333333;
    }
  }
  .student-list {
    // margin-top: .2rem;
    .wrapper {
      overflow: hidden;
      .signed-item {
        border: 1px solid #ececec;
        padding: 5px 15px;
        &.vux-checker-item {
          padding: 0;
          display: block;
        }
      }
      /deep/ .weui-cells {
        // margin-top: .2rem;
        .weui-cell {
          .avatar {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 0.24rem;
            border-radius: 50%;
            overflow: hidden;
            img {
              width: 0.8rem;
              height: 0.8rem;
            }
          }
          .vux-label {
            font-size: 0.3rem;
          }
          .weui-icon-success {
            color: rgba(75, 185, 194, 1);
            &.not-check {
              color: rgba(216, 216, 216, 1);
            }
          }
        }
      }
    }
  }
  .btn {
    z-index: 999;
    position: relative;
    bottom: 0;
    margin-top: 0.6rem;
    width: 100%;
    padding: 0 0.32rem;
    box-sizing: border-box;
    button {
      background: rgba(75, 185, 194, 1);
    }
    .disabled {
      background-color: #c3c3c3;
      background: #c3c3c3;
    }
  }
}
</style>