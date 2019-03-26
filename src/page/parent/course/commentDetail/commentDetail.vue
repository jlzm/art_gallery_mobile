<template>
  <div class="parent-comment">
    <div class="course-panel">
      <group>
        <cell  :border-intent="false" >
          <div class="avatar" slot="icon">
            <img :src="teacherInfo.headimgurl" alt="" v-if="teacherInfo.headimgurl">
            <img src="@/assets/images/avatar.png" alt="" v-else>
          </div>
          <div slot="title">
             {{teacherInfo.tname}}
          </div>
        </cell>
      </group>
    </div>
    <div class="course-panel">
      <editable-input @editchange="editchange" :editable = "!hasComment" :val="comment">

      </editable-input>
    </div>
    <div class="btn" v-if="!hasComment">
      <x-button type="primary" @click.native="confirmComment">确认评价</x-button>
    </div>
  </div>
</template>

<script>
/** 家长评论老师 */
import typeMixin from '@/mixins/typeMixin'
import {Cell,Group, XButton} from 'vux'
import zoom from '@/mixins/zoom'
import editableInput from '@/components/editableInput'
import API from '@/api/apiFactory'
import {mapState} from 'vuex'
export default {
  name: 'commentDetail',
  mixins:[zoom, typeMixin],
  mounted() {
    // 如果是老师端，直接禁止评论
    if (this.isTeacher) {
      this.hasComment = true
    }
    this.getComment()
  },
  components: {
    Cell,
    Group,
    editableInput,
    XButton
  },
  data() {
    return {
      hasComment: false,
      teacherInfo: {
        headimgurl: '',
        tname: '快乐木马'
      },
      comment: ''
    }
  },
  methods: {
    triggerClick() {
      if (this.type !== 'parent') {
        this.dbClick(this.$refs.file,'click')
      }
    },
    editchange(val) {
      this.comment = val
    },
    // 确认评价
    confirmComment () {
      if (this.comment.length) {
        API.homeAPI.insertParentEvaluation({
          crid: this.currentCourse.crid,
          sid: this.userInfo.sid,
          tid: this.currentCourse.tid,
          type: 2,
          remark: this.comment
        })
        .then((data) => {
          if (parseInt(data.code)  === 1) {
            this.hasComment = true
            this.$vux.toast.show({
              text: '评价成功',
              time: 2000,
              width: '2rem'
            })
          } else {
             this.$vux.toast.text(data.msg,'middle')
          }
        })
      } else {
        this.$vux.toast.text('请填写评价','middle')
      }
    },
    getComment() {
      API.homeAPI.wxEvaluationByStu({
        crid: this.currentCourse.crid,
        sid: this.userInfo.sid,
        tid: this.currentCourse.tid,
        type: 2
      })
      .then((data) => {
        // 是否已经评价
        if (data) {
          this.hasComment = parseInt(data.isPj) !== 2
          this.teacherInfo = {
            tname:data.tname,
            headimgurl: data.headimgurl
          }
          this.comment = data.tev
        }
      })
    },
    
  },
  computed: {
    isTeacher() {
      return this.type !== 'parent'
    },
    ...mapState({
      currentCourse: 'currentCourse',
      userInfo: 'userInfo'
    })
  }
 }
</script>

<style lang="less" scoped>
.parent-comment{
  height:100vh;
  background-color: #F5F7FA;
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
      justify-content: space-between;
      flex-wrap: wrap;
      .img-item{
        width: 2.18rem;
        img {
          width: 2.18rem;
          height: 2.18rem;
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

