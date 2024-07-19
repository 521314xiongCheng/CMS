<template>
  <div class="c-pagemanage">
    <!-- <div class="g-page-bar" style="border-bottom: 1px solid #e6e6e6;">
      <span class="page-title">Page Manage</span>
    </div> -->
    <div class="panle">
      <div class="p-left">
        <el-form class="p-left-form" label-width="50px">
          <el-form-item label="Client:">
            <el-select
              @change="clientChange"
              v-model="pageAppName"
              size="small"
              placeholder="select client"
            >
              <el-option
                v-for="item in clientList"
                :key="item.id"
                :label="item.client_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="Page:">
            <el-select
              @change="pageChange"
              v-model="pageSelecte"
              size="small"
              placeholder="select page"
            >
              <el-option
                v-for="item in pageList"
                :key="item.id"
                :label="item.page_name + ' - (' + item.language + ')'"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="pagename-line" v-show="pageSelecte" label="Page:"
            >{{ pageModelSelect.page_name }} - ({{
              pageModelSelect.language
            }})</el-form-item
          >
          <el-form-item
            class="pagelang-c"
            v-show="pageModelSelect.language"
            label="Language:"
            >{{ pageModelSelect.language }}</el-form-item
          >
        </el-form>

        <div class="p-pages">
          <el-button type="primary" size="mini" @click="dialogNewPage = true"
            >New Page</el-button
          >
        </div>
        <div class="p-modules">
          <span>Modules</span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <el-button
            type="primary"
            size="mini"
            v-show="pageSelecte != ''"
            @click="
              dialogNewModule = true
              isEditModule = false
            "
            >New Module</el-button
          >
        </div>
        <el-tree
          class="filter-tree"
          :data="treeData"
          :props="defaultProps"
          highlight-current
          ref="tree"
          @node-click="selectTreeNode"
        ></el-tree>
      </div>
      <div class="p-right">
        <el-row :gutter="20">
          <el-col :span="12" style="text-align:left" v-show="pageModuleSelect">
            <div class="tip">
              APP PageModule Path ==>&nbsp;&nbsp;&nbsp;&nbsp; /v1/page/tag/{{
                pageModelSelect.tag
              }}/{{ pageModuleModelSelect.tag }}
            </div>
          </el-col>
          <el-col :span="12">
            <el-button
              type="primary"
              size="mini"
              v-show="pageModuleSelect != ''"
              @click="getModelById"
              >Edit Module</el-button
            >
            <el-button
              type="primary"
              v-show="tableData.length > 0"
              @click="publishModule"
              size="mini"
              >Publish Module</el-button
            >
          </el-col>
        </el-row>
        <div>
          <el-table
            :data="tableData"
            v-loading="tableDataLoading"
            border
            style="width: 100%"
          >
            <el-table-column prop="sort" label="Sort" width="70" align="center">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.sort"
                  type="number"
                  size="mini"
                  placeholder="sort"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="resourceType"
              label="ResourceType"
              width="80"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="resourceID"
              label="ResourceID"
              width="75"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="resourceName"
              label="ResourceName"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="createTime"
              label="CreateTime"
              width="150"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="effectiveTime"
              label="EffectiveTime"
              width="300"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="resourceStatus"
              label="Resource Status"
              width="80"
              align="center"
            >
              <template slot-scope="scope">
                <i
                  v-show="scope.row.resourceStatus == 1"
                  class="el-icon-check el-icon-circle-check-green"
                ></i>
              </template>
            </el-table-column>
            <el-table-column
              prop="publishSatatus"
              label="Publish  Satatus"
              width="70"
              align="center"
            >
              <template slot-scope="scope">
                <i
                  v-show="scope.row.publishSatatus == 1"
                  class="el-icon-success el-icon-circle-check-green"
                ></i>
              </template>
            </el-table-column>
            <el-table-column width="120" align="center">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                  >Edit</el-button
                >

                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                  >Delete</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-button
              type="primary"
              size="mini"
              v-show="tableData.length > 0"
              @click="newSortEvent"
              >New Sort</el-button
            >
            <el-button
              type="primary"
              size="mini"
              v-show="pageModuleSelect != ''"
              @click="
                dialogNewResource = true
                radio = ''
              "
              >New Resource</el-button
            >
          </el-col>
        </el-row>
      </div>
    </div>
    <!------------添加新页面 开始--------------------->
    <el-dialog
      title="New Page"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogNewPage"
      :show-close="false"
    >
      <el-form label-width="100px" size="small">
        <el-form-item label="Client" class="is-required">
          <el-select v-model="savePageForm.appName" placeholder="select client">
            <el-option
              v-for="item in clientList"
              :key="item.id"
              :label="item.client_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Language" class="is-required">
          <el-select
            v-model="savePageForm.language"
            placeholder="select language"
          >
            <el-option key="zh_CN" label="zh_CN" value="zh_CN"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Tag" class="is-required">
          <el-input
            v-model="savePageForm.tag"
            placeholder="app url module, add once, can't update"
          ></el-input>
        </el-form-item>
        <el-form-item label="PageName" class="is-required">
          <el-input v-model="savePageForm.pageName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="small"
          @click="
            dialogNewPage = false
            savePageForm.appName = ''
            savePageForm.pageName = ''
            savePageForm.language = ''
            savePageForm.tag = ''
          "
          >Cancel</el-button
        >
        <el-button type="primary" @click="savePage()" size="small"
          >Save</el-button
        >
      </div>
    </el-dialog>
    <!------------添加新页面 结束--------------------->
    <!------------添加新模块 开始--------------------->
    <el-dialog
      :title="isEditModule ? 'Edit Module' : 'New Module'"
      width="35%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogNewModule"
      :show-close="false"
    >
      <el-form :model="saveModuleForm" label-width="110px">
        <el-form-item label="Client">{{ pageAppName }}</el-form-item>
        <el-form-item label="Language">{{
          pageModelSelect.language
        }}</el-form-item>
        <el-form-item label="Tag" class="is-required">
          <el-input
            v-model="saveModuleForm.tag"
            :disabled="moduleFormTagEditDisable"
            placeholder="app url module, add once, can't update"
          ></el-input>
        </el-form-item>
        <el-form-item label="AttachTo">
          <el-cascader
            v-model="saveModuleForm.selecterValue"
            :options="moduleTreeOptions"
            :props="{ expandTrigger: 'hover', checkStrictly: true }"
            style="width:100%"
            :clearable="true"
            :disabled="editPageModule"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="ModuleName" class="is-required">
          <el-input v-model="saveModuleForm.moduleName"></el-input>
        </el-form-item>
        <el-form-item label="Path">
          <el-input v-model="saveModuleForm.path"></el-input>
        </el-form-item>
        <el-form-item label="Note">
          <el-input v-model="saveModuleForm.note"></el-input>
        </el-form-item>
        <el-form-item label="Sort">
          <el-input v-model="saveModuleForm.sort"></el-input>
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="saveModuleForm.status">
            <el-option
              v-for="item in pageModuleStatus"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetSaveModuleForm()">Cancel</el-button>
        <el-button
          type="primary"
          :disabled="btnDisabled"
          v-show="!isEditModule"
          @click="saveModule"
          >Save</el-button
        >
        <el-button
          type="primary"
          :disabled="btnDisabled"
          v-show="isEditModule"
          @click="editModule"
          >Edit</el-button
        >
      </div>
    </el-dialog>
    <!------------添加新模块 结束--------------------->
    <!------------添加新资源 开始--------------------->
    <el-dialog
      :title="isEditResource ? 'Edit Resource' : 'New Resource'"
      width="70%"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogNewResource"
      :show-close="false"
    >
      <el-form label-width="0">
        <div v-show="searchResourceStep1">
          <el-form-item>
            <el-col :span="1">Type:</el-col>
            <el-col :span="2">
              <el-select
                v-model="resourceSearch.resourceType"
                placeholder="select client"
              >
                <el-option
                  v-for="item in ['Article', 'Banner', 'Product', 'SKU']"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-col>
            <!-- <div v-show="resourceSearch.resourceType=='Article'">
              <el-col :offset="1" :span="1">Client:</el-col>
              <el-col :span="3">
                <el-select
                  v-model="resourceSearch.clientId"
                  placeholder="select client"
                >
                  <el-option
                    v-for="item in allClients"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-col>
            </div> -->
            <el-col
              v-show="
                resourceSearch.resourceType == 'SKU' ||
                  resourceSearch.resourceType == 'Product'
              "
              :offset="1"
              :span="3"
            >
              Language:
              <span>{{ pageModelSelect.language }}</span>
            </el-col>

            <el-col :offset="1" :span="2">ResourceID:</el-col>
            <el-col :span="2">
              <el-input
                type="number"
                min="1"
                v-model="resourceSearch.resourceId"
              ></el-input>
            </el-col>
            <el-col :offset="1" :span="3">ResourceName:</el-col>
            <el-col :span="4">
              <el-input v-model="resourceSearch.resourceName"></el-input>
            </el-col>
            <el-col :span="2" :offset="1">
              <el-button
                type="primary"
                size="medium"
                @click="
                  searchCurrentPage = 1
                  searchResource()
                "
                >Search</el-button
              >
            </el-col>
          </el-form-item>
          <el-form-item></el-form-item>
          <el-form-item>
            <el-table
              :data="searchTableData"
              v-loading="resourceSearchLoading"
              border
              style="width: 100%;margin-left:0;"
            >
              <el-table-column
                prop="resourceID"
                label="ResourceID"
                width="150"
                align="left"
              >
                <template slot-scope="scope">
                  <el-radio
                    v-model="radio"
                    @change="handleSearchTableSelectionChange"
                    :label="scope.row.resourceID"
                    :disabled="scope.row.checked"
                  ></el-radio>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="resourceType" label="ResourceType" width="80" align="center"></el-table-column>
              -->
              <el-table-column
                prop="resourceName"
                label="ResourceName"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="isToken"
                label="IsToken"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="createTime"
                label="CreateTime"
                width="180"
                align="center"
              ></el-table-column>

              <el-table-column
                prop="resourceStatus"
                label="Resource Status"
                width="140"
                align="center"
              ></el-table-column>
              <el-table-column
                v-show="resourceSearch.resourceType == 'Article'"
                prop="publishSatatus"
                label="Publish  Satatus"
                width="140"
                align="center"
              ></el-table-column>
            </el-table>

            <el-col
              :span="8"
              :offset="8"
              style="text-align:center;margin-top:20px;"
            >
              <el-pagination
                v-show="searchTableTotalData > 0"
                background
                :page-size="searchPageSize"
                layout="prev, pager, next"
                :current-page.sync="searchCurrentPage"
                :total="searchTableTotalData"
                @current-change="searchTableChange"
              ></el-pagination>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-col :offset="8" :span="8" style="text-align:center;">
                <el-button
                  style="margin-right:10px;"
                  @click="resetResourceSearchForm"
                  >Cancel</el-button
                >
                <el-button
                  style="margin-left:10px;"
                  type="primary"
                  @click="nextBtnSearch"
                  >Next</el-button
                >
              </el-col>
            </el-row>
          </el-form-item>
        </div>
        <div v-show="!searchResourceStep1">
          <el-form-item label-width="25%" label="Time" required>
            <el-col :span="10">
              <el-date-picker
                v-model="resourceSearchForm.timeRange"
                type="datetimerange"
                range-separator="-"
                start-placeholder="StartTime"
                end-placeholder="EndTime"
                value-format="yyyy/MM/dd HH:mm:00"
              ></el-date-picker>
            </el-col>
            <el-col :offset="3" :span="1">Sort:</el-col>
            <el-col :span="5">
              <el-input v-model="resourceSearchForm.sort"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label-width="25%" label="Target">
            <el-select
              v-model="resourceSearchForm.target"
              :clearable="true"
              placeholder="select target"
            >
              <!-- <el-option key="App" label="App" value="App"></el-option> -->
              <el-option key="H5" label="H5" value="H5"></el-option>
              <el-option key="Video" label="Video" value="Video"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label-width="25%" label="Type">
            <el-select
              v-model="resourceSearchForm.testType"
              :clearable="true"
              placeholder="select type"
            >
              <el-option key="Remote" label="Remote" value="Remote"></el-option>
              <el-option key="Survey" label="Survey" value="Survey"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="resourceSearchForm.target == 'H5'"
            label-width="25%"
            label="Path"
          >
            <el-col :span="12">
              <el-input
                v-model="resourceSearchForm.path"
                placeholder="input target value"
              ></el-input>
            </el-col>

            <el-col :offset="1" :span="2">
              <el-input
                size="small"
                v-model="resourceSearchFormArticle.targetArticleId"
                placeholder="article id"
              ></el-input>
            </el-col>
            <el-col :span="2">
              <el-select
                v-model="resourceSearchFormArticle.clientId"
                size="small"
                placeholder="select client"
              >
                <el-option
                  v-for="item in allClients"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="1">
              <el-button
                style="margin-left:10px;"
                type="primary"
                size="small"
                @click="searchArticleById"
                >Search</el-button
              >
            </el-col>
          </el-form-item>
          <el-form-item label-width="25%" label="Image">
            <el-col :span="12">
              <el-input v-model="resourceSearchForm.coverImageUrl"></el-input>
            </el-col>
            <el-col :span="2" :offset="1">
              <upload
                @change="coverImageFileChange"
                accept="image/png, image/jpeg"
              ></upload>
            </el-col>
          </el-form-item>
          <el-form-item label-width="25%" label="Note">
            <el-input v-model="resourceSearchForm.note"></el-input>
          </el-form-item>
           <el-form-item label-width="25%" label="Tags">
            <el-input
              v-model="resourceSearchForm.tags"
              placeholder="tag1,tag2  split by ',' "
            ></el-input>
          </el-form-item>
          <el-form-item label-width="25%" label="Page">
            <el-checkbox-group v-model="resourceSearchForm.pageType">
              <el-checkbox label="ShareList"></el-checkbox>
              <!-- <el-checkbox label="HomePage"></el-checkbox> -->
              <el-checkbox label="Campaign"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
      </el-form>
      <div v-show="!searchResourceStep1" slot="footer" class="dialog-footer">
        <el-button
          @click="
            dialogNewResource = false
            searchResourceStep1 = true
            resetResourceSearchForm()
          "
          >Cancel</el-button
        >
        <el-button @click="searchResourceStep1 = true">Prev</el-button>
        <el-button
          type="primary"
          :disabled="btnDisabled"
          v-show="!isEditResource"
          @click="saveSearchResource"
          >Save</el-button
        >
        <el-button
          type="primary"
          :disabled="btnDisabled"
          v-show="isEditResource"
          @click="editSearchResource"
          >Edit</el-button
        >
      </div>
    </el-dialog>
    <!------------添加新资源 结束--------------------->
  </div>
</template>

<script>
import {
  getPages,
  savePage,
  getModules,
  saveModule,
  updateModule,
  getModuleDetail,
  searchArticle,
  searchBanners,
  searchProductsAndSKUs,
  getBannerDetail,
  searchClients,
  getCMSArticleInfo,
  saveModuleResource,
  editModuleResource,
  moduleAllResource,
  sortModuleResource,
  delModuleResource,
  publishModule
} from '../../api/pageManage/page.js'
import {
  readUserName,
  userClients,
  changeTimeFormatToUTCYYYYmmDDhhMMss,
  pySort
} from '../../utility/index'

// import {
//   get,
//   getDetail,
//   add,
//   edit,
//   pushMsgNow
// } from '../../api/msgpush/push_task_list.js'
// import { constants } from 'crypto'
// import { ftruncate } from 'fs'

// import upload from '../../utility/upload'
import uploadMixin from '../../mixins/upload'

export default {
  components: {},
  // mixins: [dialogForm],
  data() {
    return {
      market: 'CN',
      pageUser: readUserName(),
      dialogNewPage: false,
      dialogNewModule: false,
      isEditModule: false,
      dialogAddResource: false,
      dialogNewResource: false,
      isEditResource: false,
      editPageModule: false,
      pageAppName: '',
      pageSelecte: '',
      pageModelSelect: { language: '' },
      pageModuleSelect: '',
      pageModuleModelSelect: { language: '' },
      allClients: [],
      allPages: [],
      allPageModules: [],
      searchResourceStep1: true,
      form: { appName: '', pageName: 1 },
      resourceSearch: {
        resourceType: 'Article',
        resourceId: '',
        resourceName: '',
        isToken: 'false'
      },
      resourceSearchLoading: false,
      resourceSearchForm: {
        timeRange: [new Date(), new Date(2099, 12, 31, 23, 59)],
        coverImageUrl: '',
        sort: 0,
        target: '',
        path: '',
        note: '',
        tags: '',
        testType: '',
        pageType: []
      },
      resourceSearchFormArticle: {
        targetArticleId: '',
        clientId: ''
      },

      savePageForm: {
        language: 'zh_CN'
      },
      saveModuleForm: {
        selecterValue: [],
        status: 0
      },

      radio: '',
      clientList: userClients(),
      pageList: [],
      treeData: [],
      value: [],
      moduleTreeOptions: [],

      defaultProps: {
        children: 'children',
        label: 'label'
      },
      pageModuleStatus: [
        { id: 0, name: 'Invalid' },
        { id: 1, name: 'Valid' }
      ],
      tableData: [],
      tableDataLoading: false,
      searchTableData: [],
      searchTableTotalData: 0,
      searchCurrentPage: 1,
      searchTableSelectId: 0,
      searchTableSelectResourceInfo: {},
      searchPageSize: 5,
      resourceEditId: 0,
      btnDisabled: false,
      moduleFormTagEditDisable: false
    }
  },
  methods: {
    handleCurrentChange(pageNo) {
      this.query(pageNo)
    },
    makePageManages(a) {
      if (a) {
        // this.clientChange(this.pageAppName)
      }
    },

    clientChange(item) {
      this.pageList = this.allPages.filter(
        x => x.app_name.toLowerCase() == item.toLowerCase()
      )
      this.pageSelecte = ''
      this.pageModuleSelect = ''
      this.treeData = []
      this.moduleTreeOptions = []
      this.resetResourceSearchForm()
      this.resetSaveModuleForm()
      this.tableData = []
      this.searchTableSelectResourceInfo = {}
      this.searchTableSelectId = 0
      this.searchCurrentPage = 1
    },
    pageChange(item) {
      this.resetResourceSearchForm()
      this.resetSaveModuleForm()
      this.moduleTreeOptions = []
      this.pageModuleSelect = ''
      this.treeData = []
      this.tableData = []
      this.searchTableSelectResourceInfo = {}
      this.searchTableSelectId = 0
      this.searchCurrentPage = 1

      this.pageModelSelect = this.pageList.find(x => x.id == item)

      let trees = this.allPageModules.filter(x => x.page_id == item)
      this.setModuleTree2(trees, [], 9)
      this.setAttachTree(trees, [], 9)
    },
    searchArticleById() {
      if (!this.resourceSearchFormArticle.clientId) {
        this.$message({
          message: 'app not null!',
          type: 'warning',
          duration: 3000
        })
      }

      searchArticle({
        pageNo: 1,
        pageSize: 10,
        title: '',
        id: this.resourceSearchFormArticle.targetArticleId,
        clientId: this.resourceSearchFormArticle.clientId
      }).then(res => {
        if (res.articles.length < 1) {
          this.$message({
            message:
              'Article Id 【 ' +
              this.resourceSearchFormArticle.targetArticleId +
              ' 】 not found!',
            type: 'warning',
            duration: 4000
          })
          return
        }

        if (res.articles[0].isToken) {
          this.$message({
            message: 'This Article open by Access_Token!',
            type: 'warning',
            duration: 4000
          })
        }

        this.resourceSearchForm.path = this.makeArticleUrl(
          res.articles[0],
          this.resourceSearchFormArticle.clientId
        )
      })

      console.log(this.clientList)
    },
    makeArticleUrl(resource, clientId) {
      let envs =
        location.host.includes('dev-') || location.host.includes('localhost')
          ? 'dev-'
          : location.host.includes('qa-')
          ? 'qa-'
          : location.host.includes('uat-')
          ? 'uat-'
          : ''

      let appId = this.allClients.find(x => x.id == clientId).appId
      let articleAuth = ''
      if (resource.isToken == 0) {
        articleAuth = `/unoauth`
      }

      return `https://${envs}lucky.xxxxxxx.com.cn/article/${resource.id}${articleAuth}?culture=zh_CN&subsidiaryCode=CN&isHiddenDate=true&appId=${appId}`
    },
    searchResource() {
      this.resourceSearchLoading = true

      if (this.resourceSearch.resourceType == 'Article') {
        this.resourceSearch.clientId =
          this.allClients.find(
            x => x.name.toLowerCase() == this.pageAppName.toLowerCase()
          ).id || ''

        if (!this.resourceSearch.clientId) {
          this.$message({
            message: 'ClientId not null!',
            type: 'warning'
          })

          this.resourceSearchLoading = false
          return
        }

        searchArticle({
          pageNo: this.searchCurrentPage,
          pageSize: this.searchPageSize,
          title: this.resourceSearch.resourceName,
          id: this.resourceSearch.resourceId,
          clientId: this.resourceSearch.clientId
        }).then(res => {
          this.searchTableData = []
          this.searchTableTotalData = res.totalCount
          if (res.totalCount > 0) {
            // this.searchTableData = []
            for (let i of res.articles) {
              this.searchTableData.push({
                resourceID: i.id,
                resourceName: i.title,
                isToken: i.isToken == 1 ? 'true' : 'false',
                createTime: i.createdTime,
                resourceStatus: 'Valid',
                publishSatatus: 'Published',
                checked: this.tableData.find(
                  x => x.resourceID == i.id && x.resourceType == 'Article'
                )
                  ? true
                  : false
              })
            }
            console.log(
              'this.radio=Article',
              this.searchTableData.find(x => x.checked == true)
            )
            if (this.isEditResource && this.searchTableData.length > 0) {
              console.log(this.searchTableData)

              let selectId = this.searchTableData.find(
                x => x.resourceID == this.resourceSearch.resourceId
              )
              if (selectId) {
                this.radio = selectId.resourceID
              }
            }
          }

          this.resourceSearchLoading = false
        })
      } else if (this.resourceSearch.resourceType == 'Banner') {
        searchBanners({
          pageNo: this.searchCurrentPage,
          pageSize: this.searchPageSize,
          title: this.resourceSearch.resourceName,
          id: this.resourceSearch.resourceId
        }).then(res => {
          this.searchTableData = []
          this.searchTableTotalData = res.totalCount
          if (res.totalCount > 0) {
            // this.searchTableData = []
            for (let i of res.tasks) {
              this.searchTableData.push({
                resourceID: i.id,
                resourceName: i.title,
                createTime: changeTimeFormatToUTCYYYYmmDDhhMMss(i.createdDate),
                resourceStatus: i.status == 0 ? 'Invalid' : 'Valid',
                publishSatatus: '',
                checked: this.tableData.find(
                  x => x.resourceID == i.id && x.resourceType == 'Banner'
                )
                  ? true
                  : false
              })
            }
            console.log(
              'this.radio=Banner',
              this.searchTableData.find(x => x.checked == true)
            )
            if (this.isEditResource) {
              this.radio =
                this.searchTableData.find(
                  x => x.resourceID == this.resourceSearch.resourceId
                ).resourceID || ''
            }
          }
          this.resourceSearchLoading = false
        })
      } else {
        let data = {
          resourceType: this.resourceSearch.resourceType,
          page: this.searchCurrentPage,
          limit: this.searchPageSize,
          market: this.market,
          language: this.pageModelSelect.language
        }
        if (this.resourceSearch.resourceName) {
          data.resourceName = this.resourceSearch.resourceName
        } else {
          data.resourceName = ''
        }

        if (this.resourceSearch.resourceId) {
          data.resourceId = this.resourceSearch.resourceId
        } else {
          data.resourceId = ''
        }

        searchProductsAndSKUs(data).then(res => {
          this.searchTableData = []
          this.searchTableTotalData = res.total
          if (res.total > 0) {
            // this.searchTableData = []
            for (let i of res.list) {
              let id =
                this.resourceSearch.resourceType == 'Product'
                  ? i.oe_product_id
                  : i.oe_sku_id

              this.searchTableData.push({
                resourceID: id,
                resourceName: i.name,
                createTime: changeTimeFormatToUTCYYYYmmDDhhMMss(i.created_at),
                resourceStatus: i.confirmed ? 'Valid' : 'Invalid',
                publishSatatus: '',
                checked:
                  this.tableData.find(
                    x =>
                      x.resourceID == id &&
                      x.resourceType == this.resourceSearch.resourceType
                  ) || !i.confirmed
                    ? true
                    : false,
                desc: i.desc,
                desc_sa: i.desc_sa,
                overview: i.overview || '',
                price: i.price || '',
                product_retail_price: i.product_retail_price || '',
                price_unit: i.price_unit || '',
                sku_image_url: i.sku_image_url || '',
                title: i.name,
                sale_unit: i.sale_unit
              })
            }
            console.log(
              'this.radio=product SKU',
              this.searchTableData.find(x => x.checked == true)
            )
            if (this.isEditResource) {
              this.radio =
                this.searchTableData.find(
                  x => x.resourceID == this.resourceSearch.resourceId
                ).resourceID || ''
            }
          }
          this.resourceSearchLoading = false
        })
      }
    },
    searchTableChange() {
      // this.searchCurrentPage+=1
      this.searchResource()
    },
    handleSearchTableSelectionChange(e) {
      this.searchTableSelectId = e
    },
    nextBtnSearch() {
      if (this.searchTableSelectId == 0) {
        this.$message({
          message: 'Must select a resource, search first!',
          type: 'warning'
        })

        return
      }
      if (this.resourceSearch.resourceType == 'Article') {
        getCMSArticleInfo(this.searchTableSelectId).then(res => {
          this.searchResourceStep1 = false
          this.searchTableSelectResourceInfo = res.article
        })
      } else if (this.resourceSearch.resourceType == 'Banner') {
        getBannerDetail(this.searchTableSelectId).then(res => {
          this.searchResourceStep1 = false
          this.searchTableSelectResourceInfo = res
        })
      } else {
        this.searchResourceStep1 = false

        this.searchTableSelectResourceInfo = this.searchTableData.find(
          x => x.resourceID == this.searchTableSelectId
        )

        console.log(this.searchTableData, this.searchTableSelectResourceInfo)
      }

      if (!this.isEditResource) {
        this.resourceSearchForm.timeRange = [
          new Date(),
          new Date(2099, 11, 31, 23, 59)
        ]
      }
    },
    coverImageFileChange(file) {
      this.handleUpload(file, [], 'coverImageUrl', '')
    },
    handleEdit(index, row) {
      this.dialogNewResource = true
      this.searchCurrentPage = 1
      this.resourceSearch.resourceName = ''
      this.resourceSearch.resourceId = row.resourceID
      this.resourceSearch.clientId = row.json_str.clientId
      this.resourceSearch.resourceType = row.resourceType
      this.searchTableSelectId = row.resourceID
      this.resourceSearchForm.timeRange = row.timeRange
      this.resourceSearchForm.sort = row.sort
      this.resourceSearchForm.target = row.target
      this.resourceSearchForm.path = row.path
      this.resourceSearchForm.coverImageUrl = row.coverImageUrl
      this.resourceSearchForm.note = row.note
      this.resourceSearchForm.tags = row.tags
      this.resourceSearchForm.testType = row.testType
      if (row.pageType) {
        this.resourceSearchForm.pageType = row.pageType
      }
      this.resourceEditId = row.id
      this.isEditResource = true
      this.radio = row.resourceID
      this.searchResource()
    },
    handleDelete(index, row) {
      console.log(row)
      this.$confirm('Be sure to delete?', 'Alert', {
        confirmButtonText: 'YES',
        cancelButtonText: 'NO'
      })
        .then(() => {
          delModuleResource({ resourceId: row.id }).then(() => {
            this.getPageModuleResource(this.pageModuleSelect)
          })
        })
        .catch(() => {})
    },
    publishModule() {
      publishModule({ moduleId: this.pageModuleSelect }).then(res => {
        if (res.res > 0) {
          this.getPageModuleResource(this.pageModuleSelect)
        }
      })
    },

    //---------------------------------------
    savePage() {
      console.log('savepage-->', this.savePageForm)

      if (!this.savePageForm.appName) {
        this.$message({
          message: 'Client not null',
          type: 'warning'
        })
        return
      }
      if (!this.savePageForm.language) {
        this.$message({
          message: 'Language not null',
          type: 'warning'
        })
        return
      }
      let reg = /^[0-9a-zA-Z]+$/
      if (
        !this.savePageForm.tag ||
        !reg.test(this.savePageForm.tag) ||
        this.savePageForm.tag.length > 20
      ) {
        this.$message({
          message: 'Tag only en letters or numbers,max length is 20.',
          type: 'warning'
        })
        return
      }

      if (!this.savePageForm.pageName) {
        this.$message({
          message: 'PageName not null',
          type: 'warning'
        })
        return
      }

      this.dialogNewPage = false
      this.savePageForm.market = this.market
      this.savePageForm.createdBy = this.pageUser
      savePage(this.savePageForm).then(resp => {
        console.log(resp)
        if (resp.result && resp.result == true) {
          this.getpagesAndModules()
          this.savePageForm = {
            appName: '',
            pageName: ''
          }
        }
      })
    },
    saveModule() {
      let reg = /^[0-9a-zA-Z]+$/
      if (
        !this.saveModuleForm.tag ||
        !reg.test(this.saveModuleForm.tag) ||
        this.saveModuleForm.tag.length > 20
      ) {
        this.$message({
          message: 'Tag only en letters or numbers,max length is 20.',
          type: 'warning'
        })
        return
      }

      if (!this.saveModuleForm.moduleName) {
        this.$message({
          message: 'ModuleName not null',
          type: 'warning'
        })
        return
      }

      this.btnDisabled = true
      let data = {
        pageId: this.pageSelecte,
        appName: this.pageAppName,
        tag: this.saveModuleForm.tag,
        language: this.pageModelSelect.language,
        moduleName: this.saveModuleForm.moduleName,
        path: this.saveModuleForm.path,
        note: this.saveModuleForm.note,
        sort: this.saveModuleForm.sort,
        status: this.saveModuleForm.status,
        market: this.market,
        createdBy: this.pageUser
      }

      let selecter = this.saveModuleForm.selecterValue

      if (selecter.length < 1) {
        data.parentId = 0
        data.sonLevel = 0
      } else {
        data.parentId = selecter[selecter.length - 1]
        data.sonLevel = selecter.length
      }

      saveModule(data)
        .then(resp => {
          if (resp.result && resp.result == true) {
            getModules({ pageId: 0 }).then(res => {
              this.allPageModules = res
              this.pageChange(this.pageSelecte)
              this.resetSaveModuleForm()
            })
            this.dialogNewModule = false
          }

          this.btnDisabled = false
        })
        .catch(() => {
          this.btnDisabled = false
        })
    },
    editModule() {
      if (!this.saveModuleForm.moduleName) {
        this.$message({
          message: 'ModuleName not null',
          type: 'warning'
        })
        return
      }

      this.btnDisabled = true
      let data = {
        id: this.pageModuleSelect,
        tag: this.saveModuleForm.tag,
        moduleName: this.saveModuleForm.moduleName,
        path: this.saveModuleForm.path,
        note: this.saveModuleForm.note,
        sort: this.saveModuleForm.sort,
        status: this.saveModuleForm.status,
        updatedBy: this.pageUser
      }

      updateModule(data).then(() => {
        this.dialogNewModule = false
        this.btnDisabled = false
        getModules({ pageId: 0 }).then(res => {
          this.allPageModules = res
          this.pageChange(this.pageSelecte)
          this.resetSaveModuleForm()
        })
      })
    },
    saveSearchResource() {
      if (!this.pageModuleSelect) {
        this.$message({
          message: 'Module not find,please refresh web page!',
          type: 'warning'
        })
        return
      }

      if (!this.resourceSearch.resourceType) {
        this.$message({
          message: 'resourceType not null',
          type: 'warning'
        })
        return
      }

      if (this.searchTableSelectId == 0) {
        this.$message({
          message: 'resourceId not null,prev to select!',
          type: 'warning'
        })
        return
      }

      if (this.resourceSearchForm.timeRange.length != 2) {
        this.$message({
          message: 'StartTime/EndTime not null!',
          type: 'warning'
        })
        return
      }

      if (
        this.resourceSearchForm.target != null &&
        this.resourceSearchForm.target.length > 0 &&
        this.resourceSearchForm.target == 'H5' &&
        this.resourceSearchForm.path.length < 1
      ) {
        this.$message({
          message: 'target not null , path not null!',
          type: 'warning'
        })
        return
      }

      let json_str = {}

      if (this.resourceSearch.resourceType == 'Article') {
        json_str = {
          clientId: this.resourceSearch.clientId,
          id: this.searchTableSelectResourceInfo.id,
          title: this.searchTableSelectResourceInfo.title,
          summary: this.searchTableSelectResourceInfo.summary,
          subTitle: this.searchTableSelectResourceInfo.subTitle,
          squareCoverImageUrl: this.searchTableSelectResourceInfo
            .squareCoverImageUrl,
          rectangleCoverImageUrl: this.searchTableSelectResourceInfo
            .rectangleCoverImageUrl,
          initialLike: this.searchTableSelectResourceInfo.initialLike,
          article_url: this.makeArticleUrl(
            this.searchTableSelectResourceInfo,
            this.resourceSearch.clientId
          )
        }
      } else if (this.resourceSearch.resourceType == 'Banner') {
        json_str = {
          desc: this.searchTableSelectResourceInfo.desc,
          video: this.searchTableSelectResourceInfo.video,

          coverImg: this.searchTableSelectResourceInfo.coverImg,
          image: this.searchTableSelectResourceInfo.image
        }
      } else if (this.resourceSearch.resourceType == 'Product') {
        json_str = {
          desc: this.searchTableSelectResourceInfo.desc,
          desc_sa: this.searchTableSelectResourceInfo.desc_sa,
          overview: this.searchTableSelectResourceInfo.overview
        }
      } else if (this.resourceSearch.resourceType == 'SKU') {
        json_str = {
          price: this.searchTableSelectResourceInfo.price,
          product_retail_price: this.searchTableSelectResourceInfo
            .product_retail_price,
          price_unit: this.searchTableSelectResourceInfo.price_unit,
          sku_image_url: this.searchTableSelectResourceInfo
            .covsku_image_urlerImg,
          desc: this.searchTableSelectResourceInfo.desc,
          desc_sa: this.searchTableSelectResourceInfo.desc_sa,
          sale_unit: this.searchTableSelectResourceInfo.sale_unit
        }
      }

      this.btnDisabled = true
      let data = {
        moduleId: this.pageModuleSelect,
        resourceType: this.resourceSearch.resourceType,
        resourceId: this.searchTableSelectId,
        resourceName: this.searchTableSelectResourceInfo.title,
        resourceJson: JSON.stringify(json_str),
        startTime: this.resourceSearchForm.timeRange[0],
        endTime: this.resourceSearchForm.timeRange[1],
        path: this.resourceSearchForm.path,
        coverImg: this.resourceSearchForm.coverImageUrl,
        sort: this.resourceSearchForm.sort,
        note: this.resourceSearchForm.note,
        tags: this.resourceSearchForm.tags,
        status: 1,
        target: this.resourceSearchForm.target,
        testType: this.resourceSearchForm.testType,
        pageType: this.resourceSearchForm.pageType,
        market: this.market,
        createdBy: this.pageUser
      }

      saveModuleResource(data).then(() => {
        this.dialogNewResource = false

        this.getPageModuleResource(this.pageModuleSelect)
        this.resetResourceSearchForm()
      })

      console.log(
        'this.resourceSearch.timeRange[0]-->',
        this.resourceSearchForm.timeRange
      )
      console.log('data--->', data)
    },
    editSearchResource() {
      if (!this.pageModuleSelect) {
        this.$message({
          message: 'Module not find,please refresh web page!',
          type: 'warning'
        })
        return
      }

      if (!this.resourceSearch.resourceType) {
        this.$message({
          message: 'resourceType not null',
          type: 'warning'
        })
        return
      }

      if (this.searchTableSelectId == 0) {
        this.$message({
          message: 'resourceId not null,prev to select!',
          type: 'warning'
        })
        return
      }

      if (this.resourceSearchForm.timeRange.length != 2) {
        this.$message({
          message: 'StartTime/EndTime not null!',
          type: 'warning'
        })
        return
      }

      let json_str = {}
      if (this.resourceSearch.resourceType == 'Article') {
        json_str = {
          clientId: this.resourceSearch.clientId,
          id: this.searchTableSelectResourceInfo.id,
          title: this.searchTableSelectResourceInfo.title,
          summary: this.searchTableSelectResourceInfo.summary,
          subTitle: this.searchTableSelectResourceInfo.subTitle,
          squareCoverImageUrl: this.searchTableSelectResourceInfo
            .squareCoverImageUrl,
          rectangleCoverImageUrl: this.searchTableSelectResourceInfo
            .rectangleCoverImageUrl,
          initialLike: this.searchTableSelectResourceInfo.initialLike,
          article_url: this.makeArticleUrl(
            this.searchTableSelectResourceInfo,
            this.resourceSearch.clientId
          )
        }
      } else if (this.resourceSearch.resourceType == 'Banner') {
        json_str = {
          desc: this.searchTableSelectResourceInfo.desc,
          video: this.searchTableSelectResourceInfo.video,

          coverImg: this.searchTableSelectResourceInfo.coverImg,
          image: this.searchTableSelectResourceInfo.image
        }
      } else if (this.resourceSearch.resourceType == 'Product') {
        json_str = {
          desc: this.searchTableSelectResourceInfo.desc,
          desc_sa: this.searchTableSelectResourceInfo.desc_sa,
          overview: this.searchTableSelectResourceInfo.overview
        }
      } else if (this.resourceSearch.resourceType == 'SKU') {
        json_str = {
          price: this.searchTableSelectResourceInfo.price,
          product_retail_price: this.searchTableSelectResourceInfo
            .product_retail_price,
          price_unit: this.searchTableSelectResourceInfo.price_unit,
          sku_image_url: this.searchTableSelectResourceInfo
            .covsku_image_urlerImg,
          desc: this.searchTableSelectResourceInfo.desc,
          desc_sa: this.searchTableSelectResourceInfo.desc_sa,
          sale_unit: this.searchTableSelectResourceInfo.sale_unit
        }
      }

      this.btnDisabled = true

      let data = {
        id: this.resourceEditId,
        moduleId: this.pageModuleSelect,
        resourceType: this.resourceSearch.resourceType,
        resourceId: this.searchTableSelectId,
        resourceName: this.searchTableSelectResourceInfo.title,
        resourceJson: JSON.stringify(json_str),
        startTime: this.resourceSearchForm.timeRange[0],
        endTime: this.resourceSearchForm.timeRange[1],
        path: this.resourceSearchForm.path,
        coverImg: this.resourceSearchForm.coverImageUrl,
        sort: this.resourceSearchForm.sort,
        note: this.resourceSearchForm.note,
        tags: this.resourceSearchForm.tags,
        status: 1,
        target: this.resourceSearchForm.target,
        testType: this.resourceSearchForm.testType,
        pageType: this.resourceSearchForm.pageType,
        market: this.market,
        createdBy: this.pageUser
      }

      editModuleResource(data).then(() => {
        this.dialogNewResource = false

        this.getPageModuleResource(this.pageModuleSelect)
        this.resetResourceSearchForm()
      })

      console.log(
        'this.resourceSearch.timeRange[0]-->',
        this.resourceSearchForm.timeRange
      )
      console.log('data--->', data)
    },
    newSortEvent() {
      let sorts = []
      for (let o of this.tableData) {
        sorts.push([o.id, o.sort * 1])
      }

      console.log('sorts-->', sorts)
      sortModuleResource({ resource: sorts }).then(res => {
        if (res.res > 0) {
          this.getPageModuleResource(this.pageModuleSelect)
        }
      })
    },
    selectTreeNode(a) {
      if (a.id != this.pageModuleSelect) {
        this.pageModuleSelect = a.id

        this.pageModuleModelSelect = this.allPageModules.find(x => x.id == a.id)

        console.log('pageModuleModelSelect==>', this.pageModuleModelSelect)

        this.getPageModuleResource(a.id)
      }
    },
    getPageModuleResource(moduleId) {
      this.tableDataLoading = true
      moduleAllResource({ moduleId: moduleId }).then(res => {
        this.tableData = []
        if (res.length > 0) {
          for (let o of res) {
            this.tableData.push({
              sort: o.sort,
              id: o.id,
              resourceType: o.type,
              resourceID: o.resource_id,
              resourceName: o.resource_name,
              createTime: o.updated_date,
              effectiveTime: o.start_date + '~' + o.end_date,
              resourceStatus: o.status,
              publishSatatus: o.published,
              json_str: JSON.parse(o.resource_json),
              coverImageUrl: o.cover_img,
              note: o.note,
              tags: o.tags,
              tag: o.tag,
              language: o.language,
              path: o.path,
              target: o.target,
              timeRange: [o.start_date, o.end_date],
              testType: o.test_type,
              pageType: o.page_type ? o.page_type.split(',') : []
            })
          }
        }
        this.tableDataLoading = false
      })
    },
    getpagesAndModules() {
      getPages({ appName: 'all' }).then(res => {
        this.allPages = pySort(res)
        console.log(pySort(res))

        if (this.pageAppName) {
          this.pageList = this.allPages.filter(
            x => x.app_name == this.pageAppName
          )
        }
      })

      getModules({ pageId: 0 }).then(res => {
        this.allPageModules = res
      })
    },
    getModelById() {
      getModuleDetail({ moduleId: this.pageModuleSelect }).then(res => {
        if (res) {
          this.saveModuleForm = {
            selecterValue: this.editFindSelectParents([], res.id),
            moduleName: res.moduleName,
            path: res.path,
            note: res.note,
            sort: res.sort,
            status: res.status,
            tag: res.tag
          }

          if (res.tag) {
            this.moduleFormTagEditDisable = true
          } else {
            this.moduleFormTagEditDisable = false
          }

          this.isEditModule = true
          this.editPageModule = true
          this.dialogNewModule = true
        }
      })
    },

    setModuleTree2(tree, treeData, soneLevel) {
      let temp = []

      for (let t of tree) {
        if (t.son_level == soneLevel) {
          console.log(soneLevel)
          temp.push({
            id: t.id,
            label: t.module_name + (t.status == 0 ? ' - (invalid)' : ''),
            parent_id: t.parent_id,
            children: treeData.filter(x => x.parent_id == t.id)
          })
        }
      }

      if (soneLevel > 0) {
        this.setModuleTree2(tree, temp, soneLevel - 1)
      } else {
        this.treeData = temp
      }
    },

    setAttachTree(tree, treeData, soneLevel) {
      let temp = []

      for (let t of tree) {
        if (t.son_level == soneLevel) {
          console.log(soneLevel)
          temp.push({
            value: t.id,
            label: t.module_name + (t.status == 0 ? ' - (invalid)' : ''),
            parent_id: t.parent_id,
            children: treeData.filter(x => x.parent_id == t.id)
          })
        }
      }

      if (soneLevel > 0) {
        this.setAttachTree(tree, temp, soneLevel - 1)
      } else {
        this.moduleTreeOptions = temp
      }
    },
    editFindSelectParents(s_id, parentId) {
      console.log('s_id,parentId-->', s_id, parentId)
      let module = this.allPageModules.find(x => x.id == parentId)
      console.log('module-->', module)
      s_id = [module.id, ...s_id]
      if (module.parent_id == 0) {
        return s_id
      }
      return this.editFindSelectParents(s_id, module.parent_id)
    },
    resetSaveModuleForm() {
      this.dialogNewModule = false
      this.saveModuleForm = {
        selecterValue: [],
        moduleName: '',
        path: '',
        note: '',
        sort: '',
        status: ''
      }
      this.btnDisabled = false
      this.moduleFormTagEditDisable = false
    },
    resetResourceSearchForm() {
      this.dialogNewResource = false
      this.searchResourceStep1 = true
      this.resourceSearch = {
        resourceType: 'Article',
        resourceId: '',
        resourceName: '',
        clientId: ''
      }

      this.resourceSearchForm.timeRange = []

      this.resourceSearchForm.sort = 0
      this.resourceSearchForm.path = ''
      this.resourceSearchForm.target = ''
      this.resourceSearchForm.coverImageUrl = ''
      this.resourceSearchForm.note = ''
      this.resourceSearchForm.tags = ''
      this.resourceSearchFormArticle.targetArticleId = ''
      this.resourceSearchFormArticle.clientId = ''

      this.searchTableData = []
      this.searchTableTotalData = 0
      this.searchCurrentPage = 1
      this.searchTableSelectId = 0

      this.isEditResource = false
      this.btnDisabled = false
    }
    // ----------------------------------
  },
  async mounted() {
    this.getpagesAndModules()
    searchClients().then(res => {
      this.allClients = res.clients
      console.log('this.allClients', this.allClients)
    })
  },
  mixins: [uploadMixin],
  watch: {
    dialogFormVisible(v) {
      if (v) return
      //清空表单
      this.$refs['addForm'].resetFields()
    },
    dialogNewModule(v) {
      if (v == false) {
        this.editPageModule = false
      }
      // else {
      // }
    }
  }
}
</script>

<style lang="less">
.el-select-dropdown__wrap {
  max-height: 500px;
}
.c-pagemanage {
  .panle {
    display: flex;
    height: 100%;
    .p-left {
      width: 250px;
      height: 100%;
      padding-right: 10px;
      border-right: 1px solid #ebeef5;

      .p-left-form {
        .el-form-item {
          margin-bottom: 5px;
        }
      }
      .pagename-line {
        .el-form-item__content {
          line-height: 20px;
        }
      }
      .p-pages {
        border-bottom: 1px solid #ebeef5;
        padding-bottom: 10px;
        text-align: right;
      }
      .p-modules {
        padding: 10px 0;
        color: #606266;
        display: flex;
      }
    }
    .p-right {
      padding: 10px;
      width: 85%;
      .el-row {
        text-align: right;
        margin: 10px;
      }
      .el-input--mini {
        .el-input__inner {
          padding: 0;
          text-align: center;
        }
      }
    }
  }
  .el-dialog__header {
    border-bottom: 1px solid #ccc;
  }

  .el-icon-circle-check-green {
    font-size: 25px;
    color: #138c00;
  }

  .tip {
    padding: 5px 16px;
    background-color: #ecf8ff;
    border-radius: 4px;
    border-left: 5px solid #50bfff;
    margin: 0px;
  }

  .pagelang-c {
    .el-form-item__label {
      width: 80px !important;
    }
  }
}
</style>
