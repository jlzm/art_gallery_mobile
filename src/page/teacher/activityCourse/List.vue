<template>
  <div calss="course-list">
    <!-- 头部导航 start -->
    <HeadNav titleTxt="活动课程"/>
    <!-- 头部导航 end -->
    <div class="tab-wrap">
          <tab bar-active-color="#58b9c1" active-color="#58b9c1">
          <tab-item  selected @on-item-click="onItemClick(1)">火热报名</tab-item>
          <tab-item @on-item-click="onItemClick(2)">往期活动</tab-item>
    </tab>
    </div>
    <div class="course-wrap">
      <div class="wapper" ref="wrapper">
        <div class="ctn">
          <div
            @click.stop="routerCourse(item)"
            v-for="(item, index) in currentData"
            :key="index"
            class="course-item"
          >
            <div class="df course-item-title bd-b">
              <div class="title-main">{{item.cname}}</div>
              <div class="title-meta">{{item.period_need}}课时</div>
            </div>
            <div class="por course-item-content">
              
              <div class="dib course-item-img vat">
                <img
                  :src="item.cpicture"
                  @error="item.cpicture = require('@/assets/images/activity_course.png')"
                  alt
                >
              </div>
              <div class="dib course-item-info vat txt-omit">
                <p>
                  <span class="info-title">老师：</span>
                  <span class="info-desc">{{item.tname}} - {{item.atname}}</span>
                </p>
                <p>
                  <span class="info-title">日期：</span>
                  <span class="info-desc">{{item.cdate}}</span>
                </p>
                <p>
                  <span class="info-title">时间：</span>
                  <span class="info-desc">{{item.begintime}}-{{item.endtime}}</span>
                </p>
                <p class="txt-omit">
                  <span class="info-title">地点：</span>
                  <span class="info-desc">{{item.room}}</span>
                </p>
              </div>
            </div>
          </div>
          <p class="more" v-if="showMore">{{info}}</p>
        </div>
      </div>
    </div>
    <div class="alert-wrap">
      <alert v-model="applyMsg.show" :title="applyMsg.title">{{ applyMsg.desc }}</alert>
    </div>
    <div class="confirm-wrap">
      <confirm v-model="showConfirm" title="提示" @on-confirm="onConfirm()">
        <p style="text-align:center;">是否确认报名？</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import HeadNav from "../../../components/HeadNav";

// 公共方法
import pubilcFn from "../../../mixins/pulicFn";

// api
import API from "@/api/apiFactory";

// vuex
import { mapState } from "vuex";

//   vux组件
import { Tab, TabItem, XButton, Alert, Confirm } from "vux";

import BScroll from "better-scroll";
import global from '../../../global/global';
export default {
  // 混入
  mixins: [pubilcFn],

  components: {
    Tab,
    TabItem,
    HeadNav,
    XButton,
    Alert,
    Confirm
  },

  data() {
    return {
      courseStatus: 1,
      currentCrid: null,
      showConfirm: false,
      applyMsg: {
        show: false,
        title: "",
        desc: ""
      },
      currentData: [],
      btnStatus: 0, //按钮状态
      // btnTxt: "立即报名", //按钮文字
      pagenum: 1,
      pageSize: 10,
      pagenumCount: null,
      courseList: "",
      showMore: false,
      info: "加载更多"
    };
  },
  computed: {
    ...mapState({
      userInfo: "userInfo"
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.initScroll();
    });
    this.getActiveData(this.courseStatus);
  },
  methods: {
    /**
     * 活动切换
     */
    onItemClick(status) {
      this.courseStatus = status;
      console.log('this.courseStatus', this.courseStatus);
      this.getActiveData(this.courseStatus);
    },

    /**
     * 确认报名
     */
    onConfirm() {
      this.applyMsg.show = true;
      let propsData = {
        crid: this.currentCrid,
        sid: this.userInfo.sid
      };
      console.log("propsData", propsData);
      API.homeAPI.wxSignUpCourseRecords(propsData).then(res => {
        console.log("res", res);
        switch (res.code) {
          case 1:
            this.applyMsg.title = "成功";
            this.applyMsg.desc = res.msg;
            this.pagenum = 1;
            this.getActiveData();
            break;

          default:
            this.applyMsg.title = "失败";
            this.applyMsg.desc = res.msg;
            break;
        }
      });
    },

        /**
     * 立即报名
     */
    apply(crid) {
      this.currentCrid = crid;
      this.showConfirm = true;
    },

    /**
     * 跳转活动课程详情页
     */
    routerCourse(item) {
      const path = "/parent/activityCourse/desc";
      let query = {
        crid: item.crid
      };
      this.routeLink(path, query);
    },


    initScroll() {
      const options = {
        scrollY: true, // 因为scrollY默认为true，其实可以省略,
        click: true,
        pullUpLoad: {
          threshold: -30,
          moreTxt: "加载更多"
        }
      };
      const winHeight = window.innerHeight - 90;
      this.$refs.wrapper.style.height = winHeight + "px";
      this.scroll = new BScroll(this.$refs.wrapper, options);
      this.scroll.on("pullingUp", () => {
        if (this.pagenum >= this.pagenumCount) {
          this.showMore = true;
          this.info = "没有更多数据了...";
          return;
        }
        this.pagenum++;
        this.getActiveData(this.courseStatus);
      });
    },

    /**
     * 停止下拉
     */ endScroll() {
      this.$nextTick(() => {
        this.scroll.finishPullUp();
        this.scroll.refresh();
        this.showMore = false;
      });
    },

    /**
     * 获取活动课程列表
     * 作者：jlzm
     */
    getActiveData(wxstatus) {
      console.log('this.userInfo', this.userInfo);
      let propsData = {
        tid: this.userInfo.tid,
        page: this.pagenum,
        rows: this.pageSize,
        wxstatus: 0,
        ctype: 2
      };
      console.log("propsData", propsData);
      API.post('wxTeacherCourse', propsData).then(res => {
        console.log("res", res);
        if (res.total <= 0) {
          this.$vux.toast.text("暂无数据", "middle");
          return;
        }

        if (this.pagenum == 1) {
          this.currentData = res.rows;
        } else {
          this.currentData = this.currentData.concat(res.rows);
        }

        this.pagenumCount = res.pageCount;
        this.addCstutasBtnTxt();

        this.endScroll();
        console.log(this.currentData);
      });
    },

    /**
     * 添加按钮状态文字
     */
    addCstutasBtnTxt() {
      this.currentData.forEach(item => {
        switch (item.cstatus) {
          case "0":
            item.btnTxt = "立即报名";
            break;
          case "1":
            item.btnTxt = "已报名";
            break;

          case "2":
            item.btnTxt = "名额已满";
            break;

          case "3":
            item.btnTxt = "报名结束";
            break;

          default:
            break;
        }
        item.cpicture = global.IMGURL + item.cpicture;
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import url('../../../assets/css/activityCourse/public.less');
.course-wrap {
  background: #f5f5f5;
}

.course-item {
  background: #fff;
  margin-bottom: 0.32rem;
  padding: 0 0.32rem;
  .course-item-title {
    padding: 0.24rem 0;
    justify-content: space-between;
    // .title-main {
    //   font-size: 0.3rem;
    //   font-weight: 400;
    //   color: #000;
    //   font-weight: bold;
    // }

    // .title-meta {
    //   font-size: .28rem;
    //   color: #000;
    //   font-weight: bold;
    // }
  }
  // 课程信息
  .course-item-content {
    margin-top: 0.24rem;
    .course-item-img {
      width: 1.2rem;
      height: 1.6rem;
    }
    .course-item-info {
      line-height: 0.4rem;
      width: 5.16rem;
      height: 1.54rem;
      font-size: 0.24rem;
      .info-title {
        color: #666;
      }
      .info-desc {
        color: #333;
      }
    }
    .course-item-btn {
      .btn-content {
        right: 0;
        top: 0;
        width: 1.16rem;
        height: 0.48rem;
        font-size: 0.2rem;
        color: #fff;
        border-radius: 0.06rem;
        border: none;
      }
      .btn-status1 {
        background-color: #4bb9c2;
      }
      .btn-status2 {
        background-color: #c3c3c3;
      }
    }
  }
}

.more {
  font-size: 0.28rem;
  color: #8d8e8f;
  margin-top: 0.3rem;
  text-align: center;
}
</style>
