<template>
  <div>
    <div class="g-page-bar">
      <span class="page-title"></span>
      <div class="handle-bar">
        <el-button
          class="add-btn-l"
          icon="el-icon-plus"
          size="mini"
          @click="add"
        ></el-button>
        <el-input
          style="width:200px;"
          clearable
          v-model="filters.name"
          size="mini"
        >
          <el-button
            icon="el-icon-search"
            slot="append"
            size="mini"
            @click="getTableList(1)"
          ></el-button>
        </el-input>
      </div>
    </div>
    <div class="table-wrap">
      <table-list :tableData="tableData" :choosePageFn="choosePageFn">
        <el-table-column label="Operate" align="center" width="265">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="edit(scope)"
              >Edit</el-button
            >
            <el-button size="mini" type="success" @click="redirectToRole(scope)"
              >Role</el-button
            >
            <el-button
              size="mini"
              type="success"
              @click="redirectToModule(scope)"
              >Module</el-button
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
        <el-form-item label="Email" prop="email">
          <el-input
            type="text"
            v-model="form.email"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input
            type="text"
            v-model="form.name"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="Number" prop="number">
          <el-input
            type="text"
            v-model="form.number"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="NickName" prop="nickName">
          <el-input
            type="text"
            v-model="form.nickName"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="Clients" prop="clientIds">
          <el-checkbox-group v-model="form.clientIds">
            <el-checkbox
              v-for="client in clients"
              :label="client.id"
              :key="client.id"
              v-model="client.id"
              >{{ client.name }}</el-checkbox
            >
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
import Http from '@/api/http'

export default {
  components: {
    TableList
  },
  mixins: [restfulMixin],
  data() {
    return {
      pageConstant: {
        apiPrefixUrl: 'system/accounts',
        pageName: 'Accounts',
        dataKey: 'accounts'
      },
      filters: {
        name: ''
      },
      tableData: {
        header: [
          {
            tableId: 'email',
            tableName: 'Account'
          },
          {
            tableId: 'name',
            tableName: 'Name'
          },
          {
            tableId: 'number',
            tableName: 'Number'
          },
          {
            tableId: 'nickName',
            tableName: 'NickName'
          },
          {
            tableId: 'roles',
            tableName: 'Role'
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
        number: '',
        email: '',
        nickName: '',
        clientIds: []
      },
      rules: {},
      clients: []
    }
  },
  methods: {
    add() {
      this.form.clientIds = []
      this.addAction()
    },
    submit() {
      this.submitAction('form')
    },
    edit(scope) {
      this.editAction(scope, v => {
        this.form.clientIds = v.row.clients
          .filter(item => item.isCheck)
          .map(item => item.id)
      })
    },
    redirectToRole(scope) {
      this.$router.push({
        name: 'permission-account-role',
        query: { id: scope.row.id }
      })
    },
    redirectToModule(scope) {
      this.$router.push({
        name: 'permission-account-module',
        query: { id: scope.row.id }
      })
    }
  },
  mounted() {
    this.getTableList(1)
    Http({
      url: 'system/clients'
    }).then(res => (this.clients = res.clients))
  }
}
</script>
<style lang="less" scoped>
.g-page-bar {
  display: flex;
  justify-content: space-between;
  .handle-bar {
    display: flex;
    .add-btn-l {
      margin-right: 15px;
    }
  }
}
</style>
