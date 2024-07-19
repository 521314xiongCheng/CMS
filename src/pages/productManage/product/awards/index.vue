<template>
  <div class="product-list">
    <div class="el-menu g-page-bar">
      <el-button-group class="add-btn">
        <el-button type="primary" size="mini" @click="add">
          添加
        </el-button>
      </el-button-group>
    </div>
    <div class="table-wrap">
      <table-list
        :tableData="tableData"
        :isUseMixin="false"
        @handleCurrentChange="handleCurrentChange"
      >
        <el-table-column label="操作" align="center" width="140">
          <template slot-scope="{ row, $index }">
            <el-button size="mini" type="primary" @click="editAction(row)"
              >Edit</el-button
            >
            <el-button size="mini" type="danger" @click="delAction(row, $index)"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </table-list>
    </div>

    <el-dialog
      :title="dialogTitle"
      width="500px"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="addForm"
        ref="form"
        :rules="rules"
        label-width="80px"
        label-position="left"
        size="mini"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="url">
          <upload
            @change="fileChange"
            accept="image/png, image/jpeg"
            :fileList="fileList"
          ></upload>
        </el-form-item>
        <div class="text-center">
          <el-button size="mini" @click="cancel">Cancel</el-button>
          <el-button size="mini" type="primary" @click="submit('form')"
            >Confirm</el-button
          >
        </div>
      </el-form>
    </el-dialog>
    <transition name="fade-transform" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import TableList from '@/components/tableList.vue'
import Upload from '@/components/upload'
import upload from '@/mixins/upload.js'
import { uploadToResource } from '@/api/index.js'
import storage from 'good-storage'
import {
  getAwards,
  addAward,
  updateAward,
  delAward
} from '@/api/product/awards.js'
import { clones, treeData2Arr, formatDate } from '@/utility/index.js'
// import Http from '@/api/http'
export default {
  name: 'Awards',
  components: {
    TableList,
    Upload
  },
  mixins: [upload],
  data() {
    return {
      dialogTitle: '添加',
      addForm: {
        name: '',
        url: ''
      },
      form: {},
      fileList: [],
      dialogFormVisible: false,
      rules: {
        name: [{ required: true, message: '请输入奖项名称', trigger: 'blur' }]
      },
      pageConstant: {
        apiPrefixUrl: 'v1/awards',
        pageName: 'awards',
        dataKey: 'data'
      },
      tableData: {
        header: [
          {
            tableId: 'id',
            tableName: '序号',
            tableWidth: '60',
            formatter(row, index) {
              return index + 1
            }
          },
          {
            tableId: 'name',
            tableName: '奖项名称'
          },
          {
            tableId: 'url',
            tableName: '图片'
          },
          {
            tableId: 'updater',
            tableName: '操作人',
            formatter: row => {
              return row.updated_by ? row.updated_by : row.created_by
            }
          },
          {
            tableId: 'updaterTime',
            tableName: '操作时间',
            formatter: row => {
              return row.updated_time
                ? formatDate(new Date(row.updated_time))
                : formatDate(new Date(row.created_time))
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
        page_size: 20,
        page_num: 1
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getAwards(this.filters).then(res => {
        this.tableData.data = res.results.list
        this.tableData.pageData.totalCount = res.results.total
      })
    },
    handleCurrentChange(n) {
      this.filters.page_num = n
      this.getList()
    },
    add() {
      this.dialogFormVisible = true
      this.addForm.id = null
      this.addForm.name = ''
      this.addForm.url = ''
      this.fileList = []
    },
    editAction(row) {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.addForm = clones(row)
        this.fileList = [
          {
            name: this.addForm.url,
            url: this.addForm.url
          }
        ]
      })
    },
    cancel() {
      this.dialogFormVisible = false
    },
    submit(form) {
      this.$refs[form].validate(vaild => {
        if (vaild) {
          let params = {
            award: {
              name: this.addForm.name,
              url: this.addForm.url
            }
          }
          if (this.addForm.id) {
            updateAward(this.addForm.id, params).then(res => {
              console.log(res)
              this.dialogFormVisible = false
              this.getList()
            })
          } else {
            addAward(params).then(res => {
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
      this.$confirm(`您确定要删除该标签吗?`, 'Tips', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delAward(row.id).then(res => {
            console.log(res)
            this.getList()
          })
        })
        .catch(() => {})
    },
    fileChange(file, fileList) {
      this.handleUploadFile(file, fileList, 'url', 'fileList', url => {
        this.uploadImageToResource(
          file.name.substring(0, file.name.lastIndexOf('.')),
          url
        )
      })
    },

    uploadImageToResource(name, url) {
      let moduleId
      let menus = storage.get('menus')
      moduleId = treeData2Arr(menus, 'subMenus').filter(
        o => o.path === '/productManage/awards'
      )[0].id
      let data = {
        name: name,
        moduleId: moduleId,
        url: url,
        resourceType: 'Image',
        client: 'BackEnd'
      }
      uploadToResource(data)
    }
  }
}
</script>
