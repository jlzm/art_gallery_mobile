<template>
  <div class="course-detail">
    <!-- 头部导航 start -->
    <HeaderNav titleTxt="课程详情"/>
    <!-- 头部导航 end -->
    <div class="course-panel">
      <div class="df df-sb panel-title">
        <span >{{currentCourse.cname}}</span> 
        <span >{{currentCourse.cdate}}</span> 
      </div>
      <div class="panel-content">
        <div class="inline-item">
          <div class="label">时间</div>
          <div class="for">{{currentCourse.begintime}} - {{currentCourse.endtime}}</div>
        </div>
        <div class="inline-item">
          <div class="label">老师</div>
          <div class="for">{{currentCourse.tname}} - {{currentCourse.atname}}</div>
        </div>
        <div class="inline-item">
          <div class="label">教室</div>
          <div class="for">{{currentCourse.room}}</div>
        </div>
      </div>
    </div>
    <div class="course-panel">
      <div class="panel-title">课程预热</div>
      <div class="panel-content">
        <div class="text txt-wrap">{{currentCourse.cdesc}}</div>
      </div>
    </div>
    <div class="course-panel single-panel">
      <group>
        <cell title="签到信息" :border-intent="false">
          <span class="info" v-if="currentCourse.status === 1">{{signtime || '尚未签到'}}</span>
          <span v-else class="info">课程未开始</span>
        </cell>
      </group>
    </div>
    <div class="course-panel single-panel">
      <group>
        <cell title="我要请假" :border-intent="false" is-link link="/parent/leave">
          <span class="info">{{courseStatusData.isLeave !=0 ? '已请假' : '未请假' }}</span>
        </cell>
      </group>
    </div>
    <div class="course-panel single-panel">
      <group>
        <cell title="课堂动态" is-link :border-intent="false" link="./trends/photo">
          <span
            class="info"
          >{{!courseStatusData.photoStatus ? '未发布' : '查看详情'}}</span>
        </cell>
      </group>
    </div>
    <div class="course-panel single-panel">
      <group v-if="this.type==='parent'">
        <cell
          title="老师评价"
          is-link
          :border-intent="false"
          :link="'./commentDetail/' + userInfo.sid
        "
        >
          <div>
            <span class="info">{{ !courseStatusData.ttos ? '未评价' : '查看详情'}}</span>
          </div>
        </cell>
      </group>
    </div>
    <div class="course-panel single-panel">
      <group>
        <cell
          title="评价课程"
          is-link
          :border-intent="false"
          :link="'./parentComment/' + 
          currentCourse.tid"
        >
          <div>
            <span
              class="desc-ms"
              :class=" !courseStatusData.stot  ? 'desc-ms-f' : 'desc-ms-t'"
            >{{ !courseStatusData.stot ? '去评价' : '已评价'}}</span>
          </div>
        </cell>
      </group>
    </div>
  </div>
</template>

<script>
import HeaderNav from "../../../components/HeadNav";
import api from "../../../api/apiFactory.js";

import { Cell, Group } from "vux";

import { mapState } from "vuex";
export default {
  name: "courseDetail",
  mounted() {},
  components: {
    Cell,
    Group,
    HeaderNav
  },
  data() {
    return {
      signtime: '',
      courseStatusData: {}
    };
  },
  created() {
    this.interceptTime();
  },
  mounted() {
    this.getCourseStatus();
  },
  methods: {
    /**
     * 报名时间格式截取
     */
    interceptTime() {
      console.log('this.currentCourse', this.currentCourse);
      let time = this.currentCourse.signtime;
      let index = time.lastIndexOf(":");
      this.signtime = time.substring(0, index);
    },

    /**
     * 获取课程详情各状态
     */
    getCourseStatus() {
      let propsData = {
        crid: this.currentCourse.crid,
        sid: this.userInfo.sid
      };
      api.businessApi.wxgetTeevaluationStatus(propsData).then(res => {
        console.log("res", res);
        this.courseStatusData = res;
      });
    }
  },
  computed: {
    ...mapState({
      currentCourse: "currentCourse",
      userInfo: "userInfo"
    })
  },
  watch: {
    $route: {
      deep: true,
      immediate: true,
      handler(val) {
        let regx = /\/+(\w*)\/+/;
        if (val.path.match(regx)) {
          if (
            val.path.match(regx)[1] === "parent" ||
            val.path.match(regx)[1] === "teacher"
          ) {
            this.type = val.path.match(regx)[1];
          }
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.course-detail {
  height: 100vh;
  background-color: #f5f7fa;
  .course-panel {
    padding: 0 0.32rem;
    background-color: #fff;
    padding-bottom: 0.24rem;
    margin-bottom: 0.24rem;
    .info {
      color: #999999;
      font-size: 0.2rem;
    }
    &.single-panel {
      padding-bottom: 0;
      /deep/ .weui-cells {
        &:after {
          display: none;
        }
        &:before {
          display: none;
        }
        .weui-cell {
          padding: 0.2rem 0;
        }
      }
    }
    /deep/ .weui-cells {
      .vux-label {
        font-size: 0.3rem;
      }
    }
    .panel-title {
      font-size: 0.3rem;
      color: rgba(0, 0, 0, 1);
      border-bottom: 0.02rem solid rgba(232, 232, 232, 1);
      padding: 0.24rem 0;
    }
    .panel-content {
      display: flex;
      flex-direction: column;
      .inline-item {
        display: flex;
        justify-content: space-between;
        margin: 0.02rem 0;
        &:first-child {
          margin-top: 0.24rem;
        }
        .label {
          color: rgba(102, 102, 102, 1);
          font-size: 0.24rem;
        }
        .for {
          font-size: 0.24rem;
        }
      }
      .text {
        font-size: 0.28rem;
        color: rgba(102, 102, 102, 1);
        margin-top: 0.24rem;
        line-height: 0.44rem;
      }
    }
  }
}

.desc-ms {
  font-size: 0.24rem;
}

.desc-ms-f {
  color: #3c86dc;
}

.desc-ms-t {
  color: #999;
}
</style>

