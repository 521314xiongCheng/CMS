<template>
  <div>
    <!-- head -->
    <div class="el-menu g-page-bar">
      <!-- <span class="page-title">Age Range</span> -->
      <el-form :inline="true">
        <el-form-item label="Show Name">
          <el-input
            v-model="showName"
            auto-complete="off"
            size="small"
          ></el-input>
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
        <el-table-column label="" align="center" width="150px">
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
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      size="small"
    >
      <el-form
        :model="form"
        ref="form"
        size="small"
        :rules="rules"
        :label-width="formLabelWidth"
        label-position="left"
      >
        <el-form-item label="ShowName" prop="showName">
          <el-input
            type="text"
            v-model="form.showName"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="Begin Age" prop="beginAge">
          <el-input
            type="text"
            v-model.number="form.beginAge"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="End Age" prop="endAge">
          <el-input
            type="text"
            v-model.number="form.endAge"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="Sort" prop="sort">
          <el-input
            type="text"
            v-model.number="form.sort"
            auto-complete="off"
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
// import upload from "../utility/learn_upload.js"
import dialogForm from '@/mixins/dialogForm.js'
import { mergeObj } from '@/utility/index'

import { get, create, del, edit } from '@/api/testApplet/ageRange.js'
export default {
  components: {
    TableList
  },
  mixins: [dialogForm],
  data() {
    return {
      showName: '',
      id: '',
      pageNo: 1,
      tableData: {
        header: [
          {
            tableId: 'id',
            tableName: 'Id',
            tableWidth: '50px'
          },
          {
            tableId: 'showName',
            tableName: 'Show Name'
          },
          {
            tableId: 'beginAge',
            tableName: 'Begin Age'
          },
          {
            tableId: 'endAge',
            tableName: 'End Age'
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
      dialogTitle: 'New Age Range',
      formLabelWidth: '150px',
      form: {
        showName: '',
        beginAge: null,
        endAge: null,
        sort: null
      },
      rules: {}
    }
  },
  methods: {
    // add
    add() {
      this.dialogTitle = 'New Age Range'
      this.showDialogForm()
      this.isEdit = false
    },
    // edit
    editAction(scope) {
      this.dialogTitle = 'Edit'
      this.id = scope.row.id
      this.isEdit = true
      this.form = mergeObj(this.form, scope.row)

      this.showDialogForm()
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
          this.getTableList(this.pageNo)
        })
      })
    },
    getTableList(pageNo) {
      const params = {
        pageSize: this.tableData.pageData.pageSize,
        pageNo
      }
      if (this.showName) {
        params.showName = this.showName
      }
      this.pageNo = pageNo

      get(params).then(res => {
        this.tableData.data = res.ageRanges
        this.tableData.pageData.totalCount = res.totalCount
      })
    },
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.sort == '') {
            this.form.sort = null
          }
          if (this.form.beginAge == '') {
            this.form.beginAge = null
          }
          if (this.form.endAge == '') {
            this.form.endAge = null
          }
          if (this.isEdit) {
            const params = {}
            params.id = this.id
            params.data = this.form
            edit(params).then(() => {
              this.handleCancel()
              this.getTableList(this.pageNo)
            })
          } else {
            const params = this.form
            params.id = this.id
            create(params).then(() => {
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
    this.showName = ''
    this.getTableList(1)
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
</style>
