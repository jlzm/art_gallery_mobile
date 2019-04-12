<template>
  <div class="viewParentComment">
    <!-- 头部导航 start -->
    <HeaderNav titleTxt="家长评价老师列表"/>
    <!-- 头部导航 end -->
    <div class="wrapper" ref="wrapper">
      <div class="template">
        <div class="course-panel" v-for="(item, index) in commentList" :key="index">
          <div class="top vux-1px-b">
            <div class="avatar">
              <div class="img">
                <img :src="item.headimgurl" alt v-if="item.headimgurl">
                <img src="@/assets/images/avatar.png" alt v-else>
              </div>
              <div class="name">{{item.sname}}</div>
            </div>
            <div class="date">{{item.instime && item.instime.slice(0,-2)}}</div>
          </div>
          <div class="bottom">
            <div class="bottom-title">评价内容</div>
            <div class="content">{{item.tev}}</div>
          </div>
          <div class="rater-wrap">
            <div class="rater-item">
              <span class="rater-title">老师评分</span>
              <rater class="rater" :disabled="true" v-model="item.courserater"></rater>
            </div>
            <div class="rater-item">
              <span class="rater-title">课程评分</span>
              <rater class="rater" :disabled="true" v-model="item.teacherrater"></rater>
            </div>
          </div>
        </div>
        <div v-if="!commentList.length" class="noData">暂无评价记录</div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderNav from "../../../../../components/HeadNav";
import BScroll from "better-scroll";
import { mapState } from "vuex";
import API from "@/api/apiFactory";
import { Rater } from "vux";

export default {
  name: "viewParentComment",
  components: {
    HeaderNav,
    Rater
  },
  mounted() {
    this.getCommentData();
    this.$nextTick(() => {
      this.initScroll();
    });
  },
  data() {
    return {
      commentList: [] // 评论列表
    };
  },
  methods: {
    initScroll() {
      const options = {
        scrollY: true // 因为scrollY默认为true，其实可以省略
      };
      const winHeight = window.innerHeight;
      this.$refs.wrapper.style.height = winHeight + "px";
      this.scroll = new BScroll(this.$refs.wrapper, options);
    },
    getCommentData() {
      // 获取评价信息
      this.commentList = [];
      API.homeAPI
        .getCommentData({
          crid: this.currentCourse.crid,
          tid: this.currentCourse.tid,
          type: 2
        })
        .then(data => {
          console.log("data", data);
          if (data) {
            data.forEach(item => {
              parseInt(item.isPj) !== 2 && this.commentList.push(item);
            });
          }
        });
    }
  },
  computed: {
    ...mapState({
      currentCourse: "currentCourse"
    })
  }
};
</script>

<style lang="less" scoped>
.viewParentComment {
  height: 100vh;
  background-color: #f5f7fa;
  .noData {
    font-size: 0.32rem;
    color: #999999;
    padding-top: 0.25rem;
    text-align: center;
  }
  .course-panel {
    padding: 0.2rem 0.32rem;
    background-color: #fff;
    margin-bottom: 0.2rem;
    .top {
      display: flex;
      justify-content: space-between;
      padding-bottom: 0.1rem;
      .avatar {
        display: flex;
        overflow: hidden;
        .img {
          display: flex;
          align-items: center;
          margin-right: 0.2rem;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 0.8rem;
            height: 0.8rem;
          }
        }
        .name {
          font-size: 0.3rem;
          color: #333;
          justify-content: center;
          align-items: center;
          display: flex;
        }
      }
      .date {
        font-size: 0.24rem;
        color: #999999;
        display: flex;
        align-items: center;
      }
    }
    .bottom {
      .bottom-title {
        color: #888888;
        font-size: 0.24rem;
        margin-top: 0.1rem;
      }
      .content {
        color: #333333;
        font-size: 0.28rem;
        margin-top: 0.24rem;
      }
    }
  }
}
.rater-item {
    
    .rater-title {
    font-size: .28rem;
      color: #333;
    }
    .rater {
        font-size: .24rem;
    }
}
</style>