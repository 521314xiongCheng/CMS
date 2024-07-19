<template>
  <div class="list">
    <el-tabs type="border-card" @tab-click="tabClick" v-model="activeName">
      <el-tab-pane label="员工账号管理" name="employees">
        <!-- <el-form :inline="true" class="select-employees">
          <div class="tab-tilte">员工信息</div>
          <el-row>
            <el-col :span="18">
              <el-form-item label="员工:">
                <div class="selected">
                  <el-button
                    v-show="selectedEmployees.employeeId"
                    style="background-color: #efefef;"
                    slot="append"
                    icon="el-icon-close"
                    @click="deleteItem"
                    size="mini"
                  >
                    <span style="float: left;">{{selectedEmployees.employeeName}}</span>
                  </el-button>
                </div>
                <el-button style="border:none;color:blue;background-color: rgb(0, 0, 0,0);" type="default" size="mini" @click="handleSelect"  color="#000000"
                >选择</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="display: flex;justify-content: center;margin-bottom: 10px;">
            <el-button type="default" @click="deleteItem" size="small"
            >取消</el-button
          >
          <el-button type="primary" @click="handleSearch(1)" size="small" :disabled=!selectedEmployees.employeeId
            >搜索</el-button
          >
          </div>
        </el-form> -->
        <el-form
          :inline="true"
          size="small"
          class="table-wrap"
          style="border-bottom: 1px solid #dedede;"
        >
          <div class="tab-tilte">员工信息</div>
          <el-row>
            <el-col :span="18">
              <el-form-item label="员工编号/姓名:">
                <!-- <el-input v-model="filterEmployee"></el-input> -->
                <el-select
                  v-model="selectedId"
                  :filter-method="querySearchAsync"
                  filterable
                  clearable
                  placeholder="请选择"
                  @clear="clearOptions"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.employee_id"
                  >
                    <span style="float: left">{{ item.value }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="添加状态:" style="padding-left: 20px;">
                <el-select
                  v-model="filterState"
                  placeholder="全部"
                  @change="handleSearch()"
                >
                  <el-option label="全部" :value="-1"></el-option>
                  <el-option label="未添加" :value="0"></el-option>
                  <el-option label="已添加" :value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-button type="primary" @click="handleSearch(true)" size="small"
                >搜索</el-button
              >
            </el-col>
          </el-row>
        </el-form>
        <el-form
          :inline="true"
          size="small"
          class="table-wrap"
          style="justify-content: space-between;width: 100%;display: inline-flex;"
        >
          <div class="tab-tilte">员工跟进的顾问列表</div>
          <el-col :span="6">
            <div style="margin-left: auto;">
              <el-button
                type="primary"
                @click="doSendMessage()"
                size="small"
                :disabled="multipleSelection.length == 0"
                >发通知</el-button
              >
              <el-button
                type="default"
                :loading="isSync"
                @click="syncDatas"
                size="small"
                loading-text="同步中..."
                :disabled="filterEmployeeId == ''"
                >同步顾问</el-button
              >
              <el-button
                type="default"
                @click="doSendMessageAll()"
                size="small"
                :disabled="filterEmployeeId == ''"
                >批量发通知</el-button
              >
            </div>
          </el-col>
        </el-form>
        <el-form
          v-show="syncMessage != ''"
          :inline="true"
          size="small"
          class="tips"
        >
          <el-icon name="info" style="color: #409EFF;" />
          <div class="text">{{ syncMessage }}</div>
        </el-form>
        <div style="padding: 0 10px 10px 10px;">
          <table-list
            :tableData="tableData"
            :choosePageFn="choosePageFn"
            :handleSelectionChange="handleSelectionChange"
          >
            <template slot="between">
              <el-table-column
                type="selection"
                width="55"
                align="center"
                :selectable="checkSelectable"
              ></el-table-column>
            </template>
          </table-list>
        </div>
      </el-tab-pane>
      <el-tab-pane label="按顾问选择" name="consultant">
        <el-form :inline="true" label-width="120px" size="small">
          <el-row>
            <el-col :span="18">
              <el-form-item label="顾问编号/姓名:">
                <el-input v-model="filterConsultant"></el-input>
              </el-form-item>
              <el-button type="primary" @click="handleSearch()" size="small"
                >搜索</el-button
              >
            </el-col>
            <el-col
              :span="6"
              style="padding-left: 10px; padding-right: 10px; display: flex;"
            >
              <el-button
                style="margin-left: auto;"
                type="primary"
                @click="doSendMessage()"
                size="small"
                :disabled="multipleSelection.length == 0"
                >发通知</el-button
              >
            </el-col>
          </el-row>
        </el-form>
        <div class="table-wrap">
          <table-list
            :tableData="tableData"
            :choosePageFn="choosePageFn"
            :handleSelectionChange="handleSelectionChange"
          >
            <template slot="between">
              <el-table-column
                type="selection"
                width="55"
                align="center"
                :selectable="checkSelectable"
              ></el-table-column>
            </template>
          </table-list>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TableList from '@/components/tableList.vue'
import restfulMixin from '@/mixins/restful.js'
import {
  getConsultantList,
  syncConsultants,
  sendMessage,
  searchEmployees,
  getTaskStatus
} from '@/api/entWechat/consultant.js'

import { getDepartmentList } from '@/api/entWechat/user.js'

export default {
  data() {
    return {
      tableData: {
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
            tableId: 'current_career_level_code',
            tableName: '职级'
          },
          {
            tableId: 'mobile',
            tableName: '电话'
          },
          {
            tableId: 'employee_name',
            tableName: '跟进人'
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
      selectedId: '',
      filterEmployeeId: '',
      filterState: -1,
      filterConsultant: '',
      form: {},
      clients: [],
      tabType: 1,
      activeName: 'employees',
      multipleSelection: [],
      isSync: false,
      options: [],
      originalDepartments: [],
      syncMessage: ''
      // selectedEmployees:{}
    }
  },
  watch: {},
  mixins: [restfulMixin],
  created() {
    this.getDepartments()
  },
  methods: {
    tabClick(e) {
      let type = 1
      if (e.index === '0') {
        this.activeName = 'employees'
      } else {
        this.activeName = 'consultant'
        type = 2
      }
      this.multipleSelection = []
      this.tableData.pageData.pageNo = 1
      this.tableData.data = []
      this.tabType = type
      this.getTableList()
    },
    checkSelectable(row) {
      return !row.status
    },
    handleSelectionChange(val) {
      this.multipleSelection = val.map(item => {
        return {
          employee_user_id: item.employee_contact_id,
          contact_id: item.contact_id
        }
      })
      console.log('multipleSelection::', this.multipleSelection)
    },
    syncDatas() {
      this.$confirm('是否手动同步改该员工下的顾问跟进关系?', '同步顾问', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info'
      })
        .then(() => {
          this.isSync = true
          this.syncMessage = '同步进行中'
          syncConsultants({ employeeId: this.filterEmployeeId })
            // .then(res => {
            // console.log('======', res)
            // this.isSync = false
            // if (res.errcode == 0 && res.number > 0) {
            //   this.filterState = -1
            //   this.multipleSelection = []
            //   this.tableData.pageData.pageNo = 1
            //   this.multipleSelection = res.consultantContactIds.map(item => {
            //     return {
            //       employee_user_id: this.filterEmployeeId,
            //       contact_id: item
            //     }
            //   })
            //   const h = this.$createElement
            //   this.getTableList()
            // }
            // })
            .catch(() => {
              this.syncMessage = ''
              this.isSync = false
            })
        })
        .catch(() => {})
    },
    choosePageFn(pageNo) {
      this.tableData.pageData.pageNo = pageNo
      this.getTableList()
    },
    getTableList() {
      let type = this.tabType
      let req = {}
      req.pageNo = this.tableData.pageData.pageNo
      if (type == 1 && this.filterEmployeeId != '') {
        req.employeeId = this.filterEmployeeId
        if (this.filterState >= 0) {
          req.status = this.filterState
        }
      } else if (type == 2 && this.filterConsultant != '') {
        req.searchStr = this.filterConsultant
      } else {
        return
      }
      getConsultantList(req).then(res => {
        if (res.errcode == 0) {
          if (res.total == 0) {
            this.$message({
              message: '未搜索到顾问',
              type: 'success'
            })
          }
          this.tableData.data = res.data
          this.tableData.pageData.totalCount = res.total
          this.tableData.pageData.pageNo = res.pageNo
        }
      })
    },
    getDepartments() {
      getDepartmentList().then(res => {
        this.originalDepartments = res.department
      })
    },
    getSyncStaus() {
      this.isSync = false
      getTaskStatus({ employeeId: this.filterEmployeeId }).then(res => {
        if (res.errcode == 0) {
          if (res.data.status == 1) {
            this.syncMessage = '同步进行中'
            this.isSync = true
          } else if (res.data.status == 2) {
            this.syncMessage = `同步完成，新增${res.data.number}个顾问。`
          } else {
            this.syncMessage = ''
          }
        }
      })
    },

    doSendMessage(type) {
      sendMessage(
        type
          ? { employee_user_id: this.filterEmployeeId }
          : { list: this.multipleSelection }
      ).then(res => {
        this.$message({
          message: res.errmsg,
          type: res.errcode == 0 ? 'success' : 'warning'
        })
      })
    },
    doSendMessageAll() {
      const h = this.$createElement
      this.$confirm('提示', {
        title: '批量发通知',
        message: h('div', [
          h('p', { style: 'color:#303133' }, `是否批量发通知`),
          h('p', `对未添加至企业微信的联系人的顾问批量发通知。`)
        ]),
        showCancelButton: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info'
      })
        .then(() => {
          this.doSendMessage('all')
        })
        .catch(() => {})
    },
    querySearchAsync(queryString) {
      if (queryString && queryString.length > 0) {
        searchEmployees({ searchStr: queryString }).then(res => {
          if (res.errcode == 0) {
            this.options = res.userlist.map(data => {
              let item = this.originalDepartments.find(
                item => item.id == data.department[0]
              )
              let value = data.name + '—' + item.name
              return {
                value: value,
                employee_id: data.contact_id,
                label: data.name
              }
            })
          }
        })
      }
    },
    clearOptions() {
      this.options = []
    },
    handleSearch(flag) {
      let isCheck = false
      // console.log(this.filterEmployeeId, this.selectedId)
      if (this.filterEmployeeId != this.selectedId || flag) {
        isCheck = true
      }
      this.filterEmployeeId = this.selectedId
      if (isCheck) {
        this.getSyncStaus()
      }
      this.tableData.pageData.pageNo = 1
      this.tableData.data = []
      this.getTableList()
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

.tips {
  background-color: #f0f7ff;
  height: 20px;
  display: inline-flex;
  width: 96.2%;
  margin-left: 10px;
  flex: 1;
  padding: 10px;
  .text {
    font-size: 14px;
    padding-left: 8px;
  }
}
</style>
