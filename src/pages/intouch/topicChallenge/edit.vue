<template>
  <div class="topic-list">
    <el-form
      :model="form"
      ref="form"
      :rules="rules"
      label-width="180px"
      label-position="left"
      size="small"
    >
      <el-form-item label="活动名称" prop="title">
        <el-input v-model="form.title" style="width: 400px"></el-input>
        <span style="margin-left: 10px;"
          >建议字数限制在15个字内，超出可以保存，但是前端展示会不全面</span
        >
      </el-form-item>
      <el-form-item label="生效时间" prop="activityTime">
        <el-date-picker
          v-model="activityTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="Start Time"
          end-placeholder="End Time"
          @change="dateChange"
          value-format="timestamp"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="首页露出封面图" prop="banner_image">
        <upload
          @change="
            (file, fileList) => {
              fileChange(
                file,
                fileList,
                {
                  width: 990,
                  height: 480,
                  size: 200
                },
                'banner_image',
                'bannerImageUrlList'
              )
            }
          "
          @remove="delbannerImage"
          accept="image/png, image/jpeg"
          :fileList="bannerImageUrlList"
        ></upload>
        <p>* 尺寸：990px*480px</p>
      </el-form-item>

      <el-form-item label="列表露出封面图" prop="list_page_image">
        <upload
          @change="
            (file, fileList) => {
              fileChange(
                file,
                fileList,
                {
                  width: 261,
                  height: 261,
                  size: 200
                },
                'list_page_image',
                'listPageUrlList'
              )
            }
          "
          @remove="delListPageImage"
          accept="image/png, image/jpeg"
          :fileList="listPageUrlList"
        ></upload>
        <p>* 尺寸：261px*261px</p>
      </el-form-item>
      <el-form-item label="详情页顶部背景图" prop="background_image">
        <upload
          @change="
            (file, fileList) => {
              fileChange(
                file,
                fileList,
                {
                  width: 1125,
                  height: 591,
                  size: 200
                },
                'background_image',
                'backgroundUrlList'
              )
            }
          "
          @remove="delBackGroundImage"
          accept="image/png, image/jpeg"
          :fileList="backgroundUrlList"
        ></upload>
        <p>* 尺寸：1125px*591</p>
      </el-form-item>

      <el-form-item label="发起人名称" prop="sponsor_name">
        <el-input v-model="form.sponsor_name" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="发起人头像" prop="sponsor_avatar_url">
        <upload
          @change="
            (file, fileList) => {
              fileChange(
                file,
                fileList,
                {
                  width: 120,
                  height: 120,
                  size: 200
                },
                'sponsor_avatar_url',
                'sponsorAvatarImageUrlList'
              )
            }
          "
          @remove="delSponsorAvatarUrl"
          accept="image/png, image/jpeg"
          :fileList="sponsorAvatarImageUrlList"
        ></upload>
        <p>* 尺寸：120px*120</p>
      </el-form-item>

      <el-form-item label="活动详情介绍图" prop="description_image">
        <upload
          @change="
            (file, fileList) => {
              fileChange(
                file,
                fileList,
                {
                  width: 'auto',
                  height: 'auto',
                  size: 'auto'
                },
                'description_image',
                'descriptionImageUrlList'
              )
            }
          "
          @remove="delDescriptionImage"
          accept="image/png, image/jpeg"
          :fileList="descriptionImageUrlList"
        ></upload>
        <p>* 建议宽度：1125px</p>
      </el-form-item>
      <el-form-item label="详情介绍文字" prop="description">
        <el-input
          type="textarea"
          v-model="form.description"
          :autosize="{ minRows: 10, maxRows: 300 }"
          style="width: 870px"
        ></el-input>
      </el-form-item>

      <el-form-item label="排行榜露出" prop="enable_show_ranking_list">
        <el-radio-group v-model="form.enable_show_ranking_list">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        label="排行榜标题"
        v-if="form.enable_show_ranking_list === '1'"
        prop="ranking_list_title"
      >
        <el-input
          v-model="form.ranking_list_title"
          style="width: 400px"
        ></el-input
        ><span style="margin-left: 10px;"
          >建议字数限制在15个字内，超出可以保存，但是前端展示会不全面</span
        >
      </el-form-item>

      <el-form-item
        label="名单"
        v-if="form.enable_show_ranking_list === '1'"
        prop="ranking_list"
      >
        <!--        <el-input type="textarea" v-model="form.ranking_list"></el-input>-->
        <el-button
          type="primary"
          size="small"
          @click="addIdDialogForm = true"
          >{{ $route.query.id ? '编辑' : '新增' }}</el-button
        >
        <div v-if="form.ranking_list">{{ form.ranking_list.join(',') }}</div>
      </el-form-item>

      <el-form-item
        label="精品智库专题封面图"
        prop="selling_tool_subject_banner"
      >
        <upload
          @change="
            (file, fileList) => {
              fileChange(
                file,
                fileList,
                {
                  width: 750,
                  height: 320,
                  size: 300
                },
                'selling_tool_subject_banner',
                'sellingToolSubjectBannerUrlList'
              )
            }
          "
          @remove="delSellingToolSubjectBanner()"
          accept="image/png, image/jpeg"
          :fileList="sellingToolSubjectBannerUrlList"
        ></upload>
        <p>*尺寸为750*320，大小不超过300kb</p>
        <p>* 可以不配置，如果精品智库专题跳转URL填写，该字段为必填</p>
      </el-form-item>
      <el-form-item
        label="精品智库专题跳转URL"
        prop="selling_tool_subject_schema"
      >
        <el-input
          v-model="form.selling_tool_subject_schema"
          style="width: 800px"
        ></el-input>
        <p>* 可以不配置，如果上传精品智库专题背景图，该字段为必填</p>
      </el-form-item>
      <div class="text-center">
        <el-button size="small" @click="cancel">Cancel</el-button>
        <el-button size="small" type="primary" @click="submit('form')"
          >Confirm</el-button
        >
      </div>
    </el-form>

    <el-dialog
      :close-on-click-modal="false"
      title="编辑名单"
      width="50%"
      :visible.sync="addIdDialogForm"
    >
      <el-form
        :model="form2"
        ref="form2"
        :rules="rules2"
        label-width="150px"
        label-position="left"
        size="small"
      >
        <el-form-item label="名单(DirectSellerId)" prop="ranking_list">
          <el-input
            type="textarea"
            :autosize="{ minRows: 10, maxRows: 100 }"
            v-model="form2.ranking_list"
            style="width: 400px"
          ></el-input>
          <span style="margin-left: 10px;">支持回车换行，一行一个名单</span>
        </el-form-item>
        <el-form-item label="" prop="ranking_list">
          <el-button size="small" @click="addIdDialogForm = false"
            >取消</el-button
          >
          <el-button size="small" type="primary" @click="submit2('form2')"
            >确定</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import upload from '@/mixins/upload.js'
import { addTopic, updateTopic, getTopicById } from '@/api/xxxxxxx/topic.js'
import restfulMixin from '@/mixins/restful.js'
import { clones, treeData2Arr, getImageSizeAsync } from '@/utility/index.js'
import storage from 'good-storage'
import { uploadToResource } from '@/api/index.js'
// import Upload from '@/components/upload'
import Upload from '@/components/xxxxxxx/uploadFile'
export default {
  name: 'xxxxxxx-topicChallenge-edit',
  components: {
    Upload
  },
  mixins: [restfulMixin, upload],
  data() {
    let that = this
    let validatorEmpty = (rule, value, callback) => {
      if (value.trim().length == 0) {
        callback(new Error('必填项'))
      }
      callback()
    }
    let validatorPublishTime = (rule, value, callback) => {
      if (!that.activityTime.length && that.activityTime.length != 2) {
        callback(new Error('请选择生效时间'))
      }
      let start_date = that.activityTime[0]
      let end_date = that.activityTime[1]
      if (start_date > end_date) {
        callback(new Error('开始时间不能大于结束时间'))
      }
      callback()
    }
    let validatorSellingToolSubjectSchema = (rule, value, callback) => {
      if (
        that.form &&
        that.form.selling_tool_subject_banner &&
        that.form.selling_tool_subject_banner.trim()
      ) {
        if (!that.form.selling_tool_subject_schema.trim()) {
          callback(new Error('精品智库专题跳转URL不能为空'))
        }
      }
      callback()
    }
    let validatorSellingToolSubjectBanner = (rule, value, callback) => {
      if (
        that.form &&
        that.form.selling_tool_subject_schema &&
        that.form.selling_tool_subject_schema.trim()
      ) {
        if (!that.form.selling_tool_subject_banner.trim()) {
          callback(new Error('精品智库专题封面图不能为空'))
        }
      }
      callback()
    }
    return {
      form: {
        title: '',
        banner_image: '',
        description_image: '',
        start_date: 0,
        end_date: 0,
        background_image: '', //	string必须 背景图片
        list_page_image: '', //	string列表露出封面图片
        sponsor_name: '', //发起人姓名
        sponsor_avatar_url: '', //发起人头像
        description: '', //详情介绍文字
        enable_show_ranking_list: '1', //是否显示排行榜，0表示不显示，1表示被显示
        ranking_list_title: '', // 排行榜标题
        ranking_list: '', //direct_seller_id 的数组
        selling_tool_subject_banner: '',
        selling_tool_subject_schema: ''
      },
      sellingToolSubjectBannerUrlList: [],
      bannerImageUrlList: [],
      descriptionImageUrlList: [],
      sponsorAvatarImageUrlList: [],
      listPageUrlList: [],
      backgroundUrlList: [],
      addIdDialogForm: false,
      rules: {
        title: [{ required: true, validator: validatorEmpty, trigger: 'blur' }],
        activityTime: [
          { required: true, validator: validatorPublishTime, trigger: 'blur' }
        ],
        banner_image: [{ required: true, message: '必填项', trigger: 'blur' }],
        description_image: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        sponsor_name: [
          { required: true, validator: validatorEmpty, trigger: 'blur' }
        ],
        sponsor_avatar_url: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        description: [
          { required: true, validator: validatorEmpty, trigger: 'blur' }
        ],
        list_page_image: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        background_image: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        ranking_list: [{ required: true, message: '必填项', trigger: 'blur' }],
        ranking_list_title: [
          { required: true, validator: validatorEmpty, trigger: 'blur' }
        ],
        selling_tool_subject_schema: [
          {
            required: true,
            validator: validatorSellingToolSubjectSchema,
            trigger: 'blur'
          }
        ],
        selling_tool_subject_banner: [
          {
            required: true,
            validator: validatorSellingToolSubjectBanner,
            trigger: 'blur'
          }
        ]
      },
      activityTime: [],
      sortButtonState: true,
      form2: {
        ranking_list: '' //direct_seller_id 的数组
      },
      rules2: {
        ranking_list: [{ required: true, message: '必填项', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.$route.query.id && this.getDetail()
  },
  methods: {
    async fileChange(file, fileList, fileSize, fileUrl, fileArray) {
      let imgInfo = await getImageSizeAsync(file)
      console.log(imgInfo)
      // if (
      //   !file ||
      //   !checkImageSize(file, fileSize.size) ||
      //   imgInfo.width !== fileSize.width ||
      //   imgInfo.height !== fileSize.height
      // ) {
      //   this.$notify.error({
      //     title: 'Error',
      //     message: `尺寸：${fileSize.width}px*${fileSize.height}px,大小控制在${fileSize.size}kb以内`,
      //     duration: 3000
      //   })
      // }
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
              objectKey: 'xxxxxxxTopic'
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
            objectKey: 'xxxxxxxTopic'
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
        o => o.path === '/xxxxxxx/topicChallenge'
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
    dateChange(v) {
      if (!v) {
        this.activityTime = []
      }
    },
    getDetail() {
      getTopicById(this.$route.query.id).then(res => {
        console.log(res)
        this.form = clones(res.data)
        console.log(this.form)
        this.form.id = this.$route.query.id

        this.form.enable_show_ranking_list = this.form.enable_show_ranking_list
          ? '1'
          : '0'
        this.form.enable_show_ranking_list &&
          (this.form2.ranking_list = this.form.ranking_list.join('\n'))
        if (this.form.banner_image) {
          this.activityTime = [this.form.start_date, this.form.end_date]
          this.bannerImageUrlList = [
            {
              name: this.form.banner_image,
              url: this.form.banner_image
            }
          ]
        }
        if (this.form.description_image) {
          this.descriptionImageUrlList = [
            {
              name: this.form.description_image,
              url: this.form.description_image
            }
          ]
        }
        if (this.form.list_page_image) {
          this.listPageUrlList = [
            {
              name: this.form.list_page_image,
              url: this.form.list_page_image
            }
          ]
        }

        if (this.form.background_image) {
          this.backgroundUrlList = [
            {
              name: this.form.background_image,
              url: this.form.background_image
            }
          ]
        }
        if (this.form.sponsor_avatar_url) {
          this.sponsorAvatarImageUrlList = [
            {
              name: this.form.sponsor_avatar_url,
              url: this.form.sponsor_avatar_url
            }
          ]
        }
        if (this.form.selling_tool_subject_banner) {
          this.sellingToolSubjectBannerUrlList = [
            {
              name: this.form.selling_tool_subject_banner,
              url: this.form.selling_tool_subject_banner
            }
          ]
        }
      })
    },
    cancel() {
      this.$router.push({ name: 'xxxxxxx-topicChallenge-index' })
    },
    submit(form) {
      console.log(this.form)
      this.$refs[form].validate(vaild => {
        if (vaild) {
          let param = {
            title: this.form.title,
            banner_image: this.form.banner_image,
            description_image: this.form.description_image,
            start_date: this.activityTime ? this.activityTime[0] : null,
            end_date: this.activityTime ? this.activityTime[1] : null,
            background_image: this.form.background_image, //	string必须 背景图片
            list_page_image: this.form.list_page_image, //	string列表露出封面图片
            sponsor_name: this.form.sponsor_name, //发起人姓名
            sponsor_avatar_url: this.form.sponsor_avatar_url, //发起人头像
            description: this.form.description, //详情介绍文字
            enable_show_ranking_list:
              this.form.enable_show_ranking_list === '1' ? true : false, //是否显示排行榜，0表示不显示，1表示被显示
            selling_tool_subject_schema: this.form.selling_tool_subject_schema,
            selling_tool_subject_banner: this.form.selling_tool_subject_banner
          }
          if (this.form.enable_show_ranking_list === '1') {
            ;(param.ranking_list_title = this.form.ranking_list_title), // 排行榜标题
              (param.ranking_list = this.form.ranking_list) //direct_seller_id 的数组
          }
          if (this.form.id > 0) {
            updateTopic(param, this.form.id).then(res => {
              console.log(res)
              this.$message({
                type: 'success',
                message: '成功！'
              })
              this.$router.push({ name: 'xxxxxxx-topicChallenge-index' })
            })
          } else {
            addTopic(param).then(res => {
              console.log(res)
              this.$message({
                type: 'success',
                message: '成功！'
              })
              this.$router.push({ name: 'xxxxxxx-topicChallenge-index' })
            })
          }
        } else {
          return false
        }
      })
    },
    submit2(form) {
      this.$refs[form].validate(vaild => {
        if (vaild) {
          let texts = this.form2.ranking_list.split('\n')
          let ids = texts.filter(function(e) {
            if (e.trim() != '') {
              return e
            }
          })
          if (ids.length < 3) {
            this.$message({
              type: 'warning',
              message: '请至少填写3个'
            })
          } else {
            this.addIdDialogForm = false
            this.form.ranking_list = ids
            console.log(this.form)
          }

          // console.log(this.form2.ranking_list.split('\n'))
        }
      })
    },
    delSellingToolSubjectBanner() {
      this.form.selling_tool_subject_banner = null
      this.sellingToolSubjectBannerUrlList = []
      this.form.selling_tool_subject_schema = ''
    },
    delbannerImage() {
      this.form.banner_image = null
      this.bannerImageUrlList = []
    },
    delListPageImage() {
      this.form.list_page_image = null
      this.listPageUrlList = []
    },
    delBackGroundImage() {
      this.form.background_image = null
      this.backgroundUrlList = []
    },
    delSponsorAvatarUrl() {
      this.form.sponsor_avatar_url = null
      this.sponsorAvatarImageUrlList = []
    },
    delDescriptionImage() {
      this.form.description_image = null
      this.descriptionImageUrlList = []
    }
  }
}
</script>
<style lang="less" scoped>
.topic-list {
  width: 1020px;
  /deep/ .el-upload-list__item-name {
    margin-right: 0;
  }
}
.input-img-url {
  position: absolute;
  left: 90px;
  width: 305px !important;
}
</style>
