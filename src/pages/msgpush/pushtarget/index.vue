<template>
  <div>
    <!-- <div class="g-page-bar" style="border-bottom: 1px solid #e6e6e6;">
      <span class="page-title">推送人群管理</span>
    </div> -->

    <!-- query form -->
    <div style="border-bottom: 1px solid #eee;">
      <el-form ref="form" :model="form" size="small" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="8">
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

          <el-col :span="8">
            <el-form-item label="人群名称">
              <el-input v-model="form.groupName"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8" style="display: flex;">
            <div style="margin-left: auto;">
              <el-button type="primary" size="small" @click="query(1)"
                >Query</el-button
              >
              <el-button
                type="primary"
                @click="showAddForm"
                size="small"
                style="margin-left: 5px;"
                >Add</el-button
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
        <el-table-column label="人群ID" prop="id" width="70"></el-table-column>
        <el-table-column
          label="Client"
          prop="appName"
          width="110"
        ></el-table-column>
        <el-table-column label="人群名称" prop="groupName"></el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column
          label="创建时间"
          prop="createdDate"
          width="170"
        ></el-table-column>
        <el-table-column
          label="更新时间"
          prop="updatedDate"
          width="170"
        ></el-table-column>
        <el-table-column
          label="人数"
          prop="userCount"
          width="70"
        ></el-table-column>
        <el-table-column label="状态" prop="actual" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.statusText }}&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <el-button
              size="mini"
              type="success"
              @click="query(tableData.pageData.pageNo)"
              v-if="scope.row.statusText == '人群计算中'"
              >刷新</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          prop="actual"
          align="center"
          width="150"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="showEditForm(scope.row)"
              v-if="scope.row.crowdName != '全部'"
              >修改</el-button
            >
            <el-button
              v-if="scope.row.status == 0"
              size="mini"
              type="primary"
              @click="
                $router.push({
                  name: 'msgpush-pushtarget-push_target_definition',
                  params: {
                    id: scope.row.id,
                    appName: scope.row.appName,
                    groupName: scope.row.groupName
                  }
                })
              "
              >定义人群</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;" v-if="tableData.pageData">
        <el-pagination
          style="margin-left: auto;"
          @current-change="handleCurrentChange"
          :page-size="tableData.pageData ? tableData.pageData.pageSize : 0"
          :current-page.sync="tableData.pageData.pageNo"
          layout="total, prev, pager, next"
          :total="tableData.pageData ? tableData.pageData.totalCount : 0"
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
        <el-form-item label="人群ID" v-if="isEdit" prop="id">
          <el-input v-model="addForm.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Client" prop="appName">
          <el-select
            v-model="addForm.appName"
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
        <el-form-item label="人群名称" prop="groupName">
          <el-input v-model="addForm.groupName"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="10"
            v-model="addForm.remark"
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
import {
  add,
  get,
  getDetail,
  edit
} from '../../../api/msgpush/push_target_manage.js'
import { readUserInfo } from '../../../utility/index'
// import { setInterval } from 'timers'

export default {
  components: {},
  // mixins: [dialogForm],
  data() {
    return {
      tableData: {
        data: [],
        pageData: {
          pageNo: 1,
          pageSize: 5,
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
      dialogFormVisible: false,
      addForm: {},
      dialogTitle: 'Create',
      isEdit: false,
      username: '',
      rules: {
        appName: [
          {
            required: true,
            message: 'please select the client',
            trigger: 'change'
          }
        ],
        groupName: [
          {
            required: true,
            message: '请填写人群名称',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    query(pageNo) {
      this.pageNo = pageNo
      this.form.pageSize = this.pageSize
      this.form.pageNo = pageNo
      get(this.form).then(res => {
        this.tableData.data = res.groups
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
      this.dialogTitle = 'Create'
      this.isEdit = false
    },
    showEditForm(row) {
      this.dialogFormVisible = true
      this.dialogTitle = 'Edit'
      this.isEdit = true
      let self = this
      getDetail({ id: row.id }).then(res => {
        self.addForm = res
        // self.addForm.groupId = res.groupId.split(',')
        console.log(res)
      })
    }
  },
  mounted() {
    this.form.appName = this.clientList[0].id
    this.username = readUserInfo().name
    this.query(this.tableData.pageData.pageNo)
    // setInterval(()=>{
    //   this.query(this.tableData.pageData.pageNo)
    // },10000)
  },
  created() {
    console.log('-------------------------')
    // setInterval(()=>{
    //   this.query(this.tableData.pageData.pageNo)
    // },10000)
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
