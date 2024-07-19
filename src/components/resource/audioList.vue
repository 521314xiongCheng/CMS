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
    <div class>
      <el-table :data="tableData.resources" border style="width: 100%">
        <el-table-column label="Select" width="70" center>
          <template slot-scope="scope">
            <el-radio-group v-model="audioRadio">
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
        <el-table-column prop="url" label="AUDIO">
          <template slot-scope="scope">
            <a :href="scope.row.url" target="_blank">click the jump</a>
          </template>
        </el-table-column>
        <el-table-column label="Action" width="130">
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
// import { list, addResource, delResource } from '@/api/testApplet/resource.js'
import {
  getResourceList,
  addResource,
  delResource
} from '@/api/resource/resource.js'
import Upload from '@/components/upload.vue'
import upload from '@/mixins/upload.js'
import utilUpload from '@/utility/upload'
import Http from '@/api/http'
export default {
  name: 'audio-list',
  components: { Upload },
  mixins: [upload],
  data() {
    return {
      // radio:'',
      imgPreviewSrc: '',
      showImgPreview: false,
      pageSize: 6,
      pageNo: 1,
      title: '',
      form: {
        name: '',
        url: '',
        client: 'BackEnd',
        resourceType: 'Image',
        property: ''
      },
      moduleId: '',
      ruleForm: {
        url: [
          {
            required: true,
            message: 'Please select resources',
            trigger: 'change'
          }
        ]
      },
      tableData: {
        resources: [],
        totalCount: 0
      },
      uploadDialog: false,
      audioFileList: []
    }
  },
  props: {
    radio: {
      type: String,
      required: false
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
      this.audioFileList = []
      ;(this.form = {
        name: '',
        url: '',
        client: 'BackEnd',
        resourceType: 'Audio',
        property: ''
      }),
        (this.uploadDialog = true)
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

      this.getAudioInfoAsync(file.raw).then(res => {
        this.form.property = JSON.stringify(res)
        utilUpload(file.raw).then(res => {
          this.audioFileList.push(file)
          this.form.url = res
        })
      })
    },

    openImgPreview(imgSrc) {
      this.imgPreviewSrc = imgSrc
      this.showImgPreview = true
    },
    getAudioList() {
      let router_path = this.$route.path
      let pathArray = router_path.split('/')
      let params = {
        client: 'BackEnd',
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        name: this.title,
        resourceType: 'Audio',
        modulePath: `/${pathArray[1]}`
      }
      console.log(params)
      getResourceList(params).then(res => {
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
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.moduleId = this.moduleId
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
