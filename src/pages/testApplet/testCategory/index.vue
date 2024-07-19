<template>
  <div>
    <!-- head -->
    <div class="el-menu g-page-bar">
      <!-- <span class="page-title">Test Category</span> -->
      <el-form :inline="true">
        <el-form-item label="Name">
          <el-input
            v-model="categoryName"
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
        <el-table-column label="Category Type" align="center">
          <template slot-scope="scope">
            {{ scope.row.categoryType === 1 ? '面对面' : '邀约' }}
          </template>
        </el-table-column>
        <el-table-column label="Created Date" align="center">
          <template slot-scope="scope">
            {{ scope.row.createdDate }}
          </template>
        </el-table-column>
        <el-table-column label="Updated Date" align="center">
          <template slot-scope="scope">
            {{ scope.row.updatedDate }}
          </template>
        </el-table-column>
        <el-table-column label="" align="center" width="250">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="editAction(scope)"
              >Edit</el-button
            >
            <el-button size="mini" @click="handleStatus(scope)">{{
              scope.row.onlineStatus ? 'Hide' : 'Show'
            }}</el-button>
            <el-button size="mini" type="danger" @click="deleteAction(scope)"
              >Delete</el-button
            >
            <!-- <el-button size="mini" type="info" @click="suggestionsView(scope)"
              >Suggest</el-button
            > -->
            <el-button size="mini" @click="testView(scope)">Test</el-button>
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
        <el-form-item label="Category Name" prop="name">
          <el-input
            type="text"
            v-model="form.name"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="Category Type" prop="categoryType">
          <!-- <input type="radio" id="radio" v-model="form.type" @change="check" :label="1"> 邀约  -->
          <!-- <input type="radio" id="radio" v-model="form.type" @change="checks" :label="2"> 面对面  -->
          <el-radio-group v-model="form.categoryType" @change="check">
            <el-radio class="radio" :label="1">面对面</el-radio>
            <el-radio class="radio" :label="2">邀约</el-radio>
          </el-radio-group>
          <!-- <el-radio class="radio" @change="check" v-model="form.type" :label="1">邀约</el-radio> -->
          <!-- <el-radio class="radio" @change="check" v-model="form.type" :label="2">面对面</el-radio> -->
        </el-form-item>
        <el-form-item label="Cover Image" prop="coverImageUrl">
          <upload
            @change="handleCoverImageFileChange"
            accept="image/png, image/jpeg"
            :fileList="coverImageFileList"
          ></upload>
        </el-form-item>
        <el-form-item label="Banner Image" v-if="this.isShowImage">
          <upload
            @change="handleBannerImageFileChange"
            accept="image/png, image/jpeg"
            :fileList="bannerImageFileList"
          ></upload>
        </el-form-item>
        <el-form-item
          label="Share Image"
          v-if="this.isShowImage"
          prop="shareImageUrl"
        >
          <upload
            @change="handleShareImageFileChange"
            accept="image/png, image/jpeg"
            :fileList="shareImageFileList"
          ></upload>
        </el-form-item>
        <el-form-item
          label="Customer Cover Image"
          v-if="this.isShowImage"
          prop="customerCoverImageUrl"
        >
          <upload
            @change="handleCustomerCoverImageFileChange"
            accept="image/png, image/jpeg"
            :fileList="customerCoverImageFileList"
          ></upload>
        </el-form-item>
        <el-form-item
          label="Coupon Image"
          v-if="this.isShowImage"
          prop="couponImageUrl"
        >
          <upload
            @change="handleCouponImageFileChange"
            accept="image/png, image/jpeg"
            :fileList="couponImageFileList"
          ></upload>
        </el-form-item>
        <el-form-item
          label="Receive Coupon Image"
          v-if="this.isShowImage"
          prop="receiveCouponImageUrl"
        >
          <upload
            @change="handleReceiveCouponImageFileChange"
            accept="image/png, image/jpeg"
            :fileList="receiveCouponImageFileList"
          ></upload>
        </el-form-item>
        <el-form-item
          label="Full Mark Image"
          v-if="this.isShowImage"
          prop="fullMarkImageUrl"
        >
          <upload
            @change="handleFullMarkImageFileChange"
            accept="image/png, image/jpeg"
            :fileList="fullMarkImageFileList"
          ></upload>
        </el-form-item>
        <el-form-item label="Label" prop="label" v-if="this.isShowLabel">
          <el-input
            type="text"
            v-model="form.label"
            auto-complete="off"
          ></el-input>
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

    <!-- suggest -->
    <el-dialog :visible.sync="testVisible" size="small">
      <div>
        <el-upload
          :show-file-list="false"
          :before-upload="TestUpload"
          style="width:80px;top:10px;left: 0px;position: absolute;"
          action="#"
        >
          <el-button
            size="small"
            type="text"
            style="height:40px;margin-left:15px;font-size:14px"
            >上传 <i class="el-icon-upload2"
          /></el-button>
        </el-upload>
      </div>
      <div style="text-align:center;">{{ testName }}</div>
      <div
        v-if="!testList || testList.length == 0"
        style="height:180px;text-align:center;padding-top:180px;color:brown;"
      >
        请上传改善建议！<br />重新上传会覆盖原数据
      </div>
      <div v-for="test in testList" :key="test.id" track-by="$index">
        <el-card class="box-card" style="margin-top:10px;">
          <div slot="header" class="clearfix">
            <span v-if="test.num">{{ test.num + '.' }}</span>
            <span v-if="test.gender">{{ '性别:' + test.gender }}</span>
            <span v-if="test.beginAge && test.beginAge != null">{{
              '年龄段(起): ' + test.beginAge
            }}</span>
            <span v-if="test.endAge && test.endAge != null">{{
              '年龄段(止): ' + test.endAge
            }}</span>
            <span v-if="test.isFat">{{ '是否肥胖: ' + test.isFat }}</span>
            <span v-if="test.isSmoking">{{
              '是否抽烟: ' + test.isSmoking
            }}</span>
            <span v-if="test.isDrink">{{ '是否喝酒: ' + test.isDrink }}</span>
          </div>
          <div class="text item">
            <!-- <i v-if="o.correct" class="el-icon-check" style="left:38px;position:absolute;color:red;margin-top:6px;font-size:12px;"/>{{o.optionName + ' '}} -->
            <div v-if="test.nutritionFormula && test.nutritionFormula != ''">
              <div>提供产品配方:</div>
              <div>{{ test.nutritionFormula }}</div>
              <br />
            </div>
            <div v-if="test.nutritionDetails && test.nutritionDetails != ''">
              <div>营养补充详细话术:</div>
              <div>{{ test.nutritionDetails }}</div>
              <br />
            </div>
            <div v-if="test.liveDetails && test.liveDetails != ''">
              <div>健康生活详细话术:</div>
              <div>{{ test.liveDetails }}</div>
              <br />
            </div>
            <div v-if="test.dietDetails && test.dietDetails != ''">
              <div>健康饮食详细话术</div>
              <div>{{ test.dietDetails }}</div>
              <br />
            </div>
            <div v-if="test.physicalDetails && test.physicalDetails != ''">
              <div>体检详细话术</div>
              <div>{{ test.physicalDetails }}</div>
            </div>
          </div>
        </el-card>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 公用表格列表组件 引入
import TableList from '@/components/tableList.vue'
import Upload from '@/components/upload.vue'
import dialogForm from '@/mixins/dialogForm'
import { mergeObj } from '@/utility/index'

// api引入
import { get, create, del, edit } from '@/api/testApplet/testCategory.js'
import {
  getFromRedis,
  addToRedis,
  docToJson
} from '@/api/testApplet/questions.js'
import Vue from 'vue'
export default {
  components: {
    TableList,
    Upload
  },
  mixins: [dialogForm],
  data() {
    return {
      coverImageFileList: [],
      bannerImageFileList: [],
      shareImageFileList: [],
      customerCoverImageFileList: [],
      couponImageFileList: [],
      receiveCouponImageFileList: [],
      fullMarkImageFileList: [],
      categoryName: '',
      categoryId: '',
      isShowImage: false,
      isShowLabel: true,
      pageNo: 1,
      testVisible: false,
      testList: [],
      templateId: '',
      testName: '',
      // name: '',
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
          // {
          //   tableId: 'type',
          //   tableName: 'Type'
          // },
          {
            tableId: 'sort',
            tableName: 'Sort',
            tableWidth: '50px'
          }
          // {
          //   tableId: 'createdDate',
          //   tableName: 'Created Date'

          // },
          // {
          //   tableId: 'updatedDate',
          //   tableName: 'Updated Date'
          // }
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
        onlineStatus: true,
        name: '',
        coverImageUrl: '',
        bannerImageUrl: '',
        shareImageUrl: '',
        customerCoverImageUrl: '',
        couponImageUrl: '',
        receiveCouponImageUrl: '',
        fullMarkImageUrl: '',
        sort: null,
        label: '',
        categoryType: 1
      },
      rules: {
        // sort: [
        //   {
        //     required: true,
        //     type: 'integer',
        //     message: 'Please enter integer Sorting',
        //     trigger: 'blur'
        //   }
        // ],
        name: [
          {
            required: true,
            message: 'Please enter Category Title',
            trigger: 'blur'
          }
        ],
        coverImageUrl: [
          {
            required: true,
            message: 'Please upload Cover Image',
            trigger: 'blur'
          }
        ],
        shareImageUrl: [
          {
            required: true,
            message: 'Please upload Share Image',
            trigger: 'blur'
          }
        ],
        categoryType: [
          {
            required: true,
            message: 'Please choose categoryType'
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
      this.form.coverImageUrl = ''
      this.form.bannerImageUrl = ''
      this.form.shareImageUrl = ''
      this.form.categoryType = 1
      this.isShowImage = false
      this.isShowLabel = true
      this.isEdit = false
      this.form.onlineStatus = true
      this.coverImageFileList = []
      this.bannerImageFileList = []
      this.shareImageFileList = []
      this.customerCoverImageFileList = []
      this.couponImageFileList = []
      this.receiveCouponImageFileList = []
      this.fullMarkImageFileList = []
    },
    // edit
    editAction(scope) {
      this.dialogTitle = 'Edit'
      this.isEdit = true
      this.showDialogForm()
      this.categoryId = scope.row.id
      if (scope.row.categoryType == 1) {
        ;(this.isShowImage = false), (this.isShowLabel = true)
      }
      if (scope.row.categoryType == 2) {
        ;(this.isShowImage = true), (this.isShowLabel = false)
      }
      const self = this
      this.$nextTick(() => {
        self.form = mergeObj(self.form, scope.row)
        this.coverImageFileList = [
          {
            name: scope.row.coverImageUrl,
            url: scope.row.coverImageUrl
          }
        ]
        this.bannerImageFileList = [
          {
            name: scope.row.bannerImageUrl,
            url: scope.row.bannerImageUrl
          }
        ]
        this.shareImageFileList = [
          {
            name: scope.row.shareImageUrl,
            url: scope.row.shareImageUrl
          }
        ]
        this.customerCoverImageFileList = [
          {
            name: scope.row.customerCoverImageUrl,
            url: scope.row.customerCoverImageUrl
          }
        ]
        this.couponImageFileList = [
          {
            name: scope.row.couponImageUrl,
            url: scope.row.couponImageUrl
          }
        ]
        this.receiveCouponImageFileList = [
          {
            name: scope.row.receiveCouponImageUrl,
            url: scope.row.receiveCouponImageUrl
          }
        ]
        this.fullMarkImageFileList = [
          {
            name: scope.row.fullMarkImageUrl,
            url: scope.row.fullMarkImageUrl
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
    handleCoverImageFileChange(file, fileList) {
      this.handleUpload(file, fileList, 'coverImageUrl', 'coverImageFileList')
    },
    handleBannerImageFileChange(file, fileList) {
      this.handleUpload(file, fileList, 'bannerImageUrl', 'bannerImageFileList')
    },
    handleShareImageFileChange(file, fileList) {
      this.handleUpload(file, fileList, 'shareImageUrl', 'shareImageFileList')
    },
    handleCustomerCoverImageFileChange(file, fileList) {
      this.handleUpload(
        file,
        fileList,
        'customerCoverImageUrl',
        'customerCoverImageFileList'
      )
    },
    handleCouponImageFileChange(file, fileList) {
      this.handleUpload(file, fileList, 'couponImageUrl', 'couponImageFileList')
    },
    handleReceiveCouponImageFileChange(file, fileList) {
      this.handleUpload(
        file,
        fileList,
        'receiveCouponImageUrl',
        'receiveCouponImageFileList'
      )
    },
    handleFullMarkImageFileChange(file, fileList) {
      this.handleUpload(
        file,
        fileList,
        'fullMarkImageUrl',
        'fullMarkImageFileList'
      )
    },
    check() {
      if (this.form.categoryType === 1) {
        this.isShowImage = false
        this.isShowLabel = true
      } else {
        this.isShowImage = true
        this.isShowLabel = false
      }
    },
    getTableList(pageNo) {
      this.pageNo = pageNo
      if (this.categoryName) {
        get({
          name: this.categoryName,
          pageSize: this.tableData.pageData.pageSize,
          pageNo
        }).then(res => {
          this.tableData.data = res.examCategories
          this.tableData.pageData.totalCount = res.totalCount
        })
      } else {
        get({
          pageSize: this.tableData.pageData.pageSize,
          pageNo
        }).then(res => {
          this.tableData.data = res.examCategories
          this.tableData.pageData.totalCount = res.totalCount
        })
      }
    },
    handleStatus(scope) {
      const onLine = scope.row.onlineStatus
      const datas = {}
      datas.bannerImageUrl = scope.row.bannerImageUrl
      datas.shareImageUrl = scope.row.shareImageUrl
      datas.coverImageUrl = scope.row.coverImageUrl
      datas.sort = scope.row.sort
      datas.name = scope.row.name
      datas.label = scope.row.label
      datas.categoryType = scope.row.categoryType
      const title = onLine
        ? "This item include this item's videos won't show in the app if you hide it."
        : "This item include this item's videos will show in the specific category in the app."
      this.$confirm(title, 'Tips', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        datas.onlineStatus = !onLine
        edit({
          id: scope.row.id,
          data: datas
        }).then(res => {
          if (res.result) {
            scope.row.onlineStatus = !onLine
          }
        })
      })
    },
    sortId(a, b) {
      return a.num - b.num
    },
    suggestionsView(scope) {
      this.testList = []
      this.testVisible = true
      this.templateId = scope.row.id
      this.testName = scope.row.name
      getFromRedis({ type: 'improves', templateId: this.templateId })
        .then(res => {
          let data = res.contents
          this.testList = data
        })
        .catch(() => {
          this.testList = []
        })
    },
    TestUpload(file) {
      let isSupport = file.name.endsWith('.xlsx')
      if (!isSupport) {
        this.$message.error('仅支持以xlsx结尾的office文件')
        return false
      }
      this.isUpload = true
      docToJson({
        data: file
      })
        .then(res => {
          res.sort(this.sortId)
          let data = JSON.stringify(res)
          let list = res
          list.forEach(item => {
            item.beginAge = !item.beginAge ? '-' : item.beginAge
            item.endAge = !item.endAge ? '-' : item.endAge
            item.isDrink = !item.isDrink ? '-' : item.isDrink
            item.isFat = !item.isFat ? '-' : item.isFat
            item.isSmoking = !item.isSmoking ? '-' : item.isSmoking
          })
          this.testList = list
          return addToRedis({
            type: 'improves',
            templateId: this.templateId,
            contents: data
          })
        })
        .then(result => {
          if (result.result) {
            new Vue().$notify({
              message: 'Upload Success',
              type: 'success',
              duration: 1000
            })
          } else {
            new Vue().$notify({
              message: 'Upload Failed',
              type: 'error',
              duration: 1000
            })
            //this.$message.error("上传失败！");
          }
        })
        .catch(() => {
          new Vue().$notify({
            message: 'Upload Failed',
            type: 'error',
            duration: 1000
          })
          //this.$message.error("上传失败！");
        })
      return false
    },
    testView(scope) {
      this.$router.push({
        name: 'testApplet-testCategory-test',
        query: {
          id: scope.row.id,
          name: scope.row.name,
          categoryType: scope.row.categoryType
        }
      })
    },
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.sort == '') {
            this.form.sort = null
          }
          if (this.isEdit) {
            const params = {}
            params.id = this.categoryId
            params.data = this.form
            edit(params).then(() => {
              this.handleCancel()
              this.getTableList(this.pageNo)
            })
          } else {
            const params = this.form
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
