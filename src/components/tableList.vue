<template>
  <div>
    <el-table
      :data="tableData.data"
      :stripe="true"
      v-loading="loadingFlag"
      :element-loading-text="loadingText"
      highlight-current-row
      @current-change="handleTableCurrentChange"
      @selection-change="handleSelectionChange"
      @cell-click="cellClick"
      :cell-class-name="setClassName"
      border
      style="width:100%"
    >
      <slot name="between"></slot>
      <el-table-column
        v-for="item in tableData.header"
        :key="item.tableId"
        :prop="item.tableId"
        :label="item.tableName"
        :width="item.tableWidth"
        :min-width="item.minWidth"
        :max-width="item.maxWidth"
        :show-overflow-tooltip="item.showOverflowTooltip"
        align="center"
      >
        <template slot-scope="scope">
          <img
            @click="openImgPreview(scope.row[item.tableId])"
            v-if="isImg(scope.row[item.tableId]) && item.type !== 'text'"
            :src="scope.row[item.tableId]"
            style="width: 50px;"
            alt
          />
          <el-input
            v-else-if="item.type === 'input'"
            v-model="scope.row[item.tableId]"
            size="mini"
          />
          <span v-else>{{
            item.formatter
              ? item.formatter(scope.row, scope.$index)
              : scope.row[item.tableId]
          }}</span>
        </template>
      </el-table-column>
      <slot></slot>
    </el-table>

    <img-preview
      :src="imgPreviewSrc"
      v-show="showImgPreview"
      @close="showImgPreview = false"
    ></img-preview>

    <!-- 分页 -->
    <div class="block page-box" v-if="tableData.pageData">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="tableData.pageData ? tableData.pageData.pageSize : 0"
        layout="total, prev, pager, next, jumper"
        :total="tableData.pageData ? tableData.pageData.totalCount : 0"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import ImgPreview from '@/components/imgPreview.vue'

export default {
  name: 'table-list',
  props: {
    tableData: {
      type: Object,
      default() {
        return {}
      }
    },
    currentPage: {
      type: Number,
      default: 1
    },
    choosePageFn: Function,
    isUseMixin: {
      type: Boolean,
      default: true
    },
    handleSelectionChange: {
      type: Function,
      default() {
        ;() => {}
      }
    },
    setClassName: Function
  },
  data() {
    return {
      loadingFlag: false,
      loadingText: '拼命加载中',
      imgPreviewSrc: '',
      showImgPreview: false
    }
  },
  methods: {
    handleCurrentChange(pageNo) {
      // 由于接口差异，有些地方不适用mixin去处理分页
      if (this.isUseMixin) {
        this.choosePageFn(pageNo)
      }
      this.$emit('handleCurrentChange', pageNo)
    },
    cellClick(row, column, cell, event) {
      this.$emit('cellClick', row, column, cell, event)
    },
    handleTableCurrentChange(row) {
      this.$emit('handleTableCurrentChange', row)
    },
    openImgPreview(imgSrc) {
      this.imgPreviewSrc = imgSrc
      this.showImgPreview = true
    },
    isImg(val) {
      if (typeof val !== 'string') {
        return false
      }
      return (
        val.toLowerCase().indexOf('.jpeg') > -1 ||
        val.toLowerCase().indexOf('.png') > -1 ||
        val.toLowerCase().indexOf('.jpg') > -1 ||
        val.toLowerCase().indexOf('.gif') > -1
      )
    }
  },
  components: { ImgPreview }
}
</script>
<style lang="less" scoped>
.page-box {
  margin: 30px 0;
  text-align: right;
}
/deep/ .el-table thead {
  color: #333;
  font-size: 15px;
}
// 首席区域换行
.cell span {
  white-space: pre-line;
}
</style>
