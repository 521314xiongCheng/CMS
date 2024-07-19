<template>
  <div>
    <div class="el-menu g-page-bar">
      <span class="page-title"></span>
      <el-form :inline="true">
        <el-form-item label="ModuleName" prop="moduleName">
          <el-input
            v-model="filters.moduleName"
            auto-complete="off"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="ModuleType" prop="moduleType">
          <el-select v-model="filters.moduleType" size="small">
            <el-option
              v-for="(item, index) in categories"
              :label="item.name"
              :key="index"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="handleSearch"
            >Query</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrap">
      <el-table
        ref="multipleTable"
        :data="tableData.data"
        :stripe="true"
        border
        style="width: 100%"
      >
        <el-table-column width="55" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isCheck"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="ID" prop="id" align="center"></el-table-column>
        <el-table-column
          prop="moduleType"
          label="ModuleType"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="moduleName"
          label="ModuleName"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="note"
          label="Note"
          align="center"
        ></el-table-column>
      </el-table>
      <div class="text-right mt20">
        <el-button type="primary" size="small" @click="handleSubmit"
          >Submit</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import restfulMixin from '@/mixins/restful.js'
import Http from '@/api/http'

export default {
  mixins: [restfulMixin],
  data() {
    return {
      pageConstant: {
        apiPrefixUrl: 'system/roles/{id}/modules',
        pageName: 'Account',
        dataKey: 'modules'
      },
      tableData: {
        data: []
      },
      filters: {
        moduleName: '',
        moduleType: ''
      },
      categories: []
    }
  },
  methods: {
    handleSubmit() {
      const moduleIds = []
      this.tableData.data.forEach(item => {
        if (item.isCheck) moduleIds.push(item.id)
      })
      Http({
        method: 'POST',
        url: `system/roles/${this.id}/modules`,
        data: {
          moduleIds
        }
      }).then(() => {
        this.getTableList()
      })
    },
    handleSearch() {
      this.getTableList()
    }
  },
  mounted() {
    this.id = this.$route.query.id
    this.getTableList()
    Http({
      url: 'system/module/categories'
    }).then(res => {
      this.categories = res.categories
    })
  }
}
</script>
