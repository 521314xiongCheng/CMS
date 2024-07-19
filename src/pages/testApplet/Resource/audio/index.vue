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
    <div class="">
      <el-table :data="tableData.resources" border style="width: 100%">
        <el-table-column v-if="audioLabelRadio" label="选择" width="70" center>
          <template slot-scope="scope">
            <el-radio-group v-model="audioRadio">
              <el-radio
                @change.native="getCurrentRow(scope.row)"
                :label="scope.row.name"
                >&nbsp;</el-radio
              >
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="FileName"></el-table-column>
        <el-table-column prop="url" label="url"></el-table-column>
        <el-table-column prop="url" label="AUDIO">
          <template slot-scope="scope">
            <a :href="scope.row.url" target="_blank">click the jump</a>
          </template>
        </el-table-column>
        <el-table-column v-if="searchAudio" label="Action" width="130">
          <template slot-scope="scope">
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
    </div>
    <el-dialog title="Upload Audio" :visible.sync="uploadDialog" append-to-body>
      <el-form
        :model="form"
        :rules="ruleForm"
        ref="addResourceForm"
        label-width="100px"
      >
        <el-form-item label="Audio File" prop="url">
          <upload
            @change="uploadAudio"
            accept="audio/mp3"
            :fileList="audioFileList"
          ></upload>
          <audio
            style="display: none"
            id="audioplayer"
            v-bind:src="form.url"
            controls="controls"
          ></audio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="uploadDialog = false">Cancel</el-button>
        <el-button
          :disabled="!form.length"
          size="small"
          type="primary"
          @click="addAudio('addResourceForm')"
          >Confirm</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, addResource, delResource } from '@/api/testApplet/resource.js'
import Upload from '@/components/upload.vue'
// import upload from '../../../../mixins/upload.js'
import upload from '../../../../utility/upload.js'
export default {
  name: 'audio-list',
  components: { Upload },
  // mixins: [upload],
  props: {
    searchAudio: {
      type: Boolean,
      required: false
    },
    audioLabelRadio: {
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
      // radio:'',
      imgPreviewSrc: '',
      showImgPreview: false,
      pageSize: 20,
      pageNo: 1,
      title: '',
      form: {
        name: '',
        url: '',
        length: 0,
        type: 'audio'
      },
      ruleForm: {
        url: [{ required: true, message: '请选择资源', trigger: 'change' }]
      },
      tableData: {
        resources: [
          {
            name: 'ddd',
            // isDownload:'yes',
            url: 'http://pic26.nipic.com/20121221/9252150_142515375000_2.jpg'
          }
        ],
        totalCount: 0
      },
      uploadDialog: false,
      audioFileList: [],
      env: 'dev'
    }
  },
  computed: {
    audioRadio: {
      get() {
        return this.radio
      },
      set() {}
    }
  },
  mounted() {
    this.getAudioList()
    if (
      window.location.href.toLowerCase().indexOf('dev') > -1 ||
      window.location.href.toLowerCase().indexOf('qa') > -1 ||
      window.location.href.toLowerCase().indexOf('uat') > -1 ||
      window.location.href.toLowerCase().indexOf('localhost') > -1
    ) {
      this.env = 'dev'
    } else {
      this.env = 'prod'
    }
  },
  methods: {
    openDialog() {
      this.audioFileList = []
      this.form = {
        name: '',
        url: '',
        length: 0,
        type: 'audio'
      }
      this.uploadDialog = true
    },
    uploadAudio(file) {
      console.log(file)
      if (!file) {
        this.audioFileList = []
        this.form.name = ''
        this.form.length = 0
        return
      }
      this.form.name = file.name
      this.audioFileList.push(file)
      upload(file.raw).then(res => {
        this.form.url = res
        setTimeout(() => {
          console.log(document.getElementById('audioplayer').duration)
          this.form.length = document.getElementById('audioplayer').duration
          console.log(this.form)
        }, 1500)
      })
    },

    openImgPreview(imgSrc) {
      this.imgPreviewSrc = imgSrc
      this.showImgPreview = true
    },
    getAudioList() {
      let params = {
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        title: this.title
      }
      console.log(params)
      list('audio', params).then(res => {
        console.log(res)
        this.tableData = { ...res }
      })
    },
    queryData() {
      this.pageNo = 1
      this.getAudioList()
    },
    handleCurrentChange(pageNo) {
      this.pageNo = pageNo
      this.getAudioList()
    },
    addAudio(formName) {
      let url = ''
      if (this.form.url) {
        if (this.form.url.indexOf('amazonaws.com.cn') != -1) {
          url = this.form.url.replace(
            'bjs-s3-mdm-' +
              this.env +
              '-community-app.s3.cn-north-1.amazonaws.com.cn',
            this.env == 'prod'
              ? 'community-s3.xxxxxxx.com.cn'
              : this.env + '-community-s3.xxxxxxx.com.cn'
          )
          console.log(url)
          this.form.url = url
        }
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          addResource(this.form).then(res => {
            console.log(res)
            this.uploadDialog = false
            this.getAudioList()
          })
        }
      })
    },
    deleteAction(row) {
      delResource(row.id).then(res => {
        console.log(res)
        this.getAudioList()
      })
    },
    getCurrentRow(row) {
      this.$emit('getAudioRow', row)
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
