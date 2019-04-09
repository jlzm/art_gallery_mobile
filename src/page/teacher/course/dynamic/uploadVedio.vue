<template>
  <div class="video">
    <div class="header" @click="triggerClick">
      <div class="content">{{hasUpload || this.type === 'parent' ? '查看视频' : '添加视频'}} {{viewVedioList}}</div>
      <div class="head-img">
        <img src="@/assets/images/upload-video.png" alt>
      </div>
    </div>
    <div class="show-video-ctn vux-1px-t">
      <div class="vedios" v-if="!hasUpload">
        <div class="item" v-for="(item, index) in this.fileList" :key="index">
          <div class="video-wrapper">
            <video-player class="vjs-custom-skin" :options="playerOptions(item)"></video-player>
          </div>
          <div class="delete" @click="deleteFile(index)">
            <img src="@/assets/images/delete.png" alt>
          </div>
        </div>
      </div>
      <div class="vedios" v-else>
        <div class="item" v-for="(item, index) in viewVedioList" :key="index">
          <!-- <video controls=""  :src="item.src"></video> -->
          <div class="video-wrapper">
            <video-player class="vjs-custom-skin" :options="playerOptions(item)"></video-player>
          </div>
        </div>
      </div>
      <div class="no-data" v-if="type === 'parent' && !viewVedioList.length">暂无数据</div>
    </div>
    <div class="hidden upload needsclick">
      <input
        type="file"
        multiple
        ref="file"
        class="needsclick"
        accept="video/*"
        @change="updateVedio"
      >
    </div>
    <div class="btn" v-if="type === 'teacher' && !hasUpload && fileList.length">
      <x-button type="primary" @click.native="uploadTrend">上传视频</x-button>
    </div>
  </div>
</template>

<script>
import typeMixin from "@/mixins/typeMixin";
import { XButton } from "vux";
import zoom from "@/mixins/zoom";
import API from "@/api/apiFactory";
import global from "@/global/global";
import { mapState } from "vuex";
import "video.js/dist/video-js.css";
import { videoPlayer } from "vue-video-player";
export default {
  name: "videos",
  mixins: [zoom, typeMixin],
  mounted() {
    this.getVedio();
    console.log('viewVedioList', this.viewVedioList);
  },
  components: {
    XButton,
    videoPlayer
  },
  data() {
    return {
      fileList: [],
      viewVedioList: [],
      // 已上传
      hasUpload: false,
      playerOptions(item, index) {
        const options = {
          playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
          autoplay: false, // 如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: "", // 建议浏览器在加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: "zh-CN",
          aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          // poster: item.videoImg, //你的封面地址
          notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: false // 全屏按钮
        };
        return Object.assign(options, {
          sources: [
            {
              type: "video/mp4",
              src: item.src
            }
          ]
        });
      }
    };
  },
  methods: {
    triggerClick() {
      if (this.hasUpload || this.type === "parent") return;
      this.dbClick(this.$refs.file, "click");
      //  this.$refs.file.click()
    },

    updateVedio(e) {
      var file = e.target.files;
      let regx = /(\.){1}(mp4|rmvb|flv|mpeg|avi|mov)$/gi;
      var _this = this;
      if (this.fileList.length + file.length > 3) {
        this.$vux.toast.show({
          text: '<div style="padding:10px;">请上传少于3部视频</div>',
          type: "text",
          width: "auto"
        });
        return;
      }
      if (file.length) {
      }
      for (let i = 0; i < file.length; i++) {
        let reader = new FileReader();
        let length = this.fileList.length || 0;
        if (file[i] && file[i].name) {
          let name = file[i].name.match(regx);
          if (!name) {
            this.$vux.toast.show({
              text: '<div style="padding:10px;">请上传正确视频格式</div>',
              type: "text",
              width: "auto"
            });
            return;
          } else {
            // this.$vux.toast.text('正在上传请稍后·','middle')
            reader.readAsDataURL(file[i]);
            reader.onload = e => {
              var target = e.target || e.currentTarget;
              file[i].src = target.result;
              this.fileList.push(file[i]);
              // this.fileList[i + length].src = target.result
              this.viewVedioList.push({
                src: file[i].src
              });
              this.$vux.toast.text("预上传成功", "middle");
              _this.$forceUpdate();
            };
          }
        }
      }
    },

    deleteFile(index) {
      this.fileList.splice(index, 1);
    },
    // 上传视频
    uploadTrend() {
      this.hasUpload = true;
      this.$vux.loading.show({
        text: "正在上传视频",
        width: "2.5rem"
      });
      API.formAPI
        .uploadTrend({
          crid: this.currentCourse.crid,
          ftype: "view",
          files: this.fileList,
          openid: this.userInfo.openid
        })
        .then(res => {
          console.log("res", res);
          this.$vux.loading.hide();
          if (res && parseInt(res.code) === 1) {
            this.$vux.toast.show({
              text: "上传成功",
              width: "2rem",
              time: 2000
            });
            this.getVedio();
          } else {
            this.hasUpload = false;
            this.$vux.toast.text(res.msg, "middle");
          }
        });
    },

    // 拉取视频
    getVedio() {
      console.log(global.VIDEOURL);
      this.viewVedioList = [];
      API.homeAPI
        .getTrend({
          crid: this.currentCourse.crid,
          ftype: "view"
        })
        .then(res => {
          console.log("res", res);
          if (res && res.length) {
            this.hasUpload = true;
            res.forEach(item => {
              this.viewVedioList.push({
                src: global.VIDEOURL + item.url
              });
            });
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
.video {
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
  .show-video-ctn {
    padding: 0.32rem;
    .vedios {
      .add {
        border: 1px dashed;
        display: flex;
        width: 2.56rem;
        justify-content: center;
        align-items: center;
        margin-right: 0 !important;
        &.flexCenter {
          margin: 0 auto !important;
        }
      }
      .item {
        position: relative;
        video {
          width: 100%;
          height: 2.5rem;
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
    .video-wrapper {
      /deep/ .video-player {
        .video-js {
          margin: 0.3rem 0;
          .vjs-big-play-button {
            left: 50%;
            top: 50%;
            margin-left: -1.5em;
            margin-top: -0.75em;
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

