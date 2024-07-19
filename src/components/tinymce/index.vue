<template>
  <div>
    <tinymce
      id="tinymceTextarea"
      :init="editorConfigs"
      v-model="content"
    ></tinymce>
    <el-dialog
      :visible.sync="findResourcesDialog"
      title="Find Resources"
      width="1210px"
    >
      <el-form :inline="true" label-width="100px" size="small">
        <el-form-item label="Name">
          <el-input
            v-model="findResourceForm.name"
            @change="getResources(1)"
          ></el-input>
        </el-form-item>
        <el-form-item label="Upload By">
          <el-input
            v-model="findResourceForm.uploadBy"
            @change="getResources(1)"
          ></el-input>
        </el-form-item>
        <el-form-item label="Type">
          <el-select
            v-model="findResourceForm.resourceType"
            @change="resourceTypeChange"
            placeholder="请选择"
          >
            <el-option label="Video" value="video"></el-option>
            <el-option label="Audio" value="audio"></el-option>
            <el-option label="Image" value="Image"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getResources(1)">
            search
          </el-button>
        </el-form-item>
      </el-form>
      <div class="resource_list">
        <el-row :gutter="10">
          <el-checkbox-group v-model="selection">
            <el-col
              :span="4"
              class="resource_list_item"
              v-for="item in resourceTableData.data"
              :key="item.id"
            >
              <el-image
                v-if="findResourceForm.resourceType === 'Image'"
                :src="item.url"
                class="resource_list_item_media"
                :preview-src-list="resourceTableData.data.map(o => o.url)"
                @error="
                  e => {
                    loadError(e, item)
                  }
                "
              >
                <div slot="placeholder" class="image-slot">
                  加载中<span class="dot">...</span>
                </div>
                <div slot="error" class="image-slot">
                  <span>资源错误，加载失败</span>
                </div>
              </el-image>
              <div
                class="resource_list_item_media"
                v-if="findResourceForm.resourceType === 'audio'"
              >
                <audio
                  class="resource_list_item_media_audio"
                  v-if="!item.loadError"
                  :src="item.url"
                  @error="
                    e => {
                      loadError(e, item)
                    }
                  "
                  controls="controls"
                ></audio>
                <div class="image-slot" v-if="item.loadError">
                  <span>资源错误，加载失败</span>
                </div>
              </div>
              <div
                class="resource_list_item_media"
                v-if="findResourceForm.resourceType === 'video'"
              >
                <video
                  v-if="!item.loadError"
                  type="video/mp4"
                  language="zh-CN"
                  aspectRatio="16:9"
                  playsinline
                  preload="auto"
                  webkit-playsinline="webkit-playsinline"
                  x-webkit-airplay="allow"
                  controls
                  width="100%"
                  height="120"
                  @error="
                    e => {
                      loadError(e, item)
                    }
                  "
                  :poster="
                    item.property && item.property.poster
                      ? item.property.poster
                      : 'https://dev-community-s3.xxxxxxx.com.cn/DEV/MyBizxxxxxxx_Content_Cms/ProductResource/20200824134635_612.png'
                  "
                  :src="item.url"
                ></video>
                <div class="image-slot" v-if="item.loadError">
                  <span>资源错误，加载失败</span>
                </div>
              </div>
              <div class="item_operate">
                <el-checkbox :label="item" :disabled="item.loadError"
                  >选择</el-checkbox
                >
                <!-- <input type="checkbox" /> -->
                <el-button type="text" @click="copyResourceUrl(item)"
                  >复制链接</el-button
                >
              </div>
            </el-col>
          </el-checkbox-group>
        </el-row>
      </div>
      <div class="text-right" v-if="resourceTableData.pageData">
        <el-pagination
          @current-change="chooseResourcePageFn"
          :current-page="resourceTableData.pageData.pageNo"
          :page-size="
            resourceTableData.pageData ? resourceTableData.pageData.pageSize : 0
          "
          layout="total, prev, pager, next, jumper"
          :total="
            resourceTableData.pageData
              ? resourceTableData.pageData.totalCount
              : 0
          "
        ></el-pagination>
      </div>
      <div class="text-right">
        <el-button @click="selectResourceCancel" size="small">取消</el-button>
        <el-button type="primary" @click="selectResource" size="small"
          >确认</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="showAddResourceDialog"
      title="Add Resource"
      @close="closeAddResourceDialog"
    >
      <el-form
        :model="addResourceForm"
        label-width="120px"
        size="small"
        ref="addResourceForm"
      >
        <el-form-item label="name" prop="name">
          <el-input
            v-model="addResourceForm.name"
            placeholder="Please enter resource name"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="resourceUrl" prop="url">
          <el-input
            v-model="addResourceForm.url"
            readonly
            style="position: absolute; left: 90px;width: 330px;"
          ></el-input>
          <upload
            @change="
              (file, fileList) =>
                addResourceFileChange(
                  file,
                  fileList,
                  'addResource',
                  'resourceUrlList'
                )
            "
            :multiple="false"
            accept="image/png, image/jpeg, video/mp4, audio/mp3"
            :fileList="resourceUrlList"
          ></upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showAddResourceDialog = false" size="mini">
          Cancel
        </el-button>
        <el-button type="primary" @click="addResourceHandle" size="mini">
          Add
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Tinymce from 'tinymce-vue-custom'
import 'tinymce/icons/default'
import Upload from '@/components/upload'
import upload from '@/mixins/upload.js'
import Http from '@/api/http'
import uploadUtility from '@/utility/upload'
import storage from 'good-storage'
import {
  treeData2Arr,
  checkImageSize,
  getImageSizeAsync,
  getVideoInfoByUrl,
  getVideoInfoAsync,
  getAudioInfoAsync
} from '@/utility'
import { uploadToResource } from '@/api/index.js'
import { tinyMCECreatePlugins } from '@/utility/tinyMCE_util'
export default {
  components: {
    Tinymce,
    Upload
  },
  mixins: [upload],
  data() {
    const that = this
    return {
      editor: null,
      editorConfigs: {
        selector: 'tinymceTextarea',
        width: '750px',
        height: '600px',
        language_url: '/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        plugins: [
          'advlist autolink link image lists charmap print preview hr',
          'searchreplace insertdatetime media',
          'save directionality emoticons paste'
        ],
        fontsize_formats: '12px 14px 16px 18px 24px 36px 42px 48px',
        // plugins: ['link image media code preview'],
        toolbar: [
          'undo redo',
          'styleselect bold italic alignleft aligncenter alignright bullist numlist',
          'link image',
          'searchResources',
          'uploadResource'
        ],
        image_advtab: true,
        emoticons_database_url:
          'https://appdl.xxxxxxx.com.cn/ContentCMS/tinymce/plugins/emoticons/js/emojis.min.js',
        theme_url:
          'https://appdl.xxxxxxx.com.cn/ContentCMS/tinymce/themes/silver/theme.min.js',
        skin_url:
          'https://appdl.xxxxxxx.com.cn/ContentCMS/tinymce/skins/ui/oxide',
        // content_css: 'https://cdn.bootcss.com/normalize/8.0.1/normalize.min.css',
        content_css:
          'https://appdl.xxxxxxx.com.cn/ContentCMS/tinymce/skins/content/default/content.min.css',
        extended_valid_elements:
          'video[onclick|controlslist|controls|poster|width|height|playsinline|webkit-playsinline|autoplay|preload|data-duration]',
        images_upload_handler: function(blobInfo, success, failure) {
          const file = blobInfo.blob()
          uploadUtility(file)
            .then(url => {
              success(url)
              that.uploadImageToResource(file.name, url, 'Image', {})
            })
            .catch(err => failure(err))
        },
        media_poster: true,
        urlconverter_callback: function(url) {
          // 此项为处理 native跳转 mk:/// 会被替换为 `mk://${location.hostname}`导致无法跳转到app
          return url
        },
        setup(editor) {
          that.editor = editor
          tinyMCECreatePlugins(that, editor)
        }
      },
      form: {},
      searchName: '',
      findResourcesDialog: false,
      findResourceForm: {
        name: '',
        updateBy: '',
        resourceType: 'Image'
      },
      resourceTableData: {
        data: [],
        pageData: {
          pageSize: 12,
          pageNo: 1,
          totalCount: 0
        }
      },
      selection: [],
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
      needLoadingRequestCount: 0
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    content: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit(
          'getText',
          this.editor.getContent({
            format: 'text'
          })
        )
        this.$emit('input', val)
      }
    }
  },
  mounted() {
    this.content = this.value
  },
  methods: {
    loadError(e, item) {
      console.log(item)
      item.loadError = true
      // console.log(item)
    },
    showFullScreenLoading() {
      if (this.needLoadingRequestCount === 0) {
        this.loadinginstace = this.$loading({
          target: '#loding',
          text: '文件上传中……',
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
    closeAddResourceDialog() {
      this.$refs['addResourceForm'].resetFields()
      this.resourceUrlList = []
    },
    addResourceHandle() {
      // if ()
      if (typeof this.uploadFileInfo === 'undefined') {
        this.$message({
          type: 'error',
          message: '请先上传资源!'
        })
      } else {
        switch (this.uploadFileInfo.resourceType) {
          case 'Video':
            window.tinymce.get('tinymceTextarea').insertContent(
              `<video controls="controls" controlslist="nodownload" width="${this.uploadFileInfo.width}" height="${this.uploadFileInfo.height}" poster="${this.uploadFileInfo.poster}" data-duration="${this.uploadFileInfo.duration}">
                  <source src="${this.uploadFileInfo.url}"
          }/>
                </video>`
            )
            break
          case 'Audio':
            window.tinymce.get('tinymceTextarea').insertContent(
              `<audio src="${this.uploadFileInfo.url}" data-duration="${this.uploadFileInfo.duration}">
          }/>
                </audio>`
            )
            break
          case 'Image':
            window.tinymce
              .get('tinymceTextarea')
              .insertContent(
                `<img src="${this.uploadFileInfo.url}" width="${this.uploadFileInfo.width}" height="${this.uploadFileInfo.height}"/>`
              )
            break
        }
      }
      this.uploadFileInfo = {}
      this.showAddResourceDialog = false
    },
    resourceTypeChange() {
      // this.$refs.searchTable.clearSelection()
      this.selection = []
      this.getResources(1)
    },
    // 富文本编辑器点击search按钮
    tinymceSearch() {
      this.findResourcesDialog = true
      this.getResources(1)
    },
    // 富文本编辑器点击upload按钮
    tinymceUpload() {},
    chooseResourcePageFn(pageNo) {
      this.resourceTableData.pageData.pageNo = pageNo
      this.getResources(pageNo)
    },
    getResources(pageNo) {
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
        this.resourceTableData.data = res['resources'].map(o => {
          o.loadError = false
          return o
        })
        if (res.totalCount) {
          this.resourceTableData.pageData.totalCount = res.totalCount
        }
      })
    },
    search() {
      console.log(this.searchName)
      this.findResourceForm.name = this.searchName
      this.findResourceForm.resourceType = 'Image'
      this.findResourcesDialog = true
      this.getResources(1)
    },
    selectResourceCancel() {
      this.findResourcesDialog = false
      this.selection = []
    },
    selectResource() {
      switch (this.findResourceForm.resourceType) {
        case 'video':
          this.selection.forEach(async o => {
            if (o.property && o.property.poster && o.property.duration) {
              window.tinymce.get('tinymceTextarea').insertContent(
                `<video data-mce-object="video" class="mce-object mce-object-video" data-mce-selected="1" controls="controls" controlslist="nodownload" poster="${o.property.poster}" data-duration="${o.property.duration}">
                      <source src="${o.url}"
              }/>
                    </video>`
              )
            } else {
              this.showFullScreenLoading()
              try {
                let info = await getVideoInfoByUrl(o.url)
                window.tinymce.get('tinymceTextarea').insertContent(
                  `<video data-mce-object="video" class="mce-object mce-object-video" data-mce-selected="1" controls="controls" controlslist="nodownload" poster="${info.poster}" data-duration="${info.duration}">
                        <source src="${o.url}"
                }/>
                      </video>`
                )
                this.tryHideFullScreenLoading()
              } catch (e) {
                this.tryHideFullScreenLoading()
              }
            }
          })
          break
        case 'audio':
          this.selection.forEach(async o => {
            this.showFullScreenLoading()
            let info = await getAudioInfoAsync(o)
            console.log(info)
            window.tinymce.get('tinymceTextarea').insertContent(
              `<audio src="${o.url}" data-duration="${info.duration}">
        }/>
              </audio>`
            )
            this.tryHideFullScreenLoading()
          })
          break
        case 'Image':
          this.selection.forEach(async o => {
            this.showFullScreenLoading()
            let info = await getImageSizeAsync(o)
            console.log(info)
            window.tinymce
              .get('tinymceTextarea')
              .insertContent(
                `<img src="${o.url}" width="${info.width}" height="${info.height}"/>`
              )
            this.tryHideFullScreenLoading()
          })
          break
      }
      this.findResourcesDialog = false
      this.selection = []
    },
    copyResourceUrl(item) {
      this.$copyText(item.url)
      this.$message({
        type: 'success',
        message: '复制成功'
      })
    },
    async fileChange(file, fileList, name, list) {
      if (!checkImageSize(file, 300)) {
        this.$notify.error({
          title: 'Error',
          message: `尺寸为750*320，大小不超过300kb`,
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
        async url => {
          if (url) {
            let fileInfo = {}
            let suffix = file.name.substring(file.name.lastIndexOf('.') + 1)
            if (file.raw.type.includes('image')) {
              fileInfo = await getImageSizeAsync(file)
              fileInfo.resourceType = 'Image'
            } else {
              if (suffix === 'mp4') {
                fileInfo = await getVideoInfoAsync(file)
                fileInfo.resourceType = 'Video'
              } else if (suffix === 'mp3') {
                fileInfo = await getAudioInfoAsync(file)
                fileInfo.resourceType = 'Audio'
              }
            }
            this.uploadImageToResource(
              file.name.substring(0, file.name.lastIndexOf('.')),
              url,
              fileInfo.resourceType,
              fileInfo
            )
          }
        }
      )
    },
    async addResourceFileChange(file, fileList, name, list) {
      if (file) {
        let fileInfo
        let suffix = file.name.substring(file.name.lastIndexOf('.') + 1)
        if (file.raw.type.includes('image')) {
          fileInfo = await getImageSizeAsync(file)
          fileInfo.resourceType = 'Image'
        } else {
          if (suffix === 'mp4') {
            fileInfo = await getVideoInfoAsync(file)
            fileInfo.resourceType = 'Video'
          } else if (suffix === 'mp3') {
            fileInfo = await getAudioInfoAsync(file)
            fileInfo.resourceType = 'Audio'
          }
        }
        console.log(fileInfo)
        this.customUploadObjectKey(
          {
            file: file,
            fileList: fileList,
            fileUrl: name,
            fileArray: list || 'fileList',
            objectKey: 'LibraryResource'
          },
          url => {
            if (url) {
              this.addResourceForm.url = url
              let filename = this.addResourceForm.name
                ? this.addResourceForm.name
                : file.name.substring(0, file.name.lastIndexOf('.'))
              fileInfo.url = url
              this.uploadFileInfo = fileInfo
              this.uploadImageToResource(
                filename,
                url,
                fileInfo.resourceType,
                fileInfo
              )
            }
          }
        )
      } else {
        return false
      }
    },
    uploadImageToResource(name, url, resourceType, property) {
      let moduleId
      let menus = storage.get('menus')
      moduleId = treeData2Arr(menus, 'subMenus').filter(
        o => o.path === '/library/topic'
      )[0].id
      console.log(moduleId)
      let data = {
        name: name,
        moduleId: moduleId,
        url: url,
        property: property,
        resourceType: resourceType,
        client: 'BackEnd'
      }
      uploadToResource(data)
    }
  }
}
</script>
<style lang="less" scoped>
.resource_list {
  width: 100%;
  &_item {
    &_media {
      border-radius: 10px;
      width: 100%;
      height: 120px;
      margin: 0 auto;
      border: 1px solid #ccc;
      vertical-align: middle;
      display: flex;
      align-items: center;
      .image-slot {
        width: 100%;
        height: 120px;
        text-align: center;
        background-color: #ccc;
        line-height: 120px;
        font-size: 12px;
      }
      &_audio {
        width: 100%;
      }
    }
    .item_operate {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
