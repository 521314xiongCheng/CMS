<template>
  <div>
    <!-- <div class="g-page-bar" style="border-bottom: 1px solid #e6e6e6;">
      <span class="page-title">Feedback Manage</span>
      <el-button class="add-btn" icon="el-icon-plus" size="small" @click="add"></el-button>
    </div> -->
    <div style="margin-top: 20px;border-bottom: 1px solid #eee;">
      <el-form ref="form" :model="form" size="small" label-width="110px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="AppName">
              <el-select
                v-model="form.appName"
                clearable
                placeholder="请选择"
                @change="query(1)"
              >
                <el-option
                  v-for="item in [
                    { name: 'SkinAnalyzer', value: 'skinanalyzer' },
                    { name: 'xxxxxxx', value: 'com.xxxxxxx.china.mobilityApp' }
                  ]"
                  :key="item.name"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="ID">
              <el-input v-model="form.caseId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="DirectSellerId">
              <el-input v-model="form.directSellerId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="Create_time">
              <el-date-picker
                v-model="selectDate"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="Process State">
              <el-select
                v-model="form.processStatus"
                placeholder="请选择"
                clearable
                @change="query(1)"
              >
                <el-option
                  v-for="item in processStateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="State">
              <el-select
                v-model="form.status"
                placeholder="请选择"
                clearable
                @change="query(1)"
              >
                <el-option
                  v-for="item in stateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Follower">
              <el-select
                v-model="form.followerId"
                clearable
                placeholder="请选择"
                @change="query(1)"
              >
                <el-option
                  v-for="item in followerList"
                  :key="item.id"
                  :label="item.user_name"
                  :value="item.id"
                  @clear="form.followerId = 0"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="Title">
              <el-input v-model="form.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="Sort By">
              <el-button
                plain
                @click="sort('create_time')"
                size="small"
                :class="sortByCreateTime.isSort ? 'sortField' : ''"
              >
                create time
                <i
                  :class="
                    `el-icon-caret-${
                      sortByCreateTime.sort === 'desc' ? 'bottom' : 'top'
                    }`
                  "
                ></i>
              </el-button>
              <el-button
                plain
                @click="sort('last_modify')"
                size="small"
                style="margin-left: 20px;"
                :class="sortByLastModify.isSort ? 'sortField' : ''"
              >
                last modify
                <i
                  :class="
                    `el-icon-caret-${
                      sortByLastModify.sort === 'desc' ? 'bottom' : 'top'
                    }`
                  "
                ></i>
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="display: flex;">
            <div style="margin-left: auto;">
              <el-button type="primary" size="small" @click="query(1)">
                Query
              </el-button>
              <el-button
                v-if="user.roles.includes('FeedbackAdmin')"
                type="primary"
                @click="showAssignForm"
                size="small"
                style="margin-left: 5px;"
                >Assign</el-button
              >
              <el-button
                v-if="user.roles.includes('FeedbackAdmin')"
                type="primary"
                @click="$router.push({ path: '/feedback/type' })"
                size="small"
                style="margin-left: 5px;"
                >Type Manage</el-button
              >
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="margin-top: 15px;">
      <el-table
        :data="tableData.data"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        style="width: 100%"
        border
      >
        <el-table-column
          type="selection"
          width="45"
          align="center"
          :selectable="setSelectable"
        ></el-table-column>
        <el-table-column
          prop="id"
          label="ID"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="ibcNumber"
          label="consultant"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="create_time"
          label="create_time"
          show-overflow-tooltip
          align="center"
          width="180"
        >
          <template slot-scope="scope">{{ scope.row.createdDate }}</template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="title"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          prop="type"
          label="type"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          prop="follower"
          label="follower"
          show-overflow-tooltip
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="processStatus"
          label="process state"
          width="110"
          align="center"
        >
          <template slot-scope="scope">{{
            scope.row.processStatus | processStatusDesc
          }}</template>
        </el-table-column>
        <el-table-column prop="status" label="state" width="80" align="center">
          <template slot-scope="scope">{{
            scope.row.status | statusDesc
          }}</template>
        </el-table-column>
        <el-table-column
          prop="updatedDate"
          label="last modify"
          width="120"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">{{ scope.row.updatedDate }}</template>
        </el-table-column>
        <el-table-column
          prop="finalResponser"
          label="final responder"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="55" align="center">
          <template slot-scope="scope">
            <el-button
              @click="
                $router.push({
                  name: 'feedback-detail',
                  params: { id: scope.row.id }
                })
              "
              type="text"
              size="small"
              >detail</el-button
            >
            <!-- <el-button @click="$router.push({ name:'feedbacklog' })" type="text" size="small">log</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;" v-if="tableData.pageData">
        <el-pagination
          style="margin-left: auto;"
          @current-change="handleCurrentChange"
          :page-size="tableData.pageData ? tableData.pageData.pageSize : 0"
          layout="total, prev, pager, next, jumper"
          :total="tableData.pageData ? tableData.pageData.totalCount : 0"
          :current-page="tableData.pageData.pageNo"
        ></el-pagination>
      </div>
    </div>
    <el-dialog title="Choose the Follower" :visible.sync="dialogFormVisible">
      <el-form
        :model="assignForm"
        ref="assignForm"
        :rules="rule"
        inline-message
      >
        <el-form-item style="text-align: center;" prop="follower">
          <el-select v-model="assignForm.follower" placeholder="请选择">
            <el-option
              v-for="item in followerList"
              :key="item.id"
              :label="item.user_name"
              :value="item.id"
            >
              <!-- 						<span style="float: left">{{ item.loginName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>-->
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer text-center">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignFollower">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 公用表格列表组件 引入
// import TableList from '../components/tableList.vue'
// import upload from "../utility/learn_upload.js"
// import dialogForm from '../../mixins/dialogForm.js'
import {
  get,
  // add,
  // edit,
  getFollowers,
  assignFollower
} from '../../api/feedback/feedback.js'
import { readUserInfo } from '../../utility/index'
export default {
  components: {},
  // mixins: [dialogForm],
  data() {
    return {
      selectDate: '',
      sortByCreateTime: {
        isSort: true,
        sort: 'desc'
      },
      sortByLastModify: {
        isSort: false,
        sort: 'desc'
      },
      dateSelect: [],
      form: {},
      processStateList: [
        {
          value: '01',
          label: '新建'
        },
        {
          value: '02',
          label: '已分配'
        },
        {
          value: '03',
          label: '工单已回复'
        },
        {
          value: '04',
          label: '顾问已回复'
        },
        {
          value: '05',
          label: '用户删除'
        },
        {
          value: '06',
          label: '跟单删除'
        },
        {
          value: '07',
          label: '关闭'
        }
      ],
      stateList: [
        {
          value: '01',
          label: '已提交'
        },
        {
          value: '02',
          label: '处理中'
        },
        {
          value: '03',
          label: '无效'
        },
        {
          value: '04',
          label: '关闭'
        }
      ],
      followerList: [
        {
          id: '',
          user_name: ''
        }
      ],
      tableData: {
        data: [],
        pageData: {
          pageNo: 1,
          pageSize: 10,
          totalCount: 0
        }
      },
      multipleSelection: [],
      dialogFormVisible: false,
      assignForm: {
        follower: ''
      },
      rule: {
        follower: [
          {
            required: true,
            message: 'Please select follower'
          }
        ]
      },
      user: { roles: [] }
    }
  },
  methods: {
    query(pageNo) {
      this.pageNo = pageNo
      if (this.selectDate) {
        this.form.startTime = this.selectDate[0]
        this.form.endTime = this.selectDate[1]
      }
      if (this.sortByCreateTime.isSort) {
        this.form.sortField = 'created_date'
        this.form.sort = this.sortByCreateTime.sort
      } else {
        this.form.sortField = 'updated_date'
        this.form.sort = this.sortByLastModify.sort
      }
      if (!this.form.followerId) {
        delete this.form.followerId
      }

      if (!this.form.appName) {
        delete this.form.appName
      }
      this.form.pageSize = 10
      this.form.pageNo = pageNo
      get(this.form).then(res => {
        this.tableData.data = res.cases
        this.tableData.pageData.totalCount = res.totalCount
        this.tableData.pageData.pageSize = res.pageSize
        this.tableData.pageData.pageNo = res.pageNo
      })
    },
    showAssignForm() {
      if (!this.multipleSelection || this.multipleSelection.length < 1) {
        this.$message({
          message: '请先勾选要分配的反馈记录',
          type: 'warning'
        })
      } else {
        this.dialogFormVisible = true
      }
    },
    assignFollower() {
      this.$refs['assignForm'].validate(valid => {
        if (valid) {
          var caseIds = []
          if (this.multipleSelection && this.multipleSelection.length > 0) {
            for (var i in this.multipleSelection) {
              caseIds.push(this.multipleSelection[i].id)
            }
          }
          assignFollower({
            username: this.user.user_name,
            data: {
              userName: this.user.user_name,
              followerId: this.assignForm.follower,
              caseIds: caseIds
            }
          }).then(res => {
            if (res.result) {
              this.dialogFormVisible = false
              this.query(this.tableData.pageData.pageNo)
            }
          })
        }
      })
    },
    // 			handleClick(row) {
    // 				console.log(row);
    // 			},
    handleCurrentChange(pageNo) {
      this.query(pageNo)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    sort(field) {
      if ('create_time' == field) {
        if (this.sortByCreateTime.isSort) {
          if (this.sortByCreateTime.sort == 'desc') {
            this.sortByCreateTime.sort = 'asc'
          } else {
            this.sortByCreateTime.sort = 'desc'
          }
        }
        this.sortByCreateTime.isSort = true
        this.sortByLastModify.isSort = false
      } else if ('last_modify' == field) {
        if (this.sortByLastModify.isSort) {
          if (this.sortByLastModify.sort == 'desc') {
            this.sortByLastModify.sort = 'asc'
          } else {
            this.sortByLastModify.sort = 'desc'
          }
        }
        this.sortByLastModify.isSort = true
        this.sortByCreateTime.isSort = false
      }
      this.query(1)
    },
    getFollowers() {
      getFollowers().then(res => {
        this.followerList = res
      })
    },
    setSelectable(row) {
      if ('03' == row.status) {
        return false
      } else {
        return true
      }
    }
  },
  mounted() {
    this.user = readUserInfo()

    if (this.user.roles.includes('FeedbackAdmin')) {
      this.getFollowers()
    } else if (this.user.roles.includes('FeedbackManage')) {
      this.followerList = [
        {
          id: this.user.id,
          user_name: this.user.nickName
        }
      ]
      this.form.followerId = this.user.id
    }
    this.query(1)
  },
  filters: {
    processStatusDesc: function(value) {
      if (!value) return ''
      if ('01' == value) {
        return '新建'
      } else if ('02' == value) {
        return '已分配'
      } else if ('03' == value) {
        return '工单已回复'
      } else if ('04' == value) {
        return '顾问已回复'
      } else if ('05' == value) {
        return '用户删除'
      } else if ('06' == value) {
        return '跟单删除'
      } else if ('07' == value) {
        return '关闭'
      }
      return ''
    },
    statusDesc(val) {
      if ('01' == val) {
        return '已提交'
      } else if ('02' == val) {
        return '处理中'
      } else if ('03' == val) {
        return '无效'
      } else if ('04' == val) {
        return '关闭'
      }
      return ''
    }
  },
  watch: {
    dialogFormVisible(v) {
      if (v) return
      //清空表单
      this.$refs['assignForm'].resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.sortField {
  color: #409eff;
  border-color: #409eff;
}
</style>
