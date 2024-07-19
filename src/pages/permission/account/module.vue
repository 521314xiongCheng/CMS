<template>
  <div>
    <!-- <div class="el-menu g-page-bar">
      <span class="page-title">Module</span>
    </div> -->
    <div class="table-wrap">
      <table-list :tableData="tableData"></table-list>
    </div>
  </div>
</template>

<script>
import restfulMixin from '@/mixins/restful.js'
import TableList from '@/components/tableList.vue'

export default {
  components: {
    TableList
  },
  mixins: [restfulMixin],
  data() {
    return {
      pageConstant: {
        apiPrefixUrl: 'system/accounts/{id}/modules',
        pageName: 'Account',
        dataKey: 'modules'
      },
      tableData: {
        data: [],
        header: [
          {
            tableId: 'id',
            tableName: 'ID'
          },
          {
            tableId: 'categoryName',
            tableName: 'ModuleType'
          },
          {
            tableId: 'name',
            tableName: 'ModuleName'
          },
          {
            tableId: 'note',
            tableName: 'Note'
          }
        ]
      }
    }
  },
  methods: {},
  mounted() {
    this.id = this.$route.query.id
    this.getTableList()
  }
}
</script>
