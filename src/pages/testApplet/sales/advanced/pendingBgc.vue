<template>
  <div>
    <div class="el-menu g-page-bar">
      <span class="page-title">分类名称</span>
      <el-form :inline="true">
        <el-form-item label="">
          <el-input
            size="medium"
            placeholder="Search"
            v-model="title"
            clearable
          >
            <el-button
              slot="append"
              @click="queryData"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <!-- table -->
    <div class="table-wrap">
      <el-table
        @selection-change="selectCourse"
        :data="tableData.bgcs"
        border
        style="width: 100%"
      >
        <el-table-column
          :selectable="checkSelectable"
          type="selection"
          align="center"
          prop="sort"
          label="选择"
          width="100"
        ></el-table-column>
        <el-table-column prop="isShareWords" label="发布状态">
          <template slot-scope="scope">
            <span v-if="scope.row.publishState">已发布</span>
            <span v-else>未发布</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="id"
          label="课程ID"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="title"
          label="课程标题"
        ></el-table-column>
      </el-table>
      <div class="page-box">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="tableData.totalCount"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { pendingBgcList } from '@/api/testApplet/sales/course.js'
export default {
  name: 'testApplet-sales-required-pendingBgc',
  data() {
    return {
      title: '',
      pageSize: 20,
      pageNo: 1,
      tableData: {
        bgcs: [],
        totalCount: 0
      }
    }
  },
  props: {
    categoryId: {
      required: true,
      type: String
    }
  },
  mounted() {
    // console.log(this.$route.query.categoryId)
    // this.categoryId = this.$route.query.categoryId
    this.getPendingBgcList()
  },
  methods: {
    getPendingBgcList() {
      let params = {
        pageSize: 20,
        pageNo: 1,
        title: this.title ? this.title : ''
      }
      pendingBgcList(this.categoryId, params).then(res => {
        console.log(res)
        this.tableData = { ...res }
      })
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageNo = val
      this.getPendingBgcList()
    },
    queryData() {
      this.pageNo = 1
      this.getPendingBgcList()
    },
    checkSelectable(row) {
      return row.publishState
    },
    selectCourse(rows) {
      this.$emit('selectCourse', rows)
    }
  }
}
</script>

<style lang="less" scoped>
.page-box {
  margin: 30px 0;
  text-align: right;
}
</style>
