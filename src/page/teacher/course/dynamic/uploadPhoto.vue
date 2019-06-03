<template>
  <div class="photo">
    <div class="header" @click="triggerClick">
      <div class="content">{{fileList.length >= 9 || this.type === 'parent' ? '查看图片' : '添加图片'}}</div>
      <div class="head-img">
        <img src="@/assets/images/upload-img.png" alt>
      </div>
    </div>
    <!-- <div class="show-img-ctn vux-1px-t" v-if="!this.fileList.length">
      <div class="imgs">
        <div
          class="img-item img-zoom"
          v-for="(item, index) in this.fileList"
          :key="index"
          @click="show(index)"
        >
          <img
            :src="item.src"
            @error="item.src = require('@/assets/images/delete.png')"
            alt
            class="previewer-demo-img"
          >
        </div>
      </div>
      <div v-transfer-dom>
        <previewer
          :list="this.fileList"
          ref="previewer"
          :options="options"
          @on-index-change="logIndexChange"
        ></previewer>
      </div>
    </div> -->
    <div class="show-img-ctn vux-1px-t">
      <div class="imgs">
        <div
          class="img-item img-zoom"
          v-for="(item, index) in fileList"
          :key="index"
          @click="show(index)"
        >
          <img :src="item.src" alt class="previewer-demo-img">
          <div v-if="!hasComment"  class="delete" @click.stop="deleteImg(index)">
            <img src="@/assets/images/delete.png" alt>
          </div>
        </div>
      </div>
      <div v-transfer-dom>
        <previewer
          :list="fileList"
          ref="previewer"
          :options="options"
          @on-index-change="logIndexChange"
        >
        <!-- 移除图片 -->
          <template v-if="!hasComment"  slot="button-before">
            <span class="previewer-delete-icon-box" @click.stop="removeImg">
              <img
                src="@/assets/images/garbage.png"
                width="22"
                height="22"
                class="previewer-delete-icon"
              >
            </span>
          </template>
        </previewer>
      </div>
      <div class="no-data" v-if="type === 'parent' && !fileList.length">暂无数据</div>
    </div>
    <div class="hidden upload needsclick">
      <input
        type="file"
        multiple
        ref="file"
        class="needsclick"
        @change="updateImg"
        accept="image/*"
      >
    </div>
    <div class="btn" v-if="type === 'teacher' && !hasComment && fileList.length <= 9">
      <x-button type="primary" @click.native="uploadTrend">上传图片</x-button>
    </div>
  </div>
</template>

<script>
import typeMixin from "@/mixins/typeMixin";
import { XButton, Previewer, TransferDom, Confirm } from "vux";
import imageMixin from "@/mixins/imageMixins";
import API from "@/api/apiFactory";
import global from "@/global/global";
import { mapState } from "vuex";
// import zoom from '@/mixins/zoom'
export default {
  name: "photo",
  components: {
    XButton,
    Previewer,
    Confirm
  },
  mixins: [typeMixin, imageMixin],
  mounted() {
    this.getPhoto();
  },
  data() {
    return {
      fileList: [],
      trendDetail: [],
      fileList: [],
      // 是否评论过
      hasComment: false
    };
  },
  directives: {
    TransferDom
  },
  methods: {
    triggerClick() {
      if (this.fileList.length >= 9 || this.type === "parent") return;
      this.$refs.file.click();
    },

    // 获取图片数据
    getPhoto() {
      API.homeAPI
        .getTrend({
          crid: this.currentCourse.crid,
          ftype: "photo"
        })
        .then(res => {
          console.log("res", res);
          if (res && res.length) {
            this.trendDetail = res;
            console.log(this.trendDetail);
            // this.hasComment = true;
            if (this.trendDetail[0]) {
              this.trendDetail[0].url.split(",").forEach(item => {
                console.log("imgItem", item);
                this.fileList.push({
                  src: global.IMGURL + item
                });
              });
            }
            console.log('this.fileList.length', this.fileList.length);
            if(this.fileList.length >= 9) this.hasComment = true;;
            console.log("fileList", this.fileList);
          }
        });
    },
    // 上传图片按钮
    uploadTrend() {
      this.$vux.confirm.show({
        // 组件除show外的属性
        title: "提示",
        content: "是否确认上传图片？",
        onCancel: () => {
          console.log(this); //当前 vm
        },
        onConfirm: () => {
          this.uploadFn();
        }
      });
    },
    // 上传图片
    uploadFn() {
      API.formAPI
        .uploadTrend({
          crid: this.currentCourse.crid,
          ftype: "photo",
          files: this.fileList,
          openid: this.userInfo.openid
        })
        .then(res => {
          if (res && parseInt(res.code) === 1) {
            if(this.fileList.length >= 9) this.hasComment = true;;
            this.$vux.toast.show({
              text: "上传成功",
              width: "2rem",
              time: 2000
            });
          } else {
            this.$vux.toast.text(res.msg, "middle");
          }
        });
    }
  },
  computed: {
    ...mapState({
      currentCourse: "currentCourse",
      userInfo: "userInfo"
    })
  }
};
</script>

<style lang="less" scoped>
.photo {
  height: 100vh;
  background-color: #f5f7fa;
  .no-data {
    font-size: 0.4rem;
    text-align: center;
    color: #999999;
  }
  .header {
    display: flex;
    justify-content: space-between;
    padding: 0.26rem 0.32rem;
    font-size: 0.3rem;
    background: #fff;
    .content {
      align-self: center;
    }
    .head-img {
      align-self: center;
      display: flex;
      img {
        width: 0.48rem;
        height: 0.48rem;
      }
    }
  }
  .hidden {
    display: none;
  }
  .show-img-ctn {
    padding: 0.32rem;
    .imgs {
      display: flex;
      flex-wrap: wrap;
      .add {
        border: 1px dashed;
        display: flex;
        align-items: center;
        margin-right: 0 !important;
        &.flexCenter {
          margin: 0 auto !important;
        }
      }
      .img-item {
        width: 2.18rem;
        margin-right: 0.1rem;
        position: relative;
        margin-bottom: 0.25rem;
        z-index: 98;
        img {
          width: 2.18rem;
          height: 2.18rem;
        }
        .delete {
          position: absolute;
          display: flex;
          top: -0.18rem;
          right: -0.1rem;
          z-index: 99;
          img {
            width: 0.36rem;
            height: 0.36rem;
          }
        }
      }
    }
  }
  .btn {
    padding: 0.32rem;
    button {
      background: rgba(75, 185, 194, 1);
      border-radius: 0.08rem;
    }
  }
}
</style>