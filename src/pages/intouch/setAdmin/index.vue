<template>
  <div>
    <div class="el-menu g-page-bar">
      <el-button size="small" @click="showAddForm" type="primary"
        >新增</el-button
      >
    </div>
    <div class="table-wrap">
      <el-table :data="tableData.list" border style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="60"
        ></el-table-column>
        <el-table-column
          prop="direct_seller_id"
          align="center"
          label="账号"
        ></el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="姓名"
        ></el-table-column>
        <el-table-column width="150" label="操作" align="center">
          <template slot-scope="scope">
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

    <el-dialog title="新增管理员账号" :visible.sync="addDialog" width="50%">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="账号/DirectSellerId" prop="direct_seller_id">
          <el-input v-model="form.direct_seller_id" maxlength="12"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button size="small" @click="addDialog = false">取 消</el-button>
          <el-button size="small" type="primary" @click="add('form')"
            >确 定</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getAdminList, addAdmin, deleteAdmin } from '@/api/xxxxxxx/topic.js'
import { readUserInfo } from '@/utility/index'
export default {
  name: 'xxxxxxx-setAdmin-index',
  data() {
    return {
      pageSize: 20,
      pageNo: 1,
      tableData: {
        list: [],
        total: 0
      },
      form: {
        direct_seller_id: ''
      },
      rules: {
        direct_seller_id: [
          { required: true, message: '请输入顾问12位编号', trigger: 'blur' }
        ]
      },
      addDialog: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    add(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.created_by = readUserInfo().name
          addAdmin(this.form).then(res => {
            console.log(res)
            this.addDialog = false
            this.getList()
          })
        } else {
          return false
        }
      })
    },
    showAddForm() {
      this.form.created_by = ''
      this.form.direct_seller_id = ''
      this.addDialog = true
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.pageNo = 1
      this.getList()
    },
    getList() {
      let param = {
        page_size: this.pageSize,
        page_number: this.pageNo
      }
      getAdminList(param).then(res => {
        console.log(res)
        this.tableData.list = res.data.list
        this.tableData.total = res.data.total
      })
    },
    queryData() {
      this.pageNo = 1
      this.getList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageNo = val
      this.getList()
    },
    deleteAction(row) {
      console.log(row)
      //该文章已被引用至小程序，若删除，小程序上将看不到此文章，需珍重操作！请确认是否需要删除？
      this.$confirm('确定要删除这条数据嘛?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAdmin(row.id).then(res => {
          console.log(res)
          this.getList()
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.table-wrap {
  width: 100%;
  .page-box {
    margin: 30px 0;
    text-align: right;
  }
}
</style>
