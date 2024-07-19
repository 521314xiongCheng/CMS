<template>
  <div class="product-list">
    <el-form inline size="small">
      <el-form-item label="Banner Name">
        <el-input v-model="filters.bannerName" @change="getList"></el-input>
      </el-form-item>
      <el-form-item label="Banner Status">
        <el-select
          v-model="filters.status"
          placeholder="请选择"
          @change="getList"
        >
          <el-option label="Invalid" :value="false"></el-option>
          <el-option label="Valid" :value="true"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Banner Type" prop="type">
        <el-select
          v-model="filters.bannerType"
          placeholder="请选择"
          @change="getList"
        >
          <el-option label="图片" value="image"></el-option>
          <el-option label="视频" value="video"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getList">
          搜索
        </el-button>
        <el-button type="primary" size="mini" @click="add">
          添加
        </el-button>
        <el-button type="primary" size="mini" @click="sort">
          更新排序
        </el-button>
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <table-list
        :tableData="tableData"
        :isUseMixin="false"
        @handleCurrentChange="handleCurrentChange"
      >
        <el-table-column
          label="排序"
          slot="between"
          prop="sort"
          :width="100"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-input-number
              size="small"
              v-model="row.sort"
              style="width:78px;"
              :max="999"
              :min="0"
              controls-position="right"
              :controls="false"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          label="Operate"
          align="center"
          fixed="right"
          width="260"
        >
          <template slot-scope="{ row, $index }">
            <el-button
              size="small"
              :type="row.isInvalid ? 'danger' : 'success'"
              @click="publish(row)"
              >{{ row.isInvalid ? 'Valid' : 'Invalid' }}</el-button
            >
            <el-button size="small" type="primary" @click="editAction(row)"
              >Edit</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="delAction(row, $index)"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </table-list>
    </div>

    <el-dialog
      :title="dialogTitle"
      width="540px"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-width="110px"
        label-position="left"
        size="small"
      >
        <el-form-item label="Banner Name" prop="bannerName">
          <el-input v-model="form.bannerName"></el-input>
        </el-form-item>
        <el-form-item label="标签类型" prop="bannerType">
          <el-select
            v-model="form.bannerType"
            size="small"
            placeholder="请选择"
          >
            <el-option label="图片" :value="1"></el-option>
            <el-option label="视频" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Banner Title" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="Banner Time" prop="bannerTime">
          <el-date-picker
            v-model="bannerTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="Start Time"
            end-placeholder="End Time"
            :picker-options="options"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Desc" prop="describe">
          <el-input
            v-model="form.describe"
            type="textarea"
            :rows="2"
          ></el-input>
        </el-form-item>
        <el-form-item label="CoverImg" prop="bannerUrl">
          <div>
            <el-button size="mini" type="primary" @click="uploadDialog = true"
              >上传</el-button
            >
            <el-input
              v-model="form.bannerUrl"
              class="input-img-url"
              size="small"
            ></el-input>
          </div>
          <div class="file-item" v-if="form.bannerUrl">
            <div class="img-wrap">
              <el-image
                class="item-img"
                :src="form.bannerUrl"
                fit="cover"
              ></el-image>
              <label class="whispace img-label">{{ form.bannerUrl }}</label>
            </div>
            <label class="item-status-label">
              <i class="el-icon-upload-success el-icon-check"></i>
              <i class="el-icon-close del-item" @click="delItem"></i>
            </label>
          </div>
          <p>* 请不要超过1035*360px，大小不超过200kb</p>
        </el-form-item>
        <el-form-item
          v-show="form.targetType"
          :label="form.targetType === 1 ? 'ID' : 'URL'"
          prop="targetUrl"
        >
          <el-input v-model="form.targetUrl"></el-input>
        </el-form-item>
        <div class="text-center">
          <el-button size="small" @click="cancel">Cancel</el-button>
          <el-button size="small" type="primary" @click="submit('form')"
            >Confirm</el-button
          >
        </div>
      </el-form>
    </el-dialog>
    <upload-and-select-in-resource
      :uploadDialog="uploadDialog"
      :fileSize="{ size: 200 }"
      @uploadFile="uploadFile"
      @selectResource="selectResource"
      @closeUploadDialog="uploadDialog = false"
    ></upload-and-select-in-resource>
  </div>
</template>

<script>
import TableList from '@/components/tableList.vue'
import {
  getBanners,
  addBanner,
  updateBanner,
  delBanner,
  sortBanners
} from '@/api/library/bannerManage.js'
import restfulMixin from '@/mixins/restful.js'
import { clones, formatDate, treeData2Arr } from '@/utility/index.js'
import storage from 'good-storage'
import { uploadToResource } from '@/api/index.js'
import uploadAndSelectInResource from '@/components/selectInResources/uploadAndSelectInResource.vue'
export default {
  components: {
    TableList,
    uploadAndSelectInResource
  },
  mixins: [restfulMixin],
  data() {
    let validatorPublishTime = (rule, value, callback) => {
      if (!this.bannerTime.length) {
        callback(new Error('请选择Banner Time'))
      }
      callback()
    }
    return {
      options: {
        disabledDate: date => {
          return date < new Date().getTime() - 1 * 24 * 60 * 60 * 1000
        }
      },
      uploadDialog: false,
      dialogTitle: '添加',
      form: {
        bannerName: '',
        bannerType: null,
        title: '',
        describe: '',
        targetType: '2',
        bannerUrl: '',
        targetUrl: ''
      },
      bannerUrlList: [],
      dialogFormVisible: false,
      rules: {
        bannerName: [{ required: true, message: '必填项', trigger: 'blur' }],
        bannerType: [{ required: true, message: '必填项', trigger: 'blur' }],
        bannerTime: [{ validator: validatorPublishTime, trigger: 'blur' }],
        bannerUrl: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      bannerTime: [],
      tableData: {
        header: [
          {
            tableId: 'id',
            tableWidth: '60',
            tableName: 'ID'
          },
          {
            tableId: 'bannerName',
            tableName: 'Banner Name'
          },
          {
            tableId: 'bannerUrl',
            tableName: 'Banner Img'
          },
          {
            tableId: 'publishStartDate',
            tableName: 'Banner Time',
            tableWidth: 160,
            formatter: row => {
              return `${formatDate(new Date(row.publishStartDate))}${formatDate(
                new Date(row.publishEndDate)
              )}`
            }
          },
          {
            tableId: 'isInvalid',
            tableName: 'Status',
            tableWidth: '70',
            formatter: row => {
              return row.isInvalid ? 'Invalid' : 'Valid'
            }
          },
          {
            tableId: 'createdBy',
            tableName: '操作人',
            tableWidth: '200',
            formatter: row => {
              return row.updatedBy ? row.updatedBy : row.createdBy
            }
          },
          {
            tableId: 'createdDate',
            tableName: '操作时间',
            tableWidth: '160',
            formatter: row => {
              return row.updatedDate
                ? formatDate(new Date(row.updatedDate))
                : formatDate(new Date(row.createdDate))
            }
          }
        ],
        data: [],
        pageData: {
          pageSize: 20,
          totalCount: 0
        }
      },
      filters: {
        pageSize: 20,
        pageNo: 1
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    uploadFile(data) {
      this.uploadDialog = false
      this.form.bannerUrl = data.url
      this.uploadImageToResource(data.name, data.url, data.fileInfo)
    },
    selectResource(data) {
      this.uploadDialog = false
      this.form.bannerUrl = data.url
    },
    delItem() {
      this.form.bannerUrl = ''
    },
    uploadImageToResource(name, url, property) {
      let moduleId
      let menus = storage.get('menus')
      moduleId = treeData2Arr(menus, 'subMenus').filter(
        o => o.path === '/library/bannerManage'
      )[0].id
      let data = {
        name: name,
        moduleId: moduleId,
        url: url,
        property: property,
        resourceType: 'Image',
        client: 'BackEnd'
      }
      uploadToResource(data)
    },
    getList() {
      getBanners(this.filters).then(res => {
        this.tableData.data = res.banners
        this.tableData.pageData.totalCount = res.totalCount
      })
    },
    handleCurrentChange(n) {
      this.filters.pageNo = n
      this.getList()
    },
    add() {
      this.dialogFormVisible = true
      this.form.id = null
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        this.bannerTime = []
        this.bannerUrlList = []
      })
    },
    publish(row) {
      let type = row.isInvalid ? 'Valid?' : 'Invalid'
      this.$confirm(`Do you want to set this data ${type}?`, 'Tips', {
        confirmButtonText: type,
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        let params = {
          status: row.isInvalid ? false : true
        }
        updateBanner(row.id, params).then(() => {
          this.getList()
        })
      })
    },
    editAction(row) {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        console.log(row)
        this.form = clones(row)
        if (this.form.bannerUrl) {
          this.bannerTime = [
            this.form.publishStartDate,
            this.form.publishEndDate
          ]
          this.bannerUrlList = [
            {
              name: this.form.bannerUrl,
              url: this.form.bannerUrl
            }
          ]
        }
      })
    },
    cancel() {
      this.dialogFormVisible = false
    },
    submit(form) {
      this.$refs[form].validate(vaild => {
        if (vaild) {
          let param = {
            bannerName: this.form.bannerName,
            bannerType: this.form.bannerType,
            title: this.form.title,
            describe: this.form.describe,
            bannerUrl: this.form.bannerUrl,
            targetUrl: this.form.targetUrl,
            targetType: this.form.targetType,
            publishStartDate: this.bannerTime ? this.bannerTime[0] : null,
            publishEndDate: this.bannerTime ? this.bannerTime[1] : null
          }
          if (this.form.id) {
            updateBanner(this.form.id, param).then(res => {
              console.log(res)
              this.dialogFormVisible = false
              this.getList()
            })
          } else {
            addBanner(param).then(res => {
              console.log(res)
              this.dialogFormVisible = false
              this.getList()
            })
          }
        } else {
          return false
        }
      })
    },
    delAction(row) {
      this.$confirm(`Would you like to delete the product?`, 'Tips', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        delBanner(row.id).then(res => {
          console.log(res)
          this.getList()
        })
      })
    },
    sort() {
      let data = this.tableData.data.map(o => ({
        id: Number(o.id),
        sort: Number(o.sort)
      }))
      sortBanners({ bannerSorts: data }).then(res => {
        console.log(res)
        this.getList()
      })
    }
  }
}
</script>
<style lang="less">
.input-img-url {
  margin-left: 10px;
  width: 305px !important;
}
.file-item {
  border-radius: 8px;
  border: 1px solid #ccc;
  padding: 10px;
  position: relative;
  overflow: hidden;
  margin-top: 10px;
  &:hover {
    .del-item {
      display: block;
    }
    .item-status-label {
      background-color: rgba(0, 0, 0, 0.5);
    }
    .el-icon-upload-success {
      display: none;
    }
  }
  .del-item {
    display: none;
    transform: rotate(-45deg);
    color: #fff;
  }
  .img-wrap {
    display: flex;
    align-items: center;
    flex-flow: row;
    .item-img {
      vertical-align: middle;
      border-radius: 8px;
      border: 1px solid #ccc;
      width: 80px;
      height: 80px;
      margin-right: 20px;
      flex-grow: 0;
    }
    .img-label {
      flex: 1;
    }
  }
  .item-status-label {
    position: absolute;
    right: -15px;
    top: -6px;
    width: 40px;
    height: 24px;
    background: #13ce66;
    text-align: center;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
  }
  .el-icon-upload-success {
    font-size: 12px;
    margin-top: 11px;
    transform: rotate(-45deg);
    color: #fff;
  }
  .del-item {
    font-size: 12px;
    margin-top: 11px;
    cursor: pointer;
  }
}
</style>
