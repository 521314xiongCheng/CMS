<template>
  <div class="product-list">
    <table-list :tableData="tableData" :isUseMixin="false">
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
      <el-table-column align="center" width="180">
        <template slot="header">
          <el-button type="primary" size="mini" @click="add">添加</el-button>
          <el-button type="primary" size="mini" @click="changeSort"
            >更新排序</el-button
          >
        </template>
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="editAction(row)"
            >修改</el-button
          >
          <el-button size="mini" type="danger" @click="delAction(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </table-list>
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
        <el-form-item label="主题" prop="category">
          <el-select
            v-model="category"
            filterable
            remote
            class="block-input"
            size="small"
            placeholder="请输入主题名称"
            :remote-method="querySearchCategory"
            value-key="id"
            @change="changeCategory"
          >
            <el-option
              v-for="item in categories"
              :key="item.id"
              :value="item"
              :label="item.categoryName"
            >
              <span style="float: left">{{ item.categoryName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主题icon" prop="iconUrl">
          <div>
            <el-button size="mini" type="primary" @click="uploadDialog = true"
              >上传</el-button
            >
            <el-input
              v-model="form.iconUrl"
              class="input-img-url"
              size="small"
            ></el-input>
          </div>
          <div class="file-item" v-if="form.iconUrl">
            <div class="img-wrap">
              <el-image
                class="item-img"
                :src="form.iconUrl"
                fit="cover"
              ></el-image>
              <label class="whispace img-label">{{ form.iconUrl }}</label>
            </div>
            <label class="item-status-label">
              <i class="el-icon-upload-success el-icon-check"></i>
              <i class="el-icon-close del-item" @click="delItem"></i>
            </label>
          </div>
          <p>
            尺寸为120*120，大小不超过100kb
          </p>
        </el-form-item>
        <el-form-item label="可查阅等级限制" prop="careerLevel">
          <el-radio v-model="form.isLimitCareerLevel" :label="false"
            >全部</el-radio
          >
          <el-radio v-model="form.isLimitCareerLevel" :label="true"
            >职级限制</el-radio
          >
          <div v-if="form.isLimitCareerLevel">
            <el-select v-model="form.careerLevel">
              <el-option
                v-for="level in levels"
                :value="level"
                :key="level"
              ></el-option>
            </el-select>
            <span>以上可查看(包含)</span>
          </div>
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
      :fileSize="{ size: 100 }"
      @uploadFile="uploadFile"
      @selectResource="selectResource"
      @closeUploadDialog="uploadDialog = false"
    ></upload-and-select-in-resource>
  </div>
</template>

<script>
import TableList from '@/components/tableList.vue'
import { uploadToResource } from '@/api/index.js'
import storage from 'good-storage'
import {
  getHomeSetting,
  addHomeSetting,
  updateHomeSetting,
  getCategorySelect,
  delHomeSetting,
  sortHomeSetting
} from '@/api/library/homeSetting.js'
import { formatDate, treeData2Arr } from '@/utility/index.js'
import { clones } from '../../../utility'
import uploadAndSelectInResource from '@/components/selectInResources/uploadAndSelectInResource.vue'
// import Http from '@/api/http'
export default {
  components: {
    TableList,
    uploadAndSelectInResource
  },
  data() {
    const validatorCareerLevel = (rule, value, callback) => {
      console.log(this.form.isLimitCareerLevel, this.form.careerLevel)
      if (this.form.isLimitCareerLevel && !this.form.careerLevel) {
        callback(new Error('请选择限制职级'))
      }
      callback()
    }
    let validatorCategory = (rule, value, callback) => {
      console.log(this.form.categoryName)
      if (!this.form.categoryName) {
        callback(new Error('请选择主题'))
      }
      callback()
    }
    return {
      uploadDialog: false,
      dialogTitle: '添加',
      form: {
        iconUrl: '',
        categoryId: null,
        categoryName: '',
        categoryType: null,
        isLimitCareerLevel: false,
        careerLevel: null
      },
      levels: [
        10,
        15,
        20,
        30,
        35,
        40,
        50,
        60,
        70,
        75,
        80,
        85,
        87,
        90,
        92,
        93,
        95,
        97
      ],
      category: {},
      iconUrlList: [],
      dialogFormVisible: false,
      rules: {
        category: [{ validator: validatorCategory, trigger: 'blur' }],
        iconUrl: [
          { required: true, message: '请上传icon图标', trigger: 'blur' }
        ],
        careerLevel: [{ validator: validatorCareerLevel, trigger: 'blur' }]
      },
      categories: [],
      tableData: {
        header: [
          {
            tableId: 'id',
            tableWidth: '60',
            tableName: 'ID'
          },
          {
            tableId: 'categoryName',
            tableName: '主题'
          },
          {
            tableId: 'updater',
            tableName: '操作人',
            tableWidth: '200',
            formatter: row => {
              return row.updatedBy ? row.updatedBy : row.createdBy
            }
          },
          {
            tableId: 'updaterTime',
            tableName: '操作时间',
            tableWidth: '160',
            formatter: row => {
              return row.updatedDate
                ? formatDate(new Date(row.updatedDate))
                : formatDate(new Date(row.createdDate))
            }
          }
        ],
        data: []
      }
    }
  },
  created() {
    getCategorySelect().then(res => {
      this.categoryList = res.categories
      this.categories = res.categories
    })
    this.getList()
  },
  mounted() {},
  methods: {
    querySearchCategory(queryString) {
      console.log(queryString)
      this.categories = this.categoryList.filter(o =>
        o.categoryName.includes(queryString)
      )
    },
    changeCategory(o) {
      console.log(o)
      this.form.categoryName = o.categoryName
      this.form.categoryId = o.id
      this.form.categoryType = o.categoryType
      this.form.iconUrl = o.iconUrl
      if (this.form.iconUrl) {
        this.iconUrlList = [
          {
            name: o.iconUrl,
            url: o.iconUrl
          }
        ]
      }
    },
    getList() {
      getHomeSetting().then(res => {
        console.log(res)
        this.tableData.data = res.categories
      })
    },
    uploadFile(data) {
      this.uploadDialog = false
      this.form.iconUrl = data.url
      this.uploadImageToResource(data.name, data.url, data.fileInfo)
    },
    selectResource(data) {
      this.uploadDialog = false
      this.form.iconUrl = data.url
    },
    delItem() {
      this.form.iconUrl = ''
    },
    uploadImageToResource(name, url, property) {
      let moduleId
      let menus = storage.get('menus')
      moduleId = treeData2Arr(menus, 'subMenus').filter(
        o => o.path === '/library/homeSetting'
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
    changeSort() {
      let data = this.tableData.data.map(o => ({
        id: Number(o.id),
        sort: Number(o.sort)
      }))
      sortHomeSetting({ dashboardSorts: data }).then(res => {
        console.log(res)
        this.getList()
      })
    },
    add() {
      this.form.id = null
      this.form.categoryId = null
      this.form.categoryName = ''
      this.form.categoryType = null
      this.form.isLimitCareerLevel = false
      this.form.careerLevel = null
      this.form.iconUrl = ''
      this.iconUrlList = []
      this.dialogFormVisible = true
    },
    cancel() {
      this.dialogFormVisible = false
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let data = {
            categoryId: this.form.categoryId,
            categoryName: this.form.categoryName,
            iconUrl: this.form.iconUrl,
            categoryType: this.form.categoryType,
            isLimitCareerLevel: this.form.isLimitCareerLevel
          }
          if (this.form.isLimitCareerLevel) {
            data.careerLevel = this.form.careerLevel
          }
          if (this.form.id) {
            updateHomeSetting(this.form.id, data).then(res => {
              console.log(res)
              this.dialogFormVisible = false
              this.getList()
            })
          } else {
            addHomeSetting(data).then(res => {
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
    editAction(row) {
      if (row.careerLevel === -1) {
        row.careerLevel = null
      }
      this.form = clones(row)
      this.category = {
        id: row.categoryId,
        categoryType: row.categoryType,
        categoryName: row.categoryName
      }
      this.iconUrlList = [
        {
          name: row.iconUrl,
          url: row.iconUrl
        }
      ]
      this.dialogFormVisible = true
    },
    delAction(row) {
      this.$confirm(`Would you like to delete the action?`, 'Tips', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        delHomeSetting(row.id).then(res => {
          console.log(res)
          this.getList()
        })
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
