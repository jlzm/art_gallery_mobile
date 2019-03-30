<template>
  <div>
    <!-- 头部导航 start -->
    <HeadNav titleTxt="活动课程"/>
    <!-- 头部导航 end -->
    <div class="course-wrap">
      <div class="course-item">
        <div class="df course-item-title bd-b">
          <div class="title-main">综合技法素描写生</div>
          <div class="title-meta">24课时</div>
        </div>
        <div class="por course-item-content">
          <div class="dib course-item-img vat">
            <img src="@/assets/images/activity_course.png" alt>
          </div>
          <div class="dib course-item-info vat">
            <p>
              <span class="info-title">活动老师：</span>
              <span class="info-desc">李亚东</span>
            </p>
            <p>
              <span class="info-title">活动日期：</span>
              <span class="info-desc">2019/3/28</span>
            </p>
            <p>
              <span class="info-title">活动时间：</span>
              <span class="info-desc">14：00-15：00</span>
            </p>
            <p>
              <span class="info-title">活动地点：</span>
              <span class="info-desc">麓谷企业广场F4栋14楼</span>
            </p>
          </div>
          <div class="course-item-btn">
            <button
              class="poa btn-content"
              :class=" btnStatus == 0 ? 'btn-status1' : 'btn-status2' "
            >{{btnTxt}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeadNav from "../../../components/HeadNav";

// api
import API from "@/api/apiFactory";
//   vux组件
import { XButton } from "vux";
export default {
  components: {
    HeadNav,
    XButton
  },
  data() {
    return {
      btnStatus: 0, //按钮状态
      btnTxt: "立即报名", //按钮文字
      pagenum: 10,
      pageSize: 1,
      courseList: '',
    };
  },
  methods: {
    /**
     * 获取活动课程列表
     * 作者：jlzm
     */
      getActiveData(status) {
        let propsData = {
          uid: '1',
          page: this.pageJSON.currentPage,
            rows: this.pageJSON.pageSize,
            status: status || 0,
            ctype: 2
        };
       API.getCourseByPage(propsData).then(res => {
         console.log('res', res);
       })


      }
  }
};
</script>

<style lang="less" scoped>
.course-item {
  margin-bottom: 0.32rem;
  padding: 0 0.32rem;
  .course-item-title {
    padding: 0.24rem 0;
    justify-content: space-between;
    .title-main {
      font-size: 0.3rem;
      font-weight: 400;
      color: #000;
    }

    .title-meta {
      font-size: 0.2rem;
      color: #999;
    }
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
</style>
