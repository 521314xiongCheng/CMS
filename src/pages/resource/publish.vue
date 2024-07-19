<template>
  <div>
    <div class="el-menu g-page-bar">
      <!-- <span class="page-title">Article - Publish</span> -->
      <el-form :inline="true">
        <el-form-item label="ID" prop="id">
          <el-input
            v-model="filters.id"
            auto-complete="off"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="Title" prop="title">
          <el-input
            v-model="filters.title"
            auto-complete="off"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="Client" prop="clientId">
          <el-select
            v-model="filters.clientId"
            size="small"
            placeholder="请选择"
            @change="handleSearch"
          >
            <el-option
              v-for="(item, index) in clients"
              :label="item.name"
              :key="index"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="PublishState" prop="publishState">
          <el-select
            v-model="filters.publishState"
            size="small"
            @change="handleSearch"
          >
            <el-option label="All" value></el-option>
            <el-option label="Publish" :value="1"></el-option>
            <el-option label="Unpublish" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="handleSearch"
            >Query</el-button
          >
          <el-button type="primary" size="small" @click="add"
            >Publish</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrap">
      <el-table
        ref="multipleTable"
        :data="tableData.data"
        :stripe="true"
        border
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column
          width="55"
          align="center"
          type="selection"
        ></el-table-column>
        <el-table-column label="ID" prop="id" align="center"></el-table-column>
        <el-table-column
          prop="title"
          label="Title"
          align="center"
        ></el-table-column>
        <el-table-column prop label="Period" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.periodStartTime + '~' + scope.row.periodEndTime
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="CreateTime"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createdBy"
          label="Author"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="updatedTime"
          label="LastModify"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="updatedBy"
          label="Modifier"
          align="center"
        ></el-table-column>
        <el-table-column prop label="PublishState" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.publishState ? 'Publish' : 'Unpublish' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operate" align="center" width="160">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="preview(scope)"
              >Preview</el-button
            >
            <el-button
              size="mini"
              type="primary"
              v-if="scope.row.publishState"
              @click="makeArticleUrl(scope.row)"
              >GetUrl</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="text-right mt20"></div> -->
      <div class="block page-box text-right mt20" v-if="tableData.pageData">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="tableData.pageData ? tableData.pageData.pageSize : 0"
          layout="total, prev, pager, next, jumper"
          :total="tableData.pageData ? tableData.pageData.totalCount : 0"
        ></el-pagination>
      </div>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-width="150px"
        label-position="left"
      >
        <el-form-item label="Publish State" prop="publishState">
          <el-radio v-model="form.publishState" :label="1">Publish</el-radio>
          <el-radio v-model="form.publishState" :label="0">Unpublish</el-radio>
        </el-form-item>
        <el-form-item label="Period" prop="time">
          <el-date-picker
            v-model="form.time"
            type="datetimerange"
            range-separator="~"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="Client">
          <span>{{ clientName }}</span>
        </el-form-item>
        <div class="text-center">
          <el-button @click="hideDialogForm">Cancel</el-button>
          <el-button type="primary" @click="handlePublish">Confirm</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      :visible.sync="showArticlePreview"
      class="preview-dialog"
      title="Article Preview"
      top="5vh"
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
      :visible.sync="openQRcodePop"
      width="370px"
      class="editor-dialog"
      :close-on-click-modal="false"
    >
      <div style="text-align:center;margin-top:-20px">
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
import restfulMixin from '@/mixins/restful.js'
import { isLocalhost } from '../../utility/index.js'
import Http from '@/api/http'
import ArticlePreview from '@/components/articlePreview'
import QRCode from 'qrcode'

export default {
  mixins: [restfulMixin],
  components: { ArticlePreview },
  data() {
    return {
      showArticlePreview: false,
      articlePreviewData: {},
      pageConstant: {
        apiPrefixUrl: 'publish/articles',
        dataKey: 'articles'
      },
      tableData: {
        data: [],
        pageData: {
          pageSize: 20,
          totalCount: 0
        }
      },
      currentPage: 1,
      form: {
        articleIds: [],
        publishState: '',
        time: [],
        periodStartTimeStamp: null,
        periodEndTimeStamp: null
      },
      rules: {
        publishState: {
          required: true
        },
        time: {
          type: 'array',
          required: true,
          trigger: 'change',
          message: 'Please select Period'
        }
      },
      filters: {
        id: '',
        title: '',
        clientId: '',
        publishState: ''
      },
      clients: [],
      dialogTitle: 'Publish',
      openQRcodePop: false,
      QRUrl: ''
    }
  },
  computed: {
    clientName() {
      if (this.clients.length === 0) return ''
      return this.clients.filter(item => item.id === this.filters.clientId)[0]
        .name
    }
  },
  methods: {
    handleCurrentChange(v) {
      this.currentPage = v
      this.getTableList(v)
    },
    add() {
      if (this.form.articleIds.length === 0) {
        this.$notify({
          message: 'Please choose article first',
          type: 'error',
          duration: 1000
        })
        return
      }
      this.form.time = [new Date(), new Date(2099, 11, 31, 23, 59, 59)]
      this.addAction()
    },
    handlePublish() {
      this.submitAction('form', () => {
        const time = this.form.time
        this.form.periodStartTimeStamp = new Date(time[0]).getTime()
        this.form.periodEndTimeStamp = new Date(time[1]).getTime()
        this.form.clientId = this.filters.clientId
        delete this.form.time
        return true
      })
    },
    handleSearch() {
      this.getTableList(1)
      this.currentPage = 1
    },
    preview(scope) {
      this.$set(this, 'articlePreviewData', scope.row)
      this.showArticlePreview = true
    },
    handleSelectionChange(val) {
      this.form.articleIds = val.map(item => item.id)
    },
    makeArticleUrl(resource) {
      let envs =
        location.host.includes('dev-') || isLocalhost()
          ? 'dev-'
          : location.host.includes('qa-')
          ? 'qa-'
          : location.host.includes('uat-')
          ? 'uat-'
          : ''
      let appId = this.clients.find(x => x.id == resource.clientId).appId
      let articleAuth = ''
      if (resource.isToken == 0) {
        articleAuth = `/unoauth`
      }
      if (
        resource.clientName === '玫琳凯之窗' ||
        resource.clientName === 'RC促销'
      ) {
        this.QRUrl = `https://${envs}lucky.xxxxxxx.com.cn/xxxxxxxArticle/${resource.id}/unoauth?culture=zh_CN&subsidiaryCode=CN&appId=${appId}&hiddenType=3&fullscreen=false`
      } else {
        this.QRUrl = `https://${envs}lucky.xxxxxxx.com.cn/article/${resource.id}${articleAuth}?culture=zh_CN&subsidiaryCode=CN&appId=${appId}`
      }
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
  },
  created() {
    Http({
      url: 'system/clients'
    }).then(res => {
      this.clients = res.clients
      if (res.clients.length > 0) {
        this.filters.clientId = res.clients[0].id
        this.getTableList(1)
      }
    })
  }
}
</script>
<style lang="less" scoped>
#QRcanvas {
  width: 200px !important;
  height: 200px !important;
}
</style>
