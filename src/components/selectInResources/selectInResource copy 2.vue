<!-- 仅支持资源单选 -->
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
        <el-form-item>
          <el-button type="primary" @click="getResourcesList(1)">
            search
          </el-button>
        </el-form-item>
      </el-form>
      <div class="resource_list">
        <el-row :gutter="10">
          <el-radio-group v-model="selection" @change="selectResource">
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
import { getImageSizeAsync, checkImageSize } from '@/utility'
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
      selection: {}
    }
  },
  props: {
    uploadDialog: Boolean,
    resourceType: String,
    fileSize: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    if (this.resourceType) {
      this.findResourceForm.resourceType = this.resourceType
    }
  },
  methods: {
    loadError(e, item) {
      console.log(item)
      item.loadError = true
      // console.log(item)
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
        this.resourceTableData.data = res['resources']
      })
    },
    selectResource(row) {
      this.findResourcesDialog = false
      this.$emit('selectResource', row)
    },
    async fileChange(file, fileList, formName, list) {
      let fileInfo
      if (file && this.fileSize) {
        fileInfo = await getImageSizeAsync(file)
        if (!checkImageSize(file, this.fileSize.size)) {
          this.$notify.error({
            title: 'Error',
            message: `大小不超过${this.fileSize.size}kb`,
            duration: 3000
          })
          return
        }
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
          if (url) {
            let name = file.name.substring(0, file.name.lastIndexOf('.'))
            this.$emit('uploadFile', {
              name: name,
              url: url,
              fileInfo: fileInfo
            })
          }
        }
      )
    },
    close() {
      this.$emit('closeUploadDialog')
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
