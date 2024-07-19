<template>
  <div>
    <!-- <div class="el-menu g-page-bar">
      <span class="page-title"></span>
    </div> -->
    <div class="table-wrap">
      <table-list :tableData="tableData"></table-list>
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
        apiPrefixUrl: 'system/roles/{id}/accounts',
        pageName: 'Account',
        dataKey: 'accounts'
      },
      tableData: {
        header: [
          {
            tableId: 'account',
            tableName: 'Email'
          },
          {
            tableId: 'name',
            tableName: 'Name'
          },
          {
            tableId: 'number',
            tableName: 'Number'
          },
          {
            tableId: 'nickName',
            tableName: 'NickName'
          },
          {
            tableId: 'state',
            tableName: 'State',
            formatter(row) {
              return row.state === 1 ? 'Valid' : 'Invalid'
            }
          }
        ],
        data: []
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
