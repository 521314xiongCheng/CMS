<template>
  <div class="el-menu g-page-bar">
    <!-- <div class="g-page-bar" style="border-bottom: 1px solid #e6e6e6;">
      <span class="page-title">Template</span>
    </div> -->
    <!-- query form -->
    <div style="margin-top: 20px;overflow: hidden;">
      <!-- <el-form
        ref="form"
        :model="queryForm"
        inline
        label-width="80px"
        size="small"
      >
        <el-form-item label="Client">
          <el-select
            v-model="queryForm.appName"
            clearable
            placeholder="please select the client"
          >
            <el-option
              v-for="item in clientList"
              :key="item.id"
              :label="item.client_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-button @click="query(1)" type="primary" size="small"
          >Query</el-button
        >
        <el-button
          @click="addTask"
          type="primary"
          size="small"
          style="float:right;"
        >Add</el-button>
      </el-form> -->
      <el-button @click="addTask" type="primary" size="small">Add</el-button>
    </div>

    <div style="margin-top: 15px;">
      <el-table
        :data="tableData.data"
        tooltip-effect="dark"
        style="width: 100%"
        border
      >
        <el-table-column
          label="ID"
          width="70"
          align="center"
          prop="id"
        ></el-table-column>
        <el-table-column
          label="Client"
          width="110"
          align="center"
          prop="appName"
        ></el-table-column>
        <el-table-column
          label="Name"
          align="center"
          prop="name"
        ></el-table-column>
        <el-table-column
          label="Title"
          align="center"
          prop="title"
        ></el-table-column>
        <el-table-column
          label="Status"
          width="110"
          align="center"
          prop="status"
        ></el-table-column>
        <el-table-column label width="130" align="left">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="showEditForm(scope.row)"
              >Edit</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;" v-if="tableData.pageData">
        <el-pagination
          style="margin-left: auto;"
          @current-change="handleCurrentChange"
          :page-size="tableData.pageData ? tableData.pageData.pageSize : 0"
          layout="total, prev, pager, next, jumper"
          :total="tableData.pageData ? tableData.pageData.totalCount : 0"
        ></el-pagination>
      </div>
    </div>
    <el-dialog title="Edit" :visible.sync="dialogFormVisible">
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="200px"
        label-position="left"
        size="small"
      >
        <el-form-item label="TemplateID" prop="id">
          <el-input v-model="addForm.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Template Name" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="Client" prop="appName">
          <el-select
            v-model="addForm.appName"
            placeholder="please select the client"
          >
            <el-option
              v-for="item in clientList"
              :key="item.id"
              :label="item.client_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="目标人群" prop="groupIds">
          <el-input v-model="addForm.groupIds"></el-input>
        </el-form-item>
        <el-form-item label="MessageTitle" prop="title">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="Message" prop="message">
          <el-input
            type="textarea"
            :rows="3"
            v-model="addForm.message"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="Message Parameters" prop="targetAppParameters">
          <el-input
            type="textarea"
            :rows="3"
            v-model="addForm.targetAppParameters"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="MessageType" prop="messageType">
          <el-input v-model="addForm.messageType" type="text"></el-input>
        </el-form-item>
        <el-form-item label="MessageTargetUrl" prop="targetUrl">
          <el-input v-model="addForm.targetUrl"></el-input>
        </el-form-item>
        <!-- <el-form-item
          v-if="addForm.appName == 'xxxxxxx' && addForm.messageType == 2"
          label="ArticleId"
        >
          <el-input v-model="addForm.articleId" style="width: 100px"></el-input>
          <el-button
            type="success"
            style="margin-left: 30px"
            @click="getArticlInfo"
            >Check</el-button
          >
        </el-form-item> -->
        <el-form-item label="coverImageUrl">
          <el-input v-model="addForm.coverImageUrl"></el-input>
          <upload
            @change="coverImageFileChange"
            accept="image/png, image/jpeg"
          ></upload>
        </el-form-item>
        <el-form-item label="Video Url" prop="videoUrl">
          <el-input v-model="addForm.videoUrl"></el-input>
        </el-form-item>
        <el-form-item label="Send Date" prop="sendDate">
          <el-date-picker
            v-model="addForm.sendDate"
            type="datetime"
            formate="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="设置发送日期"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer text-center">
        <el-button @click="submit" size="small">Save</el-button>
        <el-button
          type="primary"
          size="small"
          @click="dialogFormVisible = false"
          >Close</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      :title="'Add Template'"
      :visible.sync="addxxxxxxxTaskDialogVisible"
    >
      <el-form
        ref="addxxxxxxxTaskForm"
        :model="addxxxxxxxTaskForm"
        label-width="200px"
        label-position="left"
        :rules="rules"
        size="small"
      >
        <el-form-item label="Template Name" prop="name">
          <el-input v-model="addxxxxxxxTaskForm.name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="Client" prop="appName">
          <el-select
            v-model="addxxxxxxxTaskForm.appName"
            placeholder="please select the client"
          >
            <el-option
              v-for="item in clientList"
              :key="item.id"
              :label="item.client_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="目标人群" prop="groupIds">
          <el-input v-model="addxxxxxxxTaskForm.groupIds"></el-input>
        </el-form-item>
        <el-form-item label="MessageTitle" prop="title">
          <el-input v-model="addxxxxxxxTaskForm.title"></el-input>
        </el-form-item>
        <el-form-item label="Message" prop="message">
          <el-input
            type="textarea"
            :rows="3"
            v-model="addxxxxxxxTaskForm.message"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="Message Parameters" prop="targetAppParameters">
          <el-input
            type="textarea"
            :rows="3"
            v-model="addxxxxxxxTaskForm.targetAppParameters"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="MessageType" prop="messageType">
          <el-input
            v-model="addxxxxxxxTaskForm.messageType"
            type="text"
          ></el-input>
        </el-form-item>
        <el-form-item label="MessageTargetUrl" prop="targetUrl">
          <el-input v-model="addxxxxxxxTaskForm.targetUrl"></el-input>
        </el-form-item>
        <!-- <el-form-item
          v-if="addForm.appName == 'xxxxxxx' && addForm.messageType == 2"
          label="ArticleId"
        >
          <el-input v-model="addForm.articleId" style="width: 100px"></el-input>
          <el-button
            type="success"
            style="margin-left: 30px"
            @click="getArticlInfo"
            >Check</el-button
          >
        </el-form-item> -->
        <el-form-item label="coverImageUrl">
          <el-input v-model="addxxxxxxxTaskForm.coverImageUrl"></el-input>
          <upload
            @change="coverImageFileChange"
            accept="image/png, image/jpeg"
          ></upload>
        </el-form-item>
        <el-form-item label="Video Url" prop="videoUrl">
          <el-input v-model="addxxxxxxxTaskForm.videoUrl"></el-input>
        </el-form-item>
        <el-form-item label="Send Date" prop="sendDate">
          <el-date-picker
            v-model="addxxxxxxxTaskForm.sendDate"
            type="datetime"
            formate="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="设置发送日期"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer text-center">
        <el-button
          @click="
            $refs['addxxxxxxxTaskForm'].resetFields()
            addxxxxxxxTaskDialogVisible = false
          "
          size="small"
          >Cancel</el-button
        >
        <el-button type="primary" size="small" @click="confirmxxxxxxxTask"
          >Save</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { get, edit, add } from '../../../api/msgpush/template.js'
import {
  getCMSArticleInfo,
  getCMSArticlePublish
} from '../../../api/msgpush/push_target_manage.js'
import { readUserName } from '../../../utility/index'
import uploadMixin from '../../../mixins/upload'
export default {
  components: {},
  mixins: [uploadMixin],
  data() {
    return {
      tableData: {
        data: [],
        pageData: {
          pageNo: 1,
          pageSize: 10,
          totalCount: 1
        }
      },
      queryForm: { appName: '' },
      form: {},
      clientList: [
        {
          id: '',
          client_name: ''
        }
      ],
      dialogFormVisible: false,
      addForm: {},
      username: '',
      rules: {
        name: [{ required: true, message: 'not null', trigger: 'blur' }],
        title: [
          {
            required: true,
            message: 'not null',
            trigger: 'blur'
          }
        ],
        message: [
          {
            required: true,
            message: 'not null',
            trigger: 'blur'
          }
        ],
        messageType: [
          {
            required: true,
            message: 'not null',
            trigger: 'blur'
          }
        ]
      },
      addxxxxxxxTaskForm: {
        // 模板名称 | required
        name: '',
        // 客户端
        appName: 'xxxxxxx',
        // 目标人群
        groupIds: '',
        // 标题 | required
        title: '',
        // 消息内容  Text  | required
        message: '',
        // 消息类型， 自填 Text  | required
        messageType: '',
        // 消息跳转url
        targetUrl: '',
        // 消息封面
        coverImageUrl: '',
        // ...
        videoUrl: '',
        // 消息跳转url参数
        targetAppParameters: '',
        // 指定发送时间
        sendDate: ''
      },
      targetPopulationOptions: [],
      addxxxxxxxTaskDialogVisible: false,
      isEditor: false
    }
  },
  methods: {
    query(pageNo) {
      this.pageNo = pageNo
      this.queryForm.pageSize = 10
      this.queryForm.pageNo = pageNo
      get(this.queryForm).then(res => {
        console.log(res)
        this.tableData.data = res.templates
        this.tableData.pageData.totalCount = res.totalCount
        this.tableData.pageData.pageSize = res.pageSize
        this.tableData.pageData.pageNo = res.pageNo
      })
    },
    handleCurrentChange(pageNo) {
      this.query(pageNo)
    },
    submit() {
      // if (
      //   this.addForm.appName == 'SkinAnalyzer' &&
      //   !this.addForm.message.includes('{CustomerName}')
      // ) {
      //   this.$message({
      //     message: '没有添加 {CustomerName} 字段，消息推送内容将无顾客姓名',
      //     type: 'warning',
      //     duration: 7000
      //   })
      // }

      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.addForm.createdBy = this.username
          const params = {
            data: this.addForm
          }
          edit(params).then(() => {
            this.dialogFormVisible = false
            this.query(1)
          })
        } else {
          console.log('error submit!!')
          return
        }
      })
    },
    async showEditForm(row) {
      this.dialogFormVisible = true
      this.isEditor = true
      // let params = {
      //   client: row.appName,
      //   market: localStorage.getItem('market')
      // }
      this.$nextTick(() => {
        row.messageType = row.messageType.toString()
        this.$set(this, 'addForm', row)
        this.$set(this.addForm, 'messageTypeValue', row.messageTypeVale)
        this.$set(this.addForm, 'coverImageUrl', row.coverImageUrl)
      })
    },
    addTask() {
      this.isEditor = false
      this.addxxxxxxxTaskForm.articleId = ''
      this.addxxxxxxxTaskForm.coverImageUrl = ''
      this.addxxxxxxxTaskForm.appName = this.queryForm.appName
      this.addxxxxxxxTaskDialogVisible = true
    },
    confirmxxxxxxxTask() {
      this.$refs['addxxxxxxxTaskForm'].validate(valid => {
        if (valid) {
          // let params = {
          //   title: this.addxxxxxxxTaskForm.title,
          //   message: this.addxxxxxxxTaskForm.message,
          //   appName: this.addxxxxxxxTaskForm.appName,
          //   name: this.addxxxxxxxTaskForm.name,
          //   messageType: this.addxxxxxxxTaskForm.messageType,
          //   // message: this.addxxxxxxxTaskForm.message,
          //   articleId: this.addxxxxxxxTaskForm.articleId,
          //   rectangleCoverImageUrl: this.addxxxxxxxTaskForm
          //     .rectangleCoverImageUrl,
          //   status: this.addxxxxxxxTaskForm.status == 'valid' ? true : false,
          //   createdBy: this.username,
          //   market: localStorage.getItem('market')
          // }

          let params = JSON.parse(JSON.stringify(this.addxxxxxxxTaskForm))
          add({ data: params }).then(() => {
            this.$refs['addxxxxxxxTaskForm'].resetFields()
            this.addxxxxxxxTaskDialogVisible = false
            this.query(1)
          })
        } else {
          console.log('error submit!!')
          return
        }
      })
    },
    async getArticlInfo() {
      let item = 'addxxxxxxxTaskForm'
      if (this.isEditor) {
        item = 'addForm'
      }

      if (!this[item].articleId) {
        this.$message.error('Article not found!')
        return
      }
      let publishRes = await getCMSArticlePublish(this[item].articleId)

      if (publishRes.articles.length < 1) {
        this.$message.error('Article not found!')
        return
      }

      if (publishRes.articles[0].publishState == false) {
        this.$message.error('Article not published!')
        return
      }

      getCMSArticleInfo(this[item].articleId).then(res => {
        console.log(
          '---------',
          res.article,
          this[item].messageType,
          `${process.env}/article/${this[item].articleId}`
        )

        if (res.article) {
          let article = res.article
          let envs = location.host.includes('dev-')
            ? 'dev-'
            : location.host.includes('qa-')
            ? 'qa-'
            : location.host.includes('uat-')
            ? 'uat-'
            : ''
          if (this[item].messageTypeValue == '') {
            this[
              item
            ].messageTypeValue = `https://${envs}content-h5-apr.xxxxxxx.com/article/${this[item].articleId}`
          }

          if (this[item].title == '') {
            this[item].title = article.title
          }

          if (this[item].message == '') {
            this[item].message = article.summary
          }
          if (this[item].coverImageUrl == '') {
            this[item].coverImageUrl = article.coverImageUrl
          }

          this[item].subsidiaryCode = article.subsidiaryCode
          // console.log(item);
        }
      })
    },
    coverImageFileChange(file, fileList) {
      this.handleUpload(file, fileList, 'coverImageUrl', '')
    }
  },
  mounted() {
    // this.queryForm.appName = this.clientList[0].id
    this.username = readUserName()
    this.query(1)
  },
  beforeMount() {
    // const { clients } = JSON.parse(localStorage.getItem('userInfo'))
    // this.clientList = []
    // console.log(clients)
    // if (clients.includes("玫琳凯之窗")) {
    //   this.clientList.push({
    //     id: 'xxxxxxx',
    //     client_name: "玫琳凯之窗"
    //   })
    // }
    // if (clients.includes('肌肤测试仪')) {
    //   this.clientList.push({
    //     id: 'SkinAnalyzer',
    //     client_name: '肌肤测试仪'
    //   })
    // }
    // if (clients.includes('ReactNative')) {
    //   this.clientList.push({
    //     id: 'ReactNative',
    //     client_name: 'ReactNative'
    //   })
    // }
    // if (this.clientList.length == 0) {
    //   this.clientList = [
    //     {
    //       id: '',
    //       client_name: ''
    //     }
    //   ]
    // }
  }
}
</script>
