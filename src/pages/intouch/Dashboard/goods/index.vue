<template>
  <div class="product-list">
    <div class="table-wrap">
      <table-list
        :tableData="tableData"
        :isUseMixin="false"
        @cellClick="cellClick"
      >
        <el-table-column label="操作" align="center" fixed="right" width="100">
          <template slot-scope="{ row }">
            <el-button size="small" type="primary" @click="manage(row)"
              >管理</el-button
            >
          </template>
        </el-table-column>
      </table-list>
    </div>
  </div>
</template>

<script>
import TableList from '@/components/tableList.vue'
import { getGoodsIndex } from '@/api/xxxxxxxDashboard/goods.js'
import restfulMixin from '@/mixins/restful.js'
import { formatDate } from '@/utility/index.js'
export default {
  components: {
    TableList
  },
  mixins: [restfulMixin],
  data() {
    return {
      tableData: {
        header: [
          {
            tableId: 'index',
            tableName: '排序',
            tableWidth: 60,
            formatter: (row, index) => {
              switch (row.type) {
                case 1:
                  return `1-${index + 1}`
                case 2:
                  return `2-${row.seqId}`
                case 3:
                  return 3
              }
            }
          },
          {
            tableId: 'title',
            tableName: '目录名称'
          },
          {
            tableId: 'imgUrl',
            tableName: 'ICON'
          },
          {
            tableId: 'start_date',
            tableName: '开始时间',
            tableWidth: 160,
            formatter: row => {
              return row.startDate
                ? formatDate(new Date(row.startDate.replace(/-/g, '/')))
                : '-'
            }
          },
          {
            tableId: 'end_date',
            tableName: '结束时间',
            tableWidth: 160,
            formatter: row => {
              return row.endDate
                ? formatDate(new Date(row.endDate.replace(/-/g, '/')))
                : '-'
            }
          },
          {
            tableId: 'targetUri',
            tableName: '跳转链接',
            showOverflowTooltip: true
          }
        ],
        data: []
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getGoodsIndex().then(res => {
        this.tableData.data = res.categories
      })
    },
    manage(row) {
      this.$router.push({
        path: '/xxxxxxx/Dashboard/goods/detail',
        query: { id: row.seqId, type: row.type }
      })
    },
    cellClick(row, column) {
      if (column.property === 'targetUri') {
        this.$copyText(row.targetUri)
        this.$message({
          type: 'success',
          message: '复制成功'
        })
      }
    }
  }
}
</script>
<style lang="less">
.input-img-url {
  position: absolute;
  left: 90px;
  width: 305px !important;
}
</style>
