<template>
  <div class="comment-detail">
     <!-- 头部导航 start -->
     <HeaderNav titleTxt="老师评价学生"/>
     <!-- 头部导航 end -->
    <div class="course-panel">
      <group v-if="isTeacher">
        <cell  :border-intent="false" >
          <div class="avatar" slot="icon">
            <img :src="studentInfo.headimgurl" alt="" v-if="studentInfo.headimgurl">
            <img src="@/assets/images/avatar.png" alt="" v-else>
          </div>
          <div slot="title">
            {{studentInfo.sname}}
          </div>
          <div class="time" >
            {{commentDetail.instime && commentDetail.instime.slice(5,16)}}
          </div>
        </cell>
      </group>
      <group v-else>
        <cell  :border-intent="false" >
          <div class="avatar" slot="icon">
            <img :src="commentDetail.headimgurl" alt="" v-if="commentDetail.headimgurl">
            <img src="@/assets/images/avatar.png" alt="" v-else>
          </div>
          <div slot="title">
            {{commentDetail.tname}}
          </div>
          <div class="time" >
            {{commentDetail.instime && commentDetail.instime.slice(5,16)}}
          </div>
        </cell>
      </group>
    </div>
    <div class="course-panel">
      <editable-input @editchange="editchange" :editable = "!hasComment&&isTeacher" :val="commentDetail.tev">
      </editable-input>
    </div>
    <div class="course-panel">
      <group  class="needsfocus">
        <cell :title="(hasComment || !isTeacher)? '图片预览' : '图片上传'"  :border-intent="false" @click.native="triggerClick"  class="needsclick">
          <div class="img">
            <img src="@/assets/images/upload-img.png" alt="">
          </div>
        </cell>
        <div class="show-img-ctn vux-1px-t" v-if="!hasComment">
          <div class="imgs">
            <div class="img-item img-zoom" v-for="(item, index) in fileList" :key="index" @click="show(index)">
              <img :src="item.src" alt="" class="previewer-demo-img">
              <div class="delete" @click.stop="deleteImg(index)" v-if="!hasComment">
                <img src="@/assets/images/delete.png" alt="">
              </div>
            </div>
          </div>
          <div v-transfer-dom>
            <previewer :list="viewImgList" ref="previewer" :options="options" @on-index-change="logIndexChange">
              <template slot="button-before">
                <span class="previewer-delete-icon-box" @click.stop="removeImg">
                  <img src="@/assets/images/garbage.png" width="22" height="22"  class="previewer-delete-icon">
                </span> 
              </template>
            </previewer>
          </div>
        </div>
        <div class="show-img-ctn vux-1px-t" v-else>
          <div class="imgs">
            <div class="img-item img-zoom" v-for="(item, index) in viewImgList" :key="index" @click="show(index)">
              <img :src="item.src" alt="" class="previewer-demo-img">
            </div>
          </div>
          <div v-transfer-dom>
            <previewer :list="viewImgList" ref="previewer" :options="options" @on-index-change="logIndexChange">
              <template slot="button-before">
                <span class="previewer-delete-icon-box" @click.stop="removeImg">
                  <img src="@/assets/images/garbage.png" width="22" height="22"  class="previewer-delete-icon">
                </span> 
              </template>
            </previewer>
          </div>
        </div>
        <div class="hidden upload needsclick " >
          <input type="file" multiple  ref="file" class="needsclick" @change="updateImg" accept="image/*">
        </div>
      </group>
    </div>
    <div class="btn" v-if="!hasComment && isTeacher"  v-cloak>
      <x-button type="primary" @click.native="confirmComment">确认评价</x-button>
    </div>
  </div>
</template>

<script>
import HeaderNav from '../../../../components/HeadNav';

import typeMixin from '@/mixins/typeMixin'
import {Cell,Group, XButton, Previewer, TransferDom, Toast } from 'vux'
import imageMixin from '@/mixins/imageMixins'
import {mapState} from 'vuex'
import API from '@/api/apiFactory'
import global from '@/global/global'
import editableInput from '@/components/editableInput'
export default {
  name: 'commentDetail',
  mixins:[imageMixin],
  mounted() {
    // 如果是家长端，直接禁止评论
    if (!this.isTeacher) {
      this.hasComment = true
    } else {
      this.getStudentDetail()
    }
    this.getCommentDetail()
  },
  components: {
    Cell,
    Group,
    editableInput,
    XButton,
    Previewer,
    Toast,
    HeaderNav
  },
  data() {
    return {
      studentInfo: {}, // 学生详情
      sid: '', // 学生id
      remark: '', // 评论
      commentDetail: {}, // 评论详情
      viewImgList: [],
      // 文件列表
      fileList: [],
      hasComment: false
    }
  },
  directives:{
    TransferDom
  },
  methods: {
    triggerClick() {
      if (!this.hasComment && this.isTeacher) {
        this.$refs.file.click()
      }
    },
    // 获取学生详情
    getStudentDetail() {
      API.homeAPI.wxAppGetStudent({
        sid: this.sid
      })
      .then(data => {
        this.studentInfo = data
      })
    },
    // 获取评论详情
    getCommentDetail() {
      API.homeAPI.wxEvaluationByStu({
        crid: this.currentCourse.crid,
        tid: this.currentCourse.tid,
        type: 1,
        sid: this.sid
      })
      .then(data => {
        if (data) {
          this.commentDetail = JSON.parse(JSON.stringify(data))
          this.viewImgList = []
          if (data.url) {
            data.url = data.url.split(',')
            data.url.forEach(item => {
              this.viewImgList.push({
                src:global.BASEURL + '/getImgUrl?ftype=photo&imgurl='+ item 
              })
            })
          }
          this.hasComment = parseInt(data.isPj) === 1
        }
      })
    },
    // 确认评价
    confirmComment() {
      let files = this.fileList
      this.hasComment = true
      API.formAPI.sendComment({
        files,
        tid: this.currentCourse.tid,
        crid: this.currentCourse.crid,
        sid: this.sid,
        type: 1,
        remark: this.remark
      })
      .then(res => {
        if (parseInt(res.code) === 1) {
          this.$vux.toast.show({
            text: '评论成功',
            time: 2000,
            width: '2rem'
          })
        } else {
          this.$vux.toast.text(res.msg, 'middle')
        }
        this.getCommentDetail()
      })
    },
    editchange(val) {
      this.remark = val
    }
  },
  computed: {
    isTeacher() {
      return this.type !== 'parent'
    },
    ...mapState({
      currentCourse: 'currentCourse'
    })
  },
  watch: {
    '$route': {
      deep: true,
      immediate: true,
      handler(val) {
        // id name isPj headImgUrl
        let params = val.params.id.split(',')
        this.sid = params[0]
        this.commentDetail.sname = params[1]
        this.commentDetail.isPj = params[2]
        let regx = /\/+(\w*)\/+/
        if (val.path.match(regx)) {
          if (val.path.match(regx)[1] === 'parent' || val.path.match(regx)[1] === 'teacher') {
            this.type = val.path.match(regx)[1]
          }
        }
      }
    }
  }
 }
</script>

<style lang="less" scoped>
.comment-detail{
  height:100vh;
  background-color: #F5F7FA;
  [v-cloak] {
      display: none !important;
  }
  .course-panel{
    padding: 0 .32rem;
    background-color: #fff;
    padding-bottom: .24rem;
    margin-bottom: .24rem;
    /deep/ .weui-cells {
      .vux-label {
        font-size: .3rem;
      }
    }
    padding-bottom: 0;
    /deep/ .weui-cells{
      margin-top: 0;
      &:after{
        display: none;
      }
      &:before{
        display: none;
      }
      .weui-cell {
        padding: 0.2rem 0;
        .avatar {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: .24rem;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: .6rem;
            height: .6rem;
          }
        }
        .time {
          color:rgba(153,153,153,1);
          font-size: .24rem;
        }
      }
    }
  }
  .img {
    display: flex;
    align-items: center;  
    img {
      width: .4rem;
      height: .4rem;
    }
  }
  .hidden {
    display: none;
  }
  .show-img-ctn {
    padding: .32rem 0;
    .imgs {
      display: flex;
      flex-wrap: wrap;
      .img-item{
        width: 2.18rem;
        margin-right: .05rem;
        margin-top: .2rem;
        position: relative;
        border: 1px solid #e8e8e8;
        img {
          width: 2.18rem;
          height: 2.18rem;
        }
        .delete {
          position: absolute;
          display: flex;
          top: -.18rem;
          right: -.1rem;
          z-index: 99;
          img {
            width: .36rem;
            height: .36rem;
          }
        }
      }
      
    }
  }
  .btn {
    padding: .32rem;
    button{
      background:rgba(75,185,194,1);
      border-radius:0.08rem;
    }
  }
}
</style>

