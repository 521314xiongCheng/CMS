<template>
  <div>
    <div v-if="!addBgcTable" class="el-menu g-page-bar">
      <!-- <span class="page-title">管理课程</span> -->
      <el-form :inline="true" size="small">
        <el-form-item label="">
          <el-input
            size="medium"
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
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item>
          <el-button
            @click="addBgcTable = true"
            size="medium"
            type="primary"
            class="marginleft"
            >添加课程</el-button
          >
          <el-button
            :disabled="courseLength > 0 ? false : true"
            @click="sortCourses"
            size="medium"
            type="success"
            class="marginleft"
            >更新排序</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- table -->
    <div v-if="!addBgcTable" class="table-wrap">
      <el-table :data="tableData.courses" border style="width: 100%">
        <el-table-column align="center" prop="sort" label="排序" width="100">
          <template slot-scope="scope">
            <el-input
              size="mini"
              @blur="changeSort(scope.row)"
              type="number"
              v-model="scope.row.sort"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="articleId"
          label="课程ID"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="courseName"
          label="课程标题"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="needVoiceClock"
          label="是否语音跟读"
          width="150"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.needVoiceClock == 1">是</span>
            <span v-if="scope.row.needVoiceClock == 0">否</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="deleteAction(scope.row)"
              >移除</el-button
            >
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
    </div>
    <div v-else>
      <PendingBgcList
        :categoryId="categoryId"
        @selectCourse="selectCourse"
      ></PendingBgcList>
      <div class="">
        <el-button
          size="mini"
          @click="
            addBgcTable = false
            selectedCoursesArr = []
          "
          >取消</el-button
        >
        <el-button
          :disabled="!selectedCoursesArr.length"
          size="mini"
          type="primary"
          @click="addBgcToCourse"
          >保存</el-button
        >
      </div>
    </div>
    <!--    <div class="voiceFollow" v-if="voiceFollow">-->
    <!--    <el-dialog title="提示" :visible.sync="voiceFollow" width="60%" :before-close="handleClose">-->
    <el-dialog
      title="提示"
      :visible="dialogVoiceFollow"
      width="780px"
      :show-close="false"
    >
      <div style="font-size: 18px;margin: 20px 0;">是否需要语音跟读</div>
      <div>
        <el-radio-group size="medium" v-model="needVoiceClock">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <!--        <el-button @click="dialogVoiceFollow=false">取 消</el-button>-->
        <el-button type="primary" @click="voiceFollowSelect">确 定</el-button>
      </span>
    </el-dialog>
    <!--    </div>-->
  </div>
</template>

<script>
import {
  getList,
  delCourse,
  sortCourse,
  addCourse
} from '@/api/testApplet/sales/course.js'
import PendingBgcList from './pendingBgc.vue'
export default {
  name: 'testApplet-sales-required-manageCourse',
  components: { PendingBgcList },
  data() {
    return {
      title: '',
      pageSize: 20,
      pageNo: 1,
      tableData: {
        courses: [],
        totalCount: 0
      },
      courseLength: 0,
      categoryId: '',
      sortCourse: {
        courses: []
      },
      addCourse: {
        courses: []
      },
      addBgcTable: false,
      selectedCoursesArr: [],
      needVoiceClock: 1, //1 需要，0 不需要
      voiceFollowCheck: {},
      dialogVoiceFollow: false
    }
  },
  mounted() {
    console.log(this.$route.query.categoryId)
    this.categoryId = this.$route.query.categoryId
    this.getCourseList()
  },
  methods: {
    getCourseList() {
      let params = {
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        title: this.title
      }
      console.log(params)
      getList(this.categoryId, params).then(res => {
        console.log(res)
        this.tableData = { ...res }
        this.courseLength = this.tableData.courses.length
      })
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageNo = val
      this.getCourseList()
    },
    queryData() {
      this.pageNo = 1
      this.getCourseList()
    },
    deleteAction(row) {
      console.log(row)
      this.$confirm('请确认是否需要移除课程?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCourse(row.id).then(res => {
          console.log(res)
          this.getCourseList()
        })
      })
    },

    changeSort(row) {
      console.log(row)
      let item = {
        id: row.id,
        sort: row.sort
      }
      for (let i in this.sortCourse.courses) {
        if (this.sortCourse.courses[i].id === row.id) {
          this.sortCourse.courses.splice(i, 1)
        }
      }
      this.sortCourse.courses.push(item)
      console.log(this.sortCourse)
    },
    sortCourses() {
      sortCourse(this.sortCourse).then(res => {
        console.log(res)
        this.getCourseList()
      })
    },
    selectCourse(data) {
      console.log(data)

      if (data.selected) {
        this.dialogVoiceFollow = true
        this.voiceFollowCheck = data.row
      }
      this.selectedCoursesArr = data.selection
      console.log(this.selectedCoursesArr)
    },
    voiceFollowSelect() {
      this.voiceFollowCheck.needVoiceClock = this.needVoiceClock
      this.selectedCoursesArr.splice(
        this.selectedCoursesArr.length - 1,
        1,
        this.voiceFollowCheck
      )
      console.log(this.selectedCoursesArr)
      this.dialogVoiceFollow = false
      this.needVoiceClock = 1
    },
    addBgcToCourse() {
      for (let i in this.selectedCoursesArr) {
        this.addCourse.courses.push({
          articleId: this.selectedCoursesArr[i].id,
          articleTitle: this.selectedCoursesArr[i].title,
          createdDate: this.selectedCoursesArr[i].createdDate,
          needVoiceClock: this.selectedCoursesArr[i].needVoiceClock
        })
      }
      console.log(this.addCourse)
      addCourse(this.categoryId, this.addCourse).then(res => {
        console.log(res)
        this.getCourseList()
        this.addCourse.courses = [] //清空
        this.selectedCoursesArr = []
        this.addBgcTable = false
      })
    }
  }
}
</script>

<style lang="less">
.page-box {
  margin: 30px 0;
  text-align: right;
}
.el-radio__inner {
  width: 17px;
  height: 17px;
}
.el-radio__label {
  font-size: 17px;
}
.el-table__header-wrapper .el-checkbox {
  //找到表头那一行，然后把里面的复选框隐藏掉
  display: none;
}
</style>
