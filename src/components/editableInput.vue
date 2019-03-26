<template>
  <group>
    <div class="editTable needsfocus" @click="changeEditable" :class="editable ? 'editable' : 'uneditable'">
      <div class="title" ref="title">
        评价内容
      </div>
      <div class="input" v-if="editable && showArea">
        <x-textarea
          v-model="inputValue"
          ref="text" 
          @on-blur="changeState"
          class="needsfocus needsclick"
          @on-focus="focus"
          @on-change="changeInput"
          @click.native="fakeFocus"
          :show-counter="true"
          :max=200>
        </x-textarea >
      </div>
      <div class="showCtn" v-if="!editable || (!showArea && inputValue.length)">
        {{inputValue || val}}
      </div>
    </div>
  </group>
</template>

<script>
import {Cell,Group,XTextarea } from 'vux'
export default {
  props: {
    editable:{
      type: Boolean,
      default: true
    },
    val: {
      type: String
    }
  },
  data() {
    return {
      inputValue: '',
      showArea: false
    }
  },
  components: {
    Cell,
    Group,
    XTextarea 
  },
  methods: {
    // 更改编辑状态
    changeEditable() {
      if(this.editable) {
        this.showArea = true
        this.$nextTick(() => {
          if (this.$refs.text) {
            this.$refs.text.focus()
            // this.dbClick(this.$refs.text.$el.querySelector('textarea'))
          }
          if (this.$refs.title) {
            this.$refs.title.style['font-size'] = '0.24rem'
            this.$refs.title.style.color = '#888888'
          }
        })
      }
    },
    changeState() {
      if (this.editable) {
        this.showArea = false
        if (this.inputValue === '') {
          this.$nextTick(() => {
            this.$refs.title.style['font-size'] = '0.3rem'
            this.$refs.title.style.color = '#333'
          })
        }
      }
      this.$emit('editchange', this.inputValue)
    },
    changeInput() {
      this.$emit('editchange', this.inputValue)
    },
    focus() {
    },
    fakeFocus() {
      this.$el.querySelector('textarea').focus()
    }
  }
}
</script>

<style lang="less" scoped>
.editTable {
  .title {
    font-size: .3rem;
    padding: .2rem 0;
    transition: font-size .1s ;
  }
  .input{
    /deep/ .weui-cell {
      padding-top: 0!important;
    }
    /deep/ textarea{
      font-size: .28rem;
      font-family: sans-serif;
    }
  }
  .showCtn {
    font-size: .28rem;
    font-family: sans-serif;
    padding: .2rem 0;
    word-break: break-all;
    padding-top: 0;
  }
  &.uneditable {
    .title {
      font-size: .24rem;
      color:#888;
    }
  }
  &.editable {
    .title {
      font-size: .3rem;
      color:#333;
    }
  }
}
</style>

