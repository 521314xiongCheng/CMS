<template>
  <div class="article">
    <el-form :inline="true" label-width="90px" size="small">
      <el-row>
        <el-form-item label="Id">
          <el-input v-model="filters.id"></el-input>
        </el-form-item>
        <el-form-item label="Title">
          <el-input v-model="filters.title"></el-input>
        </el-form-item>
        <el-form-item label="State">
          <el-select
            v-model="filters.state"
            placeholder="请选择"
            @change="getTableList()"
          >
            <el-option label="Invalid" :value="0"></el-option>
            <el-option label="Valid" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item label="Client">
            <el-select
              v-model="filters.clientId"
              placeholder="请选择"
              @change="getTableList()"
            >
              <el-option
                v-for="client in clients"
                :key="client.id"
                :label="client.name"
                :value="client.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="ConfirmState">
            <el-select
              v-model="filters.confirmState"
              placeholder="请选择"
              @change="getTableList()"
            >
              <el-option label="UnConfirmed" :value="0"></el-option>
              <el-option label="Confirmed" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="handleSearch" size="small"
            >query</el-button
          >
          <el-button type="primary" @click="confirmArticle" size="small"
            >confirm</el-button
          >
          <el-button type="primary" @click="addArticle" size="small"
            >add</el-button
          >
        </el-col>
      </el-row>
    </el-form>
    <div class="table-wrap">
      <table-list
        :tableData="tableData"
        :choosePageFn="choosePageFn"
        :handleSelectionChange="handleSelectionChange"
      >
        <el-table-column label="IsConfirm" align="center">
          <template slot-scope="scope">
            {{ scope.row.confirmState ? 'Confirmed' : 'UnConfirmed' }}
          </template>
        </el-table-column>
        <el-table-column label="State" align="center">
          <template slot-scope="scope">
            {{ scope.row.state ? 'Valid' : 'Invalid' }}
          </template>
        </el-table-column>
        <el-table-column
          label="Operate"
          fixed="right"
          align="center"
          width="210"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="editAction(scope)"
              >Edit</el-button
            >
            <el-button size="mini" type="success" @click="preview(scope)"
              >Preview</el-button
            >
            <el-button size="mini" type="danger" @click="deleteAction(scope)"
              >Delete</el-button
            >
          </template>
        </el-table-column>
        <template slot="between">
          <el-table-column
            type="selection"
            :selectable="checkSelectable"
            width="55"
            align="center"
          ></el-table-column>
        </template>
      </table-list>
    </div>
    <el-dialog
      :visible.sync="showSelectArticleType"
      width="350px"
      title="Create Article"
    >
      <el-radio v-model="addArticleType" :label="1">New</el-radio>
      <el-radio v-model="addArticleType" :label="0">Duplicate</el-radio>
      <div slot="footer">
        <el-button @click="showSelectArticleType = false" size="mini"
          >Cancel</el-button
        >
        <el-button type="primary" @click="createArticle" size="mini"
          >Next</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="showDuplicateDialog"
      title="Duplicate"
      width="1000px"
    >
      <el-form :inline="true" label-width="80px">
        <el-form-item label="Id">
          <el-input v-model="filters.id"></el-input>
        </el-form-item>
        <el-form-item label="Title">
          <el-input v-model="filters.title"></el-input>
        </el-form-item>
        <el-form-item label="Client">
          <el-select v-model="filters.clientId" placeholder="请选择">
            <el-option
              v-for="client in clients"
              :key="client.id"
              :label="client.name"
              :value="client.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="fr">
          <el-button type="primary" @click="handleSearch">query</el-button>
        </el-form-item>
      </el-form>
      <table-list :tableData="duplicateData" :choosePageFn="choosePageFn">
        <template slot="between">
          <el-table-column align="center" width="55">
            <template slot-scope="scope">
              <el-radio v-model="duplicateId" :label="scope.row.id"
                >&nbsp;</el-radio
              >
            </template>
          </el-table-column>
        </template>
      </table-list>
      <div slot="footer">
        <el-button @click="showDuplicateDialog = false" size="mini"
          >Cancel</el-button
        >
        <el-button type="primary" @click="duplicate" size="mini"
          >Next</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="showArticlePreview"
      class="preview-dialog"
      title="Preview"
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
  </div>
</template>

<script>
import TableList from '@/components/tableList.vue'
import restfulMixin from '@/mixins/restful.js'
import Http from '@/api/http'
import ArticlePreview from '@/components/articlePreview'

export default {
  data() {
    return {
      pageConstant: {
        apiPrefixUrl: 'articles',
        pageName: 'articles',
        dataKey: 'articles'
      },
      tableData: {
        header: [
          {
            tableId: 'id',
            tableName: 'Id'
          },
          {
            tableId: 'title',
            tableName: 'Title'
          },
          {
            tableId: 'createdDate',
            tableName: 'CreateTime'
          },
          {
            tableId: 'createdBy',
            tableName: 'Author'
          },
          {
            tableId: 'updatedDate',
            tableName: 'LastModify'
          },
          {
            tableId: 'updatedBy',
            tableName: 'Modifier'
          },
          {
            tableId: 'isToken',
            tableName: 'IsToken',
            formatter: function(item) {
              return item.isToken ? '是' : '否'
            }
          },
          {
            tableId: 'eventNum',
            tableName: 'EventNum'
          }
        ],
        data: [],
        pageData: {
          pageSize: 20,
          totalCount: 0
        }
      },
      duplicateData: {
        header: [
          {
            tableId: 'id',
            tableName: 'Id',
            tableWidth: 80
          },
          {
            tableId: 'title',
            tableName: 'Title'
          },
          {
            tableId: 'createdDate',
            tableName: 'CreateTime'
          }
        ],
        data: [],
        pageData: {
          pageSize: 20,
          totalCount: 0
        }
      },
      duplicateForm: {
        clientIds: [],
        title: '',
        id: ''
      },
      filters: {
        state: '',
        confirmState: '',
        id: '',
        title: '',
        clientId: ''
      },
      form: {},
      clients: [],
      addArticleType: 1,
      showSelectArticleType: false,
      showDuplicateDialog: false,
      duplicateId: null,
      multipleSelection: [],
      showArticlePreview: false,
      articlePreviewData: {}
    }
  },
  watch: {
    ['tableData.data'](val) {
      this.duplicateData.data = val
    },
    ['tableData.pageData.totalCount'](val) {
      this.duplicateData.pageData.totalCount = val
    }
  },
  mixins: [restfulMixin],
  created() {
    //this.getTableList()
    Http({
      url: 'system/clients'
    }).then(res => {
      this.clients = res['clients']
      if (res.clients.length > 0) {
        this.filters.clientId = res.clients[0].id
        this.getTableList()
      }
    })
  },
  methods: {
    handleSearch() {
      this.getTableList()
    },
    addArticle() {
      this.showSelectArticleType = true
    },
    createArticle() {
      // New
      if (this.addArticleType) {
        return this.$router.push({
          name: 'resource-article-detail_prod'
        })
      }

      // Duplicate
      this.showSelectArticleType = false
      this.showDuplicateDialog = true
    },
    duplicate() {
      if (!this.duplicateId) {
        return this.$message({
          message: '请选择一篇文章！',
          type: 'warning'
        })
      }
      this.$router.push({
        name: 'resource-article-detail_prod',
        query: { duplicateId: this.duplicateId }
      })
    },
    checkSelectable(row) {
      return !row.confirmState
    },
    handleSelectionChange(val) {
      this.multipleSelection = val.map(item => item.id)
    },
    confirmArticle() {
      Http({
        url: 'articles/confirm',
        method: 'POST',
        data: {
          articleIds: this.multipleSelection
        }
      }).then(res => {
        if (res.result) {
          this.getTableList()
          this.$message({
            type: 'success',
            message: '更新成功'
          })
        }
      })
    },
    editAction(scope) {
      this.$router.push({
        name: 'resource-article-detail_prod',
        query: { articleId: scope.row.id }
      })
    },
    preview(scope) {
      this.$set(this, 'articlePreviewData', scope.row)
      this.showArticlePreview = true
    },
    deleteAction(scope) {
      // /v1/articles/{articleId}
      this.$confirm('delete this article?', 'tips', {
        confirmButtonText: 'confirm',
        cancelButtonText: 'cancel',
        type: 'warning'
      })
        .then(() => {
          const articleId = scope.row.id
          Http({
            url: `articles/${articleId}`,
            method: 'DELETE'
          }).then(res => {
            if (res.result) {
              this.$message({
                type: 'success',
                message: 'success!'
              })
              this.getTableList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'cancel'
          })
        })
    }
  },
  components: { TableList, ArticlePreview }
}
</script>

<style lang="less" scoped>
.preview-dialog {
  /deep/ .el-dialog {
    min-height: 700px;
  }
  /deep/ .el-dialog__body {
    padding: 10px 20px;
  }
}
/deep/ .el-select {
  width: 178px;
}
.article {
  padding-top: 20px;
}
</style>
