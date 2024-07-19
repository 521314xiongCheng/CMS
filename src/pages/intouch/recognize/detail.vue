<template>
  <div class="recognize-list">
    <el-form
      :model="form"
      ref="form"
      label-width="150px"
      label-position="left"
      size="small"
    >
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span><b>设定 Push Notification 呈现信息</b></span>
        </div>
        <el-form-item label="推送消息标题" prop="notification_title">
          <!-- <el-input
            v-model="form.notification_title"
            style="width: 400px"
          ></el-input> -->
          {{ form.notification_title }}
        </el-form-item>
        <el-form-item label="推送消息描述" prop="notification_description">
          {{ form.notification_description }}
        </el-form-item>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span><b>设定「我的认可」list 页呈现信息</b></span>
        </div>
        <el-form-item label="认可图标" prop="icon_url">
          <img
            :src="form.icon_url"
            @click="previewByImg(form.icon_url)"
            style="width:100px;hight:100px"
          />
        </el-form-item>
        <el-form-item style="margin-bottom: 30px;" label="认可名称" prop="name">
          {{ form.name }}
        </el-form-item>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span><b>认可卡片背景图</b></span>
        </div>
        <el-form-item prop="certificate_image_url">
          <img
            @click="previewByImg(form.certificate_image_url)"
            :src="form.certificate_image_url"
            style="width:100px;hight:100px"
          /><br />
          <el-button
            type="text"
            v-if="form.certificate_image_url"
            @click="previewByCert"
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
              <div v-for="item in excelList" :key="item.url" class="file-list">
                <div class="whispace file-name">{{ item.url }}</div>
                <el-button type="text" @click="openDownload(item.url)"
                  >下载名单</el-button
                >
              </div>
            </el-col>
          </el-row>
        </el-form-item>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span><b>设定认可时间</b></span>
        </div>
        <el-form-item label="预设开始时间" prop="start_time">
          {{ form.start_time | formatDate }}
        </el-form-item> </el-card
      ><br />
      <div class="text-center">
        <el-button size="small" @click="cancel">Cancel</el-button>
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
import { clones } from '@/utility/index.js'
import { getRecognizeById, previewCert } from '@/api/xxxxxxx/recognize.js'
import { formatDate } from '@/utility/index.js'
export default {
  name: 'xxxxxxx-recognize-detail',
  components: {
    ImgPreview
  },
  filters: {
    formatDate: function(value) {
      return formatDate(value)
    }
  },
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
      excelList: []
    }
  },
  created() {
    this.$route.query.id
    this.getDetail()
  },
  methods: {
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
    openDownload(url) {
      window.open(url, '_blank')
    },
    previewByCert() {
      let req = {}
      req.bg = this.form.certificate_image_url
      previewCert(req)
        .then(res => {
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
    },
    previewByImg(url) {
      this.imgPreviewSrc = url
      this.showImgPreview = true
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

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}
.box-card {
  width: 1020px;
}
</style>
