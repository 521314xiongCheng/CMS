<template>
  <div>
    <!-- head -->
    <div class="el-menu g-page-bar">
      <span class="page-title"></span>
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
        <el-table-column label="" align="center" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="editAction(scope)"
              >Edit</el-button
            >
            <el-button size="mini" type="danger" @click="deleteAction(scope)"
              >Delete</el-button
            >
            <el-button size="mini" @click="more(scope)">More</el-button>
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
        <el-form-item label="SubTitle" prop="subTitle">
          <el-input
            type="text"
            v-model="form.subTitle"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="Start Date" prop="startDate">
          <!-- <el-input type="text" v-model="form.startDate" auto-complete="off" placeholder="yyyy-mm-dd hh:mm:ss"></el-input> -->
          <el-date-picker
            v-model="form.startDate"
            type="datetime"
            @change="getTime"
            formate="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="End Date" prop="endDate">
          <!-- <el-input type="text" v-model="form.endDate" auto-complete="off" placeholder="yyyy-mm-dd hh:mm:ss"></el-input> -->
          <el-date-picker
            v-model="form.endDate"
            type="datetime"
            @change="getEndTime"
            formate="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Background Image">
          <upload
            @change="handleCoverImageFileChange"
            accept="image/png, image/jpeg"
            :fileList="coverImageFileList"
          ></upload>
        </el-form-item>
        <el-form-item label="Instructions">
          <el-input
            type="text"
            v-model="form.instructions"
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
import TableList from '../components/tableList.vue'
// import upload from "../utility/learn_upload.js"
import Upload from '../components/upload.vue'
import dialogForm from '../mixins/dialogForm.js'
import { mergeObj } from '../utility/index'

import { get, add, del, edit } from '../api/activity.js'

export default {
  components: {
    TableList,
    Upload
  },
  mixins: [dialogForm],
  data() {
    return {
      coverImageFileList: [],
      activityId: '',
      pageNo: 1,
      time: '',
      // name: '',
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
            tableId: 'subTitle',
            tableName: 'subTitle'
          },
          {
            tableId: 'startDate',
            tableName: 'Start Date'
          },
          {
            tableId: 'endDate',
            tableName: 'End Date'
          },
          {
            tableId: 'createdDate',
            tableName: 'Created Date'
          }
        ],
        data: [],
        pageData: {
          pageSize: 20,
          totalCount: 0
        }
      },
      dialogTitle: 'New Coupon',
      formLabelWidth: '150px',
      form: {
        title: '',
        subTitle: '',
        startDate: '',
        endDate: '',
        backgroundUrl: '',
        instructions: ''
      },
      rules: {
        title: [
          {
            required: true,
            message: 'Please enter activity Name',
            trigger: 'blur'
          }
        ],
        startDate: [
          {
            required: true,
            message: 'Please enter Start Date'
          }
          // { pattern: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/, message: '请输入2018-06-06 00:00:00格式的日期' }
        ],
        endDate: [
          {
            required: true,
            message: 'Please enter End Date'
          }
          // { pattern: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/, message: '请输入2018-06-06 00:00:00格式的日期' }
        ]
      }
    }
  },
  methods: {
    // add
    add() {
      this.coverImageFileList = []
      this.dialogTitle = 'New Activity'
      this.showDialogForm()
      this.form.backgroundUrl = ''
      this.isEdit = false
      this.form.instructions = ''
    },

    getTime(date) {
      this.time = date
      this.form.startDate = date
      // console.log(this.time);
    },
    getEndTime(date) {
      this.time = date
      this.form.endDate = date
      // console.log(this.time);
    },
    // edit
    editAction(scope) {
      this.dialogTitle = 'Edit'
      this.isEdit = true
      this.showDialogForm()
      this.activityId = scope.row.id
      const self = this
      this.$nextTick(() => {
        self.form = mergeObj(self.form, scope.row)
        this.coverImageFileList = [
          {
            name: scope.row.backgroundUrl,
            url: scope.row.backgroundUrl
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
    getTableList(pageNo) {
      this.pageNo = pageNo
      get({
        pageSize: this.tableData.pageData.pageSize,
        pageNo
      }).then(res => {
        ;(this.tableData.data = res.activities),
          (this.tableData.pageData.totalCount = res.totalCount)
      })
    },
    handleCoverImageFileChange(file, fileList) {
      this.handleUpload(file, fileList, 'backgroundUrl', 'coverImageFileList')
    },
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // if (!this.form.backgroundUrl) {
          //   let message = ''
          //   if (this.coverImageFileList.length) {
          //     message = 'Uploading'
          //   } else {
          //     message = 'Please Upload Background Image'
          //   }
          //   this.$notify.error({
          //     message,
          //     duration: 1000
          //   })
          //   return
          // }
          if (this.isEdit) {
            const params = {}
            params.id = this.activityId
            params.data = this.form
            edit(params).then(() => {
              // console.log(res)
              this.handleCancel()
              this.getTableList(this.pageNo)
            })
          } else {
            const params = this.form
            add(params).then(() => {
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
    more(scope) {
      this.$router.push({
        name: 'coupons',
        query: {
          id: scope.row.activityId,
          title: scope.row.title
        }
      })
    },
    handleSearch() {
      this.getTableList(this.pageNo)
    }
  },
  mounted() {
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
