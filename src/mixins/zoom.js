
import zoom from 'zoomerang'
/** 用于放大缩放图 */
const mixin = {
  mounted() {
    const innerHeight = window.innerHeight
    const innerWidth = window.innerWidth
    this.$nextTick(() => {
      zoom.listen('.img-zoom')
      zoom.config({
        onClose (el) {
          el.style.transform = ''
        },
        bgColor: 'rgba(0,0,0,0)',
        maxWidth: innerWidth,
        maxHeight:  innerHeight
      })
    })
  },
}
export  default mixin