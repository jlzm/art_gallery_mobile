<template>
  <div class="parent-home">
    <!-- 头部导航 start -->
    <HomeHeadNav/>
    <!-- 头部导航 end -->
    <div class="parent-top">
      <div class="top-info">
        <div class="img">
          <img
            :src="userInfo.headimgurl"
            @error="userInfo.headimgurl = require('../../assets/images/avatar.png')"
            alt
          >
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
            <div class="plate-title activity-title">活动课程</div>
            <div class="plate-desc">资深老师带，挖掘潜力突破极限</div>
            <div class="tar">
              <div class="dib plate-activity-img">
                <img src="@/assets/images/plate-activity.png" alt>
              </div>
            </div>
          </div>
        </div>
        <div class="history history-1">
          <div class="history plate-right" @click="stepToEnter">
            <div class="dib vat">
              <div class="plate-title apply-title">已报名课程</div>
              <div class="plate-desc">课程一手掌握</div>
            </div>
            <div class="dib plate-activity-img vat">
              <img src="@/assets/images/plate-apply.png" alt>
            </div>
          </div>
          <div class="history plate-right" @click="stepToHistory">
            <div class="dib vat">
              <div class="plate-title history-title">历史上课记录</div>
              <div class="plate-desc">实时记录上课轨迹</div>
            </div>
            <div class="dib plate-activity-img vat">
              <img src="@/assets/images/plate-history.png" alt>
            </div>
          </div>
        </div>
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
                      <div class="label">时间段:</div>
                      <div class="for">{{item.begintime}} - {{item.endtime}}</div>
                    </div>
                    <div class="detail-item">
                      <div class="label">上课老师:</div>
                      <div class="for">{{item.tname}}</div>
                    </div>
                    <div class="detail-item">
                      <div class="label">上课教室:</div>
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
  mounted() {
    document.title = "会员中心";
    // 获取一周的开始与结束
    this.getWeekData();
    this.getUserInfo();

    this.$nextTick(() => {
      this.initScroll();
    });
  },
  data() {
    return {
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
        scrollY: true // 因为scrollY默认为true，其实可以省略
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
      this.$refs.wrapper.style.height = wrapperHeight + "px";
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
      console.log('this.weekData', this.weekData);
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
              }
            });
            this.$forceUpdate();
          } else {
            this.$vux.toast.text("本周暂无课程安排", "middle");
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
          background: rgba(0, 0, 0, 0);
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

          /*板块介绍*/
          .plate-desc {
            font-size: 0.2rem;
            color: rgba(0, 0, 0, 0.4);
          }

          /*左边板块*/
          .plate-left {
            padding: 0 0.24rem;
            margin-top: 0.24rem;
            .activity-title {
              color: #d33f29;
            }

            .plate-activity-img {
              width: 2.4rem;
              height: 1.6rem;
              margin-top: 0.73rem;
            }
          }

          /*右边板块*/
          .plate-right {
            margin-top: 0.24rem;
            width: 3.4rem;
            height: 1.6rem;
            padding: 0 0.24rem;

            .apply-title {
              color: #b78d1b;
            }

            .history-title {
              color: #85ac32;
            }

            .plate-activity-img {
              margin-left: 0.3rem;
              width: 1.08rem;
              height: 1.08rem;
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
          margin: 0.15rem 0.15rem 0 0.15rem;
          border-bottom: 1px solid #e8e8e8;
          position: relative;

          .course-time {
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
                  width: 1.2rem;
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
