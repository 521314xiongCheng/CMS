<template>
  <div>
    <!-- <div class="g-page-bar" style="border-bottom: 1px solid #e6e6e6;">
      <span class="page-title">Feedback Manage / Type Manage</span>
    </div> -->
    <div
      style="padding:20px 0;border-bottom: 1px solid #eee; text-align: right;"
    >
      <el-button type="primary" @click="add">New</el-button>
    </div>
    <div style="margin-top: 15px;">
      <el-table
        :data="tableData.data"
        tooltip-effect="dark"
        style="width: 100%"
        border=""
      >
        <el-table-column
          label="ID"
          width="60"
          prop="id"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="typeName"
          label="typeName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="create_time"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">{{ scope.row.createdDate }}</template>
        </el-table-column>
        <el-table-column
          prop="createdBy"
          label="create_user"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          prop="updatedDate"
          label="last_modify"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          prop="updatedBy"
          label="modify_user"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          prop="typeCaseCount"
          label="numbers"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column prop="status" label="status" width="80" align="center">
          <template slot-scope="scope">{{
            scope.row.status ? '有效' : '无效'
          }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="70" align="center">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" size="small"
              >Edit</el-button
            >
          </template>
        </el-table-column>
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
    <!-- edit/new dialogForm -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="Type Name" prop="typeName">
          <el-input v-model="form.typeName"></el-input>
        </el-form-item>
        <el-form-item label="Status" prop="status">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer text-center">
        <el-button
          @click="
            $refs['form'].resetFields()
            dialogFormVisible = false
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { get, add, edit } from '../../api/feedback/type.js'
import { readUserInfo } from '../../utility/index'
export default {
  data() {
    return {
      tableData: {
        data: [],
        pageData: {
          pageNo: 1,
          pageSize: 1000,
          totalCount: 0
        }
      },
      dialogTitle: 'Create',
      statusList: [
        {
          value: false,
          name: '无效'
        },
        {
          value: true,
          name: '有效'
        }
      ],
      form: {
        status: true,
        typeName: ''
      },
      typeId: '',
      dialogFormVisible: false,
      isEdit: false,
      username: ''
    }
  },
  methods: {
    add() {
      this.dialogFormVisible = true
      this.dialogTitle = 'Create'
      this.isEdit = false
    },
    edit(row) {
      this.isEdit = true
      this.dialogTitle = 'Edit'
      this.typeId = row.id
      let self = this
      this.$nextTick(() => {
        self.form = {
          typeName: row.typeName,
          status: row.status
        }
      })

      this.dialogFormVisible = true
    },
    getTableList() {
      // this.pageNo = pageNo;
      get({
        pageSize: 1000,
        pageNo: 1
      }).then(res => {
        this.tableData.data = res.types
        this.tableData.pageData.totalCount = res.totalCount
      })
    },
    submit() {
      if (this.isEdit) {
        const params = {}
        params.id = this.typeId
        params.data = this.form
        params.username = this.username
        edit(params).then(() => {
          // console.log(res)
          this.dialogFormVisible = false
          this.getTableList(1)
        })
      } else {
        const params = { username: this.username, data: this.form }
        add(params).then(() => {
          // console.log(res)
          this.dialogFormVisible = false
          this.getTableList(1)
        })
      }
    }
  },
  mounted() {
    this.username = readUserInfo().name
    this.getTableList(1)
  },
  watch: {
    dialogFormVisible(v) {
      if (v) return
      //清空表单
      this.$refs['form'].resetFields()
      // this.resetForm('form')
    }
  }
}
</script>

<style></style>
