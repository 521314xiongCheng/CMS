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
        <el-table-column v-if="videoLabelRadio" label="选择" width="70" center>
          <template slot-scope="scope">
            <el-radio-group v-model="videoRadio">
              <el-radio
                @change.native="getCurrentRow(scope.row)"
                :label="scope.row.name"
                >&nbsp;</el-radio
              >
            </el-radio-group>
            <!--<el-radio @change.native="getCurrentRow(scope.row)"-->
            <!--v-model="radio"-->
            <!--:label="scope.$index">&nbsp;</el-radio>-->
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
        <el-table-column v-if="searchVideo" label="Action" width="130">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="editAction(scope.row)"
              >Edit</el-button
            >
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
            您的浏览器不支持视频播放
          </video>
        </el-form-item>
        <el-form-item label="Download" prop="isDownload">
          <el-switch
            v-model="form.isDownload"
            active-text=""
            inactive-text=""
          ></el-switch>
          <span style="color:red;font-size:14px;margin-left:30px;"
            >Tips:视频大于50M请不要勾选支持下载</span
          >
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
  list,
  addResource,
  delResource,
  editResource
} from '@/api/testApplet/resource.js'
import ImgPreview from '@/components/imgPreview.vue'
import Upload from '@/components/upload.vue'
import upload from '../../../../mixins/upload.js'
export default {
  name: 'video-list',
  components: {
    ImgPreview,
    Upload
  },
  mixins: [upload],
  props: {
    searchVideo: {
      type: Boolean,
      required: false
    },
    videoLabelRadio: {
      type: Boolean,
      required: true
    },
    radio: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      imgPreviewSrc: '',
      showImgPreview: false,
      pageSize: 20,
      pageNo: 1,
      title: '',
      form: {
        name: '',
        url: '',
        coverImageUrl: '',
        length: '',
        isDownload: true,
        type: 'video'
      },
      ruleForm: {
        url: [{ required: true, message: '请选择资源', trigger: 'change' }],
        coverImageUrl: [
          { required: true, message: '请选择封面图片', trigger: 'change' }
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
  },
  methods: {
    openDialog() {
      this.videoFileList = []
      this.coverImageFileList = []
      this.form = {
        name: '',
        url: '',
        coverImageUrl: '',
        length: '',
        isDownload: true,
        type: 'video'
      }
      this.uploadDialog = true
    },
    uploadVideo(file, fileList) {
      console.log(file)
      this.form.name = file.name
      this.handleUpload(file, fileList, 'url', 'videoFileList')
      setTimeout(() => {
        console.log(document.getElementById('videoplayer').duration)
        this.form.length = document.getElementById('videoplayer').duration
        console.log(this.form)
      }, 2000)
    },
    queryData() {
      this.pageNo = 1
      this.getVideoList()
    },
    uploadCover(file, fileList) {
      console.log(file)
      this.handleUpload(file, fileList, 'coverImageUrl', 'coverImageFileList')
      console.log(this.form)
    },
    openImgPreview(imgSrc) {
      this.imgPreviewSrc = imgSrc
      this.showImgPreview = true
    },
    getVideoList() {
      let params = {
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        title: this.title
      }
      console.log(params)
      list('video', params).then(res => {
        console.log(res)
        this.tableData = { ...res }
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
      // this.uploadDialog = true
      console.log(row)
      // this.form = {
      //   name: '',
      //   url: '',
      //   coverImageUrl: '',
      //   length: '',
      //   isDownload: true,
      //   type: 'video'
      // }
      this.form = { ...row }
      this.videoFileList.push({ url: row.url, name: row.name + `.mp4` })
      this.coverImageFileList.push({ url: row.coverImageUrl })
    },
    addVideo() {
      console.log(this.form)
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
