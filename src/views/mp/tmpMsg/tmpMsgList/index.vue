<template>
  <div>
    <LayoutPage>
    <el-button size="big" type="primary" @click="addDialogShow=true">新建消息</el-button>
    <LayoutTable  ref="msgList" url="/admin/mp/temMsg/getMsgList"  @loaded="loading=false" showPager >
     <el-table-column prop="id" label="id" width="80" align="center">
              <!-- <template slot-scope="scope">{{scope.$index + 1}}</template> -->
        </el-table-column>
        <el-table-column prop="title" label="推送主题" width="150" align="center">
              <!-- <template slot-scope="scope">{{scope.$index + 1}}</template> -->
        </el-table-column>
        <el-table-column prop="send_time" label="推送时间" width="160" align="center">
        </el-table-column>
        <el-table-column prop="send_num" label="推送人数" width="100" align="center">  </el-table-column>
        <el-table-column  label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 0">未开启</el-tag>
            <el-tag v-if="scope.row.status == 1" type="success">已发送</el-tag>
            <el-tag v-if="scope.row.status == 2" type="info">发送中</el-tag>
            <el-tag v-if="scope.row.status == 3" type="warning">已暂停</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="300">
          <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="gotoEdit(scope.row)">预览</el-button>
              <el-button size="mini" type="success" @click="gotoEdit(scope.row)">发送</el-button>
              <el-button size="mini" type="warning" @click="gotoEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        </LayoutTable>
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
                    <el-button size="mini" type="primary" @click="newMsg({template_id: scope.row.template_id})">选择</el-button>
                </template>
              </el-table-column>
        </LayoutTable>
    </LayoutDialog>
  </div>
</template>

<script>
import { getTemplateList, getMsgList, delMsg } from '@/api/mpHelper'
export default {
  name: 'TmpMsgList',
  created () {
    // this.getTemplateList()
    // this.getMsgList()
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
    async del(row) {
      let rs = await delMsg(row.id)
      if (rs.code == 0) {
        this.onSearch()
      }
    },
    async getMsgList() {
      let rs = await getMsgList()
      console.log(rs)
      if (rs.code == 0) {
        this.temList = rs.data.list
      }
    },
    gotoEdit({template_id, id}) {
      this.$router.push(`tmpMsgEdit?template_id=${template_id}&id=${id}`)
    },
    newMsg({template_id}){
      this.$router.push(`tmpMsgEdit?template_id=${template_id}`)

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
