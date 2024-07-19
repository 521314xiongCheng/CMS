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
      <table-list :tableData="tableData">
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="{ row }">
            <el-button size="mini" type="primary" @click="editAction(row)"
              >Edit</el-button
            >
            <!-- <el-button size="mini" type="danger" @click="delAction(row, $index)"
              >Delete</el-button
            > -->
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
        label-width="110px"
        label-position="left"
        size="mini"
      >
        <el-form-item label="目录模板名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="id" prop="value">
          <el-input v-model="form.value"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input type="textarea" :rows="2" v-model="form.desc"></el-input>
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
import {
  getTemplates,
  addTemplate,
  updateTemplate,
  delTemplate
} from '@/api/product/template.js'
import restfulMixin from '@/mixins/restful.js'
import { clones, formatDate } from '@/utility/index.js'
// import Http from '@/api/http'
export default {
  name: 'Template',
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
        name: [
          { required: true, message: '请输入目录模板名称', trigger: 'blur' }
        ],
        value: [{ required: true, message: '请输入id', trigger: 'blur' }]
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
            tableName: '目录模板名称'
          },
          {
            tableId: 'value',
            tableName: 'ID'
          },
          {
            tableId: 'desc',
            tableName: '备注'
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
        data: []
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getTemplates().then(res => {
        this.tableData.data = res.results.list
      })
    },
    add() {
      this.dialogFormVisible = true
      this.form.id = null
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
          let data = {
            name: this.form.name,
            value: this.form.value,
            desc: this.form.desc
          }
          if (this.form.id) {
            updateTemplate(this.form.id, data).then(res => {
              console.log(res)
              this.dialogFormVisible = false
              this.getList()
            })
          } else {
            addTemplate(data).then(res => {
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
      this.$confirm(`您确定要删除该模板吗?`, 'Tips', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delTemplate(row.id).then(res => {
            console.log(res)
            this.getList()
          })
        })
        .catch(() => {})
    }
  }
}
</script>
