<template>
  <div class="offline-activity">
    <div class="text-right">
      <el-button type="primary" size="mini" @click="addMore">
        选择更多文章
      </el-button>
      <el-button type="primary" size="mini" @click="changeSort"
        >更新排序</el-button
      >
    </div>
    <div class="table-wrap">
      <table-list
        :tableData="tableData"
        :isUseMixin="false"
        @handleCurrentChange="listHandleCurrentChange"
      >
        <el-table-column
          label="排序"
          slot="between"
          prop="sort"
          :width="100"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-input-number
              size="small"
              v-model="row.sort"
              style="width: 78px"
              :max="999"
              :min="0"
              controls-position="right"
              :controls="false"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="80">
          <template slot-scope="{ row }">
            <el-button size="mini" type="danger" @click="delAction(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </table-list>
    </div>
    <el-dialog
      title="选择文章"
      width="1000px"
      :visible.sync="articleDialog"
      @close="close"
    >
      <div class="text-right">
        <el-input
          style="width:200px;"
          clearable
          v-model="searchStr"
          @change="getArticleList(1)"
          size="mini"
        >
          <el-button
            icon="el-icon-search"
            slot="append"
            size="mini"
            @click="getArticleList(1)"
          ></el-button>
        </el-input>
      </div>
      <div class="table-wrap">
        <table-list
          :tableData="articleData"
          :isUseMixin="false"
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
        </table-list>
      </div>
      <div class="text-right">
        <el-button @click="handleCancel" size="mini">取消</el-button>
        <el-button type="primary" @click="submit" size="mini">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TableList from '@/components/tableList.vue'
import {
  getTopicContents,
  getLibraryContents,
  addTopicContent,
  sortTopicContents,
  delTopicContent
} from '@/api/library/topic.js'
import restfulMixin from '@/mixins/restful.js'
import { clones, formatDate } from '../../../utility'
export default {
  components: {
    TableList
  },
  mixins: [restfulMixin],
  data() {
    return {
      tableData: {
        header: [
          {
            tableId: 'id',
            tableWidth: '60',
            tableName: 'ID'
          },
          {
            tableId: 'title',
            minWidth: 200,
            tableName: '内容标题'
          },
          {
            tableId: 'updater',
            tableName: '操作人',
            tableWidth: 200,
            formatter: row => {
              return row.updatedBy ? row.updatedBy : row.createdBy
            }
          },
          {
            tableId: 'contentId',
            tableWidth: '80',
            tableName: '内容ID'
          },
          {
            tableId: 'updaterTime',
            tableName: '更新时间',
            tableWidth: '160',
            formatter: row => {
              return row.updatedDate
                ? formatDate(new Date(row.updatedDate))
                : formatDate(new Date(row.createdDate))
            }
          }
        ],
        data: [],
        pageData: {
          pageNo: 1,
          pageSize: 10,
          totalCount: 1
        }
      },
      articleData: {
        header: [
          {
            tableId: 'id',
            tableWidth: '60',
            tableName: 'ID'
          },
          {
            tableId: 'title',
            minWidth: 200,
            tableName: '内容标题'
          },
          {
            tableId: 'labelName',
            minWidth: 200,
            tableName: '标签',
            formatter: row => {
              let labels = row.labelNames.split(',')
              let arr = []
              labels.forEach(o => {
                if (o) {
                  arr.push(o)
                }
              })
              return arr.join(',')
            }
          },
          {
            tableId: 'updaterTime',
            tableName: '操作时间',
            tableWidth: '160',
            formatter: row => {
              return row.updatedDate
                ? formatDate(new Date(row.updatedDate))
                : formatDate(new Date(row.createdDate))
            }
          }
        ],
        data: [],
        pageData: {
          pageNo: 1,
          pageSize: 10,
          totalCount: 1
        }
      },
      articleDialog: false,
      searchStr: '',
      originalData: [],
      filters: {
        searchName: '',
        pageSize: 10,
        pageNo: 1
      },
      selection: []
    }
  },
  created() {
    this.getList(1)
  },
  methods: {
    getList(pageNo) {
      if (pageNo) {
        this.articleData.pageData.pageNo
      }
      let filters = {
        pageNo: this.tableData.pageData.pageNo,
        pageSize: this.tableData.pageData.pageSize,
        searchStr: this.searchStr
      }
      getTopicContents(this.$route.query.id, filters).then(res => {
        this.tableData.data = res.contents
        this.tableData.pageData.totalCount = res.totalCount
        this.originalData = clones(this.tableData.data)
      })
    },
    getArticleList(pageNo) {
      if (pageNo) {
        this.articleData.pageData.pageNo
      }
      let filters = {
        pageNo: this.articleData.pageData.pageNo,
        pageSize: this.articleData.pageData.pageSize,
        searchStr: this.searchStr
      }
      getLibraryContents(this.$route.query.id, filters).then(res => {
        this.articleData.data = res.contents
        this.articleData.pageData.totalCount = res.totalCount
          ? res.totalCount
          : res.contents.length
        this.originalData = clones(this.articleData.data)
      })
    },
    handleCancel() {
      this.selection = []
      this.searchStr = ''
      this.articleDialog = false
    },
    close() {
      this.selection = []
      this.searchStr = ''
      this.articleDialog = false
    },
    submit() {
      console.log(this.selection)
      if (!this.selection || !this.selection.length) {
        this.$notify.error({
          title: 'Error',
          message: `请选择文章`,
          duration: 3000
        })
        return
      }
      let data = { contents: this.selection.map(o => ({ contentId: o.id })) }
      addTopicContent(this.$route.query.id, data).then(res => {
        console.log(res)
        this.articleDialog = false
        this.getList(1)
      })
    },
    addMore() {
      this.articleData.pageData.pageNo = 1
      this.getArticleList()
      this.articleDialog = true
    },
    handleCurrentChange(n) {
      this.articleData.pageData.pageNo = n
      this.getArticleList()
    },
    listHandleCurrentChange(n) {
      this.tableData.pageData.pageNo = n
      this.getList()
    },
    selectionChange(selection) {
      this.selection = selection
    },
    changeSort() {
      let data = []
      this.tableData.data.forEach((o, idx) => {
        if (
          o.id === this.originalData[idx].id &&
          o.sort !== this.originalData[idx].sort
        ) {
          data.push(o)
        }
      })
      data = data.map(o => ({
        id: Number(o.id),
        sort: Number(o.sort)
      }))
      if (!data.length) return
      sortTopicContents(this.$route.query.id, { sorts: data }).then(res => {
        console.log(res)
        this.getList()
      })
    },
    delAction(row) {
      this.$confirm(`请问是否确认要删除当前活动内容?`, 'Tips', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delTopicContent(row.id).then(res => {
            console.log(res)
            this.getList()
          })
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="less" scoped>
.block-input {
  width: 600px;
}

.input-img-url {
  position: absolute;
  left: 90px;
  width: 510px !important;
}
.draggable-div {
  width: 600px;
  .file-list {
    display: flex;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    align-items: center;
    position: relative;
    margin-bottom: 10px;
    .file-item {
      margin-right: 20px;
    }
    .file-name {
      width: 450px;
      &:hover {
        color: #409eff;
      }
    }
    .del-item {
      position: absolute;
      right: 5px;
      top: 5px;
      cursor: pointer;
    }
  }
}
.img-wrap {
  position: relative;
  .item-img {
    display: block;
  }
  .box-mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    color: #fff;
    justify-content: center;
    display: none;
    i {
      width: 50%;
      text-align: center;
      cursor: pointer;
    }
  }
}

.video_cover_url {
  height: 70px;
}
.img-wrap:hover {
  .box-mask {
    display: flex;
  }
}
.preview-img {
  width: 70px;
  height: 70px;
}
#tinymceTextarea {
  width: 500px;
}
/deep/.preview-dialog {
  background-color: #f5f4f5;
  width: 400px !important;
  .el-drawer__body {
    overflow-y: auto;
    .preview-detail {
      padding: 24px/2;
      margin: 0 auto;
      width: 702px/2;
      box-sizing: content-box;
      background-color: #fff;
      .title {
        height: 44px/2;
        font-size: 44px/2;
        font-weight: 500;
        color: rgba(48, 49, 51, 1);
        line-height: 44px/2;
        margin-bottom: 25px/2;
      }
      .subtitle {
        display: flex;
        justify-content: space-between;
        height: 24px/2;
        font-size: 24px/2;
        font-weight: 500;
        color: rgba(144, 147, 153, 1);
        line-height: 24px/2;
        margin-bottom: 50px/2;
      }
      .introduce {
        display: flex;
        align-items: center;
        height: 32px/2;
        font-size: 32px/2;
        font-weight: 500;
        color: rgba(48, 49, 51, 1);
        line-height: 32px/2;
        margin-bottom: 26px/2;
        .introduce-icon {
          width: 32px/2;
          height: 36px/2;
          margin-right: 13px/2;
        }
      }
      .content {
        font-size: 32px/2;
        font-weight: 500;
        color: rgba(96, 98, 102, 1);
        line-height: 48px/2;
        img {
          max-width: 100%;
          height: auto;
        }
      }
      .resource-list {
        margin-top: 50px/2;
        .list-item {
          background: rgba(249, 249, 251, 1);
          border-radius: 14px/2;
          padding: 40px/2 30px/2 40px/2 12px/2;
          .list-item-div {
            display: flex;
            align-items: flex-start;
            font-size: 32px/2;
            font-weight: 500;
            color: rgba(48, 49, 51, 1);
            line-height: 46px/2;
            margin-bottom: 30px/2;
            img {
              width: 92px/2;
              height: 92px/2;
            }
          }
          .item-btn-div {
            display: flex;
            justify-content: flex-end;
            font-size: 24px/2;
            font-weight: 500;
            color: rgba(242, 104, 153, 1);
            line-height: 60px/2;
            .item-btn {
              width: 120px/2;
              text-align: center;
              height: 60px/2;
              border-radius: 10px/2;
              border: 2px/2 solid rgba(242, 104, 153, 1);
              background-color: #fff;
              margin-left: 20px/2;
            }
            .copy {
              width: 180px/2;
              height: 60px/2;
              background: rgba(242, 104, 153, 1);
              box-shadow: 0px 4px/2 12px/2 0px rgba(255, 134, 134, 0.3);
              border-radius: 10px/2;
              color: #fff;
            }
          }
        }
      }
      .forword {
        width: 630px/2;
        height: 90px/2;
        margin: 50px/2 0 20px/2 30px/2;
        background: rgba(242, 104, 153, 1);
        box-shadow: 0px 4px/2 12px/2 0px rgba(255, 134, 134, 0.3);
        border-radius: 10px/2;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px/2;
        color: #fff;
        .icon {
          width: 32px/2;
          height: 32px/2;
          margin-right: 20px/2;
        }
      }
    }
  }
}
.g-upload {
  max-width: 600px;
}
</style>
