<template>
  <div>
    <div class="el-menu g-page-bar">
      <!-- <span class="page-title">Video Manage</span> -->
      <el-form :inline="true">
        <el-form-item label="Created Date">
          <el-date-picker
            v-model="createdDate"
            type="datetimerange"
            range-separator="-"
            size="small"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input
            v-model="filters.name"
            auto-complete="off"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="Created By" prop="uploadBy">
          <el-input
            v-model="filters.uploadBy"
            auto-complete="off"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="Module Path" prop="modulePath">
          <el-input v-model="filters.modulePath" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="handleSearch"
            >Query</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrap">
      <table-list :tableData="tableData" :choosePageFn="choosePageFn">
        <el-table-column
          label="Operate"
          fixed="right"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="deleteAction(scope)"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </table-list>
    </div>
  </div>
</template>

<script>
import TableList from '@/components/tableList.vue'
import restfulMixin from '@/mixins/restful.js'
import uploadMixin from '@/mixins/upload.js'
import Http from '@/api/http'

export default {
  components: {
    TableList
  },
  mixins: [restfulMixin, uploadMixin],
  data() {
    return {
      pageConstant: {
        apiPrefixUrl: 'system/resources',
        pageName: 'resources',
        dataKey: 'resources'
      },
      createdDate: null,
      tableData: {
        header: [
          {
            tableId: 'name',
            tableName: 'Name'
          },
          {
            tableId: 'url',
            tableName: 'URL'
          },
          {
            tableId: 'createdBy',
            tableName: 'Created By'
          },
          {
            tableId: 'createdDate',
            tableName: 'Created Date'
          },
          {
            tableId: 'moduleId',
            tableName: 'Module ID'
          },
          {
            tableId: 'moduleName',
            tableName: 'Module Name'
          }
        ],
        data: [],
        pageData: {
          pageSize: 20,
          totalCount: 0
        }
      },
      filters: {
        resourceType: 'Video',
        uploadBy: '',
        uploadStartTimestamp: '',
        uploadEndTimestamp: '',
        modulePath: ''
      }
    }
  },
  watch: {
    createdDate(date) {
      this.filters.uploadStartTimestamp = new Date(date[0]).getTime()
      this.filters.uploadEndTimestamp = new Date(date[1]).getTime()
    }
  },
  methods: {
    handleSearch() {
      this.getTableList()
    },
    deleteAction(scope) {
      // /v1/articles/{articleId}
      this.$confirm('delete this article?', 'tips', {
        confirmButtonText: 'confirm',
        cancelButtonText: 'cancel',
        type: 'warning'
      })
        .then(() => {
          Http({
            url: `system/resources/${scope.row.id}`,
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
  mounted() {
    this.getTableList(1)
  }
}
</script>
