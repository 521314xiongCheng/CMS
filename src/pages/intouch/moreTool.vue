<!-- more tool page -->
<template>
  <div class="more-tool-page">
    <!-- head -->
    <div class="g-page-bar">
      <span class="page-title">xxxxxxx MoreTool</span>
      <el-button
        class="add-btn"
        icon="el-icon-plus"
        size="mini"
        @click="add"
      ></el-button>
    </div>
    <!-- table -->
    <div class="table-wrap">
      <table-list :tableData="tableData" :choosePageFn="choosePageFn">
        <el-table-column label="" align="center" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="editAction(scope)"
              >Edit</el-button
            >
            <el-button
              size="mini"
              @click="onlineAction(scope)"
              :type="scope.row.onlineStatus === '已上线' ? 'info' : 'success'"
            >
              {{ scope.row.onlineStatus === '已上线' ? 'Offline' : 'Online' }}
            </el-button>
            <el-button size="mini" type="danger" @click="deleteAction(scope)"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </table-list>
    </div>
    <!-- dialog -->
    <el-dialog
      :title="dialogTitle"
      @close="closeDialogCb"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-width="150px"
        label-position="left"
      >
        <el-form-item label="Title" prop="title">
          <el-input
            type="text"
            v-model="form.title"
            auto-complete="off"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="ModuleName" prop="moduleName">
          <el-select
            v-model="form.moduleName"
            placeholder="please select the ModuleName"
            style="width: 300px"
          >
            <el-option
              v-for="(item, key) in moduleNameTypes"
              :key="key"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="ModuleSubName" prop="moduleSubName">
          <el-select
            v-model="form.moduleSubName"
            placeholder="please select the ModuleSubName"
            style="width: 300px"
          >
            <el-option
              v-for="(item, key) in moduleNameTypes"
              :key="key"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="MinLevel" prop="levelMin">
          <el-input
            type="number"
            style="width: 80px"
            :min="1"
            v-model="form.levelMin"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="MaxLevel" prop="levelMax">
          <el-input
            type="number"
            style="width: 80px"
            :min="1"
            :max="100"
            v-model="form.levelMax"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="StartTime" prop="startTimestamp">
          <el-date-picker
            v-model="form.startTimestamp"
            type="date"
            value-format="timestamp"
            placeholder="Please select the StartTime"
            style="width: 300px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="EndTime" prop="endTimestamp">
          <el-date-picker
            v-model="form.endTimestamp"
            type="date"
            value-format="timestamp"
            placeholder="Please select the EndTime"
            style="width: 300px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Sort" prop="sort">
          <el-input
            type="number"
            style="width: 80px"
            :min="1"
            v-model="form.sort"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="ImageUrl" prop="imageUrl">
          <el-input
            v-model="form.imageUrl"
            style="position: absolute; left: 90px;width: 300px;"
          ></el-input>
          <upload
            @change="imageFileChange"
            accept="image/png, image/jpeg"
            :fileList="imageUrlList"
          ></upload>
        </el-form-item>
        <div class="text-center">
          <el-button @click="handleCancel">Cancel</el-button>
          <el-button type="primary" @click="submit">Confirm</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import xxxxxxxMixin from '@/mixins/xxxxxxx.js'
import { PAGE_CONFIGS } from '@/config'

export default {
  data() {
    const tableHeader = [
      {
        tableId: 'id',
        tableName: 'Id',
        tableWidth: '50px'
      },
      {
        tableId: 'title',
        tableName: 'Title'
      },
      {
        tableId: 'imageUrl',
        tableName: 'ImageUrl'
      },
      {
        tableId: 'moduleName',
        tableName: 'ModuleName'
      },
      {
        tableId: 'moduleSubName',
        tableName: 'ModuleSubName'
      },
      // {
      //   tableId: 'levelMin',
      //   tableName: 'MinLevel'
      // },
      // {
      //   tableId: 'levelMax',
      //   tableName: 'MaxLevel'
      // },
      {
        tableId: 'sort',
        tableName: 'Sort',
        tableWidth: '50px'
      },
      {
        tableId: 'onlineStatus',
        tableName: 'OnlineStatus'
      }
    ]
    return {
      PAGE_CONFIG: PAGE_CONFIGS['xxxxxxx_moreTool'],
      tableData: {
        data: [],
        pageData: {
          pageSize: 20,
          totalCount: 0
        },
        header: tableHeader
      },
      form: {
        title: '',
        levelMin: 1,
        levelMax: 100,
        imageUrl: '',
        sort: 1,
        startTimestamp: null,
        endTimestamp: null,
        moduleName: '',
        moduleSubName: ''
      },
      moduleNameTypes: ['SIGNUP', 'STAR'],
      imageUrlList: []
    }
  },
  mixins: [xxxxxxxMixin],
  methods: {},
  created() {
    this.getTableList(1)
  }
}
</script>
<style lang="less" scoped></style>
