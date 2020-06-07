<template>
  <div v-if="temObj">
    <LayoutForm >
      <el-form v-if="form" style="margin-bottom:30px;" :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="推送主题" prop="title">
          <el-input v-model="form.title"></el-input>
          备注：无实质用途，仅作区分使用（字数不超过15个汉字）
        </el-form-item>
        <el-form-item label="推送时间"  prop="send_time">
          <el-date-picker
            v-model="form.send_time"
            type="datetime"
          value-format="yyyy-MM-dd hh:mm:ss"
            placeholder="选择开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发送对象" prop="send_object">
          <el-select v-model="form.send_object" placeholder="请选择发送对象" filterable clearable>
            <el-option v-for="item in group" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="validForm" :loading="submiting">保存</el-button>
          <el-button @click="close" v-if="!submiting">取消</el-button>
        </el-form-item> -->
      </el-form>
      <div class="render">

        <el-form class="rightbox" style="width:40%" v-if="records.length > 0" width="300px" size="small" label-position="top">
          <el-form-item style="width: 100%" v-for="(item) in records" :key="item.key" :label="item.key">
            <template #label>
            <div class="inputlabel"><span class="labeltxt">{{item.key}}  颜色设置</span><el-color-picker v-model="item.color"></el-color-picker></div>
            </template>
            <el-input v-model="item.value" type="textarea" :placeholder="'{{'+ item.key + '}}'"></el-input>
            <br>
          </el-form-item>
        </el-form>
        <div class="previewBox">
          <div class="previewBoxTitle">消息预览</div>
          <div class="previewcontent">
            <h3 v-text="temObj.title"></h3>
            <!-- <div v-html="temObj.content1" class="preview pre-line"></div> -->
            <div v-for="(item) in content2" :key="item" class="preview pre-line"><span v-html="item"></span></div>
            <!-- <div v-for="item in temObj.records" :key="item.key" class="preview pre-line" :style="{color: item.color}">{{item.prefix}} {{item.value || item.key}}</div> -->
          </div>

        </div>
      <el-button size="big" type="primary" @click="submitForm">保存模板消息</el-button>

      </div>

    </LayoutForm>
    <div>

    </div>
  </div>

</template>

<script>
import { getTemplateList, saveOrEditMsg } from '@/api/mpHelper'
export default {
  name: 'TmpMsgList',
  created () {
    this.getTemplateList()
  },
  data() {
    return {
      form: {},
      msgcontent: {},
      addDialogShow: true,
      temList: [],
      temObj: null,
      group:[{id: "all", name: "全部粉丝"}],
      records: [],
      content:[],
      content2: [],
      temp: null,
      rules: {
        title: [
          { required: true, message: "请输入推送主题", trigger: "blur" },
          {
            min: 1,
            message: "长度在 1 到 15 个字符",
            trigger: "change"
          }
        ],
        send_time: [
          { required: true, message: "请选择推送时间", trigger: "blur" },
        ],
        send_object: [
          { required: true, message: "请选择推送对象", trigger: "blur" },
        ]
      }

    }
  },
  mounted () {

  },
  watch: {
    records: {
      handler (newValue, oldValue) {
        this.renderPreview()
      },
      deep: true
    }
  },
  computed: {
    templateId() {
      return this.$route.params.templateId
    },
//     records() {
// 　　　　return this.temObj.records
// 　　}
  },
  methods: {
    renderPreview() {
      this.content.map((item, i) => {
        let rs = this.records.filter(e => e.index == i)
        if (rs.length > 0) {
          rs.forEach(e => {
            item = item.replace(e.text, `<span style="color: ${e.color}">${e.value|| e.text}</span>`)
            this.$set(this.content2, i, item)
          })
        }
      })
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.saveOrEditMsg()
        } else {
          return false;
        }
      });
    },
    async saveOrEditMsg() {
      let send_data = {}
      this.records.forEach((item, index) => {
         send_data[item.key.replace(".DATA", "")] = {value : item.value || item.text, color: item.color }
      })
      console.log(send_data)

      let obj = {
        openid: "ob1dPv0DSdECDT-0kfI4LLN6lFYI",
        // openid: "ob1dPv7cHpVYkiKU0FF95sPk7ptk",
        template_id: this.templateId,
        send_data,
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
        url: "https://www.baidu.com"
      }
      // this.form.asgin({},obj)

      let rs = await saveOrEditMsg(Object.assign(this.form,obj))
      console.log(rs)
      // if (rs.code == 0) {
      //   this.temList = rs.data.list
      // }
    },
    onSearch() {
      this.loading = true
      console.log(this.$refs)
      this.$refs.myTable.search()
    },
    async getTemplateList() {
      let rs = await getTemplateList()
      if (rs.code == 0) {
        this.temList = rs.data.list
        this.temObj = this.temList.find(item => item.template_id == this.templateId)
        this.content = this.temObj.content.split('\n')
        let regex = /\{\{(.+?)\}\}/g;
        let result;
        this.content.map((item, i) => {
          while ((result = regex.exec(item)) != null) {
            let index = i
            this.records.push({key: result[1],text: result[0], value: "", color: null ,index})
          }
          this.renderPreview()

        })
      }
    }
  },
}
</script>

<style lang="scss" scoped>
/deep/ .el-form-item__label {
  padding-bottom: 0px;
}
.inputlabel {
  line-height: 30px;
  display: flex;
  .labeltxt {
    display: inline-block;
  }
}
.render {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.pre-line {
  white-space: pre-line;
  line-height: 30px;
}
.previewBox {
  display: inline-block;
  width: 350px;
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
    .preview {
     font-size: 14px;
     line-height: 30px;
    }
  }
}
</style>
