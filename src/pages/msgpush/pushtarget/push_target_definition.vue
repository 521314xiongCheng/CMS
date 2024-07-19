<template>
  <div>
    <!-- <div class="g-page-bar" style="border-bottom: 1px solid #e6e6e6;">
      <span class="page-title">定义人群</span>
    </div> -->
    <div class="g-page-bar" style="border-bottom: 1px solid #e6e6e6;">
      <span class="page-title">{{ id }}</span>
      <span class="page-title">{{ appName }}</span>
      <span class="page-title">{{ groupName }}</span>
    </div>
    <div style="margin-bottom: 40px;margin-top: 40px;">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane name="second">
          <span slot="label"> <i class="el-icon-star-on"></i> 系统计算 </span>
          <span class="page-title">设定计算规则</span>
          <el-form
            ref="formSecond"
            size="small"
            :rules="rules"
            :model="formSecond"
            label-width="110px"
            style="margin-top: 40px;"
          >
            <el-form-item
              label="当前用户职级"
              prop="levels"
              style="border-bottom: 1px dotted #e6e6e6;"
            >
              <el-checkbox-group
                v-model="formSecond.levels"
                style="display: inline;"
              >
                <el-checkbox label="15-" name="levels"></el-checkbox>
                <el-checkbox label="15" name="levels"></el-checkbox>
                <el-checkbox label="20" name="levels"></el-checkbox>
                <el-checkbox label="30" name="levels"></el-checkbox>
                <el-checkbox label="35" name="levels"></el-checkbox>
                <el-checkbox label="40" name="levels"></el-checkbox>
                <el-checkbox label="50" name="levels"></el-checkbox>
                <el-checkbox label="60" name="levels"></el-checkbox>
                <el-checkbox label="70" name="levels"></el-checkbox>
                <el-checkbox label="75" name="levels"></el-checkbox>
                <el-checkbox label="80" name="levels"></el-checkbox>
                <el-checkbox label="85" name="levels"></el-checkbox>
                <el-checkbox label="87" name="levels"></el-checkbox>
                <el-checkbox label="90" name="levels"></el-checkbox>
                <el-checkbox label="90+" name="levels"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item
              label="当前用户状态"
              prop="levelStatus"
              style="border-bottom: 1px dotted #e6e6e6;"
            >
              <el-checkbox-group
                v-model="formSecond.levelStatus"
                style="display: inline;"
              >
                <el-checkbox label="N" name="levels"></el-checkbox>
                <el-checkbox label="A" name="levels"></el-checkbox>
                <el-checkbox label="P" name="levels"></el-checkbox>
                <el-checkbox label="T" name="levels"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item
              v-for="(condition, index) in formSecond.conditions"
              :label="'使用情况' + index"
              :key="condition.key"
              :prop="'conditions.' + index + '.value'"
              style="border-bottom: 1px dotted #e6e6e6;padding-bottom: 10px;"
            >
              <el-date-picker
                v-model="condition.dateRange"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
              <span style="margin-left: 20px;margin-right: 10px;"
                >测试数量</span
              >
              <el-select
                v-model="condition.numberType"
                clearable
                style="width: 100px"
              >
                <el-option key="GTR" label="大于" value="GTR"></el-option>
                <el-option key="LSS" label="小于" value="LSS"></el-option>
                <el-option key="EQU" label="等于" value="EQU"></el-option>
              </el-select>
              <el-input
                v-model="condition.distinguishNumber"
                style="width: 100px"
              />
              <span style="margin-left: 10px;">次</span>
              <el-button
                size="mini"
                type="primary"
                @click.prevent="removeUsage(condition)"
                style="margin-left:100px"
                >移除</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button
                v-if="formSecond.conditions.length < 4"
                type="primary"
                size="mini"
                @click="addUsage"
                >新增条件</el-button
              >
            </el-form-item>

            <div
              class="g-page-bar"
              style="border-top: 1px solid #e6e6e6;margin-bottom: 40px;margin-top: 40px;text-align: center;"
            >
              <el-button type="primary" @click="submitSecond" size="small"
                >保存</el-button
              >
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane name="first">
          <span slot="label"> <i class="el-icon-upload"></i> 上传文件 </span>
          <el-form
            ref="formFirst"
            :model="formFirst"
            label-width="110px"
            style="margin-top: 40px;"
          >
            <el-row :gutter="20">
              <el-col :span="2">
                <el-button size="small" type="success" @click="openDownload"
                  >下载模板</el-button
                >
              </el-col>
              <el-col :span="10">
                <!-- action="https://dev-contentcms.xxxxxxx.cn/proxy/content/msgpush/group/upload" -->
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  action="string"
                  :http-request="uploadExcel"
                  :file-list="fileList"
                  :multiple="false"
                  accept=".xlsx"
                  :data="uploadData"
                  :auto-upload="false"
                  :on-change="uploadOnChange"
                >
                  <el-button slot="trigger" size="small" type="primary"
                    >选取文件</el-button
                  >
                  <el-button
                    style="margin-left: 10px;"
                    size="small"
                    type="success"
                    @click="submitUpload"
                  >
                    <i v-show="uploading" class="el-icon-loading"></i>
                    上传到服务器并进行解析
                  </el-button>
                  <div slot="tip" class="el-upload__tip">
                    只能上传 .xlsx文件，且不超过2M
                  </div>
                </el-upload>
              </el-col>
            </el-row>
            <div
              class="g-page-bar"
              style="border-top: 1px solid #e6e6e6;margin-bottom: 40px;margin-top: 40px;text-align: center;"
            ></div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { uploads, rules } from '../../../api/msgpush/push_target_manage.js'
import { readUserInfo } from '../../../utility/index'
export default {
  data() {
    return {
      id: this.$route.params.id,
      appName: this.$route.params.appName,
      groupName: this.$route.params.groupName,
      activeName: 'second',
      definitionType: 1,
      fileList: [],
      thisENV: '',
      uploading: false,
      formFirst: {
        firstFileUrl: ''
      },
      uploadData: {},
      formSecond: {
        conditions: [
          {
            value: '',
            dateRange: '',
            numberType: '',
            distinguishNumber: ''
          }
        ],
        levels: [],
        levelStatus: []
      },
      conditionList: [
        {
          id: 1,
          condition_name: '当前用户职级'
        },
        {
          id: 2,
          condition_name: '使用情况'
        }
      ],
      rules: {
        levels: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一种用户职级',
            trigger: 'change'
          }
        ]
      },
      condition: {
        value: '',
        dateRange: '',
        numberType: '',
        distinguishNumber: ''
      }
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(this.activeName, tab, event)
    },
    uploadExcel(item) {
      console.log(item)
      let formData = new FormData()

      formData.append('groupId', this.$route.params.id || 34)
      formData.append('createdBy', readUserInfo().name)
      formData.append('file', item.file)
      uploads(formData).then(res => {
        console.log(res)
        this.uploading = false
        this.$message({
          message: '文件上传成功并已解析完成',
          type: 'success'
        })
        this.$router.push({ name: 'msgpush-pushtarget-index' })
      })
    },
    submitUpload(file, fileList) {
      console.log('-----------', file, fileList)
      this.uploading = true
      this.$refs.upload.submit()
    },
    uploadOnChange(file, fileList) {
      console.log('-----------', file, fileList)
      this.uploadData = {
        groupId: this.$route.params.id,
        createdBy: readUserInfo().name
      }
      this.fileList = fileList.slice(-1)
    },
    openDownload() {
      window.open(
        'http://bjs-s3-mdm-prod-mkc-mobile-resources.s3.cn-north-1.amazonaws.com.cn/skinanalyze/resource/msgpush_demo_20190520.xlsx',
        '_blank'
      )
    },

    removeUsage(item) {
      var index = this.formSecond.conditions.indexOf(item)
      if (index !== -1) {
        this.formSecond.conditions.splice(index, 1)
      }
    },
    addUsage() {
      var length = this.formSecond.conditions.length
      if (length < 4) {
        this.formSecond.conditions.push({
          value: '',
          key: Date.now(),
          dateRange: '',
          numberType: '',
          distinguishNumber: ''
        })
      } else {
        this.$message({
          message: '最多4个',
          type: 'warning'
        })
      }
    },
    submitSecond() {
      console.log(this.activeName)
      this.$refs['formSecond'].validate(valid => {
        if (valid) {
          var form = JSON.parse(JSON.stringify(this.formSecond))
          var levels = form.levels

          var levelRange = {}
          if (levels.indexOf('15-') !== -1) {
            levelRange.LEQ = 15
            levels.splice(levels.indexOf('15-'), 1)
          }
          if (levels.indexOf('90+') !== -1) {
            levelRange.GEQ = 90
            levels.splice(levels.indexOf('90+'), 1)
          }

          var used = []

          for (let o of form.conditions) {
            if (
              !o.dateRange[0] ||
              o.numberType.length != 3 ||
              !o.distinguishNumber
            ) {
              this.$message({
                message: '请将使用条件添加完整',
                type: 'warning'
              })
              return
            }
            used.push({
              start: o.dateRange[0],
              end: o.dateRange[1],
              type: o.numberType,
              count: o.distinguishNumber
            })
          }

          const params = {
            levels: levels,
            levelStatus: form.levelStatus,
            levelRange: levelRange,
            used: used
          }
          const data = {
            groupId: this.id,
            rules: JSON.stringify(params),
            updatedBy: readUserInfo().name
          }
          console.log(this.formSecond)
          console.log(params)
          rules(data).then(res => {
            console.log(res)
            if (res.result) {
              this.$router.push({ name: 'msgpush-pushtarget-index' })
            } else {
              this.$notify.error({
                title: '错误',
                message: '添加条件失败'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return
        }
      })
    }
  }
}
</script>

<style></style>
