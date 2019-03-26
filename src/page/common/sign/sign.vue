<template>
  <div class="sign">
    <card class="card">
      <div slot="content" class="card-demo-flex card-demo-content01">
        <div class="vux-1px-r">
          <span>{{(signStudentList && signStudentList.length) || 0}}</span>
          <br/>
          本班人数
        </div>
        <div class="vux-1px-r">
          <span>{{(signed && signed.length) || 0}}</span>
          <br/>
          实到人数
        </div>
        <div class="vux-1px-r">
          <span>{{notSigned}}</span>
          <br/>
          未到人数
        </div>
      </div>
    </card>
    <div class="student-list">
      <div class="wrapper" ref="wrapper">
        <group>
          <checker v-model="signed" default-item-class="signed-item" selected-item-class="signed-item-selected"  @on-change="changeValue" type="checkbox">
            <checker-item v-for="(item, index) in signStudentList" :key="index" :value="item.sid" :disabled = "type === 'parent'"> 
              <cell>
                <div class="avatar" slot="icon">
                  <img :src="item.headimgurl" alt="" v-if="item.headimgurl">
                  <img src="../../../assets/images/avatar.png" alt="" v-else>
                </div>
                <div slot="title">
                  {{item.sname}}
                </div>
                <div>
                   <icon type="success" v-show="(~signed.indexOf(item.sid))"></icon>
                   <icon type="success" v-show="!(~signed.indexOf(item.sid))" class="not-check"></icon>
                </div>
              </cell>
            </checker-item>
          </checker>
        </group>
        
      </div>
    </div>
    <div class="btn" v-if="type === 'teacher'">
      <x-button type="primary" @click.native = "sign">签到</x-button>
    </div>
  </div>
</template>

<script>
import {Card, Group, Cell, CheckIcon, Checker, CheckerItem, Icon, XButton } from 'vux'
import util from '../../../util/util'
import BScroll from 'better-scroll'
import {mapState} from 'vuex'
import typeMixin from '@/mixins/typeMixin'
import API from '@/api/apiFactory'
export default {
  name: 'sign',
  mixins: [typeMixin],
  mounted() {
    this.getSignData()
    this.initScroll() //bs 和 checker一起用的时候会在安卓手机上出现问题
  },
  components: {
    Card,
    Group,
    Cell,
    CheckIcon,
    Checker,
    CheckerItem,
    Icon,
    XButton
  },
  data () {
    return {
      studentList: [],
      commonList: [],
      signed: [],
      // 登录页面信息 老师还是家长
      type:'',
      // 当前课程id
      crid: '',
      signStudentList: [
       
      ],
      scroll: {}
    }
  },
  methods: {
    changeValue(val) {
    },
    // bScroll
    initScroll() {
      this.$nextTick(() => {
        const options = {
          scrollY: true, // 因为scrollY默认为true，其实可以省略
          click: true
        }
        const topHeight = util.getStyle(this.$el.querySelector('.weui-panel'), 'height')
        const winHeight = window.innerHeight
        let bottomHeight = 0
        if (this.type === 'teacher') {
          bottomHeight = util.getStyle(this.$el.querySelector('.btn'), 'height')
        }
        this.$refs.wrapper.style.height = window.innerHeight - parseFloat(topHeight) - parseFloat(bottomHeight || 0) + 'px'
        this.scroll = new BScroll(this.$refs.wrapper, options)
      })
    },
    getSignData() {
      this.signed = []
      API.homeAPI.getSignData({crid:this.crid})
        .then(data => {
          if (data && data.length) {
            data.forEach((item, index) => {
              // 签到学生推入
              if (item.ifsign) {
                this.signed.push(item.sid)
              }
            })
            this.signStudentList = data
          }
        })
    },
    // 签到
    sign() {
      if (this.signed.length) {
        API.homeAPI.consumeStuPeriod({
          arriveid: this.signed.join(','),
          crid: this.crid,
          tid: this.currentCourse.tid
        })
        .then(data => {
          if (data && parseInt(data.code) === 1) {
            this.$vux.toast.show({
              text: '签到成功',
              time: 2000,
              width: '2.5rem'
            })  
          } else {
            this.getSignData()
            this.$vux.toast.text('签到失败', data.msg)
          }
        })
         
      } else {
        this.$vux.toast.text('请选择学生后再签到','middle')
      }
      
    }
  },
  computed: {
    // 未签到人数
    notSigned() {
      return this.signStudentList.length - this.signed.length
    },
    ...mapState({
      currentCourse: 'currentCourse'
    })
  },
  watch: {
    '$route':{
      deep: true,
      immediate: true,
      handler(val) {
        this.type = val.meta.type
        this.crid = val.params.crid
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~vux/src/styles/1px.less';
.sign {
  height: 100vh;
  background-color: #F5F7FA;
  overflow: hidden;
  .card-demo-flex {
    display: flex;
  }
  .card-demo-content01 {
    padding: 0.2rem 0;
  }
  .card-padding {
    padding: .3rem;
  }
  .card-demo-flex > div {
    flex: 1;
    text-align: center;
    color: #666666;
    font-size: .2rem;
    span {
      font-size: .32rem;
      color: #333333;
    }
  }
  .student-list {
    // margin-top: .2rem;
    .wrapper {
      overflow: hidden;
      .signed-item {
        border: 1px solid #ececec;
        padding: 5px 15px;
        &.vux-checker-item {
          padding: 0;
          display: block;
        }
      }
      /deep/ .weui-cells {
        // margin-top: .2rem;
        .weui-cell {
          .avatar {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: .24rem;
            border-radius: 50%;
            overflow: hidden;
            img {
              width: .8rem;
              height: .8rem;
            }
          }
          .vux-label {
            font-size: .3rem;
          }
          .weui-icon-success {
            color: rgba(75,185,194,1);
            &.not-check {
              color: rgba(216,216,216,1);
            }
          }
        }
      } 
    }
  }
  .btn {
    padding: .3rem .32rem;
    box-sizing: border-box;
    button {
      background:rgba(75,185,194,1);
    }
  }
}
</style>

