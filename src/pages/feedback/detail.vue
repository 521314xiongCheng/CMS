<template>
  <div>
    <!-- <div
      class="g-page-bar"
      style="border-bottom: 1px solid #e6e6e6;padding: 10px 0;"
    >
      <span class="page-title">Feedback Manage / Detail</span>
    </div> -->
    <!--basic information-->
    <div class="item-box">
      <el-row class="rowStyle">
        <el-col :span="15">
          <label>Basic Information</label>
        </el-col>
      </el-row>
      <el-table :data="baseInfo" border style="width: 1000px;">
        <el-table-column
          prop="id"
          label="ID"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="brand"
          label="Brand"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="platform"
          label="Platform"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="mobile_system"
          label="Mobile System"
          width="130"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="app_version"
          label="App Version"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createdDate"
          label="Create Time"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="updatedDate"
          label="Last Modify"
          align="center"
        ></el-table-column>
      </el-table>
      <el-table
        :data="consultantInfo"
        border
        style="width: 1000px; margin-top:20px;"
      >
        <el-table-column
          prop="title"
          label="Title"
          align="center"
        ></el-table-column>
        <el-table-column label="Consultant" width="200" align="center">
          <template slot-scope="scope">
            <span v-html="scope.row.ibcNumber"></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="Type"
          width="70"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="status"
          label="State"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="follower"
          label="Follower"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="processStatus"
          label="Process State"
          width="110"
          align="center"
        ></el-table-column>
      </el-table>
    </div>

    <div>
      <div style="margin-top:15px">
        <el-row class="rowStyle">
          <el-col :span="24">
            <label>Content</label>
          </el-col>
        </el-row>
      </div>
      <div class="ContentFlow">
        <el-table :data="caseDetail" border style=" margin-top:20px;">
          <el-table-column
            prop="index"
            label="ID"
            width="60"
            align="center"
          ></el-table-column>
          <el-table-column label="Consultant" width="200" align="center">
            <template slot-scope="scope">
              <span v-html="scope.row.info"></span>
            </template>
          </el-table-column>

          <el-table-column
            prop="title"
            label="Content"
            align="center"
          ></el-table-column>
          <el-table-column label="Image" width="250" align="center">
            <template slot-scope="scope">
              <img
                v-for="(img, index) in scope.row.imgs"
                @click="openImgPreview(img)"
                :key="index"
                :src="img"
                style="width:80px;"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="by"
            label="By"
            width="130"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="date"
            label="Datetime"
            width="180"
            align="center"
          ></el-table-column>
          <el-table-column width="200" align="center">
            <template v-if="scope.row.roleType == '02'" slot-scope="scope">
              <div style="margin-bottom:10px;">
                当前状态: &nbsp;{{ scope.row.status == '01' ? '有效' : '无效' }}
              </div>

              <el-button
                size="small"
                type="primary"
                @click="
                  editStatus(
                    1,
                    scope.row.status == '01' ? '02' : '01',
                    scope.row.id
                  )
                "
              >
                置为{{ scope.row.status == '01' ? '无效' : '有效' }}
              </el-button>
            </template>
          </el-table-column>

          <!-- <el-table-column prop="updatedDate" label="Last Modify" align="center"></el-table-column> -->
        </el-table>
      </div>

      <div class="contentFloor" v-show="newreply">
        <el-form ref="form" :model="form">
          <el-row :gutter="30" class="rowStyle" style="position: relative;">
            <el-col :span="2">
              <label>{{ detailList.length + 2 }}#</label>
            </el-col>
            <el-col :span="22">
              <el-row type="flex" align="middle">
                <el-col :span="20">
                  <el-row :gutter="30" class="rowStyle">
                    <el-col :span="4">
                      <span>{{ userName }}</span>
                    </el-col>
                    <el-col :span="5">
                      <span></span>
                    </el-col>
                    <el-col :span="6">
                      <!-- <span>2019-02-21 00:00</span> -->
                    </el-col>
                  </el-row>
                  <el-row :gutter="30" class>
                    <el-col :span="24">
                      <el-form-item prop="content">
                        <el-input
                          type="textarea"
                          :rows="3"
                          placeholder="请输入内容"
                          v-model="form.content"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="30" class="rowStyle">
                    <el-col :span="24">
                      <el-upload
                        class="g-upload"
                        action
                        :on-change="handleImageFileChange"
                        :on-remove="handleRemove"
                        :file-list="imageList"
                        list-type="picture-card"
                        :auto-upload="autoUpload"
                        accept="image/png, image/jpeg"
                        limit="4"
                        :on-exceed="handleExceed"
                      >
                        <!-- <span>添加图片</span> -->
                        <el-button type="primary" plain>添加图片</el-button>
                      </el-upload>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="4" style="text-align: center;">
                  <el-row class="rowStyle">
                    <el-col :span="24">
                      <span>当前状态: &nbsp;</span>
                      <span>-</span>
                    </el-col>
                  </el-row>
                  <el-row class="rowStyle">
                    <el-col :span="24">
                      <el-button type="primary" @click="submit"
                        >置为有效并发布</el-button
                      >
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div style="padding: 20px 0;">
        <el-button
          v-if="
            data.processStatus == '02' ||
              data.processStatus == '03' ||
              data.processStatus == '04'
          "
          type="primary"
          @click="newreply = true"
        >
          <i class="el-icon-plus"></i>添加新的回复
        </el-button>
        <el-button
          v-if="data.processStatus != '07' && data.processStatus != '06'"
          type="primary"
          @click="editStatus(2, '06')"
          >设为无效</el-button
        >
        <el-button
          v-if="
            data.processStatus != '01' &&
              data.processStatus != '05' &&
              data.processStatus != '07' &&
              data.processStatus != '06'
          "
          type="primary"
          @click="editStatus(2, '07')"
          >关闭问题</el-button
        >
        <el-button
          v-if="data.processStatus == '07'"
          type="primary"
          @click="editStatus(2, '02')"
          >重新打开问题</el-button
        >
      </div>
    </div>
    <!--全屏预览图片-->
    <el-dialog :visible.sync="showImgPreview">
      <img width="100%" :src="imgPreviewSrc" alt />
    </el-dialog>
  </div>
</template>

<script>
import { getDetail, editStatus, add } from '../../api/feedback/feedback.js'
import upload from '@/utility/upload.js'
import { readUserInfo } from '../../utility/index'
export default {
  components: {},
  data() {
    return {
      data: {},
      detailList: [],
      showImgPreview: false,
      id: this.$route.params.id,
      imgPreviewSrc: '',
      form: {},
      newreply: false,
      imageList: [],
      autoUpload: false,
      userName: ''
    }
  },
  methods: {
    submit() {
      if (!this.form.content) {
        this.$message({
          message: '请填写回复内容',
          type: 'warning'
        })
        return
      }
      this.form.imgs = []
      for (var i in this.imageList) {
        this.form.imgs.push(this.imageList[i].url)
      }
      this.form.feedbackId = this.data.feedbackId
      this.form.userName = this.userName
      this.form.nickName = readUserInfo().nickName
      var param = { username: this.userName, data: this.form }
      add(param).then(res => {
        if (res.result) {
          this.getDetail()
          this.$refs['form'].resetFields()
          this.imageList = []
          this.closeNewReply()
        }
      })
    },
    openImgPreview(imgSrc) {
      this.imgPreviewSrc = imgSrc
      this.showImgPreview = true
    },
    handleImageFileChange(file, fileList) {
      if (!this.checkImageSize(file)) {
        fileList.splice(fileList.length - 1, 1)
        return false
      }
      upload(file.raw).then(url => {
        file.url = url
        file.status = 'success'
        this.imageList.push(file)
        for (var i in fileList) {
          if (fileList[i].uid == file.uid) {
            fileList[i] = file
          }
        }
        fileList = []
      })
      return false
    },
    handleRemove(file, fileList) {
      this.imageList = fileList
    },
    handleExceed() {
      this.$notify.error({
        title: 'Error',
        message: 'Up to 4 pictures',
        duration: 3000
      })
      return false
    },
    checkImageSize(file) {
      if (file.raw.type.indexOf('image') > -1 && file.size / 1024 > 500) {
        this.$notify.error({
          title: 'Error',
          message:
            'Please upload JPG, PNG, JPEG format pictures, size limit of less than 500KB',
          duration: 3000
        })
        return false
      }
      return true
    },
    getDetail() {
      this.userName = readUserInfo().name

      console.log('this.userName', this.userName)
      getDetail({ id: this.id }).then(res => {
        this.data = res.case
        this.baseInfo = [
          {
            id: res.case.id,
            brand: res.case.brand,
            platform: res.case.platform,
            mobile_system: res.case.mobile_system,
            app_version: res.case.app_version,
            createdDate: res.case.createdDate,
            updatedDate: res.case.updatedDate
          }
        ]

        // console.log(this.processStatusDesc(res.case.processStatus))

        this.consultantInfo = [
          {
            ibcNumber: `${res.case.ibcName}<br/>(${res.case.ibcNumber})`,
            title: res.case.title,
            type: res.case.type,
            status: this.statusDesc(res.case.status),
            follower: res.case.follower,
            processStatus: this.processStatusDesc(res.case.processStatus)
          }
        ]

        this.caseDetail = [
          {
            id: 0,
            index: 1 + '#',
            info: `${res.case.ibcName} <br/> (${res.case.ibcNumber})`,
            by: 'consultant',
            title: res.case.content,
            imgs: res.case.imgs,
            date: res.case.createdDate,
            status: '',
            roleType: ''
          }
        ]
        if (res.caseDetailList) {
          this.detailList = res.caseDetailList
          for (let i in res.caseDetailList) {
            let item = {
              index: i * 1 + 2 + '#',
              id: res.caseDetailList[i].id,
              info:
                res.caseDetailList[i].roleType == '01'
                  ? `${res.case.ibcName}<br/>(${res.case.ibcNumber})`
                  : res.caseDetailList[i].responder,
              by:
                res.caseDetailList[i].roleType == '01'
                  ? 'consultant'
                  : 'follower/admin',
              roleType: res.caseDetailList[i].roleType,
              title: res.caseDetailList[i].content,
              imgs: res.caseDetailList[i].imgs,
              date: res.caseDetailList[i].createdDate,
              status: res.caseDetailList[i].status
            }

            this.caseDetail.push(item)
          }
        }
      })
    },
    editStatus(flag, status, caseDetailId) {
      //flag 1回复内容状态变更，2反馈状态变更
      var params = {
        username: this.userName,
        data: { userName: this.userName }
      }
      if (flag == 1) {
        params.data.caseDetailId = caseDetailId
        params.data.status = status
      } else {
        params.data.caseId = this.id
        params.data.processStatus = status
      }
      editStatus(params).then(res => {
        if (res.result) {
          if (flag == 2) {
            this.closeNewReply()
          }
        }
        this.getDetail()
      })
    },
    closeNewReply() {
      this.newreply = false
      this.form = {}
    },
    processStatusDesc: function(value) {
      if (!value) return ''
      if ('01' == value) {
        return '新建'
      } else if ('02' == value) {
        return '已分配'
      } else if ('03' == value) {
        return '工单已回复'
      } else if ('04' == value) {
        return '顾问已回复'
      } else if ('05' == value) {
        return '用户删除'
      } else if ('06' == value) {
        return '跟单删除'
      } else if ('07' == value) {
        return '关闭'
      }
      return ''
    },
    statusDesc(val) {
      if ('01' == val) {
        return '已提交'
      } else if ('02' == val) {
        return '处理中'
      } else if ('03' == val) {
        return '无效'
      } else if ('04' == val) {
        return '关闭'
      }
      return ''
    },
    replyStatusDesc(val) {
      if ('01' == val) {
        return '有效'
      } else if ('02' == val) {
        return '无效'
      }
      return ''
    }
  },
  mounted() {
    this.getDetail()
  },
  filters: {
    processStatusDesc: function(value) {
      if (!value) return ''
      if ('01' == value) {
        return '新建'
      } else if ('02' == value) {
        return '已分配'
      } else if ('03' == value) {
        return '工单已回复'
      } else if ('04' == value) {
        return '顾问已回复'
      } else if ('05' == value) {
        return '用户删除'
      } else if ('06' == value) {
        return '跟单删除'
      } else if ('07' == value) {
        return '关闭'
      }
      return ''
    },
    statusDesc(val) {
      if ('01' == val) {
        return '已提交'
      } else if ('02' == val) {
        return '处理中'
      } else if ('03' == val) {
        return '无效'
      } else if ('04' == val) {
        return '关闭'
      }
      return ''
    },
    replyStatusDesc(val) {
      if ('01' == val) {
        return '有效'
      } else if ('02' == val) {
        return '无效'
      }
      return ''
    }
  }
}
</script>

<style>
.item-box {
  padding-top: 15px;
  border-bottom: 1px solid #eee;
}

.rowStyle {
  margin-bottom: 15px;
}

.contentFloor {
  padding-top: 15px;
  border-bottom: 1px dotted #eee;
}

.imgThumbStyle {
  width: 150px;
  height: 150px;
  border: 1px solid #eee;
}
</style>
