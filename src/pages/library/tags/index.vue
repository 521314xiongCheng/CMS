<template>
  <div class="product-list">
    <div class="el-menu g-page-bar">
      <div class="handle-bar">
        <el-input
          style="width:200px;"
          clearable
          v-model="filters.name"
          @change="getList(1)"
          size="mini"
        >
          <el-button
            icon="el-icon-search"
            slot="append"
            size="mini"
            @click="getList(1)"
          ></el-button>
        </el-input>
        <el-button type="primary" class="add-btn-l" size="mini" @click="add">
          添加
        </el-button>
        <el-button type="primary" size="mini" @click="sort">
          更新排序
        </el-button>
      </div>
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
        <el-table-column label="Operate" align="center" width="160">
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
        <el-form-item label="标签名称" prop="labelName">
          <el-input v-model="form.labelName"></el-input>
        </el-form-item>
        <el-form-item label="标签类型" prop="labelType">
          <el-select v-model="form.labelType" size="small" placeholder="请选择">
            <el-option label="显性标签" :value="1"></el-option>
            <el-option label="隐性标签" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注说明" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="2"></el-input>
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
  getTags,
  addTag,
  updateTag,
  delTag,
  sortTags
} from '@/api/library/tags.js'
import restfulMixin from '@/mixins/restful.js'
import { clones, formatDate } from '@/utility/index.js'
// import Http from '@/api/http'
export default {
  components: {
    TableList
  },
  mixins: [restfulMixin],
  data() {
    return {
      dialogTitle: '添加',
      form: {
        labelName: '',
        labelType: 2,
        isHot: false,
        remark: '',
        parentLabelName: ''
      },
      dialogFormVisible: false,
      rules: {
        labelName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
        ]
      },
      tableData: {
        header: [
          {
            tableId: 'id',
            tableName: 'ID',
            tableWidth: 60
          },
          {
            tableId: 'labelName',
            tableName: '标签名称'
          },
          {
            tableId: 'labelType',
            tableName: '标签类型',
            tableWidth: 100,
            formatter: row => {
              switch (row.labelType) {
                case 1:
                  return '显性标签'
                case 2:
                  return '隐性标签'
              }
            }
          },
          {
            tableId: 'remark',
            tableName: '备注说明'
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
                : row.createdDate
                ? formatDate(new Date(row.createdDate))
                : '-'
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
        name: '',
        pageSize: 20,
        pageNo: 1
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(n) {
      if (n) {
        this.filters.pageNo = n
      }
      getTags(this.filters).then(res => {
        console.log(res)
        this.tableData.data = res.labels
        this.tableData.pageData.totalCount = res.totalCount
      })
    },
    handleCurrentChange(n) {
      this.filters.pageNo = n
      this.getList()
    },
    add() {
      this.form.id = null
      this.dialogFormVisible = true
    },
    sort() {
      let data = this.tableData.data.map(o => ({
        id: Number(o.id),
        sort: Number(o.sort)
      }))
      sortTags({ labelSorts: data }).then(res => {
        console.log(res)
        this.getList()
      })
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
            labelName: this.form.labelName,
            labelType: this.form.labelType,
            remark: this.form.remark
          }
          if (this.form.id) {
            updateTag(this.form.id, data).then(res => {
              console.log(res)
              this.dialogFormVisible = false
              this.getList()
            })
          } else {
            addTag(data).then(res => {
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
      this.$confirm(`请问是否确认要删除当前标签?`, 'Tips', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delTag(row.id).then(res => {
          console.log(res)
          this.getList()
        })
      })
    }
  }
}
</script>
<style lang="less">
.handle-bar {
  display: flex;
  justify-content: flex-end;
  .add-btn-l {
    margin-left: 10px;
  }
}
</style>
