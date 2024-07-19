<template>
  <div class="custom-tree-container">
    <div class="title">员工列表</div>
    <div class="handle-list">
      <!-- <el-button
        type="primary"
        size="mini"
        :disabled="true"
        @click="append(currentData, 2)"
      >
        添加子部门
      </el-button>
      <el-button
        type="primary"
        size="mini"
        :disabled="true"
        @click="append(currentData, 3)"
      >
        编辑
      </el-button>
      <el-button
        type="danger"
        size="mini"
        @click="remove(currentData)"
        :disabled="true"
      >
        删除
      </el-button> -->
    </div>
    <el-row style="display: flex;">
      <el-col style="width:340px" class="block tree-node">
        <div :span="4" style="padding-bottom:5px">
          <el-input
            placeholder="输入关键字进行过滤"
            size="small"
            v-model="filterText"
          >
          </el-input>
        </div>

        <el-tree
          :data="data"
          node-key="id"
          ref="treeNode"
          :default-expanded-keys="expandedKeys"
          :default-expand-all="false"
          :expand-on-click-node="false"
          :highlight-current="true"
          :auto-expand-parent="false"
          :props="defaultProps"
          :filter-node-method="filterNode"
          @node-click="nodeClick"
          @node-expand="nodeExpand"
          @node-collapse="nodeCollapse"
        >
          <span class="custom-tree-node" slot-scope="{ node }">
            <span :title="node.label">{{ cutString(node.label, 22) }}</span>
            <!-- <span>
              <span style="margin-right:10px;"> id{{ data.id }} </span>
              <span> 层级{{ data.level }} </span>
            </span> -->
          </span>
        </el-tree>
      </el-col>
      <el-col style="width:100%" v-if="showList" class="item-detail">
        <div class="top">
          <div>
            {{ currentData.name }} ({{ tableData.pageData.totalCount }})
            <el-link
              icon="el-icon-edit"
              type="primary"
              :underline="false"
              @click="append(currentData, 3)"
            ></el-link>
          </div>
          <div style="padding-right:20px">
            <el-link
              :underline="false"
              size="mini"
              type="primary"
              @click="showImportUploadList()"
              >批量导入记录</el-link
            >
            <el-link
              style="padding-left:10px"
              :underline="false"
              size="mini"
              type="primary"
              @click="exportUser()"
              >导出部门员工</el-link
            >
          </div>
        </div>
        <div class="search">
          <div class="title">
            <!-- <el-button type="primary" size="mini" @click="addUser(true, 0)">
              添加员工
            </el-button> -->
            <el-button type="primary" size="mini" @click="showImportUser">
              批量更新导入
            </el-button>
            <!-- <el-button
              type="danger"
              size="mini"
              @click="removeUser"
              :disabled="multipleSelection && multipleSelection.length == 0"
            >
              删除
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="showChangeUserDepartment"
              :disabled="multipleSelection && multipleSelection.length == 0"
            >
              更换部门
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="handInviteUser"
              :disabled="multipleSelection && multipleSelection.length == 0"
            >
              邀请
            </el-button> -->
          </div>
          <div style="padding: 0 0 15px 0;">
            <el-select
              size="small"
              style="padding-left:30px"
              v-model.trim="filters.status"
              @change="onSearchEmployeeList()"
              clearable
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="未加入企业" value="4"></el-option>
              <el-option label="已加入企业" value="1"></el-option>
              <!-- <el-option label="已禁用" value="2"></el-option> -->
              <el-option label="已退出" value="5"></el-option>
              <!-- <el-option label="有客户联系权限" value="6"></el-option> -->
            </el-select>
            <el-input
              style="padding:0 5px"
              size="small"
              v-model="filters.keyWord"
              placeholder=""
              clearable
            ></el-input>
            <el-button
              type="primary"
              size="mini"
              @click="onSearchEmployeeList()"
            >
              搜索
            </el-button>
          </div>
        </div>
        <div>
          <el-table
            v-loading="tableLoading"
            border
            style="width:100%"
            :data="tableData.data"
            @selection-change="handleSelectionChange"
          >
            <!-- <template slot="between"> -->
            <el-table-column
              type="selection"
              width="55"
              align="center"
            ></el-table-column>
            <!-- </template> -->
            <el-table-column
              prop="name"
              align="center"
              label="姓名"
              fixed="left"
            ></el-table-column>
            <el-table-column
              prop="direct_seller_id"
              align="center"
              label="12位编号"
            ></el-table-column>
            <el-table-column
              prop="department"
              :formatter="formatDepartment"
              align="center"
              label="部门"
            ></el-table-column>
            <el-table-column
              prop="position"
              align="center"
              label="职务"
            ></el-table-column>
            <el-table-column
              prop="mobile"
              align="center"
              label="手机"
            ></el-table-column>
            <el-table-column
              prop="email"
              align="center"
              label="邮箱"
            ></el-table-column>
            <el-table-column
              prop="role"
              align="center"
              :formatter="formatRole"
              label="角色"
            ></el-table-column>
            <el-table-column
              prop="status"
              :formatter="formatStatus"
              align="center"
              label="状态"
            ></el-table-column>
            <el-table-column
              label="操作"
              align="center"
              fixed="right"
              width="160"
            >
              <template slot-scope="{ row }">
                <el-button
                  size="mini"
                  type="success"
                  @click="selectUser(row.user_id)"
                  >查看</el-button
                >
                <el-button
                  size="mini"
                  type="primary"
                  @click="addUser(false, row.user_id)"
                  >修改</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="page-box">
            <!-- <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNo"
              :page-sizes="[20, 30, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableData.total"
            >
            </el-pagination> -->
            <el-pagination
              @current-change="handleCurrentChange"
              :page-size="pageSize"
              :current-page="filters.pageNo"
              layout="total, prev, pager, next, jumper"
              :total="tableData.pageData.totalCount"
            ></el-pagination>
          </div>
        </div>
      </el-col>
      <el-col :span="20" v-if="showEdit" class="item-detail">
        <div>
          <div class="title">{{ isAddUser ? '添加员工' : '编辑员工' }}</div>
          <el-form
            :model="detailForm"
            :rules="formRules"
            inline
            ref="detailForm"
            size="small"
            class="form-style"
            label-width="120px"
          >
            <div>
              <el-form-item label="姓名" prop="name">
                <el-input
                  :disabled="true"
                  v-model.trim="detailForm.name"
                  style="width: 400px"
                ></el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="别名" prop="alias">
                <el-input
                  :disabled="true"
                  v-model.trim="detailForm.alias"
                  style="width: 400px"
                ></el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="12位编号" prop="direct_seller_id">
                <el-input
                  v-model.trim="detailForm.direct_seller_id"
                  style="width: 400px"
                  maxlength="12"
                ></el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="工号" prop="employee_NO">
                <el-input
                  :disabled="true"
                  v-model.trim="detailForm.employee_NO"
                  style="width: 400px"
                ></el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="detailForm.gender" :disabled="true">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="2">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="手机" prop="mobile">
                <el-input
                  :disabled="true"
                  maxlength="11"
                  v-model.trim="detailForm.mobile"
                  style="width: 400px"
                ></el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="邮箱" prop="email">
                <el-input
                  :disabled="true"
                  v-model.trim="detailForm.email"
                  style="width: 400px"
                ></el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="部门" prop="department">
                <el-cascader
                  :disabled="true"
                  ref="cascaderEdit"
                  clearable
                  v-model="detailForm.department"
                  :options="data"
                  filterable
                  :show-all-levels="false"
                  :props="{
                    checkStrictly: true,
                    expandTrigger: 'hover',
                    emitPath: false,
                    children: 'children',
                    label: 'name',
                    value: 'id'
                  }"
                >
                  <template slot-scope="{ node, data }">
                    <div @click="cascaderClickByEdit(data)">
                      <span>{{ data.name }}</span>
                      <span v-if="!node.isLeaf">
                        ({{ data.children.length }})
                      </span>
                    </div>
                  </template>
                </el-cascader>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="对外显示部门" prop="external_department">
                <el-input
                  v-model.trim="detailForm.external_department"
                  style="width: 400px"
                ></el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="职务" prop="position">
                <el-input
                  :disabled="true"
                  v-model.trim="detailForm.position"
                  style="width: 400px"
                ></el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="角色" prop="role">
                <el-select v-model.trim="detailForm.role" clearable>
                  <el-option label="普通员工" value="staff"></el-option>
                  <el-option label="SFD" value="sfd"></el-option>
                  <el-option label="admin" value="admin"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div>
              <el-form-item label="座机" prop="telephone">
                <el-input
                  :disabled="true"
                  v-model.trim="detailForm.telephone"
                  style="width: 400px"
                ></el-input>
              </el-form-item>
            </div>

            <el-form-item label=" ">
              <el-button size="small" @click="backUserList">
                返回
              </el-button>
              <el-button v-if="isAddUser" @click="addUser(true, 0)"
                >清除</el-button
              >
              <el-button
                size="small"
                type="primary"
                @click="confirmSaveUser('detailForm')"
                :loading="loading"
              >
                保存
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="20" v-if="showDetail" class="item-detail">
        <div>
          <div class="title">员工详情</div>
          <el-form
            :model="detailForm"
            inline
            ref="detailForm"
            size="small"
            class="form-style"
            label-width="120px"
          >
            <div>
              <el-form-item label="姓名：" prop="name">
                {{ detailForm.name }}
              </el-form-item>
            </div>
            <div>
              <el-form-item label="别名：" prop="alias">
                {{ detailForm.alias }}
              </el-form-item>
            </div>
            <div>
              <el-form-item label="12位编号：" prop="direct_seller_id">
                {{ detailForm.direct_seller_id }}
              </el-form-item>
            </div>
            <div>
              <el-form-item label="ContactID：" prop="direct_seller_id">
                {{ detailForm.contact_id }}
              </el-form-item>
            </div>
            <div>
              <el-form-item label="工号：" prop="employee_NO">
                {{ detailForm.employee_NO }}
              </el-form-item>
            </div>
            <div>
              <el-form-item label="性别：" prop="gender">
                {{ getGenderStr(detailForm.gender) }}
              </el-form-item>
            </div>
            <div>
              <el-form-item label="手机：" prop="mobile">
                {{ detailForm.mobile }}
              </el-form-item>
            </div>
            <div>
              <el-form-item label="邮箱：" prop="email">
                {{ detailForm.email }}
              </el-form-item>
            </div>
            <div>
              <el-form-item label="部门：" prop="department">
                {{ getDepartmentName(detailForm.department) }}
              </el-form-item>
            </div>
            <div>
              <el-form-item label="对外显示部门：" prop="department">
                {{ detailForm.external_department }}
              </el-form-item>
            </div>
            <div>
              <el-form-item label="职务：" prop="position">
                {{ detailForm.position }}
              </el-form-item>
            </div>
            <div>
              <el-form-item label="角色：" prop="role">
                {{ getRomeName(detailForm.role) }}
              </el-form-item>
            </div>
            <div>
              <el-form-item label="座机：" prop="telephone">
                {{ detailForm.telephone }}
              </el-form-item>
            </div>

            <el-form-item label=" ">
              <!-- <el-button
                type="danger"
                size="small"
                @click="removeUserByDetail(detailForm)"
              >
                删除
              </el-button> -->
              <el-button
                type="primary"
                size="small"
                @click="addUser(false, detailForm.user_id)"
              >
                编辑
              </el-button>
              <el-button size="small" @click="backUserList">
                返回
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>

    <!-- 添加部门 -->
    <el-dialog
      :title="departmentForm.mode == 2 ? '新增部门' : '编辑部门'"
      :visible.sync="dialogDepartmentVisible"
      width="30%"
      @close="closeDialog"
    >
      <el-form
        label-width="80px"
        :model="departmentForm"
        :rules="departmentFormRules"
        ref="departmentForm"
      >
        <el-form-item label="部门名称" prop="name">
          <div class="demo-input-suffix">
            <el-input
              placeholder="请输入部门名称"
              v-model="departmentForm.name"
            >
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="上级部门" prop="parentName">
          <div class="demo-input-suffix">
            <el-input
              placeholder="无"
              disabled
              v-model="departmentForm.parentName"
            >
            </el-input>
          </div>
        </el-form-item>

        <span class="dialog-footer">
          <el-button
            @click="
              dialogDepartmentVisible = false
              $refs['departmentForm'].resetFields()
            "
            >取 消</el-button
          >
          <el-button
            type="primary"
            @click="dialogDepartmentSubmit('departmentForm')"
            >{{ departmentForm.mode == 3 ? '修改' : '确定' }}</el-button
          >
        </span>
      </el-form>
    </el-dialog>
    <!-- 添加部门 -->
    <!-- 更改部门 -->
    <el-dialog
      title="更改部门"
      :visible.sync="dialogEditUserDepartmentVisible"
      width="30%"
      @close="closeDepartmentDialog"
    >
      <el-form>
        <el-form-item label="部门名称" prop="name">
          <el-cascader
            ref="cascaderBatch"
            clearable
            v-model="userDepartment"
            :options="data"
            filterable
            :show-all-levels="false"
            :props="{
              checkStrictly: true,
              expandTrigger: 'hover',
              emitPath: false,
              children: 'children',
              label: 'name',
              value: 'id'
            }"
          >
            <template slot-scope="{ node, data }">
              <div @click="cascaderClickByBatch(data)">
                <span>{{ data.name }}</span>
                <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
              </div>
            </template>
          </el-cascader>
        </el-form-item>
        <span class="dialog-footer">
          <el-button @click="closeDepartmentDialog">取 消</el-button>
          <el-button type="primary" @click="saveChangeUserDepartment()"
            >确定</el-button
          >
        </span>
      </el-form>
    </el-dialog>
    <!-- 更改部门 -->
    <!-- 更改部门 -->
    <el-dialog
      title="批量导入"
      :visible.sync="dialogImportVisible"
      width="30%"
      @close="closeImportDialog"
    >
      <el-form :model="form" ref="form" :rules="importFormRules">
        <el-form-item label="员工名单" prop="user_list_url">
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
        <span class="dialog-footer">
          <el-button @click="closeImportDialog">取 消</el-button>
          <el-button
            type="primary"
            :loading="loading"
            @click="importUserList('form')"
            >确定</el-button
          >
        </span>
      </el-form>
    </el-dialog>
    <!-- 更改部门 -->
    <el-dialog
      title="批量导入记录"
      :visible.sync="dialogUploadListVisible"
      width="60%"
      @close="closeUploadListDialog"
    >
      <div style="padding-bottom:10px">
        状态:
        <el-select
          size="small"
          v-model.trim="uploadListStatus"
          @change="getImportUploadList()"
          clearable
        >
          <el-option label="全部" value=""></el-option>
          <el-option label="待执行" value="0"></el-option>
          <el-option label="执行中" value="1"></el-option>
          <el-option label="已完成" value="2"></el-option>
          <el-option label="执行失败" value="3"></el-option>
        </el-select>
        <el-input
          style="padding:0 5px"
          size="small"
          v-model="createdBy"
          placeholder="创建人"
          clearable
        ></el-input>
        <el-button type="primary" size="mini" @click="getImportUploadList()">
          搜索
        </el-button>
      </div>

      <el-table :data="importUploadList" border style="width: 100%;">
        <el-table-column
          prop="id"
          label="Id"
          align="center"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="status"
          :formatter="formatUploadStatus"
          align="center"
          label="进度"
          width="100"
        ></el-table-column>
        <!-- <el-table-column
          prop="add_number"
          align="center"
          label="新增员工数"
          width="100"
        ></el-table-column> -->
        <el-table-column
          prop="update_number"
          align="center"
          label="覆盖员工数"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="err_msg"
          align="center"
          :formatter="formatErrorMsg"
          label="返回结果"
        ></el-table-column>
        <el-table-column
          prop="created_time"
          align="center"
          :formatter="formatDatetime"
          label="创建时间"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="created_by"
          align="center"
          label="创建人"
          width="180"
        ></el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="160">
          <a href=""></a>
          <template slot-scope="{ row }">
            <el-link
              size="mini"
              type="primary"
              :underline="false"
              :href="row.file_path"
              >导出文件</el-link
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box">
        <el-pagination
          @size-change="handleSizeChangeByUploadList"
          @current-change="handleCurrentChangeByUploadList"
          :current-page="uploadListPageNo"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="uploadListPagTotal"
        >
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import TableList from '@/components/tableList.vue'
import restfulMixin from '@/mixins/restful.js'
import upload from '@/mixins/upload.js'
import Upload from '@/components/xxxxxxx/uploadFile'
import { uploadToResource } from '@/api/index.js'
import {
  getDepartmentList,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  getEmployeeList,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
  exportEmployees,
  importEmployees,
  changeUserDepartment,
  inviteUser,
  getUploadList
} from '@/api/entWechat/user.js'
import {
  getCategories,
  sortCategory,
  delCategoryById
} from '@/api/library/category.js'
import { deepCopy, deleteOneofArray, formatDate } from '@/utility/index.js'

export default {
  components: {
    TableList,
    Upload
  },
  mixins: [restfulMixin, upload],
  data() {
    let that = this
    let validatorEmpty = (rule, value, callback) => {
      if (value.trim().length == 0) {
        callback(new Error('请输入部门名称'))
      }
      if (that.strCode(value) > 32) {
        callback(new Error('请输入的内容不超过 32 个字符'))
      }
      callback()
    }

    let validatorDirectSellerId = (rule, value, callback) => {
      if (value && value.trim().length > 0) {
        if (value.trim().length != 12) callback(new Error('请输入正确的编号'))
      } else {
        callback(new Error('请输入12位编号'))
      }
      callback()
    }
    let validatorNameStrLength = (rule, value, callback) => {
      if (value && value.trim().length > 0) {
        if (that.strCode(value) > 32) {
          callback(new Error('请输入的内容不超过 32 个字符'))
        }
      } else {
        callback(new Error('请输入姓名'))
      }
      callback()
    }

    let validatorCharLength = (rule, value, callback) => {
      if (value && value.trim().length > 0) {
        if (that.strCode(value) > 32) {
          callback(new Error('请输入的内容不超过 32 个字符'))
        }
      }
      callback()
    }
    let validatorUserId = (rule, value, callback) => {
      if (value && value.trim().length > 0) {
        if (value.toLowerCase().indexOf('@mkcorp.com') == -1) {
          callback(new Error('请输入正确的xxxxxxx邮箱,后缀为@mkcorp.com'))
        }
      }
      callback()
    }

    let validatorPhone = (rule, value, callback) => {
      if (value && value.trim().length > 0) {
        if (!that.isCellPhone(value)) {
          callback(new Error('请输入正确的手机号'))
        }
      }
      callback()
    }
    let validatorTelephone = (rule, value, callback) => {
      let isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/
      if (value && value.trim().length > 0) {
        if (!isPhone.test(value)) {
          callback(
            new Error('请输入正确的座机号码,格式:xxx-xxxxxxxx/xxxx-xxxxxxx')
          )
        }
      }
      callback()
    }
    return {
      filterText: '',
      data: [],
      originalDepartments: [],
      imageList: [],
      currentNode: {},
      currentData: {},
      userDepartment: '',
      defaultProps: {
        children: 'children',
        label: (data, node) => {
          return data.name
        }
      },
      expandedKeys: [],
      loading: false,
      showDetail: false,
      showEdit: false,
      showList: true,
      form: {},
      detailForm: {},
      formRules: {
        // name: [
        //   {
        //     validator: validatorNameStrLength,
        //     required: true,
        //     trigger: 'blur'
        //   }
        // ],
        direct_seller_id: [
          {
            validator: validatorDirectSellerId,
            required: true,
            trigger: 'blur'
          }
        ],
        // mobile: [
        //   {
        //     required: true,
        //     message: '请输入手机号',
        //     trigger: 'blur'
        //   },
        //   { validator: validatorPhone, required: true, trigger: 'blur' }
        // ],
        // email: [
        //   {
        //     required: true,
        //     message: '请输入邮箱地址',
        //     trigger: 'blur'
        //   },
        //   { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
        //   {
        //     validator: validatorUserId,
        //     trigger: 'blur'
        //   }
        // ],
        // department: [
        //   {
        //     required: true,
        //     message: '请选择部门',
        //     trigger: 'blur'
        //   }
        // ],
        external_department: [
          {
            required: true,
            message: '请输入对外显示部门',
            trigger: 'blur'
          },
          {
            validator: validatorCharLength,
            trigger: 'blur'
          }
        ],
        role: [
          {
            required: true,
            message: '请选择角色',
            trigger: 'blur'
          }
        ],
        position: [
          {
            validator: validatorCharLength,
            trigger: 'blur'
          }
        ],
        alias: [
          {
            validator: validatorCharLength,
            trigger: 'blur'
          }
        ],
        employee_NO: [
          {
            validator: validatorCharLength,
            trigger: 'blur'
          }
        ],
        telephone: [
          {
            validator: validatorTelephone,
            trigger: 'blur'
          }
        ]
      },
      pageSize: 20,
      tableData: {
        data: [],
        pageData: {
          pageSize: 20,
          totalCount: 0
        }
      },
      filters: {
        pageSize: 20,
        pageNo: 1,
        status: '',
        keyWord: ''
      },
      duplicateId: null,
      multipleSelection: [],
      dialogDepartmentVisible: false, //部门控制
      departmentForm: {
        name: '',
        parentName: '',
        parentid: -1
      }, //部门提交
      departmentFormRules: {
        name: [
          {
            validator: validatorEmpty,
            required: true,
            trigger: 'blur'
          }
        ]
      },
      loadingStatus: null,
      isAddUser: false,
      dialogEditUserDepartmentVisible: false,
      dialogImportVisible: false,
      form: {
        user_list_url: ''
      },
      importFormRules: {
        user_list_url: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      excelList: [],
      dialogUploadListVisible: false,
      uploadListPageSize: 10,
      uploadListPageNo: 1,
      uploadListPagTotal: 0,
      importUploadList: [],
      uploadListStatus: '',
      createdBy: '',
      tableLoading: true
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeNode.filter(val)
    }
  },
  created() {
    this.getData()
  },
  methods: {
    isCellPhone(val) {
      if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
        return false
      } else {
        return true
      }
    },
    formatDepartment(row, column) {
      let vm = this
      var data = row[column.property]
      if (data == undefined) {
        return ''
      }
      const item = vm.originalDepartments.find(item => item.id == data[0])
      return item.name
    },
    getDepartmentName(department) {
      let vm = this
      const item = vm.originalDepartments.find(item => item.id == department)
      return item.name
    },
    getGenderStr(gender) {
      let labelName = ''
      switch (gender) {
        case 1:
          labelName = '男'
          break
        case 2:
          labelName = '女'
          break
        default:
          break
      }
      return labelName
    },
    getRomeName(name) {
      let labelName = ''
      switch (name) {
        case 'staff':
          labelName = '普通员工'
          break
        case 'sfd':
          labelName = 'SFD'
          break
        case 'admin':
          labelName = 'admin'
          break
        default:
          break
      }
      return labelName
    },
    formatRole(row, column) {
      let vm = this
      let srt = ''
      var data = row[column.property]
      if (data == undefined) {
        return ''
      }
      switch (data) {
        case 'staff':
          srt = '普通员工'
          break
        case 'sfd':
          srt = 'SFD'
          break
        case 'admin':
          srt = 'admin'
          break
        default:
          break
      }
      return srt
    },
    formatStatus(row, column) {
      let vm = this
      let srt = ''
      var data = row[column.property]
      if (data == undefined) {
        return ''
      }
      switch (data) {
        case 1:
          srt = '已加入企业'
          break
        case 4:
          srt = '未加入企业'
          break
        case 5:
          srt = '已退出'
          break
        default:
          break
      }
      return srt
    },

    formatUploadStatus(row, column) {
      let vm = this
      let srt = ''
      var data = row[column.property]
      if (data == undefined) {
        return ''
      }
      switch (data) {
        case 0:
          srt = '待执行'
          break
        case 1:
          srt = '执行中'
          break
        case 2:
          srt = '已完成'
          break
        case 3:
          srt = '执行失败'
          break
        default:
          break
      }
      return srt
    },
    formatDatetime(row, column) {
      let vm = this
      let srt = ''
      var data = row[column.property]
      if (data == undefined) {
        return ''
      }
      srt = formatDate(data)
      return srt
    },
    formatErrorMsg(row, column) {
      let vm = this
      let srt = ''
      var data = row[column.property]
      if (data == undefined) {
        return ''
      }
      try {
        return JSON.parse(data).errmsg
      } catch (error) {
        return ''
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    clearFilter() {
      this.filters.pageNo = 1
      this.filters.status = ''
      this.filters.keyWord = ''
    },
    nodeClick(data, node) {
      this.showEdit = false
      this.clearFilter()
      console.log(data)
      console.log(node)

      this.currentData = deepCopy(data)
      this.currentNode = deepCopy(node)
      this.tableLoading = true
      let req = {}
      req.pageSize = this.filters.pageSize
      req.pageNo = this.filters.pageNo
      req.departmentId = this.currentData.id
      req.fetchChild = 1
      req.status = this.filters.status
      req.searchStr = this.filters.keyWord
      getEmployeeList(req).then(resp => {
        this.tableLoading = false
        this.tableData.data = resp.userlist
        this.tableData.pageData.totalCount = Number(resp.total)
      })
      this.showList = true
    },
    onSearchEmployeeList() {
      this.filters.pageNo = 1
      this.getEmployeeList()
    },
    getEmployeeList() {
      let req = {}
      req.pageSize = this.filters.pageSize
      req.pageNo = this.filters.pageNo
      req.departmentId = this.currentData.id
      req.fetchChild = 1
      req.status = this.filters.status
      req.searchStr = this.filters.keyWord
      this.tableLoading = true
      getEmployeeList(req).then(resp => {
        this.tableLoading = false
        this.tableData.data = resp.userlist
        this.tableData.pageData.totalCount = Number(resp.total)
      })
    },
    // 节点展开时触发的事件
    nodeExpand(data) {
      this.expandedKeys.push(data.id)
    },
    // 节点收起时触发的事件
    nodeCollapse(data) {
      deleteOneofArray(data.id, this.expandedKeys)
    },
    // 判断节点能否被拖拽
    allowDrag(draggingNode) {
      if (draggingNode.level === 1) return false
      return true
    },
    // 拖拽时判定目标节点能否被放置
    allowDrop(draggingNode, dropNode, type) {
      if (
        draggingNode.data.parentCategoryId !== dropNode.data.parentCategoryId ||
        type === 'inner'
      ) {
        return false
      }
      return true
    },
    nodeDragStart() {},
    // 拖拽成功完成时触发的事件
    nodeDrop(currentNode, enterNode, type) {
      // 获取被拖拽节点父节点信息
      console.log(type)
      let target_parent_id = null
      let sort = null
      switch (type) {
        case 'inner':
          target_parent_id = enterNode.data.id
          sort = enterNode.data.children.length
          break
        case 'after':
        case 'before':
          target_parent_id = enterNode.data.parentCategoryId
          enterNode.parent.childNodes.forEach((o, i) => {
            if (o.data.id === currentNode.data.id) {
              sort = i + 1 //sort从1开始
            }
          })
          break
      }
      let data = {
        parentCategoryId: target_parent_id,
        sort: sort
      }
      console.log(data)
      sortCategory(currentNode.data.id, data).then(() => {
        this.currentData = currentNode.data
        this.getData('sort')
      })
    },
    // 获取分类树数据
    getData(type) {
      // getDepartmentList().then(resp => {
      //   console.log(resp) //api调通
      // })
      getDepartmentList().then(res => {
        this.originalDepartments = res.department
        this.data = this.toTree(res.department)
        // this.originalDepartments = this.data
        console.log(this.data)
        this.$nextTick(() => {
          let node = null,
            data = null

          switch (type) {
            case 'del':
              this.$refs.treeNode.setCurrentKey(this.currentData.parentid)
              node = this.currentNode.parent
              data = this.currentNode.parent.data
              this.nodeClick(data, node)
              break
            case 'edit':
            case 'sort':
            case 'add':
              console.log(1)
              this.$refs.treeNode.setCurrentKey(this.currentData.id)
              // node = this.currentNode
              // data = this.currentNode.data
              // this.nodeClick(data, node)
              break
            default:
              this.$refs.treeNode.setCurrentKey(this.data[0].id)
              this.expandedKeys = [this.data[0].id]
              node = this.$refs.treeNode.getNode(this.data[0].id)
              this.nodeClick(this.data[0], node)
          }
        })
      })
    },
    treeData2Arr(data, key) {
      if (!data) return
      let list = []
      let oriArr = []
      if (Array.isArray(data)) {
        oriArr = data
      } else {
        oriArr.push(data)
      }
      const traverse = arr => {
        arr.forEach(o => {
          list.push(o)
          if (o[key]) {
            traverse(o[key])
          }
        })
      }
      traverse(oriArr)
      return list
    },
    strCode(str) {
      //获取字符串的字节数
      var count = 0 //初始化字节数递加变量并获取字符串参数的字符个数
      if (str) {
        //如果存在字符串，则执行
        let len = str.length
        for (var i = 0; i < len; i++) {
          //遍历字符串，枚举每个字符
          if (str.charCodeAt(i) > 255) {
            //字符编码大于255，说明是双字节字符(即是中文)
            count += 2 //则累加2个
          } else {
            count++ //否则递加一次
          }
        }
        console.log(count)
        return count //返回字节数
      } else {
        console.log(0)
        return 0 //如果参数为空，则返回0个
      }
    },
    // 点击Add New 事件
    /*
     * currentData Object 当前选择节点
     * addChildren Boolen false:新增同级节点 true:新增子节点
     */
    append(currentData, num) {
      console.log(currentData)
      console.log(this.currentData)
      // num: 1添加部门 2添加子部门 3 编辑
      // level 有问题
      this.departmentForm.mode = num
      if (num === 1) {
      } else if (num === 2) {
        // 添加子节点
        console.log('子节点')
        this.departmentForm.level = currentData.level - 1
        this.departmentForm.name = ''
        this.departmentForm.id = ''
        this.departmentForm.parentName = currentData.name
        this.departmentForm.parentid = currentData.id
      } else {
        // 编辑
        this.departmentForm.name = currentData.name
        this.departmentForm.id = currentData.id
        this.departmentForm.parentid = currentData.parentid
        this.departmentForm.parentName = currentData.parentName
      }
      console.log(this.departmentForm)
      this.dialogDepartmentVisible = true

      // this.showList = true
    },
    closeDialog() {
      this.dialogDepartmentVisible = false
      this.$refs['departmentForm'].resetFields()
    },
    closeDepartmentDialog() {
      this.dialogEditUserDepartmentVisible = false
    },
    closeImportDialog() {
      this.$refs['form'].resetFields()
      this.dialogImportVisible = false
    },
    closeUploadListDialog() {
      this.dialogUploadListVisible = false
    },
    dialogDepartmentSubmit(form) {
      console.log(this[form])
      this.$refs[form].validate(async vaild => {
        console.log('进来了')
        if (vaild) {
          // return true
          this.loadingStatus = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          if (this[form].mode == 3) {
            // 修改部门名称
            let params = {
              id: this[form].id,
              name: this[form].name,
              parentid: this[form].parentid
            }
            try {
              const result = await updateDepartment(params)
              this.loadingStatus.close()
              if (result.errcode == 0) {
                this.$notify({
                  message: '修改部门成功',
                  type: 'success',
                  duration: 1000
                })
                this.dialogDepartmentVisible = false
                this.getData()
              } else {
                this.$notify({
                  message: result.errmsg,
                  type: 'error',
                  duration: 3000
                })
              }
            } catch (error) {
              this.$notify({
                message: '修改部门失败',
                type: 'success',
                duration: 3000
              })
              this.loadingStatus.close()
              return
            }
          } else {
            // 新增部门
            let params = {
              name: this[form].name,
              parentid: this[form].parentid
            }
            try {
              const result = await addDepartment(params)
              this.loadingStatus.close()
              if (result.errcode == 0) {
                this.$notify({
                  message: '新增部门成功',
                  type: 'success',
                  duration: 1000
                })
                this.dialogDepartmentVisible = false
                this.getData()
              } else {
                this.$notify({
                  message: result.errmsg,
                  type: 'error',
                  duration: 3000
                })
              }
              console.log('result', result)
            } catch (error) {
              this.$notify({
                message: '操作失败',
                type: 'error',
                duration: 3000
              })
              this.loadingStatus.close()
              return
            }
          }
        } else {
          return false
        }
      })
      // this.dialogDepartmentVisible = false
    },
    copy() {},
    // 删除某一个分类
    remove(data) {
      this.$confirm(`确定要删除部门嘛？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteDepartment(data.id).then(res => {
            if (res.errcode == 0) {
              this.getData('del')
            } else {
              this.$notify({
                message: res.errmsg,
                type: 'error',
                duration: 3000
              })
            }
          })
        })
        .catch(() => {})
    },
    confirmSaveUser(form) {
      this.$refs[form].validate(vaild => {
        if (vaild) {
          if (this.isAddUser) {
            let param = {
              user_id: this.detailForm.user_id, //帐号=邮箱
              direct_seller_id: this.detailForm.direct_seller_id, //12位编号
              role: this.detailForm.role, //角色 普通员工：staff   有跟进关系：sfd  管理员：admin
              external_department: this.detailForm.external_department
            }
            // param.department = []
            // param.department.push(this.detailForm.department)
            addEmployee(param).then(resp => {
              if (resp.errcode == 0) {
                this.$notify({
                  message: '新增员工成功',
                  type: 'success',
                  duration: 1000
                })
                this.backUserList()
              } else {
                this.$notify({
                  message: resp.errmsg,
                  type: 'error',
                  duration: 3000
                })
              }
            })
          } else {
            // let param = {
            //   user_id: this.detailForm.user_id, //帐号=邮箱
            //   name: this.detailForm.name, //姓名
            //   alias: this.detailForm.alias, //别名
            //   mobile: this.detailForm.mobile, //电话
            //   position: this.detailForm.position, //职务
            //   gender: this.detailForm.gender, //性别 0：女  1：男
            //   telephone: this.detailForm.telephone, //座机,
            //   direct_seller_id: this.detailForm.direct_seller_id, //12位编号
            //   employee_NO: this.detailForm.employee_NO, //工号
            //   role: this.detailForm.role //角色 普通员工：staff   有跟进关系：sfd  管理员：admin
            // }
            // param.department = []
            // param.department.push(this.detailForm.department)
            this.loading = true
            let param = {
              user_id: this.detailForm.user_id, //帐号=邮箱
              direct_seller_id: this.detailForm.direct_seller_id, //12位编号
              role: this.detailForm.role, //角色 普通员工：staff   有跟进关系：sfd  管理员：admin
              external_department: this.detailForm.external_department
            }
            updateEmployee(param).then(resp => {
              if (resp.errcode == 0) {
                this.$notify({
                  message: '保存员工成功',
                  type: 'success',
                  duration: 1000
                })
                this.loading = false
                this.backUserList()
              } else {
                this.loading = false
                this.$notify({
                  message: resp.errmsg,
                  type: 'error',
                  duration: 3000
                })
              }
            })
          }
        } else {
          return false
        }
      })
    },
    handleCurrentChange(n) {
      this.filters.pageNo = n
      this.getEmployeeList()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.filters.pageSize = val
      this.filters.pageNo = 1
      this.getEmployeeList()
    },
    handleSizeChangeByUploadList(val) {
      this.uploadListPageSize = val
      this.getImportUploadList()
    },
    handleCurrentChangeByUploadList(n) {
      this.uploadListPageNo = n
      this.getImportUploadList()
    },
    async showImportUploadList() {
      this.uploadListPageNo = 1
      this.createdBy = ''
      let list = await this.getImportUploadList()
      this.dialogUploadListVisible = true
    },
    getImportUploadList() {
      let req = {}
      req.name = this.createdBy
      req.pageSize = this.uploadListPageSize
      req.pageNo = this.uploadListPageNo
      req.status = this.uploadListStatus
      getUploadList(req).then(resp => {
        this.importUploadList = resp.data
        this.uploadListPagTotal = resp.total
      })
    },
    findUserById(id) {
      const item = this.tableData.data.find(item => item.user_id == id)
      return item
    },
    removeUser() {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        let userlist = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          let item = this.multipleSelection[i]
          let user = this.findUserById(item)
          if (user.status === 1) {
            userlist.push(user.name)
          }
        }
        if (userlist && userlist.length > 0) {
          this.$notify({
            message: `员工${userlist.join(',')}已加入企业，无法批量删除`,
            type: 'warning',
            duration: 3000
          })
        } else {
          this.$confirm(`确定要删除所选中的员工嘛?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              console.log(this.multipleSelection)
              let req = {}
              req.useridlist = this.multipleSelection
              deleteEmployee(req).then(res => {
                if (res.errcode == 0) {
                  this.multipleSelection = []
                  this.$notify({
                    message: '删除员工成功',
                    type: 'success',
                    duration: 1000
                  })
                  this.backUserList()
                } else {
                  this.$notify({
                    message: res.errmsg,
                    type: 'error',
                    duration: 3000
                  })
                }
              })
            })
            .catch(() => {})
        }
      }
    },

    removeUserByDetail(user) {
      console.log(user)
      if (user.status == 1) {
        this.$notify({
          message: `员工已加入企业，无法删除`,
          type: 'warning',
          duration: 3000
        })
      } else {
        this.$confirm(`确定要删除该员工嘛?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let req = {}
            req.useridlist = []
            req.useridlist.push(user.user_id)
            deleteEmployee(req).then(res => {
              if (res.errcode == 0) {
                this.$notify({
                  message: '删除员工成功',
                  type: 'success',
                  duration: 1000
                })
                this.backUserList()
              } else {
                this.$notify({
                  message: res.errmsg,
                  type: 'error',
                  duration: 3000
                })
              }
            })
          })
          .catch(() => {})
      }
    },
    addUser(isAdd, user_id) {
      this.isAddUser = isAdd
      if (isAdd) {
        this.detailForm = {}
        this.detailForm.department = this.currentData.id
        // this.detailForm.gender = 1
        this.showList = false
        this.showDetail = false
        this.showEdit = true
      } else {
        let req = { userId: user_id }
        getEmployeeById(req).then(resp => {
          this.detailForm = resp.data
          this.detailForm.department = resp.data.department[0]
          this.showList = false
          this.showDetail = false
          this.showEdit = true
        })
      }
    },
    selectUser(user_id) {
      let req = { userId: user_id }
      getEmployeeById(req).then(resp => {
        this.detailForm = resp.data
        this.detailForm.department = resp.data.department[0]
        this.showList = false
        this.showEdit = false
        this.showDetail = true
      })
    },
    backUserList() {
      this.getEmployeeList()
      this.showList = true
      this.showEdit = false
      this.showDetail = false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val.map(item => item.user_id)
    },
    sortBy(props) {
      return (a, b) => {
        return a[props] - b[props]
      }
    },
    toTree(data) {
      let date = new Date().getTime()
      console.log('data', data)
      data.forEach(ele => {
        let pid = ele.parentid
        if (!ele.children) {
          //很多都有bug的，少了这个校验
          if (!ele.name) {
            ele.isEmpty = true
          }
          ele.children = []
        }
        if (pid == 0) {
          //是根元素的hua ,不做任何操作,如果是正常的for-i循环,可以直接continue.
          ele.level = 1
        } else {
          //如果ele是子元素的话 ,把ele扔到他的父亲的child数组中.
          data.forEach(d => {
            if (d.id == pid) {
              let childArray = d.children
              if (!childArray) {
                childArray = []
              }
              ele.parentName = d.name
              // ele.categoryType = d.categoryType

              if (!ele.name) {
                ele.isEmpty = true
              }
              ele.level = d.level + 1
              childArray.push(ele)
              d.children = childArray.sort(this.sortBy('order'))
            }
          })
        }
      })
      var result = []
      for (let i = 0; i < data.length; i++) {
        var ele = data[i]
        if (ele.children && ele.children.length == 0) {
          delete ele.children
        }
        if (ele.parentid == 0) {
          result.push(ele)
        }
      }
      console.log(new Date().getTime() - date)
      return result
    },
    exportUser() {
      let req = {}
      req.departmentId = this.currentData.id
      exportEmployees(req).then(resp => {
        let blob = new Blob([resp], { type: resp.type })
        let downloadElement = document.createElement('a')
        let href = window.URL.createObjectURL(blob) //创建下载的链接
        downloadElement.href = href
        downloadElement.download =
          `staff_` + formatDate(new Date(), 'YYYYMMDDHHmmss') + '.csv' //下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() //点击下载
        document.body.removeChild(downloadElement) //下载完成移除元素
        window.URL.revokeObjectURL(href) //释放blob对象
      })
    },
    showChangeUserDepartment() {
      this.userDepartment = this.currentData.id
      this.dialogEditUserDepartmentVisible = true
    },
    saveChangeUserDepartment() {
      let req = {}
      req.department = this.userDepartment
      req.userids = this.multipleSelection
      changeUserDepartment(req).then(resp => {
        if (resp.errcode == 0) {
          this.$notify({
            message: '更改部门成功',
            type: 'success',
            duration: 1000
          })
          this.dialogEditUserDepartmentVisible = false
          this.multipleSelection = []
          this.backUserList()
        } else {
          this.$notify({
            message: resp.errmsg,
            type: 'error',
            duration: 3000
          })
        }
      })
    },
    handInviteUser() {
      this.$confirm(`确定发送邀请通知嘛？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let req = {}
          req.user = this.multipleSelection
          inviteUser(req).then(resp => {
            if (resp.errcode == 0) {
              this.$notify({
                message: '邀请员工成功',
                type: 'success',
                duration: 1000
              })
              this.multipleSelection = []
              this.backUserList()
            } else {
              this.$notify({
                message: resp.errmsg,
                type: 'error',
                duration: 3000
              })
            }
          })
        })
        .catch(() => {})
    },
    showImportUser() {
      this.form.user_list_url = null
      this.excelList = []
      this.dialogImportVisible = true
    },
    openDownload(url) {
      let downloadUrl = url
        ? url
        : 'https://dev-community-s3.xxxxxxx.com.cn/DEV/MyBizxxxxxxx_Content_Cms/entwechat/20220608153320_846.xlsx'
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
            objectKey: 'entwechat'
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
    importUserList(form) {
      this.$refs[form].validate(vaild => {
        if (vaild) {
          let req = {}
          req.filePath = this.form.user_list_url
          this.loading = true
          importEmployees(req).then(resp => {
            if (resp.errcode == 0) {
              this.$notify({
                message: '导入操作成功，请耐心等待导入结果',
                type: 'success',
                duration: 1000
              })
              this.dialogImportVisible = false
              this.backUserList()
              this.loading = false
            } else {
              this.loading = false
              this.$notify({
                message: resp.errmsg,
                type: 'error',
                duration: 3000
              })
            }
          })
        } else {
          return false
        }
      })
    },

    cascaderClickByEdit(nodeData) {
      this.detailForm.department = nodeData.id
      this.$refs.cascaderEdit.checkedValue = nodeData.id
      this.$refs.cascaderEdit.computePresentText()
      this.$refs.cascaderEdit.toggleDropDownVisible(false)
    },

    cascaderClickByBatch(nodeData) {
      this.userDepartment = nodeData.id
      this.$refs.cascaderBatch.checkedValue = nodeData.id
      this.$refs.cascaderBatch.computePresentText()
      this.$refs.cascaderBatch.toggleDropDownVisible(false)
    },
    cutString(str, len) {
      //length属性读出来的汉字长度为1
      if (str.length * 2 <= len) {
        return str
      }
      var strlen = 0
      var s = ''
      for (var i = 0; i < str.length; i++) {
        s = s + str.charAt(i)
        if (str.charCodeAt(i) > 128) {
          strlen = strlen + 2
          if (strlen >= len) {
            return s.substring(0, s.length - 1) + '...'
          }
        } else {
          strlen = strlen + 1
          if (strlen >= len) {
            return s.substring(0, s.length - 2) + '...'
          }
        }
      }
      return s
    }
  }
}
</script>

<style lang="less" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.custom-tree-container {
  .title {
    font-size: 20px;
    font-weight: bold;
    padding: 0 0 15px 0;
  }
  .handle-list {
    margin-bottom: 10px;
    /deep/ .el-button + .el-button {
      margin-left: 15px;
    }
  }
  .tree-node {
    height: 78vh;
    overflow: hidden;
    overflow-y: scroll;
    border: 1px solid #dcdfe6;
    padding: 5px;
    /deep/ .el-tree-node__content {
      height: 40px;
    }
  }

  /deep/.el-input {
    width: 177px;
  }
  .item-detail {
    // height: 78vh;
    overflow: hidden;
    overflow-y: scroll;
    padding-left: 10px;
    .top {
      font-size: 20px;
      padding-bottom: 15px;
      display: flex;
      justify-content: space-between;
      font-weight: bold;
    }
    .search {
      display: flex;
      place-content: center space-between;
      align-items: center;
      justify-content: flex-start;
    }
  }
  .sortable-chosen {
    background-color: #f0f7ff;
  }
  .sortable-drag {
    background-color: #fff;
  }
  /deep/ .editor-dialog {
    max-height: 80vh;
    overflow: hidden;
    overflow-y: scroll;
  }
  .form-style {
    border: 1px solid #dcdfe6;
    margin-bottom: 10px;
    padding: 10px;
  }
  .detailForm-iconUrl {
    margin-left: 10px;
    width: 340px !important;
  }
  .bg-img {
    width: 100%;
    /deep/ .el-upload-list {
      max-height: 102px;
      overflow: hidden;
    }
    /deep/ .el-form-item__content {
      width: calc(100% - 120px);
    }
  }
  .file-item {
    border-radius: 8px;
    border: 1px solid #ccc;
    padding: 10px;
    position: relative;
    overflow: hidden;
    margin-top: 10px;
    &:hover {
      .del-item {
        display: block;
      }
      .item-status-label {
        background-color: rgba(0, 0, 0, 0.5);
      }
      .el-icon-upload-success {
        display: none;
      }
    }
    .del-item {
      display: none;
      transform: rotate(-45deg);
      color: #fff;
    }
    .img-wrap {
      display: flex;
      align-items: center;
      flex-flow: row;
      .item-img {
        vertical-align: middle;
        border-radius: 8px;
        border: 1px solid #ccc;
        width: 80px;
        height: 80px;
        margin-right: 20px;
        flex-grow: 0;
      }
      .img-label {
        flex: 1;
      }
    }
  }
  .item-status-label {
    position: absolute;
    right: -15px;
    top: -6px;
    width: 40px;
    height: 24px;
    background: #13ce66;
    text-align: center;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
  }
  .el-icon-upload-success {
    font-size: 12px;
    margin-top: 11px;
    transform: rotate(-45deg);
    color: #fff;
  }
  .del-item {
    font-size: 12px;
    margin-top: 11px;
    cursor: pointer;
  }
  .demo-input-suffix {
    display: flex;
    align-items: center;
    .el-input {
      flex: 1;
    }
  }
  .dialog-footer {
    display: flex;
    margin-top: 20px;
    justify-content: right;
  }
}
.page-box {
  margin: 30px 0;
  text-align: right;
}
</style>
