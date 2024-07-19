<template>
  <div>
    <div class="el-menu g-page-bar">
      <span class="page-title"></span>
      <el-button-group class="add-btn">
        <el-button type="primary" size="small" @click="addAction"
          >Add</el-button
        >
        <el-button type="primary" size="small" @click="submitSort"
          >Sort</el-button
        >
      </el-button-group>
    </div>
    <div class="table-wrap">
      <table-list :tableData="tableData" :choosePageFn="choosePageFn">
        <el-table-column label="Operate" align="center" width="140">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="editAction(scope)"
              >Edit</el-button
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
        <el-form-item label="ModuleType" prop="categoryId">
          <el-select v-model="form.categoryId">
            <el-option
              v-for="(item, index) in categories"
              :label="item.name"
              :key="index"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="ModuleName" prop="name">
          <el-input
            type="text"
            v-model="form.name"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="Path" prop="path">
          <el-input
            type="text"
            v-model="form.path"
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
import Http from '@/api/http'

export default {
  components: {
    TableList
  },
  mixins: [restfulMixin],
  data() {
    return {
      pageConstant: {
        apiPrefixUrl: 'system/modules',
        pageName: 'Modules',
        dataKey: 'modules'
      },
      tableData: {
        header: [
          {
            tableId: 'sort',
            tableName: 'Sort',
            tableWidth: '70px',
            type: 'input'
          },
          {
            tableId: 'id',
            tableName: 'ID'
          },
          {
            tableId: 'categoryName',
            tableName: 'ModuleType'
          },
          {
            tableId: 'name',
            tableName: 'ModuleName'
          },
          {
            tableId: 'path',
            tableName: 'Path'
          },
          {
            tableId: 'note',
            tableName: 'Note'
          },
          {
            tableId: 'status',
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
        categoryId: '',
        name: '',
        path: '',
        state: '',
        note: ''
      },
      filters: [],
      categories: [],
      modules: [],
      rules: {}
    }
  },
  methods: {
    submit() {
      this.submitAction('form')
    },
    submitSort() {
      const modules = this.tableData.data.map(item => {
        return {
          moduleId: Number(item.id),
          sort: Number(item.sort)
        }
      })
      // 106, 79
      // const modules = [
      //   {
      //     moduleId: 106,
      //     sort: 1
      //   },
      //   {
      //     moduleId: 79,
      //     sort: 2
      //   }
      // ]

      Http({
        method: 'PUT',
        url: 'system/modules/batch/sort',
        data: {
          modules
        }
      }).then(() => {
        this.getTableList()
      })
    }
  },
  mounted() {
    this.getTableList(1)
    Http({
      url: 'system/module/categories'
    }).then(res => {
      this.categories = res.categories
    })
  }
}
</script>
