<template>
  <div>
    <!-- head -->
    <div class="el-menu g-page-bar">
      <!-- <span class="page-title">Test</span> -->
      <el-form :inline="true">
        <el-form-item label="Test Name">
          <el-input v-model="name" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="handleSearch"
            >Search</el-button
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
      <table-list :tableData="tableData" :choosePageFn="choosePageFn">
        <el-table-column label="Gender" align="center" width="80">
          <template slot-scope="scope">
            {{
              scope.row.gender === 0
                ? '女'
                : scope.row.gender === 1
                ? '男'
                : '男女'
            }}
          </template>
        </el-table-column>
        <el-table-column label="" align="center" width="220">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="editAction(scope)"
              >Edit</el-button
            >
            <!-- <el-button size="small" @click="handleStatus(scope)">{{ scope.row.onlineStatus ? 'Hide' : 'Show' }}</el-button>             -->
            <el-button size="mini" type="danger" @click="deleteAction(scope)"
              >Delete</el-button
            >
            <el-button size="mini" type="info" @click="testView(scope)"
              >question</el-button
            >
          </template>
        </el-table-column>
      </table-list>
    </div>
    <!-- dialog -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      size="small"
    >
      <el-form
        :model="form"
        ref="form"
        size="small"
        :rules="rules"
        :label-width="formLabelWidth"
        label-position="left"
      >
        <el-form-item label="Test Name" prop="name">
          <el-input
            type="text"
            v-model="form.name"
            auto-complete="off"
            placeholder="Test Name"
          ></el-input>
        </el-form-item>
        <el-form-item label="Begin Age" prop="beginAge">
          <el-input
            type="number"
            :min="1"
            v-model.number="form.beginAge"
            auto-complete="off"
            placeholder="only number"
          ></el-input>
        </el-form-item>
        <el-form-item label="End Age" prop="endAge">
          <el-input
            type="number"
            :min="1"
            v-model.number="form.endAge"
            auto-complete="off"
            placeholder="only number"
          ></el-input>
        </el-form-item>
        <el-form-item label="Gender" prop="gender" :required="required">
          <el-radio class="radio" v-model="form.gender" :label="0">女</el-radio>
          <el-radio class="radio" v-model="form.gender" :label="1">男</el-radio>
          <el-radio class="radio" v-model="form.gender" :label="2"
            >男女</el-radio
          >
        </el-form-item>
        <el-form-item label="Sorting" prop="sort">
          <el-input
            type="number"
            v-model.number="form.sort"
            auto-complete="off"
            placeholder="only number"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="Full Score" prop="fullScore">
          <el-input
            type="text"
            v-model.number="form.fullScore"
            auto-complete="off"
            placeholder="only number"
          ></el-input>
        </el-form-item> -->
        <div class="text-center">
          <el-button @click="handleCancel" :disabled="isUpload" size="small"
            >Cancel</el-button
          >
          <el-button
            type="primary"
            @click="submit"
            :disabled="isUpload"
            size="small"
            >Confirm</el-button
          >
        </div>
      </el-form>
    </el-dialog>
    <!-- test -->
    <el-dialog :visible.sync="testVisible" size="small">
      <div>
        <el-upload
          :show-file-list="false"
          :before-upload="TestUpload"
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
      <div style="text-align:center;">{{ testName }}</div>
      <div
        v-if="!testList || testList.length == 0"
        style="height:180px;text-align:center;padding-top:180px;color:brown;"
      >
        请上传测试题目！<br />重新上传会覆盖原有题目
      </div>
      <el-tabs
        v-model="activeTestPreviewTab"
        type="border-card"
        v-if="testList"
      >
        <el-tab-pane label="试题模板" name="questions">
          <el-card
            class="box-card"
            style="margin-top:10px;"
            v-for="(question, i) in testList.questions"
            :key="i"
          >
            <div slot="header" class="clearfix">
              <div>{{ question.num + '. ' + question.title }}</div>
            </div>
            <p v-for="(option, index) in question.options" :key="index">
              {{ index + 1 }}、{{ option.option }}
            </p>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="风险因素解读" name="risks">
          <el-card
            class="box-card"
            style="margin-top:10px;"
            v-for="(risk, i) in testList.risks"
            :key="i"
          >
            <div slot="header" class="clearfix">
              <div>
                {{
                  risk.num +
                    '. ' +
                    risk.title +
                    ' （' +
                    healthIndexs[risk.healthIndex] +
                    '）'
                }}
              </div>
            </div>
            <p v-if="risk.weight">
              {{ healthType['weight'] }}：{{ risk.weight }}
            </p>
            <p v-if="risk.immunity">
              {{ healthType['immunity'] }}：{{ risk.immunity }}
            </p>
            <p v-if="risk.antioxidant">
              {{ healthType['antioxidant'] }}：{{ risk.antioxidant }}
            </p>
            <p v-if="risk.skeleton">
              {{ healthType['skeleton'] }}：{{ risk.skeleton }}
            </p>
            <p v-if="risk.intestine">
              {{ healthType['intestine'] }}：{{ risk.intestine }}
            </p>
            <p v-if="risk.skin">{{ healthType['skin'] }}：{{ risk.skin }}</p>
            <p v-if="risk.eyesight">
              {{ healthType['eyesight'] }}：{{ risk.eyesight }}
            </p>
            <p v-if="risk.angiocarpy">
              {{ healthType['angiocarpy'] }}：{{ risk.angiocarpy }}
            </p>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="健康力总分值" name="scores" v-if="testList.scores">
          <el-card
            class="box-card"
            style="margin-top:10px;"
            v-for="(score, i) in testList.scores[0]"
            :key="i"
          >
            <div slot="header" class="clearfix">
              <div>{{ healthType[i] }}</div>
            </div>
            <p>题目数：{{ score.examNum }}</p>
            <p>题目：{{ score.exams }}</p>
            <p>总分值：{{ score.score }}</p>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="改善建议" name="improves">
          <el-card
            class="box-card"
            style="margin-top:10px;"
            v-for="(improve, i) in testList.improves"
            :key="i"
          >
            <div slot="header" class="clearfix">
              <div>{{ improve.title }}</div>
            </div>
            <p v-if="improve.weight">
              {{ healthType['weight'] }}：{{ improve.weight }}
            </p>
            <p v-if="improve.immunity">
              {{ healthType['immunity'] }}：{{ improve.immunity }}
            </p>
            <p v-if="improve.antioxidant">
              {{ healthType['antioxidant'] }}：{{ improve.antioxidant }}
            </p>
            <p v-if="improve.skeleton">
              {{ healthType['skeleton'] }}：{{ improve.skeleton }}
            </p>
            <p v-if="improve.intestine">
              {{ healthType['intestine'] }}：{{ improve.intestine }}
            </p>
            <p v-if="improve.skin">
              {{ healthType['skin'] }}：{{ improve.skin }}
            </p>
            <p v-if="improve.eyesight">
              {{ healthType['eyesight'] }}：{{ improve.eyesight }}
            </p>
            <p v-if="improve.angiocarpy">
              {{ healthType['angiocarpy'] }}：{{ improve.angiocarpy }}
            </p>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="邀约" name="invitationQuestions">
          <el-card
            class="box-card"
            style="margin-top:10px;"
            v-for="invitationQuestion in testList.invitationQuestions"
            :key="invitationQuestion.num"
          >
            <div slot="header" class="clearfix">
              <div>
                {{ invitationQuestion.title }}（{{
                  invitationQuestion.choice === 1 ? '单选' : '多选'
                }}）
              </div>
            </div>
            <div
              v-for="(option, index) in invitationQuestion.options"
              :key="index"
            >
              <p v-if="option.subTitle">{{ option.subTitle }}</p>
              <p v-for="(subOption, i) in option.subOptions" :key="i">
                {{ subOption.option }}
              </p>
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
      <!-- <div v-for="test in testList" :key="test.num" track-by="$index">
        <el-card class="box-card" style="margin-top:10px;">
          <div slot="header" class="clearfix">
            <div>{{ test.num + '. ' + test.title }}</div>
          </div>
          <div class="text item">
            <div>
              <div>{{ '选择“是”扣除分数: ' + test.score }}</div>
              <br />
            </div>
            <div v-if="test.risk">{{ '选择“是”对应风险因素:' }}</div>
            <div>{{ test.risk }}</div>
            <br />
            <div v-if="test.riskDetails">{{ '风险因素解读: ' }}</div>
            <div>{{ test.riskDetails }}</div>
            <br />
            <div v-if="test.references && test.references != ''">
              <div>{{ '相关参考文献: ' }}</div>
              <div>{{ test.references }}</div>
            </div>
          </div>
        </el-card>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import TableList from '@/components/tableList.vue'
import dialogForm from '@/mixins/dialogForm'
import { mergeObj } from '@/utility/index'
import { get, create, del, edit } from '@/api/testApplet/test.js'
import {
  getFromRedis,
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
      required: '',
      testId: '',
      testVersion: '',
      testName: '',
      testVisible: false,
      minAge: 0,
      maxAge: 0,
      relationName: '',
      examCategoryId: '',
      categoryType: '',
      name: '',
      isUpload: false,
      testUrl: '',
      testList: [],
      categoryList: [],
      tableData: {
        header: [
          {
            tableId: 'id',
            tableName: 'Id',
            tableWidth: '50px'
          },
          {
            tableId: 'name',
            tableName: 'Test Name'
          },
          {
            tableId: 'examCategoryName',
            tableName: 'Category Name'
          },
          {
            tableId: 'beginAge',
            tableName: 'Begin Age',
            tableWidth: '80px'
          },
          {
            tableId: 'endAge',
            tableName: 'End Age',
            tableWidth: '80px'
          },
          {
            tableId: 'updatedDate',
            tableName: 'Update Time'
          },
          {
            tableId: 'sort',
            tableName: 'Sorting'
          }
        ],
        data: [],
        pageData: {
          pageSize: 20,
          totalCount: 0
        }
      },
      dialogTitle: 'New Test',
      formLabelWidth: '150px',
      form: {
        examCategoryId: '',
        name: '',
        beginAge: null,
        endAge: null,
        gender: 0,
        sort: null
        // fullScore: null
      },
      rules: {
        name: [
          {
            message: 'Please enter Test Name',
            trigger: 'blur'
          }
        ]
      },
      activeTestPreviewTab: 'questions',
      healthIndexs: {
        1: '年龄',
        2: '体重',
        3: '睡眠',
        4: '肠道',
        5: '皮肤毛发',
        6: '饮食',
        7: '久坐',
        8: '视力',
        9: '感冒指数',
        10: '抽烟喝酒'
      },
      healthType: {
        weight: '体重管理力',
        immunity: '免疫力',
        antioxidant: '抗氧力',
        skeleton: '骨骼力',
        intestine: '肠道力',
        skin: '皮肤力',
        eyesight: '视力',
        angiocarpy: '心血管力'
      }
    }
  },
  methods: {
    // add
    add() {
      this.dialogTitle = 'New Test'
      this.showDialogForm()
      this.isEdit = false
      if (this.categoryType == 1) {
        this.required = true
      }
      if (this.categoryType == 2) {
        this.required = false
      }
    },
    // edit
    editAction(scope) {
      this.dialogTitle = 'Edit'
      this.isEdit = true
      this.showDialogForm()
      this.form.examCategoryId = scope.row.examCategoryId
      this.testId = scope.row.id
      const self = this
      if (this.categoryType == 1) {
        this.required = true
      } else {
        this.required = false
      }
      this.$nextTick(() => {
        self.form = mergeObj(self.form, scope.row)
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
          this.getTableList(this.pageNo)
        })
      })
    },
    testView(scope) {
      this.testList = []
      this.testVisible = true
      this.testId = scope.row.id
      this.testName = scope.row.name
      getFromRedis({
        templateId: this.testId,
        type: 'template'
      })
        .then(res => {
          let data = res.contents
          this.testList = data
        })
        .catch(() => {
          this.testList = []
        })
    },
    getTableList(pageNo) {
      this.pageNo = pageNo
      if (this.name) {
        get({
          name: this.name,
          examCategoryId: this.examCategoryId,
          pageSize: this.tableData.pageData.pageSize,
          pageNo
        }).then(res => {
          this.tableData.data = res.exams
          this.tableData.pageData.totalCount = res.totalCount
        })
      } else {
        get({
          examCategoryId: this.examCategoryId,
          pageSize: this.tableData.pageData.pageSize,
          pageNo
        }).then(res => {
          this.tableData.data = res.exams
          this.tableData.pageData.totalCount = res.totalCount
        })
      }
    },
    sortId(a, b) {
      return a.num - b.num
    },
    TestUpload(file) {
      let isSupport = file.name.endsWith('.xlsx')
      if (!isSupport) {
        this.$message.error('仅支持以xlsx结尾的office文件')
        return false
      }
      this.isUpload = true
      docToJson({
        data: file,
        type: 'test'
      })
        .then(res => {
          this.testList = res
          return addToRedis({
            templateId: this.testId,
            contents: res,
            type: 'template'
          })
        })
        .then(result => {
          if (result.result) {
            new Vue().$notify({
              message: 'Upload Success',
              type: 'success',
              duration: 1000
            })
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
          this.$message.error('文件内容格式错误！')
        })
      return false
    },
    handleSearch() {
      this.getTableList(1)
    },
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.beginAge === '') {
            this.form.beginAge = null
          }
          if (this.form.endAge === '') {
            this.form.endAge = null
          }
          // if (this.form.fullScore == '') {
          //   this.form.fullScore = null
          // }
          if (this.form.sort === '') {
            this.form.sort = null
          }
          if (this.isEdit) {
            const params = {}
            params.id = this.testId
            params.data = this.form
            edit(params).then(() => {
              this.handleCancel()
              this.getTableList(this.pageNo)
            })
          } else {
            this.form.examCategoryId = this.examCategoryId
            create(this.form).then(() => {
              this.handleCancel()
              this.getTableList(1)
            })
          }
        } else {
          return false
        }
      })
    }
  },
  mounted() {
    this.examCategoryId = this.$route.query.id
    this.examCategoryName = this.$route.query.name
    this.categoryType = this.$route.query.categoryType
    this.courseName = ''
    this.getTableList(1)
  }
}
</script>
<style lang="less" scoped>
.icon {
  width: 133px;
  height: 100px;
}

.page-box {
  margin: 30px 0;
  text-align: right;
}

.el-tag + .el-tag {
  margin-left: 10px;
  cursor: pointer;
}

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

.avatar-uploader2 {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  width: 80px;
  height: 80px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader2:hover {
  border-color: #409eff;
}

.avatar-uploader-icon2 {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 82px;
  text-align: center;
}

.avatar2 {
  width: 80px;
  height: 80px;
  display: block;
}

.el-input-number--small {
  width: 100px;
}

.el-input-number--small .el-input--small .el-input__inner {
  padding-right: 60px !important;
}
</style>
