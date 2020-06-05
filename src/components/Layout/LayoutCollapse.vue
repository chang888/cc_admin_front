<template>
  <el-collapse v-model="collapseArr">
    <el-collapse-item name="more">
      <template slot="title">
        <div class="collapse-title" v-if="collapseArr.indexOf('more') < 0">
          <i class="el-icon-caret-bottom"></i>
          显示更多筛选
        </div>
        <div class="collapse-title" v-else>
          <i class="el-icon-caret-top"></i>
          隐藏更多筛选
        </div>
      </template>
      <slot></slot>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  name: "LayoutCollapse",
  data() {
    return {
      collapseArr: []
    }
  }
}
</script>

<style scoped>
  .collapse-title{
    text-align: center;
    color: #cccccc;
    width: 100%;
  }

  .collapse-title:hover{
    color: #409EFF
  }
</style>
