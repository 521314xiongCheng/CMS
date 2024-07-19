import { arrayMove, copyObj, sortByKey } from '../utility/index'
import upload from '../utility/upload'

export default {
  data() {
    return {
      dialogFormVisible: false,
      pageNo: 1,
      isEdit: false,
      langs: [],
      langProps: {},
      languageRules: {},
      tableDataHeaderCopy: [],
      iconUrls: [
        {
          value:
            'https://appdl.xxxxxxx.com.cn/eshowcase/image/eshowcase_cms_icon_1.png'
        },
        {
          value:
            'https://appdl.xxxxxxx.com.cn/eshowcase/image/eshowcase_cms_icon_2.png'
        },
        {
          value:
            'https://appdl.xxxxxxx.com.cn/eshowcase/image/eshowcase_cms_icon_3.png'
        },
        {
          value:
            'https://appdl.xxxxxxx.com.cn/eshowcase/image/eshowcase_cms_icon_4.png'
        },
        {
          value:
            'https://appdl.xxxxxxx.com.cn/eshowcase/image/eshowcase_cms_icon_5.png'
        },
        {
          value:
            'https://appdl.xxxxxxx.com.cn/eshowcase/image/eshowcase_cms_icon_6.png'
        }
      ]
    }
  },
  methods: {
    handleCancel() {
      this.dialogFormVisible = false
      this.testVisible = false
    },
    showDialogForm() {
      this.dialogFormVisible = true
    },
    resetForm(formName) {
      if (!this.$refs[formName]) return
      this.$refs[formName].resetFields()
    },
    choosePageFn(pageNo) {
      this.getTableList(pageNo)
    },
    checkImageSize(file) {
      if (file.raw.type.indexOf('image') > -1 && file.size / 1024 > 500) {
        this.$notify.error({
          title: 'Error',
          message:
            'Please upload JPG, PNG, JPEG format pictures, size limit of less than 500KB',
          duration: 1000
        })
        return false
      }
      return true
    },
    handleUpload(file, fileList, fileUrl, fileArray, callback) {
      this.form[fileUrl] = ''
      if (!file) {
        this[fileArray] = []
        return
      }
      if (!this.checkImageSize(file)) return
      this[fileArray] = fileList
      upload(file.raw)
        .then(url => {
          this.form[fileUrl] = url
          if (typeof callback === 'function') {
            callback(url)
          }
        })
        .catch(() => {
          this[fileArray] = []
          this.form[fileUrl] = ''
        })
    },
    updateTableData(data, names, prefix, index = 1) {
      if (!data || data.length === 0) return (this.tableData.data = [])
      if (this.tableDataHeaderCopy.length > 0) {
        this.tableData.header = copyObj(this.tableDataHeaderCopy)
      }
      this.tableDataHeaderCopy = copyObj(this.tableData.header)
      const update = (names, prefix) => {
        let ret = []
        let header = this.tableData.header
        this.langs.forEach(item => {
          header.unshift({
            tableName: prefix + ' ' + item.language,
            tableId: prefix + '_' + item.language
          })
        })
        this.tableData.header = arrayMove(header, 0, index)
        data.forEach(item => {
          if (item[names]) {
            item[names].forEach(value => {
              item[prefix + '_' + value.language] = value.name
            })
          } else {
            this.langs.forEach(value => {
              item[prefix + '_' + value.language] = ''
            })
          }
          ret.push(item)
        })
        this.tableData.data = sortByKey(ret, 'sequence')
      }
      names.forEach((name, index) => {
        update(name, prefix[index])
      })
    }
  },
  watch: {
    dialogFormVisible(v) {
      if (v) return
      this.resetForm('languageForm')
      this.resetForm('form')
    }
  }
}
