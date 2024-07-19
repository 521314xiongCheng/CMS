<template>
  <div>
    <el-form :model="form" size="small" label-width="80px">
      <el-row type="flex">
        <el-col :span="6">
          <el-form-item label="标题：">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态">
            <el-select v-model="form.status">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" size="small" @click="serachData(1)"
            >搜索</el-button
          >
        </el-col>
        <el-col :span="2" :offset="7">
          <el-button
            type="primary"
            size="small"
            @click="
              $router.push({
                name: 'msgpush-communication-detail'
              })
            "
            >新增</el-button
          >
        </el-col>
      </el-row>
    </el-form>
    <div style="margin-top: 15px;">
      <el-table
        :data="tableData.data"
        tooltip-effect="dark"
        style="width: 100%"
        border
        empty-text="暂无数据"
      >
        <el-table-column
          label="标题"
          prop="title"
          align="center"
        ></el-table-column>
        <el-table-column
          label="生效时间"
          prop="effective_time"
          width="160"
          align="center"
        >
          <template slot-scope="scope">
            <div>
              {{ scope.row.schedule_start_datetime }} -
              {{ scope.row.schedule_end_datetime }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="权限"
          prop="permission_control_flag"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <div>
              {{
                scope.row.permission_control_flag === 0
                  ? '无权限'
                  : scope.row.permission_control_flag === 1
                  ? '限制level'
                  : '限制名单'
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          prop="status"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          label="是否推送消息"
          prop="is_push"
          width="110"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.is_push ? '是' : '否' }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作人"
          prop="last_updated_by"
          align="center"
        ></el-table-column>
        <el-table-column
          label="操作时间"
          prop="last_updated_time"
          width="90"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="180">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="
                $router.push({
                  name: 'msgpush-communication-detail',
                  query: { id: scope.row.message_id }
                })
              "
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="success"
              @click="publishItem(scope.row)"
              v-if="scope.row.status == '待发布'"
              >发布</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="deleteItem(scope.row.message_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;" v-if="tableData.pageData">
        <el-pagination
          style="margin-left: auto; margin-top: 20px"
          @current-change="handleCurrentChange"
          :page-size="tableData.pageData ? tableData.pageData.pageSize : 0"
          layout="total, prev, pager, next, jumper"
          :total="tableData.pageData ? tableData.pageData.totalCount : 0"
          :current-page="tableData.pageData.pageNo"
          background
          :hide-on-single-page="false"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  searchMessages,
  publishMessage,
  deleteMessage
} from '../../../api/msgpush/communication'
import { readUserInfo } from '../../../utility/index'
export default {
  data() {
    return {
      form: {
        status: 'all',
        title: ''
      },
      statusOptions: [
        {
          value: 'all',
          text: '全部'
        },
        {
          value: 'unpublish',
          text: '待发布'
        },
        {
          value: 'ineffective',
          text: '待生效'
        },
        {
          value: 'effective',
          text: '生效中'
        },
        {
          value: 'expired',
          text: '已失效'
        }
      ],
      tableData: {
        data: [],
        pageData: {
          pageNo: 1,
          pageSize: 10,
          totalCount: 1
        }
      },
      openQRcodePop: false,
      QRUrl: ''
    }
  },
  mounted() {
    this.serachData(1)
  },
  methods: {
    serachData(pageNo) {
      searchMessages({
        title: this.form.title,
        status: this.form.status,
        page_index: pageNo,
        page_size: this.tableData.pageData.pageSize
      }).then(res => {
        this.tableData.data = res.message_list || []
        this.tableData.pageData.totalCount = res.total_count
      })
    },
    handleCurrentChange(pageNo) {
      this.serachData(pageNo)
    },
    publishItem(item) {
      this.$confirm('确定要发布?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          publishMessage({
            message_id: item.message_id,
            operator: readUserInfo().email
          })
            .then(res => {
              if (res.ret_code === '0') {
                this.$message({
                  type: 'success',
                  message: '发布成功'
                })
                this.serachData(1)
              } else {
                this.$message({
                  type: 'success',
                  message: res.ret_message
                })
              }
            })
            .catch(res => {
              this.$message({
                type: 'success',
                message: res.error_message
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消'
          })
        })
    },
    deleteItem(id) {
      this.$confirm('确定要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteMessage({
            message_id: id,
            operator: readUserInfo().email
          })
            .then(res => {
              if (res.ret_code === '0') {
                this.$message({
                  type: 'success',
                  message: '删除成功！'
                })
                this.serachData(1)
              } else {
                this.$message({
                  type: 'success',
                  message: res.ret_message
                })
              }
            })
            .catch(res => {
              this.$message({
                type: 'success',
                message: res.error_message
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消'
          })
        })
    }
  }
}
</script>

<style></style>
