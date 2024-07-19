<template>
  <div>
    <div class="el-menu g-page-bar">
      <span class="page-title"></span>
      <el-button-group class="add-btn">
        <el-button type="primary" size="mini" @click="add">Add</el-button>
      </el-button-group>
    </div>
    <div class="table-wrap">
      <table-list :tableData="tableData" :choosePageFn="choosePageFn">
        <el-table-column label="Operate" align="center" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="edit(scope)"
              >Edit</el-button
            >
          </template>
        </el-table-column>
      </table-list>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-width="150px"
        label-position="left"
        size="small"
      >
        <el-form-item label="Name" prop="name">
          <el-input
            type="text"
            v-model="form.name"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="Note" prop="note">
          <el-input
            type="textarea"
            v-model="form.note"
            autosize
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="Scope" prop="scopCodes">
          <el-checkbox-group v-model="form.scopCodes">
            <el-checkbox label="Product">Product</el-checkbox>
            <el-checkbox label="Article">Article</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="State" prop="state">
          <el-select v-model="form.state">
            <el-option label="Invalid" :value="0"></el-option>
            <el-option label="Valid" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <div class="text-center">
          <el-button @click="hideDialogForm" size="small">Cancel</el-button>
          <el-button type="primary" @click="submit" size="small"
            >Confirm</el-button
          >
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import TableList from '@/components/tableList.vue'
import restfulMixin from '@/mixins/restful.js'

export default {
  components: {
    TableList
  },
  mixins: [restfulMixin],
  data() {
    return {
      pageConstant: {
        apiPrefixUrl: 'system/tags',
        dataKey: 'tags'
      },
      tableData: {
        header: [
          {
            tableId: 'id',
            tableName: 'ID'
          },
          {
            tableId: 'name',
            tableName: 'Name'
          },
          {
            tableId: 'scops',
            tableName: 'Scope',
            formatter(row) {
              return row.scops
                .map(item => (item.isCheck ? item.name : null))
                .filter(Boolean)
                .join(',')
            }
          },
          {
            tableId: 'note',
            tableName: 'Note'
          },
          {
            tableId: 'state',
            tableName: 'State',
            formatter(row) {
              return row.state === 1 ? 'Valid' : 'Invalid'
            }
          }
        ],
        data: [],
        pageData: {
          pageSize: 20,
          totalCount: 0
        }
      },
      form: {
        name: '',
        state: '',
        scopCodes: [],
        note: ''
      },
      filters: {},
      rules: {
        name: {
          required: true,
          message: 'Please enter Name'
        },
        scopCodes: {
          type: 'array',
          required: true,
          message: 'Please select at least one Scope',
          trigger: 'change'
        }
      }
    }
  },
  methods: {
    add() {
      this.addAction()
    },
    submit() {
      this.submitAction('form')
    },
    edit(scope) {
      this.editAction(scope, () => {
        this.form.scopCodes = scope.row.scops
          .map(item => (item.isCheck ? item.code : null))
          .filter(Boolean)
      })
    }
  },
  mounted() {
    this.getTableList(1)
  }
}
</script>
