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
        label-width="110px"
        label-position="left"
        size="mini"
      >
        <el-form-item label="系列名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="促销背景色值" prop="value">
          <div class="color-picker-wrap">
            <div class="color-picker-item">
              <el-input
                size="mini"
                v-model="themeStart"
                style="width:80px;"
              ></el-input>
              <el-color-picker
                v-model="themeStart"
                :predefine="[
                  '#409EFF',
                  '#1890ff',
                  '#304156',
                  '#212121',
                  '#11a983',
                  '#13c2c2',
                  '#6959CD',
                  '#f5222d'
                ]"
                class="theme-picker"
                popper-class="theme-picker-dropdown"
              />
            </div>
            <div class="color-picker-item">
              <el-input
                size="mini"
                v-model="themeEnd"
                style="width:80px;"
              ></el-input>
              <el-color-picker
                v-model="themeEnd"
                :predefine="[
                  '#409EFF',
                  '#1890ff',
                  '#304156',
                  '#212121',
                  '#11a983',
                  '#13c2c2',
                  '#6959CD',
                  '#f5222d'
                ]"
                class="theme-picker"
                popper-class="theme-picker-dropdown"
              />
            </div>
          </div>
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
  getSeries,
  addSerie,
  updateSerie,
  delSerie
} from '@/api/product/series.js'
import restfulMixin from '@/mixins/restful.js'
import { clones, formatDate } from '@/utility/index.js'
// import Http from '@/api/http'
export default {
  name: 'Series',
  components: {
    TableList
  },
  mixins: [restfulMixin],
  data() {
    let checkValue = (rule, value, callback) => {
      if (!this.themeStart || !this.themeEnd) {
        callback(new Error('促销背景色值错误'))
      } else {
        callback()
      }
    }
    return {
      dialogTitle: '添加',
      form: {
        name: '',
        value: ''
      },
      dialogFormVisible: false,
      rules: {
        name: [{ required: true, message: '请输入系列名称', trigger: 'blur' }],
        value: [{ validator: checkValue, required: true, trigger: 'blur' }]
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
            tableName: '系列名'
          },
          {
            tableId: 'value',
            tableName: '促销背景色值'
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
      themeStart: '',
      themeEnd: '',
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
      getSeries(this.filters).then(res => {
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
      this.form.name = ''
      this.form.id = null
      this.form.value = ''
      this.themeStart = ''
      this.themeEnd = ''
    },
    editAction(row) {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        console.log(row)
        this.form = clones(row)
        let values = row.value ? row.value.split('-') : []
        this.themeStart = values[0]
        this.themeEnd = values[1]
      })
    },
    cancel() {
      this.dialogFormVisible = false
    },
    submit(form) {
      this.$refs[form].validate(vaild => {
        if (vaild) {
          let param = {
            series: {
              name: this.form.name,
              value: `${this.themeStart}-${this.themeEnd}`
            }
          }
          if (this.form.id) {
            updateSerie(this.form.id, param).then(res => {
              console.log(res)
              this.dialogFormVisible = false
              this.getList()
            })
          } else {
            addSerie(param).then(res => {
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
      this.$confirm(`您确定要删除该系列?`, 'Tips', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delSerie(row.id).then(res => {
            console.log(res)
            this.getList()
          })
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="less" scoped>
.color-picker-wrap {
  display: flex;
  justify-content: space-between;
  .color-picker-item {
    display: flex;
    align-items: center;
    .theme-picker {
      margin-left: 10px;
    }
  }
}
</style>
