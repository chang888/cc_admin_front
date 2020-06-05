<template>
  <div>
    <LayoutPage>
      <el-button size="big" type="primary" @click="addDialogShow=true">新建消息</el-button>

    </LayoutPage>
    <LayoutDialog v-model="addDialogShow" title="选择模板" :closeOnClickModal="false">
        <el-button size="big" type="primary" @click="onSearch">同步模板</el-button>
        <LayoutTable  ref="myTable" url="/admin/mp/temMsg/getTemplateList"  @loaded="loading=false" >
          <el-table-column prop="title" label="序号" width="50" align="center">
                <template slot-scope="scope">{{scope.$index + 1}}</template>
          </el-table-column>
          <el-table-column prop="title" label="标题" width="160" align="center">
          </el-table-column>
            <el-table-column prop="title" label="例子" width="200" align="center">
            <template slot-scope="scope">
              <div class="pre-line" v-html="scope.row.example"></div>
            </template>
          </el-table-column>
              <el-table-column
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="gotoEdit(scope.row.template_id)">选择</el-button>
                </template>
              </el-table-column>
        </LayoutTable>
    </LayoutDialog>
  </div>
</template>

<script>
import { getTemplateList } from '@/api/mpHelper'
export default {
  name: 'TmpMsgList',
  created () {
    // this.getTemplateList()
  },
  mounted () {
    // this.onSearch()
  },
  data() {
    return {
      addDialogShow: false,
      temList: [],
    }
  },
  methods: {
    gotoEdit(id) {
      this.$router.push(`tmpMsgEdit/${id}`)
    },
    onSearch() {
      this.loading = true
      console.log(this.$refs)
      this.$refs.myTable.search()
    },
    async getTemplateList() {
      let rs = await getTemplateList()
      console.log(rs)
      if (rs.code == 0) {
        this.temList = rs.data.list
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.pre-line {
   white-space: pre-line;
   text-align: left;
}
</style>
