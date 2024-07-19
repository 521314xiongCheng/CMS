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
        label-width="100px"
        label-position="left"
        size="mini"
      >
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="标签类型" prop="type">
          <el-select v-model="form.type" size="small" placeholder="请选择">
            <el-option label="营销标签" :value="1"></el-option>
            <el-option label="产品标签" :value="2"></el-option>
            <el-option label="TA说标签" :value="3"></el-option>
            <el-option label="目录标签" :value="6"></el-option>
          </el-select>
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
import { getTags, addTag, updateTag, delTag } from '@/api/product/tags.js'
import restfulMixin from '@/mixins/restful.js'
import { clones, formatDate } from '@/utility/index.js'
// import Http from '@/api/http'
export default {
  name: 'Tags',
  components: {
    TableList
  },
  mixins: [restfulMixin],
  data() {
    return {
      dialogTitle: '添加',
      form: {},
      dialogFormVisible: false,
      rules: {
        name: [{ required: true, message: '请输入标签名', trigger: 'blur' }],
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
            tableName: '标签名',
            type: 'text'
          },
          {
            tableId: 'type',
            tableName: '标签类型',
            formatter: row => {
              switch (row.type) {
                case 1:
                  return '营销标签'
                case 2:
                  return '产品标签'
                case 3:
                  return 'TA说标签'
                case 6:
                  return '目录标签'
              }
            }
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
      getTags(this.filters).then(res => {
        this.tableData.data = res.results.list
        this.tableData.pageData.totalCount = res.results.total
      })
    },
    handleCurrentChange(n) {
      this.filters.page_num = n
      this.getList()
    },
    add() {
      this.form.id = null
      this.dialogFormVisible = true
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
            tag: {
              name: this.form.name,
              type: this.form.type
            }
          }
          if (this.form.id) {
            updateTag(this.form.id, param).then(res => {
              console.log(res)
              this.dialogFormVisible = false
              this.getList()
            })
          } else {
            addTag(param).then(res => {
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
      this.$confirm(`您确定要删除该标签?`, 'Tips', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delTag(row.id).then(res => {
            console.log(res)
            this.getList()
          })
        })
        .catch(() => {})
    }
  }
}
</script>
