<template>
  <div class="offline-activity">
    <el-form
      size="small"
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="主题" prop="categoryIds">
        <draggable-select
          v-model="form.categoryIds"
          multiple
          filterable
          remote
          class="block-input"
          size="small"
          placeholder="请输入主题名称"
          :remote-method="querySearchCategory"
        >
          <el-option
            v-for="item in categories"
            :key="item.categoryId"
            :value="item.categoryId"
            :label="item.categoryName"
          >
            <span style="float: left">{{ item.categoryName }}</span>
            <span style="float: right">{{ item.parentCategoryName }}</span>
          </el-option>
        </draggable-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input class="block-input" v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="标签" prop="labels">
        <select-option
          v-model="form.labels"
          multiple
          filterable
          remote
          class="block-input"
          size="small"
          placeholder="请输入标签名称"
          value-key="labelId"
          :remote-method="querySearchLabels"
        >
          <el-option
            v-for="item in label_list"
            :key="item.labelId"
            :value="item"
            :label="item.labelName"
          >
            <span style="float: left">{{ item.labelName }}</span>
            <span style="float: right">{{
              item.isShow ? '显性标签' : '隐性标签'
            }}</span>
          </el-option>
        </select-option>
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          class="block-input"
          type="textarea"
          v-model="form.describe"
        ></el-input>
      </el-form-item>

      <el-form-item label="是否可被搜索">
        <el-radio v-model="form.isSearch" :label="true">是</el-radio>
        <el-radio v-model="form.isSearch" :label="false">否</el-radio>
      </el-form-item>
      <el-form-item label="排序">
        <el-radio v-model="form.isTop" :label="true">置顶</el-radio>
        <el-radio v-model="form.isTop" :label="false">排序</el-radio>
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
      <el-form-item label="线下活动封面" prop="iconUrl" class="bg-img">
        <div>
          <el-button
            size="mini"
            type="primary"
            @click="
              handleUploadAndSelectResource('image/png, image/jpeg', null, {
                size: 200
              })
            "
            >上传</el-button
          >
          <el-input
            v-model="form.iconUrl"
            class="detailForm-iconUrl"
            size="small"
          ></el-input>
        </div>
        <div class="upload-file-item" v-if="form.iconUrl">
          <div class="upload-img-wrap">
            <el-image
              class="upload-item-img"
              :src="form.iconUrl"
              fit="cover"
            ></el-image>
            <label class="whispace upload-img-label">{{ form.iconUrl }}</label>
          </div>
          <label class="item-status-label">
            <i class="el-icon-upload-success el-icon-check"></i>
            <i class="el-icon-close del-item" @click="form.iconUrl = ''"></i>
          </label>
        </div>
        <p>
          *尺寸为300*300，大小不超过100kb
        </p>
      </el-form-item>
      <el-form-item label="素材内容">
        <tinymce v-model="form.richText"></tinymce>
      </el-form-item>
      <el-form-item label="资源列表">
        <el-button
          size="mini"
          type="primary"
          @click="handleUploadAndSelectResource('*', 'Image', {})"
          >上传</el-button
        >
        <div class="draggable-div">
          <draggable v-model="form.attachments" @change="draggableChange">
            <div
              v-for="(item, index) in form.attachments"
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
                  v-model="item.annexName"
                  placeholder="文件名"
                ></el-input>
                <div>
                  {{ item.annexUrl }}
                </div>
              </div>
              <i
                class="el-icon-delete del-item"
                @click="delItem(index, form.attachments)"
              ></i>
            </div>
          </draggable>
        </div>
      </el-form-item>

      <el-form-item label=" ">
        <el-button @click="handlePreview">预览</el-button>
        <el-button type="primary" @click="submit('form')">发布</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="previewDialog" @closed="previewUrl = ''">
      <img width="100%" v-if="isImage" :src="previewUrl" alt="" />
      <video
        v-else
        class="item-video"
        type="video/mp4"
        :muted="false"
        language="zh-CN"
        aspectRatio="16:9"
        playsinline
        preload="load"
        autoplay
        webkit-playsinline="webkit-playsinline"
        x-webkit-airplay="allow"
        controls
        width="80%"
        :src="previewUrl"
      ></video>
    </el-dialog>
    <el-drawer
      title="发布预览"
      custom-class="preview-dialog"
      :visible.sync="previewDetail"
      :with-header="false"
    >
      <div class="preview-detail">
        <div class="title">{{ previewData.title }}</div>
        <div class="subtitle">
          <span class="time">{{ formatNowDate() }}</span>
          <span class="heat"
            >人气：{{
              previewData.popularity ? previewData.popularity : 0
            }}</span
          >
        </div>
        <div class="introduce">
          <img
            class="introduce-icon"
            src="../../../images/library/introduce.png"
            alt=""
          />
          <span class="text">活动介绍</span>
        </div>
        <div class="content" v-html="previewData.richText"></div>
        <div class="resource-list">
          <div
            class="list-item"
            v-for="item in form.attachments"
            :key="item.id"
          >
            <div class="list-item-div">
              <img :src="formatUrl(item)" alt="" />
              <div class="climp">
                {{ item.annexName }}
              </div>
            </div>
            <div class="item-btn-div">
              <span class="item-btn">查看</span>
              <span class="item-btn">下载</span>
              <span class="item-btn copy">复制下载链接</span>
            </div>
          </div>
        </div>

        <div class="forword">
          <img class="icon" src="../../../images/library/forword.png" alt="" />
          <span>转发</span>
        </div>
      </div>
    </el-drawer>
    <upload-and-select-in-resource
      :uploadDialog="uploadDialog"
      :acceptType="acceptType"
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
import SelectOption from '@/components/select/select.vue'
import DraggableSelect from '@/components/dragSelect/index.vue'
import storage from 'good-storage'
import draggable from 'vuedraggable'
import {
  treeData2Arr,
  formatDate,
  checkImageSize,
  getImageSizeAsync
} from '@/utility/index.js'
import { uploadToResource } from '@/api/index.js'
import { getTags } from '@/api/library/tags.js'
import { categorySelect } from '@/api/library/category.js'
import { deepCopy, clones } from '../../../utility'
import {
  addActivity,
  updateActivity,
  getActivityDetail
} from '@/api/library/offlineActivity.js'
export default {
  components: {
    DraggableSelect,
    SelectOption,
    draggable,
    tinymce,
    uploadAndSelectInResource
  },
  mixins: [upload],
  data() {
    return {
      options: {
        disabledDate: date => {
          return date < new Date().getTime() - 1 * 24 * 60 * 60 * 1000
        }
      },
      previewDialog: false,
      previewUrl: '',
      previewDetail: false,
      isImage: true,
      form: {
        title: '',
        categoryIds: [],
        isTop: false,
        isInvalid: true,
        isSearch: true,
        labels: [],
        sort: 999,
        iconUrl: '',
        richText: '',
        attachments: []
      },
      rules: {
        categoryIds: [{ required: true, message: '必填项', trigger: 'blur' }],
        title: [{ required: true, message: '必填项', trigger: 'blur' }],
        labels: [{ required: true, message: '必填项', trigger: 'blur' }],
        iconUrl: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      iconUrlList: [],
      resourceList: [],
      categories: [],
      categoryList: [],
      fileList: [],
      label_list: [],
      labelList: [],
      publishDate: [],
      previewData: {},
      resourceFileList: [],
      uploadDialog: false,
      attachmentsUploadDialog: false,
      acceptType: 'image/png, image/jpeg',
      unacceptType: '',
      fileSize: { size: 200 }
    }
  },
  created() {
    categorySelect(3).then(res => {
      this.categoryList = res.categories
      this.categories = res.categories
    })
    this.getLabels()
    if (this.$route.query.id) {
      getActivityDetail(this.$route.query.id).then(res => {
        console.log(res)
        if (!res.attachments) {
          res.attachments = []
        }
        if (res.iconUrl) {
          this.iconUrlList = [
            {
              name: res.iconUrl,
              url: res.iconUrl
            }
          ]
        } else {
          this.iconUrlList = []
        }
        this.form = deepCopy(res)
        if (res.publishEndDate && res.publishStartDate) {
          this.publishDate = [res.publishStartDate, res.publishEndDate]
        }
      })
    }
  },
  methods: {
    handleUploadAndSelectResource(acceptType, unacceptType, fileSize) {
      this.acceptType = acceptType
      this.unacceptType = unacceptType
      this.fileSize = fileSize
      this.uploadDialog = true
    },
    async fileChange(file, fileList, name, list, item) {
      console.log(file.raw)
      let imgInfo
      if (name === 'iconUrl') {
        imgInfo = await getImageSizeAsync(file)
        console.log(imgInfo)
        if (!file || !checkImageSize(file, 200)) {
          this.$notify.error({
            title: 'Error',
            message: `尺寸为300*300，大小不超过200kb`,
            duration: 3000
          })
          return
        }
      } else {
        if (!file || file.raw.type.includes('image')) {
          this.$notify.error({
            title: 'Error',
            message: `资源附件不支持图片类型`,
            duration: 3000
          })
          return
        }
      }
      this.customUploadObjectKey(
        {
          file: file,
          fileList: fileList,
          fileUrl: name,
          fileArray: list,
          objectKey: 'LibraryResource'
        },
        url => {
          let fileType = url ? this.formatFileType(file) : ''
          switch (name) {
            case 'formResources':
              if (item) {
                item[name] = url
                item.annexName = item.annexName ? item.annexName : file.name
                item.annexType = fileType
              } else {
                this.form.attachments.push({
                  annexUrl: url,
                  annexName: file.name,
                  annexType: fileType
                })
              }
          }
          if (url) {
            this.uploadImageToResource(
              file.name.substring(0, file.name.lastIndexOf('.')),
              url,
              null,
              fileType
            )
          }
        }
      )
    },
    uploadImageToResource(name, url, property, type) {
      let moduleId
      let menus = storage.get('menus')
      moduleId = treeData2Arr(menus, 'subMenus').filter(
        o => o.path === '/library/offlineActivitys'
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
      if (this.acceptType === '*') {
        this.form.attachments.push({
          annexUrl: data.url,
          annexName: data.name,
          annexType: data.fileType
        })
      } else {
        this.form.iconUrl = data.url
        this.uploadImageToResource(data.name, data.url, data.fileInfo, 'Image')
      }
    },
    selectResource(data) {
      this.uploadDialog = false
      if (this.acceptType === '*') {
        this.form.attachments.push({
          annexUrl: data.url,
          annexName: data.name,
          annexType:
            data.resourceType.toLowerCase() === 'video'
              ? 'mp4'
              : data.resourceType.toLowerCase()
        })
        console.log(this.form.attachments)
      } else {
        this.form.iconUrl = data.url
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.isImage = true
      this.previewUrl = file.url
      this.previewDialog = true
    },
    preview(item, isImage) {
      this.isImage = isImage
      this.previewUrl = isImage ? item.coverUrl : item.resourceUrl
      this.previewDialog = true
    },
    draggableChange() {},
    del(item, isImage) {
      console.log(item)
      if (isImage) {
        item.image_url = ''
      } else {
        item.video_url = ''
        item.video_cover_url = ''
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
      if (item.annexType === 'image') {
        return item.annexUrl
      } else {
        switch (item.annexType) {
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
    querySearchCategory(queryString) {
      console.log(queryString)
      this.categories = this.categoryList.filter(o =>
        o.categoryName.includes(queryString)
      )
    },
    getLabels() {
      let param = {
        name: '',
        pageNo: 1,
        pageSize: 1000
      }
      getTags(param).then(res => {
        this.label_list = this.labelList = res.labels.map(o => ({
          labelId: o.id,
          labelName: o.labelName,
          isShow: o.labelType === 1 ? true : false
        }))
      })
    },
    querySearchLabels(queryString) {
      this.label_list = this.labelList.filter(o =>
        o.labelName.toLowerCase().includes(queryString.toLowerCase())
      )
    },
    handlePreview() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.previewData = deepCopy(this.form)
          console.log(this.previewData)
          this.resourceFileList = clones(this.resourceList)
          this.previewDetail = true
        } else {
          return false
        }
      })
    },
    formatNowDate() {
      return formatDate(new Date(), 'MM-DD HH:mm')
    },
    submit(form) {
      this.$refs[form].validate(async valid => {
        if (valid) {
          let data = {
            title: this.form.title,
            isSearch: this.form.isSearch,
            describe: this.form.describe,
            categoryIds: this.form.categoryIds,
            labels: this.form.labels,
            sort: this.form.sort,
            isTop: this.form.isTop,
            richText: this.form.richText,
            attachments: this.form.attachments,
            iconUrl: this.form.iconUrl
          }
          // let richText = structuredHtml(htmlSplitCustom(this.form.richText))

          if (this.publishDate && this.publishDate.length) {
            data.publishStartDate = this.publishDate
              ? this.publishDate[0]
              : null
            data.publishEndDate = this.publishDate ? this.publishDate[1] : null
          }
          console.log(data)
          if (this.$route.query.id) {
            updateActivity(this.$route.query.id, data).then(res => {
              console.log(res)
              this.$router.back()
            })
          } else {
            addActivity(data).then(res => {
              console.log(res)
              this.$router.back()
            })
          }
        } else {
          return false
        }
      })
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
.detailForm-iconUrl {
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
