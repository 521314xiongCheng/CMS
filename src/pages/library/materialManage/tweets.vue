<template>
  <div class="custom-tree-container">
    <el-row>
      <el-col :span="18">
        <el-form
          size="small"
          ref="materialForm"
          :model="form"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="内容编辑"></el-form-item>
          <el-form-item label="分类" prop="categoryIds">
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
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-input type="textarea" v-model="form.content"></el-input>
          </el-form-item>
          <el-form-item label="动态封面" prop="contentImageUrl">
            <div>
              <div
                class="avatar-uploader"
                @click="handleUpload('contentImageUrl')"
              >
                <img
                  v-if="form.contentImageUrl"
                  :src="form.contentImageUrl"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </div>
              <p>* 尺寸640*270，大小不超过200kb</p>
            </div>
          </el-form-item>
          <el-form-item label="列表页封面" prop="coverImageUrl">
            <div>
              <div
                class="avatar-uploader"
                @click="handleUpload('coverImageUrl')"
              >
                <img
                  v-if="form.coverImageUrl"
                  :src="form.coverImageUrl"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </div>
              <p>* 尺寸320*320，大小不超过200kb</p>
            </div>
          </el-form-item>
          <el-form-item label="素材内容">
            <tinymce v-model="form.richText" ref="tinymceNode"></tinymce>
          </el-form-item>
          <el-form-item label="评论">
            <el-input type="textarea" v-model="form.commentText"></el-input>
          </el-form-item>
          <el-form-item label="标签">
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
          <!-- <el-form-item label="隐藏音频播放">
            <el-switch
              v-model="form.autoPlay"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </el-form-item> -->
          <el-form-item label="发布管理">
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
          <el-form-item label="发布时间" prop="publishDate">
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
          <el-form-item class="text-right">
            <el-button @click="handlePreview">预览</el-button>
            <el-button type="primary" @click="submit('materialForm')"
              >发布</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-drawer
      title="发布预览"
      custom-class="preview-dialog"
      :visible.sync="previewDetail"
      :with-header="false"
    >
      <div class="preview-wrap">
        <div class="preview-view">
          <div class="item-detail">
            <div class="list-item">
              <div class="list-item-content">
                <div class="list-item-title">{{ previewData.title }}</div>
                <div class="list-item-header">
                  <div class="update-time-box">
                    <img
                      class="update-icon"
                      src="../../../images/library/update-icon.png"
                      alt=""
                    />
                    <span>更新于 {{ getNowDate() }}</span>
                  </div>
                  <div class="popularity">
                    <img
                      src="../../../images/library/popularity.png"
                      class="popularity-icon"
                      alt=""
                    />
                    <span>人气值</span>
                    <span>{{
                      previewData.popularity ? previewData.popularity : 0
                    }}</span>
                  </div>
                </div>
                <div class="article-voice">
                  <div class="article-voice-left">
                    <div class="article-voice-icon">
                      <img src="../../../images/voice-icon2.png" alt="" />
                    </div>
                    <p>朗读全文</p>
                  </div>
                  <div class="article-voice-action">
                    <div class="article-voice-play-btn">
                      <img src="../../../images/voice-play-icon.png" alt="" />
                    </div>
                  </div>
                </div>
                <div class="item-labels">
                  <span
                    class="label"
                    v-for="item in previewData.labels"
                    :key="item.id"
                    >{{ item.labelName }}</span
                  >
                </div>
                <div
                  class="article-content"
                  ref="articleContent"
                  v-html="previewData.richText"
                ></div>
                <div class="item-btn">
                  <span class="forword only">转发</span>
                </div>
                <div class="item-btn" v-if="previewData.commentText">
                  <img
                    class="comment"
                    src="../../../images/library/comment.png"
                    alt=""
                  />
                  <span class="comment-label">小编评论</span>
                  <span class="copy-comment">复制评论</span>
                </div>
                <div class="comment-content" v-if="previewData.commentText">
                  <span class="tri"></span>
                  <span class="climp">
                    {{ previewData.commentText }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
    <!-- 上传资源、检索资源库 -->
    <el-dialog
      :visible.sync="uploadDialog"
      width="370px"
      title="资源选择"
      class="upload-dialog"
      :close-on-click-modal="false"
    >
      <el-form size="small" label-width="100px" @submit.native.prevent>
        <el-form-item label="本地上传">
          <upload
            @change="
              (file, fileList) =>
                fileChange(
                  file,
                  fileList,
                  'contentImageUrl',
                  'coverImageList',
                  {
                    size: 200
                  }
                )
            "
            :multiple="false"
            :showFileList="false"
            btnName="上传"
            accept="image/png, image/jpeg"
          ></upload>
        </el-form-item>
        <el-form-item label="检索资料库">
          <el-input
            placeholder="请输入内容"
            @change="search"
            v-model="searchName"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
    <select-in-resource
      :findResourcesDialog="findResourcesDialog"
      :fileSize="{ size: 300 }"
      :resourceType="resourceType"
      :acceptType="acceptType"
      :queryName="queryName"
      @selectResource="selectResource"
      @closeUploadDialog="
        findResourcesDialog = false
        searchName = ''
      "
    ></select-in-resource>
  </div>
</template>

<script>
import Tinymce from '@/components/tinymce/index'
import Upload from '@/components/upload'
import upload from '@/mixins/upload.js'
import dialogForm from '@/mixins/dialogForm.js'
import DraggableSelect from '@/components/dragSelect/index.vue'
import SelectInResource from '@/components/selectInResources/selectInResource'
import SelectOption from '@/components/select/select.vue'
import storage from 'good-storage'
import {
  checkImageSize,
  getImageSizeAsync,
  treeData2Arr
} from '@/utility/index.js'
import { uploadToResource } from '@/api/index.js'
import { getProducts } from '@/api/product/products.js'
import { getTags } from '@/api/library/tags.js'
import { categorySelect } from '@/api/library/category.js'
import {
  addContent,
  updateContent,
  getContentDetail,
  getTts
} from '@/api/library/material.js'
import { deepCopy, thumbImage, formatDate } from '../../../utility'
export default {
  components: {
    SelectOption,
    DraggableSelect,
    Upload,
    Tinymce,
    SelectInResource
  },
  mixins: [dialogForm, upload],
  data() {
    let validatorCoverImageUrl = (rule, value, callback) => {
      if (!this.form.contentImageUrl) {
        callback(new Error('必填项'))
      }
      callback()
    }
    let validatorPublishDate = (rule, value, callback) => {
      // eslint-disable-next-line no-useless-escape
      if (!this.publishDate || !this.publishDate.length) {
        callback(new Error('请选择发布时间'))
      }
      callback()
    }
    return {
      options: {
        disabledDate: date => {
          return date < new Date().getTime() - 1 * 24 * 60 * 60 * 1000
        }
      },
      form: {
        title: '',
        content: '',
        categoryIds: [],
        labels: [],
        commentText: '',
        contentImageUrl: '',
        coverImageUrl: '',
        contentType: 5,
        sort: 999,
        isTop: false,
        richText: ''
      },
      rules: {
        categoryIds: [{ required: true, message: '必填项', trigger: 'blur' }],
        title: [
          { required: true, message: '必填项', trigger: 'blur' },
          {
            max: 30,
            message: '标题长度限制30个字以内',
            trigger: 'blur'
          }
        ],
        content: [{ required: true, message: '必填项', trigger: 'blur' }],
        contentImageUrl: [
          { validator: validatorCoverImageUrl, trigger: 'blur' }
        ],
        publishDate: [
          {
            validator: validatorPublishDate,
            trigger: 'blur'
          }
        ]
      },
      publishDate: [],
      categories: [],
      categoryList: [],
      label_list: [],
      labelList: [],
      fileList: [],
      imageList: [],
      coverImageList: [],
      videoList: [],
      searchProducts: [],
      previewDetail: false,
      previewData: { video: {} },
      uploadDialog: false,
      searchName: '',
      uploadType: '',
      findResourcesDialog: false,
      findResourceForm: {
        name: '',
        updateBy: '',
        resourceType: 'Image'
      },
      resourceTableData: {
        data: [],
        pageData: {
          pageSize: 20,
          pageNo: 1,
          totalCount: 0
        }
      },
      showAddResourceDialog: false,
      resourceUrlList: [],
      addResourceForm: {
        name: '',
        url: '',
        resourceType: '',
        client: 'BackEnd'
      },
      // 存储上传资源信息，用于插入富文本
      uploadFileInfo: {},
      loadinginstace: null,
      needLoadingRequestCount: 0,
      queryName: '',
      acceptType: 'image',
      resourceType: 'image'
    }
  },
  async created() {
    this.getLabels()
    this.getCategories()
    if (this.$route.query.id) {
      getContentDetail(this.$route.query.id).then(res => {
        if (!res.image) {
          res.image = []
        }
        this.form = deepCopy(res)
        console.log(this.form)
        if (res.publishEndDate && res.publishStartDate) {
          this.publishDate = [res.publishStartDate, res.publishEndDate]
        }
      })
    }
  },
  methods: {
    showFullScreenLoading() {
      if (this.needLoadingRequestCount === 0) {
        this.loadinginstace = this.$loading({
          target: '.el-main',
          text: 'loding……',
          background: 'rgba(0, 0, 0, 0.8)',
          spinner: 'el-icon-loading',
          body: true
        })
      }
      this.needLoadingRequestCount++
    },
    tryHideFullScreenLoading() {
      if (this.needLoadingRequestCount <= 0) return
      this.needLoadingRequestCount--
      if (this.needLoadingRequestCount === 0) {
        this.loadinginstace.close()
      }
    },
    handleUpload(type) {
      this.uploadType = type
      this.uploadDialog = true
    },
    search() {
      this.queryName = this.searchName
      this.findResourcesDialog = true
    },
    selectResource(data) {
      this.form[this.uploadType] = data.url
      this.findResourcesDialog = false
      this.uploadDialog = false
      this.searchName = ''
    },
    getNowDate() {
      return formatDate(new Date(), 'YYYY-MM-DD')
    },
    getCategories() {
      categorySelect(1).then(res => {
        this.categoryList = res.categories
        this.categories = res.categories
      })
    },
    async fileChange(file, fileList, name, list, fileSize) {
      if (file) {
        if (!file.raw.type.includes('image')) {
          this.$notify.error({
            title: 'Error',
            message: `请上传图片类型文件`,
            duration: 3000
          })
          return
        } else {
          let imgInfo = await getImageSizeAsync(file)
          if (!checkImageSize(file, fileSize.size)) {
            this.$notify.error({
              title: 'Error',
              message: `大小不超过${fileSize.size}kb`,
              duration: 3000
            })
            this[list].pop()
            return
          } else {
            name = this.uploadType
            this.customUploadObjectKey(
              {
                file: file,
                fileList: fileList,
                fileUrl: name,
                fileArray: list || 'fileList',
                objectKey: 'LibraryResource'
              },
              url => {
                this.uploadDialog = false
                if (url) {
                  this.uploadImageToResource(
                    file.name.substring(0, file.name.lastIndexOf('.')),
                    url,
                    'Image',
                    imgInfo
                  )
                }
              }
            )
          }
        }
      }
    },
    uploadImageToResource(name, url, resourceType, property) {
      let moduleId
      let menus = storage.get('menus')
      moduleId = treeData2Arr(menus, 'subMenus').filter(
        o => o.path === '/library/materialManage'
      )[0].id
      let data = {
        name: name,
        moduleId: moduleId,
        url: url,
        resourceType: resourceType,
        property: property,
        client: 'BackEnd'
      }
      console.log(data)
      uploadToResource(data)
    },

    querySearchAsync(queryString) {
      console.log(queryString)
      if (!queryString) return
      let param = {
        is_return_sku_all_field: true
      }
      let reg = /^[0-9]*$/
      if (reg.test(queryString)) {
        param.skus = queryString
      } else {
        param.name = queryString
      }
      getProducts(param).then(res => {
        console.log(res.results.list)
        this.searchProducts = res.results.list
      })
    },
    querySearchCategory(queryString) {
      console.log(queryString)
      this.categories = this.categoryList.filter(o =>
        o.categoryName.toLowerCase().includes(queryString.toLowerCase())
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
          isShow: o.isShow
        }))
      })
    },
    querySearchLabels(queryString) {
      this.label_list = this.labelList.filter(o =>
        o.labelName.toLowerCase().includes(queryString.toLowerCase())
      )
    },
    handlePreview() {
      this.$refs.materialForm.validate(valid => {
        if (valid) {
          this.previewData = deepCopy(this.form)
          this.previewData.labels = this.previewData.labels.splice(0, 3)
          this.previewDetail = true
        } else {
          return false
        }
      })
    },
    submit(form) {
      this.$refs[form].validate(async valid => {
        if (valid) {
          this.showFullScreenLoading()
          try {
            let text = this.$refs.tinymceNode.editor
              .getContent({
                format: 'text'
              })
              .trim()
            let data = {
              title: this.form.title,
              content: this.form.content,
              commentText: this.form.commentText,
              categoryIds: this.form.categoryIds,
              labels: this.form.labels,
              contentType: this.form.contentType,
              sort: this.form.sort,
              isTop: this.form.isTop,
              contentImageUrl: this.form.contentImageUrl,
              richText: this.form.richText,
              audio: []
            }
            if (text) {
              let audioUrl = await getTts(text)
              this.uploadImageToResource(this.form.title, audioUrl, 'Audio', {})
              data.audio.push(audioUrl)
            }
            console.log(data)
            if (this.form.coverImageUrl) {
              data.coverImageUrl = this.form.coverImageUrl
            } else {
              data.coverImageUrl = thumbImage(
                this.form.contentImageUrl,
                320,
                320
              )
            }
            if (this.publishDate && this.publishDate.length) {
              data.publishStartDate = this.publishDate
                ? this.publishDate[0]
                : null
              data.publishEndDate = this.publishDate
                ? this.publishDate[1]
                : null
            }
            console.log(data)
            if (this.$route.query.id) {
              updateContent(this.$route.query.id, data).then(res => {
                console.log(res)
                this.tryHideFullScreenLoading()
                this.$router.back()
              })
            } else {
              addContent(data).then(res => {
                console.log(res)
                this.tryHideFullScreenLoading()
                this.$router.back()
              })
            }
          } catch (error) {
            this.tryHideFullScreenLoading()
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
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.custom-tree-container {
  .handle-list {
    margin-bottom: 10px;
    /deep/ .el-button + .el-button {
      margin-left: 15px;
    }
  }
  .title {
    height: 40px;
    line-height: 40px;
  }
  .tree-node {
    height: 78vh;
    overflow: hidden;
    overflow-y: scroll;
    border: 1px solid #dcdfe6;
    padding: 5px;
  }
  .item-detail {
    margin: 0 auto;
    width: 750px/2;
    background-color: #fff;
    min-height: 1338px/2;
  }
  /deep/ .editor-dialog {
    max-height: 80vh;
    overflow: hidden;
    overflow-y: scroll;
  }
  .form-style {
    border: 1px solid #dcdfe6;
    margin-bottom: 10px;
    padding: 10px;
  }
}

.list-item {
  // margin: 0 auto;
  // width: 698px/2;
  // margin-bottom: 20px;
  // border-radius: 14px/2;
  padding: 30px/2;
  background-color: #fff;
  box-sizing: border-box;
  .list-item-content {
    .list-item-title {
      color: #000;
      font-size: 36px/2;
      line-height: 50px/2;
      margin-bottom: 20px/2;
    }
    .list-item-header {
      display: flex;
      justify-content: space-between;
      font-size: 24px/2;
      text-align: center;
      .update-time-box {
        display: flex;
        align-items: center;
      }
      .update-icon {
        widows: 28px/2;
        height: 28px/2;
        margin-right: 12px/2;
      }
      .popularity {
        display: flex;
        align-items: center;
        color: #606266;
        .popularity-icon {
          width: 22px/2;
          height: 27px/2;
          margin-right: 12px/2;
        }
      }
    }
    .article {
      &-voice {
        margin-top: 32px/2;
        width: 100%;
        height: 100px/2;
        background: #f9f9fb;
        border-radius: 14px/2;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &-icon {
          width: 64px/2;
          height: 64px/2;
          margin-right: 16px/2;
          img {
            width: 100%;
            height: 100%;
          }
        }
        &-left {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding-left: 25px/2;
          p {
            font-size: 28px/2;
            color: #606266;
          }
        }
        &-play-btn,
        &-stop-btn {
          width: 50px/2;
          height: 50px/2;
          margin-right: 20px/2;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      &-content {
        margin-top: 15px/2;
        /deep/ p {
          color: #303133;
          line-height: 40px/2;
          font-size: 30px/2;
          line-height: 46px/2;
          margin: 0;
        }
        /deep/img {
          width: 100%;
          border-radius: 13px/2;
          content: initial;
          height: auto;
        }
        /deep/ video {
          width: 100%;
          height: auto;
        }
        /deep/.video-wrapper {
          position: relative;
          font-size: 0;
          line-height: 0;
          margin: 20px/2 0;
          border-radius: 13px/2;
          overflow: hidden;
        }
        /deep/ .video-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          .video-bg__action {
            width: 16%;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -8%;
            margin-top: -8%;
          }
          .video-length {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 90px/2;
            padding-right: 25px/2;
            line-height: 105px/2;
            color: #fff;
            text-align: right;
            font-size: 24px/2;
            background: linear-gradient(
              180deg,
              rgba(0, 0, 0, 0) 0%,
              rgba(0, 0, 0, 0.6) 100%
            );
            border-radius: 0px 0px 9px/2 9px/2;
          }
        }
        /deep/ blockquote {
          border-left: 5px/2 solid #b5b5b5;
          background-color: #f7f7f7;
          color: #444444;
          padding: 1.5rem 1.1875rem;
          margin: 0.9375rem 0;
        }
        /deep/ ul {
          padding-left: 40px/2;
          list-style-type: disc;
        }
        /deep/ ol {
          padding-left: 40px/2;
          list-style-type: decimal;
        }
        /deep/ h1,
        /deep/ h2,
        /deep/ h3,
        /deep/ h4,
        /deep/ h5,
        /deep/ h6 {
          margin: 15px/2 0;
        }
        /*音频播放器*/
        /deep/.audio-play {
          // margin-top: 2.49rem;
          width: 100%;
          // height: 100px;
          box-sizing: border-box;
          border-radius: 14px/2;
          padding: 18px/2 25px/2;
          background-color: #f9f9fb;
          align-items: center;
          display: flex;
          p {
            margin-left: 20px/2;
            color: #606266;
            line-height: 1;
            font-size: 26px/2;
          }
          .audio-icon {
            width: 64px/2;
            height: 64px/2;
          }
          .audio-action {
            position: absolute;
            // margin-top: 20px;
            right: 50px/2;
            width: 64px/2;
            height: 64px/2;
          }
          .audio-slide {
            display: inline-flex;
            align-items: center;
            margin-top: 12px/2;
            margin-left: 20px/2;
            span {
              color: #606266;
              font-size: 20px/2;
              line-height: 1;
            }
          }
          .slide_box {
            margin: 0 10px/2;
            width: 300px/2;
            height: 20px/2;
            position: relative;
          }
          .slide_wire {
            width: 300px/2;
            height: 4px/2;
            /* position:absolute; */
            left: 50%;
            top: 50%;
            margin-top: 8px/2;
            background-color: #dcdce4;
          }
          .slide_piece {
            width: 8px/2;
            height: 8px/2;
            border-radius: 9px/2;
            position: absolute;
            left: 0;
            top: 3px/2;
            margin-top: 0;
            background-color: #ffffff;
            border: 5px/2 solid #f26899;
            z-index: 1;
          }
          .slide_color {
            width: 0;
            height: 4px/2;
            margin-top: 8px/2;
            background-color: #f26899;
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      }
    }
    .item-title {
      font-size: 30px/2;
      line-height: 42px/2;
      color: #303133;
      margin-top: 20px/2;
      .article-log {
        vertical-align: middle;
        padding: 5px/2 10px/2;
        font-size: 22px/2;
        color: #fff;
        background-color: #f26899;
        border-radius: 4px/2;
      }
    }
    .item-content {
      font-size: 26px/2;
      line-height: 36px/2;
      color: #606266;
      margin-bottom: 25px/2;
    }
    .item-labels {
      font-size: 20px/2;
      color: rgba(255, 255, 255, 1);
      line-height: 20px/2;
      margin-top: 40px/2;
      .label {
        padding: 10px/2 20px/2;
        display: inline-block;
        margin-right: 10px/2;
        background: linear-gradient(
          90deg,
          rgba(177, 161, 195, 1) 0%,
          rgba(160, 124, 173, 1) 100%
        );
        border-radius: 6px/2;
      }
    }
    .item-btn {
      font-size: 24px/2;
      line-height: 60px/2;
      height: 60px/2;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      position: relative;
      span {
        text-align: center;
        display: inline-block;
        width: 196px/2;
        color: #6e9ec5;
        border-radius: 30px/2;
      }
      .copy {
        background: #f4fafe;
      }
      .download {
        background-color: #fef4f5;
      }
      .comment {
        width: 16px;
        height: 12px;
      }
      .comment-label {
        font-size: 24px/2;
        color: #303133;
        font-weight: bold;
        position: absolute;
        left: -18px;
      }
      .forword {
        background-color: #ffeff5;
        color: #f26899;
      }
      .only {
        width: 690px/2;
      }
      .copy-comment {
        width: 128px/2;
        height: 46px/2;
        border-radius: 36px/2;
        color: #fff;
        font-size: 22px/2;
        line-height: 46px/2;
        background-color: #f26899;
      }
    }
    .list-item-resourse {
      margin-bottom: 10px;
      .list-item-img {
        width: 208.97px/2;
        height: 209.89px/2;
        border-radius: 4px;
        display: block;
        margin: 5px/2 0;
      }
      .cover-image-url {
        width: 638px/2;
        height: 273px/2;
      }
    }
    .comment-content {
      margin-top: -10px;
      width: 598px/2;
      height: 80px/2;
      background: rgba(245, 244, 245, 1);
      border-radius: 0 14px/2 14px/2 14px/2;
      padding: 15px/2 20px/2;
      font-size: 26px/2;
      line-height: 36px/2;
      position: relative;
      .tri {
        position: absolute;
        top: -20px/2;
        left: 0;
        border-right: 10px/2 dashed transparent;
        border-top: 10px/2 dashed transparent;
        border-bottom: 10px/2 solid rgba(245, 244, 245, 1);
      }
    }
    .handle-btn {
      display: flex;
      justify-content: center;
    }
  }
}
.draggable-div {
  // width: 600px;
  display: flex;
  .file-list {
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 8px;
    align-items: center;
    position: relative;
    margin-bottom: 10px;
    margin-right: 10px;
    .file-item {
      .img-wrap {
        width: 80px;
        height: 80px;
        position: relative;
        overflow: hidden;
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
        .item-img {
          width: 100%;
          height: 100%;
        }
        .del-item {
          display: none;
          transform: rotate(-45deg);
          color: #fff;
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
    }
    .del-item {
      font-size: 12px;
      margin-top: 11px;
      cursor: pointer;
    }
  }
}
.avatar-uploader {
  display: inline-block;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  width: 80px;
  height: 80px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  margin: 0 auto;
  display: block;
}
.video-upload {
  width: 160px;
  height: 90px;
  .avatar-uploader-icon {
    line-height: 90px;
  }
  .avatar {
    width: 160px;
    height: 90px;
  }
}
.block-input {
  width: 100%;
}
/deep/.preview-dialog {
  background-color: #f5f4f5;
  width: 400px !important;
  .el-drawer__body {
    overflow-y: auto;
    position: relative;
    .preview-wrap {
      position: absolute;
      top: -240px/2;
      background-image: url('../../../images/preview-bg.png');
      background-size: 100% 100%;
      width: 750px/2;
      padding: 180px/2 30px/2 240px/2 30px/2;
      box-sizing: content-box;
      transform: scale(0.65);
      .preview-view {
        height: 1338px/2;
        overflow-y: scroll;
      }
    }
  }
}
</style>
