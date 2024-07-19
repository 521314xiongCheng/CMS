<template>
  <div>
    <div class="el-menu g-page-bar">
      <span class="page-title"></span>
      <el-button
        class="add-btn"
        icon="el-icon-plus"
        size="mini"
        @click="addAction"
      ></el-button>
    </div>
    <div class="table-wrap">
      <table-list :tableData="tableData" :choosePageFn="choosePageFn">
        <el-table-column label="Operate" align="center" width="285">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="editAction(scope)"
              >Edit</el-button
            >
            <el-button
              size="mini"
              type="success"
              @click="redirectToModule(scope)"
              >Module</el-button
            >
            <el-button
              size="mini"
              type="success"
              @click="redirectToAccount(scope)"
              >Account</el-button
            >
            <el-button size="mini" type="danger" @click="delAction(scope)"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </table-list>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form
        :model="form"
        ref="form"
        size="small"
        :rules="rules"
        label-width="150px"
        label-position="left"
      >
        <el-form-item label="RoleName" prop="name">
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
        apiPrefixUrl: 'system/roles',
        pageName: 'Roles',
        dataKey: 'roles'
      },
      tableData: {
        header: [
          {
            tableId: 'id',
            tableName: 'ID'
          },
          {
            tableId: 'name',
            tableName: 'RoleName'
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
        note: ''
      },
      filters: [],
      rules: {}
    }
  },
  methods: {
    submit() {
      this.submitAction('form')
    },
    redirectToAccount(scope) {
      this.$router.push({
        name: 'permission-role-account',
        query: { id: scope.row.id }
      })
    },
    redirectToModule(scope) {
      this.$router.push({
        name: 'permission-role-module',
        query: { id: scope.row.id }
      })
    }
  },
  mounted() {
    this.getTableList(1)
  }
}
</script>
