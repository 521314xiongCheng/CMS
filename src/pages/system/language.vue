<template>
  <div>
    <div class="el-menu g-page-bar">
      <span class="page-title"></span>
      <el-button-group class="add-btn">
        <el-button type="primary" size="small" @click="addAction"
          >Add</el-button
        >
      </el-button-group>
    </div>
    <div class="table-wrap">
      <table-list :tableData="tableData" :choosePageFn="choosePageFn">
        <el-table-column label="Operate" align="center" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="editAction(scope)"
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
        size="small"
        :rules="rules"
        label-width="150px"
        label-position="left"
      >
        <el-form-item label="Name" prop="name">
          <el-input
            type="text"
            v-model="form.name"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="Code" prop="code">
          <el-input
            type="text"
            v-model="form.code"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="Culture" prop="culture">
          <el-input
            type="text"
            v-model="form.culture"
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
        apiPrefixUrl: 'system/languages',
        pageName: 'Languages',
        dataKey: 'languages'
      },
      tableData: {
        header: [
          {
            tableId: 'name',
            tableName: 'Name'
          },
          {
            tableId: 'code',
            tableName: 'Code'
          },
          {
            tableId: 'culture',
            tableName: 'Culture'
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
        note: '',
        code: '',
        culture: ''
      },
      rules: {}
    }
  },
  methods: {
    submit() {
      this.submitAction('form')
    }
  },
  mounted() {
    this.getTableList(1)
  }
}
</script>
