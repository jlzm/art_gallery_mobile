<template>
  <group>
    <div class="editTable needsfocus editable">
      <!-- <div class="editTable needsfocus uneditable" @click="changeEditable" :class="editable ? 'editable' : 'uneditable'"> -->
      <div class="title" ref="title">{{inputTitle}}</div>
      <div class="showCtn" v-if="!editable">{{val || ''}}</div>

      <div v-else class="input">
        <x-textarea
          v-model="inputValue"
          ref="text"
          placeholder="说点什么吧!"
          @on-blur="changeState"
          class="needsfocus needsclick"
          @on-focus="focus"
          @on-change="changeInput"
          @click.native="fakeFocus"
          :show-counter="true"
          :max="200"
        ></x-textarea>
      </div>
    </div>
  </group>
</template>

<script>
import { Cell, Group, XTextarea } from "vux";
export default {
  props: {
    editable: {
      type: Boolean,
      default: true
    },
    val: {
      type: String
    },
    disabledInput: {
      type: Boolean,
      default: false
    },
    inputTitle: {
      type: String,
      default: '评价内容'
    }
  },
  data() {
    return {
      inputValue: "",
      showArea: false
    };
  },
  components: {
    Cell,
    Group,
    XTextarea
  },
  methods: {
    // 更改编辑状态
    changeEditable() {
      if (this.editable) {
        this.showArea = true;
        this.$nextTick(() => {
          if (this.$refs.text) {
            this.$refs.text.focus();
            // this.dbClick(this.$refs.text.$el.querySelector('textarea'))
          }
          if (this.$refs.title) {
            this.$refs.title.style["font-size"] = "0.24rem";
            this.$refs.title.style.color = "#888888";
          }
        });
      }
    },
    changeState() {
      if (this.editable) {
        this.showArea = false;
        if (this.inputValue === "") {
          this.$nextTick(() => {
            this.$refs.title.style["font-size"] = "0.3rem";
            this.$refs.title.style.color = "#333";
          });
        }
      }
      this.$emit("editchange", this.inputValue);
    },
    changeInput() {
      this.$emit("editchange", this.inputValue);
    },
    focus() {},
    fakeFocus() {
      this.$el.querySelector("textarea").focus();
    }
  }
};
</script>

<style lang="less" scoped>
.editTable {
  .title {
    font-size: 0.3rem;
    padding: 0.2rem 0;
    transition: font-size 0.1s;
  }
  .input {
    /deep/ .weui-cell {
      padding-top: 0 !important;
    }
    /deep/ textarea {
      font-size: 0.28rem;
      font-family: sans-serif;
    }
  }
  .showCtn {
    font-size: 0.28rem;
    font-family: sans-serif;
    padding: 0.2rem 0;
    word-break: break-all;
    padding-top: 0;
  }
  &.uneditable {
    .title {
      font-size: 0.24rem;
      color: #888;
    }
  }
  &.editable {
    .title {
      font-size: 0.3rem;
      color: #333;
    }
  }
}
</style>

