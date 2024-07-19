import { createQuery, mergeObj } from '@/utility'
import { get, edit, create, del } from '@/api/general'

export default {
  data() {
    return {
      dialogTitle: 'Create/Edit',
      dialogFormVisible: false,
      pageNo: 1,
      isEdit: false,
      id: null
    }
  },
  watch: {
    dialogFormVisible(v) {
      if (!v) {
        this.resetForm('form')
      }
    }
  },
  methods: {
    hideDialogForm() {
      this.dialogFormVisible = false
    },
    showDialogForm() {
      this.dialogFormVisible = true
    },
    choosePageFn(pageNo) {
      this.getTableList(pageNo)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getTableList(pageNo, pageSize) {
      pageNo = pageNo || this.pageNo
      pageSize =
        pageSize ||
        (this.tableData.pageData && this.tableData.pageData.pageSize)
      this.filters = this.filters || {}
      this.pageNo = pageNo
      this.pageConstant.apiPrefixUrl = this.pageConstant.apiPrefixUrl.replace(
        '{id}',
        this.id
      )
      if (pageNo) this.filters.pageNo = pageNo
      if (pageSize) this.filters.pageSize = pageSize
      const filters = createQuery(this.filters)
      const url = `${this.pageConstant.apiPrefixUrl}?${filters}`
      // staffConsultant v2补丁
      let basePath =
        this.pageConstant.apiPrefixUrl == 'staffconsultants'
          ? '/proxy/staffConsultant/'
          : ''
      get(url, {}, basePath).then(res => {
        this.tableData.data = this.pageConstant.dataKey
          ? res[this.pageConstant.dataKey]
          : res
        if (res.totalCount) {
          this.tableData.pageData.totalCount = res.totalCount
        } else {
          this.tableData.pageData.totalCount =
            res[this.pageConstant.dataKey].length
        }
      })
    },
    editAction(scope, preFunc) {
      if (typeof preFunc === 'function') {
        preFunc(scope)
      }
      this.isEdit = true
      this.id = scope.row.id
      this.$nextTick(() => {
        this.form = mergeObj(this.form, scope.row)
      })
      this.showDialogForm()
    },
    addAction() {
      this.isEdit = false
      this.showDialogForm()
    },
    delAction(scope) {
      const id = scope.row.id
      const url = `${this.pageConstant.apiPrefixUrl}/${id}`
      del(url).then(() => this.getTableList())
    },
    submitAction(formName, preFunc) {
      let shouldContinue = true
      if (typeof preFunc === 'function') {
        shouldContinue = preFunc()
      }
      if (!shouldContinue) return
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isEdit) {
            const url = `${this.pageConstant.apiPrefixUrl}/${this.id}`
            edit(url, this.form).then(() => {
              this.hideDialogForm()
              this.getTableList()
            })
            return
          }
          const url = `${this.pageConstant.apiPrefixUrl}`
          create(url, this.form).then(() => {
            this.hideDialogForm()
            this.getTableList()
          })
        } else {
          return false
        }
      })
    }
  }
}
