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
              v-if="!!userInfo.headimgurl"
              :src="infoData.headimgurl"
              @error="infoData.headimgurl = require('../../assets/images/avatar.png')"
            >
            <img v-else :src="require('../../assets/images/avatar.png')" alt>
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
            </div>-->
          </div>
        </div>
        <!-- <div class="punch-btn">
          <x-button type="primary" mini plain>上班签到</x-button>
        </div>-->
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
            <img src="@/assets/images/home/teacher_1.png" alt>
          </div>
        </div>
        <div class="history history-1">
          <div class="plate-left" @click="gotoACourse()">
            <img src="@/assets/images/home/parent_1.png" alt>
          </div>
        </div>
        <!-- <div class="history history-1">
          <div class="plate-right" @click="gotoAttendence()">
            <img src="@/assets/images/home/teacher_2.png" alt="">
          </div>
        </div>-->
      </div>
      <div class="bottom-class">
        <div class="class-title dib">
          <button
            :disabled="thisWeekData"
            @click="thisWeek()"
            :class="thisWeekData ? 'week-this' : 'week-down'"
            class="dib week-btn"
          >本周课程</button>
          <button
            :disabled="!thisWeekData"
            @click="downWeek()"
            :class="thisWeekData ? 'week-down' : 'week-this'"
            class="dib week-btn"
          >下周课程</button>
        </div>
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
                <div class="course-info txt-omit">
                  <div class="className">{{item.cname}}</div>
                  <div class="class-info-detail">
                    <div class="detail-item">
                      <div class="label">时间:</div>
                      <div class="for">{{item.begintime}} - {{item.endtime}}</div>
                    </div>
                    <div class="detail-item">
                      <div class="label">老师:</div>
                      <div class="for">{{item.tname}} - {{item.atname}}</div>
                    </div>
                    <div class="detail-item">
                      <div class="label">地点:</div>
                      <div class="for txt-omit">{{item.room}}</div>
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
      thisWeekData: true,

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
    /**
     * 加减日期方法
     */
    funDate(currentTime, dayNum) {
      let month = null,
        day = null;

      let date = new Date(currentTime);
      // console.log('date', date);
      date.setDate(date.getDate() + dayNum);
      date.getMonth() + 1 < 10
        ? (month = "0" + (date.getMonth() + 1))
        : (month = date.getMonth() + 1);
      date.getDate() < 10
        ? (day = "0" + date.getDate())
        : (day = date.getDate());
      let time = `${date.getFullYear()}-${month}-${day}`;
      // console.log('time', time);
      return time;
    },

    /**
     * 本周课程
     */
    thisWeek() {
      if (this.thisWeekData) return;
      this.getWeekData();
      this.getWeekClass();
      this.thisWeekData = true;
    },

    /**
     * 下周课程
     */
    downWeek() {
      if (!this.thisWeekData) return;
      this.weekData.begindate = this.funDate(this.weekData.begindate, 7);
      this.weekData.enddate = this.funDate(this.weekData.enddate, 7);
      console.log("this.weekData", this.weekData);
      this.getWeekClass();
      this.thisWeekData = false;
    },

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
    gotoACourse() {
      this.$router.push("./activityCourse/list");
    },
    // 获取一周开始与结束
    getWeekData() {
      const ONEDAYTIME = 1 * 1000 * 60 * 60 * 24;
      let today = util.getTime(new Date());
      let [minusTime, plusTime] = [0, 0];
      // 重新组装日期,保证不出现时分秒影响
      let todayTime = new Date(
        today.year + "-" + today.month + "-" + today.day
      ).getTime();

      let weekStart, weekEnd;
      let formatStr = dateJson => {
        return dateJson.year + "-" + dateJson.month + "-" + dateJson.day;
      };

      // 计算一周剩余时间

      minusTime = ((6 + today.weeknum) % 7) * ONEDAYTIME;
      plusTime = ((7 - today.weeknum) % 7) * ONEDAYTIME;
      // 周一和周日的时间戳
      weekStart = new Date(todayTime - minusTime);

      weekEnd = new Date(todayTime + plusTime);
      console.log("weekStart", weekStart);
      console.log("weekEnd", weekEnd);
      // 周一和周日的日期
      let startDateJson = util.getTime(weekStart);
      let endDateJson = util.getTime(weekEnd);
      let date = [formatStr(startDateJson), formatStr(endDateJson)];
      console.log("date", date);
      this.weekData.begindate = date[0];
      this.weekData.enddate = date[1];
      
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
              this.weekClassData[index].forEach(item => {
                let cdate = item.cdate;
                let index = cdate.lastIndexOf("-");

                item.cdate = cdate.substring(index - 2, cdate.length);
              });
            });
            this.$forceUpdate();
          } else {
            this.thisWeekData ? msg = '本周暂无课程安排' : msg = '下周暂无课程安排';
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
            border-radius: 0.16rem;
            background: #fff;
            padding: 0.24rem 0.24rem 0;
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
          margin-top: 0.2rem;
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
            padding-right: 0.6rem;
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
            width: 4rem;
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

.week-btn {
  // background: #4bb9c2;
  margin: 0 0.2rem;
  padding: 0.13rem 0.2rem;
  color: #fff;
  border-radius: 0.08rem;
  border: none;
}

.week-this {
  background: #ccc;
}

.week-down {
  background: #4bb9c2;
}
</style>