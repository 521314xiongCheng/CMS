<template>
  <div>
    <div class="el-menu g-page-bar text-right" style="padding: 10px 0;">
      <el-form ref="form">
        <el-input size="small" v-model="title" placeholder="Search" clearable>
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
      <el-table
        ref="picTable"
        :data="tableData.resources"
        border
        style="width: 100%"
      >
        <el-table-column label="Select" width="70" center>
          <template slot-scope="scope">
            <el-radio-group v-model="picRadio">
              <el-radio
                @change.native="getCurrentRow(scope.row)"
                :label="scope.row.id.toString()"
                >&nbsp;</el-radio
              >
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="name"></el-table-column>
        <el-table-column prop="url" label="url">
          <template slot-scope="scope">
            <img
              @click="openImgPreview(scope.row.url)"
              :src="scope.row.url"
              style="width: 50px;"
              alt
            />
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
      <img-preview
        :src="imgPreviewSrc"
        v-show="showImgPreview"
        @close="showImgPreview = false"
      ></img-preview>
    </div>

    <el-dialog
      title="Upload Picture"
      :visible.sync="uploadDialog"
      append-to-body
    >
      <el-form
        :model="form"
        :rules="ruleForm"
        ref="addResourceForm"
        label-width="100px"
      >
        <el-form-item label="Pictrue url" prop="url">
          <upload
            @change="uploadPicture"
            accept="image/png, image/jpeg"
            :fileList="picFileList"
          ></upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="uploadDialog = false">Cancel</el-button>
        <el-button
          size="small"
          type="primary"
          @click="addPicture('addResourceForm')"
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
import ImgPreview from '@/components/imgPreview.vue'
import Upload from '@/components/upload.vue'
import upload from '@/mixins/upload.js'
import Http from '@/api/http'
export default {
  name: 'picture-list',
  components: {
    ImgPreview,
    Upload
  },
  mixins: [upload],
  data() {
    return {
      imgPreviewSrc: '',
      showImgPreview: false,
      pageSize: 5,
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
      picFileList: []
      // picRadio: ''
    }
  },
  props: {
    radio: {
      type: String,
      required: false
    }
  },
  computed: {
    picRadio: {
      get() {
        return this.radio
      },
      set() {}
    }
  },
  mounted() {
    this.getPicList()
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
      this.picFileList = []
      this.form = {
        name: '',
        url: '',
        moduleId: '',
        resourceType: 'Image',
        property: '',
        client: 'BackEnd'
      }
      this.uploadDialog = true
    },
    uploadPicture(file, fileList) {
      this.form.name = file.name
      this.getImageSizeAsync(file.raw).then(res => {
        this.form.property = JSON.stringify(res)
        this.handleUpload(file, fileList, 'url', 'picFileList')
      })
      console.log(this.form)
    },
    openImgPreview(imgSrc) {
      this.imgPreviewSrc = imgSrc
      this.showImgPreview = true
    },
    getPicList() {
      let router_path = this.$route.path
      let pathArray = router_path.split('/')
      let params = {
        client: 'BackEnd',
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        name: this.title,
        resourceType: 'Image',
        modulePath: `/${pathArray[1]}`
      }
      getResourceList(params).then(res => {
        console.log(res)
        this.tableData = { ...res }
      })
    },
    queryData() {
      this.pageNo = 1
      this.getPicList()
    },
    handleCurrentChange(pageNo) {
      this.pageNo = pageNo
      this.getPicList()
    },
    addPicture(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.moduleId = this.moduleId
          addResource(this.form).then(res => {
            console.log(res)
            this.uploadDialog = false
            this.getPicList()
          })
        }
      })
    },
    deleteAction(row) {
      delResource(row.id).then(res => {
        console.log(res)
        this.getPicList()
      })
    },
    getCurrentRow(row) {
      this.$emit('getPicRow', row)
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
