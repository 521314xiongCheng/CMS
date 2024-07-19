<template>
  <div>
    <div class="el-menu g-page-bar">
      <!-- <span class="page-title">进阶提升</span> -->
      <el-input
        size="small"
        style="width:280px;margin-right:10px;"
        placeholder="Search"
        v-model="title"
        clearable
      >
        <el-button
          slot="append"
          @click="queryData"
          icon="el-icon-search"
        ></el-button>
      </el-input>
      <el-button
        @click="openDialog"
        size="small"
        type="primary"
        class="marginleft"
        >新增分类</el-button
      >
      <el-button
        @click="sortCategory"
        size="small"
        type="success"
        class="marginleft"
        >更新排序</el-button
      >
    </div>
    <!-- table -->
    <div class="table-wrap">
      <el-table :data="tableData.categorys" border style="width: 100%">
        <el-table-column
          align="center"
          prop="isShareWords"
          label="发布"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.publishState"
              @click="publishCategory(scope.row)"
              size="mini"
              type="primary"
              >发布</el-button
            >
            <el-button
              v-else
              size="mini"
              @click="publishCategory(scope.row)"
              type="danger"
              >取消发布</el-button
            >
          </template>
        </el-table-column>
        <el-table-column align="center" prop="sort" label="排序" width="100">
          <template slot-scope="scope">
            <el-input
              size="mini"
              @blur="changeSort(scope.row)"
              type="number"
              v-model="scope.row.sort"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="id"
          label="分类ID"
          width="280"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="分类名称"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="createdDate"
          label="创建时间"
          width="150"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="editAction(scope.row)"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="success"
              @click="manageAction(scope.row)"
              >管理</el-button
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
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="tableData.totalCount"
        ></el-pagination>
      </div>
    </div>

    <el-dialog
      @close="closeDialog"
      title="编辑"
      :visible.sync="editDiolog"
      width="50%"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editForm"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input
            size="medium"
            placeholder=""
            style="width:70%"
            v-model="editForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button size="small" @click="editDiolog = false">取消</el-button>
          <el-button size="small" type="primary" @click="submitForm('editForm')"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getList,
  addCategory,
  editCategory,
  sortCategory,
  publishCategory,
  delCategory
} from '@/api/testApplet/sales/required.js'
export default {
  name: 'testApplet-sales-advanced-index',
  data() {
    return {
      title: '',
      parentId: '9d6d5fb0-3ba8-3d79-d47d-61ed01e337ba',
      pageSize: 20,
      pageNo: 1,
      tableData: {
        categorys: [],
        totalCount: 0
      },
      editDiolog: false,
      editForm: {
        name: ''
      },
      editFormRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      sortCategorys: {
        categorys: []
      }
    }
  },
  mounted() {
    this.getRequiredList()
  },
  methods: {
    getRequiredList() {
      let params = {
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        title: this.title ? this.title : ''
      }
      console.log(params)
      getList(this.parentId, params).then(res => {
        console.log(res)
        this.tableData = { ...res }
      })
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageNo = val
      this.getRequiredList()
    },
    queryData() {
      this.pageNo = 1
      this.getRequiredList()
    },
    deleteAction(row) {
      console.log(row)
      this.$confirm('请确认是否需要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCategory(row.id).then(res => {
          console.log(res)
          this.getRequiredList()
        })
      })
    },
    openDialog() {
      this.editDiolog = true
    },
    closeDialog() {
      this.editForm.name = ''
      delete this.editForm.parentId
      delete this.editForm.id
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // this.addCategory()
          if (this.editForm.id) {
            this.editCategory()
          } else {
            this.addCategory()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addCategory() {
      this.editForm.parentId = this.parentId
      console.log(this.editForm)
      addCategory(this.editForm).then(res => {
        console.log(res)
        this.getRequiredList()
        this.editDiolog = false
        this.editForm.name = ''
        delete this.editForm.parentId
      })
    },
    editAction(row) {
      console.log(row)
      this.editForm.name = row.name
      this.editForm.id = row.id
      this.editDiolog = true
    },
    editCategory() {
      console.log()
      editCategory(this.editForm).then(res => {
        console.log(res)
        this.getRequiredList()
        this.editDiolog = false
        this.editForm.name = ''
        delete this.editForm.id
      })
    },
    changeSort(row) {
      console.log(row)
      let item = {
        id: row.id,
        sort: row.sort
      }
      for (let i in this.sortCategorys.categorys) {
        if (this.sortCategorys.categorys[i].id === row.id) {
          this.sortCategorys.categorys.splice(i, 1)
        }
      }
      this.sortCategorys.categorys.push(item)
      console.log(this.sortCategorys)
      // this.sortCategory()
    },
    sortCategory() {
      sortCategory(this.sortCategorys).then(res => {
        console.log(res)
        this.getRequiredList()
      })
    },
    publishCategory(row) {
      console.log(row)
      publishCategory(row.id).then(res => {
        console.log(res)
        this.getRequiredList()
      })
    },
    manageAction(row) {
      console.log(row)
      this.$router.push({
        name: 'testApplet-sales-advanced-manageCourse',
        query: { categoryId: row.id }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.page-box {
  margin: 30px 0;
  text-align: right;
}
</style>
