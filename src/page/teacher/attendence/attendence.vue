<template>
  <div class="attendence">
    <!-- 头部导航 start -->
    <HeaderNav titleTxt="考勤记录" />
    <!-- 头部导航 end -->
    <div class="calender-header">
      <div class="pre" @click="switchViewToMonth(0)">
        <x-icon type="ios-arrow-back" size="30"></x-icon>
        <div class="span">
          上一月
        </div>
      </div>
      <div class="fakeInput" @click="showDate = true">
        <div class="month vux-1px-r">
          {{year}}年{{month}}月份
        </div>
        <div class="calender-icon">
          <img src="@/assets/images/calendar.png" alt="">
        </div>
      </div>
      <div class="next" @click="switchViewToMonth(1)">
        <div class="span">
          下一月
        </div>
        <x-icon type="ios-arrow-forward" size="30"></x-icon>
      </div>
      <group v-show="false">
        <datetime v-model="chooseValue" :show.sync="showDate"></datetime>
      </group>
    </div>
    <div class="content">
      <inline-calendar ref="calendar" @on-change="onChange" @on-view-change="onViewChange" class="inline-calendar-demo"
        :show.sync="show" v-model="chooseValue" :range="range" :show-last-month="showLastMonth"
        :show-next-month="showNextMonth" :highlight-weekend="highlightWeekend" :return-six-rows="return6Rows"
        :hide-header="true" :hide-week-list="hideWeekList" :replace-text-list="replaceTextList" :weeks-list="weeksList"
        :render-function="buildSlotFn" :disable-past="disablePast" :disable-future="disableFuture"
        :disable-weekend="disableWeekend" :disable-date-function="disableDateFunction">
      </inline-calendar>
      <div class="sign">
        <div class="time">
          <div class="img">
            <img src="@/assets/images/check-time.png" alt="">
          </div>
          <div class="text" :class="hasSigned && 'signed'">
            上班打卡 --:--:--
          </div>
        </div>
        <div class="location">
          <div class="img">
            <img src="@/assets/images/check-location.png" alt="">
          </div>
          <div class="text" :class="hasSigned && 'signed'">
            岳麓区岳麓大道
          </div>
        </div>
        <div class="sign-now">
          <x-button>
            打卡
          </x-button>
        </div>
      </div>
      <div class="sign">
        <div class="time">
          <div class="img">
            <img src="@/assets/images/notcheck-time.png" alt="">
          </div>
          <div class="text" :class="hasSigned && 'signed'">
            下班打卡 --:--:--
          </div>
        </div>
        <div class="location">
          <div class="img">
            <img src="@/assets/images/check-location.png" alt="">
          </div>
          <div class="text" :class="hasSigned && 'signed'">
            岳麓区岳麓大道
          </div>
        </div>
        <div class="sign-now">
          打卡
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import HeaderNav from '../../../components/HeadNav';
    /**考勤记录 */
    import {
        InlineCalendar,
        Datetime,
        Group,
        XButton,
        dateFormat
    } from 'vux'
    export default {
        name: 'attendence',
        mounted() {
            this.$nextTick(() => {
                this.chooseValue = 'TODAY'
            })
        },
        components: {
            InlineCalendar,
            Datetime,
            Group,
            XButton,
            HeaderNav
        },
        methods: {
            onChange(val) {},
            onViewChange(val, count) {
                this.month = val.month
                this.year = val.year
            },
            // 跳转时间
            switchViewToMonth(type) {
                let choose = this.chooseValue
                let year
                let month
                if (!(this.year && this.month)) {
                    year = parseInt(this.chooseValue.slice(0, 4))
                    month = parseInt(this.chooseValue.slice(5, 7))
                } else {
                    year = this.year
                    month = this.month
                }
                if (type === 0) {
                    if (month === 1) {
                        year--
                        month = 13
                    }
                    month--
                } else {
                    if (month === 12) {
                        year++
                        month = 0
                    }
                    month++
                }
                this.$refs.calendar.switchViewToMonth(year, month)
            }
        },
        data() {
            return {
                // 当前时间
                month: '',
                year: '',
                // 配置项
                show: true,
                chooseValue: '',
                listValue: '',
                range: false,
                showLastMonth: true,
                showNextMonth: true,
                highlightWeekend: false,
                return6Rows: true,
                hideHeader: false,
                hideWeekList: false,
                replaceTextList: {},
                replace: false,
                changeWeeksList: false,
                weeksList: [],
                useCustomFn: false,
                buildSlotFn: () => '',
                disablePast: false,
                disableFuture: false,
                disableWeekend: false,
                disableDateFunction(date) {
                    if (date.formatedDate === '2017-10-16') {
                        return true
                    }
                },
                // 显示时间插件
                showDate: false,
                hasSigned: false
            }
        },
        watch: {
            replace(val) {
                this.replaceTextList = val ? {
                    'TODAY': '今'
                } : {}
            },
            useCustomFn(val) {
                this.buildSlotFn = val ? (line, index, data) => {
                    return /8/.test(data.date) ?
                        '<div style="font-size:12px;text-align:center;"><span style="display:inline-block;width:5px;height:5px;background-color:red;border-radius:50%;"></span></div>' :
                        '<div style="height:19px;"></div>'
                } : () => ''
            },
            changeWeeksList(val) {
                this.weeksList = val ? ['日', '一', '二', '三', '四', '五', '六 '] : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
            }
        },
    }
</script>

<style lang="less" scoped>
    .attendence {
        height: 100vh;
        background-color: #F5F7FA;
        .calender-header {
            display: flex;
            justify-content: space-between;
            background-color: #4BB9C2;
            padding: .32rem;
            /deep/ svg {
                width: .32rem;
                height: .32rem;
                fill: #fff;
            }
            .fakeInput {
                font-size: .28rem;
                color: #333;
                padding: .1rem .2rem;
                background-color: #fff;
                border-radius: 0.04rem;
                display: flex;
                align-items: center;
                .calender-icon {
                    margin-left: .2rem;
                    img {
                        height: .2rem;
                        width: .2rem;
                    }
                }
                .month {
                    padding-right: .14rem;
                }
                .vux-1px-r:after {
                    border-right: 1px solid #333;
                    color: #333;
                }
            }
            .pre {
                .span {
                    font-size: .32rem;
                }
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;
            }
            .next {
                .span {
                    font-size: .32rem;
                }
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;
            }
        }
        .content {
            padding: .38rem .32rem;
            .inline-calendar-demo {
                /deep/ table {
                    thead {
                        margin-top: .4rem;
                        tr {
                            font-size: .3rem;
                            th {
                                padding-top: .2rem;
                            }
                        }
                    }
                    tbody {
                        td {
                            font-size: .28rem;
                        }
                    }
                }
            }
            .sign {
                background-color: #fff;
                margin-top: .2rem;
                padding: .22rem;
                color: #666;
                position: relative;
                &:last-child {
                    // padding-top: 0;
                }
                .time,
                .location {
                    margin: .04rem 0;
                    .img {
                        display: flex;
                        align-items: center;
                        margin-right: .16rem;
                        img {
                            width: .24rem;
                            height: .24rem;
                        }
                    }
                    font-size: .28rem;
                    display: flex;
                }
                .sign-now {
                    position: absolute;
                    right: .22rem;
                    top: .3rem;
                    font-size: .2rem;
                    /deep/ button {
                        font-size: .2rem;
                        border: 1px solid rgba(75, 185, 194, 1);
                        background: rgba(255, 255, 255, 1);
                        border-radius: 1rem;
                        color: rgba(75, 185, 194, 1);
                        &.weui-btn::after {
                            border: none;
                        }
                    }
                    // padding:.1rem .2rem;
                    // background:rgba(255,255,255,1);
                    // border:0.02rem solid rgba(75,185,194,1);
                    // opacity:1;
                    // border-radius:1rem;
                    // line-height: 0.2rem;
                }
            }
        }
    }
</style>