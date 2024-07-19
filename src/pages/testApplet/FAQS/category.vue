<template>
  <div>
    <!-- head -->
    <div class="el-menu g-page-bar">
      <!-- <span class="page-title">FAQS Category</span> -->
      <el-form :inline="true">
        <el-form-item label="Name">
          <el-input v-model="name" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="handleSearch"
            >Search</el-button
          >
        </el-form-item>
      </el-form>
      <el-button
        class="add-btn"
        icon="el-icon-plus"
        size="mini"
        @click="add"
      ></el-button>
    </div>
    <!-- table -->
    <div class="table-wrap">
      <table-list :tableData="tableData" :choosePageFn="choosePageFn">
        <el-table-column label="" align="center" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="editAction(scope)"
              >Edit</el-button
            >
            <el-button size="mini" type="danger" @click="deleteAction(scope)"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </table-list>
    </div>
    <!-- dialog -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form
        :model="form"
        ref="form"
        size="small"
        :rules="rules"
        :label-width="formLabelWidth"
        label-position="left"
      >
        <el-form-item label="Category Name" prop="name">
          <el-input
            type="text"
            v-model="form.name"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="Superior Category ID" prop="parentId">
          <el-select v-model="form.parentId" placeholder="请选择">
            <el-option label="请选择" :value="null"></el-option>
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
          <!-- <el-input type="text" v-model="form.parentId" auto-complete="off"></el-input> -->
        </el-form-item>
        <el-form-item label="Sorting" prop="sort">
          <el-input
            type="number"
            v-model.number="form.sort"
            auto-complete="off"
            placeholder="only number"
          ></el-input>
        </el-form-item>
        <div class="text-center">
          <el-button @click="handleCancel" size="small">Cancel</el-button>
          <el-button type="primary" @click="submit" size="small"
            >Confirm</el-button
          >
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// 公用表格列表组件 引入
import TableList from '@/components/tableList.vue'
import dialogForm from '@/mixins/dialogForm'
import { mergeObj } from '@/utility/index'

// api引入
import {
  get,
  create,
  del,
  edit,
  getList
} from '@/api/testApplet/FAQs/category.js'
// import Vue from "vue";
export default {
  components: {
    TableList
  },
  mixins: [dialogForm],
  data() {
    return {
      categoryList: [],
      faqsList: [],
      faqsVisible: false,
      name: '',
      categoryId: null,
      categoryName: '',
      pageNo: 1,
      tableData: {
        header: [
          {
            tableId: 'id',
            tableName: 'Id',
            tableWidth: '50px'
          },
          {
            tableId: 'name',
            tableName: 'Category Name'
          },
          {
            tableId: 'parentName',
            tableName: 'Superior Category'
          },
          {
            tableId: 'sort',
            tableName: 'Sort',
            tableWidth: '50px'
          },
          {
            tableId: 'createdDate',
            tableName: 'Created Date'
          },
          {
            tableId: 'updatedDate',
            tableName: 'Updated Date'
          }
        ],
        data: [],
        pageData: {
          pageSize: 20,
          totalCount: 0
        }
      },
      dialogTitle: 'New Category',
      formLabelWidth: '150px',
      form: {
        name: '',
        sort: null,
        parentId: null
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Please enter Category Name',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // add
    add() {
      this.dialogTitle = 'New Category'
      this.showDialogForm()
      this.isEdit = false
      this.form.parentId = null
      getList().then(res => {
        this.categoryList = res.faqCategories
      })
    },
    // edit
    editAction(scope) {
      this.dialogTitle = 'Edit'
      this.isEdit = true
      this.showDialogForm()
      this.categoryId = scope.row.id
      const self = this
      getList().then(res => {
        let categories = res.faqCategories
        categories.forEach((item, i) => {
          if (item.id == scope.row.id) {
            categories.splice(i, 1)
          }
        })
        this.categoryList = categories
      })
      this.$nextTick(() => {
        self.form = mergeObj(self.form, scope.row)
      })
    },
    // delete
    deleteAction(scope) {
      this.$confirm('Would you like to delete the item?', 'Tips', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        del({
          id: scope.row.id
        }).then(() => {
          // console.log(res)
          this.getTableList(this.pageNo)
        })
      })
    },
    sortId(a, b) {
      return a.num - b.num
    },
    getTableList(pageNo) {
      this.pageNo = pageNo
      if (this.name) {
        get({
          name: this.name,
          pageSize: this.tableData.pageData.pageSize,
          pageNo
        }).then(res => {
          this.tableData.data = res.faqCategories
          this.tableData.pageData.totalCount = res.totalCount
        })
      } else {
        get({
          pageSize: this.tableData.pageData.pageSize,
          pageNo
        }).then(res => {
          this.tableData.data = res.faqCategories
          this.tableData.pageData.totalCount = res.totalCount
        })
      }
    },
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.parentId == '') {
            this.form.parentId = null
          }
          if (this.form.sort == '') {
            this.form.sort = null
          }
          if (this.isEdit) {
            const params = {}
            params.id = this.categoryId
            params.data = this.form
            edit(params).then(() => {
              // console.log(res)
              this.handleCancel()
              this.getTableList(this.pageNo)
            })
          } else {
            const params = this.form
            create(params).then(() => {
              // console.log(res)
              this.handleCancel()
              this.getTableList(1)
            })
          }
        } else {
          return false
        }
      })
    },
    handleSearch() {
      this.getTableList(this.pageNo)
    }
  },
  mounted() {
    getList().then(res => {
      this.categoryList = res.faqCategories
    })
    ;(this.name = ''), this.getTableList(1)
  }
}
</script>
<style lang="less" scoped>
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  width: 133px;
  height: 100px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 133px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 133px;
  height: 100px;
  display: block;
}

.marginleft {
  margin-left: 60px;
}
</style>
