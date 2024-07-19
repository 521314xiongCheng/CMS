<template>
  <div>
    <el-form
      style="width: 50%;margin-top: 30px"
      ref="form"
      :rules="ruleForm"
      :model="form"
      label-width="80px"
    >
      <el-form-item label="分类标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="抽奖机制" prop="prizeScript">
        <el-input
          type="textarea"
          :rows="5"
          v-model="form.prizeScript"
        ></el-input>
      </el-form-item>
      <el-form-item label="时间" prop="date">
        <el-date-picker
          @change="selectDate"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="form.date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
        <!--        <el-date-picker-->
        <!--          value-format="yyyy-MM-dd"-->
        <!--          v-model="form.date"-->
        <!--          type="daterange"-->
        <!--          range-separator="至"-->
        <!--          start-placeholder="开始日期"-->
        <!--          end-placeholder="结束日期"-->
        <!--        >-->
        <!--        </el-date-picker>-->
      </el-form-item>
      <el-form-item label="封面图片" prop="posterUrl">
        <upload
          @change="uploadPoster"
          accept="image/png, image/jpeg"
          :fileList="posterList"
        ></upload>
        <img
          @click="showImgPreview = true"
          v-if="editPage && form.posterUrl"
          style="width: 100px"
          :src="form.posterUrl"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
        <el-button @click="goBack()">取消</el-button>
      </el-form-item>
    </el-form>
    <img-preview
      :src="form.posterUrl"
      v-show="showImgPreview"
      @close="showImgPreview = false"
    ></img-preview>
  </div>
</template>

<script>
import upload from '../../../mixins/upload'
import Upload from '@/components/upload.vue'
import { addInquiry, updateInquiry } from '@/api/testApplet/inquiry/index.js'
import ImgPreview from '@/components/imgPreview.vue'
// import Image from "../../resource/image";

export default {
  components: {
    ImgPreview,
    // ImgPreview,
    Upload
  },
  mixins: [upload],
  name: 'testApplet-inquiry-edit',
  data() {
    return {
      form: {
        title: '',
        prizeScript: '',
        startTime: '',
        endTime: '',
        posterUrl: '',
        date: ''
      },
      ruleForm: {
        // url: [{ required: true, message: '请选择资源', trigger: 'change' }],
        title: [{ required: true, message: '请输入分类标题', trigger: 'blur' }],
        prizeScript: [
          { required: true, message: '请输入抽奖机制', trigger: 'blur' }
        ],
        startTime: [
          {
            required: true,
            message: '请选择开始日期和结束日期',
            trigger: 'change'
          }
        ],
        date: [
          {
            required: true,
            message: '请选择开始日期和结束日期',
            trigger: 'change'
          }
        ],
        posterUrl: [
          { required: true, message: '请上传资源', trigger: 'change' }
        ]
      },
      posterList: [],
      env: 'prod',
      editPage: false,
      showImgPreview: false
      // date:''
    }
  },
  mounted() {
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
    this.$route.query.id
    if (this.$route.query.id) {
      this.editPage = true
      let data = JSON.parse(sessionStorage.getItem('editRow'))
      console.log(data)
      this.form = { ...data }
      this.form.url = this.form.posterUrl
      this.$nextTick(() => {
        this.$set(this.form, 'date', [data.startTime, data.endTime])
        // this.$forceUpdate();
      })
      // this.form.date = [data.startTime, data.endTime]
    }
  },
  methods: {
    uploadPoster(file, fileList) {
      console.log(file)
      this.form.name = file.name
      this.handleUpload(file, fileList, 'url', 'posterList')
      this.form.posterUrl = ''
      this.editPage = false
      console.log(this.form)
    },
    selectDate(date) {
      console.log(date)
      // this.date = date
      if (date) {
        this.form.startTime = date[0]
        this.form.endTime = date[1]
      }
    },
    onSubmit(formName) {
      let url = ''
      if (this.form.url) {
        if (this.form.url.indexOf('amazonaws.com.cn') != -1) {
          console.log('dddddddddddddddddddd')
          url = this.form.url.replace(
            'bjs-s3-mdm-' +
              this.env +
              '-community-app.s3.cn-north-1.amazonaws.com.cn',
            this.env == 'prod' ? '' : this.env + '-community-s3.xxxxxxx.com.cn'
          )
          console.log(url)
          this.form.url = url
        }
      }
      console.log(this.form)
      this.form.posterUrl = this.form.url
      if (this.form.id) {
        updateInquiry(this.form).then(res => {
          console.log(res)
          this.$router.push({ name: 'testApplet-inquiry-index' })
        })
      } else {
        console.log(this.form)
        this.$refs[formName].validate(valid => {
          if (valid) {
            addInquiry(this.form).then(res => {
              console.log(res)
              this.$router.push({ name: 'testApplet-inquiry-index' })
            })
          }
        })
      }
    },
    goBack() {
      this.$router.push({ name: 'testApplet-inquiry-index' })
    }
  }
}
</script>

<style scoped></style>
