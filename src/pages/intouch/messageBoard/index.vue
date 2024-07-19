<template>
  <div class="product-list">
    <el-form size="small" inline>
      <el-form-item label="标题">
        <el-input
          v-model="filters.searchStr"
          @change="getList(1)"
          placeholder="查找..."
        >
        </el-input>
      </el-form-item>
      <el-form-item label="是否可分享">
        <el-select
          v-model="filters.isShare"
          size="small"
          placeholder="请选择"
          @change="getList(1)"
        >
          <el-option label="全部" :value="null"></el-option>
          <el-option label="是" :value="true"></el-option>
          <el-option label="否" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getList(1)">
          搜索
        </el-button>
        <el-button type="primary" size="mini" @click="add"> 添加 </el-button>
        <el-button type="primary" size="mini" @click="changeSort"
          >更新排序</el-button
        >
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <table-list
        :tableData="tableData"
        :isUseMixin="false"
        @handleCurrentChange="handleCurrentChange"
      >
        <el-table-column
          label="排序"
          slot="between"
          prop="sort"
          :width="100"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-input-number
              size="small"
              v-model="row.sort"
              style="width: 78px"
              :max="99999"
              :min="0"
              controls-position="right"
              :controls="false"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="210" fixed="right">
          <template slot-scope="{ row, $index }">
            <el-button
              size="mini"
              :type="row.isHot ? 'warning' : 'primary'"
              :disabled="row.isHot ? true : false"
              @click="toTop(row)"
              >{{ row.isHot ? '已置顶' : '置顶' }}</el-button
            >
            <el-button size="mini" type="primary" @click="editAction(row)"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" @click="delAction(row, $index)"
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
  getCommunications,
  delCommunication,
  sortCommunications,
  topCommunication
} from '@/api/xxxxxxx/messageBoard.js'
import restfulMixin from '@/mixins/restful.js'
import { formatDate, clones } from '@/utility/index.js'
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
            tableId: 'id',
            tableWidth: '60',
            tableName: 'ID'
          },
          {
            tableId: 'title',
            minWidth: 200,
            tableName: '通知标题'
          },
          {
            tableId: 'isShare',
            tableName: '是否可分享',
            tableWidth: '100',
            formatter: row => {
              return row.isShare ? '是' : '否'
            }
          },
          {
            tableId: 'isSearch',
            tableName: '消息打开次数',
            tableWidth: '120',
            formatter: row => {
              return row.isSearch ? '是' : '否'
            }
          },
          {
            tableId: 'publishDate',
            tableName: '发布时间',
            tableWidth: '160',
            formatter: row => {
              return `${formatDate(new Date(row.publishStartDate))}${formatDate(
                new Date(row.publishEndDate)
              )}`
            }
          },
          {
            tableId: 'updater',
            tableName: '操作人',
            tableWidth: '200',
            formatter: row => {
              return row.updatedBy ? row.updatedBy : row.createdBy
            }
          },
          {
            tableId: 'updaterTime',
            tableName: '操作时间',
            tableWidth: '160',
            formatter: row => {
              return row.updatedDate
                ? formatDate(new Date(row.updatedDate))
                : formatDate(new Date(row.createdDate))
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
        pageNo: 1,
        searchStr: '',
        isShare: null
      },
      originalData: []
    }
  },
  created() {
    let filters = storage.get('messageBoard')
    console.log(filters)
    if (filters) {
      this.filters = filters
    }
    this.getList()
  },
  beforeRouteLeave(to, form, next) {
    if (to.path !== '/xxxxxxx/messageBoard/detail') {
      storage.set('messageBoard', {
        searchStr: '',
        isShare: null,
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
        searchStr: this.filters.searchStr
      }
      if (this.filters.isShare !== null) {
        query.isShare = this.filters.isShare
      }
      getCommunications(query).then(res => {
        storage.set('messageBoard', this.filters)
        this.tableData.data = res.communications
        this.originalData = clones(this.tableData.data)
        this.tableData.pageData.totalCount = Number(res.totalCount)
      })
    },
    handleCurrentChange(n) {
      this.filters.pageNo = n
      this.getList()
    },
    add() {
      this.$router.push({ path: '/xxxxxxx/messageBoard/detail' })
    },
    editAction(row) {
      storage.set('messageBoardDetail', row)
      this.$router.push({
        path: '/xxxxxxx/messageBoard/detail',
        query: { id: row.id }
      })
    },
    toTop(row) {
      this.$confirm(`请问是否确认要将当前内容置顶?`, 'Tips', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        topCommunication(row.id).then(res => {
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
        delCommunication(row.id).then(res => {
          console.log(res)
          this.getList()
        })
      })
    },
    changeSort() {
      let data = []
      this.tableData.data.forEach((o, idx) => {
        if (
          o.id === this.originalData[idx].id &&
          o.sort !== this.originalData[idx].sort
        ) {
          data.push(o)
        }
      })
      data = data.map(o => ({
        id: Number(o.id),
        sort: Number(o.sort)
      }))
      if (!data.length) return
      sortCommunications({ sorts: data }).then(res => {
        console.log(res)
        this.getList()
      })
    }
  }
}
</script>
