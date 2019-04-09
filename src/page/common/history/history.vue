<template>
  <div class="history">
    <!-- 头部导航 start -->
    <HeaderNav titleTxt="上课历史记录"></HeaderNav>
    <!-- 头部导航 end -->
    <div class="content">
      <div class="wapper" ref="wrapper">
        <div class="ctn">
          <div
            class="item"
            @click.capture="showCourse(index)"
            v-for="(item, index) in history"
            :key="index"
          >
            <div class="item-title vux-1px-b">
              <div class="date">{{item.cdate}} ({{item.weeknum}})</div>
              <div class="number">{{item.period_need}}课时</div>
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
              <div class="arrow">
                <img src="@/assets/images/arrow.png" alt>
              </div>
            </div>
          </div>
          <p class="more" v-if="showMore">{{info}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderNav from "../../../components/HeadNav";
import { Tab, TabItem } from "vux";
import { mapState } from "vuex";
import BScroll from "better-scroll";
import API from "@/api/apiFactory";
export default {
  name: "history",
  components: {
    Tab,
    TabItem,
    HeaderNav
  },
  mounted() {
    this.$nextTick(() => {
      this.initScroll();
    });
    this.getHistoryById();
  },
  data() {
    return {
      type: "",
      history: [],
      pageJSON: {
        rows: 10,
        total: 10,
        page: 1,
        pageCount: 2
      },
      info: "加载更多...",
      showMore: false
    };
  },
  methods: {
    initScroll() {
      const options = {
        scrollY: true, // 因为scrollY默认为true，其实可以省略,
        click: true,
        pullUpLoad: {
          threshold: -30,
          moreTxt: "加载更多"
        }
      };
      const winHeight = window.innerHeight;
      this.$refs.wrapper.style.height = winHeight + "px";
      this.scroll = new BScroll(this.$refs.wrapper, options);
      this.scroll.on("pullingUp", () => {
        if (this.pageJSON.page >= this.pageJSON.pageCount) {
          this.showMore = true;
          this.info = "没有更多数据了...";
          return;
        }
        this.pageJSON.page++;
        this.getHistoryById();
      });
    },
    
    onItemClick() {},

    endScroll() {
      this.$nextTick(() => {
        this.scroll.finishPullUp();
        this.scroll.refresh();
        this.showMore = false;
      });
    },
    showCourse(index) {
      this.$store.commit("saveCurrentCourse", this.history[index]);
      this.$router.push("/" + this.type + "/courseDetail");
    },
    // 获取历史上课记录
    getHistoryById() {
      // this.history = []
      this.showMore = true;
      if (this.type === "teacher") {
        this.getTeacherHis();
      } else {
        this.getStudentHis();
      }
    },

    // 获取学生上课记录
    getStudentHis() {
      API.homeAPI
        .wxStudentCourse({
          // ctype: 1,
          sid: this.userInfo.sid,
          rows: this.pageJSON.rows,
          page: this.pageJSON.page
        })
        .then(data => {
          if (data.total > 0) {
            this.history = this.history.concat(data.rows);
            this.pageJSON = {
              page: data.crrentPage,
              total: data.total,
              rows: data.pageSize,
              pageCount: data.pageCount
            };
          } else {
            this.$vux.toast.text("暂无数据", "middle");
          }
          this.endScroll();
        });
    },


    // 获取老师上课记录
    getTeacherHis() {
      API.homeAPI
        .wxTeacherCourse({
          ctype: 1,
          tid: this.userInfo.tid,
          rows: this.pageJSON.rows,
          page: this.pageJSON.page
        })
        .then(data => {
          if (data.total > 0) {
            this.history = this.history.concat(data.rows);
            this.pageJSON = {
              page: data.crrentPage,
              total: data.total,
              rows: data.pageSize,
              pageCount: data.pageCount
            };
          } else {
            this.$vux.toast.text("暂无数据", "middle");
          }
          this.endScroll();
        });
    }
  },
  watch: {
    $route: {
      deep: true,
      handler(val) {
        this.type = val.meta.type;
      },
      immediate: true
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
.history {
  height: 100vh;
  background-color: #f5f7fa;
  p.more {
    font-size: 0.28rem;
    color: #8d8e8f;
    margin-top: 0.3rem;
    text-align: center;
  }
  .content {
    .ctn {
      .item {
        background-color: #fff;
        &:not(:first-child) {
          margin-top: 0.2rem;
        }
        padding: 0 0.32rem;
        position: relative;
        .item-title {
          display: flex;
          justify-content: space-between;
          font-size: 0.3rem;
          padding: 0.2rem 0;
          .number {
            color: #999999;
            font-size: 0.2rem;
          }
        }
        .course-info {
          // margin-bottom: .15rem;
          padding: 0.2rem 0;
          position: relative;
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
                min-width: 1.2rem;
              }
              .for {
                font-size: 0.24rem;
                color: #333;
                margin-left: 0.1rem;
              }
            }
          }
          .arrow {
            position: absolute;
            right: 0;
            top: 0.25rem;
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