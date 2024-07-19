<route-meta>
{
  "keepAlive":true
}
</route-meta>
<template>
  <div class="product-list">
    <el-form size="small" inline>
      <el-form-item label="标题">
        <el-input
          v-model="filters.searchName"
          @change="getList(1)"
          placeholder="查找..."
        >
        </el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-select
          v-model="filters.contentType"
          size="small"
          placeholder="请选择"
          @change="getList(1)"
        >
          <el-option label="全部" :value="null"></el-option>
          <el-option label="图文" :value="1"></el-option>
          <el-option label="视频" :value="2"></el-option>
          <el-option label="推文" :value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否需要海报">
        <el-select
          v-model="filters.isPoster"
          size="small"
          placeholder="请选择"
          @change="getList(1)"
        >
          <el-option label="全部" :value="null"></el-option>
          <el-option label="是" :value="true"></el-option>
          <el-option label="否" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getList(1)">
          搜索
        </el-button>
        <el-dropdown style="margin:0 10px;">
          <el-button type="primary" size="mini">
            添加<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="add('tweets')"
              >推文</el-dropdown-item
            >
            <el-dropdown-item @click.native="add('setting')"
              >圈文</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" size="mini" @click="changeSort"
          >更新排序</el-button
        >
        <!-- <el-button
          size="mini"
          type="success"
          :disabled="currentRow ? false : true"
          @click="handleCurrentClick('getContentUrl')"
          >生成地址</el-button
        >
        <el-button
          size="mini"
          type="success"
          :disabled="currentRow ? false : true"
          @click="handleCurrentClick('preview')"
          >预览</el-button
        >
        <el-button
          size="mini"
          type="danger"
          :disabled="currentRow ? false : true"
          @click="handleCurrentClick('delAction')"
          >删除</el-button
        > -->
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <table-list
        :tableData="tableData"
        :currentPage="filters.pageNo"
        :isUseMixin="false"
        @handleCurrentChange="handleCurrentChange"
        @handleTableCurrentChange="handleTableCurrentChange"
      >
        <el-table-column
          label="排序"
          slot="between"
          prop="sort"
          :width="100"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-input-number
              size="small"
              v-model="row.sort"
              style="width: 78px"
              :max="999"
              :min="0"
              controls-position="right"
              :controls="false"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="335">
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              :type="row.isTop ? 'warning' : 'primary'"
              :disabled="row.isTop ? true : false"
              @click="toTop(row)"
              >{{ row.isTop ? '已置顶' : '置顶' }}</el-button
            >
            <!-- <el-button
              size="mini"
              :type="row.isPushed ? 'warning' : 'primary'"
              @click="toPush(row)"
              :disabled="
                row.publishEndDate < new Date().getTime() ? true : false
              "
              >{{ row.isPushed ? '取消推送' : '推送' }}</el-button
            > -->
            <el-button size="mini" type="success" @click="getContentUrl(row)"
              >生成地址</el-button
            >
            <el-button size="mini" type="primary" @click="editAction(row)"
              >编辑</el-button
            >
            <el-button size="mini" type="success" @click="preview(row)"
              >预览</el-button
            >
            <el-button size="mini" type="danger" @click="delAction(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </table-list>
    </div>
    <!-- 图文、视频类发布预览 -->
    <el-drawer
      title="发布预览"
      custom-class="preview-dialog"
      :visible.sync="previewDetail"
      :with-header="false"
    >
      <div class="preview-wrap">
        <div class="preview-view">
          <div class="list-item">
            <div class="list-item-content">
              <div class="list-item-header">
                <div class="update-time-box">
                  <img
                    class="update-icon"
                    src="../../../images/library/update-icon.png"
                    alt=""
                  />
                  <span>更新于 {{ previewData.updatedDate }}</span>
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
                  :key="item"
                  >{{ item }}</span
                >
              </div>
              <div class="item-title" style="margin-bottom:10px;">
                {{ previewData.content }}
              </div>
              <el-row
                :gutter="5"
                class="list-item-resourse"
                v-if="previewData.contentType === 1"
              >
                <el-col :span="8" v-for="item in previewData.image" :key="item">
                  <!-- <img width="100%" class="list-item-img" :src="item" alt="" /> -->
                  <el-image
                    class="list-item-img"
                    :preview-src-list="previewData.image"
                    :src="item"
                    fit="cover"
                  ></el-image>
                </el-col>
              </el-row>
              <el-row
                :gutter="5"
                class="list-item-resourse"
                v-if="
                  previewData.contentType === 2 &&
                    previewData.video &&
                    previewData.video.videoUrl
                "
              >
                <!-- <img width="100%" class="list-item-img" :src="previewData.coverImageUrl" alt="" /> -->
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
              <div class="item-btn">
                <span class="copy">复制文案</span>
                <span class="download" v-if="previewData.contentType === 1"
                  >下载图片</span
                >
                <span class="download" v-else>下载视频</span>
                <span class="forword">转发</span>
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
    </el-drawer>
    <!-- 文章类发布预览 -->
    <el-drawer
      title="发布预览"
      custom-class="preview-dialog"
      :visible.sync="articlePreviewDetail"
      :with-header="false"
    >
      <div class="preview-wrap">
        <div class="preview-view">
          <div class="list-item">
            <div class="list-item-content">
              <div class="list-item-header">
                <div class="update-time-box">
                  <img
                    class="update-icon"
                    src="../../../images/library/update-icon.png"
                    alt=""
                  />
                  <span>更新于 {{ previewData.updatedDate }}</span>
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
                  :key="item"
                  >{{ item }}</span
                >
              </div>
              <div class="item-title climp">
                <span class="article-log">文章</span>
                {{ previewData.title }}
              </div>
              <div class="item-content">
                {{ previewData.content }}
              </div>
              <el-row class="list-item-resourse">
                <el-image
                  class="cover-image-url"
                  :src="previewData.coverImageUrl"
                  fit="cover"
                ></el-image>
              </el-row>
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
    </el-drawer>
    <el-dialog title="设置banner图" width="450px" :visible.sync="dialogToPush">
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
      <avatar-upload
        @change="
          (file, fileList) =>
            fileChange(
              file,
              fileList,
              'pushCoverImageUrl',
              'pushCoverImageList'
            )
        "
        list-type="picture"
        :imageUrl="pushCoverImageUrl"
        accept="image/png, image/jpeg"
      ></avatar-upload>
      <p class="text-center">* 尺寸320*320，大小不超过200kb</p>
      <div class="text-right">
        <el-button
          size="small"
          @click="
            dialogToPush = false
            pushCoverImageUrl = ''
            pushCoverImageList = []
          "
          >取消</el-button
        >
        <el-button type="primary" size="small" @click="push">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="openQRcodePop"
      width="300px"
      class="editor-dialog"
      :close-on-click-modal="false"
    >
      <div style="text-align: center; margin-top: -20px">
        <canvas ref="canvas" id="QRcanvas"></canvas>
      </div>
      <el-input
        size="mini"
        readonly
        v-model.trim="QRUrl"
        suffix-icon="el-icon-document-copy"
        @focus="copyQRUrl"
      ></el-input>
    </el-dialog>
  </div>
</template>

<script>
import avatarUpload from '@/components/avatarUpload'
import upload from '@/mixins/upload.js'
import TableList from '@/components/tableList.vue'
import storage from 'good-storage'
import QRCode from 'qrcode'
import { uploadToResource } from '@/api/index.js'
import {
  getContents,
  delContent,
  pushContent,
  sortContent,
  topContent,
  getContentDetail
} from '@/api/library/material.js'
import {
  formatDate,
  checkImageSize,
  getImageSizeAsync,
  clones,
  treeData2Arr,
  isLocalhost
} from '@/utility/index.js'
import restfulMixin from '@/mixins/restful.js'
// import Http from '@/api/http'
export default {
  name: 'MaterialManage',
  components: {
    TableList,
    avatarUpload
  },
  mixins: [restfulMixin, upload],
  data() {
    return {
      filters: {
        searchName: '',
        isPoster: null,
        contentType: null,
        pageSize: 20,
        pageNo: 1
      },
      dialogTitle: '添加',
      tableData: {
        header: [
          {
            tableId: 'id',
            tableWidth: '60',
            tableName: 'ID'
          },
          {
            tableId: 'title',
            minWidth: 200,
            tableName: '活动标题'
          },
          {
            tableId: 'contentType',
            tableName: '类型',
            tableWidth: '60',
            formatter: row => {
              switch (row.contentType) {
                case 1:
                  return '图文'
                case 2:
                  return '视频'
                case 5:
                  return '推文'
              }
            }
          },
          {
            tableId: 'publishStatus',
            tableName: '状态',
            tableWidth: '80',
            formatter: row => {
              return new Date(row.publishStartDate).getTime() >
                new Date().getTime()
                ? '未生效'
                : '已生效'
            }
          },
          {
            tableId: 'publishDate',
            tableName: '上线时间',
            tableWidth: '160',
            formatter: row => {
              return `${formatDate(row.publishStartDate)}${formatDate(
                row.publishEndDate
              )}`
            }
          },
          {
            tableId: 'updater',
            tableName: '操作人',
            tableWidth: 200,
            formatter: row => {
              return row.updatedBy ? row.updatedBy : row.createdBy
            }
          },
          {
            tableId: 'updaterTime',
            tableName: '操作时间',
            tableWidth: '160',
            formatter: row => {
              return row.updatedDate
                ? formatDate(new Date(row.updatedDate))
                : formatDate(new Date(row.createdDate))
            }
          }
        ],
        data: [],
        pageData: {
          pageSize: 20,
          totalCount: 0
        }
      },
      previewDetail: false,
      articlePreviewDetail: false,
      previewData: { video: {} },
      dialogToPush: false,
      pushCoverImageList: [],
      pushCoverImageUrl: '',
      pushId: null,
      form: {},
      originalData: [],
      openQRcodePop: false,
      QRUrl: '',
      publishDate: [],
      pushInfo: {},
      options: {
        disabledDate: date => {
          return this.setDisabledDate(date)
        }
      },
      currentRow: false
    }
  },
  created() {
    let filters = storage.get('materialFilters')
    if (filters) {
      this.filters = {
        searchName: filters.searchName,
        isPoster: filters.isPoster,
        contentType: filters.contentType,
        pageSize: filters.pageSize,
        pageNo: filters.pageNo
      }
    }
    this.getList()
  },
  beforeRouteLeave(to, form, next) {
    if (
      !(
        to.path === '/library/materialManage/setting' ||
        to.path === '/library/materialManage/tweets'
      )
    ) {
      storage.set('materialFilters', {
        searchName: '',
        isPoster: null,
        contentType: null,
        pageSize: 20,
        pageNo: 1
      })
    }
    next()
  },
  methods: {
    handleTableCurrentChange(row) {
      console.log(row)
      this.currentRow = row
    },
    handleCurrentClick(type) {
      switch (type) {
        case 'getContentUrl':
          return this.getContentUrl(this.currentRow)
        case 'preview':
          return this.preview(this.currentRow)
        case 'delAction':
          return this.delAction(this.currentRow)
      }
    },
    async fileChange(file, fileList, formName, list) {
      let imgInfo = await getImageSizeAsync(file)
      if (
        file &&
        checkImageSize(file, 200) &&
        imgInfo.width === 320 &&
        imgInfo.height === 320
      ) {
        this.customUploadObjectKey(
          {
            file: file,
            fileList: fileList,
            fileUrl: formName,
            fileArray: list,
            objectKey: 'LibraryResource'
          },
          url => {
            this[formName] = url
            if (url) {
              this.uploadImageToResource(
                file.name.substring(0, file.name.lastIndexOf('.')),
                url
              )
            }
          }
        )
      } else {
        this.$notify.error({
          title: 'Error',
          message: `尺寸为320*320，大小不超过200kb`,
          duration: 3000
        })
      }
    },

    uploadImageToResource(name, url) {
      let moduleId
      let menus = storage.get('menus')
      moduleId = treeData2Arr(menus, 'subMenus').filter(
        o => o.path === '/library/materialManage'
      )[0].id
      let data = {
        name: name,
        moduleId: moduleId,
        url: url,
        resourceType: 'Image',
        client: 'BackEnd'
      }
      uploadToResource(data)
    },
    getList(n) {
      if (n) {
        this.filters.pageNo = n
      }
      let data = {
        searchName: this.filters.searchName,
        isPoster: this.filters.isPoster,
        pageNo: this.filters.pageNo,
        pageSize: this.filters.pageSize
      }
      if (this.filters.contentType) {
        data.contentType = this.filters.contentType
      }
      getContents(data).then(res => {
        storage.set('materialFilters', this.filters)
        this.tableData.data = res.contents
        this.originalData = clones(this.tableData.data)
        this.tableData.pageData.totalCount = res.totalCount ? res.totalCount : 0
      })
    },
    handleCurrentChange(n) {
      this.filters.pageNo = n
      this.getList()
    },
    add(path) {
      this.$router.push({
        path: `/library/materialManage/${path}`
      })
    },
    editAction(row) {
      if (row.contentType === 5) {
        this.$router.push({
          path: '/library/materialManage/tweets',
          query: { id: row.id }
        })
      } else {
        this.$router.push({
          path: '/library/materialManage/setting',
          query: { id: row.id }
        })
      }
    },
    toTop(row) {
      this.$confirm(`请问是否确认要将当前活动内容置顶?`, 'Tips', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        topContent(row.id).then(res => {
          console.log(res)
          this.getList()
        })
      })
    },
    toPush(row) {
      if (row.isPushed) {
        this.$confirm(`请问是否确认要取消推送?`, 'Tips', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          pushContent(row.id).then(res => {
            console.log(res)
            this.getList()
          })
        })
      } else {
        this.dialogToPush = true
        this.pushInfo = row
        this.pushCoverImageUrl = row.bannerImageUrl
        this.pushId = row.id
      }
    },
    push() {
      if (this.pushCoverImageUrl) {
        pushContent(this.pushId, {
          bannerImageUrl: this.pushCoverImageUrl,
          publishStartDate:
            this.publishDate && this.publishDate[0]
              ? this.publishDate[0]
              : null,
          publishEndDate:
            this.publishDate && this.publishDate[1] ? this.publishDate[1] : null
        }).then(res => {
          console.log(res)
          this.dialogToPush = false
          this.getList()
        })
      }
    },
    setDisabledDate(date) {
      console.log(date)
      let startDate = this.pushInfo.publishStartDate,
        endDate = this.pushInfo.publishEndDate
      return date <= startDate || date >= endDate
    },
    preview(row) {
      console.log(row)

      getContentDetail(row.id).then(res => {
        console.log(res)
        if (row.contentType === 5) {
          this.articlePreviewDetail = true
        } else {
          this.previewDetail = true
        }
        res.labels = row.shwoLabelName
          ? row.shwoLabelName.split(',').splice(0, 3)
          : []
        console.log(res.labels)
        this.previewData = res
        this.previewData.updatedDate = formatDate(
          new Date(row.updatedDate),
          'YYYY-MM-DD'
        )
      })
    },
    delAction(row) {
      this.$confirm(`请问是否确认要删除当前活动内容?`, 'Tips', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delContent(row.id).then(res => {
            console.log(res)
            this.currentRow = null
            this.getList()
          })
        })
        .catch(() => {})
    },
    changeSort() {
      let data = []
      this.tableData.data.forEach((o, idx) => {
        if (
          o.id === this.originalData[idx].id &&
          o.sort !== this.originalData[idx].sort
        ) {
          data.push(o)
        }
      })
      data = data.map(o => ({
        id: Number(o.id),
        sort: Number(o.sort)
      }))
      if (!data.length) return
      sortContent({ contentSorts: data }).then(res => {
        console.log(res)
        this.getList()
      })
    },
    getContentUrl(row) {
      let env =
        location.host.includes('dev-') || isLocalhost()
          ? 'dev-'
          : location.host.includes('qa-')
          ? 'qa-'
          : location.host.includes('uat-')
          ? 'uat-'
          : ''
      this.QRUrl = `https://${env}content.xxxxxxx.com.cn/contents/${row.id}`
      this.openQRcodePop = true
      this.$nextTick(function() {
        var canvas = document.getElementById('QRcanvas')
        QRCode.toCanvas(canvas, this.QRUrl, function(error) {
          if (error) console.error(error)
          console.log('success!')
        })
      })
    },
    copyQRUrl() {
      this.$copyText(this.QRUrl)
      this.$message({
        type: 'success',
        message: '复制成功'
      })
    },
    quitQRcodePop() {
      this.$refs.canvas.innerHTML = ''
      this.openQRcodePop = false
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.preview-dialog {
  background-color: #f5f4f5;
  width: 400px !important;
  .el-drawer__body {
    overflow-y: auto;
    // padding-top: 20px;
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
        background-color: #fff;
        min-height: 1338px/2;
        .list-item {
          // margin: 0 auto;
          // width: 698px/2;
          // margin-bottom: 20px;
          // border-radius: 14px/2;
          padding: 30px/2;
          background-color: #fff;
          box-sizing: content-box;
          .list-item-content {
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
                // width: 638px/2;
                height: 273px/2;
              }
            }
            .comment-content {
              margin-top: -10px;
              // width: 598px/2;
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
      }
    }
  }
}
/deep/.avatar-uploader {
  margin: 20px auto;
  display: flex;
  justify-content: center;
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409eff;
    }
  }
}
/deep/.el-upload--picture-card {
  font-size: 28px;
  color: #8c939d;
  width: 160px;
  height: 160px;
  line-height: 160px;
  text-align: center;
}
/deep/.el-upload-list--picture-card .el-upload-list__item {
  width: 160px;
  height: 160px;
}
/deep/.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 160px;
  height: 160px;
  line-height: 160px;
  text-align: center;
}
/deep/.avatar {
  width: 160px;
  height: 160px;
  display: block;
}
</style>
