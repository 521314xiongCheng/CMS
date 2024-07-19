<template>
  <div class="topic-list">
    <div class="text-right">
      <el-button type="primary" size="small" @click="editAction"
        >添加</el-button
      >
    </div>
    <div class="table-wrap">
      <table-list
        :tableData="tableData"
        :isUseMixin="false"
        @handleCurrentChange="handleCurrentChange"
      >
        <el-table-column label="操作" align="center" fixed="right" width="240">
          <template slot-scope="{ row }">
            <el-button size="small" type="success" @click="detailAction(row)"
              >查看</el-button
            >
            <el-button
              size="small"
              type="primary"
              @click="editAction(row)"
              v-if="row.status == 'PENDING'"
              >修改</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="cancelAction(row)"
              v-if="row.status == 'PENDING'"
              >取消</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="delAction(row)"
              v-if="row.status == 'CANCELLED'"
              >删除</el-button
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
  getRecognizeList,
  cancelRecognize,
  delRecognize
} from '@/api/xxxxxxx/recognize.js'
import { formatDate } from '@/utility/index.js'
export default {
  components: {
    TableList
  },
  data() {
    return {
      tableData: {
        header: [
          {
            tableId: 'id',
            tableWidth: '60',
            tableName: 'ID'
          },

          {
            tableId: 'name',
            tableName: '认可名称'
          },
          {
            tableId: 'user_count',
            tableName: '认可人数'
          },
          {
            tableId: 'start_time',
            tableName: '预设认可时间',
            formatter: row => {
              return formatDate(row.start_time)
            }
          },
          // {
          //   tableId: 'issued_count',
          //   tableName: '颁发证书成功人数',
          //   formatter: row => {
          //     if (row.status == 'COMPLETED') {
          //       return row.issued_count
          //     } else {
          //       {
          //         return '/'
          //       }
          //     }
          //   }
          // },
          // {
          //   tableId: 'unsuccessful_count',
          //   tableName: '颁发证书末成功的人数',
          //   formatter: row => {
          //     if (row.status == 'COMPLETED') {
          //       return row.unsuccessful_count
          //     } else {
          //       {
          //         return '/'
          //       }
          //     }
          //   }
          // },
          {
            tableId: 'created_by',
            tableName: '创建人'
          },
          {
            tableId: 'created_time',
            tableName: '创建时间',
            tableWidth: '150',
            formatter: row => {
              return formatDate(row.created_time)
            }
          },
          {
            tableId: 'status',
            tableWidth: '100',
            tableName: '状态',
            formatter: row => {
              return this.formatStatus(row.status)
            }
          }
        ],
        data: [],
        pageData: {
          pageSize: 20,
          totalCount: 0
        }
      },
      filters: {
        pageSize: 20,
        pageNo: 1
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    formatStatus(v) {
      let text = '未知'
      switch (v) {
        case 'PENDING':
          text = '计划中'
          break
        case 'COMPLETED':
          text = '已认可'
          break
        case 'CANCELLED':
          text = '已取消'
          break
        case 'IMPORTING':
          text = '颁发中'
          break
        default:
          break
      }
      return text
    },
    getList() {
      let req = {}
      req.page_size = parseInt(this.filters.pageSize)
      req.page_number = parseInt(this.filters.pageNo)
      getRecognizeList(req).then(res => {
        this.tableData.data = res.data.list
        this.tableData.pageData.totalCount = Number(res.data.total)
      })
    },
    handleCurrentChange(n) {
      this.filters.pageNo = n
      this.getList()
    },
    editAction(row) {
      row &&
        this.$router.push({
          name: 'xxxxxxx-recognize-edit',
          query: { id: row.id }
        })
      !row && this.$router.push({ name: 'xxxxxxx-recognize-edit' })
    },
    detailAction(row) {
      row &&
        this.$router.push({
          name: 'xxxxxxx-recognize-detail',
          query: { id: row.id }
        })
      !row && this.$router.push({ name: 'xxxxxxx-recognize-detail' })
    },
    cancelAction(row) {
      this.$confirm(`您确定要取消该条数据嘛?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelRecognize(row.id).then(res => {
          console.log(res)
          this.$message({
            type: 'success',
            message: '取消操作成功！'
          })
          this.getList()
        })
      })
    },
    delAction(row) {
      this.$confirm(`您确定要删除该条数据嘛?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delRecognize(row.id).then(res => {
          console.log(res)
          this.$message({
            type: 'success',
            message: '删除操作成功！'
          })
          this.getList()
        })
      })
    }
  }
}
</script>
<style lang="less"></style>
