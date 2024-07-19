<template>
  <div>
    <div class="el-menu g-page-bar">
      <span class="page-title">Log</span>
      <el-form :inline="true" :model="filters">
        <el-form-item label="Operator" prop="operator">
          <el-input
            v-model="filters.operator"
            auto-complete="off"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="Operator Account" prop="email">
          <el-input
            v-model="filters.email"
            auto-complete="off"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="handleSearch"
            >Query</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrap">
      <table-list
        :tableData="tableData"
        :choosePageFn="choosePageFn"
      ></table-list>
    </div>
  </div>
</template>

<script>
import TableList from '@/components/tableList.vue'
import restfulMixin from '@/mixins/restful.js'

export default {
  components: {
    TableList
  },
  mixins: [restfulMixin],
  data() {
    return {
      pageConstant: {
        apiPrefixUrl: 'system/operations',
        pageName: 'Log',
        dataKey: 'operations'
      },
      tableData: {
        header: [
          {
            tableId: 'operator',
            tableName: 'Operator'
          },
          {
            tableId: 'operateAccount',
            tableName: 'Operator Account'
          },
          {
            tableId: 'operateTime',
            tableName: 'Operate Time'
          },
          {
            tableId: 'content',
            tableName: 'Detail'
          }
        ],
        data: [],
        pageData: {
          pageSize: 20,
          totalCount: 0
        }
      },
      filters: {
        operator: '',
        email: ''
      }
    }
  },
  methods: {
    handleSearch() {
      this.getTableList()
    }
  },
  mounted() {
    this.getTableList(1)
  }
}
</script>
