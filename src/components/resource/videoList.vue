<template>
  <div>
    <div class="el-menu g-page-bar text-right" style="padding: 10px 0;">
      <el-form ref="form">
        <el-input v-model="title" size="small" placeholder="Search" clearable>
          <el-button
            @click="queryData"
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
      </el-form>
      <el-button
        class="ml15"
        @click="openDialog"
        icon="el-icon-upload"
        type="primary"
        size="small"
        >upload</el-button
      >
    </div>
    <div>
      <el-table
        ref="videoTable"
        :data="tableData.resources"
        border
        style="width: 100%"
      >
        <el-table-column label="Select" width="70" center>
          <template slot-scope="scope">
            <el-radio-group v-model="videoRadio">
              <el-radio
                @change.native="getCurrentRow(scope.row)"
                :label="scope.row.id.toString()"
                >&nbsp;</el-radio
              >
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="FileName"></el-table-column>
        <el-table-column prop="url" label="url"></el-table-column>
        <el-table-column prop="isDownload" label="IsDownload">
          <template slot-scope="scope">
            <span v-if="scope.row.isDownload">Yes</span>
            <span v-else>No</span>
          </template>
        </el-table-column>
        <el-table-column prop="coverImageUrl" label="coverImageUrl">
          <template slot-scope="scope">
            <img
              @click="openImgPreview(scope.row.coverImageUrl)"
              :src="scope.row.coverImageUrl"
              style="width: 50px;"
              alt
            />
          </template>
        </el-table-column>
        <el-table-column label="Action" width="130">
          <template slot-scope="scope">
            <!-- <el-button size="mini" type="primary" @click="editAction(scope.row)">Edit</el-button> -->
            <el-button
              size="mini"
              type="danger"
              @click="deleteAction(scope.row)"
              >Delete</el-button
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
      <img-preview
        :src="imgPreviewSrc"
        v-show="showImgPreview"
        @close="showImgPreview = false"
      ></img-preview>
    </div>
    <el-dialog
      title="Upload Video And Cover"
      :visible.sync="uploadDialog"
      append-to-body
    >
      <el-form
        :model="form"
        :rules="ruleForm"
        ref="addResourceForm"
        label-width="100px"
      >
        <el-form-item label="Video Cover" prop="coverImageUrl">
          <upload
            @change="uploadCover"
            accept="image/png, image/jpeg"
            :fileList="coverImageFileList"
          ></upload>
        </el-form-item>
        <el-form-item label="Video File" prop="url">
          <upload
            @change="uploadVideo"
            accept="video/mp4"
            :fileList="videoFileList"
          ></upload>
          <video
            style="display: none;"
            id="videoplayer"
            v-bind:src="form.url"
            controls="controls"
          >
            Your browser does not support video playback
          </video>
        </el-form-item>
        <el-form-item label="Download" prop="isDownload">
          <el-switch
            v-model="form.isDownload"
            active-text
            inactive-text
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="uploadDialog = false">Cancel</el-button>
        <el-button
          size="small"
          type="primary"
          @click="submitForm('addResourceForm')"
          >Confirm</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getResourceList,
  addResource,
  editResource,
  delResource
} from '@/api/resource/resource.js'
import ImgPreview from '@/components/imgPreview.vue'
import Upload from '@/components/upload.vue'
import upload from '@/mixins/upload.js'
import Http from '@/api/http'
export default {
  name: 'video-list',
  components: {
    ImgPreview,
    Upload
  },
  mixins: [upload],
  data() {
    return {
      imgPreviewSrc: '',
      showImgPreview: false,
      pageSize: 6,
      pageNo: 1,
      title: '',
      form: {
        name: '',
        url: '',
        coverImageUrl: '',
        isDownload: true,
        client: 'BackEnd',
        resourceType: 'Video',
        property: ''
      },
      moduleId: '',
      attribute: {},
      ruleForm: {
        url: [
          {
            required: true,
            message: 'Please select video resources',
            trigger: 'change'
          }
        ],
        coverImageUrl: [
          {
            required: true,
            message: 'Please upload the cover picture',
            trigger: 'change'
          }
        ]
      },
      tableData: {
        resources: [],
        totalCount: 0
      },
      uploadDialog: false,
      coverImageFileList: [],
      videoFileList: [],
      tabLabel: ''
    }
  },
  props: {
    radio: {
      type: String,
      required: false
    }
  },
  computed: {
    videoRadio: {
      get() {
        return this.radio
      },
      set() {}
    }
  },
  mounted() {
    this.getVideoList()
    Http({
      url: 'system/unExternal/modules'
    }).then(res => {
      // this.modules = res['modules']
      const imageModule = res['modules'].filter(item => item.name === 'BGC')
      if (imageModule.length === 1) {
        this.moduleId = imageModule[0].id
      }
    })
  },
  methods: {
    openDialog() {
      this.videoFileList = []
      this.coverImageFileList = []
      this.form = {
        name: '',
        url: '',
        coverImageUrl: '',
        isDownload: true,
        client: 'BackEnd',
        resourceType: 'Video',
        property: ''
      }
      this.uploadDialog = true
    },
    uploadVideo(file, fileList) {
      this.form.name = file.name
      this.getVideoInfoAsync(file.raw).then(res => {
        this.attribute = res
        this.handleUpload(file, fileList, 'url', 'videoFileList')
      })
    },
    queryData() {
      this.pageNo = 1
      this.getVideoList()
    },
    uploadCover(file, fileList) {
      this.handleUpload(file, fileList, 'coverImageUrl', 'coverImageFileList')
    },
    openImgPreview(imgSrc) {
      this.imgPreviewSrc = imgSrc
      this.showImgPreview = true
    },
    getVideoList() {
      let router_path = this.$route.path
      let pathArray = router_path.split('/')
      console.log(pathArray)
      let params = {
        client: 'BackEnd',
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        name: this.title,
        resourceType: 'Video',
        modulePath: `/${pathArray[1]}`
      }
      console.log(params)
      getResourceList(params).then(res => {
        console.log(res)
        for (let i = 0; i < res.resources.length; i++) {
          const r = res.resources[i]
          let property = JSON.parse(r.property)
          res.resources[i].coverImageUrl = property.poster
          res.resources[i].isDownload = property.isDownload
        }
        this.tableData.totalCount = res.totalCount
        this.tableData.resources = res.resources
      })
    },
    handleCurrentChange(pageNo) {
      this.pageNo = pageNo
      this.getVideoList()
    },

    deleteAction(row) {
      delResource(row.id).then(res => {
        console.log(res)
        this.getVideoList()
      })
    },
    editAction(row) {
      this.openDialog()
      console.log(row)
      this.form = { ...row }
      this.videoFileList.push({ url: row.url, name: row.name + `.mp4` })
      this.coverImageFileList.push({ url: row.coverImageUrl })
    },
    addVideo() {
      addResource(this.form).then(res => {
        console.log(res)
        this.uploadDialog = false
        this.getVideoList()
      })
    },
    editVideo() {
      editResource(this.form).then(res => {
        console.log(res)
        this.uploadDialog = false
        this.getVideoList()
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.attribute.poster = this.form.coverImageUrl
          this.attribute.isDownload = this.form.isDownload
          this.form.property = JSON.stringify(this.attribute)
          this.form.moduleId = this.moduleId
          if (this.form.id) {
            this.editVideo()
          } else {
            this.addVideo()
          }
        }
      })
    },
    getCurrentRow(row) {
      this.$emit('getVideoRow', row)
    }
  }
}
</script>
<style lang="less" scoped>
.page-box {
  margin: 30px 0;
  text-align: right;
}
/deep/ .el-tabs__content {
  min-height: 430px;
}
/*.text-right{*/
/*text-align: right;*/
/*}*/
.ml15 {
  margin-left: 15px;
}
</style>
