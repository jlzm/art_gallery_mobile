// 用于混入router所带type验证，parent或者teacher
let mixin = {
  data() {
    return {
      type: ''
    }
  },
  watch: {
    $route: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val.meta && val.meta.type) {
          this.type = val.meta.type
        }
      }
    }
  }
}
export default mixin