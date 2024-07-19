<!-- 仅支持图片资源、单选 -->
<template>
  <div>
    <!-- 上传资源、检索资源库 -->
    <el-dialog
      :visible.sync="uploadDialog"
      width="370px"
      title="资源选择"
      class="upload-dialog"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <i class="el-icon-close upload-close" @click="close"></i>
      <el-form size="small" label-width="100px" @submit.native.prevent>
        <el-form-item label="本地上传">
          <upload
            @change="
              (file, fileList) => fileChange(file, fileList, 'file', 'fileList')
            "
            :accept="acceptType"
            :multiple="false"
            :showFileList="false"
            btnName="上传"
          ></upload>
        </el-form-item>
        <el-form-item label="检索资料库">
          <el-input
            placeholder="请输入内容"
            v-model="searchName"
            @change="search"
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
    <el-dialog
      :visible.sync="findResourcesDialog"
      title="Find Resources"
      width="1210px"
    >
      <el-form :inline="true" label-width="100px" size="small">
        <el-form-item label="Name">
          <el-input v-model="findResourceForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Upload By">
          <el-input v-model="findResourceForm.uploadBy"></el-input>
        </el-form-item>
        <el-form-item label="Type">
          <el-select
            v-model="findResourceForm.resourceType"
            :disabled="acceptType != '*'"
            @change="resourceTypeChange"
            placeholder="请选择"
          >
            <el-option label="ALL" value=""></el-option>
            <el-option label="Video" value="video"></el-option>
            <el-option label="Audio" value="audio"></el-option>
            <el-option label="Image" value="Image"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getResourcesList(1)">
            search
          </el-button>
        </el-form-item>
      </el-form>
      <div class="resource_list">
        <el-row :gutter="10">
          <el-radio-group
            v-model="selection"
            @change="selectResource"
            style="width:100%"
          >
            <el-col
              :span="4"
              class="resource_list_item"
              v-for="item in resourceTableData.data"
              :key="item.id"
            >
              <el-image
                v-if="item.resourceType.toLowerCase() === 'image'"
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
                v-else-if="item.resourceType.toLowerCase() === 'audio'"
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
                v-else-if="item.resourceType.toLowerCase() === 'video'"
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
              <div class="resource_list_item_media" v-else>
                <img
                  :src="formatUrl(item)"
                  style="height:120px;width:auto;margin:0 auto;"
                />
              </div>
              <div class="item_operate">
                <el-radio :label="item" :disabled="item.loadError"
                  >选择</el-radio
                >
                <!-- <input type="checkbox" /> -->
                <el-button type="text" @click="copyResourceUrl(item)"
                  >复制链接</el-button
                >
              </div>
            </el-col>
          </el-radio-group>
        </el-row>
      </div>
      <div class="block page-box" v-if="resourceTableData.pageData">
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
    </el-dialog>
  </div>
</template>
<script>
import Http from '@/api/http'
import {
  getImageSizeAsync,
  getVideoInfoAsync,
  getAudioInfoAsync
} from '@/utility'
import upload from '@/mixins/upload'
export default {
  mixins: [upload],
  data() {
    return {
      form: {},
      searchName: '',
      findResourcesDialog: false,
      findResourceForm: {
        name: '',
        updateBy: '',
        resourceType: 'image'
      },
      resourceTableData: {
        data: [],
        pageData: {
          pageSize: 12,
          pageNo: 1,
          totalCount: 0
        }
      },
      selection: {}
    }
  },
  props: {
    uploadDialog: Boolean,
    fileSize: {
      type: Object,
      default: () => {}
    },
    acceptType: {
      type: String,
      default: 'image/png, image/jpeg'
    },
    unacceptType: {
      type: String,
      default: ''
    },
    resourceType: {
      type: String,
      default: 'Image'
    }
  },
  watch: {
    uploadDialog(show) {
      if (show) {
        if (this.acceptType === '*') {
          this.findResourceForm.resourceType = ''
        }
        if (this.resourceType) {
          this.findResourceForm.resourceType = this.resourceType
        }
        this.getResourcesList(1)
      }
    }
  },
  methods: {
    loadError(e, item) {
      console.log(item)
      item.loadError = true
      // console.log(item)
    },
    resourceTypeChange() {
      // this.$refs.searchTable.clearSelection()
      this.selection = {}
      this.getResourcesList(1)
    },
    search() {
      this.findResourceForm.name = this.searchName
      this.findResourcesDialog = true
      this.getResourcesList(1)
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
        if (res.totalCount) {
          this.resourceTableData.pageData.totalCount = res.totalCount
        }
        this.resourceTableData.data = res['resources'].map(o => {
          o.loadError = false
          return o
        })
      })
    },
    selectResource(row) {
      // 目前只有 工作室活动中资源列表 不接受 image 类型文件，后续有类似需求，自己加类型判断 😯
      if (this.acceptType === '*' && this.unacceptType) {
        if (row.resourceType === this.unacceptType) {
          this.$notify.error({
            title: 'Error',
            message: `不支持该类型文件，请重新选择`,
            duration: 3000
          })
          return
        }
      }
      // 沟通模块资源列表仅允许pdf格式文件
      if (this.acceptType === 'pdf') {
        if (row.resourceType.toLowerCase() !== 'pdf') {
          this.$notify.error({
            title: 'Error',
            message: `仅支持PDF格式文件，请重新选择！`,
            duration: 3000
          })
          return
        }
      }
      this.findResourcesDialog = false
      this.$emit('selectResource', row)
      this.selection = {}
    },
    async fileChange(file, fileList, formName, list) {
      // 目前只有 工作室活动中资源列表 不接受 image 类型文件，后续有类似需求，自己加类型判断 😯
      if (this.acceptType === '*' && this.unacceptType) {
        if (file.raw.type.includes('image')) {
          this.$notify.error({
            title: 'Error',
            message: `资源附件不支持图片类型`,
            duration: 3000
          })
          return
        }
      }
      // 沟通模块资源列表仅允许pdf格式文件
      if (this.acceptType === 'pdf') {
        if (this.formatFileType(file) !== 'pdf') {
          this.$notify.error({
            title: 'Error',
            message: `仅支持PDF格式文件，请重新上传！`,
            duration: 3000
          })
        }
      }
      if (this.fileSize) {
        if (file.size / 1024 > this.fileSize.size) {
          this.$notify.error({
            title: 'Error',
            message: `大小不超过${this.fileSize.size}kb`,
            duration: 3000
          })
          return
        }
      }
      let fileInfo
      if (file.raw.type.includes('image')) {
        fileInfo = await getImageSizeAsync(file)
      }
      if (file.raw.type.includes('video')) {
        fileInfo = await getVideoInfoAsync(file)
      }
      if (file.raw.type.includes('audio')) {
        fileInfo = await getAudioInfoAsync(file)
      }
      this.customUploadObjectKey(
        {
          file: file,
          fileList: fileList,
          fileUrl: formName,
          fileArray: list,
          objectKey: 'LibraryResource'
        },
        url => {
          let fileType = url ? this.formatFileType(file) : ''
          if (url) {
            let name = file.name.substring(0, file.name.lastIndexOf('.'))
            this.$emit('uploadFile', {
              name: name,
              url: url,
              fileInfo: fileInfo,
              fileType
            })
          }
        }
      )
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
      console.log(item)
      if (item.resourceType === 'image') {
        return item.url
      } else {
        switch (item.resourceType) {
          case 'mp4':
            return require(`../../images/library/mp4.png`)
          case 'xls':
          case 'xlsx':
          case 'excel':
            return require(`../../images/library/excel.png`)
          case 'pdf':
            return require(`../../images/library/pdf.png`)
          case 'ppt':
          case 'pps':
          case 'pptx':
            return require(`../../images/library/ppt.png`)
          case 'doc':
          case 'docx':
          case 'word':
            return require(`../../images/library/word.png`)
          default:
            return require(`../../images/library/unknown.png`)
        }
      }
    },
    copyResourceUrl(item) {
      this.$copyText(item.url)
      this.$message({
        type: 'success',
        message: '复制成功'
      })
    },
    close() {
      this.$emit('closeUploadDialog')
      this.selection = {}
    }
  }
}
</script>
<style lang="less" scoped>
.upload-close {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  font-size: 20px;
}
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
