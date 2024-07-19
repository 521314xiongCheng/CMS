<template>
  <div>
    <div class="el-menu g-page-bar">
      <!--        月份，开始结束时间，气象指数-->
      <el-form style="width: 1200px;" :model="search" :inline="true">
        <el-form-item label="月份" prop="month">
          <el-date-picker
            v-model="search.month"
            value-format="yyyy-MM"
            type="month"
            clearable
            placeholder="选择月"
          >
          </el-date-picker>
          <!--            <el-input v-model="search.month" auto-complete="off" size="small" clearable></el-input>-->
        </el-form-item>
        <el-form-item label="气象指数" prop="meteorological_index">
          <el-input
            v-model="search.meteorological_index"
            auto-complete="off"
            size="small"
            clearable
          ></el-input>
          <!--          <el-select v-model="search.meteorological_index" placeholder="请选择护肤气象指数" clearable>-->
          <!--            <el-option-->
          <!--              v-for="val in weatherIndex"-->
          <!--              :key="val"-->
          <!--              :label="val"-->
          <!--              :value="val"-->
          <!--            ></el-option>-->
          <!--          </el-select>-->
        </el-form-item>
        <el-form-item label="开始结束日期">
          <el-date-picker
            v-model="searchDate"
            type="daterange"
            format="yyyy-MM-dd"
            clearable
            value-format="yyyy-MM-dd"
            @change="selectSearchDate"
            range-separator="至"
            size="small"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="queryData"
            >查询</el-button
          >
          <el-button
            @click="goEdit"
            size="small"
            type="primary"
            class="marginleft"
            >新增</el-button
          >
        </el-form-item>
      </el-form>
      <!--        <el-input size="small" style="width:280px;margin-right:10px;" placeholder="Search" v-model="title" clearable>-->
      <!--          <el-button slot="append" @click="queryData" icon="el-icon-search"></el-button>-->
      <!--        </el-input>-->
    </div>
    <div class="table-wrap">
      <el-table :data="tableData.list" border style="width: 100%">
        <el-table-column
          prop="month"
          label="月份"
          align="center"
          width="250"
        ></el-table-column>
        <el-table-column
          prop="startDate"
          label="开始日期"
          align="center"
          width="250"
        ></el-table-column>
        <el-table-column
          prop="endDate"
          align="center"
          label="结束日期"
          width="250"
        ></el-table-column>
        <el-table-column
          prop="meteorological_index"
          align="center"
          label="护肤气象指数"
          width="250"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="editAction(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="deleteAction(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="page-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNo"
          :page-sizes="[20, 30, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getList,
  getWeatherIndex,
  delWeatherIndex
} from '@/api/xxxxxxx/weather.js'
import utils from '../../../utils/utils'
export default {
  name: 'xxxxxxx-weather-index',
  data() {
    return {
      title: '',
      pageSize: 20,
      pageNo: 1,
      search: {
        month: '',
        display_start_time: '',
        display_end_time: '', //结束时间
        meteorological_index: '' //气象指数
      },
      searchDate: '',
      tableData: {
        list: [],
        total: 0
      },
      weatherIndex: []
    }
  },
  mounted() {
    this.getWeatherList()
    // this.getWeatherIndex()
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.pageNo = 1
      this.getWeatherList()
    },
    selectSearchDate(date) {
      console.log(date)
      if (date) {
        // this.search.display_start_time = Date.parse(date[0])
        // this.search.display_end_time = Date.parse(date[1])
        // console.log(date[0]+ ' 00:00:00')
        // console.log(new Date(date[0]+ ' 00:00:00'))
        this.search.display_start_time = new Date(
          date[0] + ' 00:00:00'
        ).getTime()
        this.search.display_end_time = new Date(date[1] + ' 23:59:59').getTime()
        // console.log('========',utils.formatDate(this.search.display_end_time))
      } else {
        this.search.display_start_time = ''
        this.search.display_end_time = ''
      }
    },
    getWeatherList() {
      console.log(
        Object.assign(
          { page_size: this.pageSize, page_num: this.pageNo },
          this.search
        )
      )
      let param = {
        page_size: this.pageSize,
        page_num: this.pageNo
      }
      if (this.search.month) {
        param.month = this.search.month
      }
      if (this.search.meteorological_index) {
        param.meteorological_index = this.search.meteorological_index
      }
      if (this.search.display_start_time) {
        param.display_start_time = this.search.display_start_time
      }
      if (this.search.display_end_time) {
        param.display_end_time = this.search.display_end_time
      }
      getList(param).then(res => {
        console.log(res)
        this.tableData = { ...res.results }
        if (this.tableData.list.length) {
          for (let item of this.tableData.list) {
            item.startDate = utils.formatDate(item.display_start_time)
            item.endDate = utils.formatDate(item.display_end_time)
          }
        }

        console.log('-----', this.tableData)
      })
    },
    getWeatherIndex() {
      console.log(utils.doHandleMonth())
      getWeatherIndex({ month: utils.doHandleMonth() }).then(res => {
        this.weatherIndex = { ...res.results.list }
      })
    },
    queryData() {
      this.pageNo = 1
      this.getWeatherList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageNo = val
      this.getWeatherList()
    },
    deleteAction(row) {
      console.log(row)
      //该文章已被引用至小程序，若删除，小程序上将看不到此文章，需珍重操作！请确认是否需要删除？
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delWeatherIndex(row.id).then(res => {
          console.log(res)
          this.getWeatherList()
        })
      })
    },
    goEdit() {
      this.$router.push({ name: 'xxxxxxx-weather-edit' })
    },
    editAction(row) {
      console.log(row)
      sessionStorage.setItem('weatherEditRow', JSON.stringify(row))
      this.$router.push({ name: 'xxxxxxx-weather-edit', query: { id: row.id } })
    },
    previewAction(row) {
      console.log(row)
      sessionStorage.setItem('bgcPreviewRow', JSON.stringify(row))
      this.$router.push({
        name: 'testApplet-BGC-preview',
        query: { id: row.id }
      })
      // this.previewInfo = {...row}
      // this.previewDialog = true
    }
  }
}
</script>

<style scoped lang="less">
.table-wrap {
  width: 1210px;
  .page-box {
    margin: 30px 0;
    text-align: right;
  }
}
</style>
