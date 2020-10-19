<template>
  <div>
    <LayoutPage>
      <LayoutSearch>
        <el-form-item>
          <el-button @click="addDialogShow = true" type="success" plain>新建消息</el-button>
        </el-form-item>
      </LayoutSearch>
      <LayoutTable ref="msgList" url="/admin/mp/temMsg/getMsgList" showPager>
        <el-table-column prop="id" label="id" width="60" align="center">
          <!-- <template slot-scope="scope">{{scope.$index + 1}}</template> -->
        </el-table-column>
        <el-table-column prop="title" label="推送主题" width="150" align="center">
          <!-- <template slot-scope="scope">{{scope.$index + 1}}</template> -->
        </el-table-column>
        <el-table-column prop="send_time" label="推送时间" width="160" align="center"> </el-table-column>
        <el-table-column prop="send_num" label="推送人数" width="80" align="center"> </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 0">未开启</el-tag>
            <el-tag v-if="scope.row.status == 1" type="success">已发送</el-tag>
            <el-tag v-if="scope.row.status == 2" type="info">发送中</el-tag>
            <el-tag v-if="scope.row.status == 3" type="warning">已暂停</el-tag>
            <el-tag v-if="scope.row.status == 4" type="warning">待发送</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="160" align="center" />
        <el-table-column prop="updated_at" label="更新时间" width="160" align="center" />
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="gotoEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="primary" @click="preview(scope.row)">预览</el-button>
            <el-button size="mini" type="success" v-if="scope.row.status == 0" @click="send(scope.row)">发送</el-button>
            <el-button size="mini" type="danger" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </LayoutTable>
    </LayoutPage>
    <LayoutDialog v-model="addDialogShow" title="选择模板" :closeOnClickModal="false">
      <el-button size="big" type="primary" @click="onSearch">同步模板</el-button>
      <LayoutTable ref="myTable" url="/admin/mp/temMsg/getTemplateList" @loaded="loading = false">
        <el-table-column prop="title" label="序号" width="50" align="center">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="160" align="center"> </el-table-column>
        <el-table-column prop="title" label="例子" width="200" align="center">
          <template slot-scope="scope">
            <div class="pre-line" v-html="scope.row.example"></div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="newMsg({ template_id: scope.row.template_id })">选择</el-button>
          </template>
        </el-table-column>
      </LayoutTable>
    </LayoutDialog>
    <LayoutDialog v-model="priviewShow" title="模板消息预览" :closeOnClickModal="false">
      <div class="previewbox">
        <img class="qrcode" :src="'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + ticket" alt="" />
        <p>每次生成的二维码有效期10分钟</p>
      </div>
    </LayoutDialog>
  </div>
</template>

<script>
import { getTemplateList, getMsgList, delMsg, previewMsg, sendMsg } from "@/api/mpHelper"
export default {
  name: "TmpMsgList",
  created() {
    // this.getTemplateList()
    // this.getMsgList()
  },
  mounted() {
    // this.onSearch()
  },
  data() {
    return {
      addDialogShow: false,
      priviewShow: false,
      temList: [],
      ticket: "",
    }
  },
  methods: {
    async del({ id }) {
      let rs = await delMsg(id)
      if (rs.code == 0) {
        this.onSearch()
        this.$message({
          message: rs.msg,
          type: "success",
        })
      } else {
        this.$message({
          message: rs.msg,
          type: "fail",
        })
      }
    },
    async getMsgList() {
      let rs = await getMsgList()
      console.log(rs)
      if (rs.code == 0) {
        this.temList = rs.data.list
      }
    },
    async preview({ id }) {
      let rs = await previewMsg(id)
      if (rs.code == 0) {
        this.ticket = rs.data.ticket
      } else {
        this.$message({
          message: rs.msg,
          type: "fail",
        })
      }
      this.priviewShow = true
    },
    gotoEdit({ template_id, id }) {
      this.$router.push(`tmpMsgEdit?template_id=${template_id}&id=${id}`)
    },
    send({ id }) {
      this.$confirm("此操作将开启发送状态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let rs = await sendMsg(id)
          if (rs.code == 0) {
            this.$message({
              type: "success",
              message: "已经提交!",
            })
            this.onSearch()
          } else {
            this.$message({
              type: "error",
              message: rs.msg,
            })
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消操作",
          })
        })
    },
    newMsg({ template_id }) {
      this.$router.push(`tmpMsgEdit?template_id=${template_id}`)
    },
    onSearch() {
      this.$refs.msgList.search()
    },
    async getTemplateList() {
      let rs = await getTemplateList()
      if (rs.code == 0) {
        this.temList = rs.data.list
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.pre-line {
  white-space: pre-line;
  text-align: left;
}
.previewbox {
  text-align: center;
  .qrcode {
    width: 240px;
    height: 240px;
  }
}
</style>
