<template>
  <div>
    <div class="el-menu g-page-bar">
      <el-form :inline="true">
        <el-form-item label="RoleName" prop="name">
          <el-input
            v-model="filters.name"
            auto-complete="off"
            size="small"
          ></el-input>
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
          prop="name"
          label="RoleName"
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
        apiPrefixUrl: 'system/accounts/{id}/roles',
        pageName: 'Role',
        dataKey: 'roles'
      },
      tableData: {
        data: []
      },
      filters: {
        name: ''
      }
    }
  },
  methods: {
    handleSubmit() {
      const rolesIds = []
      this.tableData.data.forEach(item => {
        if (item.isCheck) rolesIds.push(item.id)
      })
      Http({
        method: 'POST',
        url: `system/accounts/${this.id}/roles`,
        data: {
          rolesIds
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
  }
}
</script>
