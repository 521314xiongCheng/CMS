<template>
  <div class="c-bannermanage">
    <!-- <div class="g-page-bar" style="border-bottom: 1px solid #e6e6e6;">
      <span class="page-title">Banner Manage</span>
    </div> -->
    <div class="panle">
      <el-form :model="searchForm" size="small" :inline="true">
        <el-form-item label="ID:">
          <el-input v-model="searchForm.id" style="width:120px;" />
        </el-form-item>
        <el-form-item label="TagName:">
          <el-input v-model="searchForm.tag" style="width:120px;" />
        </el-form-item>
        <el-form-item label="Title:">
          <el-input v-model="searchForm.title" style="width:120px;" />
        </el-form-item>
        <el-form-item label="Status:">
          <el-select
            :clearable="true"
            v-model="searchForm.status"
            @change="getPagesData()"
          >
            <el-option
              v-for="item in bannerStatus"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" " label-width="40px">
          <el-button type="primary" size="small" @click="getPagesData()"
            >Search</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="
              dialogNewBanner = true
              form.id = ''
            "
            >Add New</el-button
          >
        </el-form-item>
        <!-- <el-form-item>
          <el-col :span="1">ID:</el-col>
          <el-col :span="2">
            <el-input v-model="searchForm.id"/>
          </el-col>
          <el-col :span="2" :offset="1">TagName:</el-col>
          <el-col :span="3">
            <el-input v-model="searchForm.tag"/>
          </el-col>
          <el-col :span="1" :offset="1">Title:</el-col>
          <el-col :span="3">
            <el-input v-model="searchForm.title"/>
          </el-col>
          <el-col :span="1" :offset="1">Status:</el-col>
          <el-col :span="3">
            <el-select v-model="searchForm.status">
              <el-option
                v-for="item in bannerStatus"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>

          <el-col :span="3" :offset="1">
            <el-button type="primary" size="mini" @click="getPagesData()" >Search</el-button>
            <el-button type="primary" size="mini" @click="dialogNewBanner = true;form.id=''">Add New</el-button>
          </el-col>
        </el-form-item> -->
      </el-form>

      <div>
        <el-table
          :data="tableData"
          v-loading="searchLoading"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="bannerId"
            label="BannerId"
            width="90"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="bannerName"
            label="BannerName"
            align="left"
          ></el-table-column>
          <el-table-column
            prop="bannerCoverImg"
            label="BannerCoverImg"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <img :src="scope.row.bannerCoverImg" style="width:100px;" />
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="CreateTime"
            width="160"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="lastUpdateTime"
            label="LastUpdateTime"
            width="160"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="status"
            label="Status"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.status == 0 ? 'Invalid' : 'Valid' }}</span>
            </template>
          </el-table-column>

          <el-table-column width="100" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="getBannerDetail(scope.row.bannerId)"
                >Detail</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!------------添加新模块 开始--------------------->
    <el-dialog
      title="New Banner"
      width="50%"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogNewBanner"
      :show-close="false"
    >
      <el-form
        ref="form"
        size="small"
        :model="form"
        :rules="formRules"
        label-width="200px"
      >
        <el-form-item label="BannerType:" required>
          <el-col :span="10">
            <el-select v-model="form.type" prop="type">
              <!-- v-for="item in ['Image', 'Video', 'Text']" -->
              <el-option
                v-for="item in ['Image', 'Text', 'Video', 'Json']"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="Tag(Internal):" prop="tag" required>
          <el-col :span="12">
            <el-input v-model="form.tag" />
          </el-col>
        </el-form-item>

        <el-form-item label="Title:" required prop="title">
          <el-col :span="12">
            <el-input v-model="form.title" />
          </el-col>
        </el-form-item>
        <!-- <el-form-item label="EffectiveTime:" prop="effectiveTime" required>
          <el-col :span="12">
            <el-date-picker
              v-model="form.effectiveTime"
              type="datetimerange"
              range-separator="-"
              start-placeholder="startTime"
              end-placeholder="endTimg"
            ></el-date-picker>
          </el-col>
        </el-form-item> -->
        <el-form-item label="Desc:" prop="desc">
          <el-col :span="12">
            <el-input type="textarea" v-model="form.desc"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="BannerStatus:" required>
          <el-col :span="12">
            <el-select v-model="form.status">
              <el-option
                v-for="item in bannerStatus"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item
          v-show="form.type == 'Video'"
          label="CoverImg:"
          prop="coverImageUrl"
        >
          <el-col :span="18">
            <el-input v-model="form.coverImageUrl"></el-input>
          </el-col>
          <el-col :offset="1" :span="3">
            <upload
              @change="coverImageFileChange"
              :showLoading="coverImgLoading"
              accept="image/png, image/jpeg"
            ></upload>
          </el-col>
        </el-form-item>

        <el-form-item
          v-show="form.type == 'Json'"
          label="BasicImage:"
          prop="basicImage"
        >
          <el-col :span="18">
            <el-input v-model="form.basicImage"></el-input>
          </el-col>
          <el-col :offset="1" :span="3">
            <upload
              @change="basicImageJsonChange"
              :showLoading="coverImgLoading"
              accept="image/png, image/jpeg"
            ></upload>
          </el-col>
        </el-form-item>
        <el-form-item
          v-show="form.type == 'Json'"
          label="CoverImage:"
          prop="coverImage"
        >
          <el-col :span="18">
            <el-input v-model="form.coverImage"></el-input>
          </el-col>
          <el-col :offset="1" :span="3">
            <upload
              @change="coverImageJsonChange"
              :showLoading="coverImgLoading"
              accept="image/png, image/jpeg"
            ></upload>
          </el-col>
        </el-form-item>
        <el-form-item v-show="form.type == 'Json'" label="additionalType:">
          <el-col :span="12">
            <el-select
              v-model="form.additionalType"
              @change="additionalTypeChange"
            >
              <el-option
                v-for="item in [1, 2, 3, 4]"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item
          v-show="form.type == 'Json'"
          label="AdditionalBackgroundColor:"
        >
          <el-col :span="12">
            <el-input v-model="form.additionalBackgroundColor" />
          </el-col>
        </el-form-item>
        <el-form-item
          v-show="form.type == 'Json'"
          label="AdditionalBackgroundImage:"
          prop="additionalBackgroundImage"
        >
          <el-col :span="18">
            <el-input v-model="form.additionalBackgroundImage"></el-input>
          </el-col>
          <el-col :offset="1" :span="3">
            <upload
              @change="additionalBackgroundImageJsonChange"
              :showLoading="coverImgLoading"
              accept="image/png, image/jpeg"
            ></upload>
          </el-col>
        </el-form-item>

        <el-form-item
          v-show="form.type == 'Image' || form.type == 'Video'"
          label="Image:"
          prop="imageUrl"
        >
          <el-col :span="18">
            <el-input v-model="form.imageUrl"></el-input>
          </el-col>
          <el-col :offset="1" :span="3">
            <upload
              @change="imageFileChange"
              :showLoading="imgLoading"
              accept="image/png, image/jpeg"
            ></upload>
          </el-col>
        </el-form-item>
        <el-form-item
          v-show="form.type == 'Video'"
          label="Video:"
          prop="videoUrl"
        >
          <el-col :span="18">
            <el-input v-model="form.videoUrl"></el-input>
          </el-col>
          <el-col :offset="1" :span="3">
            <upload
              @change="videoFileChange"
              :showLoading="videoLoading"
              accept="video/mp4"
            ></upload>
          </el-col>
        </el-form-item>

        <div v-show="form.type == 'Json'">
          <el-form-item label="shareContent:">
            <div v-for="(value, key) in form.shareContent" :key="key">
              <el-col :span="20">
                <el-input
                  style="margin-bottom:10px;"
                  type="text"
                  @input="change($event)"
                  v-model="form.shareContent[key]"
                  :placeholder="key"
                ></el-input>
              </el-col>
            </div>
          </el-form-item>
        </div>
        <el-form-item
          v-show="form.type == 'Json'"
          label="additionalInformation:"
        >
          <el-col :span="8">
            <el-select v-model="form.additionalCheck">
              <el-option
                v-for="item in form.additionalArr"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-button @click="addItems">add</el-button>
          </el-col>
        </el-form-item>
        <div
          v-if="
            form.additionalInformation &&
              Object.keys(form.additionalInformation).length > 0 &&
              form.type == 'Json'
          "
        >
          <div v-for="(value, key) in form.additionalInformation" :key="key">
            <div
              class="border-box"
              v-if="
                key != 'additionalImage' &&
                  form.additionalInformation[key] != null
              "
            >
              <el-form-item :label="key"></el-form-item>
              <div
                v-for="(value, item) in form.additionalInformation[key]"
                :key="item"
              >
                <el-form-item
                  :label="item + '：'"
                  :required="
                    item == 'default' || item == 'fontColor' || item == 'limit'
                  "
                >
                  <el-col :span="20" v-if="item == 'note'">
                    <el-input
                      type="textarea"
                      v-model="form.additionalInformation[key][item]"
                    ></el-input>
                  </el-col>
                  <el-col :span="20" v-if="item == 'instance'">
                    <el-input
                      class="instanceInput"
                      type="text"
                      v-model="form.tagVal"
                      @keyup.enter.native="handleInputConfirm(key)"
                    >
                    </el-input>
                    <el-button
                      class="addbtn"
                      size="small"
                      @click="handleInputConfirm(key)"
                      >add</el-button
                    >
                    <el-tag
                      :key="tag"
                      v-for="tag in form.additionalInformation[key][item]"
                      closable
                      size="mini"
                      :disable-transitions="false"
                      @close="handleClose(key, tag)"
                    >
                      {{ tag }}
                    </el-tag>
                  </el-col>
                  <el-col
                    :span="20"
                    v-if="item != 'note' && item != 'instance'"
                  >
                    <el-input
                      v-model="form.additionalInformation[key][item]"
                    ></el-input>
                  </el-col>
                </el-form-item>
              </div>
              <el-form-item>
                <el-button @click="deleteItem(key)">Delete</el-button>
              </el-form-item>
            </div>
            <div
              class="border-box"
              v-if="
                key == 'additionalImage' &&
                  form.additionalInformation[key] != null
              "
            >
              <el-form-item label="additionalImage"></el-form-item>
              <div>
                <el-form-item label="instance:">
                  <el-col :span="20">
                    <el-col :span="15">
                      <el-input v-model="form.tagVal"></el-input>
                    </el-col>
                    <el-col :offset="1" :span="3">
                      <upload
                        @change="additionalImageinstanceChange"
                        :showLoading="coverImgLoading"
                        accept="image/png, image/jpeg"
                      ></upload>
                    </el-col>
                    <el-col :offset="1" :span="3">
                      <el-button @click="handleInputConfirm(key)"
                        >add</el-button
                      >
                    </el-col>
                    <el-tag
                      :key="tag"
                      v-for="tag in form.additionalInformation[key]['instance']"
                      closable
                      size="mini"
                      :disable-transitions="false"
                      @close="handleClose(key, tag)"
                    >
                      {{ tag }}
                    </el-tag>
                  </el-col>
                </el-form-item>
                <el-form-item label="note:">
                  <el-col :span="20">
                    <el-input
                      type="textarea"
                      v-model="form.additionalInformation[key]['note']"
                    ></el-input>
                  </el-col>
                </el-form-item>
              </div>
              <el-form-item>
                <el-button @click="deleteItem(key)">Delete</el-button>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()" size="small">Cancel</el-button>
        <el-button type="primary" @click="submitForm('formRules')" size="small"
          >Save</el-button
        >
      </div>
    </el-dialog>
    <!------------添加新模块 结束--------------------->
  </div>
</template>

<script>
import {
  getPages,
  create,
  getDetail,
  update
} from '../../api/banners/banner.js'
import {
  readUserName,
  // userClients,
  // changeTimeFormatToUTCYYYYmmDDhhMMss,
  changeTimeFormatToUTCYYYYmmDDhhMMss
} from '../../utility/index'

// import upload from '../../utility/upload'
import uploadMixin from '../../mixins/upload'

export default {
  components: {},
  // mixins: [dialogForm],
  data() {
    return {
      dialogNewBanner: false,
      searchForm: { id: '', tag: '', title: '', status: '' },
      form: {
        type: 'Image',
        tag: '',
        title: '',
        desc: '',
        // effectiveTime: '',
        coverImageUrl: '',
        imageUrl: '',
        videoUrl: '',
        status: 0,
        basicImage: '',
        coverImage: '',
        additionalType: 1,
        additionalBackgroundColor: '',
        additionalBackgroundImage: '',
        shareContent: {
          desc: '',
          testUrl: '',
          note: '',
          shareUrl: ''
        },
        default: '',
        fontColor: '',
        limit: '',
        additionalArr: [
          'additionalTitle',
          'additionalDesc',
          'additionalReward',
          'additionalRewardDesc'
        ],
        additionalCheck: 'additionalTitle',
        innerArr: ['default', 'instance', 'fontColor', 'limit', 'note'],
        tagVal: '',
        additionalInformation: {}
      },

      bannerStatus: [
        { id: 0, name: 'Invalid' },
        { id: 1, name: 'Valid' }
      ],
      coverImageUrlList: [],
      imageUrlList: [],
      videoUrlList: [],
      coverImgLoading: false,
      imgLoading: false,
      videoLoading: false,
      searchLoading: false,

      tableData: [
        {
          bannerId: 1,
          bannerName: 'asdfSDFSD士大夫',
          bannerCoverImg: '王小虎',
          createTime: '1019-2-2 33:33',
          lastUpdateTime: '2019/12/22 33:33',
          status: 'valid'
        }
      ],
      formRules: {
        tag: [
          {
            required: true,
            trigger: 'change'
          }
        ],
        title: [{ required: true, trigger: 'change' }],
        // effectiveTime: [{ required: true, trigger: 'change' }],
        coverImageUrl: [{ required: false, trigger: 'change' }],
        desc: [{ required: false, trigger: 'change' }],
        imageUrl: [{ required: false, trigger: 'change' }],
        basicImage: [{ required: true, trigger: 'change' }],
        videoUrl: [{ required: false, trigger: 'change' }],
        coverImage: [{ required: true, trigger: 'change' }]
      }
    }
  },
  mixins: [uploadMixin],
  methods: {
    addNew() {
      this.dialogNewBanner = true
      this.form.id = ''
      this.form = this.addNewForm
    },
    handleClose(key, tag) {
      this.form.additionalInformation[key]['instance'].splice(
        this.form.additionalInformation[key]['instance'].indexOf(tag),
        1
      )
    },
    addItems() {
      if (
        this.form.additionalInformation[this.form.additionalCheck] == undefined
      ) {
        if (this.form.additionalCheck == 'additionalImage') {
          this.$set(
            this.form.additionalInformation,
            this.form.additionalCheck,
            {
              instance: [],
              note: ''
            }
          )
        } else {
          this.$set(
            this.form.additionalInformation,
            this.form.additionalCheck,
            {
              default: '',
              instance: [],
              fontColor: '',
              limit: '',
              note: ''
            }
          )
        }
      }
    },
    deleteItem(key) {
      this.$delete(this.form.additionalInformation, key)
    },
    coverImageFileChange(file, fileList) {
      this.handleUpload(
        file,
        fileList,
        'coverImageUrl',
        '',
        this.coverImgLoading
      )
    },
    imageFileChange(file, fileList) {
      this.handleUpload(file, fileList, 'imageUrl', '', 'imgLoading')
    },
    videoFileChange(file, fileList) {
      this.handleUpload(file, fileList, 'videoUrl', '')
    },
    cancel() {
      this.$refs['form'].resetFields()
      this.dialogNewBanner = false
    },
    submitForm() {
      if (this.form.type == 'Json') {
        this.$refs['form'].validate(valid => {
          if (valid) {
            for (let key in this.form.additionalInformation) {
              for (let innerkey in this.form.additionalInformation[key]) {
                if (
                  innerkey == 'default' ||
                  innerkey == 'fontColor' ||
                  innerkey == 'limit'
                ) {
                  if (!this.form.additionalInformation[key][innerkey]) {
                    this.$notify({
                      title: 'warning',
                      message: 'Please fill in the required items',
                      type: 'warning'
                    })
                    return false
                  }

                  if (!Number(this.form.additionalInformation[key].limit)) {
                    this.$notify({
                      title: 'warning',
                      message: 'limit Must be numeric type',
                      type: 'warning'
                    })
                    return false
                  }
                }
              }
            }
            this.submitFormData()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        this.submitFormData()
      }
    },
    submitFormData() {
      let data = {
        appName: '',
        tag: this.form.tag,
        type: this.form.type,
        title: this.form.title,
        desc: this.form.desc,
        coverImg: this.form.coverImageUrl,
        image: this.form.imageUrl,
        video: this.form.videoUrl,
        // startTime: this.form.effectiveTime[0],
        // endTime: this.form.effectiveTime[1],
        status: this.form.status,
        market: localStorage.getItem('market'),
        createdBy: readUserName(),
        jsonDesc:
          this.form.type == 'Json'
            ? JSON.stringify({
                basicImage: this.form.basicImage,
                coverImage: this.form.coverImage,
                additionalType: this.form.additionalType,
                shareContent: this.form.shareContent,
                additionalBackgroundColor: this.form.additionalBackgroundColor,
                additionalBackgroundImage: this.form.additionalBackgroundImage,
                additionalArr: this.form.additionalArr,
                additionalCheck: this.form.additionalCheck,
                additionalInformation: {
                  additionalTitle:
                    this.form.additionalInformation.additionalTitle || null,
                  additionalDesc:
                    this.form.additionalInformation.additionalDesc || null,
                  additionalImage:
                    this.form.additionalInformation.additionalImage || null,
                  additionalReward:
                    this.form.additionalInformation.additionalReward || null,
                  additionalRewardDesc:
                    this.form.additionalInformation.additionalRewardDesc || null
                }
              })
            : ''
      }

      if (this.form.isEdit && this.form.id) {
        data.id = this.form.id
        update(data).then(res => {
          if (res.result) {
            this.cancel()
            this.getPagesData()
          }
        })
      } else {
        create(data).then(res => {
          if (res.result) {
            this.cancel()
            this.getPagesData()
          }
        })
      }
    },

    getBannerDetail(bannerId) {
      getDetail(bannerId).then(res => {
        this.form = Object.assign(this.form, {
          id: res.id,
          isEdit: true,
          type: res.type,
          tag: res.tag,
          title: res.title,
          desc: res.desc,
          coverImageUrl: res.coverImg,
          imageUrl: res.image,
          videoUrl: res.video,
          status: res.status
        })
        if (res.jsonDesc) {
          let jsonDesc = JSON.parse(res.jsonDesc)
          this.form = Object.assign(this.form, {
            additionalCheck: jsonDesc.additionalCheck,
            basicImage: jsonDesc.basicImage,
            coverImage: jsonDesc.coverImage,
            additionalType: jsonDesc.additionalType,
            shareContent: jsonDesc.shareContent,
            additionalArr: jsonDesc.additionalArr,
            additionalBackgroundColor: jsonDesc.additionalBackgroundColor,
            additionalBackgroundImage: jsonDesc.additionalBackgroundImage,
            additionalInformation: jsonDesc.additionalInformation
          })
        }
        this.dialogNewBanner = true
      })
    },
    additionalTypeChange() {
      if (this.form.additionalType == 1) {
        this.form.additionalArr = []
        this.form.additionalArr.push(
          'additionalTitle',
          'additionalDesc',
          'additionalReward',
          'additionalRewardDesc'
        )
      } else if (this.form.additionalType == 2) {
        this.form.additionalArr = []
        this.form.additionalArr.push('additionalTitle', 'additionalDesc')
      } else if (this.form.additionalType == 3) {
        this.form.additionalArr = []
        this.form.additionalArr.push(
          'additionalTitle',
          'additionalDesc',
          'additionalImage'
        )
      } else if (this.form.additionalType == 4) {
        this.form.additionalArr = []
        this.form.additionalArr.push('additionalDesc')
      }
      if (this.form.shareContent.hasOwnProperty('testUrl')) {
        console.log('有的')
        if (this.form.additionalType == 4) {
          delete this.form.shareContent.testUrl
          delete this.form.shareContent.shareUrl
        }
      } else {
        if (this.form.additionalType != 4) {
          this.form.shareContent.testUrl = ''
          this.form.shareContent.shareUrl = ''
        }
      }
      this.form.additionalCheck = this.form.additionalArr[0]
    },
    change() {
      this.$forceUpdate()
    },
    handleInputConfirm(key) {
      if (this.form.tagVal == '') return
      this.form.additionalInformation[key]['instance'].push(this.form.tagVal)
      this.form.tagVal = ''
    },
    additionalImageinstanceChange(file, fileList) {
      this.handleUpload(file, fileList, 'tagVal', '', this.coverImgLoading)
    },
    basicImageJsonChange(file, fileList) {
      this.handleUpload(file, fileList, 'basicImage', '', this.coverImgLoading)
    },
    coverImageJsonChange(file, fileList) {
      this.handleUpload(file, fileList, 'coverImage', '', this.coverImgLoading)
    },
    additionalBackgroundImageJsonChange(file, fileList) {
      this.handleUpload(
        file,
        fileList,
        'additionalBackgroundImage',
        '',
        this.coverImgLoading
      )
    },
    getPagesData() {
      this.searchLoading = true
      getPages({
        pageNo: 1,
        pageSize: 1000,
        bannerId: this.searchForm.id,
        bannerTag: this.searchForm.tag,
        status: this.searchForm.status == null ? '' : this.searchForm.status,
        title: this.searchForm.title
      }).then(res => {
        if (res) {
          this.tableData = []
          for (let r of res.tasks) {
            this.tableData.push({
              bannerId: r.id,
              bannerName: r.title,
              bannerCoverImg: r.coverImg,
              createTime: changeTimeFormatToUTCYYYYmmDDhhMMss(r.createdDate),
              lastUpdateTime: changeTimeFormatToUTCYYYYmmDDhhMMss(
                r.updatedDate
              ),
              status: r.status
            })
          }
        }
        this.searchLoading = false
      })
    }
  },
  mounted() {
    this.getPagesData()

    this.username = readUserName()
  },
  watch: {}
}
</script>

<style lang="less">
.c-bannermanage {
  .panle {
    padding: 10px;
    height: 100%;
    width: 100%;

    .text-r {
      text-align: right;
      padding-right: 10px;
    }
  }
  .el-dialog__header {
    border-bottom: 1px solid #ccc;
  }
  .border-box {
    border: 1px solid #d7dae2;
    border-radius: 2px;
    margin-bottom: 15px;
    width: 80%;
    margin: 0 auto 15px auto;
  }
  .instanceInput {
    width: 80%;
  }
  .addbtn {
    width: 18%;
    margin-left: 2%;
  }
  .border-box .el-form-item .el-form-item__content .el-tag--mini {
    white-space: inherit !important;
    height: auto !important;
  }
}
</style>
