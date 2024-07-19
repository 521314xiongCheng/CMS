<template>
  <div>
    <!-- <div class="g-page-bar" style="border-bottom: 1px solid #e6e6e6;">
      <span class="page-title">推送任务详情</span>
    </div> -->

    <div style="padding-bottom:20px;border-bottom: 1px solid #eee; ">
      <span class="page-title">Task ID :</span>
      <span class="page-title">{{ id }}</span>
    </div>

    <div style="margin-top: 15px;">
      <el-table
        :data="tableData.data"
        tooltip-effect="dark"
        style="width: 100%"
        border
      >
        <el-table-column label="通道" prop="channel"></el-table-column>
        <el-table-column label="打开" prop="open"></el-table-column>
        <el-table-column label="到达" prop="arrival"></el-table-column>
        <el-table-column label="实推" prop="actual"></el-table-column>
      </el-table>
      <!-- <div style="display: flex;" v-if="tableData.pageData">
				<el-pagination
					style="margin-left: auto;"
					@current-change="handleCurrentChange"
					:page-size="tableData.pageData ? tableData.pageData.pageSize : 0"
					layout="total, prev, pager, next, jumper"
					:total="tableData.pageData ? tableData.pageData.totalCount : 0"
				></el-pagination>
      </div>-->
    </div>
  </div>
</template>

<script>
// import Name from './components/Name.vue'

export default {
  data() {
    return {
      id: this.$route.params.id,
      tableData: {
        data: [
          {
            channel: '信鸽',
            open: '2100',
            arrival: '9000',
            actual: '21000'
          },
          {
            channel: 'IOS',
            open: '2100',
            arrival: '9000',
            actual: '21000'
          },
          {
            channel: 'OPPO',
            open: '2100',
            arrival: '9000',
            actual: '21000'
          },
          {
            channel: 'VIVO',
            open: '2100',
            arrival: '9000',
            actual: '21000'
          }
        ]
      }
    }
  }
}
</script>
