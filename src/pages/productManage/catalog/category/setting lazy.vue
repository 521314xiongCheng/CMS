<template>
  <div class="custom-tree-container">
    <div class="handle-list">
      <el-button type="primary" size="mini" @click="showPublish">
        Publish
      </el-button>
      <el-button type="primary" size="mini" @click="append(currentData)">
        Add
      </el-button>
      <el-button
        type="danger"
        size="mini"
        @click="remove(currentData)"
        :disabled="!(currentData.level && currentData.level !== 1)"
      >
        Delete
      </el-button>
      <el-button
        type="success"
        size="mini"
        @click="copy"
        :disabled="!(currentData.level && currentData.level !== 1)"
      >
        Copy
      </el-button>
    </div>
    <el-row>
      <el-col :span="10" class="block tree-node">
        <el-tree
          :data="data"
          node-key="id"
          ref="treeNode"
          draggable
          lazy
          :load="loadNode"
          :default-expanded-keys="expandedKeys"
          :default-expand-all="false"
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
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <span v-if="node.level !== 1" style="margin-right:10px;">
                {{ data.id }}
              </span>
              <!-- <span v-if="node.level !== 1">
                {{ data.end_date }}
              </span> -->
            </span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="14" v-if="showDetail" class="item-detail">
        <el-form
          :model="detailForm"
          :rules="formRules"
          inline
          ref="detailForm"
          size="mini"
          class="form-style"
          label-width="120px"
        >
          <div v-if="detailForm.id">
            <el-form-item label="目录ID">
              {{ detailForm.id }}
            </el-form-item>
          </div>
          <div>
            <el-form-item label="目录名称" prop="name">
              <el-input v-model.trim="detailForm.name"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="英文名称" prop="name_en">
              <el-input v-model.trim="detailForm.name_en"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="显示模板" prop="template_id">
              <el-select v-model.trim="detailForm.template_id" clearable>
                <el-option
                  v-for="item in templates"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="目录标签" prop="tags">
              <el-select
                v-model.trim="detailForm.tags"
                multiple
                collapse-tags
                clearable
              >
                <el-option
                  v-for="item in tags"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="目录描述" prop="desc">
              <el-input v-model.trim="detailForm.desc"></el-input>
            </el-form-item>
          </div>
          <div v-if="detailForm.level === 2">
            <el-form-item label="目录类型" prop="category_type">
              <el-select v-model.trim="detailForm.category_type" clearable>
                <el-option
                  v-for="item in categorTypes"
                  :key="item.name"
                  :label="item.name"
                  :value="item.english_name"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="开始时间" prop="start_date">
              <el-date-picker
                v-model="detailForm.start_date"
                type="datetime"
                value-format="timestamp"
                placeholder="选择开始时间"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="结束时间" prop="end_date">
              <el-date-picker
                v-model="detailForm.end_date"
                type="datetime"
                value-format="timestamp"
                placeholder="选择结束时间"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <el-form-item label="目录图片" class="bg-img">
            <el-input
              v-model="detailForm.imageUrl"
              class="input-img-url"
              size="small"
            ></el-input>
            <upload
              @change="
                (file, fileList) => {
                  fileChange(file, fileList, 'imageUrl', 'imageList')
                }
              "
              accept="image/png, image/jpeg"
              :fileList="imageList"
            ></upload>
          </el-form-item>
          <div>
            <el-form-item label="目录详情图片" class="bg-img">
              <upload
                @change="
                  (file, fileList) => {
                    fileChange(file, fileList, 'detail_images', 'detail_images')
                  }
                "
                accept="image/png, image/jpeg"
                :multiple="true"
                :showFileList="false"
              ></upload>
              <div class="draggable-div">
                <draggable
                  v-model="detailForm.detail_images"
                  @change="draggableChange"
                >
                  <div
                    v-for="item in detailForm.detail_images"
                    :key="item.id"
                    class="file-list"
                  >
                    <div class="file-item">
                      <div class="img-wrap" v-if="item.image_url">
                        <img
                          class="item-img preview-img"
                          :src="item.image_url"
                          alt=""
                        />
                        <div class="box-mask">
                          <i
                            class="el-icon-zoom-in"
                            @click="preview(item, true)"
                          ></i>
                          <i
                            class="el-icon-delete"
                            @click="del(item, index, true)"
                          ></i>
                        </div>
                      </div>
                      <upload
                        v-else
                        class="item-upload"
                        @change="
                          (file, fileList) => {
                            fileChange(
                              file,
                              fileList,
                              'image_url',
                              'detail_images',
                              item
                            )
                          }
                        "
                        accept="image/png, image/jpeg"
                        :showFileList="false"
                        btnName="上传图片"
                      ></upload>
                    </div>
                    <div class="file-item">
                      <div v-if="item.video_url" class="img-wrap">
                        <img
                          class="item-img video_cover_url"
                          src="../../../../images/placeholder.png"
                          alt=""
                        />
                        <div class="box-mask">
                          <i
                            class="el-icon-zoom-in"
                            @click="preview(item, false)"
                          ></i>
                          <i
                            class="el-icon-delete"
                            @click="del(item, false)"
                          ></i>
                        </div>
                      </div>
                      <upload
                        v-else
                        class="item-upload"
                        @change="
                          (file, fileList) => {
                            fileChange(
                              file,
                              fileList,
                              'video_url',
                              'detail_images',
                              item
                            )
                          }
                        "
                        accept="video/*"
                        :showFileList="false"
                        btnName="添加视频"
                      ></upload>
                    </div>
                    <i
                      class="el-icon-delete del-item"
                      @click="delItem(item, detailForm.detail_images)"
                    ></i>
                  </div>
                </draggable>
              </div>
            </el-form-item>
          </div>
          <div class="consultant-level">
            <el-form-item
              label="目录权限"
              prop="min_levelcode"
              :error="levelStartError"
            >
              <el-input-number
                size="mini"
                v-model="detailForm.min_levelcode"
                controls-position="right"
                :min="null"
                :controls="false"
                :max="100"
              ></el-input-number>
            </el-form-item>
            <span class="level-name">{{ levelName }}</span>
            <el-form-item
              label=" "
              label-width="0px"
              prop="max_levelcode"
              :error="levelEndError"
            >
              <el-input-number
                size="mini"
                v-model="detailForm.max_levelcode"
                controls-position="right"
                :min="null"
                :controls="false"
                :max="100"
              ></el-input-number>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="slogan" prop="slogan">
              <el-input v-model="detailForm.slogan"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="跳转链接名称" prop="link_text">
              <el-input v-model="detailForm.link_text"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="跳转链接" prop="link_url">
              <el-input v-model="detailForm.link_url"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="分享链接" prop="share_url">
              <el-input v-model="detailForm.share_url"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="分享话术" prop="share_text">
              <el-input
                v-model="detailForm.share_text"
                style="width:350px"
                type="textarea"
                :rows="2"
              ></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="分享图片" prop="share_image">
              <el-input
                v-model="detailForm.share_image"
                class="input-img-url"
                style="width:100%"
                size="small"
              ></el-input>
              <upload
                @change="
                  (file, fileList) => {
                    fileChange(file, fileList, 'share_image', 'share_image')
                  }
                "
                accept="image/png, image/jpeg"
                :fileList="share_image"
              ></upload>
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
        <div>
          <el-form
            label-width="120px"
            size="mini"
            class="form-style"
            style="margin-bottom:0;"
          >
            <el-form-item label="关联产品列表">
              <div style="display:flex;">
                <el-input v-model="code" style="margin-right:10px;"></el-input>
                <el-button @click="addProduct" type="primary">Add</el-button>
                <el-button type="danger" @click="deleteAllProduct">
                  Deselect All
                </el-button>
              </div>
            </el-form-item>
            <el-form-item label="" label-width="0">
              <draggable v-model="products" @change="change">
                <div v-for="row in products" :key="row.id" class="product-item">
                  <span class="handle">
                    <el-button type="text" @click="delProduct(row)">
                      Delete
                    </el-button>
                  </span>
                  <span class="code">{{ row.sku }}</span>
                  <el-tooltip effect="dark" :content="row.name" placement="top">
                    <span class="name whispace">{{ row.name }}</span>
                  </el-tooltip>
                </div>
              </draggable>
              <div v-if="!products.length" class="no-products">暂无数据</div>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="Please select the environments"
      :visible.sync="publishPopover"
      width="350px"
    >
      <el-checkbox-group v-model="env">
        <div>
          <el-checkbox v-for="e in envs" :label="e" :key="e">{{
            e
          }}</el-checkbox>
        </div>
      </el-checkbox-group>
      <el-button
        type="primary"
        :disabled="!env.length"
        size="mini"
        style="margin-top:10px;"
        @click="publish"
      >
        Publish
      </el-button>
    </el-dialog>
    <el-dialog :visible.sync="previewDialog" @closed="previewUrl = ''">
      <img width="100%" v-if="isImage" :src="previewUrl" alt="" />
      <video
        v-else
        class="item-video"
        type="video/mp4"
        :muted="false"
        language="zh-CN"
        aspectRatio="16:9"
        playsinline
        preload="load"
        autoplay
        webkit-playsinline="webkit-playsinline"
        x-webkit-airplay="allow"
        controls
        width="80%"
        :src="previewUrl"
      ></video>
    </el-dialog>
  </div>
</template>

<script>
import Upload from '@/components/upload'
import upload from '@/mixins/upload.js'
import dialogForm from '@/mixins/dialogForm.js'
import storage from 'good-storage'
import {
  getCategories,
  getCategorysById,
  getCategoryDetailById,
  createCategory,
  updateCategory,
  delCategoryById,
  sortCategory,
  copyCategory,
  categoryProducts,
  deleteProduct,
  delAllProducts,
  addProducts,
  sortProducts
} from '@/api/product/catalog.js'
import { getTemplates } from '@/api/product/template.js'
import { getAttachments } from '@/api/product/tags.js'
import { getProducts } from '@/api/product/products.js'
import { uploadToResource } from '@/api/index.js'
import { clones, deleteOneofArray, checkImageSize } from '@/utility/index.js'
import Clickoutside from 'element-ui/src/utils/clickoutside'
import draggable from 'vuedraggable'
const form = {
  catalog_id: null,
  name: '',
  name_en: '',
  desc: '',
  category_type: '',
  imageUrl: '',
  detail_images: [],
  min_levelcode: null,
  max_levelcode: null,
  start_date: null,
  end_date: null,
  template_id: null,
  slogan: '',
  link_text: '',
  link_url: '',
  share_url: '',
  share_text: '',
  share_image: '',
  tags: []
}
export default {
  components: {
    Upload,
    draggable
  },
  directives: {
    Clickoutside
  },
  mixins: [dialogForm, upload],
  data() {
    return {
      publishPopover: false,
      env: [],
      envs: ['Qa', 'Uat', 'Prod'],
      data: [],
      currentNode: {},
      currentData: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      levelName: '<=等级<=',
      expandedKeys: [],
      loading: false,
      imageList: [],
      detail_images: [],
      share_image: [],
      showDetail: false,
      form: {},
      detailForm: {
        catalog_id: null,
        name: '',
        name_en: '',
        desc: '',
        category_type: '',
        imageUrl: '',
        detail_images: [],
        min_levelcode: null,
        max_levelcode: null,
        start_date: null,
        end_date: null,
        template_id: null,
        slogan: '',
        link_text: '',
        link_url: '',
        share_url: '',
        share_text: '',
        share_image: '',
        tags: []
      },
      catalogId: null,
      products: [],
      beforeModify: {},
      formRules: {
        name: [{ required: true, message: '请输入目录名称', trigger: 'blur' }]
      },
      levelStartError: '',
      levelEndError: '',
      tags: [],
      categorTypes: [
        {
          name: '在线目录',
          english_name: 'online_category'
        },
        {
          name: '首页目录',
          english_name: 'main_page_category'
        },
        {
          name: '推荐目录',
          english_name: 'recommend_category'
        }
      ],
      templates: [],
      code: '',
      isSave: false,
      previewDialog: false,
      isImage: true,
      previewUrl: '',
      isCurrent: false,
      isDel: false
    }
  },
  created() {
    this.getTemplates()
    this.getProductLabelList()
    this.catalogId = this.$route.query.id
    getCategories().then(res => {
      this.data = res.results.list.map(o => {
        o.children = []
        return {
          name: o.name,
          original_id: o.id,
          id: `${o.id}_1`,
          children: o.children
        }
      })
      this.$nextTick(() => {
        this.$refs.treeNode.setCurrentKey(`${this.$route.query.id}_1`)
        this.expandedKeys = [`${this.$route.query.id}_1`]
      })
    })
    this.beforeModify = clones(this.detailForm)
  },
  beforeRouteLeave(to, from, next) {
    next()
  },
  methods: {
    loadNode(node, resolve) {
      if (node.data.original_id) {
        this.catalogId = node.data.original_id
      }
      if (node.level === 1) {
        getCategorysById(this.catalogId).then(res => {
          resolve(
            res.results.list
              ? this.getOptions(res.results.list, this.catalogId)
              : []
          )
          this.$nextTick(() => {
            if (this.isCurrent) {
              this.$refs.treeNode.setCurrentKey(this.currentData.id)
            }
            if (this.isDel) {
              console.log('1-2', this.currentData)
              if (this.currentData.parent_id) {
                this.$refs.treeNode.setCurrentKey(this.currentData.parent_id)
              } else {
                this.$refs.treeNode.setCurrentKey(
                  `${this.currentData.catalogId}_1`
                )
              }
              let node = this.currentNode.parent
              let data = this.currentNode.parent.data
              this.nodeClick(data, node)
            }
            this.isCurrent = false
            this.isDel = false
          })
        })
      } else {
        resolve(node.data.children ? node.data.children : [])
      }
    },
    getTemplates() {
      getTemplates()
        .then(res => {
          let list = res.results.list
          this.templates = list
            .filter(o => o.type === 5)
            .map(o => ({ id: o.id, name: o.name, type: o.type }))
        })
        .catch(() => {
          this.$notify({
            message: '获取目录模板失败!',
            type: 'error',
            duration: 2000
          })
        })
    },
    getProductLabelList() {
      getAttachments({ page_size: 200 })
        .then(res => {
          let list = res.results.list
          this.tags = list
            .filter(o => o.type === 6)
            .map(o => ({ id: o.id, name: o.name, type: o.type }))
        })
        .catch(() => {
          this.$notify({
            message: '获取目录标签失败!',
            type: 'error',
            duration: 2000
          })
        })
    },
    showPublish() {
      this.publishPopover = true
    },
    publish() {
      this.publishPopover = false
    },
    // 节点点击事件
    nodeClick(data, node) {
      console.log(data)
      console.log(node)
      if (data.id === this.currentData.id) return
      data.level = node.level
      this.currentData = data
      this.currentNode = node
      if (node.level === 1) {
        this.catalogId = data.original_id
        this.showDetail = false
        return
      } else {
        this.catalogId = data.catalogId
        this.showDetail = true
      }
      getCategoryDetailById(data.id).then(res => {
        if (res.result.images) {
          res.result.imageUrl = res.result.images[0].image_url
          if (res.result.images[0].image_url) {
            this.imageList = [
              {
                name: res.result.images[0].image_url,
                url: res.result.images[0].image_url
              }
            ]
          } else {
            this.imageList = []
          }
        } else {
          this.imageList = []
        }
        if (!res.result.detail_images) {
          res.result.detail_images = []
        }
        if (!res.result.share_image) {
          this.share_image = []
        }
        res.result.start_date = res.result.start_date
          ? new Date(res.result.start_date).getTime()
          : null
        res.result.end_date = res.result.end_date
          ? new Date(res.result.end_date).getTime()
          : null
        res.result.tags = res.result.tags
          ? res.result.tags.map(o => {
              return Number(o)
            })
          : []
        if (res.result.children) {
          this.products = res.result.children
        }
        this.detailForm = clones(res.result)
        this.detailForm.level = node.level
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
    allowDrop(draggingNode, dropNode) {
      if (draggingNode.data.catalogId !== dropNode.data.catalogId) {
        return false
      }
      // if (dropNode.level === 1) {
      //   if (type === 'inner') {
      //     return true
      //   }
      //   return false
      // }
      return true
    },
    nodeDragStart() {
      // let checkModify = this.checkModify()
      // checkModify.then(res => {
      //   if (res) {
      //     //
      //   }
      // })
    },
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
          target_parent_id = enterNode.data.parent_id
          enterNode.parent.childNodes.forEach((o, i) => {
            if (o.data.id === currentNode.data.id) {
              sort = i + 1 //sort从1开始
            }
          })
          break
      }
      let data = {
        target_parent_id: target_parent_id,
        sort: sort
      }
      console.log(data)
      sortCategory(currentNode.data.id, data).then(() => {
        this.currentData = currentNode.data
        this.isCurrent = true
        this.getData()
      })
    },
    // 获取分类树数据
    getData() {
      getCategories().then(res => {
        this.data = res.results.list.map(o => {
          o.children = []
          // if (o.id == this.$route.query.id) {
          //   o.children = this.getOptions(list, o.id)
          // }
          return {
            name: o.name,
            original_id: o.id,
            id: `${o.id}_1`,
            children: o.children
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
    // 给子数据添加catalogId
    getOptions(list, catalogId) {
      const traverse = function(arr) {
        arr.forEach(o => {
          o.catalogId = catalogId
          if (o.children) {
            traverse(o.children)
          }
        })
      }
      traverse(list)
      return list
    },
    fileChange(file, fileList, formName, list, item) {
      if (file && !checkImageSize(file, 1024)) {
        this.$notify.error({
          title: 'Error',
          message: `Please upload JPG, PNG, JPEG format pictures, size limit of less than 1024KB`,
          duration: 3000
        })
        return
      }
      this.handleUploadFile(file, fileList, formName, list, url => {
        switch (formName) {
          case 'share_image':
          case 'imageUrl':
            this.detailForm[formName] = url
            break
          case 'detail_images':
            this.detailForm[formName].push({
              image_url: url,
              video_url: '',
              video_cover_url: ''
            })
            break
          case 'image_url':
          case 'video_url':
            if (item) {
              item[formName] = url
            }
            break
        }
      })
    },
    // 点击Add New 事件
    append() {
      // let checkModify = this.checkModify()
      // checkModify.then(res => {
      //   if (res) {
      //     }
      // })

      console.log(this.catalogId)
      this.showDetail = true
      this.detailForm = form
      this.detailForm.id = null
      this.imageList = []
      this.detail_images = []
      this.share_image = []
    },
    copy() {
      copyCategory(this.currentData.id, {}).then(() => {
        this.isCurrent = true
        this.getData()
      })
    },
    // 删除某一个分类
    remove(data) {
      this.$confirm(`Would you like to delete the category?`, 'Tips', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          delCategoryById(data.id).then(() => {
            this.isDel = true
            this.getData()
          })
        })
        .catch(() => {})
    },
    confirmAdd(form) {
      return new Promise((resolve, reject) => {
        this.$refs[form].validate(vaild => {
          if (vaild) {
            this.levelStartError = ''
            if (
              this[form].min_levelcode &&
              this[form].max_levelcode &&
              this[form].min_levelcode > this[form].max_levelcode
            ) {
              resolve(false)
              this.levelStartError = 'ConsultantLevel Error'
              return false
            }
            this.loading = true
            console.log(this.currentData)
            let params = {
              type: this[form].type,
              parent_id:
                this.currentData.level && this.currentData.level !== 1
                  ? this[form].id
                    ? this.currentData.parent_id
                    : this.currentData.id
                  : null,
              catalog_id: Number(this.catalogId),
              name: this[form].name,
              name_en: this[form].name_en,
              desc: this[form].desc,
              min_levelcode: this[form].min_levelcode,
              max_levelcode: this[form].max_levelcode,
              start_date: this[form].start_date,
              end_date: this[form].end_date,
              template_id: this[form].template_id,
              images: this[form].imageUrl
                ? [
                    {
                      image_url: this[form].imageUrl
                    }
                  ]
                : null,
              detail_images:
                this[form].detail_images && this[form].detail_images.length
                  ? this[form].detail_images
                  : null,
              slogan: this[form].slogan,
              link_text: this[form].link_text,
              link_url: this[form].link_url,
              share_url: this[form].share_url,
              share_text: this[form].share_text,
              share_image: this[form].share_image,
              tags:
                this[form].tags && this[form].tags.length
                  ? this[form].tags.join(',')
                  : null
            }
            if (!params.parent_id) {
              params.category_type = this[form].category_type
            }
            // if (params.img_url && params.img_url !== this.beforeModify.img_url) {
            //   this.uploadImageToResource(params.name, params.img_url)
            // }
            if (this[form].id) {
              // 修改分类
              updateCategory(this[form].id, params)
                .then(() => {
                  // this.bgImageUrlList = []
                  // this.showDetail = false
                  this.$notify({
                    message: 'Saved successfully!',
                    type: 'success',
                    duration: 2000
                  })
                  this.loading = false
                  this.isSave = true
                  // this.beforeModify = clones(this.form)
                  resolve(true)
                  this.isCurrent = true
                  this.getData()
                })
                .catch(() => {
                  reject(false)
                })
            } else {
              // 添加分类
              createCategory(params)
                .then(() => {
                  if (!this.currentData.children) {
                    this.$set(this.currentData, 'children', [])
                  }
                  this.$notify({
                    message: 'Added successfully!',
                    type: 'success',
                    duration: 2000
                  })
                  this.loading = false
                  this.isSave = true
                  // this.beforeModify = clones(this.form)
                  resolve(true)
                  this.isCurrent = true
                  this.getData()
                })
                .catch(() => {
                  reject(false)
                })
            }
          } else {
            resolve(false)
            return false
          }
        })
      })
    },
    uploadImageToResource(name, url) {
      let moduleId
      let menus = storage.get('menus')
      moduleId = this.treeData2Arr(menus, 'subMenus').filter(
        o => o.path === '/product/category'
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
    addProduct() {
      if (!this.code) return
      let data = {
        skus: this.code
      }
      // 根据用户输入code（多个以‘,’分隔）查询产品信息
      getProducts(data).then(res => {
        let { results, message } = res
        if (!results.list.length) {
          this.$notify({
            type: 'warning',
            message: message || '未查询到产品信息，请核对SKU后重试！',
            duration: 2000
          })
          return
        }
        let params = results.list.map((o, i) => ({
          sku: o.sku,
          name: o.name,
          sort: i + 1
        }))
        console.log(params)
        // 查询到的产品信息
        addProducts(this.currentData.id, params).then(res => {
          if (res) {
            this.code = null
            this.getProducts()
          }
        })
      })
    },
    // 删除分类下所有产品
    deleteAllProduct() {
      this.$confirm(`Would you like to delete the products?`, 'Tips', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          delAllProducts(this.currentData.id).then(res => {
            if (res) {
              this.getProducts()
            }
          })
        })
        .catch(() => {})
    },
    // 根据产品id删除分类下一个产品
    delProduct(row) {
      this.$confirm(`Would you like to delete the product?`, 'Tips', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          deleteProduct(this.currentData.id, row.id).then(res => {
            if (res) {
              this.getProducts()
            }
          })
        })
        .catch(() => {})
    },
    // 获取分类下产品列表
    getProducts() {
      categoryProducts(this.currentData.id).then(res => {
        this.products = res.result
      })
    },
    contrastModify(o, n) {
      if (!(n instanceof Object)) return
      for (let key in n) {
        if (Array.isArray(n[key]) && key !== 'children') {
          if (!o[key]) return true
          for (let i = 0; i < n[key].length; i++) {
            // 验证数组值是否一一对应，即顺序不能改变
            if (n[key][i] !== o[key][i]) {
              return true
            }
          }
        } else {
          if (key !== 'children' && n[key] !== o[key]) {
            return true
          }
        }
      }
      return false
    },
    checkModify() {
      return new Promise(resolve => {
        if (this.isSave) {
          resolve(true)
        } else {
          // form表单对比原始表单
          if (this.contrastModify(this.beforeModify, this.detailForm)) {
            this.$confirm(
              `Do you want to save the changes to the item?`,
              'Tips',
              {
                confirmButtonText: 'YES',
                cancelButtonText: 'NO',
                type: 'warning'
              }
            )
              .then(() => {
                let confirmAdd = this.confirmAdd('detailForm')
                confirmAdd
                  .then(res => {
                    resolve(res)
                  })
                  .catch(() => {
                    resolve(false)
                  })
              })
              .catch(() => {
                this.$refs.detailForm.clearValidate()
                this.detailForm = clones(this.beforeModify)
                resolve(true)
              })
          } else {
            resolve(true)
          }
        }
      })
    },
    change() {
      let data = this.products.map((o, i) => ({
        id: o.id,
        sort: i
      }))
      sortProducts(data).then(res => {
        console.log(res)
      })
    },
    draggableChange() {},
    preview(item, isImage) {
      this.isImage = isImage
      this.previewUrl = isImage ? item.image_url : item.video_url
      this.previewDialog = true
    },
    del(item, isImage) {
      console.log(item)
      if (isImage) {
        item.image_url = ''
      } else {
        item.video_url = ''
        item.video_cover_url = ''
      }
    },
    delItem(item, list) {
      list.splice(item, 1)
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
    // border: 1px solid #dcdfe6;
    height: 78vh;
    overflow: hidden;
    overflow-y: scroll;
    padding-left: 10px;
  }
  .consultant-level {
    display: flex;
    align-items: center;
    .level-name {
      margin-bottom: 18px;
    }
    /deep/ .el-input {
      width: 130px;
    }
  }
  .bg-img {
    // display: flex;
    width: 100%;
    /deep/ .el-upload-list {
      max-height: 102px;
      overflow: hidden;
    }
    /deep/ .el-form-item__content {
      width: calc(100% - 120px);
    }
  }

  .input-img-url {
    position: absolute;
    left: 90px;
    width: 350px !important;
  }
  .product-item {
    display: flex;
    border: 1px solid #dcdfe6;
    margin-bottom: -1px;
    &:hover {
      background-color: #f5f7fa;
    }
    span {
      margin-right: 10px;
      border-left: 1px solid #dcdfe6;
      margin-left: -1px;
      width: 15%;
      text-align: center;
    }
    .name {
      width: 70%;
    }
  }
  .sortable-chosen {
    background-color: #f0f7ff;
  }
  .sortable-drag {
    background-color: #fff;
  }
  .no-products {
    border: 1px solid #dcdfe6;
    text-align: center;
    line-height: 40px;
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
  .draggable-div {
    // width: 400px;
    .file-list {
      display: flex;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 8px;
      align-items: flex-end;
      position: relative;
      margin-bottom: 10px;
      .file-item {
        margin-right: 20px;
      }
      .del-item {
        position: absolute;
        right: 5px;
        top: 5px;
        cursor: pointer;
      }
    }
  }
  .img-wrap {
    position: relative;
    .item-img {
      display: block;
    }
    .box-mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      color: #fff;
      justify-content: center;
      display: none;
      i {
        width: 50%;
        text-align: center;
        cursor: pointer;
      }
    }
  }
  .img-wrap:hover {
    .box-mask {
      display: flex;
    }
  }

  .preview-img {
    width: 70px;
    height: 70px;
  }
  .video_cover_url {
    height: 70px;
  }
}
</style>
<style lang="less">
.publish-popover {
  min-width: 80px;
}
</style>
