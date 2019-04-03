<template>
  <div class="course-detail">
     <!-- 头部导航 start -->
     <HeaderNav titleTxt="课程详情"/>
     <!-- 头部导航 end -->
    <div class="course-panel">
      <div class="panel-title">
        {{currentCourse.cname}}
      </div>
      <div class="panel-content">
        <div class="inline-item">
          <div class="label">
            时段
          </div>
          <div class="for">
            {{currentCourse.begintime}} - {{currentCourse.endtime}}
          </div>
        </div>
        <div class="inline-item">
          <div class="label">
            上课老师
          </div>
          <div class="for">
            {{currentCourse.tname}}
          </div>
        </div>
        <div class="inline-item">
          <div class="label">
            教室
          </div>
          <div class="for">
            {{currentCourse.room}}
          </div>
        </div>
      </div>
    </div>
    <div class="course-panel">
      <div class="panel-title">
        课程预热
      </div>
      <div class="panel-content">
        <div class="text">
          {{currentCourse.cdesc}}
        </div>
      </div>
    </div>
    <div class="course-panel single-panel" v-if="type === 'teacher'">
      <group>
        <cell title="签到信息" :border-intent="false">
          <span class="info" v-if="currentCourse.status === 1">{{currentCourse.signtime || '尚未签到'}}</span>
          <span v-else class="info">课程未开始</span>
        </cell>
      </group>
    </div>
    <div class="course-panel single-panel">
      <group>
        <cell title="课堂动态" is-link :border-intent="false" link="./trends/photo">
          <span class="info">查看详情</span>
        </cell>
      </group>
    </div>
    <div class="course-panel single-panel">
      <group v-if="this.type==='parent'">
        <cell title="老师课后评价学生" is-link :border-intent="false" :link="'./commentDetail/' + userInfo.sid
        " >
          <div>
            <span class="info">查看详情</span>
          </div>
        </cell>
      </group>
    </div>
    <div class="course-panel single-panel">
      <group>
        <cell title="家长评价课程/老师" is-link :border-intent="false" :link="'./parentComment/' + 
          currentCourse.tid">
          <div>
             <span style="color: #3D88E0;font-size:.2rem" v-if="type === 'parent'">去评价</span>
             <span class="info" v-else>查看详情</span>
          </div>
        </cell>
      </group>
    </div>
  </div>
</template>

<script>
import HeaderNav from '../../../components/HeadNav';

import {Cell,Group } from 'vux'
import {mapState} from 'vuex'
export default {
  name: 'courseDetail',
  mounted() {
  },
  components: {
    Cell,
    Group,
    HeaderNav
  },
  methods: {
  },
  computed: {
    ...mapState({
      currentCourse: 'currentCourse',
      userInfo: 'userInfo'
    })
  },
  watch: {
    '$route': {
      deep: true,
      immediate: true,
      handler(val) {
        let regx = /\/+(\w*)\/+/
        if (val.path.match(regx)) {
          if (val.path.match(regx)[1] === 'parent' || val.path.match(regx)[1] === 'teacher') {
            this.type = val.path.match(regx)[1]
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.course-detail {
  height: 100vh;
  background-color: #F5F7FA;
  .course-panel {
    padding: 0 .32rem;
    background-color: #fff;
    padding-bottom: .24rem;
    margin-bottom: .24rem;
    .info {
      color: #999999;
      font-size:.2rem;
    }
    &.single-panel{
      padding-bottom: 0;
      /deep/ .weui-cells{
        &:after{
          display: none;
        }
        &:before{
          display: none;
        }
        .weui-cell {
          padding: 0.2rem 0;
        }
      }
    }
    /deep/ .weui-cells {
      .vux-label {
        font-size: .3rem;
      }
    }
    .panel-title {
      font-size: .3rem;
      color:rgba(0,0,0,1);
      border-bottom: .02rem solid rgba(232,232,232,1);
      padding: .24rem 0;
    }
    .panel-content {
      display: flex;
      flex-direction: column;
      .inline-item {
        display: flex;
        justify-content: space-between;
        margin: .02rem 0;
        &:first-child {
          margin-top: .24rem;
        }
        .label {
          color:rgba(102,102,102,1);
          font-size:.24rem;
        }
        .for {
          font-size: .24rem;
        }

      }
      .text {
        font-size: .28rem;
        color:rgba(102,102,102,1);
        margin-top: .24rem;
        line-height:.44rem;
      }
      
    }
  }
}
</style>

