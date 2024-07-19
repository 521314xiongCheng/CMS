<template>
  <div>
    <div>
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px">
        <el-form-item label="封面" prop="coverImageUrl">
          <upload
            @change="uploadCover"
            accept="image/png, image/jpeg"
            :fileList="coverImageFileList"
          ></upload>
        </el-form-item>
        <el-form-item label="文章ID">{{
          this.form.id ? this.form.id : '课程创建后自动生成'
        }}</el-form-item>
        <el-form-item label="文章标题" prop="title">
          <el-input
            size="medium"
            style="width:50%"
            maxlength="maxLength"
            v-model="form.title"
          ></el-input>
        </el-form-item>
        <el-form-item label="Course" prop="articleDetails">
          <div style="background:#eee;padding: 6px 10px;">
            <span style="margin-right:15px;"
              >Detail description select add content</span
            >
            <el-button
              @click="selectResourceFn('Text')"
              size="medium"
              :type="btnFlag === 'Textflag' ? 'default' : 'primary'"
              >Text</el-button
            >
            <el-button
              @click="selectResourceFn('Picture')"
              size="medium"
              :type="btnFlag === 'Pictureflag' ? 'default' : 'primary'"
              >Picture</el-button
            >
            <!-- 暂时删去 -->
            <!-- <el-button
              @click="selectResourceFn('Video')"
              size="medium"
              :type="btnFlag === 'Videoflag' ? 'default' : 'primary'"
              >Video(.mp4)</el-button
            > -->
            <el-button
              @click="selectResourceFn('Audio')"
              size="medium"
              :type="btnFlag === 'Audioflag' ? 'default' : 'primary'"
              >Audio(.mp3)</el-button
            >
            <el-button
              @click="selectResourceFn('Animation')"
              size="medium"
              :type="btnFlag === 'Animationflag' ? 'default' : 'primary'"
              >Animation(.gif)</el-button
            >
          </div>
        </el-form-item>
        <div v-if="articleList.length">
          <div v-for="(item, index) in articleList" :key="item.sort">
            <div v-if="item.type === 'Text'" style="margin-top: 5px;">
              <div class="editor-wrap">
                <text-editor
                  :editorContent="item.content"
                  @editorChange="event => editorChange(event, item)"
                ></text-editor>
              </div>
              <div class="operat_btn" style="margin-top: 33px;">
                <el-button
                  size="mini"
                  @click="upEditor(index)"
                  :disabled="index == 0"
                  >↑</el-button
                ><br />
                <el-button size="mini" @click="removeEditor(index)" class="mt10"
                  >X</el-button
                ><br />
                <el-button size="mini" @click="copyResource(index)" class="mt10"
                  >+</el-button
                ><br />
                <el-button
                  size="mini"
                  @click="downEditor(index)"
                  class="mt10"
                  :disabled="index == articleList.length - 1"
                  >↓</el-button
                >
                <div class="select_btn" v-show="articleList[index].showBtn">
                  <el-button
                    @click="selectResourceFn('Text', index)"
                    size="mini"
                    type="primary"
                    >Text</el-button
                  ><br />
                  <el-button
                    @click="selectResourceFn('Picture', index)"
                    class="mt10"
                    size="mini"
                    type="primary"
                    >Picture</el-button
                  ><br />
                  <!--                  <el-button-->
                  <!--                    @click="selectResourceFn('Video', index)"-->
                  <!--                    class="mt10"-->
                  <!--                    size="mini"-->
                  <!--                    type="primary"-->
                  <!--                    >Video(.mp4)</el-button-->
                  <!--                  ><br />-->
                  <el-button
                    @click="selectResourceFn('Audio', index)"
                    class="mt10"
                    size="mini"
                    type="primary"
                    >Audio(.mp3)</el-button
                  ><br />
                  <el-button
                    @click="selectResourceFn('Animation', index)"
                    class="mt10"
                    size="mini"
                    type="primary"
                    >Animation(.gif)</el-button
                  >
                </div>
              </div>
            </div>
            <div v-else-if="item.type === 'Picture'" class="resource-wrap">
              <img
                :src="item.content"
                style="width:88px;vertical-align: middle;"
              />
              <div class="operat_btn">
                <el-button
                  size="mini"
                  @click="upEditor(index)"
                  :disabled="index == 0"
                  >↑</el-button
                ><br />
                <el-button size="mini" @click="removeEditor(index)" class="mt10"
                  >X</el-button
                ><br />
                <el-button size="mini" @click="copyResource(index)" class="mt10"
                  >+</el-button
                ><br />
                <el-button
                  size="mini"
                  class="mt10"
                  @click="downEditor(index)"
                  :disabled="index == articleList.length - 1"
                  >↓</el-button
                >
                <div class="select_btn" v-show="item.showBtn">
                  <el-button
                    @click="selectResourceFn('Text', index)"
                    size="mini"
                    type="primary"
                    >Text</el-button
                  ><br />
                  <el-button
                    @click="selectResourceFn('Picture', index)"
                    class="mt10"
                    size="mini"
                    type="primary"
                    >Picture</el-button
                  ><br />
                  <!--                  <el-button-->
                  <!--                    @click="selectResourceFn('Video', index)"-->
                  <!--                    class="mt10"-->
                  <!--                    size="mini"-->
                  <!--                    type="primary"-->
                  <!--                    >Video(.mp4)</el-button-->
                  <!--                  ><br />-->
                  <el-button
                    @click="selectResourceFn('Audio', index)"
                    class="mt10"
                    size="mini"
                    type="primary"
                    >Audio(.mp3)</el-button
                  ><br />
                  <el-button
                    @click="selectResourceFn('Animation', index)"
                    class="mt10"
                    size="mini"
                    type="primary"
                    >Animation(.gif)</el-button
                  >
                </div>
              </div>
            </div>
            <div v-else-if="item.type === 'Video'" class="resource-wrap">
              <video
                :src="item.content"
                controls
                style="vertical-align: top;width: 150px;"
              ></video>
              <div class="operat_btn">
                <el-button
                  size="mini"
                  @click="upEditor(index)"
                  :disabled="index == 0"
                  >↑</el-button
                ><br />
                <el-button size="mini" @click="removeEditor(index)" class="mt10"
                  >X</el-button
                ><br />
                <el-button size="mini" @click="copyResource(index)" class="mt10"
                  >+</el-button
                ><br />
                <el-button
                  size="mini"
                  class="mt10"
                  @click="downEditor(index)"
                  :disabled="index == articleList.length - 1"
                  >↓</el-button
                >
                <div class="select_btn" v-show="item.showBtn">
                  <el-button
                    @click="selectResourceFn('Text', index)"
                    size="mini"
                    type="primary"
                    >Text</el-button
                  ><br />
                  <el-button
                    @click="selectResourceFn('Picture', index)"
                    class="mt10"
                    size="mini"
                    type="primary"
                    >Picture</el-button
                  ><br />
                  <!--                  <el-button-->
                  <!--                    @click="selectResourceFn('Video', index)"-->
                  <!--                    class="mt10"-->
                  <!--                    size="mini"-->
                  <!--                    type="primary"-->
                  <!--                    >Video(.mp4)</el-button-->
                  <!--                  ><br />-->
                  <el-button
                    @click="selectResourceFn('Audio', index)"
                    class="mt10"
                    size="mini"
                    type="primary"
                    >Audio(.mp3)</el-button
                  ><br />
                  <el-button
                    @click="selectResourceFn('Animation', index)"
                    class="mt10"
                    size="mini"
                    type="primary"
                    >Animation(.gif)</el-button
                  >
                </div>
              </div>
            </div>
            <div v-else-if="item.type === 'Audio'" class="resource-wrap">
              <audio
                :src="item.content"
                controls
                style="vertical-align: middle;"
              ></audio>
              <div class="operat_btn">
                <el-button
                  size="mini"
                  @click="upEditor(index)"
                  :disabled="index == 0"
                  >↑</el-button
                ><br />
                <el-button size="mini" @click="removeEditor(index)" class="mt10"
                  >X</el-button
                ><br />
                <el-button size="mini" @click="copyResource(index)" class="mt10"
                  >+</el-button
                ><br />
                <el-button
                  size="mini"
                  class="mt10"
                  @click="downEditor(index)"
                  :disabled="index == articleList.length - 1"
                  >↓</el-button
                >
                <div class="select_btn" v-show="item.showBtn">
                  <el-button
                    @click="selectResourceFn('Text', index)"
                    size="mini"
                    type="primary"
                    >Text</el-button
                  ><br />
                  <el-button
                    @click="selectResourceFn('Picture', index)"
                    class="mt10"
                    size="mini"
                    type="primary"
                    >Picture</el-button
                  ><br />
                  <!--                  <el-button-->
                  <!--                    @click="selectResourceFn('Video', index)"-->
                  <!--                    class="mt10"-->
                  <!--                    size="mini"-->
                  <!--                    type="primary"-->
                  <!--                    >Video(.mp4)</el-button-->
                  <!--                  ><br />-->
                  <el-button
                    @click="selectResourceFn('Audio', index)"
                    class="mt10"
                    size="mini"
                    type="primary"
                    >Audio(.mp3)</el-button
                  ><br />
                  <el-button
                    @click="selectResourceFn('Animation', index)"
                    class="mt10"
                    size="mini"
                    type="primary"
                    >Animation(.gif)</el-button
                  >
                </div>
              </div>
            </div>
            <div v-else class="resource-wrap">
              <img
                :src="item.content"
                style="width:88px;vertical-align: middle;"
              />
              <div class="operat_btn">
                <el-button
                  size="mini"
                  @click="upEditor(index)"
                  :disabled="index == 0"
                  >↑</el-button
                ><br />
                <el-button size="mini" @click="removeEditor(index)" class="mt10"
                  >X</el-button
                ><br />
                <el-button size="mini" @click="copyResource(index)" class="mt10"
                  >+</el-button
                ><br />
                <el-button
                  size="mini"
                  class="mt10"
                  @click="downEditor(index)"
                  :disabled="index == articleList.length - 1"
                  >↓</el-button
                >
                <div class="select_btn" v-show="item.showBtn">
                  <el-button
                    @click="selectResourceFn('Text', index)"
                    size="mini"
                    type="primary"
                    >Text</el-button
                  ><br />
                  <el-button
                    @click="selectResourceFn('Picture', index)"
                    class="mt10"
                    size="mini"
                    type="primary"
                    >Picture</el-button
                  ><br />
                  <!--                  <el-button-->
                  <!--                    @click="selectResourceFn('Video', index)"-->
                  <!--                    class="mt10"-->
                  <!--                    size="mini"-->
                  <!--                    type="primary"-->
                  <!--                    >Video(.mp4)</el-button-->
                  <!--                  ><br />-->
                  <el-button
                    @click="selectResourceFn('Audio', index)"
                    class="mt10"
                    size="mini"
                    type="primary"
                    >Audio(.mp3)</el-button
                  ><br />
                  <el-button
                    @click="selectResourceFn('Animation', index)"
                    class="mt10"
                    size="mini"
                    type="primary"
                    >Animation(.gif)</el-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <el-form-item style="margin-top: 30px;">
          <el-button
            size="medium"
            type="primary"
            @click="submitForm('ruleForm')"
            >Save</el-button
          >
          <el-button size="medium" @click="goBack()">Cancel</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="Select Resource"
      ref="resourceDialog"
      :visible.sync="selectResourceDialog"
    >
      <PicList
        @getPicRow="getResourceRow"
        :picLabelRadio="true"
        :searchPic="false"
        :radio="resourceRadio"
        v-if="resourceSelect === 'Picture'"
      ></PicList>
      <AudioList
        @getAudioRow="getResourceRow"
        :audioLabelRadio="true"
        :searchAudio="false"
        :radio="resourceRadio"
        v-if="resourceSelect === 'Audio'"
      ></AudioList>
      <AnimationList
        @getAnimationRow="getResourceRow"
        :animationLabelRadio="true"
        :searchAnimation="false"
        :radio="resourceRadio"
        v-if="resourceSelect === 'Animation'"
      ></AnimationList>
      <!-- <VideoList
        @getVideoRow="getResourceRow"
        :videoLabelRadio="true"
        :searchVideo="false"
        :radio="resourceRadio"
        v-if="resourceSelect === 'Video'"
      ></VideoList> -->
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="selectResourceDialog = false"
          >Cancel</el-button
        >
        <el-button size="small" type="primary" @click="addResource"
          >Confirm</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import textEditor from './Editor.vue'
import Upload from '@/components/upload.vue'
import dialogForm from '../../../mixins/dialogForm.js'
import { addBGC, editBGC } from '@/api/testApplet/BGC/list.js'
import PicList from '../Resource/pic/index.vue'
import AudioList from '../Resource/audio/index.vue'
import AnimationList from '../Resource/animation/index.vue'
// import VideoList from '../Resource/videoList/index.vue'
export default {
  name: 'testApplet-BGC-edit',
  components: {
    Upload,
    textEditor,
    PicList,
    AudioList,
    AnimationList
    // VideoList
  },
  mixins: [dialogForm],
  data() {
    return {
      maxLength: 30,
      codeNum: 60,
      form: {
        coverImageUrl: '',
        title: '',
        articleDetails: []
      },
      rules: {
        coverImageUrl: [
          { required: true, message: '请上传封面', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        articleDetails: [
          { required: true, message: '请选择Course', trigger: 'change' }
        ]
      },
      coverImageFileList: [],
      articleList: [],
      questNum: 1,
      selectResourceDialog: false,
      resourceSelect: 'picture',
      resourceRow: {},
      editorContent: '',
      resourcePos: -1,
      resourceRadio: '',
      btnFlag: false,
      submitBtn: true
    }
  },
  mounted() {
    if (this.$route.query.id) {
      let data = JSON.parse(sessionStorage.getItem('bgcEditRow'))
      for (let i in data.articleDetails) {
        data.articleDetails[i].showBtn = false
      }
      this.form = { ...data }
      this.articleList = data.articleDetails
      this.questNum = this.articleList.length + 1
      this.coverImageFileList.push({ url: data.coverImageUrl })
    }
  },
  methods: {
    getResourceRow(row) {
      this.resourceRow = row
      this.resourceRadio = row.name
    },
    selectResourceFn(resource, index) {
      this.resourceSelect = resource
      if (JSON.stringify(index)) {
        this.articleList[index].showBtn = false
      } else {
        this.btnFlag = resource + 'flag'
      }
      this.resourcePos = index
      if (resource === 'Text') {
        this.addResource()
      } else {
        this.selectResourceDialog = true
      }
    },
    copyResource(index) {
      for (let i in this.articleList) {
        if (Number(i) !== index) {
          this.articleList[i].showBtn = false
        }
      }
      if (this.articleList[index].showBtn) {
        this.articleList[index].showBtn = false
      } else {
        this.articleList[index].showBtn = true
      }
    },
    addResource() {
      if (!this.resourceRow.type) {
        if (this.resourceSelect !== 'Text') {
          this.$message('请选择资源！')
          return
        }
      }
      if (this.resourcePos > -1) {
        //项中添加资源
        console.log(this.resourcePos)
        let arr = this.articleList.slice(0, this.resourcePos + 1)
        console.log(arr)
        let item = this.resourceCombine(this.resourcePos + 2)
        console.log('item,;', item)
        arr.push(item)
        let j = arr.length + 1
        let arr2 = this.articleList.slice(this.resourcePos + 1)
        for (let i in arr2) {
          arr2[i].sort = j
          j += 1
        }
        console.log(arr2)
        this.articleList = arr.concat(arr2)
        this.questNum = this.articleList.length
      } else {
        //标题中添加资源
        let item = this.resourceCombine(this.questNum)
        console.log('item', item)
        this.articleList.push(item)
        this.questNum += 1
      }
      this.selectResourceDialog = false
      this.resourcePos = -1
      this.resourceRow = {}
      this.resourceRadio = ''
      console.log('resourceRadio', this.resourceRadio)
      console.log(this.articleList)
    },
    resourceCombine(sort) {
      console.log('sort', sort)
      let item = {}
      if (this.resourceSelect === 'Text') {
        item = {
          sort: sort,
          type: this.resourceSelect,
          content: '',
          showBtn: false
        }
      } else {
        item = {
          sort: sort,
          type: this.resourceSelect,
          name: this.resourceRow.name,
          content: this.resourceRow.url,
          showBtn: false
        }
        if (this.resourceRow.coverImageUrl) {
          item.coverImageUrl = this.resourceRow.coverImageUrl
        }
        if (this.resourceRow.length) {
          item.length = this.resourceRow.length
        }
        if (this.resourceRow.isDownload) {
          item.isDownload = this.resourceRow.isDownload
        }
      }
      return item
    },
    removeEditor(index) {
      console.log(index)
      this.articleList.splice(index, 1)
      for (let i = index; i < this.articleList.length; i++) {
        this.articleList[i].sort -= 1
      }
      this.questNum -= 1
      console.log(this.articleList)
    },
    downEditor(index) {
      let item = this.articleList[index]
      item.sort += 1
      this.articleList[index + 1].sort -= 1
      this.articleList.splice(index, 1, this.articleList[index + 1])
      this.articleList.splice(index + 1, 1, item)
      console.log(this.articleList)
    },
    upEditor(index) {
      let tempOption = this.articleList[index]
      tempOption.sort -= 1
      this.articleList[index - 1].sort += 1
      this.articleList.splice(index, 1, this.articleList[index - 1])
      this.articleList.splice(index - 1, 1, tempOption)
      console.log(this.articleList)
    },
    editorChange(event, item) {
      item.content = event.event.html
      console.log(item)
    },
    uploadCover(file, fileList) {
      console.log(file)
      this.handleUpload(file, fileList, 'coverImageUrl', 'coverImageFileList')
      console.log(this.coverImageFileList)
    },

    submitForm(formName) {
      for (let i in this.articleList) {
        if (this.articleList[i].type === 'Text') {
          if (!this.articleList[i].content) {
            this.$message.warning('文本编辑器不能为空！')
            return
          }
        }
      }
      this.form.articleDetails = this.articleList
      // console.log(this.form)
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.id) {
            this.editBgc()
          } else {
            this.addBbgc()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    editBgc() {
      editBGC(this.form).then(res => {
        console.log(res)
        this.$router.push({ name: 'testApplet-BGC-index' })
      })
    },
    addBbgc() {
      addBGC(this.form).then(res => {
        console.log(res)
        this.$router.push({ name: 'testApplet-BGC-index' })
      })
    },
    goBack() {
      this.$router.push({ name: 'testApplet-BGC-index' })
    },
    getStringLengthForChinese(val) {
      let str = val.toString()
      let bytesCount = 0
      for (let i = 0, len = str.length; i < len; i++) {
        let c = str.charCodeAt(i)
        if ((c > 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
          //这里是16进制表示，也可以用十进制
          bytesCount = bytesCount + 1
        } else {
          bytesCount = bytesCount + 2
        }
      }
      return bytesCount
    },
    textareaChange(e) {
      setTimeout(() => {
        let count = this.computedLen(e.target.value, 60, 30)
        this.maxLength = count.maxLen
      }, 200)
    },
    computedLen(str, totalLength, maxLength) {
      let rep = /[0-9a-zA-Z|\s]/ // 正则判断字母数字
      let strArr = str.split('')
      let totalLen = totalLength // 总的输入长度
      let maxLen = maxLength // input或textarea上maxlength的值，这里由于中文算2个占位，所以传入的maxLength应该为totalLength的一半
      let len = 0 // 已经输入的字符数
      let leftLen = 0 // 剩余可输入字符数

      strArr.forEach(val => {
        if (rep.test(val)) {
          leftLen = Math.ceil(totalLen - len * 2) // 剩余输入数等于总长 - 输入数，乘以2是因为非中文的len只算0.5
          if (leftLen === 0) {
            return false // 如果剩余数是0,就退出循环，不能输入了
          }
          len = len + 0.5 // 如果输入非中文，算加半个字符，maxlengtrh也加0.5,这样就实现了两个非中文长度等于一个中文
          maxLen = maxLen + 0.5
        } else {
          len = len + 1
        }
      })
      return {
        maxLen: Math.ceil(maxLen) // 返回我们需要的maxlegt的值
      }
    }
  },
  watch: {
    'form.title': function() {
      this.codeNum = 60 - this.getStringLengthForChinese(this.form.title)
      if (this.getStringLengthForChinese(this.form.title) > 60) {
        //如果占位数大于60
        let arr = this.form.title.split('') //输入字符串转为数组，依次推出最后一位元素
        for (let i = arr.length - 1; i >= 0; i--) {
          arr = arr.slice(0, i) // 每推出一个，将数组转为字符串，做一次占位数判断
          this.form.title = arr.join('')
          if (this.getStringLengthForChinese(this.form.title) <= 60) {
            break
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.editor-wrap {
  display: inline-block;
  width: calc(100% - 400px);
  /*height: 220px;*/
  margin-left: 135px;
  vertical-align: top;
}
.mt10 {
  margin-top: 5px;
}
.resource-wrap {
  width: calc(100% - 350px);
  margin-top: 40px;
  margin-left: 150px;
}
.operat_btn {
  position: relative;
  display: inline-block;
  margin-left: 20px;
  vertical-align: middle;
}
.select_btn {
  position: absolute;
  top: 0;
  left: 40px;
}
</style>
