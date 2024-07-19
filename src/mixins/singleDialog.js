export default {
  data() {
    return {
      dialogTitle: '',
      dialogFormVisible: false
    }
  },
  methods: {
    handleCancel() {
      this.dialogFormVisible = false
    },
    showDialogForm() {
      this.dialogFormVisible = true
    },
    choosePageFn(pageNo) {
      this.getTableList(pageNo)
    }
  }
}
