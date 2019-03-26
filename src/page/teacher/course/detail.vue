<template>
  <div class="course-detail">
    <!-- 头部导航 start -->
    <HeaderNav></HeaderNav>
    <!-- 头部导航 end -->
    <div class="course-panel">
      <div class="panel-title">{{currentCourse.cname}}</div>
      <div class="panel-content">
        <div class="inline-item">
          <div class="label">时间段</div>
          <div class="for">{{currentCourse.begintime}} - {{currentCourse.endtime}}</div>
        </div>
        <div class="inline-item">
          <div class="label">上课老师</div>
          <div class="for">{{currentCourse.tname}}</div>
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
        <div class="text">{{currentCourse.cdesc}}</div>
      </div>
    </div>
    <div class="course-panel single-panel">
      <group>
        <cell title="签到信息" is-link :border-intent="false" :link="'./sign/' + currentCourse.crid"></cell>
      </group>
    </div>
    <div class="course-panel single-panel">
      <group>
        <cell title="课堂动态" is-link :border-intent="false" link="./trends">
          <span style="color: #3D88E0;font-size:.24rem">去发布</span>
        </cell>
      </group>
    </div>
    <div class="course-panel single-panel">
      <group>
        <cell title="老师课后评价学生" is-link :border-intent="false" link="./commentList">
          <div>
            <span style="color: #999999;font-size:.2rem">查看详情</span>
          </div>
        </cell>
      </group>
    </div>
    <div class="course-panel single-panel">
      <group>
        <cell
          title="家长评价课程/老师"
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
    <!-- 导航打开更多 -->
    <div v-transfer-dom>
      <actionsheet :menus="menus" v-model="headShowMore" show-cancel></actionsheet>
    </div>
  </div>
</template>

<script>
    import HeaderNav from '../../../components/HeadNav';
    import {
        Cell,
        Group,
        XHeader,
        TransferDom,
        Actionsheet
    } from "vux";

    /** 课程详情 */
    import {
        mapState
    } from "vuex";
    export default {
        name: "courseDetail",
        directives: {
            TransferDom
        },
        components: {
            Cell,
            Group,
            XHeader,
            Actionsheet,
            HeaderNav
        },
        data() {
            return {
                /** jlzm start */
                headShowMore: false,
                menus: {
                    menu1: "退出登入"
                }
                /** jlzm end */
            };
        },
        computed: {
            ...mapState({
                currentCourse: "currentCourse"
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
</style>