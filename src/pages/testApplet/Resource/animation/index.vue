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
    <div class="">
      <el-table :data="tableData.resources" border style="width: 100%">
        <el-table-column
          v-if="animationLabelRadio"
          label="选择"
          width="70"
          center
        >
          <template slot-scope="scope">
            <el-radio-group v-model="animationRadio">
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
        <el-table-column v-if="searchAnimation" label="Action" width="130">
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
      title="Upload Animation"
      :visible.sync="uploadDialog"
      append-to-body
    >
      <el-form
        :model="form"
        :rules="ruleForm"
        ref="addResourceForm"
        label-width="120px"
      >
        <el-form-item label="Animation File" prop="url">
          <upload
            @change="uploadAnimation"
            accept="image/gif"
            :fileList="animationFileList"
          ></upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="uploadDialog = false">Cancel</el-button>
        <el-button
          size="small"
          type="primary"
          @click="addForm('addResourceForm')"
          >Confirm</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, addResource, delResource } from '@/api/testApplet/resource.js'
import ImgPreview from '@/components/imgPreview.vue'
import Upload from '@/components/upload.vue'
import upload from '../../../../mixins/upload.js'
export default {
  name: 'animation-list',
  components: {
    ImgPreview,
    Upload
  },
  props: {
    searchAnimation: {
      type: Boolean,
      required: false
    },
    animationLabelRadio: {
      type: Boolean,
      required: true
    },
    radio: {
      type: String,
      required: false
    }
  },
  mixins: [upload],
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
        type: 'animation'
      },
      ruleForm: {
        url: [{ required: true, message: '请选择资源', trigger: 'change' }]
      },
      tableData: {
        resources: [],
        totalCount: 0
      },
      uploadDialog: false,
      animationFileList: [],
      env: 'dev'
    }
  },
  computed: {
    animationRadio: {
      get() {
        return this.radio
      },
      set() {}
    }
  },
  mounted() {
    this.getAnimationList()
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
      this.animationFileList = []
      this.form = {
        name: '',
        url: '',
        type: 'animation'
      }
      this.uploadDialog = true
    },

    uploadAnimation(file, fileList) {
      console.log(file)
      this.form.name = file.name
      this.handleUpload(file, fileList, 'url', 'animationFileList')
    },
    openImgPreview(imgSrc) {
      this.imgPreviewSrc = imgSrc
      this.showImgPreview = true
    },
    getAnimationList() {
      let params = {
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        title: this.title
      }
      console.log(params)
      list('animation', params).then(res => {
        console.log(res)
        this.tableData = { ...res }
      })
    },
    queryData() {
      this.pageNo = 1
      this.getAnimationList()
    },
    handleCurrentChange(pageNo) {
      this.pageNo = pageNo
      this.getAnimationList()
    },
    addForm(formName) {
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
            this.getAnimationList()
          })
        }
      })
    },
    deleteAction(row) {
      delResource(row.id).then(res => {
        console.log(res)
        this.getAnimationList()
      })
    },
    getCurrentRow(row) {
      this.$emit('getAnimationRow', row)
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
