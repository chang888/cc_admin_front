<template>
  <LayoutForm v-if="temObj">
    <el-form v-if="form" :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="推送主题" prop="name">
        <el-input v-model="form.id"></el-input>
        备注：无实质用途，仅作区分使用（字数不超过15个汉字）
      </el-form-item>
      <el-form-item label="推送时间" prop="startTime">
        <el-date-picker
          v-model="form.startTime"
          type="datetime"
        value-format="yyyy-MM-dd hh:mm:ss"
          placeholder="选择开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="发送对象" :required="true">
        <el-select v-model="form.planId" placeholder="请选择发送对象" filterable clearable>
          <el-option v-for="item in group" :key="item.id" :label="item.planName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" @click="validForm" :loading="submiting">保存</el-button>
        <el-button @click="close" v-if="!submiting">取消</el-button>
      </el-form-item> -->
    </el-form>
        编辑模板
    {{templateId}}
    <el-button size="big" type="primary" @click="sendMsg">发送模板消息</el-button>
    <div class="previewBox">
      <div class="previewBoxTitle">消息预览</div>
      <div class="previewcontent">
        <h3 v-text="temObj.title"></h3>
        <div v-html="temObj.content" class="preview pre-line"></div>
      </div>

    </div>
    <el-form v-if="regArr.length > 0" inline width="300">
      <el-form-item v-for="(item, i) in regArr" :key="item.id" :label="item.id">
        <el-input v-model="item.val" @change="changeData(i)"></el-input>
      </el-form-item>
    </el-form>

  </LayoutForm>
</template>

<script>
import { getTemplateList,sendMsg } from '@/api/mpHelper'
export default {
  name: 'TmpMsgList',
  created () {
    this.getTemplateList()

  },
  mounted () {
    // this.onSearch()
  },
  data() {
    return {
      form: {},
      msgcontent: {},
      addDialogShow: true,
      temList: [],
      temObj: null,
      group:[],
      regArr: [],
      rules: {
        name: [
          { required: true, message: "请输入服务商名称", trigger: "change" },
          {
            min: 1,
            message: "长度在 1 到 20 个字符",
            trigger: "change"
          }
        ]
      }

    }
  },
  computed: {
    templateId() {
      return this.$route.params.templateId
    }
  },
  methods: {
    async sendMsg() {
      let obj = {
        openid: "ob1dPv0DSdECDT-0kfI4LLN6lFYI",
        // openid: "ob1dPv7cHpVYkiKU0FF95sPk7ptk",
        template_id: this.templateId,
        data: [],
        // data: {
        //   "first": {
        //     "value":"模板消息发送测试！",
        //     "color":"#173177"
        //   },
        //   "keyword1":{
        //       "value":"你的小宝贝该续费了",
        //       "color":"#173177"
        //   },
        //   "keyword2": {
        //       "value":"2020-05-15 14:58:33",
        //       "color":"#173177"
        //   },
        //   "keyword3": {
        //       "value":"2014年9月22日",
        //       "color":"#173177"
        //   },
        //   "remark":{
        //       "value":"欢迎关注本公众号！",
        //       "color":"#173177"
        //   }
        // },
        url: "http://www.baidu.com"
      }
      let rs = await sendMsg(obj)
      console.log(rs)
      if (rs.code == 0) {
        this.temList = rs.data.list
      }
    },
    changeData(i) {
      this.temObj.content = this.temObj.content.replace(this.regArr[i].id,  this.regArr[i].val ||  this.regArr[i].id)
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
        this.temObj = this.temList.find(item => item.template_id == this.templateId)
        let reg =  /\{\{(.*)\}\}/g
        // let arr = this.temObj.content.split(/\n/)
        // console.log(arr)
        console.log(this.temObj.content.match(reg))
        let arr = this.temObj.content.match(reg)
        arr.forEach(item => {
         this.regArr.push({id: item, val: ""})
        })
        // let rs2 = this.temObj.content.match(wrap)
        // console.log(RegExp.$1)

        // this.temObj.content = this.temObj.content.replace(rs2, "{{temObj.title}}")
        // console.log(reg.exec(this.temObj.content))
        // this.temObj.content.match(reg).forEach()


      }
    }
  },
}
</script>

<style lang="scss" scoped>
.pre-line {
  white-space: pre-line;
  line-height: 30px;
}
.previewBox {
  display: inline-block;
  width: 328px;
  background-color: #f8f8f9;
  border: 1px solid #e7e7eb;
  padding:0 15px 15px;
  border-radius: 4px;
  box-shadow: 0 0 6px rgba(157,157,157,.3);
  .previewBoxTitle {
    text-align: center;
    line-height: 40px;
  }
  .previewcontent {
    h3 {
      font-size: 14px;
      line-height: 28px;
      padding: 0;
      margin: 0;
    }
    padding: 10px;
    background-color: #fff;
    border: 1px solid #e7e7eb;
  }
}
</style>
