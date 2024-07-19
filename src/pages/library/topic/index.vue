<template>
  <div class="topic">
    <el-form size="small" inline @submit.native.prevent>
      <el-form-item label="标题">
        <el-input
          v-model="filters.searchName"
          @change="getList(1)"
          placeholder="查找..."
        >
        </el-input>
      </el-form-item>
      <!-- <el-form-item label="是否可被搜索">
        <el-select
          v-model="filters.isSearch"
          size="small"
          placeholder="请选择"
          @change="getList(1)"
        >
          <el-option label="全部" :value="null"></el-option>
          <el-option label="已推送" :value="true"></el-option>
          <el-option label="未推送" :value="false"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" size="mini" @click="getList(1)">
          搜索
        </el-button>
        <el-button type="primary" size="mini" @click="add">
          添加
        </el-button>
        <el-button type="primary" size="mini" @click="changeSort"
          >更新排序</el-button
        >
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <table-list
        :tableData="tableData"
        :currentPage="filters.pageNo"
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
              :max="999"
              :min="0"
              controls-position="right"
              :controls="false"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="180">
          <template slot-scope="{ row }">
            <el-button size="mini" type="primary" @click="editAction(row)"
              >编辑</el-button
            >
            <el-button size="mini" type="primary" @click="manage(row)"
              >管理</el-button
            >
            <el-button size="mini" type="danger" @click="delAction(row)"
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
import storage from 'good-storage'
import { getTopics, delTopic, sortTopic } from '@/api/library/topic.js'
import { formatDate, clones } from '@/utility'
import restfulMixin from '@/mixins/restful.js'
// import Http from '@/api/http'
export default {
  name: 'MaterialManage',
  components: {
    TableList
  },
  mixins: [restfulMixin],
  data() {
    return {
      filters: {
        searchName: '',
        pageSize: 20,
        pageNo: 1
      },
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
            tableName: '专题标题'
          },
          {
            tableId: 'updater',
            tableName: '操作人',
            tableWidth: 200,
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
      originalData: []
    }
  },
  created() {
    let filters = storage.get('topicIndex')
    console.log(filters)
    if (filters) {
      this.filters = filters
    }
    this.getList()
  },
  beforeRouteLeave(to, form, next) {
    if (
      to.path !== '/library/topic/detail' ||
      to.path !== '/library/topic/manage'
    ) {
      storage.set('topicIndex', {
        searchName: '',
        pageSize: 20,
        pageNo: 1
      })
    }
    next()
  },
  methods: {
    getList(n) {
      if (n) {
        this.filters.pageNo = n
      }
      let data = {
        title: this.filters.searchName,
        pageNo: this.filters.pageNo,
        pageSize: this.filters.pageSize
      }
      getTopics(data).then(res => {
        this.tableData.data = res.topics
        this.originalData = clones(this.tableData.data)
        this.tableData.pageData.totalCount = res.totalCount ? res.totalCount : 0
      })
    },
    handleCurrentChange(n) {
      this.filters.pageNo = n
      this.getList()
    },
    add() {
      storage.set('topicIndex', this.filters)
      this.$router.push({
        path: '/library/topic/detail'
      })
    },
    editAction(row) {
      storage.set('topicIndex', this.filters)
      storage.set('topicInfo', row)
      this.$router.push({
        path: '/library/topic/detail',
        query: { id: row.id }
      })
    },
    manage(row) {
      storage.set('topicIndex', this.filters)
      this.$router.push({
        path: '/library/topic/manage',
        query: { id: row.id }
      })
    },
    setDisabledDate(date) {
      console.log(date)
      let startDate = this.pushInfo.publishStartDate,
        endDate = this.pushInfo.publishEndDate
      return date <= startDate || date >= endDate
    },
    delAction(row) {
      this.$confirm(`请问是否确认要删除当前活动内容?`, 'Tips', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delTopic(row.id).then(res => {
            console.log(res)
            this.getList()
          })
        })
        .catch(() => {})
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
      sortTopic({ sorts: data }).then(res => {
        console.log(res)
        this.getList()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.input-img-url {
  position: absolute;
  left: 90px;
  width: 510px !important;
}
</style>
