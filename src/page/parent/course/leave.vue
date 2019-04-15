<template>
  <div class="parent-leave">
    <!-- 头部导航 start -->
    <HeaderNav titleTxt="请假申请"/>
    <!-- 头部导航 end -->
    <div class="course-panel">
      <!-- <group>
        <cell :border-intent="false">
          <div class="avatar" slot="icon">
            <img :src="teacherInfo.headimgurl" alt v-if="teacherInfo.headimgurl">
            <img src="@/assets/images/avatar.png" alt v-else>
          </div>
          <div slot="title">{{teacherInfo.tname}}</div>
        </cell>
      </group> -->
    </div>
    <div class="course-panel">
      <editable-input inputTitle="请假理由" @editchange="editchange" :editable="!leaveStatus.status" :val="leaveReason"></editable-input>
    </div>
    <div v-if="leaveStatus.status == 1" class="teacher-txt" >
      <span>{{leaveStatus.tname}}:</span>
      <span>同意</span>
    </div>
    <div class="btn">
      <x-button v-if="!leaveStatus.status" class="ago"  type="primary" @click.native="confirmLeave()">确认请假</x-button>
      <x-button v-else class="yet" type="info">{{leaveStatus.status == 0 ? '审批中' : '已请假' }}</x-button>
    </div>
  </div>
</template>

<script>
import HeaderNav from "../../../components/HeadNav";

/** 家长评论老师 */
import typeMixin from "@/mixins/typeMixin";
import { Cell, Group, XButton, Rater } from "vux";
import zoom from "@/mixins/zoom";
import editableInput from "@/components/editableInput";
import API from "@/api/apiFactory";
import { mapState } from "vuex";
export default {
  name: "parentLeave",
  mixins: [zoom, typeMixin],
  mounted() {
    this.getComment();
  },
  components: {
    Cell,
    Group,
    editableInput,
    XButton,
    Rater,
    HeaderNav
  },
  data() {
    return {
      leaveStatus: {},
      teacherRater: 5,
      courseRater: 5,
      hasComment: false,
      teacherInfo: {
        headimgurl: "",
        tname: "快乐木马"
      },
      leaveReason: ""
    };
  },
  methods: {
    editchange(val) {
      this.leaveReason = val;
    },

    triggerClick() {
      if (this.type !== "parent") {
        this.dbClick(this.$refs.file, "click");
      }
    },

    // 确认提交
    confirmLeave() {
      if (!this.leaveReason) {
        this.$vux.toast.text("请填写请假理由", "middle");
        return;
      }
      let propsData = {
          crid: this.currentCourse.crid,
          sid: this.userInfo.sid,
          leave_reason: this.leaveReason,
        };
        console.log(propsData);
      API.post('/insertLeave', propsData)
        .then(data => {
          if (data.code == 1) {
            this.hasComment = true;
            this.$vux.toast.show({
              text: "提交成功",
              time: 2000,
              width: "2rem"
            });
            this.getComment();
          } else {
            this.$vux.toast.text(data.msg, "middle");
          }
        });
    },

    getComment() {
      let propsData = {
        crid: this.currentCourse.crid,
        sid: this.userInfo.sid,
      }
      console.log('propsData', propsData);
      API.post('/getLeaveByPage', propsData).then(res => {
        if(res.rows.length) {
          console.log('res', res.rows[0]);
          this.leaveStatus = res.rows[0];
          this.leaveReason = this.leaveStatus.leave_reason;
        }
      })
    }
  },
  computed: {
    isTeacher() {
      return this.type !== "parent";
    },
    ...mapState({
      currentCourse: "currentCourse",
      userInfo: "userInfo"
    })
  }
};
</script>

<style lang="less" scoped>
.parent-leave {
  height: 100vh;
  background-color: #f5f7fa;
  .course-panel {
    padding: 0 0.32rem;
    background-color: #fff;
    padding-bottom: 0.24rem;
    margin-bottom: 0.24rem;
    /deep/ .weui-cells {
      .vux-label {
        font-size: 0.3rem;
      }
    }
    padding-bottom: 0;
    /deep/ .weui-cells {
      margin-top: 0;
      &:after {
        display: none;
      }
      &:before {
        display: none;
      }
      .weui-cell {
        padding: 0.2rem 0;
        .avatar {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 0.24rem;
          img {
            width: 0.6rem;
            height: 0.6rem;
          }
        }
        .time {
          color: rgba(153, 153, 153, 1);
          font-size: 0.24rem;
        }
      }
    }
  }
  .img {
    display: flex;
    align-items: center;
    img {
      width: 0.4rem;
      height: 0.4rem;
    }
  }
  .hidden {
    display: none;
  }
  .show-img-ctn {
    padding: 0.32rem 0;
    .imgs {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .img-item {
        width: 2.18rem;
        img {
          width: 2.18rem;
          height: 2.18rem;
        }
      }
    }
  }
  .btn {
    padding: 0.32rem;
    .ago {
      background: rgba(75, 185, 194, 1);
      border-radius: 0.08rem;
    }
  }
}

.rater-title {
  font-size: 0.3rem;
  color: #333;
}

.parent-leave .btn .yet {
  background: #C3C3C3;
}

.teacher-txt {
  font-size: .28rem;
}
</style>

