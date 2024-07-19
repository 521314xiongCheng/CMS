<template>
  <div class="product-list">
    <!-- <div class="el-menu g-page-bar">
      <el-button-group class="add-btn">
        <el-button type="primary" size="mini" @click="setting">
          编辑目录
        </el-button>
      </el-button-group>
    </div> -->
    <div class="table-wrap">
      <table-list :tableData="tableData" :choosePageFn="choosePageFn">
        <el-table-column label="操作" align="center" width="360">
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              @click="publish(row, 1)"
              :disabled="!(row.status == 0 || row.status == 4)"
              >发布UAT测试环境</el-button
            >
            <el-button
              size="mini"
              type="danger"
              :disabled="!(row.status == 1 || row.status == 5)"
              @click="publish(row, 2)"
              >发布生产环境</el-button
            >
            <el-button size="mini" type="success" @click="exportTable(row)"
              >导出</el-button
            >
            <el-button size="mini" type="primary" @click="setting(row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </table-list>
    </div>
  </div>
</template>

<script>
import TableList from '@/components/tableList.vue'
import {
  getCategories,
  publishCatalog,
  exportCatalogs
} from '@/api/product/catalog.js'
import restfulMixin from '@/mixins/restful.js'
import { formatDate } from '@/utility/index.js'
export default {
  name: 'Category',
  components: {
    TableList
  },
  mixins: [restfulMixin],
  data() {
    return {
      tableData: {
        header: [
          {
            tableId: 'id',
            tableName: '序号',
            tableWidth: '60',
            formatter(row, index) {
              return index + 1
            }
          },
          {
            tableId: 'name',
            tableName: '目录'
          },
          {
            tableId: 'status',
            tableName: '发布状态',
            formatter(row) {
              switch (row.status) {
                case 0:
                  return '未测试'
                case 1:
                  return '已测试'
                case 2:
                  return '已生效'
                case 4:
                  return '发布uat异常'
                case 5:
                  return '发布prod异常'
              }
            }
          },
          {
            tableId: 'last_time',
            tableName: '操作时间',
            tableWidth: '145',
            formatter: row => {
              return row.updated_time
                ? formatDate(new Date(row.updated_time))
                : formatDate(new Date(row.created_time))
            }
          },
          {
            tableId: 'last_by',
            tableName: '操作人',
            tableWidth: '150',
            formatter: row => {
              return row.updated_by ? row.updated_by : row.created_by
            }
          }
        ],
        data: []
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      getCategories().then(res => {
        this.tableData.data = res.results.list
      })
    },
    setting(row) {
      this.$router.push({
        path: '/productManage/catalog/category/setting',
        query: {
          id: row.id
        }
      })
    },
    exportTable(row) {
      exportCatalogs(row.id).then(res => {
        console.log(res)
        let url = window.URL.createObjectURL(new Blob([res]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', row.name + '.xlsx') // 自定义下载文件名（如exemple.txt）
        document.body.appendChild(link)
        link.click()
      })
    },
    publish(row, env) {
      publishCatalog(row.id, { target_env: env }).then(res => {
        if (res.code === 0) {
          this.$notify({
            message: '发布成功！',
            type: 'success',
            duration: 3000
          })
          this.getList()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.table-wrap {
  /deep/ .el-table .cell .el-button + .el-button {
    margin-left: 10px;
  }
}
</style>
