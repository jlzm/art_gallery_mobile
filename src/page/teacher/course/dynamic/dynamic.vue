<template>
  <div class="trends">
    <!-- 头部导航 start -->
    <HeaderNav titleTxt="课程动态" />
    <!-- 头部导航 end -->
    <div class="tab">
      <tab active-color="#4BB9C2">
        <tab-item :selected="this.upLoadType === 'photo'" @on-item-click="onItemClick">图片</tab-item>
        <tab-item :selected="this.upLoadType !== 'photo'" @on-item-click="onItemClick">视频</tab-item>
      </tab>
    </div>
    <div class="view">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
    import HeaderNav from '../../../../components/HeadNav';
    /** 活动课程 */
    import typeMixin from '@/mixins/typeMixin'
    import {
        Tab,
        TabItem
    } from 'vux'
    export default {
        name: 'trends',
        mixins: [typeMixin],
        data() {
            return {
                upLoadType: 'photo'
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.$router.replace('/' + this.type + '/trends/' + this.upLoadType)
            })
        },
        components: {
            Tab,
            TabItem,
            HeaderNav
        },
        methods: {
            onItemClick(index) {
                const map = ['photo', 'vedio']
                this.$router.replace('/' + this.type + '/trends/' + map[index])
            }
        },
        watch: {
            $route: {
                deep: true,
                immediate: true,
                handler(val) {
                    this.upLoadType = (/vedio/ig).test(val.name) ? 'vedio' : 'photo'
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .tab {
        position: sticky;
        top: 0;
        z-index: 9;
    }
</style>