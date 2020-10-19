<template>
  <div v-if="temObj">
    <LayoutForm>
      <el-form v-if="form" style="margin-bottom:30px;" :model="form" :rules="rules" ref="form" label-width="150px">
        <el-form-item label="推送主题" prop="title">
          <el-input v-model="form.title"></el-input>
          <p>备注：无实质用途，仅作区分使用（字数不超过15个汉字）</p>
        </el-form-item>
        <el-form-item label="推送时间" prop="send_time">
          <el-date-picker v-model="form.send_time" type="datetime" value-format="yyyy-MM-dd hh:mm:ss" placeholder="选择开始日期"> </el-date-picker>
        </el-form-item>
        <el-form-item label="发送对象" prop="send_object">
          <el-select v-model="form.send_object" placeholder="请选择发送对象" filterable clearable>
            <el-option v-for="item in group" :label="item.name" :key="item.id" :value="String(item.id)">{{item.name}} <span style="color:#43ad7f7f;padding-left:10px">{{item.id != -1 ? '(人数' + item.count +') ': ""}}</span></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="链接跳转" prop="url">
          <el-input v-model="form.url" placeholder="可为空 不跳转"></el-input>
          <p>备注：可为空 即不可跳转,小程序跳转和URL同时存在 小程序优先</p>
          <p>当用户的微信客户端版本不支持跳小程序时，将会跳转至url。</p>
        </el-form-item>
        <el-form-item label="小程序跳转appid" prop="appid">
          <el-input v-model="form.appid" placeholder="可为空 不跳转"></el-input>
          <p>备注：所需跳转到的小程序appid（该小程序appid必须与发模板消息的公众号是绑定关联关系，暂不支持小游戏,不需要则不填</p>
        </el-form-item>
        <el-form-item label="小程序跳转路径" prop="pagepath">
          <el-input v-model="form.pagepath" placeholder="可为空 不跳转"></el-input>
          <p>备注：所需跳转到小程序的具体页面路径，支持带参数,（示例index?foo=bar），要求该小程序已发布，暂不支持小游戏,不需要则不填</p>
        </el-form-item>

        <!-- "miniprogram":{
             "appid":"xiaochengxuappid12345",
             "pagepath":"index?foo=bar"
           },     -->

        <!-- <el-form-item>
          <el-button type="primary" @click="validForm" :loading="submiting">保存</el-button>
          <el-button @click="close" v-if="!submiting">取消</el-button>
        </el-form-item> -->
      </el-form>
      <div class="render">
        <el-form class="rightbox" style="width:40%" v-if="records.length > 0" width="300px" size="small" label-position="top">
          <el-form-item style="width: 100%" v-for="item in records" :key="item.key" :label="item.key">
            <template #label>
              <div class="inputlabel">
                <span class="labeltxt">{{ item.key }} 颜色设置</span><el-color-picker v-model="item.color"></el-color-picker>
              </div>
            </template>
            <el-input v-model="item.value" type="textarea" :placeholder="'{{' + item.key + '}}'"></el-input>
            <br />
          </el-form-item>
        </el-form>
        <div class="previewBox">
          <div class="previewBoxTitle">消息预览</div>
          <div class="previewcontent">
            <h3 v-text="temObj.title"></h3>
            <!-- <div v-html="temObj.content1" class="preview pre-line"></div> -->
            <div v-for="item in content2" :key="item" class="preview pre-line"><span v-html="item"></span></div>
            <!-- <div v-for="item in temObj.records" :key="item.key" class="preview pre-line" :style="{color: item.color}">{{item.prefix}} {{item.value || item.key}}</div> -->
          </div>
        </div>
      </div>

    </LayoutForm>
      <div style="text-align:center;margin-bottom:30px">
        <el-button size="small" type="primary" @click="submitForm">保存模板消息</el-button>
    </div>
  </div>
</template>

<script>
import { getTemplateList, saveOrEditMsg, getOne, getTagsList } from "@/api/mpHelper"
export default {
  name: "TmpMsgEdit",
  async created() {
    await this.getTemplateList()
    await this.getTagsList()
    if (this.id) {
      console.log("有id")
      this.getMsgById(this.id)
    }
  },
  data() {
    return {
      form: {
        send_time: "",
        send_object: "",
        title: "",
        url: "",
        appid: "",
        pagepath: "",
      },
      msgcontent: {},
      addDialogShow: true,
      temList: [],
      temObj: null,
      group: [],
      records: [],
      content: [],
      content2: [],
      temp: null,
      rules: {
        title: [
          { required: true, message: "请输入推送主题", trigger: "blur" },
          {
            min: 1,
            message: "长度在 1 到 15 个字符",
            trigger: "change",
          },
        ],
        send_time: [{ required: true, message: "请选择推送时间", trigger: "blur" }],
        send_object: [{ required: true, message: "请选择推送对象", trigger: "blur" }],
      },
    }
  },
  mounted() {},
  watch: {
    records: {
      handler(newValue, oldValue) {
        this.renderPreview()
      },
      deep: true,
    },
  },
  computed: {
    template_id() {
      return this.$route.query.template_id
    },
    id() {
      return this.$route.query.id
    },
    "form.miniprogram"() {
      return {
        appid: this.form.appid,
        pagepath: this.form.pagepath,
      }
    },
  },
  methods: {
    async getMsgById(id) {
      let rs = await getOne(Number(id))
      console.log(rs)
      if (rs.code == 0) {
        const { send_data, send_time, send_object, title, url, miniprogram } = rs.data
        this.form.send_time = send_time
        this.form.send_object = send_object
        this.form.title = title
        this.form.url = url
        this.form.miniprogram = JSON.parse(miniprogram) || {}
        this.form.appid =  this.form.miniprogram.appid
        this.form.pagepath =  this.form.miniprogram.pagepath
        // 设置已保存的值
        Object.values(JSON.parse(send_data)).forEach((item, i) => {
          this.$set(this.records[i], "value", item.value)
          this.$set(this.records[i], "color", item.color)
        })
      } else {
      }
    },
    renderPreview() {
      this.content.map((item, i) => {
        let rs = this.records.filter((e) => e.index == i)
        if (rs.length > 0) {
          rs.forEach((e) => {
            item = item.replace(e.text, `<span style="color: ${e.color}">${e.value || e.text}</span>`)
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
          return false
        }
      })
    },
    async saveOrEditMsg() {
      let send_data = {}
      this.records.forEach((item, index) => {
        send_data[item.key.replace(".DATA", "")] = { value: item.value || item.text, color: item.color }
      })
      let obj = {
        openid: "ob1dPv0DSdECDT-0kfI4LLN6lFYI",
        // openid: "ob1dPv7cHpVYkiKU0FF95sPk7ptk",
        template_id: this.template_id,
        id: +this.id,
        send_data,
        miniprogram: {
          appid: this.form.appid,
          pagepath: this.form.pagepath,
        }
      }
      let rs = await saveOrEditMsg(Object.assign(this.form, obj))
      console.log(rs)
      if (rs.code == 0) {
        this.$message("保存成功")
        this.$router.go(-1)
      } else {
        this.$message({
          message: rs.msg,
          type: "success",
        })
      }
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
        this.temObj = this.temList.find((item) => item.template_id == this.template_id)
        this.content = this.temObj.content.split("\n")
        let regex = /\{\{(.+?)\}\}/g
        let result
        this.content.map((item, i) => {
          while ((result = regex.exec(item)) != null) {
            let index = i
            this.records.push({ key: result[1], text: result[0], value: "", color: null, index })
          }
          this.renderPreview()
        })
      }
    },
    async getTagsList() {
      let rs = await getTagsList()
      console.log()

       if (rs.code == 0) {
         this.group = rs.data.list
       }
    }
  },
}
</script>

<style lang="scss" scoped>
/deep/ .el-form-item__label {
  padding-bottom: 0px;
}
/deep/ .el-form-item {
  margin-bottom: 10px;
}
/deep/ .el-form-item__content p {
  font-size: 12px;
  margin: 0;
  line-height: 24px;
}
/deep/ .grid-page {
  position: relative;
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
  padding: 0 15px 15px;
  border-radius: 4px;
  box-shadow: 0 0 6px rgba(157, 157, 157, 0.3);
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
