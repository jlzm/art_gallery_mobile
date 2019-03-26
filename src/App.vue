<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import {mixin} from './mixins/cacl'
export default {
  name: 'App',
  mixins: [mixin],
  mounted() {

  },
  methods: {}
}
</script>

<style lang="less">
@import '~vux/src/styles/1px.less';
#app {
  font-family: 'PingFang SC', 'Droid Sans', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
* {
  padding: 0;
  margin: 0;
}
body {
}
</style>
