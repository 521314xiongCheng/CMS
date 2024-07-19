<template>
  <div class="recognize-list">
    <el-form
      :model="form"
      ref="form"
      :rules="rules"
      label-width="150px"
      label-position="left"
      size="small"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span><b>设定 Push Notification 呈现信息</b></span>
        </div>
        <el-form-item label="推送消息标题" prop="notification_title">
          <el-input
            v-model="form.notification_title"
            style="width: 400px"
          ></el-input>
          <span style="margin-left: 10px;">*18个汉字以内</span>
        </el-form-item>
        <el-form-item label="推送消息描述" prop="notification_description">
          <el-input
            type="textarea"
            v-model="form.notification_description"
            :autosize="{ minRows: 10, maxRows: 300 }"
            style="width: 470px"
          ></el-input>
          <span style="margin-left: 10px;">*建议控制在40个汉字以内</span>
        </el-form-item>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span><b>设定「我的认可」list 页呈现信息</b></span>
        </div>
        <el-form-item label="认可图标" prop="icon_url">
          <upload
            @change="
              (file, fileList) => {
                fileChange(
                  file,
                  fileList,
                  {
                    width: 190,
                    height: 190,
                    size: 1024
                  },
                  'icon_url',
                  'iconUrlList'
                )
              }
            "
            @remove="delCertIcon()"
            accept="image/png, image/jpeg"
            :fileList="iconUrlList"
          ></upload>
          <p>* 尺寸：190px*190px</p>
        </el-form-item>
        <el-form-item style="margin-bottom: 30px;" label="认可名称" prop="name">
          <el-input v-model="form.name" style="width: 400px"></el-input>
          <span style="margin-left: 10px;">*18个汉字以内</span>
        </el-form-item>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span><b>认可卡片背景图</b></span>
        </div>
        <el-form-item prop="certificate_image_url">
          <upload
            @change="
              (file, fileList) => {
                fileChange(
                  file,
                  fileList,
                  {
                    width: 900,
                    height: 1305,
                    size: 200
                  },
                  'certificate_image_url',
                  'certificateImageUrlList'
                )
              }
            "
            @remove="delCertImg()"
            accept="image/png, image/jpeg"
            :fileList="certificateImageUrlList"
          ></upload>
          <p>* 尺寸：900px*1305px</p>
          <el-button
            type="text"
            v-if="form.certificate_image_url"
            @click="preview"
            >预览证书效果</el-button
          >
        </el-form-item>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span><b>导入名单</b></span>
        </div>
        <el-form-item prop="user_list_url">
          <el-row>
            <el-col :span="24">
              <el-upload
                class="upload-demo"
                ref="upload"
                action=""
                :autoUpload="false"
                :on-remove="delExcel"
                :on-change="uploadExcel"
                :multiple="false"
                :show-file-list="false"
                accept=".xls,.xlsx"
              >
                <el-button slot="trigger" size="small" type="primary"
                  >Upload</el-button
                >
                <el-button
                  size="small"
                  style="margin-left:20px;"
                  type="text"
                  @click="openDownload()"
                  >下载模板</el-button
                >
                <div slot="tip" class="el-upload__tip">
                  只能上传 .xls/.xlsx文件，且不超过2M
                </div>
                <div
                  v-for="item in excelList"
                  :key="item.url"
                  class="file-list"
                >
                  <div class="whispace file-name">{{ item.url }}</div>
                  <el-button type="text" @click="openDownload(item.url)"
                    >下载名单</el-button
                  >
                  <el-button type="text" @click="delExcel">删除</el-button>
                </div>
              </el-upload>
            </el-col>
          </el-row>
        </el-form-item>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span><b>设定认可时间</b></span>
        </div>
        <el-form-item label="预设开始时间" prop="start_time">
          <el-date-picker
            v-model="form.start_time"
            type="datetime"
            value-format="timestamp"
            placeholder="Please select the StartTime"
            style="width: 300px"
          >
          </el-date-picker>
        </el-form-item> </el-card
      ><br />
      <div class="text-center">
        <el-button size="small" @click="cancel">Cancel</el-button>
        <el-button size="small" type="primary" @click="submit('form')"
          >Confirm</el-button
        >
      </div>
    </el-form>
    <img-preview
      :src="imgPreviewSrc"
      v-show="showImgPreview"
      @close="showImgPreview = false"
    ></img-preview>
  </div>
</template>

<script>
import ImgPreview from '@/components/imgPreview.vue'
import upload from '@/mixins/upload.js'
import {
  addRecognize,
  updateRecognize,
  getRecognizeById,
  previewCert
} from '@/api/xxxxxxx/recognize.js'
import restfulMixin from '@/mixins/restful.js'
import { clones, treeData2Arr, getImageSizeAsync } from '@/utility/index.js'
import storage from 'good-storage'
import { uploadToResource } from '@/api/index.js'
import Upload from '@/components/xxxxxxx/uploadFile'
export default {
  name: 'xxxxxxx-recognize-edit',
  components: {
    Upload,
    ImgPreview
  },
  mixins: [restfulMixin, upload],
  data() {
    return {
      form: {
        name: '',
        start_time: '', // 认可时间
        notification_title: '',
        notification_description: '',
        icon_url: '', // icon
        user_list_url: '', // 认可名单
        certificate_image_url: ''
      },
      imgPreviewSrc: '',
      showImgPreview: false,
      iconUrlList: [],
      certificateImageUrlList: [],
      excelList: [],
      rules: {
        notification_title: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        notification_description: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        icon_url: [{ required: true, message: '必填项', trigger: 'blur' }],
        name: [{ required: true, message: '必填项', trigger: 'blur' }],
        certificate_image_url: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        user_list_url: [{ required: true, message: '必填项', trigger: 'blur' }],
        start_time: [{ required: true, message: '必填项', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.$route.query.id && this.getDetail()
  },
  methods: {
    async fileChange(file, fileList, fileSize, fileUrl, fileArray) {
      let imgInfo = await getImageSizeAsync(file)
      if (!file || fileSize.width != 'auto') {
        if (
          imgInfo.width !== fileSize.width ||
          imgInfo.height !== fileSize.height
        ) {
          this.$notify.error({
            title: 'Error',
            message: `尺寸：${fileSize.width}px*${fileSize.height}px`,
            duration: 3000
          })
        } else {
          this.customUploadObjectKey(
            {
              file: file,
              fileList: fileList,
              fileUrl: fileUrl,
              fileArray: fileArray,
              objectKey: 'xxxxxxxRecognize'
            },
            url => {
              if (url) {
                this.uploadImageToResource(
                  file.name.substring(0, file.name.lastIndexOf('.')),
                  url
                )
              }
            }
          )
        }
      } else {
        this.customUploadObjectKey(
          {
            file: file,
            fileList: fileList,
            fileUrl: fileUrl,
            fileArray: fileArray,
            objectKey: 'xxxxxxxRecognize'
          },
          url => {
            if (url) {
              this.uploadImageToResource(
                file.name.substring(0, file.name.lastIndexOf('.')),
                url
              )
            }
          }
        )
      }
    },
    uploadImageToResource(name, url) {
      console.log(this.form)
      let moduleId
      let menus = storage.get('menus')
      moduleId = treeData2Arr(menus, 'subMenus').filter(
        o => o.path === '/xxxxxxx/recognize'
      )[0].id
      let data = {
        name: name,
        moduleId: moduleId,
        url: url,
        resourceType: 'Image',
        client: 'BackEnd'
      }
      uploadToResource(data)
    },
    getDetail() {
      getRecognizeById(this.$route.query.id).then(res => {
        console.log(res)
        this.form = clones(res.data)
        console.log(this.form)
        this.form.id = this.$route.query.id

        if (this.form.icon_url) {
          this.iconUrlList = [
            {
              name: this.form.icon_url,
              url: this.form.icon_url
            }
          ]
        }
        if (this.form.certificate_image_url) {
          this.certificateImageUrlList = [
            {
              name: this.form.certificate_image_url,
              url: this.form.certificate_image_url
            }
          ]
        }
        if (this.form.user_list_url) {
          this.excelList.push({
            url: this.form.user_list_url,
            name: this.form.user_list_url
          })
        }
      })
    },
    cancel() {
      this.$router.push({ name: 'xxxxxxx-recognize-index' })
    },
    submit(form) {
      console.log(this.form)
      this.$refs[form].validate(vaild => {
        if (vaild) {
          let param = {
            name: this.form.name,
            start_time: this.form.start_time,
            notification_title: this.form.notification_title,
            notification_description: this.form.notification_description,
            icon_url: this.form.icon_url,
            certificate_image_url: this.form.certificate_image_url,
            user_list_url: this.form.user_list_url
          }
          if (this.form.id > 0) {
            updateRecognize(param, this.form.id).then(res => {
              console.log(res)
              this.$message({
                type: 'success',
                message: '更新成功！'
              })
              this.$router.push({ name: 'xxxxxxx-recognize-index' })
            })
          } else {
            addRecognize(param).then(res => {
              console.log(res)
              this.$message({
                type: 'success',
                message: '添加成功！'
              })
              this.$router.push({ name: 'xxxxxxx-recognize-index' })
            })
          }
        } else {
          return false
        }
      })
    },
    openDownload(url) {
      let downloadUrl = url
        ? url
        : 'https://dev-community-s3.xxxxxxx.com.cn/DEV/MyBizxxxxxxx_Content_Cms/xxxxxxxRecognize/20210412174404_828.xlsx'
      window.open(downloadUrl, '_blank')
    },
    uploadExcel(file, fileList) {
      let suffix = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (suffix == 'xls' || suffix == 'xlsx') {
        this.customUploadObjectKey(
          {
            file: file,
            fileList: fileList,
            fileUrl: 'user_list_url',
            fileArray: 'excelList',
            objectKey: 'xxxxxxxRecognize'
          },
          url => {
            this.excelList = []
            this.excelList.push({
              url: url,
              name: url
            })
          }
        )
      } else {
        this.$notify.error({
          title: 'Error',
          message: `The file type must be xls/xlsx`,
          duration: 3000
        })
      }
    },
    delExcel() {
      this.form.user_list_url = null
      this.excelList = []
    },
    delCertImg() {
      this.form.certificate_image_url = null
      this.certificateImageUrlList = []
    },
    delCertIcon() {
      this.form.icon_url = null
      this.iconUrlList = []
    },
    preview() {
      let req = {}
      req.bg = this.form.certificate_image_url
      previewCert(req)
        .then(res => {
          debugger
          return (
            'data:image/png;base64,' +
            btoa(
              new Uint8Array(res).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            )
          )
        })
        .then(base64 => {
          this.imgPreviewSrc = base64
          this.showImgPreview = true
        })
    }
  }
}
</script>
<style lang="less" scoped>
.recognize-list {
  width: 1020px;
  /deep/ .el-upload-list__item-name {
    margin-right: 0;
  }
  /deep/ .img-preview-component {
    img {
      height: 100%;
    }
  }
}
.input-img-url {
  position: absolute;
  left: 90px;
  width: 305px !important;
}
</style>
