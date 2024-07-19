<template>
  <div class="product-list">
    <el-form size="small" inline>
      <el-form-item label="标题">
        <el-input
          v-model="filters.searchName"
          @change="getList(1)"
          placeholder="查找..."
        >
        </el-input>
      </el-form-item>
      <el-form-item label="是否可被搜索">
        <el-select
          v-model="filters.isSearch"
          size="small"
          placeholder="请选择"
          @change="getList(1)"
        >
          <el-option label="全部" :value="null"></el-option>
          <el-option label="可搜索" :value="true"></el-option>
          <el-option label="不可搜索" :value="false"></el-option>
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
              :type="row.isTop ? 'warning' : row.isSort ? 'primary' : 'info'"
              :disabled="row.isTop ? true : false"
              @click="toTop(row)"
              >{{ row.isTop ? '已置顶' : '置顶' }}</el-button
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
import { getCourses, delCourse } from '@/api/library/onlineActivity.js'
import { sortContent, topContent } from '@/api/library/material.js'
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
            tableId: 'courseId',
            tableWidth: '60',
            tableName: 'ID'
          },
          {
            tableId: 'title',
            minWidth: 200,
            tableName: '活动标题'
          },
          {
            tableId: 'isSearch',
            tableName: '是否可搜索',
            tableWidth: '100',
            formatter: row => {
              return row.isSearch ? '是' : '否'
            }
          },
          {
            tableId: 'publishDate',
            tableName: '发布时间',
            tableWidth: '160',
            formatter: row => {
              return `${formatDate(row.publishStartDate)}${formatDate(
                row.publishEndDate
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
        searchName: '',
        isSearch: null
      },
      originalData: []
    }
  },
  created() {
    let filters = storage.get('onlineFilters')
    console.log(filters)
    if (filters) {
      this.filters = filters
    }
    this.getList()
  },
  beforeRouteLeave(to, form, next) {
    if (to.path !== '/library/onlineActivities/detail') {
      storage.set('onlineFilters', {
        searchName: '',
        isSearch: null,
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
        searchName: this.filters.searchName
      }
      if (this.filters.isSearch !== null) {
        query.isSearch = this.filters.isSearch
      }
      getCourses(query).then(res => {
        storage.set('onlineFilters', this.filters)
        this.tableData.data = res.courses
        this.originalData = clones(this.tableData.data)
        this.tableData.pageData.totalCount = res.totalCount
      })
    },
    handleCurrentChange(n) {
      this.filters.pageNo = n
      this.getList()
    },
    add() {
      this.$router.push({ path: '/library/onlineActivities/detail' })
    },
    editAction(row) {
      this.$router.push({
        path: '/library/onlineActivities/detail',
        query: { id: row.courseId }
      })
    },
    toTop(row) {
      this.$confirm(`请问是否确认要将当前活动内容置顶?`, 'Tips', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        topContent(row.courseId).then(res => {
          console.log(res)
          this.getList()
        })
      })
    },
    delAction(row) {
      this.$confirm(`请问是否确认要删除当前活动内容?`, 'Tips', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCourse(row.courseId).then(res => {
          console.log(res)
          this.getList()
        })
      })
    },
    changeSort() {
      let data = []
      this.tableData.data.forEach((o, idx) => {
        if (
          o.courseId === this.originalData[idx].courseId &&
          o.sort !== this.originalData[idx].sort
        ) {
          data.push(o)
        }
      })
      data = data.map(o => ({
        id: Number(o.courseId),
        sort: Number(o.sort)
      }))
      if (!data.length) return
      sortContent({ contentSorts: data }).then(res => {
        console.log(res)
        this.getList()
      })
    }
  }
}
</script>
