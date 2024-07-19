<template>
  <div class="online-activity">
    <el-form
      size="small"
      label-width="100px"
      ref="form"
      :model="form"
      :rules="rules"
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
      <el-form-item label="素材内容" prop="resources">
        <div>
          <el-button
            type="primary"
            plain
            @click="addItem(form.resources.length, 'text')"
            >文本</el-button
          >
          <el-button
            type="primary"
            plain
            @click="addItem(form.resources.length, 'image')"
            >图片</el-button
          >
          <el-button
            type="primary"
            plain
            @click="addItem(form.resources.length, 'video')"
            >视频</el-button
          >
        </div>
        <div class="content-list">
          <!-- class="content-item" -->
          <draggable v-model="form.resources">
            <el-row
              class="content-item"
              :gutter="20"
              v-for="(item, index) in form.resources"
              :key="item.id"
            >
              <el-col :span="4" class="item-header">
                <span>类型：{{ formatValue(item.resourceType) }}</span>
                <span>序号：{{ index + 1 }}</span>
              </el-col>
              <el-col :span="18" class="item-content">
                <div v-if="item.resourceType === 'text'">
                  <el-input
                    :rows="3"
                    type="textarea"
                    v-model="item.context"
                  ></el-input>
                  <div
                    style="margin-top:10px;"
                    v-for="(remark, idx) in item.remarks"
                    :key="idx"
                  >
                    <el-input placeholder="添加备注" v-model="remark.text"
                      ><el-button
                        slot="append"
                        icon="el-icon-delete"
                        @click="removeRemark(item.remarks, idx)"
                      ></el-button
                    ></el-input>
                  </div>
                </div>
                <div v-if="item.resourceType === 'image'">
                  <el-image
                    class="item-img"
                    :src="item.resourceUrl"
                    @click="preview(item, true)"
                    fit="cover"
                  ></el-image>
                  <div
                    style="margin-top:10px;"
                    v-for="(remark, idx) in item.remarks"
                    :key="idx"
                  >
                    <el-input placeholder="添加备注" v-model="remark.text"
                      ><el-button
                        slot="append"
                        icon="el-icon-delete"
                        @click="removeRemark(item.remarks, idx)"
                      ></el-button
                    ></el-input>
                  </div>
                </div>
                <div v-if="item.resourceType === 'video'">
                  <el-input
                    v-model="item.fileName"
                    style="width:300px;"
                    placeholder="请输入视频名称"
                  ></el-input>
                  <div class="file-list">
                    <el-image
                      class="item-img"
                      :src="item.coverUrl"
                      fit="cover"
                    ></el-image>
                    <div class="box-mask" @click="preview(item, false)">
                      <i class="el-icon-video-play"></i>
                    </div>
                  </div>
                  <div
                    style="margin-top:10px;"
                    v-for="(remark, idx) in item.remarks"
                    :key="idx"
                  >
                    <el-input placeholder="添加备注" v-model="remark.text"
                      ><el-button
                        slot="append"
                        icon="el-icon-delete"
                        @click="removeRemark(item.remarks, idx)"
                      ></el-button
                    ></el-input>
                  </div>
                </div>
              </el-col>
              <el-col :span="2">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-top"
                  :disabled="index === 0"
                  @click="sortTo(index, 'top')"
                  plain
                ></el-button
                ><br />
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-close"
                  @click="remove(index)"
                  plain
                ></el-button
                ><br />
                <el-popover
                  placement="right"
                  trigger="hover"
                  popper-class="el-popover-class"
                  v-model="item.visible"
                >
                  <ul class="el-scrollbar__view el-select-dropdown__list">
                    <li
                      class="el-select-dropdown__item"
                      @click="addItem(index + 1, 'text')"
                    >
                      文本
                    </li>
                    <li
                      class="el-select-dropdown__item"
                      @click="addItem(index + 1, 'image')"
                    >
                      图片
                    </li>
                    <li
                      class="el-select-dropdown__item"
                      @click="addItem(index + 1, 'video')"
                    >
                      视频
                    </li>
                    <li
                      class="el-select-dropdown__item"
                      @click="addItem(index, 'remark')"
                    >
                      备注
                    </li>
                  </ul>
                  <el-button
                    size="mini"
                    type="primary"
                    slot="reference"
                    icon="el-icon-plus"
                    plain
                  ></el-button>
                </el-popover>
                <br />
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-bottom"
                  :disabled="index === form.resources.length - 1"
                  @click="sortTo(index, 'bottom')"
                  plain
                ></el-button>
              </el-col>
            </el-row>
          </draggable>
        </div>
      </el-form-item>

      <el-form-item label=" ">
        <el-button @click="handlePreview">预览</el-button>
        <el-button type="primary" @click="submit('form')">发布</el-button>
      </el-form-item>
    </el-form>
    <!-- 图片视频预览 -->
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
        :poster="previewPoster"
        :src="previewUrl"
      ></video>
    </el-dialog>
    <!-- 发布预览 -->
    <el-drawer
      title="发布预览"
      custom-class="preview-dialog"
      :visible.sync="previewDetail"
      :with-header="false"
    >
      <div class="preview-detail">
        <div class="preview-header">
          <div class="title">{{ previewData.title }}</div>
          <div class="subtitle">
            {{ previewData.desc }}
          </div>
          <div class="introduce">
            <img
              class="introduce-icon"
              src="../../../images/library/onlineIntroduce.png"
              alt=""
            />
            共{{ previewData.resources.length }}项素材，文字{{
              previewData.typeTextNum
            }}项，图片{{ previewData.typeImageNum }}项，视频{{
              previewData.typeVideoNum
            }}项，请依次逐步分享到微信中
          </div>
        </div>
        <el-timeline class="resource-list">
          <el-timeline-item
            v-for="(item, index) in previewData.resources"
            :key="index"
            :icon="item.icon"
            :type="item.type"
            :color="item.color"
            size="large"
            hide-timestamp
          >
            <div slot="dot" class="time-line-dot">{{ index + 1 }}</div>
            <div class="list-item">
              <div class="item-title">
                <img :src="formatIcon(item.resourceType)" alt="" />
                <span>{{ formatValue(item.resourceType) }}</span>
              </div>
              <div class="item-content">
                <div v-if="item.resourceType === 'text'" class="content-text">
                  {{ item.context }}
                </div>
                <div v-if="item.resourceType === 'video'" class="content-video">
                  <img src="../../../images/library/video-preview.png" alt="" />
                  <div>{{ item.fileName }}</div>
                </div>
                <div v-if="item.resourceType === 'image'" class="content-image">
                  <img :src="item.resourceUrl" alt="" />
                </div>
              </div>
              <div class="item-btn-div">
                <span class="item-btn" v-if="item.resourceType === 'text'"
                  >复制到剪贴板</span
                >
                <span
                  class="item-btn"
                  v-if="
                    item.resourceType === 'image' ||
                      item.resourceType === 'video'
                  "
                  >下载到本地</span
                >
                <span
                  class="item-btn copy"
                  v-if="
                    item.resourceType === 'image' ||
                      item.resourceType === 'text'
                  "
                  >分享到微信</span
                >
              </div>
              <div v-for="(remark, idx) in item.remarks" :key="idx">
                <div
                  class="online-activity-detail__steps-item-remark"
                  v-if="remark.text"
                >
                  <div class="steps-item-remark-circle"></div>
                  <div
                    class="online-activity-detail__steps-item-title remark-title"
                  >
                    <div class="title-icon">
                      <img src="../../../images/library/remark.png" alt="" />
                    </div>
                    <span>备注</span>
                  </div>
                  <div class="item-content" style="margin-top:15px;">
                    <div class="content-text">
                      {{ remark.text }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-drawer>
    <!-- 上传资源、检索资源库 -->
    <el-dialog
      :visible.sync="uploadDialog"
      width="570px"
      title="资源选择"
      class="upload-dialog"
      :before-close="beforeClose"
      :close-on-click-modal="false"
    >
      <el-form
        size="small"
        ref="uploadForm"
        :model="uploadForm"
        label-width="100px"
        :rules="uploadRules"
      >
        <el-form-item
          label="本地上传"
          style="position:relative;"
          prop="resourceUrl"
        >
          <upload
            v-show="uploadType === 'image'"
            @change="
              (file, fileList) =>
                fileChange(file, fileList, 'resourceUrl', 'fileList')
            "
            :showFileList="false"
            multiple
            btnName="上传图片"
            accept="image/png, image/jpeg"
          ></upload>
          <upload
            v-show="uploadType === 'video'"
            @change="
              (file, fileList) =>
                fileChange(file, fileList, 'resourceUrl', 'resourceUrlList')
            "
            :multiple="false"
            btnName="上传视频"
            :show-file-list="false"
            accept="video/*"
          ></upload>
          <el-input
            v-model="uploadForm.resourceUrl"
            readonly
            class="upload-input-img-url"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="检索资料库">
          <el-input
            placeholder="请输入内容"
            v-model="videoSearchName"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search('resourceUrl')"
            ></el-button>
          </el-input>
        </el-form-item>
        <el-form-item
          label="本地上传"
          v-show="uploadType === 'video'"
          prop="coverUrl"
        >
          <upload
            @change="
              (file, fileList) =>
                fileChange(file, fileList, 'coverUrl', 'coverUrlList')
            "
            :multiple="false"
            :showFileList="false"
            btnName="视频封面"
            accept="image/png, image/jpeg"
          ></upload>
          <el-input
            v-model="uploadForm.coverUrl"
            readonly
            class="upload-input-img-url"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="检索资料库" v-if="uploadType === 'video'">
          <el-input
            placeholder="请输入内容"
            v-model="searchName"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search('coverUrl')"
            ></el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button @click="handleUploadCancel('uploadForm')" size="small"
          >取消</el-button
        >
        <el-button
          type="primary"
          @click="handleUploadConfirm('uploadForm')"
          size="small"
          >确认</el-button
        >
      </div>
    </el-dialog>
    <select-in-resource
      :findResourcesDialog="findResourcesDialog"
      :fileSize="{ size: 300 }"
      :resourceType="resourceType"
      :acceptType="acceptType"
      :queryName="queryName"
      @selectResource="selectResource"
      @closeUploadDialog="findResourcesDialog = false"
    ></select-in-resource>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import SelectOption from '@/components/select/select.vue'
import Upload from '@/components/upload'
import upload from '@/mixins/upload.js'
import DraggableSelect from '@/components/dragSelect/index.vue'
import SelectInResource from '@/components/selectInResources/selectInResource'
import Http from '@/api/http'
import storage from 'good-storage'
import {
  checkImageSize,
  treeData2Arr,
  deepCopy,
  getImageSizeAsync,
  getVideoInfoAsync,
  oneOf
} from '@/utility'
import { uploadToResource } from '@/api'
import { getTags } from '@/api/library/tags.js'
import { categorySelect } from '@/api/library/category.js'
import {
  addCourse,
  updateCourse,
  getCourseDetail
} from '@/api/library/onlineActivity.js'
export default {
  components: {
    DraggableSelect,
    SelectOption,
    Upload,
    draggable,
    SelectInResource
  },
  mixins: [upload],
  data() {
    let validatorResources = (rule, value, callback) => {
      if (this.form.resources && this.form.resources.length) {
        this.form.resources.forEach(o => {
          switch (o.resourceType) {
            case 'text':
              if (!o.context) {
                return callback(new Error('请完善素材'))
              }
              break
            case 'image':
              if (!o.resourceUrl) {
                return callback(new Error('请完善素材'))
              }
              break
            case 'video':
              if (!o.resourceUrl || !o.coverUrl || !o.fileName) {
                return callback(new Error('请完善素材'))
              }
              break
          }
        })
        callback()
      } else {
        callback(new Error('请添加素材'))
      }
    }
    return {
      options: {
        disabledDate: date => {
          return date < new Date().getTime() - 1 * 24 * 60 * 60 * 1000
        }
      },
      resourceList: [],
      previewDetail: false,
      previewDialog: false,
      isImage: true,
      previewUrl: '',
      previewPoster: '',
      form: {
        categoryIds: [],
        isTop: false,
        isInvalid: true,
        isSearch: true,
        labels: [],
        describe: '',
        sort: 999,
        resources: []
      },
      rules: {
        categoryIds: [{ required: true, message: '必填项', trigger: 'blur' }],
        title: [
          { required: true, message: '必填项', trigger: 'blur' },
          {
            max: 50,
            message: '标题长度限制50个字以内',
            trigger: 'blur'
          }
        ],
        labels: [{ required: true, message: '必填项', trigger: 'blur' }],
        resources: [{ validator: validatorResources, trigger: 'blur' }]
      },
      uploadRules: {
        resourceUrl: [
          { required: true, message: '请上传或选择资源', trigger: 'blur' }
        ],
        coverUrl: [
          { required: true, message: '请上传或选择资源', trigger: 'blur' }
        ]
      },
      categories: [],
      categoryList: [],
      fileList: [],
      label_list: [],
      labelList: [],
      publishDate: [],
      previewData: {
        resources: []
      },
      uploadDialog: false,
      uploadForm: {
        resourceUrl: '',
        coverUrl: ''
      },
      searchName: '',
      videoSearchName: '',
      uploadType: 1,
      findResourcesDialog: false,
      findResourceForm: {
        name: '',
        updateBy: ''
      },
      resourceTableData: {
        data: [],
        pageData: {
          pageSize: 10,
          pageNo: 1,
          totalCount: 0
        }
      },
      currentItem: {},
      formName: '',
      queryName: '',
      acceptType: 'image',
      resourceType: 'image'
    }
  },
  created() {
    categorySelect(2).then(res => {
      this.categoryList = res.categories
      this.categories = res.categories
    })
    this.getLabels()
    if (this.$route.query.id) {
      getCourseDetail(this.$route.query.id).then(res => {
        console.log(res)
        if (!res.resources) {
          res.resources = []
        } else {
          res.resources = res.resources.map(o => {
            if (o.resourceType === 'image' && o.resourceUrl) {
              o.fileList = [
                {
                  name: o.resourceUrl,
                  url: o.resourceUrl
                }
              ]
            }
            if (!o.remarks) {
              o.remarks = []
            }
            return o
          })
        }
        this.form = deepCopy(res)
        if (res.publishEndDate && res.publishStartDate) {
          this.publishDate = [res.publishStartDate, res.publishEndDate]
        }
      })
    }
  },
  methods: {
    handleUpload(type) {
      /*
        *type
        1：图片资源
        2：视频资源
        3：图片封面
        4：视频封面
      */
      console.log(type)
      this.uploadType = type
      this.uploadDialog = true
    },
    chooseResourcePageFn(pageNo) {
      this.resourceTableData.pageData.pageNo = pageNo
      this.getResourcesList(pageNo)
    },
    getResourcesList(pageNo) {
      const { pageData } = this.resourceTableData
      pageNo = pageNo || pageData.pageNo
      this.resourceTableData.pageData.pageNo = pageNo

      Http({
        url: 'system/resources',
        params: {
          pageSize: pageData.pageSize,
          pageNo,
          ...this.findResourceForm
        }
      }).then(res => {
        this.resourceTableData.data = res['resources']
        if (res.totalCount) {
          this.resourceTableData.pageData.totalCount = res.totalCount
        }
        // this.$refs.searchTable.clearSelection()
        this.resourceTableData.data.forEach(o => {
          if (this.uploadType === 1) {
            if (oneOf(o.url, this.form.image)) {
              console.log(o)
              this.$refs.searchTable.toggleRowSelection(o, true)
            }
          }
          if (this.uploadType === 2) {
            if (o.url === this.form.video.videoUrl) {
              this.$refs.searchTable.toggleRowSelection(o, true)
            }
          }
          if (this.uploadType === 3 || this.uploadType === 4) {
            if (o.url === this.form.coverImageUrl) {
              this.$refs.tableList.$refs.table.toggleRowSelection(o, true)
            }
          }
        })
      })
    },
    search(name) {
      this.formName = name
      this.queryName = this.searchName
      if (this.uploadType === 'video' && name === 'resourceUrl') {
        this.queryName = this.videoSearchName
        this.acceptType = 'video'
        this.resourceType = 'video'
      } else {
        this.acceptType = 'image'
        this.resourceType = 'image'
      }
      this.findResourcesDialog = true
    },
    selectionChange(selection) {
      if (selection.length > 1) {
        this.$refs.searchTable.clearSelection()
        this.$refs.searchTable.toggleRowSelection(selection[1], true)
        return
      }
      this.selection = selection
    },
    selectResourceCancel() {
      this.findResourcesDialog = false
    },
    selectResource(data) {
      this.uploadForm[this.formName] = data.url
      if (this.uploadType === 'video' && this.formName === 'resourceUrl') {
        this.uploadForm.fileName = data.name
      }
      this.findResourcesDialog = false
    },
    handleUploadCancel(form) {
      this.$refs[form].resetFields()
      this.uploadDialog = false
    },
    beforeClose(done) {
      this.handleUploadCancel('uploadForm')
      return done
    },
    handleUploadConfirm(form) {
      if (this.uploadType === 'image') {
        this.$refs[form].validateField('resourceUrl', valid => {
          console.log(valid)
          if (!valid) {
            console.log(this.currentItem)
            let item = {
              resourceType: this.currentItem.type,
              resourceUrl: this.uploadForm.resourceUrl,
              coverUrl: this.uploadForm.coverUrl,
              context: '',
              fileName: '',
              remarks: []
            }
            if (this.uploadType === 'video') {
              item.fileName = this.uploadForm.fileName
            }
            console.log(item)
            this.form.resources.splice(this.currentItem.index, 0, item)
            this.uploadDialog = false
          } else {
            return false
          }
        })
      } else if (this.uploadType === 'video') {
        this.$refs[form].validate(valid => {
          if (valid) {
            console.log(this.currentItem)
            let item = {
              resourceType: this.currentItem.type,
              resourceUrl: this.uploadForm.resourceUrl,
              coverUrl: this.uploadForm.coverUrl,
              context: '',
              fileName: '',
              remarks: []
            }
            if (this.uploadType === 'video') {
              item.fileName = this.uploadForm.fileName
            }
            this.form.resources.splice(this.currentItem.index, 0, item)
            this.uploadDialog = false
          } else {
            return false
          }
        })
      }
    },
    async fileChange(file, fileList, name, list) {
      let isImage = file.raw.type.includes('image')
      let fileInfo
      if (isImage) {
        fileInfo = await getImageSizeAsync(file)
      } else {
        fileInfo = await getVideoInfoAsync(file)
      }
      if (file && !checkImageSize(file, 1024) && name !== 'resourceUrl') {
        this.$notify.error({
          title: 'Error',
          message: `图片资源大小不超过1024KB`,
          duration: 3000
        })
        return
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
          if (url) {
            this.uploadForm[name] = url
            this.uploadImageToResource(
              file.name.substring(0, file.name.lastIndexOf('.')),
              url,
              isImage,
              fileInfo
            )
          }
        }
      )
    },
    uploadImageToResource(name, url, isImage, fileInfo) {
      let moduleId
      let menus = storage.get('menus')
      moduleId = treeData2Arr(menus, 'subMenus').filter(
        o => o.path === '/library/onlineActivities'
      )[0].id
      let data = {
        name: name,
        moduleId: moduleId,
        url: url,
        property: fileInfo,
        resourceType: isImage ? 'Image' : 'Video',
        client: 'BackEnd'
      }
      uploadToResource(data)
    },
    preview(item, isImage) {
      this.isImage = isImage
      this.previewUrl = item.resourceUrl
      if (!isImage) {
        this.previewPoster = item.coverUrl
      }
      this.previewDialog = true
    },
    addItem(index, type) {
      this.currentItem = { index: index, type: type }
      if (type === 'image' || type === 'video') {
        this.uploadForm = {
          resourceUrl: '',
          coverUrl: ''
        }
        this.searchName = ''
        this.handleUpload(type)
      } else if (type === 'remark') {
        if (!this.form.resources[index].remarks) {
          this.form.resources[index].remarks = []
        }
        this.form.resources[index].remarks.push({ text: '' })
      } else {
        let item = {
          resourceType: type,
          resourceUrl: '',
          coverUrl: '',
          context: '',
          fileName: '',
          remarks: []
        }
        this.form.resources.splice(index, 0, item)
      }
    },
    removeRemark(item, index) {
      item.splice(index, 1)
    },
    remove(index) {
      this.form.resources.splice(index, 1)
    },
    sortTo(index, type) {
      // 获取目标位置
      let target = type === 'top' ? index - 1 : index + 1
      console.log(target)
      this.form.resources[index] = this.form.resources.splice(
        target,
        1,
        this.form.resources[index]
      )[0]
    },
    formatValue(value) {
      switch (value) {
        case 'text':
          return '文本'
        case 'image':
          return '图片'
        case 'video':
          return '视频'
      }
    },
    formatIcon(value) {
      return require(`../../../images/library/${value}-icon.png`)
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
          if (!this.previewData.typeTextNum) {
            this.previewData.typeTextNum = 0
          }
          if (!this.previewData.typeImageNum) {
            this.previewData.typeImageNum = 0
          }
          if (!this.previewData.typeVideoNum) {
            this.previewData.typeVideoNum = 0
          }
          if (!this.previewData.typeRemarkNum) {
            this.previewData.typeRemarkNum = 0
          }
          this.form.resources.forEach(o => {
            switch (o.resourceType) {
              case 'text':
                this.previewData.typeTextNum++
                break
              case 'image':
                this.previewData.typeImageNum++
                break
              case 'video':
                this.previewData.typeVideoNum++
                break
            }
          })
          this.previewDetail = true
        } else {
          return false
        }
      })
    },
    submit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let data = {
            title: this.form.title,
            isSearch: this.form.isSearch,
            describe: this.form.describe,
            categoryIds: this.form.categoryIds,
            labels: this.form.labels,
            sort: this.form.sort,
            isTop: this.form.isTop,
            resources: this.form.resources.map((o, i) => {
              return {
                stepId: i + 1,
                resourceType: o.resourceType,
                resourceUrl: o.resourceUrl,
                coverUrl: o.coverUrl,
                context: o.context,
                fileName: o.fileName,
                remarks: o.remarks ? o.remarks : []
              }
            })
          }
          if (this.publishDate && this.publishDate.length) {
            data.publishStartDate = this.publishDate
              ? this.publishDate[0]
              : null
            data.publishEndDate = this.publishDate ? this.publishDate[1] : null
          }
          console.log(data)
          if (this.$route.query.id) {
            updateCourse(this.$route.query.id, data).then(res => {
              console.log(res)
              this.$router.back()
            })
          } else {
            addCourse(data).then(res => {
              console.log(res)
              this.$router.back()
            })
          }
        } else {
          this.$message({
            type: 'error',
            message: '请检查必填项!'
          })
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
.upload-input-img-url {
  position: absolute;
  left: 100px;
  top: 0;
  width: 330px !important;
}
.content-list {
  width: 700px;
  .content-item {
    padding: 10px;
    display: flex;
    align-items: center;
    .item-header {
      display: flex;
      flex-direction: column;
    }
    .input-img-url {
      position: absolute;
      left: 220px;
      width: 310px !important;
    }
    .file-list {
      width: 180px;
      height: 90px;
      margin-top: 10px;
      border-radius: 8px;
      position: relative;
      .item-img {
        display: block;
        width: 180px;
        height: 90px;
        cursor: pointer;
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
        i {
          font-size: 40px;
          text-align: center;
          cursor: pointer;
        }
      }
    }
    .item-img {
      display: block;
      width: 100px;
      height: 100px;
      cursor: pointer;
    }
  }
}
.online-activity-detail {
  &__steps {
    margin-top: 94px;
    &-item {
      position: relative;
      padding-left: 80px;
      padding-bottom: 100px;
      &-remark {
        margin-top: 107px/2;
        position: relative;
        .steps-item-remark-circle {
          display: inline-block;
          width: 16px/2;
          height: 16px/2;
          border-radius: 50%;
          background-color: #ae8fb8;
          position: absolute;
          left: -27px;
          top: -10px/2;
          &::before {
            content: '';
            width: 2px;
            height: 5px;
            position: absolute;
            left: 3px;
            top: -5px;
            background-color: #fff;
          }
          &::after {
            content: '';
            width: 2px;
            height: 5px;
            position: absolute;
            left: 3px;
            bottom: -5px;
            background-color: #fff;
          }
        }
        .steps-item-content__text-content {
          margin-top: 35px/2;
        }
      }
      &-title {
        font-size: 0;
        display: flex;
        align-items: center;
        .title-icon {
          width: 28px/2;
          img {
            width: 100%;
          }
        }
        span {
          margin-left: 16px/2;
          vertical-align: middle;
          font-size: 30px/2;
          line-height: 1;
          color: #303133;
        }
      }
      &-circle {
        position: absolute;
        left: 0;
        top: 0;
        font-size: 0;
        span {
          display: inline-block;
          width: 44px/2;
          height: 44px/2;
          border-radius: 22px/2;
          text-align: center;
          line-height: 44px/2;
          font-size: 26px/2;
          color: #fff;
          background-color: #ae8fb8;
        }
        .circle-icon {
          width: 44px/2;
          img {
            width: 100%;
          }
        }
      }
      &-line {
        width: 1px;
        position: absolute;
        top: 60px/2;
        left: 21px/2;
        bottom: 15px/2;
        background-color: #dbdbdb;
      }
      &-content {
        margin-top: 35px/2;

        /deep/.toggle {
          color: #a07cac;
          font-size: 30px/2;
        }
        .steps-item-content {
          &__text-content {
            padding: 30px/2;
            background: #f5f6f7;
            border-radius: 14px/2;
            line-height: 44px/2;
            font-size: 30px/2;
            color: #606266;
          }
          &__video-content {
            display: flex;
            &-title {
              flex-grow: 1;
              line-height: 130px;
              background-color: #f5f6f7;
              padding-left: 40px;
              font-size: 30px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .title-icon {
              width: 130px;
              height: 130px;
              img {
                width: 100%;
                height: 100%;
              }
            }
          }
          &__image-content {
            img {
              width: 100%;
            }
          }
          &__action {
            margin-top: 30px;
            display: flex;
            justify-content: flex-end;
            .van-button {
              margin-left: 30px;
              height: 80px;
              padding: 0 34px;
              font-size: 26px;
            }
            .copy-btn,
            .download-btn {
              background: rgba(242, 104, 153, 0.05);
              border-radius: 10px;
              border: 2px solid rgba(242, 104, 153, 1);
              color: #f26899;
            }
            .share-btn {
              background: rgba(242, 104, 153, 1);
              box-shadow: 0px 4px 12px 0px rgba(255, 134, 134, 0.3);
              border-radius: 10px;
              color: #fff;
            }
          }
        }
      }
    }
  }
}
.time-line-dot {
  width: 44px/2;
  height: 44px/2;
  border-radius: 50%;
  background-color: #ae8fb8;
  text-align: center;
  line-height: 22px;
  color: #fff;
  font-size: 26px/2;
  position: absolute;
  left: -6px;
  &::before {
    content: '';
    width: 2px;
    height: 5px;
    position: absolute;
    left: 10px;
    top: -5px;
    background-color: #fff;
  }
  &::after {
    content: '';
    width: 2px;
    height: 5px;
    position: absolute;
    left: 10px;
    bottom: -5px;
    background-color: #fff;
  }
}
/deep/.preview-dialog {
  background-color: #f5f4f5;
  width: 400px !important;
  .el-drawer__body {
    overflow-y: auto;
    .preview-detail {
      margin: 0 auto;
      width: 750px/2;
      background-color: #fff;
      .preview-header {
        padding: 30px/2;
        .title {
          height: 44px/2;
          font-size: 44px/2;
          font-weight: 500;
          color: rgba(48, 49, 51, 1);
          line-height: 44px/2;
          margin-bottom: 25px/2;
        }
        .subtitle {
          height: 30px/2;
          font-size: 30px/2;
          font-weight: 500;
          color: rgba(96, 98, 102, 1);
          line-height: 30px/2;
          margin-bottom: 30px/2;
        }
        .introduce {
          display: flex;
          align-items: flex-start;
          font-size: 26px/2;
          font-weight: 500;
          color: rgba(144, 147, 153, 1);
          line-height: 38px/2;
          margin-bottom: 26px/2;
          .introduce-icon {
            width: 30px/2;
            height: 36px/2;
            margin-right: 10px/2;
            display: inline-block;
          }
        }
      }
      .resource-list {
        padding: 0 30px/2;
        .list-item {
          margin-top: 10px/2;
          .item-title {
            display: flex;
            align-items: center;
            height: 30px/2;
            font-size: 30px/2;
            font-weight: 500;
            color: rgba(48, 49, 51, 1);
            line-height: 30px/2;
            margin-bottom: 35px/2;
            img {
              width: 32px/2;
              height: 36px/2;
              margin-right: 14px/2;
            }
          }
          .item-content {
            background: rgba(249, 249, 251, 1);
            border-radius: 14px/2;
            font-size: 30px/2;
            font-weight: 500;
            color: rgba(96, 98, 102, 1);
            margin-bottom: 30px/2;
            overflow: hidden;
            .content-text {
              padding: 30px/2;
              line-height: 44px/2;
            }
            .content-video {
              display: flex;
              align-items: center;
              img {
                width: 130px/2;
                height: 130px/2;
                margin-right: 40px/2;
              }
            }
            .content-image {
              img {
                width: 100%;
              }
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
              padding: 0 47px/2;
              text-align: center;
              height: 60px/2;
              border-radius: 10px/2;
              border: 2px/2 solid rgba(242, 104, 153, 1);
              background-color: #fff;
              margin-left: 20px/2;
            }
            .copy {
              height: 60px/2;
              background: rgba(242, 104, 153, 1);
              box-shadow: 0px 4px/2 12px/2 0px rgba(255, 134, 134, 0.3);
              border-radius: 10px/2;
              color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.el-popover-class {
  padding: 0 !important;
  min-width: 80px !important;
}
</style>
