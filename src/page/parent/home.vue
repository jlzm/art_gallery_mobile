<template>
  <div class="parent-home">
    <!-- 头部导航 start -->
    <HomeHeadNav/>
    <!-- 头部导航 end -->
    <div class="parent-top">
      <div class="top-info">
        <div class="img">
          <img
            v-if="!!userInfo.headimgurl"
            :src="userInfo.headimgurl"
            @error="userInfo.headimgurl = require('../../assets/images/avatar.png')"
          >
          <img v-else :src="require('../../assets/images/avatar.png')" alt>
        </div>
        <div class="info">
          <div class="name">{{userInfo.sname || '暂无姓名'}}</div>
          <div class="progressed">
            <div class="label">学习进度</div>
            <box gap="10px" class="box">
              <x-progress :percent="percent" :show-cancel="false"></x-progress>
              <div
                class="point"
                :style="'left:' + (percent > 2.5 ? (percent - 2.5) : 0) + '%'"
                v-if="complete!==0"
              ></div>
            </box>
            <div class="total">共{{total}}节课</div>
            <div class="done">已上{{complete}}节课</div>
          </div>
        </div>
      </div>
    </div>
    <div class="parent-bottom">
      <div class="bottom-history">
        <div class="history history-1">
          <div class="plate-left" @click="routerLink('./activityCourse/list')">
            <img src="@/assets/images/home/parent_1.png" alt>
          </div>
        </div>
        <div class="history history-1">
          <div class="history plate-right" @click="stepToEnter">
            <div class="plate-right-item">
              <img src="@/assets/images/home/parent_2.png" alt>
            </div>
          </div>
          <div class="history plate-right plate-right-bottom" @click="stepToHistory">
            <div class="plate-right-item">
              <img src="@/assets/images/home/parent_3.png" alt>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-class">
        <div class="class-title dib">
          <button
            :disabled="thisWeekData == 'prev'"
            @click="prevWeek()"
            :class="thisWeekData == 'prev' ? 'week-this' : 'week-down'"
            class="dib week-btn"
          >上周课程</button>
          <button
            :disabled="thisWeekData == 'this'"
            @click="thisWeek()"
            :class="thisWeekData == 'this' ? 'week-this' : 'week-down'"
            class="dib week-btn"
          >本周课程</button>
          <button
            :disabled="thisWeekData == 'next'"
            @click="nextWeek()"
            :class="thisWeekData == 'next' ? 'week-this' : 'week-down'"
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
                @click="routerChange(index)"
                class="courses"
                v-for="(item, index) in weekClassData[(activeIndex + 1) % 7]"
                :key="index"
              >
                <div class="course-time">
                  <div class="date">{{item.cdate}}</div>
                  <div class="state">{{item.status === 0?'未开始':'已结束'}}</div>
                </div>
                <div class="course-info txt-omit">
                  <div class="className">{{item.cname}}</div>
                  <div class="class-info-detail">
                    <div class="detail-item">
                      <div class="label">时间：</div>
                      <div class="for">{{item.begintime}} - {{item.endtime}}</div>
                    </div>
                    <div class="detail-item">
                      <div class="label">老师：</div>
                      <div class="for">{{item.tname}} - {{item.atname}}</div>
                    </div>
                    <div class="detail-item">
                      <div class="label">教室：</div>
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

import { Group, Cell, XButton, XProgress, Box } from "vux";
import BScroll from "better-scroll";
import API from "@/api/apiFactory";
import util from "../../util/util";
import { mapState } from "vuex";
export default {
  name: "teacherHome",
  components: {
    XButton,
    Box,
    XProgress,
    HomeHeadNav
  },
  created() {
    this.getWeekDay();
  },
  mounted() {
    document.title = "会员中心";
    // 获取一周的开始与结束
    this.getWeekData();
    this.getUserInfo();

    // this.$nextTick(() => {
    //   this.initScroll();
    // });
  },
  data() {
    return {
      thisWeekData: 'this',
      tabArr: ["一", "二", "三", "四", "五", "六", "日"],
      activeIndex: 0,
      scroll: {},
      // 上课数
      complete: 20,
      // 总课数
      total: 48,
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
     * 获取前后日期方法
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
     * 上周课程
     */
    prevWeek() {
      if (this.thisWeekData == 'prev') return;
      this.weekData.begindate = this.funDate(this.weekData.begindate, -7);
      this.weekData.enddate = this.funDate(this.weekData.enddate, -7);
      console.log("this.weekData", this.weekData);
      this.getWeekClass();
      this.thisWeekData = 'prev';
    },

    /**
     * 本周课程
     */
    thisWeek() {
      if (this.thisWeekData == 'this') return;
      this.getWeekData();
      this.getWeekClass();
      this.thisWeekData = 'this';
    },

    /**
     * 下周课程
     */
    nextWeek() {
      if (this.thisWeekData == 'next') return;
      this.weekData.begindate = this.funDate(this.weekData.begindate, 7);
      this.weekData.enddate = this.funDate(this.weekData.enddate, 7);
      console.log("this.weekData", this.weekData);
      this.getWeekClass();
      this.thisWeekData = 'next';
    },

    /**获取当前星期 */
    getWeekDay() {
      let date = new Date();
      let weekDay = date.getDay();
      console.log("weekDay", typeof weekDay);
      this.activeIndex = weekDay - 1;
    },

    /**
     * 路由
     */
    routerLink(path, query) {
      console.log(path);
      this.$router.push({
        path: path,
        query: query || {}
      });
    },

    changeActive(index) {
      this.activeIndex = index;
    },

    initScroll() {
      const options = {
        scrollY: true, // 因为scrollY默认为true，其实可以省略
        click: true
      };
      const winHeight = window.innerHeight;
      const topHeight = util.getStyle(
        this.$el.querySelector(".parent-top"),
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
      this.$refs.wrapper.style.height = wrapperHeight - 55 + "px";
      this.scroll = new BScroll(this.$refs.wrapper, options);
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

    // 跳转到报名课程
    stepToEnter() {
      this.$router.push("./enteredCourse");
    },
    // 跳转到历史
    stepToHistory() {
      this.$router.push("./history");
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
      console.log("this.weekData", this.weekData);
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
        .wxAppGetStudent({
          sid: this.userInfo.sid
        })
        .then(data => {
          console.log(data);
          if (data) {
            this.infoData = data;
            this.complete =
              this.infoData.period_total - this.infoData.period_surplus;
            this.total = this.infoData.period_total;
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
          sid: this.userInfo.sid
        })
        .then(data => {
          if (data.length) {
            data.forEach(item => {
              let index = new Date(item.cdate).getDay() % 7;
              let studentsIds = item.sid.split(",");
              if (!this.weekClassData[index]) {
                this.weekClassData[index] = [];
              }
              // 只有该学生才会加入
              if (~studentsIds.indexOf(this.userInfo.sid)) {
                this.weekClassData[index].push(item);
                this.weekClassData[index].forEach(item => {
                  let cdate = item.cdate;
                  let index = cdate.lastIndexOf("-");
                  item.cdate = cdate.substring(index - 2, cdate.length);
                });
              }
            });
            this.$forceUpdate();
          } else {
            let msg = '';
            this.thisWeekData == 'prev' ? msg = '上周' :
            this.thisWeekData == 'this' ? msg = '本周' :
            this.thisWeekData == 'next' ? msg = '下周' : ''
            this.$vux.toast.text(msg + '暂无课程安排', "middle");
          }
        });
    }
  },
  computed: {
    percent() {
      return (this.complete / this.total).toFixed(2) * 100;
    },
    ...mapState({
      userInfo: "userInfo"
    })
  }
};
</script>

<style lang="less" scoped>
.parent-home {
  .parent-top {
    box-sizing: border-box;
    padding: 0.32rem;

    .top-info {
      display: flex;
      align-items: center;

      .img {
        width: 0.8rem;
        height: 0.8rem;
        display: flex;
        align-items: center;
        margin-right: 0.16rem;

        img {
          width: 0.8rem;
          height: 0.8rem;
        }
      }

      .info {
        flex: 1;

        .name {
          font-size: 0.3rem;
          color: rgba(0, 0, 0, 1);
          font-weight: 500;
        }

        .progressed {
          display: flex;
          font-size: 0.2rem;
          align-items: center;
          color: #666;
          position: relative;

          .box {
            flex: 1;
            position: relative;

            .point {
              display: block;
              content: "";
              position: absolute;
              height: 0.08rem;
              width: 0.08rem;
              background: #fff;
              border-radius: 50%;
              top: 0.03rem;
              transition: left 1s ease-out;
            }

            /deep/ .weui-progress__inner-bar {
              background: rgba(249, 189, 5, 1);
              border-radius: 0.08rem;
              transition: width 1s ease-out;
            }

            /deep/ .weui-progress__bar {
              height: 0.16rem;
              border-radius: 0.08rem;
            }
          }

          .label {
          }

          .done {
            position: absolute;
            top: -0.22rem;
            left: 2.2rem;
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

  .parent-bottom {
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
          border-radius: 0.16rem;
          overflow: hidden;

          /*板块头部*/
          .plate-title {
            font-weight: 500;
            font-size: 0.28rem;
            padding-bottom: 0.08rem;
          }

          /*板块介绍*/
          .plate-desc {
            font-size: 0.24rem;
            transform: scale(0.8);
            color: rgba(0, 0, 0, 0.4);
          }

          .plate-left,
          .plate-right {
            border-radius: 0.16rem;
            background: #fff;
          }

          /*左边板块*/
          .plate-left {
          }

          /*右边板块*/
          .plate-right {
            width: 3.4rem;
            height: 1.58rem;
          }

          .plate-right-bottom {
            margin-top: 0.24rem;
          }
        }
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
            padding-right: 0.6rem;
            display: flex;
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
