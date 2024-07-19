<!-- X component -->
<template>
  <div class="article-update-record">
    <table-list
      :tableData="updateRecordTableData"
      :choosePageFn="choosePageFn"
    ></table-list>
  </div>
</template>

<script>
import TableList from './tableList'
import Http from '@/api/http'
export default {
  data() {
    return {
      updateRecordTableData: {
        header: [
          {
            tableId: 'operator',
            tableName: 'User'
          },
          {
            tableId: 'operateTime',
            tableName: 'Date'
          },
          {
            tableId: 'content',
            tableName: 'Content Modification'
          }
        ],
        data: [],
        pageData: {
          pageSize: 20,
          pageNo: 1,
          totalCount: 0
        }
      }
    }
  },
  props: ['articleId'],
  created() {
    this.getUpdateRecordTableData()
  },
  methods: {
    getUpdateRecordTableData(pageNo) {
      const { pageSize } = this.updateRecordTableData.pageData
      pageNo = pageNo || this.updateRecordTableData.pageData.pageNo
      this.updateRecordTableData.pageData.pageNo = pageNo
      Http({
        url: 'articles/operations',
        params: {
          articleId: this.articleId,
          pageSize,
          pageNo
        }
      }).then(res => {
        this.updateRecordTableData.data = res['operations']
        if (res.totalCount) {
          this.updateRecordTableData.pageData.totalCount = res.totalCount
        }
      })
    },
    choosePageFn(pageNo) {
      this.getUpdateRecordTableData(pageNo)
    }
  },
  components: { TableList }
}
</script>

<style lang="less" scoped></style>
