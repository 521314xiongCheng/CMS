import generalMixin from '@/mixins/generalMixin.js'
import uploadMixin from '@/mixins/upload.js'
import { pushJson } from '@/api'

export default {
  data() {
    const that = this
    return {
      rules: {
        title: {
          required: true,
          message: 'Please enter title'
        },
        moduleName: {
          required: true,
          message: 'Please enter ModuleName'
        },
        moduleSubName: {
          required: true,
          message: 'Please enter ModuleSubName'
        },
        startTimestamp: {
          required: true,
          message: 'Please enter StartTime'
        },
        endTimestamp: {
          required: true,
          message: 'Please enter EndTime'
        },
        imageUrl: {
          required: true,
          message: 'Please enter ImageUrl'
        },
        levelMax: {
          validator: function(rule, value, callback) {
            if (+value < +that.form.levelMin) {
              return callback(new Error('最大为100，并且不能小于MinLevel'))
            }
            callback()
          }
        },
        levelMin: {
          validator: function(rule, value, callback) {
            if (+value > +that.form.levelMax) {
              return callback(new Error('最小为1，并且不能大于MaxLevel'))
            }
            callback()
          }
        }
      }
    }
  },
  mixins: [generalMixin, uploadMixin],
  methods: {
    editAction(scope) {
      this._editAction(scope, () => {
        if (scope.row.imageUrl) {
          this.imageUrlList = [
            {
              name: scope.row.imageUrl,
              url: scope.row.imageUrl
            }
          ]
        }
      })
    },
    imageFileChange(file, fileList) {
      this.handleUpload(file, fileList, 'imageUrl', 'imageUrlList')
    },
    getTableList(pageNo) {
      this._getTableData(pageNo, dataList => {
        return dataList.map(item => {
          item.onlineStatus = this.onlineStatus2str(item.onlineStatus)
          if (item.startDate) {
            item.startTimestamp = new Date(item.startDate)
          }
          if (item.endDate) {
            item.endTimestamp = new Date(item.endDate)
          }
          return item
        })
      })
    },
    onlineAction(scope) {
      this._onlineAction(scope, () => {
        pushJson({
          module: 'xxxxxxx'
        }).then(() => console.log)
      })
    },
    onlineStatus2str(status) {
      if (typeof status !== 'number') {
        return
      }
      return status ? '已上线' : '未上线'
    },
    onlineStatus2bool(status) {
      return status === '已上线' ? true : false
    },
    closeDialogCb() {
      this.$refs['form'].resetFields()
      // this.form = this.$data.form
      this.imageUrlList = []
    }
  }
}
