<template>
  <div>
    <el-form
      size="small"
      ref="form"
      :model="form"
      :rules="rules"
      label-width="160px"
      :disabled="$route.query.isView == 'true'"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>设定Push Notification呈现信息</span>
        </div>
        <el-form-item label="Push Notification Title" prop="notificationTitle">
          <div class="form-item">
            <el-input
              type="text"
              placeholder="请输入内容"
              v-model="form.notificationTitle"
            >
            </el-input>
            <span class="tip">*建议控制在18个汉字以内</span>
          </div>
        </el-form-item>
        <el-form-item
          label="Push Notification Detail Message"
          prop="notificationDetail"
          class="form-item"
        >
          <div class="form-item">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="form.notificationDetail"
            >
            </el-input>
            <span class="tip">*建议控制在40个汉字以内</span>
          </div>
        </el-form-item>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>设定inner APP Message呈现信息</span>
        </div>
        <el-form-item label="Message Title" prop="innerAppTitle">
          <div class="form-item">
            <el-input
              type="text"
              placeholder="请输入内容"
              v-model="form.innerAppTitle"
            >
            </el-input>
            <span class="tip">*建议控制在18个汉字以内</span>
          </div>
        </el-form-item>
        <el-form-item label="消息中心类目" prop="messageType">
          <el-cascader
            v-model="form.messageType"
            :options="messageTypes"
            clearable
            :props="{
              value: 'id',
              label: 'name',
              children: 'innerTypes',
              expandTrigger: 'hover',
              checkStrictly: false
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="跳转链接">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="form.redirectUri"
          >
          </el-input>
        </el-form-item>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>导名单</span>
        </div>
        <el-form-item label="" prop="rosterUri">
          <el-row>
            <el-col :span="24">
              <el-upload
                class="upload-demo"
                ref="upload"
                action=""
                :autoUpload="false"
                :on-change="uploadExcel"
                :show-file-list="false"
                :multiple="false"
                accept=".xlsx"
              >
                <el-button slot="trigger" size="small" type="primary"
                  >Upload</el-button
                >
                <el-button
                  size="small"
                  style="margin-left:20px;"
                  type="text"
                  @click="openDownload('')"
                  >下载模板</el-button
                >
                <div slot="tip" class="el-upload__tip">
                  只能上传 .xlsx文件，且不超过2M
                </div>
                <div
                  v-for="item in excelList"
                  :key="item.url"
                  class="file-list"
                >
                  <div class="whispace file-name">{{ item.url }}</div>
                  <el-button
                    type="text"
                    class="downloadBtn"
                    @click="openDownload(item.url)"
                    >下载查看</el-button
                  >
                  <el-button
                    type="text"
                    v-if="form.batchStatus === '待发送' || !$route.query.id"
                    @click="delExcel"
                    >删除</el-button
                  >
                </div>
              </el-upload>
            </el-col>
          </el-row>
        </el-form-item>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>设定推送时间</span>
        </div>
        <el-form-item label="预设开始时间" prop="expectPushDate">
          <el-date-picker
            v-model="form.expectPushDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
            :picker-options="options"
          >
          </el-date-picker>
        </el-form-item>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>备注</span>
        </div>
        <el-form-item label="OA编号">
          <el-input type="text" placeholder="请输入内容" v-model="form.oaCode">
          </el-input>
        </el-form-item>
      </el-card>
      <el-form-item label=""> </el-form-item>
    </el-form>
    <div class="text-left">
      <el-button @click="cancel" size="small">取消</el-button>
      <el-button
        v-if="
          (form.batchStatus === '待发送' || !$route.query.id) &&
            !$route.query.isView
        "
        type="primary"
        size="small"
        @click="submit('form')"
        >发布</el-button
      >
    </div>
  </div>
</template>
<script>
import upload from '@/mixins/upload.js'
import {
  getMessageType,
  getMessageDetail,
  addMessage,
  updateMessage
} from '@/api/xxxxxxx/xxxxxxxMessagePush.js'
import { deepCopy } from '@/utility'
export default {
  mixins: [upload],
  data() {
    return {
      options: {
        disabledDate: date => {
          return date < new Date().getTime() - 1 * 24 * 60 * 60 * 1000
        }
      },
      ruleType: 1,
      form: {
        notificationTitle: '',
        notificationDetail: '',
        innerAppTitle: '',
        messageType: '',
        redirectUri: '',
        rosterUri: null,
        expectPushDate: '',
        oaCode: ''
      },
      messageTypes: [],
      rules: {
        notificationTitle: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        notificationDetail: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        messageType: [{ required: true, message: '必填项', trigger: 'blur' }],
        innerAppTitle: [{ required: true, message: '必填项', trigger: 'blur' }],
        expectPushDate: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        rosterUri: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      publishDate: [],
      excelList: [] //白名单上传excel列表
    }
  },
  created() {
    this.getMessageType()
    if (this.$route.query.id) {
      getMessageDetail(this.$route.query.id).then(res => {
        console.log(res)
        if (res.rosterUri) {
          this.excelList.push({
            url: res.rosterUri,
            name: res.rosterUri
          })
        } else {
          this.excelList = []
        }
        this.form = res
        // 已经发送完成的消息 只能通过查看进入详情页 设置名单可下载
        this.$nextTick(() => {
          let downloadBtn = document.querySelectorAll('.downloadBtn')
          let length = downloadBtn.length
          for (let i = 0; i < length; i++) {
            downloadBtn[i].removeAttribute('disabled')
            downloadBtn[i].classList.remove('is-disabled')
          }
        })
      })
    }
  },
  mounted() {},
  methods: {
    getMessageType() {
      getMessageType().then(res => {
        this.messageTypes = this.formatMessageTypes(res.types)
      })
    },
    formatMessageTypes(types) {
      if (!Array.isArray(types)) return
      types.forEach(type => {
        if (type.innerTypes && type.innerTypes.length) {
          this.formatMessageTypes(type.innerTypes)
        } else {
          type.innerTypes = null
        }
      })
      return types
    },
    openDownload(url) {
      console.log(url)
      let downloadUrl = url
        ? url
        : 'https://dev-community-s3.xxxxxxx.com.cn/QA/MyBizxxxxxxx_Content_Cms/LibraryResource/20210406111842_604.xlsx'
      window.open(downloadUrl, '_blank')
    },
    uploadExcel(file, fileList) {
      // debugger
      this.customUploadObjectKey(
        {
          file: file,
          fileList: fileList,
          fileUrl: 'rosterUri',
          fileArray: 'excelList',
          objectKey: 'xxxxxxxMessagePush'
        },
        url => {
          console.log(url)
          this.excelList = [
            {
              name: url,
              url: url
            }
          ]
        }
      )
    },
    delExcel() {
      this.form.rosterUri = null
      this.excelList = []
    },
    submit(form) {
      console.log(this.form)
      this.$refs[form].validate(async valid => {
        if (valid) {
          let messageType = deepCopy(this.form.messageType)
          if (Array.isArray(this.form.messageType)) {
            messageType = messageType.pop()
          }
          let data = {
            notificationTitle: this.form.notificationTitle,
            notificationDetail: this.form.notificationDetail,
            innerAppTitle: this.form.innerAppTitle,
            messageType: messageType,
            redirectUri: this.form.redirectUri,
            rosterUri: this.form.rosterUri,
            expectPushDate: this.form.expectPushDate,
            oaCode: this.form.oaCode
          }
          console.log(data)
          if (this.$route.query.id) {
            updateMessage(this.$route.query.id, data).then(res => {
              console.log(res)
              this.$router.back()
            })
          } else {
            addMessage(data).then(res => {
              console.log(res)
              this.$router.back()
            })
          }
        } else {
          return false
        }
      })
    },
    cancel() {
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
.box-card {
  margin-bottom: 20px;
}
.block-input {
  width: 600px;
}
.g-upload {
  max-width: 600px;
}
.tip {
  color: #ccc;
  font-size: 12px;
}
.file-list {
  display: flex;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
  position: relative;
  margin-bottom: 10px;
  .file-item {
    margin-right: 20px;
  }
  .file-name {
    // width: 450px;
    &:hover {
      color: #409eff;
    }
  }
}
</style>
