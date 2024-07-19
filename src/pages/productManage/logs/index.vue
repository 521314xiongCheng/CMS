<template>
  <div class="product-list">
    <div class="table-wrap">
      <table-list
        :tableData="tableData"
        :isUseMixin="false"
        :currentPage="filters.page_num"
        @handleCurrentChange="handleCurrentChange"
      >
      </table-list>
    </div>
  </div>
</template>

<script>
import TableList from '@/components/tableList.vue'
import { getLogs } from '@/api/product/logs.js'
import { formatDate } from '@/utility/index.js'
import restfulMixin from '@/mixins/restful.js'
import storage from 'good-storage'
export default {
  name: 'Logs',
  components: {
    TableList
  },
  mixins: [restfulMixin],
  data() {
    return {
      form: {},
      updateDate: [],
      tableData: {
        header: [
          {
            tableId: 'created_by',
            tableName: '操作人',
            tableWidth: '150'
          },

          {
            tableId: 'created_time',
            tableName: '操作时间',
            tableWidth: '145',
            formatter: row => {
              return formatDate(new Date(row.created_time))
            }
          },
          {
            tableId: 'type',
            tableName: '发布类型',
            tableWidth: '100',
            formatter(row) {
              switch (row.type.toLocaleLowerCase()) {
                case 'product':
                  return '产品发布'
                case 'catalog':
                  return '目录发布'
              }
            }
          },
          {
            tableId: 'target_env',
            tableName: '发布环境',
            tableWidth: '100'
          },
          {
            tableId: 'publish_nodes',
            tableName: '发布节点'
          },
          {
            tableId: 'publish_desc',
            tableName: '发布说明'
          },
          {
            tableId: 'is_success',
            tableName: '是否成功',
            tableWidth: '100',
            formatter(row) {
              return row.is_success ? '发布成功' : '发布失败'
            }
          },
          {
            tableId: 'msg',
            tableName: '异常日志',
            showOverflowTooltip: true
          }
        ],
        data: [],
        pageData: {
          pageSize: 20,
          pageNum: 1,
          totalCount: 0
        }
      },
      filters: {
        page_size: 20,
        page_num: 1
      },
      selection: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(page_num) {
      if (page_num) {
        this.filters.page_num = page_num
      }
      let params = this.filters
      getLogs(params).then(res => {
        this.tableData.data = res.results.list
        this.tableData.pageData.totalCount = res.results.total
          ? res.results.total
          : 0
        storage.set('filters', params)
      })
    },

    handleCurrentChange(n) {
      this.filters.page_num = n
      this.getList()
    }
  }
}
</script>
