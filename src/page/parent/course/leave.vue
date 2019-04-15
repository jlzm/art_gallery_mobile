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
      <editable-input inputTitle="请假理由" @editchange="editchange" :editable="!hasComment" :val="comment"></editable-input>
    </div>
    <div class="btn">
      <x-button class="ago" v-if="!hasComment" type="primary" @click.native="confirmComment()">确认请假</x-button>
      <x-button class="yet" type="info" v-else>已请假</x-button>
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
    // 如果是老师端，直接禁止评论
    if (this.isTeacher) {
      this.hasComment = true;
    }
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
      teacherRater: 5,
      courseRater: 5,
      hasComment: false,
      teacherInfo: {
        headimgurl: "",
        tname: "快乐木马"
      },
      comment: ""
    };
  },
  methods: {
    triggerClick() {
      if (this.type !== "parent") {
        this.dbClick(this.$refs.file, "click");
      }
    },
    editchange(val) {
      this.comment = val;
    },

    // 确认评价
    confirmComment() {
      if (!this.comment) {
        this.$vux.toast.text("请填写请假理由", "middle");
        return;
      }
      let propsData = {
          crid: this.currentCourse.crid,
          sid: this.userInfo.sid,
          tid: this.currentCourse.tid,
          type: 2,
          remark: this.comment,
          teacherrater: this.teacherRater.toString(),
          courserater: this.courseRater.toString()
        };
        console.log(propsData);
      API.homeAPI
        .insertParentEvaluation(propsData)
        .then(data => {
          if (parseInt(data.code) === 1) {
            this.hasComment = true;
            this.$vux.toast.show({
              text: "提交成功",
              time: 2000,
              width: "2rem"
            });
          } else {
            this.$vux.toast.text(data.msg, "middle");
          }
        });
    },

    getComment() {

      API.homeAPI
        .wxEvaluationByStu({
          crid: this.currentCourse.crid,
          sid: this.userInfo.sid,
          tid: this.currentCourse.tid,
          type: 2
        })
        .then(data => {
          console.log('data', data);
          // 是否已经评价
          if (data) {
            
            this.hasComment = parseInt(data.isPj) !== 2;
            this.teacherInfo = {
              tname: data.tname,
              headimgurl: data.headimgurl
            };
            this.comment = data.tev;
            this.teacherRater = parseInt(data.teacherrater) || 5;
            this.courseRater = parseInt(data.courserater) || 5;
          }
        });
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
</style>

