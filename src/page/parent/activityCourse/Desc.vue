<template>
  <div calss="course-desc">
    <!-- 头部导航 start -->
    <HeadNav titleTxt="活动课程详情"/>
    <!-- 头部导航 end -->
    <div class="course-wrap">
      <div class="course-item">
        <div class="df course-item-title bd-b">
          <div class="title-main">{{currentData.cname || ''}}</div>
          <div class="title-meta">{{currentData.period_need || ''}}课时</div>
        </div>
        <div class="por course-item-content">
          <div class="dib course-item-info vat">
            <p>
              <span class="info-title">活动老师：</span>
              <span class="info-desc">{{currentData.tname || ''}}</span>
            </p>
            <p>
              <span class="info-title">活动日期：</span>
              <span class="info-desc">{{currentData.cdate || ''}}</span>
            </p>
            <p>
              <span class="info-title">活动时间：</span>
              <span class="info-desc">{{currentData.begintime || ''}}-{{currentData.endtime || ''}}</span>
            </p>
            <p>
              <span class="info-title">活动地点：</span>
              <span class="info-desc">{{currentData.room || ''}}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="course-item">
        <div class="course-item-title bd-b">
          <div class="title-main">课程预热</div>
        </div>
        <div class="course-desc txt-wrap">{{currentData.cdesc}}</div>
      </div>

      <div class="course-item">
        <div class="course-item-btn">
          <button
            @click="apply(currentData.crid)"
            :disabled="currentData.cstatus != 0"
            class="btn-content"
            :class=" currentData.cstatus == '0' ? 'btn-status1' : 'btn-status2' "
          >
            <span class="btn-meta">{{currentData.btnTxt}}</span>
            <span v-show="currentData.cstatus == 0" class="btn-desc">仅剩100个名额</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeadNav from "../../../components/HeadNav";

// 公共方法
import pubilcFn from "../../../mixins/pulicFn";

// vux组件
import { XButton, Alert } from "vux";

// vuex
import { mapState } from "vuex";

// api
import API from "@/api/apiFactory";

export default {
  mixins: [pubilcFn],
  components: {
    HeadNav
  },
  data() {
    return {
      currentData: {}
    };
  },

  computed: {
    ...mapState({
      userInfo: "userInfo"
    })
  },

  mounted() {
    this.getCourseDesc();
  },

  methods: {
    /**
     * 获取活动课程详情
     */
    getCourseDesc() {
      let propsData = {
        wsid: this.userInfo.sid,
        crid: this.$route.query.crid
      };
      console.log("propsData", propsData);
      API.homeAPI.getCourseRecordDetails(propsData).then(res => {
        console.log("res", res);
        this.currentData = res.course;
        this.addCstutasBtnTxt();
      });
    },

    /**
     * 添加按钮状态文字
     */
    addCstutasBtnTxt() {
      let currentData = this.currentData;
      switch (currentData.cstatus) {
        case "0":
          currentData.btnTxt = "立即报名";
          break;
        case "1":
          currentData.btnTxt = "已报名";
          break;

        case "2":
          currentData.btnTxt = "名额已满";
          break;

        case "3":
          currentData.btnTxt = "报名结束";
          break;

        default:
          break;
      }
    }
  },

  watch: {}
};
</script>
<style lang='less' scoped>
// public start
.title-main {
  font-size: 0.3rem;
  font-weight: 400;
  color: #000;
}

// public end

.course-item {
  margin-bottom: 0.32rem;
  padding: 0 0.32rem;
  .course-item-title {
    padding: 0.24rem 0;
    justify-content: space-between;

    .title-meta {
      font-size: 0.2rem;
      color: #999;
    }
  }
  // 课程信息
  .course-item-content {
    margin-top: 0.24rem;
    .course-item-img {
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
  }
}

.course-item-btn {
  .btn-content {
    right: 0;
    top: 0;
    width: 100%;
    height: 0.88rem;
    font-size: 0.2rem;
    color: #fff;
    border-radius: 0.06rem;
    border: none;
  }
  .btn-meta {
    font-size: 0.36rem;
    margin-right: 0.24rem;
  }
  .btn-desc {
    font-size: 0.2rem;
  }
  .btn-status1 {
    background-color: #4bb9c2;
  }
  .btn-status2 {
    background-color: #c3c3c3;
  }
}

.course-desc {
  font-size: 0.28rem;
  color: #666;
  padding: 0.32rem 0.2rem;
}
</style>