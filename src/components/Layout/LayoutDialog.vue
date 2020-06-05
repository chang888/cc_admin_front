<template>
    <el-dialog :title="title" :visible.sync="showDialog" :width="width" :closeOnClickModal="closeOnClickModal">
        <slot v-if="showSlot"></slot>
    </el-dialog>
</template>

<script>
export default {
  name: "LayoutDialog",
  props: {
    title: {
      require: true,
      type: String
    },
    value: {
      require: true,
      type: Boolean
    },
    width: {
      require: false,
      type: String
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      showDialog: this.value,
      showSlot: this.value
    }
  },
  watch: {
    value (val, oldVal) {
      this.showDialog = val
    },
    showDialog (val, oldVal) {
      if (val) {
        this.showSlot = val
      } else {
        setTimeout(() => {
          this.showSlot = val
        }, 500)
      }
      this.$emit("input", val)
    }
  }
}
</script>
