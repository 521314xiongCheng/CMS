<template>
  <div>
    <el-dialog
      :visible.sync="findResourcesDialog"
      title="Find Resources"
      :show-close="false"
      :close-on-click-modal="false"
      width="1210px"
    >
      <i class="el-icon-close upload-close" @click="close"></i>
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
            :disabled="acceptType !== '*'"
            placeholder="请选择"
          >
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
          <el-checkbox-group
            v-if="multiple"
            v-model="selections"
            @change="multipleChange"
          >
            <el-col
              :span="4"
              class="resource_list_item"
              v-for="item in resourceTableData.data"
              :key="item.id"
            >
              <el-image
                v-if="findResourceForm.resourceType.toLowerCase() === 'image'"
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
                v-if="findResourceForm.resourceType.toLowerCase() === 'audio'"
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
                v-if="findResourceForm.resourceType.toLowerCase() === 'video'"
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
                <el-button type="text" @click="copyResourceUrl(item)"
                  >复制链接</el-button
                >
              </div>
            </el-col>
          </el-checkbox-group>
          <el-radio-group v-model="selection" v-else @change="selectResource">
            <el-col
              :span="4"
              class="resource_list_item"
              v-for="item in resourceTableData.data"
              :key="item.id"
            >
              <el-image
                v-if="findResourceForm.resourceType.toLowerCase() === 'image'"
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
                v-if="findResourceForm.resourceType.toLowerCase() === 'audio'"
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
                v-if="findResourceForm.resourceType.toLowerCase() === 'video'"
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
      <div slot="footer" v-if="multiple">
        <el-button @click="close" size="mini">
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
import Http from '@/api/http'
import upload from '@/mixins/upload'
export default {
  mixins: [upload],
  data() {
    return {
      form: {},
      searchName: '',
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
      selection: {},
      selections: []
    }
  },
  props: {
    findResourcesDialog: Boolean,
    resourceType: {
      type: String,
      default: 'image'
    },
    queryName: String,
    fileSize: {
      type: Object,
      default: () => {}
    },
    acceptType: {
      type: String,
      default: 'image'
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    findResourcesDialog(show) {
      if (show) {
        this.findResourceForm.resourceType = this.resourceType
        this.findResourceForm.name = this.queryName
        this.getResourcesList(1)
      }
    }
  },
  methods: {
    loadError(e, item) {
      item.loadError = true
    },
    copyResourceUrl(item) {
      this.$copyText(item.url)
      this.$message({
        type: 'success',
        message: '复制成功'
      })
    },
    search() {
      this.findResourceForm.name = this.searchName
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
      if (this.acceptType) {
        if (row.resourceType.toLowerCase() !== this.acceptType.toLowerCase()) {
          this.$notify.error({
            title: 'Error',
            message: `不支持该类型文件，请重新选择`,
            duration: 3000
          })
          return
        }
      }
      this.$emit('selectResource', row)
      this.selection = {}
    },
    multipleChange(data) {
      console.log(data)
      this.$emit('multipleChange', data)
    },
    addResourceHandle() {
      this.$emit('addResourceHandle', this.selections)
      this.selections = []
    },
    onExceed() {
      // 超出限制
      this.selections.pop()
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
