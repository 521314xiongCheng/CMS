<template>
  <div>
    <div class="operate">
      <el-form size="small" inline>
        <el-form-item label="标题">
          <el-input
            v-model="filters.keyword"
            @change="getList(1)"
            placeholder="查找..."
          >
          </el-input>
        </el-form-item>
        <el-form-item label="发布状态">
          <el-select
            v-model="filters.batchStatus"
            size="small"
            placeholder="请选择"
            @change="getList(1)"
          >
            <el-option value="全部"></el-option>
            <el-option value="待发送"></el-option>
            <el-option value="发送中"></el-option>
            <el-option value="已完成"></el-option>
            <el-option value="已取消"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getList(1)">
            搜索
          </el-button>
          <el-button type="primary" size="mini" @click="add"> 新增 </el-button>
        </el-form-item>
      </el-form>
    </div>
    <table-list
      :tableData="tableData"
      :isUseMixin="false"
      @handleCurrentChange="handleCurrentChange"
    >
      <el-table-column label="操作" align="center" width="210" fixed="right">
        <template slot-scope="{ row, $index }">
          <el-button size="mini" type="info" @click="viewAction(row)"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="primary"
            v-if="row.batchStatus === '待发送'"
            @click="editAction(row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="warning"
            v-if="row.batchStatus === '待发送'"
            @click="cancelAction(row)"
            >取消</el-button
          >
          <el-button
            size="mini"
            type="danger"
            v-if="row.batchStatus === '已取消'"
            @click="delAction(row, $index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </table-list>
  </div>
</template>

<script>
import TableList from '@/components/tableList.vue'
import {
  getMessageList,
  delMessage,
  cancelMessage
} from '@/api/xxxxxxx/xxxxxxxMessagePush.js'
import restfulMixin from '@/mixins/restful.js'
import { formatDate } from '@/utility/index.js'
import storage from 'good-storage'
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
            tableId: 'batchId',
            tableWidth: '60',
            tableName: 'ID'
          },
          {
            tableId: 'notificationTitle',
            minWidth: 200,
            tableName: '消息名称'
          },
          {
            tableId: 'targetCount',
            tableName: '推送人数',
            minWidth: 100
          },
          {
            tableId: 'expectPushDate',
            tableName: '预设开始推送时间',
            tableWidth: '160',
            formatter: row => {
              return `${formatDate(new Date(row.expectPushDate))}`
            }
          },
          {
            tableId: 'updatedDate',
            tableName: '完成/取消推送时间',
            tableWidth: '160',
            formatter: row => {
              return row.updatedDate
                ? `${formatDate(new Date(row.updatedDate))}`
                : '-'
            }
          },
          {
            tableId: 'createdBy',
            tableName: '创建人',
            tableWidth: '200'
          },
          {
            tableId: 'batchStatus',
            tableName: '状态',
            tableWidth: '100'
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
        pageNo: 1,
        keyword: '',
        batchStatus: '全部'
      }
    }
  },
  created() {
    let filters = storage.get('xxxxxxxMessagePush')
    console.log(filters)
    if (filters) {
      this.filters = filters
    }
    this.getList()
  },
  beforeRouteLeave(to, form, next) {
    if (to.path !== '/xxxxxxx/xxxxxxxMessagePush/detail') {
      storage.set('xxxxxxxMessagePush', {
        keyword: '',
        batchStatus: '全部',
        pageSize: 20,
        pageNo: 1
      })
    }
    next()
  },
  methods: {
    getList() {
      let query = {
        pageSize: this.filters.pageSize,
        pageNo: this.filters.pageNo,
        keyword: this.filters.keyword,
        batchStatus: this.filters.batchStatus
      }
      getMessageList(query).then(res => {
        storage.set('xxxxxxxMessagePush', this.filters)
        this.tableData.data = res.batches
        this.tableData.pageData.totalCount = Number(res.totalCount)
      })
    },
    handleCurrentChange(n) {
      this.filters.pageNo = n
      this.getList()
    },
    add() {
      this.$router.push({ path: '/xxxxxxx/xxxxxxxMessagePush/detail' })
    },
    viewAction(row) {
      this.$router.push({
        path: '/xxxxxxx/xxxxxxxMessagePush/detail',
        query: { id: row.batchId, isView: true }
      })
    },
    editAction(row) {
      this.$router.push({
        path: '/xxxxxxx/xxxxxxxMessagePush/detail',
        query: { id: row.batchId }
      })
    },
    cancelAction(row) {
      this.$confirm(`请问是否确认要取消当前内容?`, 'Tips', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelMessage(row.batchId).then(res => {
          console.log(res)
          this.getList()
        })
      })
    },
    delAction(row) {
      this.$confirm(`请问是否确认要删除当前内容?`, 'Tips', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delMessage(row.batchId).then(res => {
          console.log(res)
          this.getList()
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.operate {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
</style>
