<template>
<!-- 学生评价列表 -->
  <div class="comment-list">
    
    <!-- 头部导航 start -->
    <HeaderNav titleTxt="评价学生列表"/>
    <!-- 头部导航 end -->

    <card class="card">
      <div slot="content" class="card-demo-flex card-demo-content01">
        <div class="vux-1px-r">
          <span>{{studentList.length || 0}}</span>
          <br/>
          本班人数
        </div>
        <div class="vux-1px-r">
          <span>{{isComment}}</span>
          <br/>
          已评价
        </div>
        <div class="vux-1px-r">
          <span>{{studentList.length - isComment}}</span>
          <br/>
          未评价
        </div>
      </div>
    </card>
    <div class="course-panel single-panel">
      <div class="wrapper" ref="wrapper">
        <group>
          <cell is-link :border-intent="false" v-for="(item, index) in studentList" :key="index" :link="'./commentDetail/' + item.sid + ',' + item.sname + ',' + item.isPj ">
            <div class="avatar" slot="icon">
              <img :src="item.headimgurl" alt="" v-if="item.headimgurl">
              <img src="../../../assets/images/avatar.png" alt="" v-else>
            </div>
            <div slot="title">
              {{item.sname}}
            </div>
            <div>
              <span class="showComment" v-if="parseInt(item.isPj) === 2" >去评价</span>
              <span class="showDetail" v-else>查看详情</span>
            </div>
          </cell>
        </group>
      </div>
    </div>
  </div>
</template>

<script>
    import HeaderNav from '../../../components/HeadNav';
    /** 学生列表 用于跳转评价学生 */
    import {
        Card,
        Group,
        Cell
    } from 'vux'
    import util from '../../../util/util'
    import BScroll from 'better-scroll'
    import {
        mapState
    } from 'vuex'
    import API from '@/api/apiFactory'
    export default {
        name: 'comment-list',
        mounted() {
            this.getStudents()
            this.initScroll()
        },
        components: {
            Card,
            Group,
            Cell,
            HeaderNav
        },
        data() {
            return {
                studentList: [],
                isComment: 0
            }
        },
        methods: {
            getStudents() {
                this.studentList = []
                this.isComment = 0
                API.homeAPI.getCommentData({
                        crid: this.currentCourse.crid,
                        tid: this.currentCourse.tid,
                        type: 1
                    })
                    .then(data => {
                        this.studentList = data
                        data.forEach(item => {
                            parseInt(item.isPj) === 1 && this.isComment++
                        })
                    })
            },
            initScroll() {
                this.$nextTick(() => {
                    const options = {
                        scrollY: true, // 因为scrollY默认为true，其实可以省略
                        click: true
                    }
                    const topHeight = util.getStyle(this.$el.querySelector('.weui-panel'), 'height')
                    const winHeight = window.innerHeight
                    this.$refs.wrapper.style.height = window.innerHeight - parseFloat(topHeight) + 'px'
                    this.scroll = new BScroll(this.$refs.wrapper, options)
                })
            }
        },
        computed: {
            ...mapState({
                currentCourse: 'currentCourse',
                userInfo: 'userInfo'
            })
        }
    }
</script>

<style lang="less" scoped>
    @import '~vux/src/styles/1px.less';
    .comment-list {
        height: 100vh;
        background-color: #F5F7FA;
        .card-demo-flex {
            display: flex;
            &>div {
                flex: 1;
                text-align: center;
                color: #666666;
                font-size: .2rem;
                span {
                    font-size: .32rem;
                    color: #333333;
                }
            }
        }
        .card-demo-content01 {
            padding: 0.2rem 0;
        }
        .course-panel {
            padding: 0 .32rem;
            background-color: #fff;
            padding-bottom: .24rem;
            margin-bottom: .24rem;
            margin-top: .2em;
            .wrapper {
                overflow: hidden;
            }
            &.single-panel {
                padding-bottom: 0;
                /deep/ .weui-cells {
                    &:after {
                        display: none;
                    }
                    &:before {
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
                                width: .8rem;
                                height: .8rem;
                            }
                        }
                        .showDetail {
                            color: rgb(153, 153, 153);
                            font-size: 0.2rem;
                        }
                        .showComment {
                            color: #3D88E0;
                            font-size: .24rem;
                        }
                    }
                }
            }
            /deep/ .weui-cells {
                margin-top: 0;
                .vux-label {
                    font-size: .3rem;
                }
            }
            .panel-title {
                font-size: .3rem;
                color: rgba(0, 0, 0, 1);
                border-bottom: .02rem solid rgba(232, 232, 232, 1);
                padding: .24rem 0;
            }
            .panel-content {
                display: flex;
                flex-direction: column;
                .inline-item {
                    display: flex;
                    justify-content: space-between;
                    margin: .02rem 0;
                    &:first-child {
                        margin-top: .24rem;
                    }
                    .label {
                        color: rgba(102, 102, 102, 1);
                        font-size: .24rem;
                    }
                    .for {
                        font-size: .24rem;
                    }
                }
                .text {
                    font-size: .28rem;
                    color: rgba(102, 102, 102, 1);
                    margin-top: .24rem;
                    line-height: .44rem;
                }
            }
        }
    }
</style>