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
        :currentPage="filters.page_num"
        @handleCurrentChange="handleCurrentChange"
      >
        <el-table-column label="操作" align="center" width="140">
          <template slot-scope="{ row }">
            <el-button size="mini" type="primary" @click="editAction(row)"
              >Edit</el-button
            >
            <el-button size="mini" type="danger" @click="delAction(row)"
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
        label-width="110px"
        label-position="left"
        size="mini"
      >
        <el-form-item label="小程序名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="小程序id" prop="program_id">
          <el-input v-model="form.program_id"></el-input>
        </el-form-item>
        <!-- <el-form-item label="备注" prop="desc">
          <el-input type="textarea" :rows="2" v-model="form.desc"></el-input>
        </el-form-item> -->
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
  getMiniprograms,
  addMiniprogram,
  updateMiniprogram,
  delMiniprogram
} from '@/api/product/miniprogram.js'
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
          { required: true, message: '请输入小程序名称', trigger: 'blur' }
        ],
        program_id: [
          { required: true, message: '请输入小程序id', trigger: 'blur' }
        ]
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
            tableName: '小程序名称'
          },
          {
            tableId: 'program_id',
            tableName: '小程序ID'
          },
          {
            tableId: 'updaterTime',
            tableName: '操作时间',
            formatter: row => {
              return row.updated_date
                ? formatDate(new Date(row.updated_date))
                : formatDate(new Date(row.updated_date))
            }
          }
        ],
        data: []
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
      getMiniprograms().then(res => {
        this.tableData.data = res.results.list
      })
    },
    handleCurrentChange(n) {
      this.filters.page_num = n
      this.getList()
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
            id: this.form.id,
            name: this.form.name,
            program_id: this.form.program_id
          }
          if (this.form.id) {
            updateMiniprogram(data).then(res => {
              console.log(res)
              this.dialogFormVisible = false
              this.getList()
            })
          } else {
            addMiniprogram(data).then(res => {
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
      this.$confirm(`确定删除该小程序吗?`, 'Tips', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delMiniprogram(row.id).then(res => {
            console.log(res)
            this.getList()
          })
        })
        .catch(() => {})
    }
  }
}
</script>
