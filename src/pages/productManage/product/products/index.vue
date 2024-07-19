<template>
  <div class="product-list">
    <div class="el-menu g-page-bar">
      <el-form :inline="true">
        <el-form-item label="货号">
          <el-input
            v-model="filters.skus"
            auto-complete="off"
            clearable
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input
            v-model="filters.name"
            auto-complete="off"
            clearable
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="updateDate"
            size="small"
            type="datetimerange"
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="产品类型">
          <el-select
            v-model="filters.product_type"
            size="small"
            clearable
            placeholder="请选择"
            @change="getList(1)"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="常规产品" value="SalesPart"></el-option>
            <el-option
              label="高端积分产品"
              value="AdvancedPointRedeemPart"
            ></el-option>
            <el-option
              label="普通积分产品"
              value="NormalPointRedeemPart"
            ></el-option>
            <el-option label="海淘产品" value="OverseasPart"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布状态">
          <el-select
            v-model="filters.publish_type"
            size="small"
            clearable
            placeholder="请选择"
            @change="getList(1)"
          >
            <el-option label="全部" :value="0"></el-option>
            <el-option label="未测试" :value="1"></el-option>
            <el-option label="发布uat异常" :value="4"></el-option>
            <el-option label="已测试" :value="2"></el-option>
            <el-option label="发布prod异常" :value="5"></el-option>
            <el-option label="已生效" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getList(1)"
            >搜索</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            @click="publishProducts('UAT')"
          >
            发布UAT测试环境
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            @click="publishProducts('PROD')"
          >
            发布生产环境
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrap">
      <table-list
        :tableData="tableData"
        :isUseMixin="false"
        :currentPage="filters.page_num"
        @handleCurrentChange="handleCurrentChange"
        :handleSelectionChange="selectionChange"
      >
        <el-table-column
          type="selection"
          label="全选"
          align="center"
          width="55"
          fixed="left"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <template slot-scope="{ row }">
            <el-button size="mini" type="primary" @click="editAction(row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </table-list>
      <div class="block page-box">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="1"
          :page-size="pageData.pageSize"
          :page-sizes="pageData.pageSizes"
          layout="total, prev, pager, next, jumper, sizes"
          :total="pageData.totalCount"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import TableList from '@/components/tableList.vue'
import { getProducts, publishProduct } from '@/api/product/products.js'
import { formatDate } from '@/utility/index.js'
import restfulMixin from '@/mixins/restful.js'
import storage from 'good-storage'
// import Http from '@/api/http'
export default {
  name: 'Product',
  components: {
    TableList
  },
  mixins: [restfulMixin],
  data() {
    return {
      form: {},
      updateDate: [],
      tableData: {
        header: [
          {
            tableId: 'sku',
            tableName: '货号',
            tableWidth: '100'
          },
          {
            tableId: 'name',
            tableName: '产品名称'
          },
          {
            tableId: 'product_type',
            tableName: '产品类型',
            formatter(row) {
              switch (row.product_type) {
                case 'SalesPart':
                  return '常规产品'
                case 'AdvancedPointRedeemPart':
                  return '高端积分产品'
                case 'NormalPointRedeemPart':
                  return '普通积分产品'
                case 'OverseasPart':
                  return '海淘产品'
              }
            }
          },
          {
            tableId: 'publish_type',
            tableName: '发布状态',
            tableWidth: '80',
            formatter(row) {
              switch (row.publish_type) {
                case 1:
                  return '未测试'
                case 2:
                  return '已测试'
                case 3:
                  return '已生效'
                case 4:
                  return '发布uat异常'
                case 5:
                  return '发布prod异常'
              }
            }
          },
          {
            tableId: 'updated_time',
            tableName: '操作时间',
            tableWidth: '145',
            formatter: row => {
              return formatDate(new Date(row.updated_time))
            }
          },
          {
            tableId: 'updated_by',
            tableName: '操作人',
            tableWidth: '150'
          }
        ],
        data: []
      },
      pageData: {
        pageSize: 20,
        pageNum: 1,
        totalCount: 0,
        pageSizes: [20, 50, 100, 200]
      },
      filters: {
        skus: '',
        name: '',
        product_type: '',
        publish_type: '',
        page_size: 20,
        page_num: 1
      },
      selection: []
    }
  },
  created() {
    let filters = storage.get('filters')
    console.log(filters)
    if (filters) {
      this.filters = filters
      if (filters.update_time_start && filters.update_time_end) {
        this.updateDate = [filters.update_time_start, filters.update_time_end]
      }
    }
    this.getList()
  },
  beforeRouteLeave(to, form, next) {
    if (to.path !== '/productManage/product/products/detail') {
      storage.set('filters', {
        skus: '',
        name: '',
        product_type: '',
        publish_type: '',
        page_size: 20,
        page_num: 1,
        update_time_start: null,
        update_time_end: null
      })
    }
    next()
  },
  methods: {
    getList(page_num) {
      if (page_num) {
        this.filters.page_num = page_num
      }
      let params = this.filters
      params.update_time_start =
        this.updateDate && this.updateDate[0] ? this.updateDate[0] : ''
      params.update_time_end =
        this.updateDate && this.updateDate[1] ? this.updateDate[1] : ''
      getProducts(params).then(res => {
        this.tableData.data = res.results.list
        this.pageData.totalCount = res.results.total ? res.results.total : 0
        storage.set('filters', params)
      })
    },
    handleCurrentChange(n) {
      this.filters.page_num = n
      this.getList()
    },
    handleSizeChange(n) {
      this.filters.page_size = n
      this.filters.page_num = 1
      this.getList()
    },
    selectionChange(selection) {
      console.log(selection)
      this.selection = selection
    },
    publishProducts(env) {
      if (!this.selection.length) {
        this.$notify({
          message: '请选择sku！',
          type: 'error',
          duration: 3000
        })
        return
      }
      let param = {
        skus: this.selection.map(o => o.sku),
        target_env: env
      }
      publishProduct(param).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.$notify({
            message: res.message || '发布成功',
            type: 'success',
            duration: 3000
          })
          this.selection = []
          this.getList()
        } else {
          this.$notify({
            message: res.message || '发布失败',
            type: 'error',
            duration: 3000
          })
        }
      })
    },
    editAction(row) {
      this.$router.push({
        path: '/productManage/product/products/detail',
        query: { sku: row.sku }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.page-box {
  margin: 30px 0;
  text-align: right;
}
</style>
