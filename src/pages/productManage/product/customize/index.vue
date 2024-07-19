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
        <el-table-column label="操作" align="center" width="200">
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
      width="400px"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-width="80px"
        label-position="left"
        size="mini"
      >
        <el-form-item label="参数名" prop="name">
          <el-input
            :disabled="form.id ? true : false"
            v-model="form.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="参数类型" prop="type">
          <el-select
            v-model="form.type"
            size="small"
            :disabled="form.id ? true : false"
            placeholder="请选择"
            @change="selectChange"
          >
            <el-option label="文本" :value="1"></el-option>
            <el-option label="数字" :value="2"></el-option>
            <el-option label="图片" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="默认值">
          <el-input
            v-model="form.default_value"
            size="small"
            v-if="form.type !== 3"
          ></el-input>
          <upload
            @change="fileChange"
            v-else
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
  </div>
</template>

<script>
import TableList from '@/components/tableList.vue'
import Upload from '@/components/upload'
import upload from '@/mixins/upload.js'
import {
  getParameters,
  addParameter,
  updateParameter,
  delParameter
} from '@/api/product/parameter.js'
import restfulMixin from '@/mixins/restful.js'
import { clones, formatDate } from '@/utility/index.js'
// import Http from '@/api/http'
export default {
  name: 'Customize',
  components: {
    TableList,
    Upload
  },
  mixins: [restfulMixin, upload],
  data() {
    return {
      dialogTitle: '添加',
      form: {
        name: '',
        type: null,
        default_value: ''
      },
      dialogFormVisible: false,
      rules: {
        name: [{ required: true, message: '请输入参数名', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }]
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
            tableName: '参数名'
          },
          {
            tableId: 'type',
            tableName: '参数类型',
            formatter: row => {
              switch (row.type) {
                case 1:
                  return '文本'
                case 2:
                  return '数字'
                case 3:
                  return '图片'
              }
            }
          },
          {
            tableId: 'default_value',
            tableName: '默认值'
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
      },
      fileList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    fileChange(file, fileList) {
      this.handleUpload(file, fileList, 'default_value', 'fileList', url => {
        console.log(url)
      })
    },
    selectChange() {
      this.fileList = []
      this.$set(this.form, 'default_value', '')
    },
    getList() {
      getParameters(this.filters).then(res => {
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
      this.form.id = null
      this.form.default_value = ''
    },
    editAction(row) {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        console.log(row)
        this.form = clones(row)
      })
    },
    cancel() {
      this.dialogFormVisible = false
    },
    submit(form) {
      this.$refs[form].validate(vaild => {
        if (vaild) {
          let param = {
            parameter: {
              name: this.form.name,
              type: this.form.type,
              default_value: this.form.default_value
            }
          }
          if (this.form.id) {
            updateParameter(this.form.id, param).then(res => {
              console.log(res)
              this.dialogFormVisible = false
              this.getList()
            })
          } else {
            addParameter(param).then(res => {
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
      this.$confirm(`您确定要删除该项?`, 'Tips', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delParameter(row.id).then(res => {
            console.log(res)
            this.getList()
          })
        })
        .catch(() => {})
    }
  }
}
</script>
