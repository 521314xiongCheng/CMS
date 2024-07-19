/**
 *  Mixins dialog
 *  @function showDialog 显示dailog
 *  @function hideDialog 隐藏dailog
 *  @function setDialogTitle 设置title
 *
 */
/**
 *  Usage
 *
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
    >
    </el-dialog>
 *
 */
export default {
  data() {
    return {
      dialogTitle: '',
      dialogVisible: false
    }
  },
  methods: {
    setDialogTitle(title) {
      this.dialogTitle = title
    },
    showDialog() {
      this.dialogVisible = true
    },
    hideDialog() {
      this.dialogVisible = false
    }
  }
}
