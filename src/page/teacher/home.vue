<template>
  <div class="teacher-home">
    <!-- 头部导航 start -->
    <HomeHeadNav/>
    <!-- 头部导航 end -->

    <div class="teacher-top">
      <div class="top-info">
        <div class="flex">
          <div class="img">
            <img
              :src="infoData.headimgurl"
              @error="infoData.headimgurl = require('../../assets/images/avatar.png')"
            >
          </div>
          <div class="info">
            <div class="name">{{infoData.tname}}</div>
            <!-- <div class="punch-time">
              <div class="on-punch punch">
                <div class="pre">上班打卡</div>
                <div class="time">10:25:13</div>
              </div>
              <div class="off-punch punch">
                <div class="pre">下班打卡</div>
                <div class="time">--:--</div>
              </div>
            </div> -->
          </div>
        </div>
        <!-- <div class="punch-btn">
          <x-button type="primary" mini plain>上班签到</x-button>
        </div> -->
      </div>
      <div class="top-number-info">
        <div class="number-item">
          <div class="detail-number">{{infoData.sale_total}}</div>
          <div class="detail-title">总销课时</div>
        </div>
        <div class="number-item">
          <div class="detail-number">{{infoData.sale_week}}</div>
          <div class="detail-title">本周销课时</div>
        </div>
        <div class="number-item">
          <div class="detail-number">{{infoData.course_week}}</div>
          <div class="detail-title">本周上课节数</div>
        </div>
      </div>
    </div>
    <div class="teacher-bottom">
      <div class="bottom-history">
        <div class="history history-1">
          <div class="plate-left" @click="gotoHistory()">
            <div class="plate-title history-title">上课记录</div>
            <div class="plate-desc txt-wrap">上过的课，教过的学生，都深深地刻在记录里</div>
            <div class="tar">
              <div class="dib plate-activity-img">
                <img src="@/assets/images/plate-activity.png" alt>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="history history-1">
          <div class="plate-right" @click="gotoAttendence()">
            <div class="plate-title activity-title">考勤记录</div>
            <div class="plate-desc">美好的一天从签到开始</div>
            <div class="tar">
              <div class="dib plate-activity-img">
                <img src="@/assets/images/teacher_home_2.png" alt>
              </div>
            </div>
          </div>
        </div> -->
      </div>
      <div class="bottom-class">
        <div class="class-title">本周课程</div>
        <div class="class-content">
          <div class="class-week">
            <div
              class="tab-item"
              v-for="(item, index) in tabArr"
              :key="index"
              @click="changeActive(index)"
              :class="index === activeIndex && 'active'"
            >{{item}}</div>
          </div>
          <div class="course-ctn list-wrapper" ref="wrapper">
            <div>
              <div
                class="courses"
                v-for="(item,index) in weekClassData[(activeIndex + 1) % 7]"
                :key="index"
                @click="routerChange(index)"
              >
                <div class="course-time">
                  <div class="date">{{item.cdate}}</div>
                  <div class="state">{{item.status === 0?'未开始':'已结束'}}</div>
                </div>
                <div class="course-info">
                  <div class="className">{{item.cname}}</div>
                  <div class="class-info-detail">
                    <div class="detail-item">
                      <div class="label">时间:</div>
                      <div class="for">{{item.begintime}} - {{item.endtime}}</div>
                    </div>
                    <div class="detail-item">
                      <div class="label">老师:</div>
                      <div class="for">{{item.tname}}</div>
                    </div>
                    <div class="detail-item">
                      <div class="label">地点:</div>
                      <div class="for">{{item.room}}</div>
                    </div>
                  </div>
                </div>
                <div class="arrow">
                  <img src="@/assets/images/arrow.png" alt>
                </div>
              </div>
              <div
                v-if="!(weekClassData[(activeIndex + 1) % 7] &&weekClassData[(activeIndex + 1) % 7].length )"
                class="noClass"
              >暂无课程安排</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HomeHeadNav from "../../components/HomeHeadNav";

import { Group, Cell, XButton } from "vux";
import { mapState } from "vuex";
import BScroll from "better-scroll";
import API from "@/api/apiFactory";
import util from "../../util/util";
export default {
  name: "teacherHome",
  components: {
    XButton,
    HomeHeadNav
  },
  created() {
    this.getWeekDay();
  },
  mounted() {
    document.title = "会员中心";
    // 获取一周的开始与结束
    this.getWeekData();
    // 获取用户信息
    this.getUserInfo();
    // this.$nextTick(() => {
    //   this.initScroll();
    // });
  },
  data() {
    return {
      /** jlzm start */
      headShowMore: false,
      menus: {
        menu1: "退出登入"
      },
      /** jlzm end */
      tabArr: ["一", "二", "三", "四", "五", "六", "日"],
      activeIndex: 0,
      scroll: {},
      infoData: {},
      weekData: {
        begindate: "2019-01-01",
        enddate: "2019-01-07"
      },
      // 一周课程
      weekClassData: {}
    };
  },
  methods: {
    /** jlzm start */

    showMore() {},

    /**获取当前星期 */
    getWeekDay() {
      let date = new Date();
      let weekDay = date.getDay();
      console.log("weekDay", typeof weekDay);
      this.activeIndex = weekDay - 1;
    },

    /** jlzm end */

    changeActive(index) {
      this.activeIndex = index;
    },
    initScroll() {
      const options = {
        scrollY: true, // 因为scrollY默认为true，其实可以省略,
        click: true
      };
      const winHeight = window.innerHeight;
      const topHeight = util.getStyle(
        this.$el.querySelector(".teacher-top"),
        "height"
      );
      const historyHeight = util.getStyle(
        this.$el.querySelector(".bottom-history"),
        "height"
      );
      const titleHeight = util.getStyle(
        this.$el.querySelector(".class-title"),
        "height"
      );
      const week = util.getStyle(
        this.$el.querySelector(".class-week"),
        "height"
      );
      const wrapperHeight =
        winHeight -
        parseFloat(topHeight) -
        parseFloat(historyHeight) -
        parseFloat(titleHeight) -
        parseFloat(week);
      this.$refs.wrapper.style.height = wrapperHeight - 70 + "px";
      this.scroll = new BScroll(this.$refs.wrapper, options);
    },
    format(time) {
      let day = time.getDate();
      let month = time.getMonth() + 1;
      let year = time.getFullYear();
      return (
        year +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (day < 10 ? "0" + day : day)
      );
    },
    // 跳转
    routerChange(index) {
      // 保存当前查看课程
      this.$store.commit(
        "saveCurrentCourse",
        this.weekClassData[(this.activeIndex + 1) % 7][index]
      );
      this.$router.push("./courseDetail");
    },
    gotoHistory() {
      this.$router.push("./history");
    },
    gotoAttendence(e) {
      this.$router.push("./attendence/1");
    },
    // 获取一周开始与结束
    getWeekData() {
      const ONE_DAY = 1000 * 60 * 60 * 24;
      let time = new Date();
      let day = time.getDate();
      let month = time.getMonth() + 1;
      let year = time.getFullYear();
      // 获取纯粹的时间，从0点开始
      let pureDate = new Date(year + "/" + month + "/" + day);
      if (time.getDay !== 0) {
        let startDate = new Date(
          pureDate.getTime() - (time.getDay() - 1) * ONE_DAY
        );
        let endDate = new Date(
          pureDate.getTime() + (7 - time.getDay()) * ONE_DAY
        );
        this.weekData.begindate = this.format(startDate);
        this.weekData.enddate = this.format(endDate);
      }
    },
    // 获取用户信息
    getUserInfo() {
      if (!this.userInfo || !(this.userInfo && this.userInfo.role)) {
        API.homeAPI.getUserInfo().then(res => {
          // 初始化数据
          if (res && res.role) {
            this.$store.commit("login", res);
            this.getData();
            this.getWeekClass();
          } else {
            this.$vux.toast.text("未获取到用户信息，请重新登录", "middle");
            this.$router.push("/login");
          }
        });
      } else {
        this.getData();
        this.getWeekClass();
      }
    },
    // 获取学生信息
    getData() {
      API.homeAPI
        .wxAppGetTeacher({
          tid: this.userInfo.tid
        })
        .then(data => {
          if (data) {
            console.log("data", data);
            this.infoData = data;
          }
        });
    },
    // 获取排课
    getWeekClass() {
      this.weekClassData = [];
      API.homeAPI
        .getWxCourseByWeek({
          begindate: this.weekData.begindate,
          enddate: this.weekData.enddate,
          tid: this.userInfo.tid
        })
        .then(data => {
          if (data.length) {
            data.forEach(item => {
              let index = new Date(item.cdate).getDay() % 7;
              let studentsIds = item.sid.split(",");
              if (!this.weekClassData[index]) {
                this.weekClassData[index] = [];
              }
              this.weekClassData[index].push(item);
            });
            this.$forceUpdate();
          } else {
            this.$vux.toast.text("本周暂无课程安排", "middle");
          }
        });
    }
  },
  computed: {
    ...mapState({
      userInfo: "userInfo"
    })
  }
};
</script>

<style lang="less" scoped>
.teacher-home {
  .teacher-top {
    box-sizing: border-box;
    padding: 0.32rem;
    background: #fff;
    .top-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .flex {
        display: flex;
      }
      .img {
        width: 0.8rem;
        height: 0.8rem;
        display: flex;
        align-items: center;
        margin-right: 0.24rem;
        img {
          width: 0.8rem;
          height: 0.8rem;
        }
      }
      .info {
        .name {
          font-size: 0.3rem;
          color: rgba(0, 0, 0, 1);
          font-weight: 500;
          padding-bottom: 0.1rem;
        }
        .punch-time {
          display: flex;
          color: rgba(102, 102, 102, 1);
          font-size: 0.2rem;
          .punch {
            display: flex;
            align-items: center;
            .time {
              margin-left: 0.1rem;
            }
            &:last-child {
              margin-left: 0.5rem;
            }
          }
        }
      }
      .punch-btn {
        display: flex;
        align-items: center;
        button {
          background: rgba(255, 255, 255, 1);
          border: 0.02rem solid rgba(75, 185, 194, 1);
          color: rgba(75, 185, 194, 1);
          opacity: 1;
          font-size: 0.2rem;
          border-radius: 0.33rem;
          line-height: 0.2rem;
          padding: 0.15rem 0.3rem;
        }
      }
    }
    .top-number-info {
      display: flex;
      justify-content: space-between;
      margin-top: 0.4rem;
      .number-item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border-right: 0.02rem solid rgba(225, 227, 230, 1);
        .detail-number {
          font-size: 0.32rem;
          color: rgba(51, 51, 51, 1);
        }
        .detail-title {
          color: rgba(102, 102, 102, 1);
          font-size: 0.2rem;
          margin-top: 0.1rem;
        }
        &:last-child {
          border: none;
        }
      }
    }
  }
  .teacher-bottom {
    background-color: #f5f7fa;

    .bottom-history {
      display: flex;
      justify-content: space-between;
      padding: 0.24rem;
      box-sizing: border-box;

      .history {
        &.history-1 {
          width: 3.4rem;
          height: 3.4rem;
          // background: #fff;
          opacity: 1;
          border-radius: 0.16rem;

          /*display: flex;*/
          /*justify-content: center;*/
          /*align-items: center;*/
          font-size: 0.28rem;
          font-weight: 500;
          background-size: contain;

          /*板块头部*/
          .plate-title {
            font-weight: 500;
            font-size: 0.28rem;
            padding-bottom: 0.08rem;
          }
          /*颜色样式*/
          .apply-title {
            color: #b78d1b;
          }

          .history-title {
            color: #85ac32;
          }
          /*板块介绍*/
          .plate-desc {
            font-size: 0.2rem;
            color: rgba(0, 0, 0, 0.4);
            height: 0.56rem;
          }

          /*板块*/
          .plate-left,
          .plate-right {
            background: #fff;
            padding: 0 0.24rem;
            margin-top: 0.24rem;
            .activity-title {
              color: #d33f29;
            }
            .plate-activity-img {
              margin-top: 0.44rem;
              bottom: 0.08rem;
              right: 0;
            }
          }

          .plate-left {
            .plate-activity-img {
              width: 2.4rem;
              height: 1.6rem;
            }
          }

          .plate-right {
            .plate-activity-img {
              width: 1.7rem;
              height: 1.64rem;
            }
          }
        }

        /*&.history-2 {*/
        /*width:3.4rem;*/
        /*height:3.4rem;*/
        /*background:rgba(0,0,0,0);*/
        /*opacity:1;*/
        /*border-radius:0.16rem;*/
        /*display: flex;*/
        /*justify-content: center;*/
        /*align-items: center;*/
        /*font-size: .28rem;*/
        /*font-weight: 500;*/
        /*color: #fff;*/
        /*background-size: contain;*/
        /*div {*/
        /*background:rgba(237,154,41,.6);*/
        /*border-radius:0.08rem;*/
        /*width:2.6rem;*/
        /*height:0.8rem;*/
        /*display: flex;*/
        /*align-items: center;*/
        /*justify-content: center;*/
        /*outline: .02rem solid rgba(237,154,41,.6);*/
        /*outline-offset: 0.06rem;*/
        /*}*/
        /*}*/
      }
    }

    .bottom-class {
      .noClass {
        font-size: 0.24rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        opacity: 1;
        text-align: center;
        margin-top: 0.8rem;
      }

      .class-title {
        font-size: 0.32rem;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.22rem 0;
        box-sizing: border-box;
      }

      .class-content {
        background-color: #fff;

        .course-ctn {
          overflow: hidden;
          margin-top: .2rem

        }

        .class-week {
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 0.22rem 0.3rem;
          border-bottom: 0.02rem solid rgba(225, 227, 230, 1);
          box-sizing: border-box;

          .tab-item {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 0.3rem;
            height: 0.72rem;
            width: 0.72rem;

            &.active {
              color: #fff;
              background: rgba(75, 185, 194, 1);
              border-radius: 50%;
            }
          }
        }

        .courses {
          display: flex;
          align-items: center;
          margin: 0.15rem 0.15rem 0 0.15rem;
          border-bottom: 1px solid #e8e8e8;
          position: relative;

          .course-time {
            display: flex;
            padding-right: .6rem;
            justify-content: center;
            flex-direction: column;
            width: 2rem;
            text-align: center;

            .date {
              font-size: 0.28rem;
              color: rgba(239, 176, 8, 1);
            }

            .state {
              margin-top: 0.05rem;
              font-size: 0.2rem;
              color: rgba(153, 153, 153, 1);
            }
          }

          .course-info {
            margin-bottom: 0.15rem;

            .className {
              font-size: 0.28rem;
              color: rgba(51, 51, 51, 1);
            }

            .class-info-detail {
              .detail-item {
                display: flex;
                align-items: center;
                margin: 0.05rem 0;

                .label {
                  font-size: 0.24rem;
                  color: #666666;
                }

                .for {
                  font-size: 0.24rem;
                  color: #333;
                  margin-left: 0.1rem;
                }
              }
            }
          }

          .arrow {
            position: absolute;
            right: 0.2rem;

            img {
              width: 0.48rem;
              height: 0.48rem;
            }
          }
        }
      }
    }
  }
}
</style>