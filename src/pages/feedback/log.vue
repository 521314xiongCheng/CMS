<template>
  <div>
    <!-- <div class="g-page-bar" style="border-bottom: 1px solid #e6e6e6;">
      <span class="page-title">Feedback Manage / Log</span>
      <el-button class="add-btn" icon="el-icon-plus" size="small" @click="add"></el-button>
    </div> -->
    <div style="padding:20px 0;border-bottom: 1px solid #eee; ">
      <span class="page-title">ID</span>
      <span class="page-title">{{ id }}</span>
    </div>
    <div style="margin-top: 15px;">
      <el-table
        :data="tableData.data"
        tooltip-effect="dark"
        style="width: 100%"
        border=""
      >
        <el-table-column label="操作" prop="address">
          <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
        </el-table-column>
        <el-table-column prop="address" label="操作时间" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作人"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
      <!-- <div style="display: flex;" v-if="tableData.pageData">
				<el-pagination
					style="margin-left: auto;"
					@current-change="handleCurrentChange"
					:page-size="tableData.pageData ? tableData.pageData.pageSize : 0"
					layout="total, prev, pager, next, jumper"
					:total="tableData.pageData ? tableData.pageData.totalCount : 0"
				></el-pagination>
			</div> -->
    </div>
  </div>
</template>

<script>
// import Name from './components/Name.vue'

export default {
  // 		components: {
  // 			Name
  // 		},
  data() {
    return {
      id: '1001234',
      tableData: {
        data: [
          {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-08',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-06',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            date: '2016-05-07',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }
        ]
      }
    }
  }
}
</script>

<style></style>
