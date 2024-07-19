<template>
  <div class="list">
    <el-form :inline="true" label-width="120px" size="small">
      <el-row>
        <el-form-item label="更新时间">
          <el-date-picker
            v-model="form.createdTime"
            type="date"
            @change="getTime"
            formate="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-button type="primary" @click="handleSearch" size="small"
          >搜索</el-button
        >
      </el-row>
    </el-form>
    <div class="table-wrap">
      <table-list :tableData="tableData" :choosePageFn="choosePageFn" :currentPage="tableData.pageData.pageNo">
        <el-table-column label="新跟进员工的顾问数" align="center">
          <template slot-scope="{ row }">
            <el-link :type="row.insert_consultant_staff_count ? 'primary' : 'default'" :underline="false"
              :disabled="!row.insert_consultant_staff_count"
              @click="onClickCell(row.id, 0)"
              >{{ row.insert_consultant_staff_count }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column label="已添加跟进员工的顾问数" align="center">
          <template slot-scope="{ row }">
            <el-link :type="row.added_consultant_staff_count ? 'primary' : 'default'" :underline="false"
              :disabled="!row.added_consultant_staff_count"
              @click="onClickCell(row.id, 1)"
              >{{ row.added_consultant_staff_count }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column label="未添加跟进员工的顾问数" align="center">
          <template slot-scope="{ row }">
            <el-link :type="row.not_add_consultant_staff_count ? 'primary' : 'default'" :underline="false"
              :disabled="!row.not_add_consultant_staff_count"
              @click="onClickCell(row.id, 2)"
              >{{ row.not_add_consultant_staff_count }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="{ row }">
            <el-link :type="row.not_add_consultant_staff_count ? 'primary' : 'default'" :underline="false"
              :disabled="!row.not_add_consultant_staff_count"
              @click="doSendMessage(row)"
              >发通知</el-link
            >
          </template>
        </el-table-column>
      </table-list>
    </div>
    <el-dialog
      :title="curInfoTitle"
      :visible.sync="showInfoList"
      width="80%"
    >
      <div class="table-wrap">
        <table-list :tableData="infoList" :choosePageFn="choosePageFn_info" :currentPage="infoList.pageData.pageNo">
        </table-list>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TableList from '@/components/tableList.vue'
import restfulMixin from '@/mixins/restful.js'
import { formatDate } from '@/utility/index.js'
import {
  getChanges,
  getChangeInfoList,
  sendMessage
} from '@/api/entWechat/consultant.js'

export default {
  data() {
    return {
      tableData: {
        header: [
          {
            tableId: 'created_time',
            tableName: '更新时间',
            formatter: row => {
              return formatDate(row.created_time)
            }
          }
        ],
        data: [],
        pageData: {
          pageNo: 1,
          pageSize: 10,
          totalCount: 0
        }
      },
      infoList: {
        header: [
          {
            tableId: 'consultant_name',
            tableName: '姓名'
          },
          {
            tableId: 'direct_seller_id',
            tableName: '顾问编号'
          },
          {
            tableId: 'nsd_name',
            tableName: '首席家族'
          },
          {
            tableId: 'mobile',
            tableName: '电话'
          },
          {
            tableId: 'employee_name',
            tableName: '跟进员工'
          },
          {
            tableId: 'status',
            tableName: '添加状态',
            formatter: function(item) {
              return item.status ? '已经添加' : '未添加'
            }
          }
        ],
        data: [],
        pageData: {
          pageNo: 1,
          pageSize: 10,
          totalCount: 0
        }
      },
      form: {},
      clients: [],
      createdTime: null,
      showInfoList: false,
      curInfoTitle:'',
      changeId: 0,
      changeStatus: 0,
      infoListTitles: [
        {label:'新跟进员工的顾问列表',value:-1},
        {label:'已添加跟进员工的顾问列表',value:1},
        {label:'未添加跟进员工的顾问列表',value:0}
      ]
    }
  },
  watch: {},
  mixins: [restfulMixin],
  created() {
    this.getTableList()
  },
  methods: {
    getTime(date) {
      this.form.createdTime = date
    },
    handleSearch() {
      this.createdTime = new Date(this.form.createdTime).getTime()
      this.getTableList()
    },
    doSendMessage(row) {
      // if (
      //   !row.send_time ||
      //   new Date().getTime() - row.send_time <= 24 * 60 * 60 * 1000
      // ) {
        const h = this.$createElement
        this.$confirm('提示', {
          title: '批量发通知',
          message: h('div', [
            h(
              'p',
              { style: 'color:#303133' },
              `确定给目前${row.insert_consultant_staff_count}位新增员工跟进的顾问批量发通知吗?`
            ),
            h('p', { style: 'font-size:8px' }, `将从xxxxxxx批量发送通知。`)
          ]),
          showCancelButton: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          sendMessage({ change_id: row.id }).then(res => {
            if (res.errcode == 0) {
              this.$message({
                message: res.errmsg,
                type: 'success'
              })
              this.getTableList()
            }else{
                this.$message({
                    message: res.errmsg,
                    type: 'warning'
                  })
            }
          })
        })
      // } else {
      //   this.$message({
      //     message: '24 小时内无法重复发送通知。',
      //     type: 'warning'
      //   })
      // }
    },
    choosePageFn(pageNo) {
      this.tableData.pageData.pageNo = pageNo
      this.getTableList()
    },
    choosePageFn_info(pageNo) {
      this.infoList.pageData.pageNo = pageNo
      this.getInfoList(this.changeId, this.changeStatus)
    },
    getTableList() {
      let req = {}
      req.pageNo = this.tableData.pageData.pageNo
      req.pageSize = this.tableData.pageData.pageSize
      if (this.createdTime) {
        req.createdTime = this.createdTime
      }
      getChanges(req).then(res => {
        if (res.errcode == 0) {
          this.tableData.data = res.data
          this.tableData.pageData.totalCount = res.total
          this.tableData.pageData.pageNo = res.pageNo
        }
      })
    },
    onClickCell(id, index){
      this.infoList.pageData.pageNo = 1
      this.getInfoList(id, index)
    },
    getInfoList(id, index) {
      let req = {}
      req.pageNo = this.infoList.pageData.pageNo
      req.pageSize = this.infoList.pageData.pageSize
      req.changeId = id
      const status = this.infoListTitles[index].value
      if (status >= 0) {
        req.status = status
      }
      getChangeInfoList(req).then(res => {
        if (res.errcode == 0 && res.data) {
          this.changeId = id
          this.changeStatus = index
          this.showInfoList = true
          this.curInfoTitle = this.infoListTitles[index].label
          this.infoList.data = res.data
          this.infoList.pageData.totalCount = res.total
          this.infoList.pageData.pageNo = res.pageNo
        }
      })
    }
  },

  components: { TableList }
}
</script>

<style lang="less" scoped>
.preview-dialog {
  /deep/ .el-dialog {
    min-height: 700px;
  }
  /deep/ .el-dialog__body {
    padding: 10px 20px;
  }
}
/deep/ .el-select {
  width: 178px;
}
.list {
  /* padding-top: 20px; */
}
.tab-tilte {
  color: black;
  font-weight: bold;
  height: 40px;
}
.select-employees {
  border-bottom: 1px solid #dedede;
  .selected {
    display: inline-flex;
    margin-right: 10px;
  }
}
</style>
