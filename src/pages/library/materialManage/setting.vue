<template>
  <div class="custom-tree-container">
    <el-row>
      <el-col :span="20">
        <el-form
          size="small"
          ref="materialForm"
          :model="form"
          :rules="rules"
          label-width="160px"
        >
          <el-form-item label="内容编辑"></el-form-item>
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
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-input type="textarea" v-model="form.content"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select
              v-model="form.contentType"
              size="small"
              placeholder="请选择"
            >
              <el-option label="image" :value="1"></el-option>
              <el-option label="video" :value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="海报管理"
            prop="poster"
            v-if="form.contentType === 1"
          >
            <el-checkbox v-model="form.isPoster">需要海报</el-checkbox>
          </el-form-item>
          <div class="draggable-div" v-if="form.contentType === 1">
            <draggable v-model="form.image" draggable=".file-list">
              <el-form-item
                v-for="(item, index) in form.image"
                :label="index === 0 ? '资源' : ''"
                :key="item.id"
                :error="form.imageProperty[index].error"
                :inline-message="true"
                class="file-list"
              >
                <div class="file-item">
                  <div class="img-wrap">
                    <el-image
                      class="item-img preview-img"
                      :src="item"
                      fit="cover"
                    ></el-image>
                    <div v-if="form.isPoster">
                      <div>
                        <el-select
                          v-model="form.imageProperty[index].type"
                          @change="
                            imagePropertyTypeChange(form.imageProperty[index])
                          "
                        >
                          <el-option label="RC商城首页" :value="1"></el-option>
                          <el-option
                            label="RC商城详情页面"
                            :value="2"
                          ></el-option>
                          <el-option
                            label="RCcampaign页面"
                            :value="3"
                          ></el-option>
                          <el-option label="其他" :value="4"></el-option>
                        </el-select>
                        <!-- RC商城详情页面 -->
                        <el-select
                          v-show="form.imageProperty[index].type === 2"
                          v-model="form.imageProperty[index].value"
                          @blur="validatorImageValue(form.imageProperty[index])"
                          filterable
                          remote
                          clearable
                          style="margin:0 5px;width:350px;"
                          placeholder="请输入货号或名称"
                          :remote-method="querySearchAsync"
                        >
                          <el-option
                            v-for="product in searchProducts"
                            :key="product.sku_info_from_pim.sku"
                            :label="product.sku_info_from_pim.sku"
                            :value="product.sku_info_from_pim.sku"
                          >
                            <span style="float: left">{{
                              product.sku_info_from_pim.sku
                            }}</span>
                            <span style="float: right">{{
                              product.sku_info_from_pim.name
                            }}</span>
                          </el-option>
                        </el-select>
                        <!-- RCcampaign页面 -->
                        <el-input
                          v-show="form.imageProperty[index].type === 3"
                          @blur="validatorImageValue(form.imageProperty[index])"
                          style="margin:0 5px;width:365px;"
                          v-model="form.imageProperty[index].value"
                          placeholder="请输入"
                        ></el-input>
                        <!-- 其他 -->
                        <el-input
                          v-show="form.imageProperty[index].type === 4"
                          @blur="validatorImageValue(form.imageProperty[index])"
                          style="margin:0 5px;width:365px;"
                          v-model="form.imageProperty[index].href"
                          placeholder="请输入"
                        ></el-input>
                      </div>
                    </div>
                  </div>
                  <label class="item-status-label">
                    <i class="el-icon-upload-success el-icon-check"></i>
                    <i
                      class="el-icon-close del-item"
                      @click="delItem(index)"
                    ></i>
                  </label>
                </div>
              </el-form-item>
              <el-form-item>
                <div class="avatar-uploader" @click="handleUpload(1)">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </div>
              </el-form-item>
            </draggable>
          </div>
          <el-form-item v-else label="资源" prop="resource">
            <div class="avatar-uploader video-upload" @click="handleUpload(2)">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </div>
            <video
              v-if="form.video && form.video.videoUrl"
              type="video/mp4"
              :muted="false"
              language="zh-CN"
              aspectRatio="16:9"
              playsinline
              preload="load"
              ref="myvideo"
              webkit-playsinline="webkit-playsinline"
              x-webkit-airplay="allow"
              controls
              width="160"
              :src="form.video.videoUrl"
              :poster="form.coverImageUrl"
              @canplay="canplay"
            ></video>
            <p v-if="form.contentType === 1">
              * 大小不超过2M，最多可上传9张图片
            </p>
          </el-form-item>
          <el-form-item label="上传封面" prop="coverImageUrl">
            <div v-if="form.contentType === 1">
              <div class="avatar-uploader" @click="handleUpload(3)">
                <img
                  v-if="form.coverImageUrl"
                  :src="form.coverImageUrl"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </div>
              <p>* 尺寸320*320，大小不超过200kb</p>
            </div>
            <div v-else>
              <div
                class="avatar-uploader video-upload"
                @click="handleUpload(4)"
              >
                <img
                  v-if="form.coverImageUrl"
                  :src="form.coverImageUrl"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </div>
              <p>* 尺寸690*388，大小不超过200kb</p>
            </div>
          </el-form-item>
          <el-form-item label="是否需要添加勋章" v-if="form.contentType === 2">
            <el-radio v-model="form.isNewBC" :label="false">否</el-radio>
            <el-radio v-model="form.isNewBC" :label="true">是</el-radio>
          </el-form-item>
          <el-form-item label="勋章名称" v-if="form.isNewBC" prop="medalName">
            <el-input v-model="form.medalName"></el-input>
          </el-form-item>
          <el-form-item
            label="上传勋章图片"
            v-if="form.isNewBC"
            prop="medalUrl"
          >
            <div class="avatar-uploader" @click="handleUpload(5)">
              <img v-if="form.medalUrl" :src="form.medalUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </div>
            <p>* 建议尺寸不超过220*220，大小不超过200kb</p>
          </el-form-item>
          <el-form-item
            label="勋章认可"
            v-if="form.isNewBC"
            prop="medalAccreditedDesc"
          >
            <el-input v-model="form.medalAccreditedDesc"></el-input>
          </el-form-item>
          <el-form-item
            label="勋章弹窗描述"
            v-if="form.isNewBC"
            prop="medalDesc"
          >
            <el-input type="textarea" v-model="form.medalDesc"></el-input>
          </el-form-item>
          <el-form-item
            label="跳转地址"
            v-if="form.isNewBC"
            prop="medalTargetUrl"
          >
            <el-input v-model="form.medalTargetUrl"></el-input>
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
                <div class="item-labels">
                  <span
                    class="label"
                    v-for="item in previewData.labels"
                    :key="item.id"
                    >{{ item.labelName }}</span
                  >
                </div>
                <div class="item-content">
                  {{ previewData.content }}
                </div>
                <el-row
                  :gutter="5"
                  class="list-item-resourse"
                  v-if="previewData.contentType === 1"
                >
                  <el-col
                    :span="8"
                    v-for="item in previewData.image"
                    :key="item"
                  >
                    <!-- <img width="100%" class="list-item-img" :src="item" alt="" /> -->
                    <el-image
                      class="list-item-img"
                      :preview-src-list="previewData.image"
                      :src="item"
                      fit="cover"
                    ></el-image>
                  </el-col>
                </el-row>

                <el-row :gutter="5" class="list-item-resourse" v-else>
                  <video
                    class="item-video"
                    type="video/mp4"
                    :muted="false"
                    language="zh-CN"
                    aspectRatio="16:9"
                    playsinline
                    preload="load"
                    webkit-playsinline="webkit-playsinline"
                    x-webkit-airplay="allow"
                    controls
                    width="100%"
                    :poster="previewData.coverImageUrl"
                    :src="previewData.video.videoUrl"
                  ></video>
                </el-row>

                <div class="handle-btn">
                  <span class="copy">复制文案</span>
                  <span class="download" v-if="previewData.contentType === 1"
                    >下载图片</span
                  >
                  <span class="download" v-else>下载视频</span>
                  <span class="forward">转发</span>
                </div>
                <div class="item-btn" v-if="previewData.commentText">
                  <div class="comment-component-title">
                    <div class="comment-component-content-icon">
                      <img src="../../../images/library/comment.png" alt="" />
                    </div>
                    <span>小编评论</span>
                  </div>
                  <span class="copy-comment">复制评论</span>
                </div>
                <div
                  class="comment-component-content"
                  v-if="previewData.commentText"
                >
                  <span class="comment-component-content-angle"></span>
                  <div class="comment-component-content-text">
                    {{ previewData.commentText }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
    <!-- 生成normalQrcodeUrl -->
    <canvas v-show="false" ref="canvas" id="QRcanvas"></canvas>
    <!-- 上传资源、检索资源库 -->
    <el-dialog
      :visible.sync="uploadDialog"
      width="370px"
      title="资源选择"
      class="upload-dialog"
      :close-on-click-modal="false"
    >
      <el-form size="small" label-width="100px">
        <el-form-item label="本地上传">
          <upload
            ref="imageUpload"
            v-show="uploadType === 1"
            @change="
              (file, fileList) =>
                fileChange(file, fileList, 'imageList', 'imageList', {
                  size: 2048
                })
            "
            :showFileList="false"
            multiple
            btnName="上传"
            :limit="9"
            accept="image/png, image/jpeg"
          ></upload>
          <upload
            v-show="uploadType === 2"
            @change="
              (file, fileList) =>
                fileChange(file, fileList, 'videoList', 'videoList')
            "
            :multiple="false"
            btnName="上传"
            :show-file-list="false"
            accept="video/*"
          ></upload>
          <upload
            v-show="uploadType === 3"
            @change="
              (file, fileList) =>
                fileChange(file, fileList, 'coverImageUrl', 'coverImageList', {
                  size: 200
                })
            "
            :multiple="false"
            :showFileList="false"
            btnName="上传"
            accept="image/png, image/jpeg"
          ></upload>
          <upload
            v-show="uploadType === 4"
            @change="
              (file, fileList) =>
                fileChange(file, fileList, 'coverImageUrl', 'coverImageList', {
                  size: 300
                })
            "
            :multiple="false"
            :showFileList="false"
            btnName="上传"
            accept="image/png, image/jpeg"
          ></upload>
          <upload
            v-show="uploadType === 5"
            @change="
              (file, fileList) =>
                fileChange(file, fileList, 'medalUrl', 'medalUrlList', {
                  size: 200
                })
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
      ref="selectInResource"
      :findResourcesDialog="findResourcesDialog"
      :fileSize="{ size: 300 }"
      :resourceType="resourceType"
      :multiple="multiple"
      :acceptType="acceptType"
      :queryName="queryName"
      @selectResource="selectResource"
      @multipleChange="multipleChange"
      @addResourceHandle="addResourceHandle"
      @closeUploadDialog="
        findResourcesDialog = false
        searchName = ''
      "
    ></select-in-resource>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import Upload from '@/components/upload'
import upload from '@/mixins/upload.js'
import utilUpload from '@/utility/upload'
import dialogForm from '@/mixins/dialogForm.js'
import DraggableSelect from '@/components/dragSelect/index.vue'
import SelectInResource from '@/components/selectInResources/selectInResource'
import SelectOption from '@/components/select/select.vue'
import storage from 'good-storage'
import {
  checkImageSize,
  getImageSizeAsync,
  treeData2Arr,
  base64ToFile,
  thumbImage,
  getVideoInfoAsync,
  getVideoInfoByUrl,
  deepCopy,
  formatDate,
  oneOf
} from '@/utility'
import { uploadToResource } from '@/api/index.js'
import { getProducts } from '@/api/product/products.js'
import { getTags } from '@/api/library/tags.js'
import { categorySelect } from '@/api/library/category.js'
import {
  addContent,
  updateContent,
  getContentDetail
} from '@/api/library/material.js'
import QRCode from 'qrcode'
export default {
  components: {
    SelectOption,
    DraggableSelect,
    draggable,
    Upload,
    SelectInResource
  },
  mixins: [dialogForm, upload],
  data() {
    let validatorResource = (rule, value, callback) => {
      if (this.form.contentType === 1) {
        if (!this.form.image.length) {
          callback(new Error('必填项'))
        } else if (this.form.image.length > 9) {
          callback(new Error('最多上传9张图片'))
        }
      } else {
        if (!this.form.video.videoUrl) {
          callback(new Error('必填项'))
        }
      }
      callback()
    }
    let validatorCoverImageUrl = (rule, value, callback) => {
      if (this.form.contentType === 2) {
        if (!this.form.coverImageUrl) {
          callback(new Error('必填项'))
        }
      }
      callback()
    }
    let validatorMedalUrl = (rule, value, callback) => {
      if (this.form.contentType === 2 && this.form.isNewBC) {
        if (!this.form.medalUrl) {
          callback(new Error('必填项'))
        }
      }
      callback()
    }
    // let validatorMedalName = (rule, value, callback) => {
    //   if (this.form.contentType === 2 && this.form.isNewBC) {
    //     if (!this.form.medalName) {
    //       callback(new Error('必填项'))
    //     }
    //   }
    //   callback()
    // }
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
        commentText: '',
        categoryIds: [],
        labels: [],
        isPoster: false,
        skuId: null,
        detailUrl: '',
        coverImageUrl: '',
        isNewBC: false,
        medalName: '',
        medalDesc: '',
        medalAccreditedDesc: '',
        medalTargetUrl: '',
        medalUrl: '',
        contentType: 1,
        sort: 999,
        isTop: false,
        image: [],
        video: { videoUrl: '' },
        imageProperty: []
      },
      initImageProperty: [],
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
        coverImageUrl: [{ validator: validatorCoverImageUrl, trigger: 'blur' }],
        medalUrl: [{ validator: validatorMedalUrl, trigger: 'blur' }],
        medalName: [{ required: true, message: '必填项', trigger: 'blur' }],
        medalDesc: [{ required: true, message: '必填项', trigger: 'blur' }],
        medalAccreditedDesc: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        medalTargetUrl: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        resource: [{ validator: validatorResource, trigger: 'blur' }],
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
      medalUrlList: [],
      videoList: [],
      searchProducts: [],
      previewDetail: false,
      previewData: { video: {} },
      uploadDialog: false,
      searchName: '',
      uploadType: 1,
      selection: [],
      findResourcesDialog: false,
      findResourceForm: {
        name: '',
        updateBy: ''
      },
      resourceTableData: {
        data: [],
        pageData: {
          pageSize: 20,
          pageNo: 1,
          totalCount: 0
        }
      },
      queryName: '',
      acceptType: 'image',
      resourceType: 'image',
      multiple: false
    }
  },
  created() {
    this.getLabels()
    this.getCategories()
    if (this.$route.query.id) {
      getContentDetail(this.$route.query.id).then(res => {
        if (!res.image) {
          res.image = []
        }
        if (!res.imageProperty) {
          res.imageProperty = []
          if (res.image.length) {
            res.image.forEach(() => {
              res.imageProperty.push({
                type: 1,
                value: '',
                href: '',
                error: ''
              })
            })
          }
        } else {
          res.imageProperty = res.imageProperty.map(o => ({
            type: o && o.type ? o.type : 1,
            value: o && o.value ? o.value : '',
            href: o && o.href ? o.href : '',
            error: o && o.error ? o.error : ''
          }))
        }
        this.initImageProperty = deepCopy(res.imageProperty)
        this.form = deepCopy(res)
        console.log(this.form)
        if (res.publishEndDate && res.publishStartDate) {
          this.publishDate = [res.publishStartDate, res.publishEndDate]
        }
        if (res.contentType === 1 && res.image) {
          this.imageList = res.image.map(o => ({
            name: o,
            url: o
          }))
        }
        if (res.contentType === 2 && res.video && res.video.videoUrl) {
          this.videoList = [
            {
              name: res.video.videoUrl,
              url: res.video.videoUrl
            }
          ]
        }
      })
    }
  },
  methods: {
    validatorImageValue(item) {
      console.log(item)
      // eslint-disable-next-line no-useless-escape
      let reg = /^(?:http(s)?:\/\/)+[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
      switch (item.type) {
        case 1:
          item.error = ''
          return true
        case 2:
          if (item.value) {
            item.error = ''
            return true
          } else {
            item.error = '请选择商品'
            return false
          }
        case 3:
          if (item.value) {
            item.error = ''
            return true
          } else {
            item.error = '请输入值'
            return false
          }
        case 4:
          if (item.href) {
            if (reg.test(item.href)) {
              item.error = ''
              return true
            } else {
              item.error = '请输入合法地址'
              return false
            }
          } else {
            item.error = '请输入地址'
            return false
          }
      }
    },
    handleUpload(type) {
      /*
        *type
        1：图片资源
        2：视频资源
        3：图片封面
        4：视频封面
      */
      console.log(type)
      if (type === 1) {
        if (this.form.image.length === 9) {
          this.$message({
            type: 'error',
            message: '最多上传9张图片！'
          })
          return
        }
      }
      this.resourceType = 'image'
      this.acceptType = 'image'
      this.multiple = false
      switch (type) {
        case 1:
          this.multiple = true
          break
        case 2:
          this.resourceType = 'video'
          this.acceptType = 'video'
          break
      }
      this.uploadType = type
      this.uploadDialog = true
    },
    search() {
      this.uploadDialog = false
      this.queryName = this.searchName
      this.findResourcesDialog = true
    },
    selectResource(data) {
      switch (this.uploadType) {
        case 1:
        case 2:
          this.form.video.videoUrl = data.url
          break
        case 3:
        case 4:
          this.form.coverImageUrl = data.url
          break
        case 5:
          this.form.medalUrl = data.url
      }
      this.findResourcesDialog = false
    },
    multipleChange(data) {
      const images = this.form.image
      if (data.length + images.length > 9) {
        this.$message({
          type: 'error',
          message: '最多上传9张图片！'
        })
        this.$refs.selectInResource.onExceed()
      }
    },
    addResourceHandle(data) {
      data.forEach(o => {
        this.form.image.push(o.url)
        this.form.imageProperty.push({
          type: 1,
          value: '',
          href: '',
          error: ''
        })
      })
      this.findResourcesDialog = false
    },
    canplay() {
      let videoLength = parseInt(this.$refs.myvideo.duration)
      if (
        !this.form.video.videoLength ||
        this.form.video.videoLength !== videoLength
      ) {
        this.form.video.videoLength = videoLength
      }
    },
    delItem(index) {
      this.form.image.splice(index, 1)
      this.form.imageProperty.splice(index, 1)
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
      let fileInfo
      if (file) {
        if (name !== 'videoList') {
          let imageLen = this.form.image.length
          // 文件上传选中文件个数，会触发fileLen次fileChange事件
          let fileLen = this.$refs.imageUpload.$refs.upload.$refs[
            'upload-inner'
          ].$refs.input.files.length
          /*
           *fileList.length：fileChange事件每触发一次+1
           *fileLen：文件上传实际选中文件个数
           */
          // 判断是否超出限制数量，未超出部分仍会成功上传
          console.log('fileList.length', fileList.length)
          console.log('fileLen', fileLen)
          if (this.uploadType === 1) {
            if (fileList.length === fileLen) {
              // 完成当次上传后清空已上传的文件列表，下次上传操作的fileList.length从0开始
              this.$refs.imageUpload.$refs.upload.clearFiles()
            }
            if (imageLen + fileList.length > 9) {
              // 当触发次数等于实际选择文件个数，即表示当次批量上传完成（为防止多次弹出超出限制提示）
              if (fileList.length === fileLen) {
                this.$notify.error({
                  title: 'Error',
                  message: `最多可上传9张图片！`,
                  duration: 3000
                })
              }
              return
            }
          }
          if (file.raw.type.includes('image')) {
            fileInfo = await getImageSizeAsync(file)
            if (!checkImageSize(file, fileSize.size)) {
              this.$notify.error({
                title: 'Error',
                message: `图片大小不超过${fileSize.size}kb`,
                duration: 3000
              })
              this[list].pop()
              return
            }
          } else {
            this.$notify.error({
              title: 'Error',
              message: `请上传图片类型文件`,
              duration: 3000
            })
            return
          }
        } else {
          if (file.raw.type.includes('video')) {
            fileInfo = await getVideoInfoAsync(file)
          } else {
            this.$notify.error({
              title: 'Error',
              message: `请上传MP4格式文件`,
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
            fileArray: list || 'fileList',
            objectKey: 'LibraryResource'
          },
          (url, index) => {
            switch (name) {
              case 'imageList':
                if (url) {
                  this.form.image.push(url)
                  this.form.imageProperty.push({
                    type: 1,
                    value: '',
                    href: '',
                    error: ''
                  })
                } else {
                  this.form.image.splice(index, 1)
                }
                break
              case 'videoList':
                if (!this.form.video) {
                  this.form.video = {}
                }
                this.form.video.videoUrl = url
                this.form.video.videoLength = fileInfo.duration
                break
              case 'coverImageUrl':
                this.form.coverImageUrl = url
                break
              case 'medalUrl':
                this.form.medalUrl = url
                break
            }
            this.uploadDialog = false
            if (url) {
              let isImage = file.raw.type.includes('image')
              this.uploadImageToResource(
                file.name.substring(0, file.name.lastIndexOf('.')),
                url,
                isImage,
                fileInfo
              )
            }
          }
        )
      }
    },
    uploadImageToResource(name, url, isImage, property) {
      let moduleId
      let menus = storage.get('menus')
      moduleId = treeData2Arr(menus, 'subMenus').filter(
        o => o.path === '/library/materialManage'
      )[0].id
      let data = {
        name: name,
        moduleId: moduleId,
        url: url,
        property: property,
        resourceType: isImage ? 'Image' : 'Video',
        client: 'BackEnd'
      }
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
    imagePropertyTypeChange(row) {
      row.href = ''
      row.value = ''
    },
    submit(form) {
      this.$refs[form].validate(async valid => {
        if (valid) {
          let data = {
            title: this.form.title,
            content: this.form.content,
            commentText: this.form.commentText,
            categoryIds: this.form.categoryIds,
            labels: this.form.labels,
            isPoster: this.form.isPoster,
            contentType: this.form.contentType,
            sort: this.form.sort,
            isTop: this.form.isTop,
            coverImageUrl: this.form.coverImageUrl
          }
          if (this.form.contentType === 1) {
            let imagePropertyValid = true
            this.form.imageProperty.forEach(async o => {
              if (!this.validatorImageValue(o)) {
                imagePropertyValid = false
              }
            })
            console.log(imagePropertyValid)
            if (imagePropertyValid) {
              let imageProperty = await this.getNormalQrcodeUrl(
                this.form.imageProperty
              )
              console.log(imageProperty)
              data.image = this.form.image
              data.imageProperty = imageProperty
              let imageSize = await getImageSizeAsync({
                url: this.form.image[0]
              })
              data.imageProperty[0].width = imageSize.width
              data.imageProperty[0].height = imageSize.height
              if (!this.form.coverImageUrl) {
                data.coverImageUrl = thumbImage(data.image[0], 320, 320)
              }
            } else {
              return false
            }
          } else {
            if (!this.form.video.videoLength) {
              try {
                let videoInfo = await getVideoInfoByUrl(
                  this.form.video.videoUrl
                )
                this.form.video.videoLength = videoInfo.duration
              } catch (e) {
                console.log(e)
              }
            }
            data.isNewBC = this.form.isNewBC
            data.medalUrl = this.form.medalUrl
            data.medalName = this.form.medalName
            data.medalDesc = this.form.medalDesc
            data.medalAccreditedDesc = this.form.medalAccreditedDesc
            data.medalTargetUrl = this.form.medalTargetUrl
            data.video = this.form.video
          }

          if (this.publishDate && this.publishDate.length) {
            data.publishStartDate = this.publishDate
              ? this.publishDate[0]
              : null
            data.publishEndDate = this.publishDate ? this.publishDate[1] : null
          }
          console.log(data)
          if (this.$route.query.id) {
            updateContent(this.$route.query.id, data).then(res => {
              console.log(res)
              this.$router.back()
            })
          } else {
            addContent(data).then(res => {
              console.log(res)
              this.$router.back()
            })
          }
        } else {
          return false
        }
      })
    },
    qrcodeFileUpload(file) {
      return new Promise(resolve => {
        utilUpload(file, 'LibraryResource').then(res => {
          resolve(res)
        })
      })
    },
    getNormalQrcodeUrl(list) {
      return new Promise(resolve => {
        var canvas = document.getElementById('QRcanvas')
        let newList = []
        list.forEach(async (o, i) => {
          let oldHref = this.initImageProperty[i]
            ? this.initImageProperty[i].href
            : ''
          if (o.type === 4 && (o.href !== oldHref || !o.value)) {
            QRCode.toCanvas(canvas, o.href, { width: 430, height: 430 })
            let normalQrcodeUrl = canvas.toDataURL('image/png')
            console.log(normalQrcodeUrl)
            const file = base64ToFile(normalQrcodeUrl)
            let value = await this.qrcodeFileUpload(file)
            newList[i] = {
              type: o.type,
              value: value,
              href: o.href
            }
          } else {
            newList[i] = {
              type: o.type,
              value: o.value,
              href: o.href
            }
          }
          if (
            !(oneOf(undefined, newList) || oneOf(null, newList)) &&
            newList.length === list.length
          ) {
            console.log(
              newList.map(o => ({
                type: o.type,
                value: o.value,
                href: o.href
              }))
            )
            resolve(newList)
          }
        })
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
  // width: 690px/2;
  // margin-bottom: 20px;
  padding: 30px/2;
  background-color: #fff;
  box-sizing: content-box;
  .list-item-content {
    .list-item-header {
      display: flex;
      justify-content: space-between;
      font-size: 24px/2;
      text-align: center;
      line-height: 50px/2;
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
    .item-content {
      font-size: 32px/2;
      color: #303133;
      margin: 20px/2 0 25px/2 0;
    }
    .item-labels {
      font-size: 20px/2;
      color: rgba(255, 255, 255, 1);
      line-height: 20px/2;
      margin-top: 20px/2;
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
    .handle-btn {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      margin-bottom: 15px;
      span {
        text-align: center;
        display: inline-block;
        width: 98px;
        height: 30px;
        line-height: 30px;
        color: #f26899;
        border-radius: 15px;
      }
      .copy {
        background-color: #f4fafe;
        color: #6e9ec5;
      }
      .download {
        background-color: #fef4f5;
      }
      .forward {
        background-color: #ffeff5;
      }
    }
    .item-btn {
      font-size: 28px/2;
      line-height: 23px;
      height: 23px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      span {
        text-align: center;
        display: inline-block;
        border-radius: 14px/2;
      }
      .copy-comment {
        width: 136px/2;
        height: 48px/2;
        transform: scale(0.916);
        background: #f26899;
        border-radius: 23px/2;
        padding: 0;
        border: none;
        font-size: 24px/2;
        color: #fff;
      }
    }
    .comment-component {
      &-content-icon {
        display: inline-block;
        vertical-align: middle;
        width: 36px/2;
        img {
          width: 100%;
        }
      }
      &-title {
        font-size: 0;
        color: #303133;
        span {
          position: relative;
          left: -26px/2;
          font-size: 24px/2;
          line-height: 46px/2;
          font-weight: bold;
          vertical-align: middle;
        }
      }
      &-content {
        position: relative;
        padding: 30px/2;
        margin-top: 20px/2;
        border-radius: 14px/2;
        border-top-left-radius: 0;
        background: #f9f9fb;
        &-text {
          font-size: 26px/2;
          line-height: 36px/2;
          color: #606266;
        }
        /deep/.toggle {
          color: #a07cac;
        }
        &-angle {
          position: absolute;
          top: -15px/2;
          left: 0;
          border-left: 30px/2 solid #f9f9fb;
          border-top: 30px/2 solid transparent;
          border-bottom: 30px/2 solid transparent;
          border-right: 30px/2 solid transparent;
          border-radius: 8px/2;
          height: 0px;
          width: 0px;
          background: transparent;
        }
      }
    }
    .list-item-resourse {
      margin-bottom: 10px;
      .list-item-img {
        width: 227px/2;
        height: 227px/2;
        border-radius: 4px;
        display: block;
        margin: 5px/2 0;
      }
    }
    .comment-content {
      width: 630px/2;
      height: 97px/2;
      background: rgba(245, 244, 245, 1);
      border-radius: 0 14px/2 14px/2 14px/2;
      padding: 30px/2;
      font-size: 30px/2;
      line-height: 46px/2;
      position: relative;
      .tri {
        position: absolute;
        top: -20px/2;
        left: 0;
        border-right: 10px/2 dashed transparent;
        border-top: 10px/2 dashed transparent;
        border-bottom: 10px/2 solid rgba(245, 244, 245, 1);
      }
      .unfold-box {
        position: absolute;
        right: 30px/2;
        bottom: 35px/2;
        background-color: rgba(245, 244, 245, 1);
        .unfold {
          color: #a07cac;
          text-decoration: none;
          margin-left: 12px;
        }
      }
    }
  }
}
.draggable-div {
  .file-list {
    position: relative;
    margin-bottom: 10px;
    .file-item {
      border-radius: 8px;
      border: 1px solid #ccc;
      padding: 10px;
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
      .del-item {
        display: none;
        transform: rotate(-45deg);
        color: #fff;
      }
      .img-wrap {
        display: flex;
        .item-img {
          border-radius: 8px;
          border: 1px solid #ccc;
          width: 80px;
          height: 80px;
          margin-right: 20px;
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
  vertical-align: top;
  margin-right: 20px;
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
