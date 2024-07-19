<template>
  <div>
    <!-- head -->
    <div class="el-menu g-page-bar">
      <span class="page-title">Coupons</span>
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
        <el-table-column label="" align="center" width="130px">
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
        <el-form-item label="Coupon Name" prop="name">
          <el-input
            type="text"
            v-model="form.name"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="Code" prop="code">
          <el-input
            type="text"
            v-model="form.code"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="Effective Date" prop="effectiveDate">
          <!-- <el-input type="text" v-model="form.effectiveDate" auto-complete="off" placeholder="yyyy-mm-dd hh:mm:ss"></el-input> -->
          <el-date-picker
            v-model="form.effectiveDate"
            type="datetime"
            @change="getTime"
            formate="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Expiry Date" prop="expiryDate">
          <!-- <el-input type="text" v-model="form.expiryDate" auto-complete="off" placeholder="yyyy-mm-dd hh:mm:ss"></el-input> -->
          <el-date-picker
            v-model="form.expiryDate"
            type="datetime"
            @change="getEndTime"
            formate="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item
          label="Background Image"
          prop="backgroundUrl">
          <el-upload
            :show-file-list="false"
            :before-upload="ImageUpload"
            class="avatar-uploader"
            action="#">
            <img
              v-if="form.backgroundUrl"
              :src="form.backgroundUrl"
              :alt="form.backgroundUrl"
              class="avatar">
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item> -->
        <el-form-item label="Background Image">
          <upload
            @change="handleCoverImageFileChange"
            accept="image/png, image/jpeg"
            :fileList="coverImageFileList"
          ></upload>
        </el-form-item>

        <el-form-item label="Instructions" prop="instructions">
          <el-input
            type="text"
            v-model="form.instructions"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="Quantity" prop="count">
          <el-input
            type="text"
            v-model="form.count"
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

import { get, create, del, edit } from '../api/coupons.js'

export default {
  components: {
    TableList,
    Upload
  },
  mixins: [dialogForm],
  data() {
    return {
      activityId: '',
      activityTitle: '',
      couponsId: '',
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
            tableId: 'name',
            tableName: 'Coupon Name'
          },
          {
            tableId: 'activityName',
            tableName: 'Activity Name'
          },
          {
            tableId: 'effectiveDate',
            tableName: 'effective Date'
          },
          {
            tableId: 'expiryDate',
            tableName: 'expiry Date'
          },
          {
            tableId: 'count',
            tableName: 'Quantity',
            tableWidth: '100px'
          },
          {
            tableId: 'code',
            tableName: 'Code'
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
        name: '',
        backgroundUrl: '',
        effectiveDate: '',
        expiryDate: '',
        instructions: '',
        count: '',
        code: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Please enter Coupon Name',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: 'Please enter Coupon Code',
            trigger: 'blur'
          }
        ],
        effectiveDate: [
          {
            required: true,
            message: 'Please enter effective Date'
          }
          // { pattern: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/, message: '请输入2018-06-06 00:00:00格式的日期' }
        ],
        expiryDate: [
          {
            required: true,
            message: 'Please enter expiry Date'
          }
          // { pattern: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/, message: '请输入2018-06-06 00:00:00 格式的日期' }
        ]
      }
    }
  },
  methods: {
    // add
    add() {
      ;(this.coverImageFileList = []), (this.dialogTitle = 'New Coupon')
      this.showDialogForm()
      this.form.backgroundUrl = ''
      this.form.instructions = ''
      this.isEdit = false
    },
    // edit
    editAction(scope) {
      this.dialogTitle = 'Edit'
      this.isEdit = true
      this.showDialogForm()
      this.couponsId = scope.row.id
      const self = this
      this.$nextTick(() => {
        self.form = mergeObj(self.form, scope.row)
        // console.log(self.form)
        self.form.count = scope.row.count
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
          // console.log(res)
          this.getTableList(this.pageNo)
        })
      })
    },
    getTime(date) {
      this.time = date
      this.form.effectiveDate = date
      // console.log(this.time);
    },
    getEndTime(date) {
      this.time = date
      this.form.expiryDate = date
      // console.log(this.time);
    },
    getTableList(pageNo) {
      this.pageNo = pageNo
      get({
        activityId: this.activityId,
        pageSize: this.tableData.pageData.pageSize,
        pageNo,
        name: this.name
      }).then(res => {
        // console.log(res)
        ;(this.tableData.data = res.coupons),
          (this.tableData.pageData.totalCount = res.totalCount)
      })
    },
    handleCoverImageFileChange(file, fileList) {
      this.handleUpload(file, fileList, 'backgroundUrl', 'coverImageFileList')
    },
    // ImageUpload(file) {
    //   let isSupport = file.type == "image/jpeg" || file.type == "image/png";
    //   if (!isSupport) {
    //     this.$message.error("仅支持JPG/PNG格式的图片");
    //     return false;
    //   }
    //   this.isUpload = true;
    //   upload(file)
    //     .then(url => {
    //       this.form.coverImageUrl = url;
    //       this.isUpload = false;
    //     })
    //     .catch(() => {
    //       this.$message.error("上传失败！");
    //       this.form.coverImageUrl = "";
    //       this.isUpload = false;
    //     });
    //   return false;
    // },
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // if (!this.form.backgroundUrl) {
          //   let message = ''
          //   if (this.coverImageFileList.length) {
          //     message = 'Uploading'
          //   } else {
          //     message = 'Please Upload Cover Image'
          //   }
          //   this.$notify.error({
          //     message,
          //     duration: 1000
          //   })
          //   return
          // }
          // if (this.form.count = '') {
          //   let message = 'please enter Quantity'
          //   this.$notify.error({
          //     message,
          //     duration: 1000
          //   })
          //   return
          // }
          if (this.isEdit) {
            const params = {}
            params.id = this.couponsId
            params.data = this.form
            console.log(params.data)
            edit(params).then(() => {
              // console.log(res)
              this.handleCancel()
              this.getTableList(this.pageNo)
            })
          } else {
            const params = this.form
            params.activityId = this.activityId
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
    check() {
      if (this.form.isNoviceGuidance == true) {
        this.isNoviceGuidance = true
      } else {
        this.isNoviceGuidance = false
      }
    },
    handleSearch() {
      this.getTableList(this.pageNo)
    }
  },
  mounted() {
    this.activityId = this.$route.query.id
    this.activityTitle = this.$route.query.title
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
