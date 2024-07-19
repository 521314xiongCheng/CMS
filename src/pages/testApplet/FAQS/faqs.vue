<template>
  <div>
    <!-- head -->
    <div class="el-menu g-page-bar">
      <!-- <span class="page-title">FAQS</span> -->
      <el-form :inline="true">
        <el-form-item label="Keys">
          <el-input v-model="name" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="handleSearch"
            >Search</el-button
          >
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item>
          <el-button
            type="info"
            size="small"
            class="marginleft"
            @click="faqsView"
            >Upload FAQS</el-button
          >
        </el-form-item>
      </el-form>
      <el-button
        class="add-btn"
        icon="el-icon-plus"
        size="mini"
        @click="add"
      ></el-button>
    </div>
    <!-- table -->
    <div class="table-wrap">
      <table-list
        :tableData="tableData"
        :choosePageFn="choosePageFn"
        row-style="height:40px"
      >
        <el-table-column label="" align="center" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="editAction(scope)"
              >Edit</el-button
            >
            <el-button size="mini" type="danger" @click="deleteAction(scope)"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </table-list>
    </div>
    <!-- dialog -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form
        :model="form"
        ref="form"
        size="small"
        :rules="rules"
        :label-width="formLabelWidth"
        label-position="left"
      >
        <el-form-item label="Question" prop="question" required>
          <el-input
            type="text"
            :rows="1"
            v-model="form.question"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="Category">
          <el-tree
            :data="categoryList"
            show-checkbox
            node-key="id"
            accordion
            check-on-click-node
            :expand-on-click-node="false"
            ref="tree"
            @node-click="nodeClick"
            check-strictly
            highlight-current
            :props="defaultProps"
          >
          </el-tree>
        </el-form-item>
        <el-form-item label="Answer" prop="answer" required>
          <el-input
            type="textarea"
            :rows="10"
            v-model="form.answer"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <div class="text-center">
          <el-button @click="handleCancel" size="small">Cancel</el-button>
          <el-button type="primary" @click="submit" size="small"
            >Confirm</el-button
          >
        </div>
      </el-form>
    </el-dialog>
    <!-- faqs -->
    <el-dialog :visible.sync="faqsVisible">
      <div>
        <el-upload
          :show-file-list="false"
          :before-upload="faqsUpload"
          style="width:80px;top:10px;left: 0px;position: absolute;"
          action="#"
        >
          <el-button
            size="small"
            type="text"
            style="height:40px;margin-left:15px;font-size:14px"
            >上传 <i class="el-icon-upload2"
          /></el-button>
        </el-upload>
      </div>
      <div style="text-align:center;">{{ categoryName }}</div>
      <div
        v-if="!faqsList || faqsList.length == 0"
        style="height:180px;text-align:center;padding-top:180px;color:brown;"
      >
        请上传顾客问答题目！<br />
      </div>
      <div v-for="faqs in faqsList" :key="faqs.id" track-by="$index">
        <el-card class="box-card" style="margin-top:10px;">
          <div slot="header" class="clearfix">
            <div>{{ faqs.question }}</div>
            <div v-if="faqs.faqCategoryIds">
              <span>所属分类ID: </span>
              <span>{{ faqs.faqCategoryIds }}</span>
            </div>
          </div>
          <div class="text item">
            <div>{{ faqs.answer }}</div>
          </div>
        </el-card>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 公用表格列表组件 引入
import TableList from '@/components/tableList.vue'
import dialogForm from '@/mixins/dialogForm'
import { mergeObj } from '@/utility/index'

// api引入
import { get, create, del, edit } from '@/api/testApplet/FAQs/faq.js'
import { getList } from '@/api/testApplet/FAQs/category.js'
import {
  // getFromRedis,
  addToRedis,
  docToJson
} from '@/api/testApplet/questions.js'

import Vue from 'vue'
export default {
  components: {
    TableList
  },
  mixins: [dialogForm],
  data() {
    return {
      categoryList: [],
      faqsList: [],
      checkedId: null,
      faqsVisible: false,
      name: '',
      faqsId: '',
      categoryName: '',
      pageNo: 1,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      tableData: {
        header: [
          {
            tableId: 'id',
            tableName: 'Id',
            tableWidth: '50px'
          },
          {
            tableId: 'question',
            tableName: 'Question'
          },
          {
            tableId: 'answer',
            tableName: 'Answer',
            tableWidth: '480px'
          },
          {
            tableId: 'createdDate',
            tableName: 'Created Date'
          },
          {
            tableId: 'updatedDate',
            tableName: 'Updated Date'
          }
        ],
        data: [],
        pageData: {
          pageSize: 20,
          totalCount: 0
        }
      },
      dialogTitle: 'New Category',
      formLabelWidth: '150px',
      form: {
        question: '',
        answer: '',
        faqCategoryIds: ''
        // checkedCategory: []
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Please enter Category Name',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // add
    add() {
      this.dialogTitle = 'New FAQs'
      this.form.faqCategoryIds = ''
      this.showDialogForm()
      this.isEdit = false
      // this.form.checkedCategory = []

      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys([])
      }
    },
    // edit
    editAction(scope) {
      this.dialogTitle = 'Edit'
      this.isEdit = true
      this.showDialogForm()
      this.faqsId = scope.row.id
      const self = this
      this.$nextTick(() => {
        self.form = mergeObj(self.form, scope.row)
        let place
        let checkeds = []
        place = self.form.faqCategoryIds.split(',')
        place.forEach(item => {
          checkeds.push(+item)
        })
        this.$refs.tree.setCheckedKeys(checkeds)

        // self.form.checkedCategory = checkeds
        // console.log(self.form.checkedCategory, self.form.faqCategoryIds)
      })
    },
    // delete
    deleteAction(scope) {
      this.$confirm('Would you like to delete the item?', 'Tips', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        del({
          id: scope.row.id
        }).then(() => {
          // console.log(res)
          this.getTableList(this.pageNo)
        })
      })
    },
    // check(data, checked, node) {
    //   console.log('aaa')
    //   console.log(data, checked, node)

    // },
    nodeClick(data, node) {
      this.childNodesChange(node)
      this.parentNodesChange(node)
    },
    childNodesChange(node) {
      let len = node.childNodes.length
      for (let i = 0; i < len; i++) {
        node.childNodes[i].checked = false
        this.childNodesChange(node.childNodes[i])
      }
    },
    parentNodesChange(node) {
      if (node.parent) {
        for (let key in node) {
          if (key == 'parent') {
            node[key].checked = true
            this.parentNodesChange(node[key])
          }
        }
      }
    },
    faqsView() {
      this.faqsList = []
      this.faqsVisible = true
      // getFromRedis({ type: 'faqs' })
      //   .then(res => {
      //     let data = res.contents
      //     this.faqsList = data
      //   })
      //   .catch(() => {
      //     this.faqsList = []
      //   })
    },
    sortId(a, b) {
      return a.num - b.num
    },
    faqsUpload(file) {
      let isSupport = file.name.endsWith('.xlsx')
      if (!isSupport) {
        this.$message.error('仅支持以xlsx结尾的office文件')
        return false
      }
      this.isUpload = true
      docToJson({
        data: file,
        type: 'faqs'
      })
        .then(res => {
          res.sort(this.sortId)
          res.forEach(item => {
            let place = String(item.faqCategoryIds)
            if (place.indexOf('，') > -1) {
              place = place.replace(/，/g, ',')
            } else {
              place = place.replace(/ /g, ',')
            }
            item.faqCategoryIds = place
          })
          this.faqsList = res
          return addToRedis({
            type: 'faqs',
            contents: JSON.stringify(res)
          })
        })
        .then(result => {
          if (result.result) {
            new Vue().$notify({
              message: 'Upload Success',
              type: 'success',
              duration: 1000
            })
            this.getTableList(1)
          } else {
            new Vue().$notify({
              message: 'Upload Failed',
              type: 'error',
              duration: 1000
            })
            //this.$message.error("上传失败！");
          }
        })
        .catch(() => {
          new Vue().$notify({
            message: 'Upload Failed',
            type: 'error',
            duration: 1000
          })
        })
      return false
    },
    getTableList(pageNo) {
      this.pageNo = pageNo
      if (this.name) {
        get({
          name: this.name,
          pageSize: this.tableData.pageData.pageSize,
          pageNo
        }).then(res => {
          this.tableData.data = res.faqs
          this.tableData.pageData.totalCount = res.totalCount
        })
      } else {
        get({
          pageSize: this.tableData.pageData.pageSize,
          pageNo
        }).then(res => {
          this.tableData.data = res.faqs
          // this.faqsList = res.faqs
          this.tableData.pageData.totalCount = res.totalCount
        })
      }
    },
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // let place
          let checkedKey = this.$refs.tree.getCheckedKeys()
          this.form.faqCategoryIds = checkedKey.join(',')
          if (this.isEdit) {
            const params = {}
            params.id = this.faqsId
            params.data = this.form
            edit(params).then(() => {
              // console.log(res)
              this.handleCancel()
              this.getTableList(this.pageNo)
              this.$refs.tree.setCheckedKeys([])
            })
          } else {
            const params = this.form
            create(params).then(() => {
              // console.log(res)
              this.handleCancel()
              this.getTableList(1)
              this.$refs.tree.setCheckedKeys([])
            })
          }
        } else {
          return false
        }
      })
    },
    handleSearch() {
      this.getTableList(this.pageNo)
    }
  },
  mounted() {
    ;(this.name = ''), this.getTableList(1)
    getList().then(res => {
      this.categoryList = res.faqCategories
    })
  }
}
</script>
<style lang="less" scoped>
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  width: 133px;
  height: 100px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 133px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 133px;
  height: 100px;
  display: block;
}

.marginleft {
  margin-left: 60px;
}

/deep/.el-tree-node__label {
  position: relative;
}

/deep/.el-tree-node__label::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  display: block;
  top: 9px;
  left: -24px;
  z-index: 999;
}

.el-checkbox__inner {
  top: 0;
}
</style>
