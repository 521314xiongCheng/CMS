<template>
  <div>
    <!-- <div class="g-page-bar" style="border-bottom: 1px solid #e6e6e6;">
      <span class="page-title">推送任务管理</span>
    </div> -->
    <!-- query form -->
    <div style="margin-top: 20px;border-bottom: 1px solid #eee;">
      <el-form ref="form" :model="form" size="small" label-width="80px">
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
                >查找/刷新</el-button
              >
              <el-button
                type="primary"
                @click="showAddForm"
                size="small"
                style="margin-left: 5px;"
                >添加</el-button
              >
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- table data -->
    <div style="margin-top: 15px;">
      <el-table
        :data="tableData.data"
        tooltip-effect="dark"
        style="width: 100%"
        border
      >
        <el-table-column
          label="任务ID"
          prop="id"
          align="center"
          width="60"
        ></el-table-column>
        <el-table-column
          label="Client"
          prop="appName"
          width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          label="预定发送时间"
          prop="taskStartTime"
          width="160"
          align="center"
        >
          <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
        </el-table-column>
        <el-table-column
          label="内容"
          prop="message"
          align="center"
        ></el-table-column>
        <el-table-column
          label="类型"
          prop="pushType"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          label="创建人"
          prop="createdBy"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          label="目标人群"
          prop="groupNames"
          align="left"
        ></el-table-column>
        <el-table-column
          label="打开/已推/应推"
          prop="number"
          width="130"
          align="center"
        >
          <template slot-scope="scope"
            >{{ scope.row.openedCount ? scope.row.openedCount : 0 }} |
            {{ scope.row.pushedCount ? scope.row.pushedCount : 0 }} |
            {{
              scope.row.shouldPushCount ? scope.row.shouldPushCount : 0
            }}</template
          >
        </el-table-column>
        <el-table-column
          label="状态"
          prop="status"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="230">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="showEditForm(scope.row)"
              v-if="scope.row.status == '待推送'"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="pushNowConfirm(scope.row.id)"
              v-if="scope.row.status == '待推送'"
              >立即推送</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="
                $router.push({
                  name: 'msgpush-batchtask-push_task_detail',
                  params: { id: scope.row.id }
                })
              "
              >查看详情</el-button
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
          :current-page="tableData.pageData.pageNo"
        ></el-pagination>
      </div>
    </div>

    <!-- edit/new dialogForm -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form
        ref="addForm"
        size="small"
        :rules="rules"
        :model="addForm"
        label-width="120px"
        label-position="left"
      >
        <el-form-item label="任务ID" v-if="isEdit" prop="id">
          <el-input v-model="addForm.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Client" prop="appName">
          <el-select
            v-model="addForm.appName"
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
            clearable
            placeholder="please select the type"
          >
            <el-option
              v-for="item in taskTypeList"
              :key="item.id"
              :label="item.type_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标" prop="pushTypeValue">
          <el-input v-model="addForm.pushTypeValue"></el-input>
        </el-form-item>
        <el-form-item label="预定推送时间" prop="taskStartTime">
          <el-date-picker
            v-model="addForm.taskStartTime"
            type="datetime"
            value-format="yyyy/MM/dd HH:mm:00"
            :picker-options="pickerOptions"
            :default-value="new Date()"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="目标人群" prop="groupId">
          <el-select
            v-model="addForm.groupId"
            multiple
            placeholder="please select the Target"
            style="width: 300px"
          >
            <el-option
              v-for="item in targetPopulationOptions"
              :key="item.id"
              :label="item.id + '-' + item.groupName"
              :value="item.id + ''"
              v-show="item.status == 2 && item.count > 0"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="message">
          <el-input
            type="textarea"
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
    <el-dialog
      title="提示"
      :visible.sync="pushnowDialogVisible"
      width="300px"
      :show-close="false"
      center
    >
      <div style="text-align:center;">确定立即发送当前消息？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pushnowDialogVisible = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="pushNow" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getSelect } from '../../../api/msgpush/push_target_manage.js'
import { readUserInfo } from '../../../utility/index'

import {
  get,
  getDetail,
  add,
  edit,
  pushMsgNow
} from '../../../api/msgpush/push_task_list.js'
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
      taskTypeList: [
        {
          id: 1,
          type_name: '首页'
        },
        {
          id: 2,
          type_name: '培训与指导'
        }
      ],
      targetPopulationOptions: [],
      dialogFormVisible: false,
      addForm: {},
      pickerOptions: {
        step: '00:05',
        disabledDate(time) {
          return time.getTime() + 1000 * 60 * 60 * 24 < Date.now()
        }
      },
      dialogTitle: '新建 推送任务',
      isEdit: false,
      username: '',
      pushnowDialogVisible: false,
      rules: {
        appName: [
          {
            required: true,
            message: 'please select the client',
            trigger: 'change'
          }
        ],
        pushType: [
          {
            required: true,
            message: 'please select the type',
            trigger: 'change'
          }
        ],

        groupId: [
          {
            type: 'array',
            required: true,
            message: 'please select the Target',
            trigger: 'blur'
          }
        ],
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
      this.form.pageSize = this.tableData.pageData.pageSize
      this.form.pageNo = pageNo
      get(this.form).then(res => {
        for (let o of res.tasks) {
          let idNames = []

          for (let g of (o.groupId + ',').split(',')) {
            let res = this.targetPopulationOptions.find(x => x.id == g)
            if (res) {
              idNames.push(res.groupName)
            }
          }

          console.log('-----', idNames)
          o.groupNames = idNames.join(' / ')

          // if()
        }

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
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          if (this.addForm.pushType == 2 && !this.addForm.pushTypeValue) {
            this.$message({
              message: '请填写完整的地址',
              type: 'warning'
            })
            return
          }

          if (this.addForm.taskStartTime) {
            if (
              new Date(this.addForm.taskStartTime).getTime() <
              Date.now() - 60 * 1000
            ) {
              this.$message({
                message: '请选择正确的推送时间',
                type: 'warning'
              })
              return
            }
          }

          if (this.isEdit) {
            this.addForm.createdBy = this.username || 'local'
            const params = {
              data: this.addForm
            }
            edit(params).then(() => {
              this.dialogFormVisible = false
              this.query(1)
            })
          } else {
            this.addForm.createdBy = this.username || 'local'
            const params = {
              data: this.addForm
            }
            add(params).then(() => {
              this.dialogFormVisible = false
              this.query(1)
            })
          }
        } else {
          console.log('error submit!!')
          return
        }
      })
    },
    showAddForm() {
      this.dialogFormVisible = true
      this.dialogTitle = '新建 推送任务'
      this.isEdit = false
    },
    showEditForm(row) {
      this.dialogFormVisible = true
      this.dialogTitle = '修改 推送任务'
      this.isEdit = true
      let self = this
      getDetail({
        id: row.id
      }).then(res => {
        self.addForm = res
        self.addForm.groupId = res.groupId.split(',')
      })
    },
    pushNowConfirm(id) {
      this.pushnowDialogVisible = true
      this.pushNowId = id
    },
    pushNow() {
      this.pushnowDialogVisible = false
      pushMsgNow({ id: this.pushNowId }).then(res => {
        console.log(res)
        this.$notify({
          title: '成功',
          message: '立即推送开启成功',
          type: 'success'
        })

        if (res == 'true') {
          setTimeout(() => {
            this.query(this.tableData.pageData.pageNo)
          }, 5000)
        }
      })
    }
  },
  mounted() {
    this.form.appName = this.clientList[0].id
    this.username = readUserInfo().name

    getSelect({ appName: this.form.appName }).then(res => {
      this.targetPopulationOptions = res
      console.log(this.targetPopulationOptions)
      this.query(1)
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
