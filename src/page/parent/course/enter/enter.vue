<template>
  <div class="entered-course">
    <!-- 头部导航 start -->
    <HeaderNav titleTxt="已报名活动课程"/>
    <!-- 头部导航 end -->
    <div class="tab">
      <tab>
        <tab-item @on-item-click="onItemClick(0)" selected>未开始</tab-item>
        <tab-item @on-item-click="onItemClick(1)">已结束</tab-item>
      </tab>
    </div>
    <div class="content">
      <div class="wapper">
        <div class="ctn">
          <div
            class="item"
            v-for="(item, index) in courseData[selectType]"
            @click.capture="showCourse(index)"
            :key="item.crid"
          >
            <template>
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
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderNav from "../../../../components/HeadNav";

/** 参与活动课程 */
import { Tab, TabItem } from "vux";
import { mapState } from "vuex";
import API from "@/api/apiFactory";
export default {
  name: "enter",
  components: {
    Tab,
    TabItem,
    HeaderNav
  },
  data() {
    return {
      selectType: 0,
      courseData: {
        // 未开始课程
        0: [],
        // 已结束课程
        1: []
      }
    };
  },
  mounted() {
    this.getwxStudentCourse();
  },
  methods: {
    onItemClick(val) {
      console.logval
      this.selectType = val;
    },

    showCourse(index) {
      this.$store.commit(
        "saveCurrentCourse",
        this.courseData[this.selectType][index]
      );
      this.$router.push("/parent/courseDetail");
    },


    getwxStudentCourse() {
      this.courseData = {
        // 未开始课程
        0: [],
        // 已结束课程
        1: []
      };
      API.homeAPI
        .wxStudentCourse({
          ctype: 2,
          sid: this.userInfo.sid
        })
        .then(data => {
          console.log('data', data);
          if (data) {
            data.rows.forEach((item, index) => {
              this.courseData[item.status].push(item);
            });
          } else {
            this.$vux.toast.text("暂无活动课程安排", "middle");
          }
        });
        console.log('this.courseData', this.courseData);
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
.entered-course {
  height: 100vh;
  background-color: #f5f7fa;
  .tab {
    /deep/ .vux-tab .vux-tab-item.vux-tab-selected {
      color: #4bb9c2;
      border-bottom: 3px solid #4bb9c2;
    }
    /deep/ .vux-tab-ink-bar {
      background-color: #4bb9c2;
    }
  }
  .content {
    .ctn {
      .item {
        background-color: #fff;
        margin-top: 0.2rem;
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

