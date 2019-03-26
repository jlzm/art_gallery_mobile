const mixin = {
  mounted () {
    if (!document.addEventListener) return
    window.onresize = this.recalc
    document.addEventListener('DOMContentLoaded', this.recalc, true)
  },
  methods: {
    getBrowserInterfaceSize () {
      var pageWidth = window.innerWidth
      var pageHeight = window.innerHeight

      if (typeof pageWidth !== 'number') {
        // 在标准模式下面
        if (document.compatMode === 'CSS1Compat') {
          pageWidth = document.documentElement.clientWidth
          pageHeight = document.documentElement.clientHeight
        } else {
          pageWidth = document.body.clientWidth
          pageHeight = window.body.clientHeight
        }
      }
      return {
        pageWidth: pageWidth,
        pageHeight: pageHeight
      }
    },
    recalc () {
      let doc = document
      let win = window
      var docEl = doc.documentElement
      var calHeight = this.getBrowserInterfaceSize() ? this.getBrowserInterfaceSize().pageHeight : win.screen.availHeight
      var calWidth = this.getBrowserInterfaceSize() ? this.getBrowserInterfaceSize().pageWidth : win.screen.availWidth
      var clientWidth = this.getBrowserInterfaceSize() ? this.getBrowserInterfaceSize().pageWidth : docEl.clientWidth
      if (!clientWidth) return
      docEl.style.fontSize = 100 * (clientWidth / 750) + 'px'
      /* docEl.style.fontSize = 20 * (clientWidth / 320) + 'px'; */
      docEl.style.width = doc.body.style.calWidth = calWidth + 'px'
      docEl.style.height = doc.body.style.height = calHeight + 'px'
    }
  }
}
export  {mixin}