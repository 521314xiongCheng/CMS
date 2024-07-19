<template>
  <div>
    <div class="el-menu g-page-bar">
      <!-- <span class="page-title">BGC管理</span> -->
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
      <el-button @click="addBGC" size="small" type="primary" class="marginleft"
        >新增</el-button
      >
    </div>
    <!-- table -->
    <div class="table-wrap">
      <el-table :data="tableData.bgcs" border style="width: 100%">
        <el-table-column
          prop="isShareWords"
          label="发布"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <!--publishState false未发布-->
            <el-button
              v-if="!scope.row.publishState"
              @click="publishCourse(scope.row)"
              size="mini"
              type="primary"
              >发布</el-button
            >
            <el-button
              v-else
              size="mini"
              @click="publishCourse(scope.row)"
              type="danger"
              >取消发布</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="课程ID"
          align="center"
          width="300"
        ></el-table-column>
        <el-table-column
          prop="title"
          label="课程标题"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="updatedDate"
          align="center"
          label="更新时间"
          width="160"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="editAction(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="success"
              @click="previewAction(scope.row)"
              >预览</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="deleteAction(scope.row)"
              >删除</el-button
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

    <el-dialog title="" :visible.sync="previewDialog" width="80%">
      <div>
        <h3 style="color: #000;">{{ previewInfo.title }}</h3>
        <div style="color: #ccc;font-size: 12px;">
          {{ previewInfo.createdDate }}
        </div>
        <div class="text-center">
          <div v-for="item in previewInfo.articleDetails" :key="item.id">
            <div
              style="margin-top:20px"
              v-if="item.type === 'Text'"
              v-html="item.content"
            ></div>
            <div
              style="width: 400px;margin: 20px auto;"
              v-else-if="item.type === 'Video'"
            >
              <video style="width:100%" :src="item.content" controls></video>
            </div>
            <div
              style="width: 400px;margin: 20px auto;"
              v-else-if="item.type === 'Audio'"
            >
              <audio :src="item.content" controls></audio>
            </div>
            <div v-else-if="item.type === 'Animation'">
              <img style="max-width: 400px;" :src="item.content" />
            </div>
            <div v-else>
              <img style="max-width: 400px;" :src="item.content" />
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, delBGC, publishBgc } from '@/api/testApplet/BGC/list.js'
export default {
  name: 'testApplet-BGC-index',
  data() {
    return {
      title: '',
      pageSize: 20,
      pageNo: 1,
      tableData: {
        bgcs: [],
        totalCount: 0
      },
      previewDialog: false,
      previewInfo: {}
    }
  },
  mounted() {
    this.getBgcList()
  },
  methods: {
    getBgcList() {
      let params = {
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        title: this.title ? this.title : ''
      }
      console.log(params)
      getList(params).then(res => {
        console.log(res)
        this.tableData = { ...res }
      })
    },
    queryData() {
      this.pageNo = 1
      this.getBgcList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageNo = val
      this.getBgcList()
    },
    publishCourse(row) {
      publishBgc(row.id).then(res => {
        console.log(res)
        this.getBgcList()
      })
    },
    deleteAction(row) {
      console.log(row)
      //该文章已被引用至小程序，若删除，小程序上将看不到此文章，需珍重操作！请确认是否需要删除？
      if (!row.publishState) {
        //false 未发布
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delBGC(row.id).then(res => {
            console.log(res)
            this.getBgcList()
          })
        })
      } else {
        this.$confirm(
          '该文章已被引用至小程序，若删除，小程序上将看不到此文章，需珍重操作！请确认是否需要删除?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          delBGC(row.id).then(res => {
            console.log(res)
            this.getBgcList()
          })
        })
      }
    },
    addBGC() {
      this.$router.push({ name: 'testApplet-BGC-edit' })
    },
    editAction(row) {
      console.log(row)
      sessionStorage.setItem('bgcEditRow', JSON.stringify(row))
      this.$router.push({ name: 'testApplet-BGC-edit', query: { id: row.id } })
    },
    previewAction(row) {
      console.log(row)
      sessionStorage.setItem('bgcPreviewRow', JSON.stringify(row))
      this.$router.push({
        name: 'testApplet-BGC-preview',
        query: { id: row.id }
      })
      // this.previewInfo = {...row}
      // this.previewDialog = true
    }
  }
}
</script>

<style lang="less" scoped>
.page-box {
  margin: 30px 0;
  text-align: right;
}
</style>
