<template>
  <div class="course-detail">
    <!-- 头部导航 start -->
    <HeaderNav titleTxt="课程详情"/>
    <!-- 头部导航 end -->
    <div class="course-panel">
      <div class="panel-title">{{currentCourse.cname}}</div>
      <div class="panel-content">
        <div class="inline-item">
          <div class="label">时间：</div>
          <div class="for">{{currentCourse.begintime}} - {{currentCourse.endtime}}</div>
        </div>
        <div class="inline-item">
          <div class="label">老师：</div>
          <div class="for">{{currentCourse.tname}}</div>
        </div>
        <div class="inline-item">
          <div class="label">地点：</div>
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
        <cell title="签到信息" is-link :border-intent="false" :link="'./sign/' + currentCourse.crid"></cell>
      </group>
    </div>
    <div class="course-panel single-panel">
      <group>
        <cell title="请假信息" is-link :border-intent="false" :link="'./leaveList/' + currentCourse.crid"></cell>
      </group>
    </div>
    <div class="course-panel single-panel">
      <group>
        <cell title="课堂动态" is-link :border-intent="false" link="./trends">
          <span class="desc-ms" :class="courseStatusData.photoStatus ? 'desc-ms-t' : 'desc-ms-f'">{{courseStatusData.photoStatus  ? '查看详情' : '去发布'}}</span>
        </cell>
      </group>
    </div>
    <div class="course-panel single-panel">
      <group>
        <cell title="评价学生" is-link :border-intent="false" link="./commentList">
          <div>
            <span style="color: #999999;font-size:.2rem">查看详情</span>
          </div>
        </cell>
      </group>
    </div>
    <div class="course-panel single-panel">
      <group>
        <cell
          title="家长评价"
          is-link
          :border-intent="false"
          :link="'./viewParentComment/' + currentCourse.crid"
        >
          <div>
            <span style="color: #999999;font-size:.2rem">查看详情</span>
          </div>
        </cell>
      </group>
    </div>
  </div>
</template>

<script>
import api from "../../../api/apiFactory.js";

import HeaderNav from "../../../components/HeadNav";
import { Cell, Group } from "vux";

/** 课程详情 */
import { mapState } from "vuex";

export default {
  name: "courseDetail",

  components: {
    Cell,
    Group,
    HeaderNav
  },
  mounted() {
    console.log('userInfo', this.userInfo);
    this.getCourseStatus();
  },
  data() {
    return {
      /** jlzm start */
      headShowMore: false,
      menus: {
        menu1: "退出登入"
      },
      courseStatusData: {}
      /** jlzm end */
    };
  },
  methods: {
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
</style>/