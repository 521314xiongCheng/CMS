<template>
  <div class="message-board">
    <el-form
      size="small"
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="标题" prop="title">
        <el-input class="block-input" v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-radio v-model="form.isHot" :label="true">置顶</el-radio>
        <el-radio v-model="form.isHot" :label="false">排序</el-radio>
        <el-input-number
          size="small"
          v-model="form.sort"
          :max="999"
          :min="0"
          controls-position="left"
          :controls="false"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="发布时间" prop="publishTime">
        <el-date-picker
          v-model="publishDate"
          size="small"
          type="datetimerange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="options"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="是否可被分享">
        <el-radio v-model="form.isShare" :label="true">是</el-radio>
        <el-radio v-model="form.isShare" :label="false">否</el-radio>
      </el-form-item>
      <el-form-item label="可浏览名单" v-if="!form.isShare">
        <!-- <el-radio v-model="ruleType" :label="1">不限制</el-radio> -->
        <el-radio v-model="ruleType" :label="2">等级限制</el-radio>
        <el-radio v-model="ruleType" :label="3">地域限制</el-radio>
        <el-radio v-model="ruleType" :label="4">名单限制</el-radio>
      </el-form-item>
      <el-form-item label="" prop="ruleType">
        <div v-if="ruleType === 2">
          <el-checkbox-group v-model="form.rules.levels">
            <el-checkbox
              v-for="level in levels"
              :key="level"
              :label="level"
            ></el-checkbox>
          </el-checkbox-group>
        </div>
        <div v-if="ruleType === 3">
          <draggable-select
            v-model="form.rules.provinces"
            multiple
            filterable
            remote
            class="block-input"
            size="small"
            placeholder="请输入地区名称搜索"
            :remote-method="querySearchProvinces"
          >
            <el-option
              v-for="(province, index) in provinces"
              :key="index"
              :value="province"
            >
            </el-option>
          </draggable-select>
          <!-- <el-checkbox-group v-model="form.rules.provinces">
            <el-checkbox
              v-for="(province, index) in provinces"
              :key="index"
              :label="province"
            ></el-checkbox>
          </el-checkbox-group> -->
        </div>
        <div v-if="ruleType === 4">
          <el-row>
            <el-col :span="18">
              <el-upload
                class="upload-demo"
                ref="upload"
                action="string"
                :http-request="uploadExcel"
                :multiple="false"
                :file-list="excelList"
                :on-remove="delExcel"
                accept=".xlsx"
              >
                <el-button slot="trigger" size="small" type="primary"
                  >Upload</el-button
                >
                <el-button
                  size="small"
                  style="margin-left:20px;"
                  type="text"
                  @click="openDownload"
                  >下载模板</el-button
                >
                <div slot="tip" class="el-upload__tip">
                  只能上传 .xlsx文件，且不超过2M
                </div>
              </el-upload>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
      <el-form-item label="内容封面" prop="coverImageUrl" class="bg-img">
        <div>
          <el-button
            size="mini"
            type="primary"
            @click="
              handleUploadAndSelectResource(
                'image/png, image/jpeg',
                null,
                {
                  size: 100
                },
                'image'
              )
            "
            >上传</el-button
          >
          <el-input
            v-model="form.coverImageUrl"
            class="detailForm-coverImageUrl"
            size="small"
          ></el-input>
        </div>
        <div class="upload-file-item" v-if="form.coverImageUrl">
          <div class="upload-img-wrap">
            <el-image
              class="upload-item-img"
              :src="form.coverImageUrl"
              fit="cover"
            ></el-image>
            <label class="whispace upload-img-label">{{
              form.coverImageUrl
            }}</label>
          </div>
          <label class="item-status-label">
            <i class="el-icon-upload-success el-icon-check"></i>
            <i
              class="el-icon-close del-item"
              @click="form.coverImageUrl = ''"
            ></i>
          </label>
        </div>
        <p>
          *尺寸为300*300，大小不超过100kb
        </p>
      </el-form-item>
      <el-form-item label="内容正文">
        <tinymce v-model="form.content"></tinymce>
      </el-form-item>
      <el-form-item label="资源列表">
        <el-button
          size="mini"
          type="primary"
          @click="handleUploadAndSelectResource('.pdf', null, {}, 'pdf')"
          >上传</el-button
        >
        <div class="draggable-div">
          <draggable v-model="form.attachment">
            <div
              v-for="(item, index) in form.attachment"
              :key="item.id"
              class="file-list"
            >
              <div class="file-item">
                <div class="img-wrap">
                  <img
                    class="item-img preview-img"
                    :src="formatUrl(item)"
                    alt=""
                  />
                </div>
              </div>
              <div class="whispace file-name">
                <el-input
                  v-model="item.fileName"
                  placeholder="文件名"
                ></el-input>
                <div>
                  {{ item.fileUrl }}
                </div>
              </div>
              <i
                class="el-icon-delete del-item"
                @click="delItem(index, form.attachment)"
              ></i>
            </div>
          </draggable>
        </div>
      </el-form-item>

      <el-form-item label=" ">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit('form')">发布</el-button>
      </el-form-item>
    </el-form>
    <upload-and-select-in-resource
      :uploadDialog="uploadDialog"
      :acceptType="acceptType"
      :resourceType="resourceType"
      :unacceptType="unacceptType"
      :fileSize="fileSize"
      @uploadFile="uploadFile"
      @selectResource="selectResource"
      @closeUploadDialog="uploadDialog = false"
    ></upload-and-select-in-resource>
  </div>
</template>
<script>
import tinymce from '@/components/tinymce/index'
import upload from '@/mixins/upload.js'
import uploadAndSelectInResource from '@/components/selectInResources/uploadAndSelectInResource.vue'
import DraggableSelect from '@/components/dragSelect/index.vue'
import storage from 'good-storage'
import draggable from 'vuedraggable'
import { treeData2Arr } from '@/utility/index.js'
import { uploadToResource } from '@/api/index.js'
import {
  getCommunicationDetail,
  addCommunication,
  updateCommunication,
  getRules,
  uploadWhiteList
} from '@/api/xxxxxxx/messageBoard.js'
export default {
  components: {
    draggable,
    tinymce,
    uploadAndSelectInResource,
    DraggableSelect
  },
  mixins: [upload],
  data() {
    let validateRuleType = (rule, value, callback) => {
      if (!this.form.isShare) {
        switch (this.ruleType) {
          case 1:
            return callback()

          case 2:
            if (!this.form.rules.levels || !this.form.rules.levels.length) {
              return callback(new Error('请选择限制等级！'))
            }
            return callback()
          case 3:
            if (
              !this.form.rules.provinces ||
              !this.form.rules.provinces.length
            ) {
              return callback(new Error('请选择限制地域！'))
            }
            return callback()
          case 4:
            console.log(this.temporaryTag)
            if (!this.temporaryTag) {
              return callback(new Error('请上传限制名单！'))
            }
            return callback()
        }
      }
      callback()
    }
    return {
      options: {
        disabledDate: date => {
          return date < new Date().getTime() - 1 * 24 * 60 * 60 * 1000
        }
      },
      ruleType: 1,
      form: {
        title: '',
        isHot: false,
        isShare: true,
        sort: 999,
        coverImageUrl: '',
        content: '',
        attachment: [],
        rules: {
          levels: [],
          provinces: []
        }
      },
      levels: [],
      levelList: [],
      provinces: [],
      provinceList: [],
      rules: {
        title: [{ required: true, message: '必填项', trigger: 'blur' }],
        ruleType: [{ validator: validateRuleType, trigger: 'blur' }]
      },
      iconUrlList: [],
      fileList: [],
      publishDate: [],
      uploadDialog: false,
      attachmentsUploadDialog: false,
      acceptType: 'image/png, image/jpeg',
      unacceptType: '',
      fileSize: { size: 200 },
      resourceType: 'pdf',
      temporaryTag: null, //白名单上传excel零时id
      excelList: [] //白名单上传excel列表
    }
  },
  watch: {
    ['form.isShare'](n) {
      console.log(n)
      if (n) {
        this.ruleType = 1
        this.form.rules.levels = []
        this.form.rules.provinces = []
        this.temporaryTag = null
        this.excelList = []
      }
    }
  },
  created() {
    this.getRules()
    console.log(this.$route.params)
    if (this.$route.query.id) {
      getCommunicationDetail(this.$route.query.id).then(res => {
        console.log(res)
        if (!res.attachment) {
          res.attachment = []
        }
        if (res.coverImageUrl) {
          this.iconUrlList = [
            {
              name: res.coverImageUrl,
              url: res.coverImageUrl
            }
          ]
        } else {
          this.iconUrlList = []
        }
        if (res.shareRules.levels && res.shareRules.levels.length) {
          this.ruleType = 2
        } else {
          res.shareRules.levels = []
        }
        if (res.shareRules.provinces && res.shareRules.provinces.length) {
          this.ruleType = 3
        } else {
          res.shareRules.provinces = []
        }
        if (res.shareRules.isUpload && res.shareRules.temporaryTag) {
          this.ruleType = 4
          this.excelList = [
            {
              name: res.shareRules.temporaryTag,
              url: res.shareRules.temporaryTag
            }
          ]
        } else {
          res.shareRules.isUpload = false
          this.temporaryTag = null
        }
        this.form = res
        this.form.rules = res.shareRules
        console.log(this.form)
        if (res.publishEndDate && res.publishStartDate) {
          this.publishDate = [res.publishStartDate, res.publishEndDate]
        }
      })
    }
  },
  methods: {
    handleUploadAndSelectResource(
      acceptType,
      unacceptType,
      fileSize,
      resourceType
    ) {
      this.acceptType = acceptType
      this.unacceptType = unacceptType
      this.fileSize = fileSize
      this.resourceType = resourceType
      this.uploadDialog = true
    },
    uploadImageToResource(name, url, property, type) {
      let moduleId
      let menus = storage.get('menus')
      moduleId = treeData2Arr(menus, 'subMenus').filter(
        o => o.path === '/xxxxxxx/messageBoard'
      )[0].id
      let data = {
        name: name,
        moduleId: moduleId,
        url: url,
        property: property,
        resourceType: type,
        client: 'BackEnd'
      }
      uploadToResource(data)
    },
    uploadFile(data) {
      this.uploadDialog = false
      if (this.acceptType === '.pdf') {
        this.form.attachment.push({
          fileUrl: data.url,
          fileName: data.name,
          fileType: data.fileType
        })
      } else {
        this.form.coverImageUrl = data.url
      }
      this.uploadImageToResource(
        data.name,
        data.url,
        data.fileInfo,
        data.fileType
      )
    },
    selectResource(data) {
      this.uploadDialog = false
      if (this.acceptType === '.pdf') {
        this.form.attachment.push({
          fileUrl: data.url,
          fileName: data.name,
          fileType: 'pdf'
        })
        console.log(this.form.attachment)
      } else {
        this.form.coverImageUrl = data.url
      }
    },
    delItem(item, list) {
      list.splice(item, 1)
    },
    formatFileType(file) {
      let fileType = file.raw.type
      let list = file.name.split('.')
      let suffix = list[list.length - 1]
      if (
        fileType &&
        (fileType.includes('image') ||
          fileType.includes('video') ||
          fileType.includes('audio'))
      ) {
        console.log(fileType.split('/')[0])
        switch (fileType.split('/')[0]) {
          case 'image':
            return 'image'
          case 'video':
            return 'mp4'
          case 'audio':
            return 'audio'
        }
      } else {
        switch (suffix) {
          case 'xls':
          case 'xlsx':
            return 'excel'
          case 'pdf':
            return 'pdf'
          case 'ppt':
          case 'pps':
          case 'pptx':
            return 'ppt'
          case 'doc':
          case 'docx':
            return 'word'
        }
      }
    },
    formatUrl(item) {
      if (item.fileType === 'image') {
        return item.fileUrl
      } else {
        switch (item.fileType) {
          case 'mp4':
            return require(`../../../images/library/mp4.png`)
          case 'xls':
          case 'xlsx':
          case 'excel':
            return require(`../../../images/library/excel.png`)
          case 'pdf':
            return require(`../../../images/library/pdf.png`)
          case 'ppt':
          case 'pps':
          case 'pptx':
            return require(`../../../images/library/ppt.png`)
          case 'doc':
          case 'docx':
          case 'word':
            return require(`../../../images/library/word.png`)
          default:
            return require(`../../../images/library/unknown.png`)
        }
      }
    },
    querySearchProvinces(queryString) {
      this.provinces = this.provinceList.filter(o => o.includes(queryString))
    },
    getRules() {
      getRules().then(res => {
        this.levels = this.levelList = res.levels
        this.provinces = this.provinceList = res.provinces
      })
    },
    openDownload() {
      window.open(
        'http://bjs-s3-mdm-prod-mkc-mobile-resources.s3.cn-north-1.amazonaws.com.cn/skinanalyze/resource/msgpush_demo_20190520.xlsx',
        '_blank'
      )
    },
    uploadExcel(item) {
      // debugger
      let formData = new FormData()
      formData.append('file', item.file)
      uploadWhiteList(formData).then(res => {
        console.log(res)
        this.temporaryTag = res.temporaryTag
        console.log(this.temporaryTag)
        this.excelList = [
          {
            name: res.temporaryTag,
            url: res.temporaryTag
          }
        ]
        this.$message({
          message: '文件上传成功',
          type: 'success'
        })
      })
    },
    delExcel() {
      this.temporaryTag = null
      this.excelList = []
    },
    submit(form) {
      this.$refs[form].validate(async valid => {
        if (valid) {
          let data = {
            title: this.form.title,
            isShare: this.form.isShare,
            sort: this.form.sort,
            isHot: this.form.isHot,
            content: this.form.content,
            attachment: this.form.attachment,
            coverImageUrl: this.form.coverImageUrl,
            rules: {
              isRule: false
            }
          }
          // let content = structuredHtml(htmlSplitCustom(this.form.content))
          if (!this.form.isShare) {
            switch (this.ruleType) {
              case 1:
                data.rules.isRule = false
                break
              case 2:
                data.rules.isRule = true
                data.rules.levels = this.form.rules.levels
                break
              case 3:
                data.rules.isRule = true
                data.rules.provinces = this.form.rules.provinces
                break
              case 4:
                data.rules.isRule = true
                data.rules.isUpload = true
                data.rules.temporaryTag = this.temporaryTag
                break
            }
          }
          if (this.publishDate && this.publishDate.length) {
            data.publishStartDate = this.publishDate
              ? this.publishDate[0]
              : null
            data.publishEndDate = this.publishDate ? this.publishDate[1] : null
          }
          console.log(data)
          if (this.$route.query.id) {
            updateCommunication(this.$route.query.id, data).then(res => {
              console.log(res)
              this.$router.back()
            })
          } else {
            addCommunication(data).then(res => {
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
.block-input {
  width: 600px;
}

.input-img-url {
  position: absolute;
  left: 90px;
  width: 510px !important;
}
.draggable-div {
  width: 600px;
  .file-list {
    display: flex;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    align-items: center;
    position: relative;
    margin-bottom: 10px;
    .file-item {
      margin-right: 20px;
    }
    .file-name {
      width: 450px;
      &:hover {
        color: #409eff;
      }
    }
    .del-item {
      position: absolute;
      right: 5px;
      top: 5px;
      cursor: pointer;
    }
  }
}
.img-wrap {
  position: relative;
  .item-img {
    display: block;
  }
  .box-mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    color: #fff;
    justify-content: center;
    display: none;
    i {
      width: 50%;
      text-align: center;
      cursor: pointer;
    }
  }
}
.detailForm-coverImageUrl {
  margin-left: 10px;
  width: 350px !important;
}
.bg-img {
  width: 100%;
  /deep/ .el-upload-list {
    max-height: 102px;
    overflow: hidden;
  }
  /deep/ .el-form-item__content {
    width: calc(100% - 120px);
  }
}
.upload-file-item {
  width: 730px;
  border-radius: 8px;
  border: 1px solid #ccc;
  padding: 10px;
  position: relative;
  overflow: hidden;
  margin-top: 10px;
  &:hover {
    .del-item {
      display: block;
    }
    .item-status-label {
      background-color: rgba(0, 0, 0, 0.5);
    }
    .el-icon-upload-success {
      display: none;
    }
  }
  .del-item {
    display: none;
    transform: rotate(-45deg);
    color: #fff;
  }
  .upload-img-wrap {
    display: flex;
    align-items: center;
    flex-flow: row;
    .upload-item-img {
      vertical-align: middle;
      border-radius: 8px;
      border: 1px solid #ccc;
      width: 80px;
      height: 80px;
      margin-right: 20px;
      flex-grow: 0;
    }
    .upload-img-label {
      flex: 1;
    }
  }
}
.item-status-label {
  position: absolute;
  right: -15px;
  top: -6px;
  width: 40px;
  height: 24px;
  background: #13ce66;
  text-align: center;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  -webkit-box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
}
.el-icon-upload-success {
  font-size: 12px;
  margin-top: 11px;
  transform: rotate(-45deg);
  color: #fff;
}
.del-item {
  font-size: 12px;
  margin-top: 11px;
  cursor: pointer;
}
.video_cover_url {
  height: 70px;
}
.img-wrap:hover {
  .box-mask {
    display: flex;
  }
}
.preview-img {
  width: 70px;
  height: 70px;
}
#tinymceTextarea {
  width: 500px;
}
/deep/.preview-dialog {
  background-color: #f5f4f5;
  width: 400px !important;
  .el-drawer__body {
    overflow-y: auto;
    .preview-detail {
      padding: 24px/2;
      margin: 0 auto;
      width: 702px/2;
      box-sizing: content-box;
      background-color: #fff;
      .title {
        height: 44px/2;
        font-size: 44px/2;
        font-weight: 500;
        color: rgba(48, 49, 51, 1);
        line-height: 44px/2;
        margin-bottom: 25px/2;
      }
      .subtitle {
        display: flex;
        justify-content: space-between;
        height: 24px/2;
        font-size: 24px/2;
        font-weight: 500;
        color: rgba(144, 147, 153, 1);
        line-height: 24px/2;
        margin-bottom: 50px/2;
      }
      .introduce {
        display: flex;
        align-items: center;
        height: 32px/2;
        font-size: 32px/2;
        font-weight: 500;
        color: rgba(48, 49, 51, 1);
        line-height: 32px/2;
        margin-bottom: 26px/2;
        .introduce-icon {
          width: 32px/2;
          height: 36px/2;
          margin-right: 13px/2;
        }
      }
      .content {
        font-size: 32px/2;
        font-weight: 500;
        color: rgba(96, 98, 102, 1);
        line-height: 48px/2;
        img {
          max-width: 100%;
          height: auto;
        }
      }
      .resource-list {
        margin-top: 50px/2;
        .list-item {
          background: rgba(249, 249, 251, 1);
          border-radius: 14px/2;
          padding: 40px/2 30px/2 40px/2 12px/2;
          .list-item-div {
            display: flex;
            align-items: flex-start;
            font-size: 32px/2;
            font-weight: 500;
            color: rgba(48, 49, 51, 1);
            line-height: 46px/2;
            margin-bottom: 30px/2;
            img {
              width: 92px/2;
              height: 92px/2;
            }
          }
          .item-btn-div {
            display: flex;
            justify-content: flex-end;
            font-size: 24px/2;
            font-weight: 500;
            color: rgba(242, 104, 153, 1);
            line-height: 60px/2;
            .item-btn {
              width: 120px/2;
              text-align: center;
              height: 60px/2;
              border-radius: 10px/2;
              border: 2px/2 solid rgba(242, 104, 153, 1);
              background-color: #fff;
              margin-left: 20px/2;
            }
            .copy {
              width: 180px/2;
              height: 60px/2;
              background: rgba(242, 104, 153, 1);
              box-shadow: 0px 4px/2 12px/2 0px rgba(255, 134, 134, 0.3);
              border-radius: 10px/2;
              color: #fff;
            }
          }
        }
      }
      .forword {
        width: 630px/2;
        height: 90px/2;
        margin: 50px/2 0 20px/2 30px/2;
        background: rgba(242, 104, 153, 1);
        box-shadow: 0px 4px/2 12px/2 0px rgba(255, 134, 134, 0.3);
        border-radius: 10px/2;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px/2;
        color: #fff;
        .icon {
          width: 32px/2;
          height: 32px/2;
          margin-right: 20px/2;
        }
      }
    }
  }
}
.g-upload {
  max-width: 600px;
}
</style>
