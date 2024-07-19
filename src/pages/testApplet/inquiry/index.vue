<template>
  <div>
    <div class="el-menu g-page-bar">
      <!-- <span class="page-title">专家在线问题</span> -->
      <el-input
        size="small"
        style="width:280px;margin-right:10px;"
        placeholder="Search"
        v-model="title"
        clearable
      >
        <el-button
          slot="append"
          @click="queryData"
          icon="el-icon-search"
        ></el-button>
      </el-input>
      <el-button
        @click="addInquiry"
        size="small"
        type="primary"
        class="marginleft"
        >新增</el-button
      >
    </div>
    <el-table :data="tableData.data" border style="width: 100%">
      <el-table-column label="发布" align="center" width="90" fixed="left">
        <template slot-scope="scope">
          <!--          0 未发布 1 已发布-->
          <el-button
            size="mini"
            v-if="scope.row.status"
            @click="publish(scope.row)"
            type="danger"
          >
            取消发布
          </el-button>
          <el-button
            v-else
            @click="publish(scope.row)"
            size="mini"
            type="primary"
          >
            发布
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="分类标题"
        align="center"
      ></el-table-column>
      <el-table-column prop="posterUrl" label="封面" align="center">
        <template slot-scope="scope">
          <img
            :src="scope.row.posterUrl"
            @click="openImgPreview(scope.row.posterUrl)"
            style="width: 50px"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="开始时间"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="endTime"
        label="结束时间"
        align="center"
      ></el-table-column>

      <el-table-column
        prop="createTime"
        label="更新时间"
        align="center"
      ></el-table-column>

      <el-table-column label="操作" align="center" width="300" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="editAction(scope.row)" type="primary">
            Edit
          </el-button>
          <el-button size="mini" @click="addQuestion(scope.row)" type="success">
            questions
          </el-button>
          <el-button
            size="mini"
            @click="exportInquiry(scope.row)"
            type="warning"
          >
            Export
          </el-button>
          <el-button
            v-if="scope.row.status == 0"
            size="mini"
            type="danger"
            @click="deleteAction(scope.row)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-box">
      <el-pagination
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="tableData.totalCount"
      ></el-pagination>
    </div>
    <el-dialog title="add question" :visible.sync="questionVisible">
      <div style="margin-left: 120px;" v-if="questionList.length">
        <div class="question-title">预设问题列表</div>
        <div
          class="item"
          v-for="(item, index) in questionList"
          :style="index == 0 ? 'border-top:1px solid #ccc;' : ''"
          :key="index"
          :data-item="item"
        >
          {{ item.question }}
          <!--          <div class="flex1"> </div>-->
          <i
            @click="delQuestion(item)"
            class="el-dialog__close el-icon el-icon-close close-btn"
          ></i>
        </div>
      </div>
      <el-form
        style="width: 50%;margin-top: 30px"
        ref="form"
        :rules="ruleForm"
        :model="form"
        label-width="120px"
      >
        <el-form-item label=""> </el-form-item>

        <el-form-item label="预设问题描述" prop="question">
          <el-input
            type="textarea"
            :rows="4"
            v-model="form.question"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">提交</el-button>
          <el-button @click="questionVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <img-preview
      :src="imgPreviewSrc"
      v-show="showImgPreview"
      @close="showImgPreview = false"
    ></img-preview>
  </div>
</template>

<script>
// 公用表格列表组件 引入
import ImgPreview from '@/components/imgPreview.vue'
// import ImgPreview from '@/components/imgPreview.vue'

// api引入
import {
  getList,
  delInquiry,
  publishInquiry,
  unPublishInquiry,
  exportInquiry,
  addQuestion,
  delQuestion,
  getQuestions
} from '@/api/testApplet/inquiry/index.js'

// import Vue from 'vue'
export default {
  name: 'testApplet-inquiry-index',
  components: { ImgPreview },
  // mixins: [dialogForm,],
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      title: '',
      tableData: {
        header: [],
        totalCount: 0,
        // pageData: {
        //   pageSize: 3,
        //   page_num: 1,
        //   totalCount: 0
        // },
        data: []
      },
      questionVisible: false,
      form: {
        onlineDiagnoseId: '',
        question: ''
      },
      ruleForm: {
        // url: [{ required: true, message: '请选择资源', trigger: 'change' }],
        question: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      questionList: [],
      showImgPreview: false,
      imgPreviewSrc: ''
    }
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    openImgPreview(imgSrc) {
      this.imgPreviewSrc = imgSrc
      this.showImgPreview = true
    },
    getTableList() {
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        title: this.title
      }
      console.log(params)
      getList(params).then(res => {
        console.log(res)
        this.tableData.data = res.list
        this.tableData.page_num = res.pageNo
        this.tableData.pageSize = res.pageSize
        this.tableData.totalCount = res.totalCount
      })
    },
    queryData() {
      this.pageNo = 1
      this.getTableList()
    },
    addInquiry() {
      this.$router.push({ name: 'testApplet-inquiry-edit' })
    },
    editAction(row) {
      console.log(row)
      sessionStorage.setItem('editRow', JSON.stringify(row))
      this.$router.push({
        name: 'testApplet-inquiry-edit',
        query: { id: row.id }
      })
    },
    publish(row) {
      if (row.status) {
        unPublishInquiry(row.id).then(res => {
          console.log(res)
          this.getTableList()
        })
      } else {
        publishInquiry(row.id).then(res => {
          console.log(res)
          this.getTableList()
        })
      }
    },
    deleteAction(row) {
      console.log(row)
      //该文章已被引用至小程序，若删除，小程序上将看不到此文章，需珍重操作！请确认是否需要删除？
      if (!row.status) {
        //false 未发布
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delInquiry(row.id).then(res => {
            console.log(res)
            this.getTableList()
          })
        })
      }
      // else {
      //   this.$confirm(
      //     '该问卷已被引用至小程序，若删除，小程序上将看不到此问卷，需珍重操作！请确认是否需要删除?',
      //     '提示',
      //     {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     }
      //   ).then(() => {
      //     delInquiry(row.id).then(res => {
      //       console.log(res)
      //       this.getTableList()
      //     })
      //   })
      // }
    },
    exportInquiry(row) {
      console.log(row)
      // window.open
      exportInquiry(row.id).then(res => {
        console.log(res)
        let url = window.URL.createObjectURL(new Blob([res]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', row.title + '统计.xlsx') // 自定义下载文件名（如exemple.txt）
        document.body.appendChild(link)
        link.click()
      })
    },
    addQuestion(row) {
      console.log(row)
      // this.questionList = row.questions
      this.form.onlineDiagnoseId = row.id
      this.getQuestionList(this.form.onlineDiagnoseId)
      this.questionVisible = true
    },
    delQuestion(item) {
      console.log(item)
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //item.diagnoseQuestionId
        delQuestion(item.id).then(res => {
          console.log(res)
          console.log(this.form)
          this.getQuestionList(this.form.onlineDiagnoseId)
        })
      })
    },
    getQuestionList(onlineDiagnoseId) {
      console.log('onlineId:', onlineDiagnoseId)
      getQuestions(onlineDiagnoseId).then(res => {
        console.log(res)
        this.questionList = res.result
      })
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageNo = val
      this.getTableList()
    },

    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.form)
          addQuestion(this.form).then(res => {
            console.log(res)
            this.getQuestionList(this.form.onlineDiagnoseId)
            this.form.question = ''
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.question-title {
  color: #333;
  font-size: 16px;
  margin-bottom: 15px;
}
.flex1 {
  flex: 1;
}
.item {
  display: flex;
  padding: 10px 0;
  font-size: 15px;
  color: #111;
  border-bottom: 1px solid #ccc;
  width: 50%;
  align-items: center;
}
.item:first-child {
  border-top: 1px solid #ccc;
}

.close-btn {
  cursor: pointer;
  font-size: 20px;
  justify-content: center;
  margin-left: 20px;
}
.page-box {
  margin: 30px 0;
  text-align: right;
}
</style>
