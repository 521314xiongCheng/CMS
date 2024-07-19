<template>
  <div>
    <!-- head -->
    <div class="el-menu g-page-bar">
      <!-- <span class="page-title">Promotions</span> -->
      <el-form :inline="true">
        <el-form-item label="Title">
          <el-input v-model="title" auto-complete="off" size="small"></el-input>
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
        <el-table-column label="" align="center" width="140px">
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
        <el-form-item label="Title" prop="title">
          <el-input
            type="text"
            v-model="form.title"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="Online Date" prop="onlineDate">
          <!-- <el-input type="text" v-model="form.effectiveDate" auto-complete="off" placeholder="yyyy-mm-dd hh:mm:ss"></el-input> -->
          <el-date-picker
            v-model="form.onlineDate"
            type="datetime"
            @change="getTime"
            formate="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Offline Date" prop="offlineDate">
          <!-- <el-input type="text" v-model="form.expiryDate" auto-complete="off" placeholder="yyyy-mm-dd hh:mm:ss"></el-input> -->
          <el-date-picker
            v-model="form.offlineDate"
            type="datetime"
            @change="getEndTime"
            formate="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Banner Image">
          <upload
            @change="handleBannerImageFileChange"
            accept="image/png, image/jpeg"
            :fileList="bannerImageFileList"
          ></upload>
          <span></span>
        </el-form-item>
        <el-form-item label="Cover Image" :required="true">
          <upload
            @change="handleCoverImageFileChange"
            accept="image/png, image/jpeg"
            :fileList="coverImageFileList"
          ></upload>
        </el-form-item>
        <el-form-item label="Sort" prop="sort">
          <el-input
            type="text"
            v-model="form.sort"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="Level Code(min)" prop="levelMin">
          <el-input
            type="text"
            v-model="form.levelMin"
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
import Upload from '@/components/upload.vue'
import dialogForm from '@/mixins/dialogForm.js'
import { mergeObj } from '@/utility/index'

import { get, create, del, edit } from '@/api/testApplet/promotions.js'
// import Vue from "vue";
export default {
  components: {
    TableList,
    Upload
  },
  mixins: [dialogForm],
  data() {
    return {
      title: '',
      id: '',
      bannerImageFileList: [],
      coverImageFileList: [],
      pageNo: 1,
      // name: '',s
      tableData: {
        header: [
          {
            tableId: 'id',
            tableName: 'Id',
            tableWidth: '50px'
          },
          {
            tableId: 'title',
            tableName: 'Title'
          },
          {
            tableId: 'onlineDate',
            tableName: 'Online Date'
          },
          {
            tableId: 'offlineDate',
            tableName: 'Offline Date'
          },
          {
            tableId: 'sort',
            tableName: 'Sort',
            tableWidth: '50px'
          },
          {
            tableId: 'levelMin',
            tableName: 'Level Code(min)'
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
      dialogTitle: 'New Promotion',
      formLabelWidth: '150px',
      form: {
        title: '',
        bannerImageUrl: '',
        coverImageUrl: '',
        onlineDate: '',
        offlineDate: '',
        sort: null,
        levelMin: null
      },
      rules: {
        title: [
          {
            required: true,
            message: 'Please enter Promotion Title',
            trigger: 'blur'
          }
        ],
        onlineDate: [
          {
            required: true,
            message: 'Please enter Online Date'
          }
          // { pattern: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/, message: '请输入2018-06-06 00:00:00格式的日期' }
        ],
        offlineDate: [
          {
            required: true,
            message: 'Please enter Offline Date'
          }
          // { pattern: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/, message: '请输入2018-06-06 00:00:00格式的日期' }
        ]
        // coverImageUrl: [
        //   {
        //     required: true,
        //     message: "Please upload Cover Image",
        //     trigger: "blur"
        //   }
        // ],
      }
    }
  },
  methods: {
    // add
    add() {
      ;(this.bannerImageFileList = []),
        (this.coverImageFileList = []),
        (this.dialogTitle = 'New Promotion')
      this.showDialogForm()
      this.form.bannerImageUrl = ''
      this.form.coverImageUrl = ''
      this.isEdit = false
    },
    // edit
    editAction(scope) {
      this.dialogTitle = 'Edit'
      this.id = scope.row.id
      this.isEdit = true
      this.showDialogForm()

      const self = this
      this.$nextTick(() => {
        self.form = mergeObj(self.form, scope.row)

        this.bannerImageFileList = [
          {
            name: scope.row.bannerImageUrl,
            url: scope.row.bannerImageUrl
          }
        ]
        this.coverImageFileList = [
          {
            name: scope.row.coverImageUrl,
            url: scope.row.coverImageUrl
          }
        ]
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
          this.getTableList(this.pageNo)
        })
      })
    },
    getTime(date) {
      this.time = date
      this.form.onlineDate = date
    },
    getEndTime(date) {
      this.time = date
      this.form.offlineDate = date
    },
    getTableList(pageNo) {
      this.pageNo = pageNo
      if (this.title) {
        get({
          title: this.title,
          pageSize: this.tableData.pageData.pageSize,
          pageNo
        }).then(res => {
          this.tableData.data = res.promotions
          this.tableData.pageData.totalCount = res.totalCount
        })
      } else {
        get({
          pageSize: this.tableData.pageData.pageSize,
          pageNo
        }).then(res => {
          this.tableData.data = res.promotions
          this.tableData.pageData.totalCount = res.totalCount
        })
      }
    },
    handleBannerImageFileChange(file, fileList) {
      this.handleUpload(file, fileList, 'bannerImageUrl', 'bannerImageFileList')
    },
    handleCoverImageFileChange(file, fileList) {
      this.handleUpload(file, fileList, 'coverImageUrl', 'coverImageFileList')
    },
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.sort == '') {
            this.form.sort = null
          }
          if (this.form.levelMin == '') {
            this.form.levelMin = null
          }
          if (!this.form.coverImageUrl) {
            let message = ''
            if (this.coverImageFileList.length) {
              message = 'Uploading'
            } else {
              message = 'Please Upload Cover Image'
            }
            this.$notify.error({
              message,
              duration: 1000
            })
            return
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
    this.title = ''
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
