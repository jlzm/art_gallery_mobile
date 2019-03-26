<template>
  <!-- 头部导航 start -->
  <div class="header">
    <x-header
      @on-click-more="headShowMore = true"
      :left-options="{ preventGoBack: true, backText: '' }"
      :right-options="{ showMore: true }"
    >
      <span class="title dib">
        {{titleTxt}}
      </span>
    </x-header>
  </div>
</template>



<script>
// 组件
import { XHeader } from "vux";

export default {
  props: {
    titleTxt: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  }
};
</script>

<style lang="">
</style>