import { get, del, online, edit, create } from '@/api/general'
import TableList from '@/components/tableList.vue'
import singleDialogMixin from '@/mixins/singleDialog.js'
/**
 * 公共的mixin
 * 调用之前需要到 @/config/index.js 下添加对应的模块
 */
export default {
  data() {
    return {
      pageNo: 1
    }
  },
  mixins: [singleDialogMixin],
  components: { TableList },
  methods: {
    _add(callback) {
      this.dialogTitle = `New ${this.PAGE_CONFIG.pageName}`
      this.showDialogForm()
      callback && callback.call(this, null)
    },
    add() {
      this._add()
    },
    _editAction(scope, initOtherData) {
      this.dialogTitle = `Edit ${this.PAGE_CONFIG.pageName}`
      this.form = Object.assign(this.form, scope.row)
      initOtherData && initOtherData.call(this, scope)
      this.showDialogForm()
    },
    editAction(scope) {
      this._editAction(scope)
    },
    deleteAction(scope, callback) {
      this.$confirm('Would you like to delete the item?', 'Tips', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        const deleteApiUrl = this.PAGE_CONFIG.api.del
        let url = this.getParametersUrl(
          deleteApiUrl.url,
          deleteApiUrl.buildUrlParams,
          scope.row
        )

        del(url).then(() => {
          this.getTableList(this.pageNo)
        })
        callback && callback.call(this, scope)
      })
    },
    _onlineAction(scope, callback) {
      const onlineStatusWord = this.onlineStatus2bool(scope.row.onlineStatus)
        ? 'Off-line'
        : 'On-line'
      this.$confirm(`Would you like to ${onlineStatusWord} the item?`, 'Tips', {
        confirmButtonText: onlineStatusWord,
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        const onlineApiUrl = this.PAGE_CONFIG.api.online
        let url = this.getParametersUrl(
          onlineApiUrl.url,
          onlineApiUrl.buildUrlParams,
          scope.row
        )

        online(url).then(() => {
          this.getTableList(this.pageNo)
          callback && callback.call(this, scope)
        })
      })
    },
    onlineAction(scope) {
      this._onlineAction(scope)
    },
    _getTableData(pageNo, initData) {
      const params = {
        pageNo,
        pageSize: this.tableData.pageData.pageSize
      }
      this.pageNo = pageNo

      const getApiUrl =
        (this.PAGE_CONFIG.api && this.PAGE_CONFIG.api.get) ||
        this.PAGE_CONFIG.apiPrefixUrl
      let url = getApiUrl
      if (typeof getApiUrl === 'object') {
        // url中需要path参数
        url = this.getParametersUrl(
          getApiUrl.url,
          getApiUrl.buildUrlParams,
          this
        )

        // 额外的搜索条件
        if (getApiUrl.extraQuery) {
          getApiUrl.extraQuery.forEach(item => {
            if (this[item.valueKey]) {
              params[item.paramsKey] = this[item.valueKey]
            }
          })
        }
      }

      get(url, params).then(res => {
        this.tableData.pageData.totalCount = res.totalCount

        if (initData) {
          this.tableData.data = initData.call(
            this,
            res[this.PAGE_CONFIG.dataKey]
          )
        } else {
          this.tableData.data = res[this.PAGE_CONFIG.dataKey]
        }
      })
    },
    getTableList(pageNo) {
      this._getTableData(pageNo)
    },
    _submit(callback) {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const { form } = this
          const isEdit = !!form.id

          if (isEdit) {
            const editApiUrl =
              (this.PAGE_CONFIG.api && this.PAGE_CONFIG.api.edit) ||
              this.PAGE_CONFIG.apiPrefixUrl
            let url = this.getParametersUrl(
              editApiUrl.url,
              editApiUrl.buildUrlParams,
              this
            )

            return edit(url, form).then(() => {
              this.getTableList(this.pageNo)
              this.handleCancel()
            })
          }

          const createApiUrl =
            (this.PAGE_CONFIG.api && this.PAGE_CONFIG.api.create) ||
            this.PAGE_CONFIG.apiPrefixUrl
          // let url = this.getParametersUrl(createApiUrl.url, createApiUrl.buildUrlParams, this)
          create(createApiUrl, form).then(() => {
            this.getTableList(this.pageNo)
            this.handleCancel()
            callback && callback.call(this, null)
          })
        }
      })
    },
    submit() {
      this._submit()
    },
    getParametersUrl(url, buildUrlParams, paramsSourceData) {
      const urlParams = []
      buildUrlParams.forEach(item =>
        urlParams.push(this._deepGet(paramsSourceData, item))
      )
      return this.buildUrl(url, ...urlParams)
    },
    buildUrl(url, ...argv) {
      return url.replace(/\{\w+\}/g, () => {
        const res = argv.shift()
        if (res === undefined) {
          throw new Error('URI 参数不足')
        }
        return res
      })
    },
    _deepGet(object, path, defaultValue) {
      return (
        (!Array.isArray(path)
          ? path
              .replace(/\[/g, '.')
              .replace(/\]/g, '')
              .split('.')
          : path
        ).reduce((o, k) => (o || {})[k], object) || defaultValue
      )
    },
    closeDialogCb() {
      this.$refs.form.resetFields()
    }
  }
}
