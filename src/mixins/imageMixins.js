const mixin = {
  data() {
    return {
      fileList: [],
      viewImgList: [],
      options: {
        getThumbBoundsFn(index) {
          // find thumbnail element
          let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
            // get window scroll Y
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
            // optionally get horizontal scroll
            // get position of element relative to viewport
          let rect = thumbnail.getBoundingClientRect()
            // w = width
          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }
          // Good guide on how to get element coordinates:
          // http://javascript.info/tutorial/coordinates
        },
        fullscreenEl: false,
        closeEl: false,
        isClickableElement(el) {
          return /previewer-delete/.test(el.className)
        }
      }
    }
  },
  methods: {
    editchange(val) {
      console.log(val)
    },
    /** images */
    logIndexChange(arg) {},
    show(index) {
      this.$refs.previewer.show(index)
    },
    deleteImg(index) {
      this.fileList.splice(index, 1)
    },
    removeImg(a) {
      let index = this.$refs.previewer.getCurrentIndex()
      this.deleteImg(index)
    },
    /** input image */
    updateImg(e) {
      var file = e.target.files
      let regx = /(\.){1}([a-z]*)$/
      let arr = ['png', 'jpg', 'gif', 'bmp', 'jpeg']
      var _this = this
      if (this.fileList.length + file.length > 9) {
        this.$vux.toast.show({
          text: '<div style="padding:10px;">请上传少于9张图片</div>',
          type: 'text',
          width: 'auto'
        })
        return
      }
      if (file.length) {

      }
      for (let i = 0; i < file.length; i++) {
        let reader = new FileReader()
        let length = this.fileList.length || 0
        if (file[i] && file[i].name) {
          let name = file[i].name.match(regx)[2]
          if (name && !~arr.indexOf(name)) {
            this.$vux.toast.show({
              text: '<div style="padding:10px;">请上传图片格式的照片</div>',
              type: 'text',
              width: 'auto'
            })
          } else {
            reader.readAsDataURL(file[i])
            reader.onload = (e) => {
              var target = e.target || e.currentTarget
              file[i].src = target.result
              this.fileList.push(file[i])
                // this.fileList[i + length].src = target.result
              this.viewImgList.push({
                src: file[i].src
              })
              _this.$forceUpdate()
            }

          }
        }
      }
    }
  }
}
export default mixin