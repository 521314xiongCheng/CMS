<template>
  <div>
    <!-- <div class="g-page-bar" style="border-bottom: 1px solid #e6e6e6;">
      <span class="page-title">推送脚本</span>
    </div> -->
    <!-- query form -->
    <div style="border-bottom: 1px solid #eee;">
      <el-form ref="form" :model="form" size="small" label-width="60px">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="Client">
              <el-select
                v-model="form.appName"
                clearable
                placeholder="please select the client"
              >
                <el-option
                  v-for="item in clientList"
                  :key="item.id"
                  :label="item.client_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8" style="display: flex;">
            <div style="margin-left: auto;">
              <el-button type="primary" size="small" @click="query(1)"
                >Query</el-button
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
        style="width: 100%"
        border
      >
        <el-table-column
          label="任务ID"
          width="70"
          align="center"
          prop="id"
        ></el-table-column>
        <el-table-column
          label="Client"
          width="110"
          align="center"
          prop="appName"
        ></el-table-column>
        <el-table-column
          label="任务名称"
          width="110"
          align="center"
          prop="taskName"
        ></el-table-column>
        <el-table-column
          label="标题"
          width="220"
          align="center"
          prop="title"
        ></el-table-column>
        <el-table-column label="内容" prop="message"></el-table-column>
        <el-table-column
          label="打开/已推/应推(今日)"
          width="160"
          align="center"
          prop="todayNumber"
        >
          <template slot-scope="scope"
            >{{ scope.row.todayOpenedCount ? scope.row.todayOpenedCount : 0 }} |
            {{ scope.row.todayPushedCount ? scope.row.todayPushedCount : 0 }} |
            {{
              scope.row.todayShouldPushCount
                ? scope.row.todayShouldPushCount
                : 0
            }}</template
          >
        </el-table-column>
        <el-table-column
          label="打开/已推/应推"
          width="140"
          align="center"
          prop="numberPeple"
        >
          <template slot-scope="scope"
            >{{ scope.row.openedCount ? scope.row.openedCount : 0 }} |
            {{ scope.row.pushedCount ? scope.row.pushedCount : 0 }} |
            {{
              scope.row.shouldPushCount ? scope.row.shouldPushCount : 0
            }}</template
          >
        </el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="showEditForm(scope.row)"
              >修改推送内容</el-button
            >
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
        ></el-pagination>
      </div>
    </div>
    <!-- 		appName: "SkinAnalyzer"
id: 2
message: "string内容2"
pushType: "反馈回复提醒"
pushTypeValue: "0asdf"
taskName: "反馈回复提醒"
    title: "string标题2"-->

    <!-- edit/new dialogForm -->
    <el-dialog title="修改 推送任务" :visible.sync="dialogFormVisible">
      <el-form
        ref="addForm"
        size="small"
        :model="addForm"
        label-width="200px"
        label-position="left"
      >
        <el-form-item label="任务ID" prop="id">
          <el-input v-model="addForm.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Client" prop="appName">
          <el-select
            v-model="addForm.appName"
            disabled
            placeholder="please select the client"
          >
            <el-option
              v-for="item in clientList"
              :key="item.id"
              :label="item.client_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="pushType">
          <el-select
            v-model="addForm.pushType"
            disabled
            placeholder="please select the type"
          >
            <el-option
              v-for="item in scriptTypeList"
              :key="item.id"
              :label="item.type_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标" prop="pushTypeValue">
          <el-input v-model="addForm.pushTypeValue" disabled></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="message">
          <el-input
            type="textarea"
            :disabled="addForm.id == 2"
            :rows="10"
            v-model="addForm.message"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer text-center">
        <el-button
          size="small"
          @click="
            $refs['addForm'].resetFields()
            dialogFormVisible = false
          "
        >
          取 消
        </el-button>
        <el-button type="primary" @click="submit" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSelect } from '../../../api/msgpush/push_target_manage.js'
import {
  get,
  getDetail,
  edit
} from '../../../api/msgpush/single_push_task_list.js'
import { readUserInfo } from '../../../utility/index'
export default {
  components: {},
  // mixins: [dialogForm],
  data() {
    return {
      tableData: {
        data: [],
        pageData: {
          pageNo: 1,
          pageSize: 10,
          totalCount: 1
        }
      },
      form: {},
      clientList: [
        {
          id: 'SkinAnalyzer',
          client_name: 'SkinAnalyzer'
        }
      ],
      scriptTypeList: [
        {
          id: 3,
          type_name: '邀约接受提醒'
        },
        {
          id: 4,
          type_name: '反馈回复提醒'
        }
      ],
      dialogFormVisible: false,
      addForm: {},
      username: '',
      rules: {
        title: [
          {
            required: true,
            message: '请填写标题',
            trigger: 'blur'
          }
        ],
        message: [
          {
            required: true,
            message: '请填写内容',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    query(pageNo) {
      this.pageNo = pageNo
      this.form.pageSize = 10
      this.form.pageNo = pageNo
      get(this.form).then(res => {
        console.log(res)
        this.tableData.data = res.tasks
        this.tableData.pageData.totalCount = res.totalCount
        this.tableData.pageData.pageSize = res.pageSize
        this.tableData.pageData.pageNo = res.pageNo
      })
    },
    handleCurrentChange(pageNo) {
      this.query(pageNo)
    },
    submit() {
      if (
        this.addForm.id == 1 &&
        !this.addForm.message.includes('{CustomerName}')
      ) {
        this.$message({
          message: '没有添加 {CustomerName} 字段，消息推送内容将无顾客姓名',
          type: 'warning',
          duration: 8000
        })
      }

      if (
        this.addForm.id == 1 &&
        !this.addForm.message.includes('{PhoneNumber}')
      ) {
        this.$message({
          message: '没有添加 {PhoneNumber} 字段，消息推送内容将无顾客手机号',
          type: 'warning',
          duration: 8000
        })
      }

      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.addForm.createdBy = this.username
          const params = {
            data: this.addForm
          }
          edit(params).then(() => {
            this.dialogFormVisible = false
            this.query(1)
          })
        } else {
          console.log('error submit!!')
          return
        }
      })
    },
    showEditForm(row) {
      this.dialogFormVisible = true
      let self = this
      getDetail({
        id: row.id
      }).then(res => {
        console.log(res)
        self.addForm = res
        // 					self.addForm.groupId = res.groupId.split(',')
        // 					console.log(self.addForm.groupId)
      })
    }
  },
  mounted() {
    this.form.appName = this.clientList[0].id
    this.username = readUserInfo().name
    this.query(1)
    getSelect({ appName: this.form.appName }).then(res => {
      this.targetPopulationOptions = res
      console.log(this.targetPopulationOptions)
    })
  },
  watch: {
    dialogFormVisible(v) {
      if (v) return
      //清空表单
      this.$refs['addForm'].resetFields()
    }
  }
}
</script>
