<template>
  <div class="product-list">
    <div class="text-right">
      <el-button type="primary" size="small" @click="add">
        新增
      </el-button>
    </div>
    <div class="table-wrap">
      <table-list
        :tableData="tableData"
        :isUseMixin="false"
        @handleCurrentChange="handleCurrentChange"
        :setClassName="setClassName"
        @cellClick="cellClick"
      >
        <el-table-column
          label="目录名称"
          slot="between"
          prop="title"
          :width="100"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.title }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="160">
          <template slot-scope="{ row, $index }">
            <!-- <el-button
              size="small"
              :type="row.isInvalid ? 'danger' : 'success'"
              @click="publish(row)"
              >{{ row.isInvalid ? 'Valid' : 'Invalid' }}</el-button
            > -->
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
      :close-on-click-modal="false"
      :title="dialogTitle"
      width="540px"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-width="90px"
        label-position="left"
        size="small"
      >
        <el-form-item label="目录名称" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="生效时间" prop="bannerTime">
          <el-date-picker
            :disabled="form.id ? true : false"
            v-model="bannerTime"
            @change="dateChange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="Start Time"
            end-placeholder="End Time"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="ICON" prop="imgUrl">
          <el-input
            v-model="form.imgUrl"
            class="input-img-url"
            size="small"
          ></el-input>
          <upload
            @change="
              (file, fileList) => {
                fileChange(file, fileList, fileSize)
              }
            "
            accept="image/png, image/jpeg"
            :fileList="imgUrlList"
          ></upload>
          <p>
            * 尺寸：{{ fileSize.width }}px*{{ fileSize.height }}px,大小控制在{{
              fileSize.size
            }}kb以内
          </p>
        </el-form-item>
        <el-form-item prop="targetUri" label="跳转URL">
          <el-input v-model="form.targetUri"></el-input>
        </el-form-item>
        <div class="text-center">
          <el-button size="small" @click="cancel">Cancel</el-button>
          <el-button size="small" type="primary" @click="submit('form')"
            >Confirm</el-button
          >
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import upload from '@/mixins/upload.js'
import TableList from '@/components/tableList.vue'
import {
  getGoods,
  addGood,
  updateGood,
  delGood
} from '@/api/xxxxxxxDashboard/goods.js'
import restfulMixin from '@/mixins/restful.js'
import {
  clones,
  formatDate,
  checkImageSize,
  getImageSizeAsync,
  treeData2Arr
} from '@/utility/index.js'
import storage from 'good-storage'
import { uploadToResource } from '@/api/index.js'
import Upload from '@/components/upload'
export default {
  components: {
    TableList,
    Upload
  },
  mixins: [restfulMixin, upload],
  data() {
    let validatorPublishTime = (rule, value, callback) => {
      if (!this.bannerTime.length) {
        callback(new Error('请选择生效时间'))
      }
      callback()
    }
    return {
      dialogTitle: '添加',
      form: {
        title: '',
        imgUrl: '',
        targetUri: ''
      },
      imgUrlList: [],
      dialogFormVisible: false,
      rules: {
        title: [{ required: true, message: '必填项', trigger: 'blur' }],
        bannerTime: [
          { required: true, validator: validatorPublishTime, trigger: 'blur' }
        ],
        imgUrl: [{ required: true, message: '必填项', trigger: 'blur' }],
        targetUri: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      bannerTime: [],
      tableData: {
        header: [
          {
            tableId: 'imgUrl',
            tableName: 'ICON'
          },
          {
            tableId: 'start_date',
            tableName: '开始时间',
            tableWidth: 160,
            formatter: row => {
              return formatDate(new Date(row.startDate.replace(/-/g, '/')))
            }
          },
          {
            tableId: 'end_date',
            tableName: '结束时间',
            tableWidth: 160,
            formatter: row => {
              return formatDate(new Date(row.endDate.replace(/-/g, '/')))
            }
          },
          {
            tableId: 'targetUri',
            tableName: '跳转链接',
            showOverflowTooltip: true
          }
          // {
          //   tableId: 'isInvalid',
          //   tableName: 'Status',
          //   tableWidth: '70',
          //   formatter: row => {
          //     return row.isInvalid ? 'Invalid' : 'Valid'
          //   }
          // },
          // {
          //   tableId: 'createdBy',
          //   tableName: '操作人',
          //   tableWidth: '200',
          //   formatter: row => {
          //     return row.updatedBy ? row.updatedBy : row.createdBy
          //   }
          // },
          // {
          //   tableId: 'createdDate',
          //   tableName: '操作时间',
          //   tableWidth: '160',
          //   formatter: row => {
          //     return row.updatedDate
          //       ? formatDate(new Date(row.updatedDate))
          //       : formatDate(new Date(row.createdDate))
          //   }
          // }
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
      },
      fileSize: {
        width: 150,
        height: 150,
        size: 30
      }
    }
  },
  created() {
    const { type } = this.$route.query
    console.log(type)
    switch (Number(type)) {
      case 1:
        this.fileSize = {
          width: 150,
          height: 150,
          size: 30
        }
        break
      case 2:
        this.fileSize = {
          width: 333,
          height: 180,
          size: 100
        }
        break
      case 3:
        this.fileSize = {
          width: 1037,
          height: 218,
          size: 200
        }
        break
    }
    this.getList()
  },
  methods: {
    dateChange(v) {
      if (!v) {
        this.bannerTime = []
      }
    },
    cellClick(row, column) {
      if (column.property === 'targetUri') {
        this.$copyText(row.targetUri)
        this.$message({
          type: 'success',
          message: '复制成功'
        })
      }
    },
    async fileChange(file, fileList, fileSize) {
      let imgInfo = await getImageSizeAsync(file)
      if (
        !file ||
        !checkImageSize(file, 30) ||
        imgInfo.width !== fileSize.width ||
        imgInfo.height !== fileSize.height
      ) {
        this.$notify.error({
          title: 'Error',
          message: `尺寸：${fileSize.width}px*${fileSize.height}px,大小控制在${fileSize.size}kb以内`,
          duration: 3000
        })
      } else {
        this.customUploadObjectKey(
          {
            file: file,
            fileList: fileList,
            fileUrl: 'imgUrl',
            fileArray: 'imgUrlList',
            objectKey: 'xxxxxxxDashboard'
          },
          url => {
            if (url) {
              this.uploadImageToResource(
                file.name.substring(0, file.name.lastIndexOf('.')),
                url
              )
            }
          }
        )
      }
    },
    uploadImageToResource(name, url) {
      let moduleId
      let menus = storage.get('menus')
      moduleId = treeData2Arr(menus, 'subMenus').filter(
        o => o.path === '/xxxxxxx/Dashboard/goods'
      )[0].id
      let data = {
        name: name,
        moduleId: moduleId,
        url: url,
        resourceType: 'Image',
        client: 'BackEnd'
      }
      uploadToResource(data)
    },
    setClassName({ row, columnIndex }) {
      if (columnIndex === 0) {
        return `cell-class_${row.status}`
      }
    },
    getList() {
      let params = this.filters
      params.type = this.$route.query.type
      getGoods(this.$route.query.id, params).then(res => {
        this.tableData.data = res.categories
        this.tableData.pageData.totalCount = Number(res.totalCount)
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
        this.imgUrlList = []
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
        updateGood(row.id, params).then(() => {
          this.getList()
        })
      })
    },
    editAction(row) {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        console.log(row)
        this.form = clones(row)
        if (this.form.imgUrl) {
          this.bannerTime = [this.form.startDate, this.form.endDate]
          this.imgUrlList = [
            {
              name: this.form.imgUrl,
              url: this.form.imgUrl
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
            title: this.form.title,
            imgUrl: this.form.imgUrl,
            targetUri: this.form.targetUri,
            startDate: this.bannerTime ? this.bannerTime[0] : null,
            endDate: this.bannerTime ? this.bannerTime[1] : null,
            seqId: Number(this.$route.query.id),
            type: Number(this.$route.query.type)
          }
          if (this.form.id) {
            updateGood(this.form.id, param)
              .then(res => {
                console.log(res)
                this.dialogFormVisible = false
                this.getList()
              })
              .catch(err => {
                const { message } = err.data
                this.$message.error(message)
              })
          } else {
            addGood(param)
              .then(res => {
                console.log(res)
                this.dialogFormVisible = false
                this.getList()
              })
              .catch(err => {
                const { message } = err.data
                this.$message.error(message)
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
        delGood(row.id).then(res => {
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
  position: absolute;
  left: 90px;
  width: 305px !important;
}
.cell-class_1 {
  background-color: #e6a23c !important;
}
.cell-class_0 {
  background-color: #67c23a !important;
}
.cell-class_-1 {
  background-color: #909399 !important;
}
</style>
