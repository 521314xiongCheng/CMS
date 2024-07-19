<template>
  <div class="topic-list">
    <div class="text-right">
      <el-button type="primary" size="small" @click="editAction"
        >添加</el-button
      >
      <el-button
        type="primary"
        size="small"
        :disabled="sortButtonState"
        @click="sort"
      >
        更新排序
      </el-button>
    </div>
    <div class="table-wrap">
      <table-list
        :tableData="tableData"
        :isUseMixin="false"
        @handleCurrentChange="handleCurrentChange"
      >
        <el-table-column
          label="排序"
          slot="between"
          prop="sequence"
          :width="180"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-input-number
              size="small"
              v-model="row.sequence"
              style="width:100px;"
              :max="99999"
              :min="0"
              @change="changeSort"
              controls-position="right"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="240">
          <template slot-scope="{ row, $index }">
            <el-button
              size="small"
              v-if="!row.enable_hot"
              type="success"
              @click="setHot(row.id, true)"
              >设为hot</el-button
            >
            <el-button
              size="small"
              v-if="row.enable_hot"
              type="danger"
              @click="setHot(row.id, false)"
              >取消hot</el-button
            >
            <el-button size="small" type="primary" @click="editAction(row)"
              >修改</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="delAction(row, $index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </table-list>
    </div>
  </div>
</template>

<script>
import upload from '@/mixins/upload.js'
import TableList from '@/components/tableList.vue'
import {
  getTopicList,
  deleteTopic,
  batchUpdateSort,
  setHot
} from '@/api/xxxxxxx/topic.js'
import restfulMixin from '@/mixins/restful.js'
import { formatDate } from '@/utility/index.js'
// import storage from 'good-storage'
// import { uploadToResource } from '@/api/index.js'
// import Upload from '@/components/upload'
export default {
  components: {
    TableList
  },
  mixins: [restfulMixin, upload],
  data() {
    // let validatorPublishTime = (rule, value, callback) => {
    //   if (!this.activityTime.length && this.activityTime.length != 2) {
    //     callback(new Error('请选择生效时间'))
    //   }
    //   let start_date = this.activityTime[0]
    //   let end_date = this.activityTime[1]
    //   if (start_date > end_date) {
    //     callback(new Error('开始时间不能大于结束时间'))
    //   }
    //   callback()
    // }
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
            tableName: '活动名称'
          },
          {
            tableId: 'banner_image',
            tableName: '首页露出封面图'
          },
          {
            tableId: 'description_image',
            tableName: '详情介绍图'
          },
          {
            tableId: 'start_date',
            tableName: '开始时间',
            tableWidth: 160,
            formatter: row => {
              return formatDate(row.start_date)
            }
          },
          {
            tableId: 'end_date',
            tableName: '结束时间',
            tableWidth: 160,
            formatter: row => {
              return formatDate(row.end_date)
            }
          }
        ],
        data: [],
        pageData: {
          pageSize: 20,
          totalCount: 0
        }
      },
      filters: {
        pageSize: 20,
        pageNo: 1
      },
      sortButtonState: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      let req = {}
      req.page_size = parseInt(this.filters.pageSize)
      req.page_number = parseInt(this.filters.pageNo)
      getTopicList(req).then(res => {
        this.tableData.data = res.data.list
        this.tableData.pageData.totalCount = Number(res.data.total)
        this.sortButtonState = true
      })
    },
    handleCurrentChange(n) {
      this.filters.pageNo = n
      this.getList()
    },
    dateChange(v) {
      if (!v) {
        this.activityTime = []
      }
    },
    editAction(row) {
      row &&
        this.$router.push({
          name: 'xxxxxxx-topicChallenge-edit',
          query: { id: row.id }
        })
      !row && this.$router.push({ name: 'xxxxxxx-topicChallenge-edit' })
      // this.dialogFormVisible = true
      // this.dialogTitle = '修改'
      // getTopicById(row.id).then(res=>{
      //   console.log(res)
      //   this.form = clones(res.data)
      //   console.log(this.form)
      //   this.form.enable_show_ranking_list = this.form.enable_show_ranking_list ? '1':'0'
      //   if (this.form.banner_image) {
      //     this.activityTime = [this.form.start_date, this.form.end_date]
      //     this.bannerImageUrlList = [
      //       {
      //         name: this.form.banner_image,
      //         url: this.form.banner_image
      //       }
      //     ]
      //   }
      //   if (this.form.description_image) {
      //     this.descriptionImageUrlList = [
      //       {
      //         name: this.form.description_image,
      //         url: this.form.description_image
      //       }
      //     ]
      //   }
      //   if (this.form.list_page_image) {
      //     this.listPageUrlList = [
      //       {
      //         name: this.form.list_page_image,
      //         url: this.form.list_page_image
      //       }
      //     ]
      //   }
      //
      //   if (this.form.background_image) {
      //     this.backgroundUrlList = [
      //       {
      //         name: this.form.background_image,
      //         url: this.form.background_image
      //       }
      //     ]
      //   }
      //   if (this.form.sponsor_avatar_url) {
      //     this.sponsorAvatarImageUrlList = [
      //       {
      //         name: this.form.sponsor_avatar_url,
      //         url: this.form.sponsor_avatar_url
      //       }
      //     ]
      //   }
      // })
      // this.$nextTick(() => {
      //   console.log(row)
      //   this.form = clones(row)

      // })
    },
    delAction(row) {
      this.$confirm(`您确定要删除该条数据嘛?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTopic(row.id).then(res => {
          console.log(res)
          this.sortButtonState = true
          this.getList()
        })
      })
    },
    sort() {
      let data = this.tableData.data.map(o => ({
        id: Number(o.id),
        sequence: Number(o.sequence)
      }))
      let req = {}
      req.topic_sequences = data
      batchUpdateSort(req).then(res => {
        console.log(res)
        this.$message({
          type: 'success',
          message: '更新排序号成功！'
        })
        this.sortButtonState = true
        this.getList()
      })
    },
    changeSort(value) {
      console.log(value)
      this.sortButtonState = false
    },
    setHot(id, enable_hot) {
      // this.$confirm(`您确定要删除该条数据嘛?`, '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   deleteTopic(row.id).then(res => {
      //     console.log(res)
      //     this.sortButtonState = true
      //     this.getList()
      //   })
      // })
      console.log(id)

      this.$confirm(
        `${enable_hot ? '确定设置为Hot' : '确定取消Hot'}?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        setHot(id, { enable_hot: enable_hot }).then(res => {
          console.log(res)
          this.$message({
            type: 'success',
            message: '成功！'
          })
          this.getList()
        })
      })
    }
  }
}
</script>
<style lang="less">
.input-img-url {
  position: absolute;
  left: 90px;
  width: 305px !important;
}
</style>
