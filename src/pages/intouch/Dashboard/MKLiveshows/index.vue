<template>
  <div class="product-list">
    <div class="text-right">
      <el-button type="primary" size="small" @click="add">
        添加
      </el-button>
      <el-button type="primary" size="small" @click="sort">
        更新排序
      </el-button>
    </div>
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
              :max="99999"
              :min="0"
              controls-position="right"
              :controls="false"
            ></el-input-number>
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
        label-width="110px"
        label-position="left"
        size="small"
      >
        <el-form-item label="直播名称" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="生效时间" prop="publishTime">
          <el-date-picker
            v-model="publishTime"
            @change="dateChange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="Start Time"
            end-placeholder="End Time"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="封面图" prop="imgUrl">
          <el-input
            v-model="form.imgUrl"
            class="input-img-url"
            size="small"
          ></el-input>
          <upload
            @change="
              (file, fileList) => {
                fileChange(file, fileList, {
                  width: 990,
                  height: 480,
                  size: 150
                })
              }
            "
            accept="image/png, image/jpeg"
            :fileList="imgUrlList"
          ></upload>
          <p>* 尺寸：990px*480px,大小控制在150kb以内</p>
        </el-form-item>
        <el-form-item label="直播ID" prop="liveId">
          <el-input v-model="form.liveId"></el-input>
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
  getLiveShows,
  addLiveShow,
  updateLiveShow,
  delLiveShow,
  sortLiveShow
} from '@/api/xxxxxxxDashboard/liveShows'
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
      if (!this.publishTime.length) {
        callback(new Error('请选择生效时间'))
      }
      callback()
    }
    return {
      dialogTitle: '添加',
      form: {
        title: '',
        imgUrl: '',
        liveId: null
      },
      imgUrlList: [],
      dialogFormVisible: false,
      rules: {
        title: [{ required: true, message: '必填项', trigger: 'blur' }],
        publishTime: [
          { required: true, validator: validatorPublishTime, trigger: 'blur' }
        ],
        imgUrl: [{ required: true, message: '必填项', trigger: 'blur' }],
        liveId: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      publishTime: [],
      tableData: {
        header: [
          {
            tableId: 'id',
            tableWidth: '60',
            tableName: 'ID'
          },
          {
            tableId: 'title',
            tableName: '直播名称'
          },
          {
            tableId: 'imgUrl',
            tableName: '封面图'
          },
          {
            tableId: 'liveId',
            tableName: '直播ID'
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
          }
          // {
          //   tableId: 'isInvalid',
          //   tableName: 'Status',
          //   tableWidth: '70',
          //   formatter: row => {
          //     return row.liveStatus ? 'Invalid' : 'Valid'
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
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    dateChange(v) {
      if (!v) {
        this.publishTime = []
      }
    },
    async fileChange(file, fileList, fileSize) {
      let imgInfo = await getImageSizeAsync(file)
      if (
        !file ||
        !checkImageSize(file, fileSize.size) ||
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
        o => o.path === this.$route.path
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
    getList() {
      getLiveShows(this.filters).then(res => {
        this.tableData.data = res.liveshows
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
        this.publishTime = []
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
        updateLiveShow(row.id, params).then(() => {
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
          this.publishTime = [new Date(row.startDate), new Date(row.endDate)]
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
            startDate: this.publishTime ? this.publishTime[0] : null,
            endDate: this.publishTime ? this.publishTime[1] : null,
            liveId: this.form.liveId
          }
          if (this.form.id) {
            updateLiveShow(this.form.id, param).then(res => {
              console.log(res)
              this.dialogFormVisible = false
              this.getList()
            })
          } else {
            addLiveShow(param).then(res => {
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
        delLiveShow(row.id).then(res => {
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
      sortLiveShow({ sorts: data }).then(res => {
        console.log(res)
        this.getList()
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
</style>
