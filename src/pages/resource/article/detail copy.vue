<!-- X component -->
<template>
  <div class="article-detail">
    <el-form
      :model="form"
      ref="form"
      size="small"
      :rules="rules"
      label-width="180px"
    >
      <el-row>
        <el-col :span="16">
          <el-form-item label="Article Id">
            <el-input
              v-model="form.id"
              disabled
              placeholder="Automatic generation of articles after creation"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Status" prop="state">
            <el-select v-model="form.state" placeholder="请选择">
              <el-option label="valid" :value="1"></el-option>
              <el-option label="invalid" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="Client" prop="clientIds">
        <el-checkbox-group v-model="form.clientIds">
          <el-checkbox v-for="item in clients" :key="item.id" :label="item.id">
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Type" prop="type">
        <el-radio-group v-model="form.type" :disabled="isEdit">
          <el-radio label="Desktop">Desktop</el-radio>
          <el-radio label="Mobile">Mobile</el-radio>
          <el-radio label="Struct">Struct</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="IsToken" prop="isToken">
        <el-checkbox v-model="form.isToken" :disabled="isEdit"></el-checkbox>
      </el-form-item>
      <el-form-item label="Article Title" prop="title">
        <el-input
          v-model="form.title"
          placeholder="input Article Title"
        ></el-input>
        <span class="remark"> within 40 characters </span>
      </el-form-item>
      <el-form-item label="Summary" prop="summary">
        <el-input
          v-model="form.summary"
          type="textarea"
          :rows="2"
          :maxlength="500"
          placeholder="Please Ente summary"
        ></el-input>
      </el-form-item>
      <el-form-item label="Rectangle Cover Image" prop="rectangleCoverImageUrl">
        <el-input
          v-model="form.rectangleCoverImageUrl"
          style="position: absolute; left: 90px; width: 330px"
        ></el-input>
        <upload
          @change="rectangleCoverImageFileChange"
          accept="image/png, image/jpeg"
          :fileList="rectangleCoverImageUrlList"
        ></upload>
      </el-form-item>
      <transition name="show">
        <div class="more-information" v-show="showMoreInformation">
          <el-form-item label="Article Subtitle" prop="subtitle">
            <el-input
              v-model="form.subTitle"
              placeholder="input Article Subtitle"
            ></el-input>
            <span class="remark"> within 40 characters </span>
          </el-form-item>
          <el-form-item label="Square Cover Image" prop="squareCoverImageUrl">
            <el-input
              v-model="form.squareCoverImageUrl"
              style="position: absolute; left: 90px; width: 330px"
            ></el-input>
            <upload
              @change="squareCoverImageFileChange"
              accept="image/png, image/jpeg"
              :fileList="squareCoverImageUrlList"
            ></upload>
          </el-form-item>
          <el-form-item label="Share Title" prop="shareTitle">
            <el-input v-model="form.shareTitle" :max="20"></el-input>
            <span class="remark"> within 20 characters </span>
          </el-form-item>
          <el-form-item label="Share Words" prop="shareWords">
            <el-input
              v-model="form.shareWords"
              type="textarea"
              :max="100"
            ></el-input>
            <span class="remark"> within 100 characters </span>
          </el-form-item>
          <el-form-item label="Share Image" prop="shareImageUrl">
            <el-input
              v-model="form.shareImageUrl"
              style="position: absolute; left: 90px; width: 330px"
            ></el-input>
            <upload
              @change="shareImageFileChange"
              accept="image/png, image/jpeg"
              :fileList="shareImageUrlList"
            ></upload>
          </el-form-item>
          <!-- 初始点赞数 -->
          <el-form-item label="Initial like" prop="initialLike">
            <el-input
              v-model="form.initialLike"
              type="number"
              :min="0"
              :disabled="isEdit"
            ></el-input>
            <span class="remark">be filled only one time</span>
          </el-form-item>
          <el-form-item label="Support Audio">
            <el-checkbox v-model="form.supportAudio">Support Audio</el-checkbox>
          </el-form-item>
          <el-form-item label="Tag" prop="tagIds">
            <el-select
              v-model="form.tagIds"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择文章标签"
            >
              <el-option
                v-for="item in tags"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </transition>
      <p @click="moreInformationHandle" class="show-information-handle">
        <a v-if="showMoreInformation">
          Hide More Information <i class="el-icon-arrow-up"></i>
        </a>
        <a v-else> Show More Information <i class="el-icon-arrow-down"></i> </a>
      </p>
      <!-- 文本编辑器 -->
      <el-form-item class="ckeditor-wrap">
        <tinymce
          id="tinymceTextarea"
          :init="editorConfigs"
          v-model="editorContent"
        ></tinymce>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel">Cancel</el-button>
        <el-button type="primary" @click="save">Save</el-button>
      </el-form-item>
    </el-form>
    <el-button type="text" @click="changeLog" v-if="articleId">
      {{ showChangeLog ? 'Hide' : 'Show' }} Change Log
    </el-button>
    <article-update-record :article-id="articleId" v-show="showChangeLog">
    </article-update-record>
    <el-dialog
      :visible.sync="showAddResourceDialog"
      title="Add Resource"
      @close="closeAddResourceDialog"
    >
      <el-form
        :model="addResourceForm"
        label-width="120px"
        ref="addResourceForm"
      >
        <el-form-item label="name" prop="name">
          <el-input
            v-model="addResourceForm.name"
            placeholder="Please enter resource name"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="Module Name" prop="moduleId">
          <el-select v-model="addResourceForm.moduleId" placeholder="请选择">
            <el-option
              v-for="module in modules"
              :key="module.id"
              :label="module.name"
              :value="module.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="resourceUrl" prop="url">
          <el-input
            v-model="addResourceForm.url"
            style="position: absolute; left: 90px; width: 330px"
          ></el-input>
          <upload
            @change="handleUploadResourceChange"
            accept="image/png, image/jpeg, video/mp4, audio/mp3"
            :fileList="resourceUrlList"
          ></upload>
          <!-- <span class="remark upload-remark">
            make sure the picture size is 400*400
          </span>-->
        </el-form-item>
        <el-form-item label="Resource Type" prop="resourceType">
          <el-select
            v-model="addResourceForm.resourceType"
            placeholder="请选择"
          >
            <el-option label="Image" value="Image"></el-option>
            <el-option label="Video" value="Video"></el-option>
            <el-option label="Audio" value="Audio"></el-option>
          </el-select>
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
    <el-dialog
      :visible.sync="showFindResourcesDialog"
      title="Find Resources"
      width="1210px"
    >
      <el-form :inline="true" label-width="130px" size="small">
        <el-row>
          <el-form-item label="Video Name">
            <el-input v-model="findResourceForm.videoName"></el-input>
          </el-form-item>
          <el-form-item label="Upload By">
            <el-input v-model="findResourceForm.uploadBy"></el-input>
          </el-form-item>
          <el-form-item label="Module Path">
            <el-input v-model="findResourceForm.modulePath"></el-input>
          </el-form-item>
          <el-form-item label="Client">
            <el-checkbox-group v-model="findResourceForm.client">
              <el-checkbox
                v-for="item in clients"
                :key="item.id"
                :label="item.id"
              >
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="21">
            <el-form-item label="Upload Start Date">
              <el-date-picker
                v-model="findResourceForm.uploadStartTimestamp"
                type="date"
                value-format="timestamp"
                placeholder="Select Start Date"
                style="width: 180px"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="Upload End Date">
              <el-date-picker
                v-model="findResourceForm.uploadStartTimestamp"
                type="date"
                value-format="timestamp"
                placeholder="Select End Date"
                style="width: 180px"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="Resource Type">
              <el-select
                v-model="findResourceForm.resourceType"
                placeholder="请选择"
              >
                <el-option label="Video" value="video"></el-option>
                <el-option label="Audio" value="audio"></el-option>
                <el-option label="Image" value="Image"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="getResourcesList">
              search
            </el-button>
          </el-col>
        </el-row>
      </el-form>
      <table-list
        :tableData="resourceTableData"
        :choosePageFn="chooseResourcePageFn"
      >
        <el-table-column label="Copy" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="copyResourceUrl(scope)">
              copyResourceUrl
            </el-button>
          </template>
        </el-table-column>
      </table-list>
    </el-dialog>
    <el-dialog
      :visible.sync="showPreviewDialog"
      top="5vh"
      title="Preview"
      width="900px"
    >
      <el-tabs tab-position="right">
        <el-tab-pane label="pc">
          <div class="preview-pc-wrap">
            <article-preview
              :data="articlePreviewData"
              model="pc"
            ></article-preview>
          </div>
        </el-tab-pane>
        <el-tab-pane label="mobile">
          <div class="preview-mobile-wrap">
            <article-preview
              :data="articlePreviewData"
              model="mobile"
            ></article-preview>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog
      title="Insert Custom"
      :visible.sync="showUploadCustomImageDialog"
      width="600px"
    >
      <el-form
        label-width="130px"
        ref="insertCustomFrom"
        :model="currentCustomForm"
      >
        <el-form-item label="Custom Label">
          <el-input
            v-model="currentCustomForm.name"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="Custom Note">
          <el-input
            v-model="currentCustomForm.note"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="Custom Name"
          prop="customProductName"
          :rules="{ required: true, message: 'Please enter customName' }"
        >
          <el-input v-model="currentCustomForm.customProductName"></el-input>
        </el-form-item>
        <el-form-item
          label="Custom Value"
          prop="customProductValue"
          :rules="{ required: true, message: 'Please enter customValue' }"
        >
          <el-input v-model="currentCustomForm.customProductValue"></el-input>
        </el-form-item>
        <el-form-item label="Custom Image" v-if="currentCustomForm.imageState">
          <el-input
            v-model="customImageUrl"
            style="position: absolute; left: 90px; width: 330px"
          >
          </el-input>
          <upload
            @change="customImageFileChange"
            accept="image/png, image/jpeg"
            :fileList="customImageUrlList"
          ></upload>
        </el-form-item>
        <el-form-item>
          <el-button @click="insertImageCustomCancel">Cancel</el-button>
          <el-button type="primary" @click="insertImageCustomConfirm"
            >Insert</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- imgdialog 图片编辑-->

    <el-dialog
      title="Insert/Edit Link"
      :visible.sync="linkdialog"
      width="480px"
      label-position="left"
    >
      <el-form :model="linkform">
        <el-form-item label="App URL" :label-width="formLabelWidth">
          <el-input v-model="linkform.rcapp" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="小程序 URL" :label-width="formLabelWidth">
          <el-input v-model="linkform.rcmini" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="网页 URL" :label-width="formLabelWidth">
          <el-input v-model="linkform.local" autocomplete="off"></el-input>
        </el-form-item>

        <!-- <el-form-item label="TITLE" :label-width="formLabelWidth">
          <el-input v-model="linkform.name" autocomplete="off"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="linkdialog = false">Cancel</el-button>
        <el-button type="primary" @click="linkdialogSave()">Save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)

import Http from '@/api/http'
import uploadMixin from '@/mixins/upload.js'
import restfulMixin from '@/mixins/restful.js'
import TableList from '@/components/tableList.vue'
import Tinymce from 'tinymce-vue-custom'
import 'tinymce/icons/default'
import upload from '@/utility/upload'
import { assignObj, readUserInfo } from '@/utility'
import {
  htmlSplitCustom,
  structuredHtml,
  htmlSplitMedia,
  htmlSplitImage,
  htmlSplitText,
  article2RichText,
  tinyMCECreatePlugins,
  tinyMCEInsertCustom
} from '@/utility/tinyMCE_util'
import ArticleUpdateRecord from '@/components/articleUpdateRecord'
import ArticlePreview from '@/components/articlePreview'
export default {
  data() {
    const that = this
    return {
      linkform: {
        rcapp: '',
        rcmini: '',
        local: ''
      },
      formLabelWidth: '120px',
      articleId: '',
      isEdit: false,
      linkdialog: false,
      showMoreInformation: false,
      form: {
        state: 1,
        clientIds: [],
        type: 'Struct',
        isToken: true,
        title: '',
        summary: '',
        language: '',
        subTitle: '',
        squareCoverImageUrl: '',
        rectangleCoverImageUrl: '',
        shareTitle: '',
        shareWords: '',
        shareImageUrl: '',
        tagIds: [],
        initialLike: 0,
        supportAudio: false,
        articleDetails: {}
      },
      rules: {
        title: {
          required: true,
          message: 'Please enter title'
        },
        type: {
          required: true,
          message: 'Please select type'
        },
        clientIds: {
          required: true,
          message: 'Please select Client'
        },
        state: {
          required: true,
          message: 'Please select Status'
        },
        language: {
          required: true,
          message: 'Please select language'
        }
      },
      clients: [],
      squareCoverImageUrlList: [],
      rectangleCoverImageUrlList: [],
      shareImageUrlList: [],
      tags: [],
      customs: [],
      editorContent: '',
      editor: null,
      editorConfigs: {
        selector: 'tinymceTextarea',
        height: '600px',
        // language: 'zh_CN',
        //插件配置
        plugins: [
          'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
          'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
          'save table directionality emoticons template paste media preview code',
          'contextmenu'
        ],
        fontsize_formats: '12px 14px 16px 18px 24px 36px 42px 48px',
        // plugins: ['link image media code preview'],
        //工具栏
        toolbar: [
          'undo redo',
          'styleselect bold italic alignleft aligncenter alignright bullist numlist',
          'updatelink',
          'image media',
          'searchResource',
          'uploadResource',
          'mytest',
          'customButton imgTextWrapping setBlockStyle previewMobile ImageGroup'
        ],
        contextmenu: 'mytest inserttable image',
        // valid_elements:"a[name|href|target|title],",
        //valid_elements:'a[data-rcapp|data-rcmini|data-local|temo]',
        // extended_valid_elements:
        //   'video[onclick|controlslist|controls|poster|width|height]'+'a[data-rcapp|data-rcmini|data-local]',
        extended_valid_elements:
          'video[onclick|controlslist|controls|poster|width|height],a[href|data-rcapp|data-rcmini|data-local|temo]',
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
        images_upload_handler: function(blobInfo, success, failure, node) {
          const file = blobInfo.blob()
          console.log(file, 'node')
          upload(file)
            .then(url => {
              success(url)
              Http({
                url: 'system/resources',
                method: 'POST',
                data: {
                  url,
                  resourceType: 'Image',
                  name: that.form.title,
                  moduleId: that.imageModuleId,
                  client: 'BackEnd'
                }
              }).then(() => {
                that.$message({
                  type: 'success',
                  message: '图片已上传资源库'
                })
              })
            })
            .catch(err => failure(err))
        },

        media_live_embeds: true,
        media_poster: true,
        urlconverter_callback: function(url, node, on_save, name) {
          return url
        },
        video_template_callback: function(data) {
          console.log(`<video controls="controls" controlslist="nodownload" width="${
            data.width
          }" height="${data.height}" ${
            data.poster ? 'poster="' + data.poster + '"' : ''
          } >
              <source src="${data.source}" ${
            data.sourcemime ? 'type="' + data.sourcemime + '"' : ''
          } />
              ${
                data.source2
                  ? '<source src="' +
                    data.source2 +
                    '"' +
                    (data.source2mime
                      ? ' type="' + data.source2mime + '"'
                      : '') +
                    ' />'
                  : ''
              }
            </video>`)

          return `<video controls="controls" controlslist="nodownload" poster="${
            data.poster
          }" width="${data.width}" height="${data.height}">
              <source src="${data.source}" ${
            data.sourcemime ? 'type="' + data.sourcemime + '"' : ''
          }/>
              ${
                data.source2
                  ? '<source src="' +
                    data.source2 +
                    '"' +
                    (data.source2mime
                      ? ' type="' + data.source2mime + '"'
                      : '') +
                    ' />'
                  : ''
              }
            </video>`
        },
        setup(editor) {
          that.editor = editor
          tinyMCECreatePlugins(that, editor)
        }
      },
      showUploadCustomImageDialog: false,
      currentCustomForm: {
        customProductName: '',
        customProductValue: ''
      },
      customImageUrl: '',
      customImageUrlList: [],
      showPreviewDialog: false,
      structArticleDetail: [],
      isEditMode: false,
      showAddResourceDialog: false,
      showFindResourcesDialog: false,
      resourceTableData: {
        header: [
          {
            tableId: 'id',
            tableName: 'Id'
          },
          {
            tableId: 'name',
            tableName: 'Name'
          },
          {
            tableId: 'resourceType',
            tableName: 'Resource Type'
          },
          {
            tableId: 'url',
            tableName: 'Url'
          },
          {
            tableId: 'client',
            tableName: 'Client'
          }
        ],
        data: [],
        pageData: {
          pageSize: 20,
          totalCount: 0
        }
      },
      findResourceForm: {
        videoName: '',
        uploadBy: '',
        resourceType: 'Image',
        uploadEndTimestamp: '',
        uploadStartTimestamp: '',
        client: [],
        modulePath: ''
      },
      addResourceForm: {
        name: '',
        moduleId: '',
        url: '',
        resourceType: '',
        client: 'BackEnd'
      },
      imageModuleId: 0,
      resourceUrlList: [],
      modules: [],
      showChangeLog: false
    }
  },
  watch: {
    editorContent(val) {
      const {
        form: { type }
      } = this
      if (type === 'Struct') {
        this.structArticleDetail = this.parseRichText(val)
      } else {
        this.structArticleDetail = structuredHtml(htmlSplitCustom(val))
      }
    },
    ['form.type'](type) {
      if (type === 'Struct') {
        this.structArticleDetail = this.parseRichText(this.editorContent)
      } else {
        this.structArticleDetail = structuredHtml(
          htmlSplitCustom(this.editorContent)
        )
      }
    },
    ['addResourceForm.url'](val) {
      if (!val) {
        return
      }
      if (
        val.indexOf('.jpeg') > -1 ||
        val.indexOf('.png') > -1 ||
        val.indexOf('.jpg') > -1
      ) {
        this.addResourceForm.resourceType = 'Image'
      } else if (val.indexOf('.mp4') > -1) {
        this.addResourceForm.resourceType = 'Video'
      } else if (val.indexOf('.mp3') > -1) {
        this.addResourceForm.resourceType = 'Audio'
      }
    }
  },
  computed: {
    articlePreviewData() {
      return {
        type: this.form.type,
        articleDetails: this.structArticleDetail
      }
    }
  },
  created() {
    const { articleId, duplicateId } = this.$route.query
    if (articleId) {
      this.isEdit = true
    }
    this.articleId = articleId || duplicateId
    this.initData()
    if (articleId || duplicateId) {
      const id = articleId || duplicateId
      Http({
        url: `articles/${id}/details`
      }).then(({ article }) => {
        if (articleId) {
          this.isEditMode = true
          this.$set(this.form, 'id', article.id)
        }
        article.clients.forEach(item => {
          if (item.isCheck) {
            this.form.clientIds.push(item.id)
          }
        })
        article.tags.forEach(item => {
          this.form.tagIds.push(item.id)
        })
        if (article.rectangleCoverImageUrl) {
          this.rectangleCoverImageUrlList = [
            {
              name: article.rectangleCoverImageUrl,
              url: article.rectangleCoverImageUrl
            }
          ]
        }
        if (article.squareCoverImageUrl) {
          this.squareCoverImageUrlList = [
            {
              name: article.squareCoverImageUrl,
              url: article.squareCoverImageUrl
            }
          ]
        }
        if (article.shareImageUrl) {
          this.shareImageUrlList = [
            {
              name: article.shareImageUrl,
              url: article.shareImageUrl
            }
          ]
        }
        for (const key in article) {
          if (this.form.hasOwnProperty(key)) {
            if (key === 'supportAudio') {
              this.form[key] = article[key] ? true : false
            } else {
              this.form[key] = article[key]
            }
          }
        }
        this.editorContent = article2RichText(
          article.articleDetails,
          this.form.type
        )
      })
    }
  },
  mixins: [uploadMixin, restfulMixin],
  methods: {
    linkdialogSave() {
      let blocks = this.editor.selection.getSelectedBlocks()
      blocks.forEach(block => {
        let aLink = block.querySelector('a')
        let addelemtA = document.createElement('a')
        addelemtA.setAttribute('data-rcapp', this.linkform.rcapp)
        addelemtA.setAttribute('data-rcmini', this.linkform.rcmini)
        addelemtA.setAttribute('data-local', this.linkform.local)
        addelemtA.setAttribute('href', this.linkform.local)
        if (aLink) {
          let firstChild = aLink.firstChild
          addelemtA.appendChild(firstChild)
          block.replaceChild(addelemtA, aLink)
        } else {
          let firstChild = block.firstChild
          firstChild.parentNode.replaceChild(addelemtA, firstChild)
          addelemtA.appendChild(firstChild)
          block.appendChild(addelemtA)
        }
      })
      console.log(this.editor.getContent())
      if (this.form.type === 'Struct') {
        this.structArticleDetail = this.parseRichText(this.editor.getContent())
      } else {
        this.structArticleDetail = structuredHtml(
          htmlSplitCustom(this.editor.getContent())
        )
      }
      this.linkdialog = false
    },
    initData() {
      const userInfo = readUserInfo()
      // console.log(userInfo)
      Http({
        url: `system/accounts/${userInfo.id}/client?state=1`
      }).then(res => {
        this.clients = res['clients']
      })

      Http({
        url: 'system/tags'
      }).then(res => {
        this.tags = res['tags'].filter(item => item.state)
      })

      Http({
        url: 'articles/detail/customs'
      }).then(res => {
        this.customs = res['customs']
      })

      Http({
        url: 'system/unExternal/modules'
      }).then(res => {
        this.modules = res['modules']
        const imageModule = res['modules'].filter(item => item.name === 'Image')
        if (imageModule.length === 1) {
          this.imageModuleId = imageModule[0].id
        }
      })
    },
    squareCoverImageFileChange(file, fileList) {
      this.handleUpload(
        file,
        fileList,
        'squareCoverImageUrl',
        'squareCoverImageUrlList'
      )
    },
    rectangleCoverImageFileChange(file, fileList) {
      this.handleUpload(
        file,
        fileList,
        'rectangleCoverImageUrl',
        'rectangleCoverImageUrlList'
      )
    },
    shareImageFileChange(file, fileList) {
      this.handleUpload(file, fileList, 'shareImageUrl', 'shareImageList')
    },
    save() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        console.log(this.structArticleDetail)
        // this.form.editorContent = this.form.editorContent.replace(
        //   'localhost',
        //   ''
        // )
        this.form.articleDetails = this.structArticleDetail

        const data = JSON.parse(JSON.stringify(this.form))
        data.supportAudio = this.form.supportAudio * 1

        if (this.isEditMode) {
          return Http({
            url: `articles/${this.form.id}`,
            method: 'PUT',
            data
          }).then(res => {
            if (res.result) {
              this.$message({
                message: '更新文章成功',
                type: 'success'
              })
              this.$router.push({ name: 'resource-article-index' })
            }
          })
        }

        Http({
          url: 'articles',
          method: 'POST',
          data
        }).then(res => {
          if (res.result) {
            this.$message({
              message: '新增文章成功',
              type: 'success'
            })
            this.$router.push({ name: 'resource-article-index' })
          }
        })
      })
    },
    cancel() {
      this.$router.back()
    },
    parseRichText(html) {
      if (!html) return []
      return htmlSplitText(
        htmlSplitImage(htmlSplitMedia(htmlSplitCustom(html)))
      )
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
      })
    },
    chooseResourcePageFn(pageNo) {
      this.getResourcesList(pageNo)
    },
    copyResourceUrl(scope) {
      this.$copyText(scope.row.url)
      this.$message({
        type: 'success',
        message: '复制成功'
      })
      // window.tinymce
      //   .get('tinymceTextarea')
      //   .insertContent(
      //     `<video class="wscnph" src="${
      //       scope.row.url
      //     }" poster="https://dev-community-s3.xxxxxxx.com.cn/DEV/MyBizxxxxxxx_Content_Cms/20190517065249_40.jpeg"></video>`
      //   )
    },
    handleUploadResourceChange(file, fileList) {
      this.addResourceForm['url'] = ''
      if (!file) {
        this.resourceUrlList = []
        return
      }
      if (!this.checkImageSize(file)) return
      this.resourceUrlList = fileList
      upload(file.raw)
        .then(url => {
          this.addResourceForm.url = url
        })
        .catch(() => {
          this.resourceUrlList = []
          this.addResourceForm.url = ''
        })
    },
    closeAddResourceDialog() {
      this.$refs['addResourceForm'].resetFields()
      this.resourceUrlList = []
    },
    addResourceHandle() {
      this.$refs['addResourceForm'].validate(valid => {
        if (!valid) {
          return
        }
        Http({
          url: 'system/resources',
          method: 'POST',
          data: this.addResourceForm
        }).then(res => {
          if (res.result) {
            this.$message({
              type: 'success',
              message: '新增资源成功'
            })
            this.$copyText(this.addResourceForm.url)
            this.$message({
              type: 'success',
              message: '已复制当前上传资源Url'
            })
            this.showAddResourceDialog = false
          }
        })
      })
    },
    changeLog() {
      this.showChangeLog = !this.showChangeLog
    },
    customImageFileChange(file, fileList) {
      this.customImageUrl = ''
      if (!file) {
        this.customImageUrlList = []
        return
      }
      if (!this.checkImageSize(file)) return
      this.customImageUrlList = fileList
      upload(file.raw)
        .then(url => {
          // console.log(url)
          this.customImageUrl = url
        })
        .catch(() => {
          this.customImageUrlList = []
          this.customImageUrl = ''
        })
    },
    insertImageCustomConfirm() {
      this.$refs['insertCustomFrom'].validate(valid => {
        if (valid) {
          tinyMCEInsertCustom(
            this.editor,
            assignObj(this.currentCustomForm, { imageUrl: this.customImageUrl })
          )
          this.$refs['insertCustomFrom'].resetFields()
          this.insertImageCustomCancel()
        }
      })
    },
    insertImageCustomCancel() {
      this.currentCustomForm = {}
      this.customImageUrl = ''
      this.customImageUrlList = []
      this.showUploadCustomImageDialog = false
    },
    moreInformationHandle() {
      const { showMoreInformation } = this
      this.showMoreInformation = !showMoreInformation
    }
  },
  components: {
    TableList,
    ArticleUpdateRecord,
    Tinymce,
    ArticlePreview
  }
}
</script>

<style lang="less" scoped>
.article-detail {
  width: 860px;

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
.show-information-handle {
  text-align: center;
  cursor: pointer;
  margin: 40px 0;
  a {
    color: #409eff;
  }
}
.show-enter-active {
  animation: show-in 0.6s;
}
.show-leave-active {
  animation: show-in 0.6s reverse;
}
@keyframes show-in {
  0% {
    height: 0;
  }
  100% {
    height: 524px;
  }
}
</style>
