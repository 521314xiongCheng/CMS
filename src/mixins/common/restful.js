import { get } from '@/api/general'

export default {
  data() {
    return {
      listData: []
    }
  },
  methods: {
    getData(pageNo, callback) {
      const params = {
        pageNo,
        pageSize: this.tableData.pageData.pageSize
      }
      this.pageNo = pageNo

      const api = this.PAGE_CONFIG.api && this.PAGE_CONFIG.api.get
      let apiUrl = api
      if (typeof api === 'object') {
        // url中需要path参数
        apiUrl = this.getParametersUrl(api.url, api.buildUrlParams, this)

        // 额外的搜索条件
        if (api.extraQuery) {
          api.extraQuery.forEach(item => {
            const value = this._deepGet(this, item.valueKey)
            if (value) {
              params[item.paramsKey] = value
            }
          })
        }
      }

      get(apiUrl, params).then(res => {
        this.tableData.pageData.totalCount = res.totalCount

        if (callback) {
          this.tableData.data = callback.call(
            this,
            res[this.PAGE_CONFIG.dataKey]
          )
        } else {
          this.tableData.data = res[this.PAGE_CONFIG.dataKey]
        }
      })
    },
    deleteData() {},
    updateData() {},
    // createData(pageNo, callback) {},
    _buildUrl(url, ...argv) {
      return url.replace(/\{\w+\}/g, () => {
        const res = argv.shift()
        if (res === undefined) {
          throw new Error('URI 参数不足')
        }
        return res
      })
    },
    _deepGet(object, path, defaultValue = '') {
      return (
        (!Array.isArray(path)
          ? path
              .replace(/\[/g, '.')
              .replace(/\]/g, '')
              .split('.')
          : path
        ).reduce((o, k) => (o || {})[k], object) || defaultValue
      )
    }
  }
}
