<template>
  <div class="custom-tree-container">
    <div class="handle-list">
      <el-button type="primary" size="mini" @click="append(currentData)">
        新增节点
      </el-button>
      <el-button
        type="danger"
        size="mini"
        @click="remove(currentData)"
        :disabled="!(currentData.level && currentData.level !== 1)"
      >
        删除
      </el-button>
      <el-button
        type="success"
        size="mini"
        @click="copy"
        :disabled="!(currentData.level && currentData.level !== 1)"
      >
        复制
      </el-button>
      <el-button
        type="warning"
        size="mini"
        @click="publish(1)"
        :disabled="!(currentData.status == 0 || currentData.status == 4)"
      >
        发布UAT测试环境
      </el-button>
      <el-button
        type="primary"
        size="mini"
        @click="publish(2)"
        :disabled="!(currentData.status == 1 || currentData.status == 5)"
      >
        发布生产环境
      </el-button>
      <el-button
        type="primary"
        size="mini"
        @click="exportTable"
        :disabled="!(currentData.level && currentData.level === 1)"
      >
        导出
      </el-button>
    </div>
    <el-row>
      <el-col :span="8" class="block tree-node">
        <el-tree
          :data="data"
          node-key="id"
          ref="treeNode"
          draggable
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
            <span :class="`custom-tree-node_${data.status}`">{{
              node.label
            }}</span>
            <span>
              <!-- <span v-if="node.level !== 1" style="margin-right:10px;">
                {{ data.id }}
              </span> -->
              <!-- <span v-if="node.level !== 1">
                {{ data.end_date }}
              </span> -->
            </span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="16" v-if="showDetail" class="item-detail">
        <el-form
          :model="detailForm"
          :rules="formRules"
          inline
          ref="detailForm"
          size="mini"
          class="form-style"
          label-width="120px"
        >
          <div v-show="detailForm.id">
            <el-form-item label="目录ID">
              {{ detailForm.id }}
            </el-form-item>
          </div>
          <div>
            <el-form-item label="目录名称" prop="name">
              <el-input v-model.trim="detailForm.name"></el-input>
            </el-form-item>
          </div>
          <!-- 新增 -->
          <div>
            <el-form-item label="副标题" prop="sub_name">
              <el-input
                class="block-input"
                v-model.trim="detailForm.sub_name"
              ></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="显示模板">
              <el-select
                v-model.trim="detailForm.template_id"
                clearable
                @change="templateChange"
              >
                <el-option
                  v-for="item in templates"
                  :key="item.id"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div style="color: red">
            <el-form-item label="模板说明">
              <span>{{ templateDesc }}</span>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="目录标签">
              <el-select v-model.trim="detailForm.tags" multiple collapse-tags>
                <el-option
                  v-for="item in tagList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <!-- <div>
            <el-form-item label="目录描述" prop="desc">
              <el-input v-model.trim="detailForm.desc"></el-input>
            </el-form-item>
          </div> -->
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
            <el-form-item label="目录不可见平台" prop="hidden_platform">
              <template>
                <el-checkbox-group v-model="detailForm.hidden_platform">
                  <el-checkbox label="rcapp">RC APP</el-checkbox>
                  <el-checkbox label="rcmini">RC 小程序</el-checkbox>
                  <el-checkbox label="xxxxxxx">xxxxxxx首页</el-checkbox>
                  <el-checkbox label="xxxxxxx-rc"
                    >xxxxxxx-RC管理销售物料</el-checkbox
                  >
                </el-checkbox-group>
              </template>
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
          <!-- 原来隐藏 -->
          <!-- <div>
            <el-form-item label="跳转链接" prop="link_url">
              <el-input
                v-model="detailForm.link_url"
                class="block-input"
              ></el-input>
            </el-form-item>
          </div> -->
          <!-- 新增 -->
          <div>
            <el-form-item label="跳转链接（APP）" prop="link_url">
              <el-input
                v-model="detailForm.link_url"
                class="block-input"
              ></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item
              label="跳转链接（小程序）"
              prop=" mini_program_link_url"
            >
              <el-input
                v-model="detailForm.mini_program_link_url"
                class="block-input"
              ></el-input>
            </el-form-item>
          </div>
          <!--  -->
          <el-form-item label="目录图片" class="bg-img">
            <el-input
              v-model="detailForm.imageUrl"
              class="input-img-url"
            ></el-input>
            <upload
              @change="
                (file, fileList) => {
                  fileChange(file, fileList, 'imageUrl', 'imageList')
                }
              "
              accept="image/*"
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
                accept="image/*"
                :multiple="true"
                :showFileList="false"
              ></upload>
              <div class="draggable-div">
                <draggable
                  v-model="detailForm.detail_images"
                  @change="draggableChange"
                >
                  <div
                    v-for="(item, index) in detailForm.detail_images"
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
                        accept="image/*"
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
                      @click="delItem(index, detailForm.detail_images)"
                    ></i>
                  </div>
                </draggable>
              </div>
            </el-form-item>
          </div>
          <!-- 新增 -->
          <el-form-item label="目录背景图片" class="bg-img">
            <el-input
              v-model="detailForm.catalog_background_img_url"
              class="input-img-url"
            ></el-input>
            <upload
              @change="
                (file, fileList) => {
                  fileChange(
                    file,
                    fileList,
                    'catalog_background_img_url',
                    'catalog_background_img_url'
                  )
                }
              "
              accept="image/*"
              :fileList="catalog_background_img_url"
            ></upload>
          </el-form-item>
          <!-- 新增 -->
          <div>
            <el-form-item label="产品展示数量" prop="show_product_amount">
              <el-input-number
                v-model="detailForm.show_product_amount"
                :min="null"
                :controls="false"
                :max="99"
                label="描述文字"
              ></el-input-number>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="分享类型" prop="share_type">
              <el-select v-model.trim="detailForm.share_type" clearable>
                <el-option
                  label="小程序/RC APP"
                  value="mini_program"
                ></el-option>
                <el-option label="微网页" value="wechat"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <!-- 新增 -->
          <div>
            <el-form-item label="不可分享平台" prop="forbidden_share_platform">
              <template>
                <el-checkbox-group
                  v-model="detailForm.forbidden_share_platform"
                >
                  <el-checkbox label="rcapp">RC APP</el-checkbox>
                  <el-checkbox label="rcmini">RC 小程序</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="分享小程序" prop="share_mini_program_name">
              <el-select
                v-model.trim="detailForm.share_mini_program_name"
                clearable
              >
                <el-option
                  v-for="item in miniprograms"
                  :key="item.program_id"
                  :label="item.name"
                  :value="item.program_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div>
            <el-form-item
              label="小程序活动编号（sourcekey）"
              prop="mini_program_source_key"
            >
              <el-input
                v-model.trim="detailForm.mini_program_source_key"
                class="block-input"
              ></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item
              label="小程序分享落地页类型（targetvalue）"
              prop="mini_program_target_value"
            >
              <el-input
                v-model.trim="detailForm.mini_program_target_value"
                class="block-input"
              ></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item
              label="小程序关键参数（param）"
              prop="mini_program_params"
            >
              <el-input
                v-model.trim="detailForm.mini_program_params"
                class="block-input"
              ></el-input>
              <!-- <div class="params_box">
                <div
                  v-for="(param, paramIndex) in detailForm.mini_program_params"
                  :key="paramIndex"
                  class="params_input"
                >
                  <el-input v-model="param.text" class="block-input">
                    <el-button
                      v-if="paramIndex != 0"
                      slot="append"
                      icon="el-icon-close"
                      @click="delParams(paramIndex)"
                    ></el-button>
                  </el-input>
                  <el-button
                    class="params_add"
                    size="mini"
                    type="text"
                    icon="el-icon-plus"
                    @click="addParams"
                  ></el-button>
                </div>
              </div> -->
            </el-form-item>
          </div>
          <div>
            <el-form-item label="微网页路径" prop="wechat_page_path">
              <el-input
                v-model="detailForm.wechat_page_path"
                class="block-input"
              ></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="分享标题" prop="wechat_share_title">
              <el-input
                v-model="detailForm.wechat_share_title"
                class="block-input"
              ></el-input>
            </el-form-item>
          </div>
          <div>
            <!-- <el-form-item label="分享描述" prop="wechat_share_desc_array">
              <el-input
                v-model="detailForm.wechat_share_desc_array"
                class="block-input"
                type="textarea"
                :rows="2"
              ></el-input>
            </el-form-item> -->
            <el-form-item label="分享话术（BC）" prod="wechat_share_desc_array">
              <el-select
                v-model="detailForm.wechat_share_desc_array"
                multiple
                size="small"
                class="block-input"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, i) in share_words"
                  :key="`${item}_${i}`"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div>
            <el-form-item label=" ">
              <el-input
                v-model="share_word_text"
                type="textarea"
                class="block-input"
                :rows="3"
              ></el-input>
              <div class="mt20">
                <el-button type="primary" size="small" @click="createShareWords"
                  >添加</el-button
                >
              </div>
            </el-form-item>
          </div>
          <div>
            <el-form-item
              label="分享话术（女主人）"
              prod="wechat_share_master_desc_array"
            >
              <el-select
                v-model="detailForm.wechat_share_master_desc_array"
                multiple
                size="small"
                class="block-input"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, i) in master_share_words"
                  :key="`master_${item}_${i}`"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div>
            <el-form-item label=" ">
              <el-input
                v-model="master_share_word_text"
                type="textarea"
                class="block-input"
                :rows="3"
              ></el-input>
              <div class="mt20">
                <el-button
                  type="primary"
                  size="small"
                  @click="createMasterShareWords"
                  >添加</el-button
                >
              </div>
            </el-form-item>
          </div>
          <div>
            <el-form-item
              label="分享卡片图"
              prop="wechat_share_img_url"
              class="bg-img"
            >
              <el-input
                v-model="detailForm.wechat_share_img_url"
                class="input-img-url"
                style="width: 100%"
              ></el-input>
              <upload
                @change="
                  (file, fileList) => {
                    fileChange(
                      file,
                      fileList,
                      'wechat_share_img_url',
                      'wechat_share_img_url'
                    )
                  }
                "
                accept="image/png, image/jpeg"
                :fileList="wechat_share_img_url"
              ></upload>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="分享海报（BC）" class="bg-img-share">
              <upload
                @change="
                  (file, fileList) => {
                    fileChange(
                      file,
                      fileList,
                      'wechat_share_posters',
                      'wechat_share_posters'
                    )
                  }
                "
                accept="image/*"
                :multiple="true"
                :fileList="wechat_share_posters"
              ></upload>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="分享海报（女主人）" class="bg-img-share">
              <upload
                @change="
                  (file, fileList) => {
                    fileChange(
                      file,
                      fileList,
                      'wechat_share_master_posters',
                      'wechat_share_master_posters'
                    )
                  }
                "
                accept="image/*"
                :multiple="true"
                :fileList="wechat_share_master_posters"
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
              取消
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="confirmAdd('detailForm')"
              :loading="loading"
            >
              保存
            </el-button>
          </el-form-item>
        </el-form>
        <div>
          <el-form
            label-width="120px"
            size="mini"
            class="form-style"
            style="margin-bottom: 0"
          >
            <el-form-item label="关联产品列表">
              <div class="product-list">
                <el-input
                  v-model="code"
                  type="textarea"
                  class="block-input"
                  autosize
                  style="margin-right: 10px"
                ></el-input>
                <el-button @click="addProduct" type="primary">添加</el-button>
                <el-button type="danger" @click="deleteAllProduct">
                  全部删除
                </el-button>
              </div>
            </el-form-item>
            <el-form-item label="" label-width="0">
              <draggable v-model="products" @change="change">
                <div v-for="row in products" :key="row.id" class="product-item">
                  <span class="handle">
                    <el-button type="text" @click="delProduct(row)">
                      删除
                    </el-button>
                  </span>
                  <span class="code">{{ row.sku }}</span>
                  <el-tooltip effect="dark" :content="row.name" placement="top">
                    <span class="name whispace">{{ row.name }}</span>
                  </el-tooltip>
                </div>
              </draggable>
              <div v-if="!products.length" class="no-products">暂无数据</div>
              <div class="text-right">{{ products.length }} 条</div>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
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
    <el-dialog
      title="发布生产环境"
      width="400px"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="publishForm"
        ref="publishForm"
        :rules="publishFormRules"
        label-width="110px"
        label-position="left"
        size="mini"
      >
        <el-form-item label="发布说明" prop="desc">
          <el-input
            type="textarea"
            :rows="2"
            v-model="publishForm.desc"
          ></el-input>
        </el-form-item>
        <div class="text-center">
          <el-button size="mini" @click="publishCancel">Cancel</el-button>
          <el-button size="mini" type="primary" @click="publishConfirm"
            >Confirm</el-button
          >
        </div>
      </el-form>
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
  sortProducts,
  publishCatalog,
  exportCatalogs
} from '@/api/product/catalog.js'
import { getMiniprograms } from '@/api/product/miniprogram.js'
import { getTemplates } from '@/api/product/template.js'
import { getAttachments } from '@/api/product/tags.js'
import { getProducts } from '@/api/product/products.js'
import { uploadToResource } from '@/api/index.js'
import { clones, deleteOneofArray, deepCopy, oneOf } from '@/utility/index.js'
import Clickoutside from 'element-ui/src/utils/clickoutside'
import draggable from 'vuedraggable'
const form = {
  catalog_id: null,
  tags: [],
  name: '',
  desc: '',
  category_type: '',
  hidden_platform: [],
  imageUrl: '',
  detail_images: [],
  catalog_background_img_url: '',
  min_levelcode: null,
  max_levelcode: null,
  link_url: null,
  mini_program_link_url: null,
  start_date: null,
  end_date: null,
  template_id: null,
  mini_program_params: null,
  mini_program_source_key: null,
  mini_program_target_value: null,
  share_mini_program_name: null,
  share_type: null,
  forbidden_share_platform: [],
  show_product_amount: null,
  sub_name: null,
  wechat_page_path: null,
  wechat_share_desc_array: [],
  wechat_share_master_desc_array: [],
  wechat_share_img_url: null,
  wechat_share_posters: null,
  wechat_share_master_posters: null,
  wechat_share_title: null
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
      catalog_background_img_url: [],
      share_image: [],
      showDetail: false,
      form: {},
      wechat_share_img_url: [],
      wechat_share_posters: [],
      wechat_share_master_posters: [],
      detailForm: {
        catalog_id: null,
        name: '',
        sub_name: '',
        desc: '',
        category_type: '',
        hidden_platform: [],
        imageUrl: '',
        detail_images: [],
        catalog_background_img_url: '',
        min_levelcode: null,
        max_levelcode: null,
        start_date: null,
        end_date: null,
        template_id: null,
        tags: [],
        link_url: null,
        mini_program_link_url: null,
        mini_program_params: null,
        mini_program_source_key: null,
        mini_program_target_value: null,
        share_mini_program_name: null,
        share_type: null,
        forbidden_share_platform: [],
        show_product_amount: null,
        wechat_page_path: null,
        wechat_share_desc_array: [],
        wechat_share_master_desc_array: [],
        wechat_share_img_url: null,
        wechat_share_posters: null,
        wechat_share_master_posters: null,
        wechat_share_title: null
      },
      share_words: [],
      master_share_words: [],
      share_word_text: '',
      master_share_word_text: '',
      catalogId: null,
      products: [],
      beforeModify: {},
      formRules: {
        name: [{ required: true, message: '请输入目录名称', trigger: 'blur' }]
      },
      levelStartError: '',
      levelEndError: '',
      tagList: [],
      categorTypes: [],
      BCTypes: [
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
      RCTypes: [
        {
          name: '在线目录',
          english_name: 'online_category'
        },
        {
          name: '在线目录（新）',
          english_name: 'online_category_new'
        },
        {
          name: '首页目录',
          english_name: 'main_page_category'
        },
        {
          name: '首页目录（新）',
          english_name: 'main_page_category_new'
        },
        {
          name: '推荐目录',
          english_name: 'recommend_category'
        },
        {
          name: '销售素材目录',
          english_name: 'sales_material_category'
        },
        {
          name: '积分活动',
          english_name: 'points_activity_category'
        }
      ],
      PCTypes: [],
      Mobile: [],
      templates: [],
      templateDesc: '',
      code: '',
      isSave: false,
      previewDialog: false,
      isImage: true,
      previewUrl: '',
      isCurrent: false,
      isDel: false,
      isPublish: false,
      miniprograms: [],
      dialogFormVisible: false,
      publishForm: {},
      publishFormRules: {
        desc: [{ required: true, message: '请填写发布说明', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getTemplates()
    this.getProductLabelList()
    this.getMiniprogramLsit()
    getCategories().then(async res => {
      const promise = res.results.list.map(async o => {
        let list = await this.loadData(o.id)
        o.children = list
        return {
          name: o.name,
          id: o.id,
          children: o.children,
          status: o.status
        }
      })
      const list = await Promise.all(promise)
      this.data = list
      this.catalogId = this.data[0].id
      this.$nextTick(() => {
        this.$refs.treeNode.setCurrentKey(this.data[0].id)
        this.expandedKeys = [this.data[0].id]
        this.currentData = this.data[0]
        this.currentData.level = 1
        console.log('this.currentData', this.currentData)
      })
    })
    this.beforeModify = clones(this.detailForm)
  },
  beforeRouteLeave(to, from, next) {
    next()
  },
  watch: {
    catalogId(n) {
      switch (n) {
        case 1:
          this.categorTypes = this.BCTypes
          break
        case 2:
          this.categorTypes = this.RCTypes
          break
        case 3:
          this.categorTypes = this.PCTypes
          break
        case 4:
          this.categorTypes = this.MobileCTypes
          break
      }
    }
  },
  methods: {
    createShareWords() {
      if (!this.share_word_text) return
      if (oneOf(this.share_word_text, this.share_words)) {
        this.$notify({
          message: '请勿添加重复内容',
          type: 'error',
          duration: 3000
        })
        return
      }
      this.share_words.push(this.share_word_text)
      this.detailForm.wechat_share_desc_array.push(this.share_word_text)
      this.share_word_text = ''
    },
    createMasterShareWords() {
      if (!this.master_share_word_text) return
      if (oneOf(this.master_share_word_text, this.master_share_words)) {
        this.$notify({
          message: '请勿添加重复内容',
          type: 'error',
          duration: 3000
        })
        return
      }
      this.master_share_words.push(this.master_share_word_text)
      if (!this.detailForm.wechat_share_master_desc_array) {
        this.detailForm.wechat_share_master_desc_array = []
      }
      this.detailForm.wechat_share_master_desc_array.push(
        this.master_share_word_text
      )
      this.master_share_word_text = ''
    },
    getMiniprogramLsit() {
      getMiniprograms().then(res => {
        console.log(res)
        this.miniprograms = res.results.list ? res.results.list : []
      })
    },
    initTree() {
      getCategories().then(async res => {
        const promise = res.results.list.map(async o => {
          let list = await this.loadData(o.id)
          o.children = list
          return {
            name: o.name,
            id: o.id,
            children: o.children,
            status: o.status
          }
        })
        const list = await Promise.all(promise)
        this.data = list
        this.$nextTick(async () => {
          if (this.isPublish || this.isSave) {
            this.data.forEach(o => {
              if (o.id === this.currentData.id) {
                this.currentData = o
                this.currentData.level = 1
              }
            })
            if (this.currentData.level === 1) {
              console.log('this.currentData', this.currentData)
              this.currentData.level = 1
              this.$refs.treeNode.setCurrentKey(this.currentData.id)
              this.expandedKeys = [this.currentData.id]
            } else {
              let currentData = await getCategoryDetailById(this.currentData.id)
              this.currentData = currentData.result
              this.currentData.level = this.currentNode.level
              console.log('this.currentData level', this.currentData)
              // this.$set(this.currentData, 'status', this.currentData.status)
              let node = this.currentNode
              let data = this.currentData
              this.$refs.treeNode.setCurrentKey(this.currentData.id)
              this.nodeClick(data, node)
            }
          } else {
            this.getData()
          }
          this.isPublish = false
        })
      })
      this.beforeModify = clones(this.detailForm)
    },
    publishDialog() {
      this.dialogFormVisible = true
    },
    publishCancel() {
      this.dialogFormVisible = false
      this.publishForm.desc = ''
    },
    publishConfirm() {
      this.$refs.publishForm.validate(valid => {
        if (valid) {
          this.publish(2)
        } else {
          return false
        }
      })
    },
    delParams(index) {
      this.detailForm.mini_program_params.splice(index, 1)
    },
    // 发布
    publish(env) {
      let param = {
        target_env: env
      }
      let id
      if (this.currentData.level === 1) {
        id = this.currentData.id
      } else {
        id = this.currentData.catalog_id
        param.category_id = this.currentData.id
      }
      if (env === 2) {
        this.$prompt(`您确定要发布该分类到生产环境?`, 'Tips', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请填写发布说明',
          inputValidator: value => {
            if (!value) {
              return '请填写发布说明'
            }
          }
        })
          .then(({ value }) => {
            param.desc = value
            publishCatalog(id, param).then(res => {
              if (res.code === 0) {
                this.$notify({
                  message: '发布成功！',
                  type: 'success',
                  duration: 3000
                })
                this.isPublish = true
                this.initTree()
                // this.getData()
              }
            })
          })
          .catch(() => {})
      } else {
        publishCatalog(id, param).then(res => {
          if (res.code === 0) {
            this.$notify({
              message: '发布成功！',
              type: 'success',
              duration: 3000
            })
            this.isPublish = true
            this.initTree()
            // this.getData()
          }
        })
      }
    },
    addParams() {
      this.detailForm.mini_program_params.push({ text: '' })
    },
    // 导出
    exportTable() {
      const row = this.currentData
      exportCatalogs(row.id).then(res => {
        console.log(res)
        let url = window.URL.createObjectURL(new Blob([res]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', row.name + '.xlsx') // 自定义下载文件名（如exemple.txt）
        document.body.appendChild(link)
        link.click()
      })
    },
    loadData(id) {
      return new Promise(resolve => {
        getCategorysById(id).then(res => {
          resolve(res.results.list ? this.getOptions(res.results.list, id) : [])
        })
      })
    },
    getTemplates() {
      getTemplates()
        .then(res => {
          let list = res.results.list
          this.templates = list
            .filter(o => o.type === 5)
            .map(o => {
              o.value = Number(o.value)
              return o
            })
        })
        .catch(() => {
          this.$notify({
            message: '获取目录模板失败!',
            type: 'error',
            duration: 2000
          })
        })
    },
    templateChange(item) {
      if (item) {
        this.templateDesc =
          this.templates.length > 0
            ? this.templates.filter(o => o.value === item)[0].desc
            : ''
      } else {
        this.templateDesc = ''
      }
    },
    getProductLabelList() {
      getAttachments({ page_size: 200 })
        .then(res => {
          let list = res.results.list
          this.tagList = list
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
    // 节点点击事件
    nodeClick(data, node) {
      console.log(data)
      console.log(node)
      if (data.id === this.currentData.id) return
      data.level = node.level
      this.currentData = deepCopy(data)
      console.log('currentData', this.currentData)
      this.currentNode = deepCopy(node)
      if (node.level === 1) {
        this.catalogId = data.id
        this.showDetail = false
        return
      } else {
        this.catalogId = data.catalogId
        this.showDetail = true
      }
      getCategoryDetailById(data.id).then(res => {
        if (
          res.result.wechat_share_img_url &&
          res.result.wechat_share_img_url.length
        ) {
          if (res.result.wechat_share_img_url[0].image_url) {
            this.wechat_share_img_url = [
              {
                name: res.result.wechat_share_img_url[0].image_url,
                url: res.result.wechat_share_img_url[0].image_url
              }
            ]
          } else {
            this.wechat_share_img_url = []
          }
        } else {
          this.wechat_share_img_url = []
        }
        // catalog_background_img_url
        if (
          res.result.catalog_background_img_url &&
          res.result.catalog_background_img_url.length
        ) {
          if (res.result.catalog_background_img_url[0].image_url) {
            this.catalog_background_img_url = [
              {
                name: res.result.catalog_background_img_url[0].image_url,
                url: res.result.catalog_background_img_url[0].image_url
              }
            ]
          } else {
            this.catalog_background_img_url = []
          }
        } else {
          this.catalog_background_img_url = []
        }
        // catalog_background_img_url
        res.result.catalog_background_img_url =
          res.result.catalog_background_img_url &&
          res.result.catalog_background_img_url.length > 0
            ? res.result.catalog_background_img_url[0].image_url
            : ''
        res.result.imageUrl =
          res.result.images && res.result.images.length > 0
            ? res.result.images[0].image_url
            : ''
        res.result.wechat_share_img_url =
          res.result.wechat_share_img_url &&
          res.result.wechat_share_img_url.length > 0
            ? res.result.wechat_share_img_url[0].image_url
            : ''

        res.result.hidden_platform = res.result.hidden_platform || []
        res.result.forbidden_share_platform =
          res.result.forbidden_share_platform || []
        if (res.result.images && res.result.images.length) {
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
        if (!res.result.wechat_share_posters) {
          res.result.wechat_share_posters = []
          this.wechat_share_posters = []
        } else {
          this.wechat_share_posters = res.result.wechat_share_posters.map(o => {
            return {
              name: o.image_url,
              url: o.image_url
            }
          })
        }
        if (!res.result.wechat_share_master_posters) {
          res.result.wechat_share_master_posters = []
          this.wechat_share_master_posters = []
        } else {
          this.wechat_share_master_posters = res.result.wechat_share_master_posters.map(
            o => {
              return {
                name: o.image_url,
                url: o.image_url
              }
            }
          )
        }
        res.result.start_date = res.result.start_date
          ? new Date(res.result.start_date).getTime()
          : null
        res.result.end_date = res.result.end_date
          ? new Date(res.result.end_date).getTime()
          : null

        let tags = this.tagList.map(o => o.id)
        res.result.tags = res.result.tags
          ? res.result.tags
              .map(o => {
                return Number(o)
              })
              .filter(o => oneOf(o, tags))
          : []
        if (res.result.children) {
          this.products = res.result.children
        }
        if (this.templates) {
          if (
            !oneOf(
              res.result.template_id,
              this.templates.map(o => o.value)
            )
          ) {
            res.result.template_id = null
          }
        } else {
          res.result.template_id = null
        }
        if (this.categorTypes) {
          if (
            !oneOf(
              res.result.category_type,
              this.categorTypes.map(o => o.english_name)
            )
          ) {
            res.result.category_type = null
          }
        } else {
          res.result.category_type = null
        }
        if (this.miniprograms) {
          if (
            !oneOf(
              res.result.share_mini_program_name,
              this.miniprograms.map(o => o.program_id)
            )
          ) {
            res.result.share_mini_program_name = null
          }
        } else {
          res.result.share_mini_program_name = null
        }
        this.templateChange(res.result.template_id)
        this.detailForm = clones(res.result)

        this.share_words = res.result.wechat_share_desc_array
          ? clones(res.result.wechat_share_desc_array)
          : []
        this.master_share_words = res.result.wechat_share_master_desc_array
          ? clones(res.result.wechat_share_master_desc_array)
          : []
        console.log(this.detailForm)
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
        // this.getData()
        this.initTree()
      })
    },
    // 获取分类树数据
    async getData() {
      let data = await this.loadData(this.catalogId)
      this.$refs.treeNode.updateKeyChildren(this.catalogId, data)
      this.$nextTick(() => {
        if (this.isCurrent) {
          this.$refs.treeNode.setCurrentKey(this.currentData.id)
        }
        if (this.isDel) {
          let node = this.currentNode.parent
          let data = this.currentNode.parent.data
          if (this.currentData.parent_id) {
            this.$refs.treeNode.setCurrentKey(this.currentData.parent_id)
          } else {
            data.level = 1
            data.status = 0
            this.$refs.treeNode.setCurrentKey(this.currentData.catalogId)
          }
          this.nodeClick(data, node)
        }
        this.isCurrent = false
        this.isDel = false
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
      // if (file && !checkImageSize(file, 1024 * 20)) {
      //   this.$notify.error({
      //     title: 'Error',
      //     message: `Please upload JPG, PNG, JPEG format pictures, size limit of less than 20M`,
      //     duration: 3000
      //   })
      //   return
      // }
      this.handleUploadFile(file, fileList, formName, list, url => {
        switch (formName) {
          case 'share_image':
          case 'imageUrl':
          case 'catalog_background_img_url':
          case 'wechat_share_img_url':
            this.detailForm[formName] = url
            break
          case 'detail_images':
            this.detailForm[formName].push({
              image_url: url,
              video_url: '',
              video_cover_url: ''
            })
            break
          case 'wechat_share_posters':
          case 'wechat_share_master_posters':
            if (url) {
              this.detailForm[formName].push({
                image_url: url
              })
            } else {
              this.detailForm[formName] = fileList.map(o => ({
                image_url: o.url
              }))
            }
            break
          case 'image_url':
          case 'video_url':
            if (item) {
              item[formName] = url
              if (formName == 'video_url') {
                item.video_cover_url = item.image_url
              }
            }
            break
        }
        if (url) {
          this.uploadImageToResource(
            file.name.substring(0, file.name.lastIndexOf('.')),
            url
          )
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
      this.showDetail = true
      this.detailForm = clones(form)
      this.templateDesc = ''
      this.detailForm.id = null
      this.imageList = []
      this.detail_images = []
      this.share_image = []
      this.products = []
    },
    copy() {
      copyCategory(this.currentData.id, {}).then(() => {
        this.isCurrent = true
        // this.getData()
        this.initTree()
      })
    },
    // 删除某一个分类
    remove(data) {
      this.$confirm(`您确定要删除该分类?`, 'Tips', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delCategoryById(data.id).then(() => {
            this.isDel = true
            // this.getData()
            this.initTree()
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
              sub_name: this[form].sub_name,
              desc: this[form].desc,
              min_levelcode: this[form].min_levelcode,
              max_levelcode: this[form].max_levelcode,
              start_date: this[form].start_date,
              end_date: this[form].end_date,
              link_url: this[form].link_url,
              mini_program_link_url: this[form].mini_program_link_url,
              template_id: this[form].template_id
                ? this[form].template_id * 1
                : null,
              images: this[form].imageUrl
                ? [
                    {
                      image_url: this[form].imageUrl
                    }
                  ]
                : null,
              catalog_background_img_url: this[form].catalog_background_img_url
                ? [
                    {
                      image_url: this[form].catalog_background_img_url
                    }
                  ]
                : null,
              detail_images:
                this[form].detail_images && this[form].detail_images.length
                  ? this[form].detail_images
                  : null,
              tags:
                this[form].tags && this[form].tags.length
                  ? this[form].tags.join(',')
                  : null,
              wechat_page_path: this[form].wechat_page_path,
              wechat_share_desc_array: this[form].wechat_share_desc_array,
              wechat_share_master_desc_array: this[form]
                .wechat_share_master_desc_array,
              wechat_share_img_url: this[form].wechat_share_img_url
                ? [
                    {
                      image_url: this[form].wechat_share_img_url
                    }
                  ]
                : null,
              wechat_share_posters:
                this[form].wechat_share_posters &&
                this[form].wechat_share_posters.length
                  ? this[form].wechat_share_posters
                  : null,
              wechat_share_master_posters:
                this[form].wechat_share_master_posters &&
                this[form].wechat_share_master_posters.length
                  ? this[form].wechat_share_master_posters
                  : null,
              wechat_share_title: this[form].wechat_share_title,
              show_product_amount: this[form].show_product_amount,
              share_mini_program_name: this[form].share_mini_program_name,
              share_type: this[form].share_type,
              hidden_platform: this[form].hidden_platform,
              forbidden_share_platform: this[form].forbidden_share_platform,
              mini_program_params: this[form].mini_program_params,
              mini_program_source_key: this[form].mini_program_source_key,
              mini_program_target_value: this[form].mini_program_target_value
            }
            if (!params.parent_id) {
              params.category_type = this[form].category_type
            }
            if (params.detail_images) {
              params.detail_images.forEach(o => {
                if (o.video_url) {
                  if (!o.video_cover_url) {
                    o.video_cover_url = o.image_url
                  }
                }
              })
            }
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
                  if (this.currentData.level === 1) {
                    this.isPublish = true
                  }
                  this.initTree()
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
                  // this.getData()
                  this.initTree()
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
        o => o.path === '/productManage/catalog'
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
        skus: this.code,
        page_size: 100
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
        let codes = this.code.split(',').map(o => o.replace(/[\r\n]/g, ''))
        let params = []
        codes.forEach(o => {
          if (
            oneOf(
              o,
              results.list.map(item => item.sku)
            )
          ) {
            results.list.forEach(j => {
              if (
                o === j.sku &&
                !oneOf(
                  o,
                  this.products.map(o => o.sku)
                )
              ) {
                params.push({
                  sku: j.sku,
                  name: j.name
                })
              }
            })
          }
        })
        // 新增产品全部重复则提示已存在，部分重复则添加不重复产品筛除重复产品
        if (!params.length) {
          this.$notify({
            message: '添加产品已存在!',
            type: 'error',
            duration: 3000
          })
          return
        }
        params = params.concat(this.products)
        params = params.map((o, i) => ({
          sku: o.sku,
          name: o.name,
          sort: i
        }))
        console.log(params)
        // 查询到的产品信息
        addProducts(this.currentData.id, params).then(res => {
          if (res.code === 0) {
            this.code = null
            this.getProducts()
          } else {
            this.$notify({
              message: '添加重复产品!',
              type: 'error',
              duration: 3000
            })
          }
        })
      })
    },
    // 删除分类下所有产品
    deleteAllProduct() {
      this.$confirm(`您确定要删除该分类下所有产品吗?`, 'Tips', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
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
      this.$confirm(`您确定要删除该产品吗?`, 'Tips', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
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
      sortProducts(this.currentData.id, data).then(res => {
        console.log(res)
        this.getProducts()
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
  &_0 {
    padding: 5px 10px;
  }
  &_1 {
    padding: 5px 10px;
    // background: #e6a23c;
    color: #e6a23c;
  }
  &_2 {
    padding: 5px 10px;
    // background: #f56c6c;
    color: #409eff;
  }
  &_3 {
    padding: 5px 10px;
    // background: pink;
    color: pink;
  }
  &_4 {
    padding: 5px 10px;
    // background: #e6a23c;
    color: #e6a23c;
  }
  &_5 {
    padding: 5px 10px;
    // background: #f56c6c;
    color: #409eff;
  }
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
  .bg-img-share {
    width: 100%;
    /deep/ .el-upload-list {
      overflow: hidden;
    }
    /deep/ .el-form-item__content {
      width: calc(100% - 120px);
    }
  }

  .block-input {
    width: 440px !important;
    /deep/ .el-input {
      width: 100%;
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
  .product-list {
    display: flex;
    align-items: flex-start;
  }
  .params_box {
    position: relative;
    .params_input {
      display: block;
      margin-bottom: 10px;
    }
    .params_add {
      top: 0;
      right: -30px;
      position: absolute;
    }
  }
}
/deep/.el-select__tags {
  overflow: hidden;
}
/deep/.el-tag.el-tag--info {
  max-width: calc(100% - 15px);
  overflow: hidden;
}
/deep/.el-select__tags-text {
  display: inline-block;
  max-width: calc(100% - 15px);
}
</style>
<style lang="less">
.publish-popover {
  min-width: 80px;
}
</style>
