<template>
  <div class="custom-tree-container">
    <div class="handle-list">
      <el-button
        type="primary"
        size="mini"
        :disabled="!currentData.id"
        @click="append(currentData)"
      >
        添加同级节点
      </el-button>
      <el-button
        type="primary"
        size="mini"
        :disabled="!currentData.id"
        @click="append(currentData, true)"
      >
        添加子节点
      </el-button>
      <el-button
        type="danger"
        size="mini"
        @click="remove(currentData)"
        :disabled="!currentData.id"
      >
        删除
      </el-button>
      <!-- <el-button
        type="success"
        size="mini"
        @click="copy"
        :disabled="!currentData.id"
      >
        复制
      </el-button> -->
    </div>
    <el-row>
      <el-col :span="10" class="block tree-node">
        <el-tree
          :data="data"
          node-key="id"
          ref="treeNode"
          draggable
          :default-expanded-keys="expandedKeys"
          :default-expand-all="true"
          :allow-drag="allowDrag"
          :allow-drop="allowDrop"
          :expand-on-click-node="false"
          :highlight-current="true"
          :auto-expand-parent="false"
          :props="defaultProps"
          @node-drop="nodeDrop"
          @node-drag-start="nodeDragStart"
          @node-click="nodeClick"
          @node-expand="nodeExpand"
          @node-collapse="nodeCollapse"
        >
          <span class="custom-tree-node" slot-scope="{ node }">
            <span>{{ node.label }}</span>
            <!-- <span>
              <span style="margin-right:10px;"> id{{ data.id }} </span>
              <span> 层级{{ data.level }} </span>
            </span> -->
          </span>
        </el-tree>
      </el-col>
      <el-col :span="14" v-if="showDetail" class="item-detail">
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
            <el-form-item label="ID">{{ detailForm.id }}</el-form-item>
          </div>
          <div v-if="detailForm.parentName">
            <el-form-item label="父级主题">
              {{ detailForm.parentName }}
            </el-form-item>
          </div>
          <div>
            <el-form-item label="主题名称" prop="categoryName">
              <el-input v-model.trim="detailForm.categoryName"></el-input>
            </el-form-item>
          </div>
          <el-form-item
            label="主题类型"
            v-if="detailForm.level === 1"
            prop="categoryType"
          >
            <el-select v-model.trim="detailForm.categoryType" clearable>
              <el-option label="素材" :value="1"></el-option>
              <el-option label="线上" :value="2"></el-option>
              <el-option label="线下" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <div>
            <el-form-item label="主题icon" prop="iconUrl" class="bg-img">
              <div>
                <el-button
                  size="mini"
                  type="primary"
                  @click="uploadDialog = true"
                  >上传</el-button
                >
                <el-input
                  v-model="detailForm.iconUrl"
                  class="detailForm-iconUrl"
                  size="small"
                ></el-input>
              </div>
              <div class="file-item" v-if="detailForm.iconUrl">
                <div class="img-wrap">
                  <el-image
                    class="item-img"
                    :src="detailForm.iconUrl"
                    fit="cover"
                  ></el-image>
                  <label class="whispace img-label">{{
                    detailForm.iconUrl
                  }}</label>
                </div>
                <label class="item-status-label">
                  <i class="el-icon-upload-success el-icon-check"></i>
                  <i class="el-icon-close del-item" @click="delItem"></i>
                </label>
              </div>
              <span>
                尺寸为160*160，大小不超过200kb
              </span>
            </el-form-item>
          </div>
          <el-form-item label=" ">
            <el-button
              size="small"
              @click="
                showDetail = false
                isSave = true
              "
            >
              Cancel
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="confirmAdd('detailForm')"
              :loading="loading"
            >
              Save
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <upload-and-select-in-resource
      :uploadDialog="uploadDialog"
      :fileSize="{ size: 200 }"
      @uploadFile="uploadFile"
      @selectResource="selectResource"
      @closeUploadDialog="uploadDialog = false"
    ></upload-and-select-in-resource>
  </div>
</template>

<script>
import { uploadToResource } from '@/api/index.js'
import storage from 'good-storage'
import {
  getCategories,
  createCategory,
  updateCategory,
  sortCategory,
  delCategoryById
} from '@/api/library/category.js'
import { deepCopy, deleteOneofArray, toTree, clones } from '@/utility/index.js'
import uploadAndSelectInResource from '@/components/selectInResources/uploadAndSelectInResource.vue'
const form = {
  categoryName: '',
  iconUrl: '',
  categoryType: null
}
export default {
  components: {
    uploadAndSelectInResource
  },
  data() {
    let validatorIconUrl = (rule, value, callback) => {
      if (this.detailForm.level === 3 && !this.detailForm.iconUrl) {
        callback(new Error('请上传主题icon'))
      }
      callback()
    }
    return {
      data: [],
      imageList: [],
      currentNode: {},
      currentData: {},
      defaultProps: {
        children: 'children',
        label: 'categoryName'
      },
      expandedKeys: [],
      loading: false,
      showDetail: false,
      form: {},
      detailForm: {},
      formRules: {
        categoryName: [
          { required: true, message: '请输入主题名称', trigger: 'blur' },
          {
            max: 10,
            message: '标题长度限制10个字以内',
            trigger: 'blur'
          }
        ],
        iconUrl: [{ validator: validatorIconUrl, trigger: 'blur' }]
      },
      uploadDialog: false
    }
  },
  created() {
    this.getData()
  },
  methods: {
    nodeClick(data, node) {
      console.log(data)
      console.log(node)
      // data.level = node.level
      data.iconUrl = data.iconUrl ? data.iconUrl : ''
      if (data.iconUrl) {
        this.imageList = [
          {
            name: data.iconUrl,
            url: data.iconUrl
          }
        ]
      } else {
        this.imageList = []
      }
      this.detailForm = deepCopy(data)
      this.currentData = deepCopy(data)
      this.currentNode = deepCopy(node)
      this.showDetail = true
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
      getCategories().then(res => {
        this.data = toTree(res.categories)
        console.log(this.data)
        this.$nextTick(() => {
          let node = null,
            data = null

          switch (type) {
            case 'del':
              this.$refs.treeNode.setCurrentKey(
                this.currentData.parentCategoryId
              )
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
    uploadFile(data) {
      this.uploadDialog = false
      this.detailForm.iconUrl = data.url
      this.uploadImageToResource(data.name, data.url, data.fileInfo)
    },
    selectResource(data) {
      this.uploadDialog = false
      this.detailForm.iconUrl = data.url
    },
    delItem() {
      this.detailForm.iconUrl = ''
    },
    uploadImageToResource(name, url, property) {
      let moduleId
      let menus = storage.get('menus')
      moduleId = this.treeData2Arr(menus, 'subMenus').filter(
        o => o.path === '/library/category'
      )[0].id
      let data = {
        name: name,
        moduleId: moduleId,
        url: url,
        property: property,
        resourceType: 'Image',
        client: 'BackEnd'
      }
      uploadToResource(data)
    },
    // 点击Add New 事件
    /*
     * currentData Object 当前选择节点
     * addChildren Boolen false:新增同级节点 true:新增子节点
     */
    append(currentData, addChildren) {
      this.showDetail = true
      this.detailForm = clones(form)
      this.detailForm.categoryType = currentData.categoryType
      if (!addChildren) {
        if (currentData.level === 1) {
          this.detailForm.level = 1
          this.detailForm.parentCategoryId = 0
          this.detailForm.categoryType = null
        } else {
          this.detailForm.level = currentData.level
          this.detailForm.parentName = currentData.parentName
          this.detailForm.parentCategoryId = currentData.parentCategoryId
        }
      } else {
        this.detailForm.level = currentData.level - 1
        this.detailForm.parentName = currentData.categoryName
        this.detailForm.parentCategoryId = currentData.id
      }
      this.detailForm.id = null
      this.imageList = []
    },
    copy() {},
    // 删除某一个分类
    remove(data) {
      this.$confirm(`Would you like to delete the category?`, 'Tips', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          delCategoryById(data.id).then(res => {
            if (res.result) {
              this.getData('del')
            } else {
              this.$notify({
                message: res.message,
                type: 'error',
                duration: 3000
              })
            }
          })
        })
        .catch(() => {})
    },
    confirmAdd(form) {
      this.$refs[form].validate(vaild => {
        if (vaild) {
          this.loading = true
          let params = {
            categoryName: this[form].categoryName,
            iconUrl: this[form].iconUrl,
            parentCategoryId: this[form].parentCategoryId,
            categoryType: this[form].categoryType
          }
          if (this[form].id) {
            // 修改分类
            updateCategory(this[form].id, params)
              .then(() => {
                this.loading = false
                this.getData('edit')
              })
              .catch(() => {})
          } else {
            // 添加分类
            createCategory(params)
              .then(() => {
                this.loading = false
                this.getData('add')
              })
              .catch(() => {})
          }
        } else {
          return false
        }
      })
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
    height: 78vh;
    overflow: hidden;
    overflow-y: scroll;
    padding-left: 10px;
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
}
</style>
