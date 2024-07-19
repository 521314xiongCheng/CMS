<!-- X component -->
<template>
  <div class="detail">
    <el-form
      :model="form"
      ref="form"
      size="small"
      :rules="rules"
      label-width="180px"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="摘要">
        <el-input v-model="form.intro"></el-input>
      </el-form-item>
      <el-form-item label="权限" prop="permission_control_flag">
        <el-radio-group
          v-model="form.permission_control_flag"
          class="right_radio"
          @change="permissionChange"
        >
          <el-radio :label="0">无权限</el-radio>
          <el-radio :label="1"
            >限制Level：
            <el-input
              v-model.number="form.min_level"
              style="width: 100px"
            ></el-input
            >&nbsp;≤&nbsp;Level&nbsp;≤&nbsp;
            <el-input
              v-model.number="form.max_level"
              style="width: 100px"
            ></el-input
          ></el-radio>
          <el-radio :label="2" class="radio_upload"
            >限制名单：
            <div v-if="form.file_name" style="margin-right: 5px">
              <i class="el-icon-document"></i>&nbsp;{{ form.file_name }}
            </div>
            <el-upload
              class="upload-demo"
              action="#"
              :show-file-list="false"
              :multiple="false"
              accept=".xls,.xlsx"
              :http-request="uploadExcel"
            >
              <el-button slot="trigger" size="small" type="primary"
                >上传名单</el-button
              >
            </el-upload>
            <div @click="openDownload" class="download">格式文件下载</div>
            <div class="tips">*名单请使用美容顾问12位编号</div>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生效时间" prop="effectiveTime">
        <el-date-picker
          v-model="form.effectiveTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="options"
          value-format="yyyy/MM/dd HH:mm:ss"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="是否推送消息" prop="is_push">
        <el-radio-group v-model="form.is_push">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 文本编辑器 -->
      <el-form-item class="ckeditor-wrap" label="正文链接" prop="content_url">
        <el-input v-model="form.content_url"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  getMessage,
  addMessage,
  editMessage
} from '../../../api/msgpush/communication'
import { readUserInfo } from '../../../utility/index'
import xlsx from 'node-xlsx'
export default {
  data() {
    return {
      options: {
        disabledDate: date => {
          return date < new Date().getTime() - 1 * 24 * 60 * 60 * 1000
        }
      },
      messageId: '',
      form: {
        title: '',
        intro: '',
        permission_control_flag: '',
        min_level: '',
        max_level: '',
        is_push: '',
        content_url: '',
        schedule_start_datetime: '',
        schedule_end_datetime: '',
        name_list: '',
        effectiveTime: [],
        file_name: ''
      },
      fileList: [],
      fileName: '',
      rules: {
        title: {
          required: true,
          message: '请输入标题'
        },
        permission_control_flag: {
          required: true,
          message: '请设置权限'
        },
        effectiveTime: {
          required: true,
          message: '请选择生效时间'
        },
        is_push: {
          required: true,
          message: '请选择是否推送消息'
        },
        content_url: {
          required: true,
          message: '请填写正文url'
        }
      }
    }
  },
  computed: {},
  created() {
    const { id } = this.$route.query
    if (id) {
      this.messageId = id
      getMessage(id).then(res => {
        this.form = res
        this.$nextTick(() => {
          this.$set(this.form, 'effectiveTime', [
            res.schedule_start_datetime,
            res.schedule_end_datetime
          ])
        })
        this.permission = this.form.permission_control_flag
        this.fileName = this.form.file_name
      })
    }
  },
  methods: {
    permissionChange(index) {
      switch (index) {
        case 0:
          this.form.min_level = ''
          this.form.max_level = ''
          this.form.name_list = ''
          this.form.file_name = ''
          break
        case 1:
          this.form.name_list = ''
          this.form.file_name = ''
          break
        case 2:
          this.form.min_level = ''
          this.form.max_level = ''
          if (this.permission === 2) {
            this.form.file_name = this.fileName
          }
          break
      }
    },
    save() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }

        if (this.form.permission_control_flag === 1) {
          if (!this.form.min_level || !this.form.max_level) {
            this.$message({
              message: '请填写限制Level的范围',
              type: 'error'
            })

            return
          }

          if (
            !Number.isInteger(this.form.min_level) ||
            !Number.isInteger(this.form.max_level)
          ) {
            this.$message({
              message: 'Level是0到100之间的数字',
              type: 'error'
            })

            return
          }

          if (
            this.form.min_level > this.form.max_level ||
            this.form.min_level < 0 ||
            this.form.min_level > 100 ||
            this.form.max_level < 0 ||
            this.form.max_level > 100
          ) {
            this.$message({
              message: '限制Level的范围填写错误',
              type: 'error'
            })
            return
          }
        }

        if (
          !this.messageId &&
          this.form.permission_control_flag === 2 &&
          !this.form.name_list
        ) {
          this.$message({
            message: '请上传名单',
            type: 'error'
          })
          return
        }

        if (
          this.form.permission_control_flag === 2 &&
          this.permission !== 2 &&
          !this.form.name_list
        ) {
          this.$message({
            message: '请上传名单',
            type: 'error'
          })
          return
        }

        this.form.schedule_start_datetime = this.form.effectiveTime[0]
        this.form.schedule_end_datetime = this.form.effectiveTime[1]
        this.form.operator = readUserInfo().email
        console.log('this.form', this.form)

        const loading = this.$loading({
          lock: true,
          text: '正在提交',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        if (!this.messageId) {
          addMessage(this.form)
            .then(res => {
              loading.close()
              if (res.ret_code === '0') {
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  onClose: () => {
                    this.$router.back()
                  }
                })
              } else {
                this.$message({
                  message: res.ret_message,
                  type: 'warning'
                })
              }
            })
            .catch(res => {
              loading.close()
              this.$message({
                message: res.error_message,
                type: 'error'
              })
            })
        } else {
          this.form.message_id = this.messageId
          editMessage(this.form)
            .then(res => {
              loading.close()
              if (res.ret_code === '0') {
                this.$message({
                  message: '编辑成功',
                  type: 'success',
                  onClose: () => {
                    this.$router.back()
                  }
                })
              } else {
                this.$message({
                  message: res.ret_message,
                  type: 'warning'
                })
              }
            })
            .catch(res => {
              loading.close()
              this.$message({
                message: res.error_message,
                type: 'error'
              })
            })
        }
      })
    },
    cancel() {
      this.$router.back()
    },
    openDownload() {
      window.open(
        'https://oocontent.xxxxxxx.com.cn/client/html/cms/cms_consultants.xlsx',
        '_blank'
      )
    },
    uploadExcel(item) {
      const loading = this.$loading({
        lock: true,
        text: '上传中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let arr = []
      let suffix = item.file.name.substring(item.file.name.lastIndexOf('.') + 1)
      if (suffix == 'xls' || suffix == 'xlsx') {
        const reader = new FileReader()
        reader.readAsArrayBuffer(item.file)
        reader.onload = () => {
          const buffer = xlsx.parse(reader.result, {
            type: 'buffer'
          })

          arr = arr.concat(buffer[0].data)
          arr = arr.splice(1, arr.length - 1)
          if (!arr || arr.length === 0) {
            loading.close()
            this.$message({
              message: '上传名单数据为空，请重新上传',
              type: 'error'
            })
            return
          }

          let flag = true
          arr.forEach(item => {
            if (!/\b\d{12}\b/.test(item)) {
              flag = false
              return
            }
          })
          if (!flag) {
            loading.close()
            this.$message({
              message: '上传名单格式不正确，请重新上传',
              type: 'error'
            })
            return
          }
          this.form.name_list = arr.join(',')
          loading.close()
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.$nextTick(() => {
            this.$set(this.form, 'file_name', item.file.name)
          })
        }
      } else {
        this.$notify.error({
          title: 'Error',
          message: `文件格式必须是 xls/xlsx`,
          duration: 3000
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.detail {
  width: 860px;
}
/deep/ .right_radio {
  label {
    display: block;
    margin-top: 10px;
  }
  .ckeditor-wrap {
    /deep/.el-form-item__content {
      margin-left: 40px !important;
    }
  }
}
/deep/ .el-form-item__content .remark {
  position: absolute;
  left: 104%;
  top: 0;
  width: 300px;
  font-size: 12px;
  color: red;
  &::before {
    content: '*';
    position: absolute;
    left: -10px;
    top: 2px;
  }
  &.upload-remark {
    left: 72%;
  }
}
/deep/ .radio_upload {
  display: flex !important;
  align-items: center;
  .el-radio__label {
    display: flex;
    align-items: center;
  }
  a {
    margin-left: 5px;
  }
}
.download {
  text-decoration: underline;
  color: rgb(100, 116, 220);
  margin-left: 10px;
}
.tips {
  margin-left: 10px;
  color: red;
}
</style>
