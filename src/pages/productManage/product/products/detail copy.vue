<template>
  <div class="detail">
    <div class="header">
      <div class="add-btn">
        <el-button type="primary" size="mini" @click="copy">
          复制
        </el-button>
      </div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="产品信息" name="info">
        <div id="pim">
          <div>
            <span class="tag">pim信息</span>
            <el-divider></el-divider>
          </div>
          <el-form inline size="small" label-width="95px">
            <el-form-item label="产品名称">
              <el-input
                v-model="skuInfo.sku_info_from_pim.product_title"
                readonly
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="是否可搜索">
              <el-select
                v-model="skuInfo.sku_info_from_pim.include_in_search"
                readonly
                disabled
                size="small"
                placeholder="请选择"
              >
                <el-option label="true" :value="true"></el-option>
                <el-option label="false" :value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产品类型">
              <el-select
                v-model="skuInfo.sku_info_from_pim.product_type"
                size="small"
                readonly
                disabled
              >
                <el-option label="常规产品" value="SalesPart"></el-option>
                <el-option
                  label="高端积分产品"
                  value="AdvancedPointRedeemPart"
                ></el-option>
                <el-option
                  label="普通积分产品"
                  value="NormalPointRedeemPart"
                ></el-option>
                <el-option label="海淘产品" value="OverseasPart"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="section code">
              <el-select
                v-model="skuInfo.sku_info_from_pim.section_code"
                size="small"
                readonly
                disabled
              >
                <el-option label="普通销售产品" :value="1"></el-option>
                <el-option label="促销产品" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产品线">
              <el-select
                v-model="skuInfo.sku_info_from_pim.product_line"
                size="small"
                placeholder="请选择"
                readonly
                disabled
              >
                <el-option label="护肤品" value="SkinCare"></el-option>
                <el-option label="调养品" value="Nutrition"></el-option>
                <el-option label="彩妆品" value="MakeUp"></el-option>
                <el-option label="其他" value="Others"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="货号">
              <el-input
                v-model="skuInfo.sku_info_from_pim.sku"
                readonly
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="货号名称">
              <el-input
                v-model="skuInfo.sku_info_from_pim.name"
                readonly
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="RC价格">
              <el-input
                v-model="skuInfo.sku_info_from_pim.retail_price"
                readonly
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="建议零售价">
              <el-input
                v-model="skuInfo.sku_info_from_pim.suggest_retail_price"
                readonly
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="积分分值">
              <el-input
                v-model="skuInfo.sku_info_from_pim.redeem_point"
                readonly
                disabled
              ></el-input>
            </el-form-item>
            <div>
              <el-form-item label="子产品列表">
                <el-table
                  :data="skuInfo.sku_info_from_pim.child_products"
                  size="mini"
                  ref="childsList"
                  :class="isShowList ? '' : 'hidden-body'"
                >
                  <el-table-column prop="sku" label="货号" width="180">
                  </el-table-column>
                  <el-table-column prop="name" label="产品名称" width="180">
                  </el-table-column>
                  <el-table-column prop="quantity" label="数量" width="180">
                  </el-table-column>
                </el-table>
                <el-button
                  type="primary"
                  size="small"
                  class="show-btn"
                  @click="isShowList = !isShowList"
                  >{{ isShowList ? '收起' : '展开' }}</el-button
                >
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div id="base">
          <div>
            <span class="tag">基础信息</span>
            <el-divider></el-divider>
          </div>
          <el-form inline size="small" label-width="100px">
            <el-form-item label="替换货号">
              <el-input
                v-model="skuInfo.sku_extension_info.basic_info.substitute_sku"
              ></el-input>
            </el-form-item>
            <el-form-item label="英文名称">
              <el-input
                v-model="skuInfo.sku_extension_info.basic_info.english_name"
              ></el-input>
            </el-form-item>
            <el-form-item label="规格">
              <el-input
                v-model="skuInfo.sku_extension_info.basic_info.volume"
              ></el-input>
            </el-form-item>
            <el-form-item label="产品分组名称">
              <el-input
                v-model="skuInfo.sku_extension_info.basic_info.shade_group"
              ></el-input>
            </el-form-item>
            <el-form-item label="色号值">
              <el-input
                v-model="skuInfo.sku_extension_info.basic_info.rgb_color"
              ></el-input>
            </el-form-item>
            <el-form-item label="色号名称">
              <el-input
                v-model="skuInfo.sku_extension_info.basic_info.rgb_color_name"
              ></el-input>
            </el-form-item>
            <el-form-item label="配送方式">
              <el-input
                v-model="skuInfo.sku_extension_info.basic_info.delivery_method"
              ></el-input>
            </el-form-item>
            <el-form-item label="所属系列">
              <el-select
                v-model="skuInfo.sku_extension_info.basic_info.series"
                size="small"
                value-key="id"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in series_list"
                  :key="item.id"
                  :value="item"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="市场价">
              <el-input-number
                size="small"
                v-model="skuInfo.sku_extension_info.basic_info.market_price"
                style="width:177px"
                controls-position="right"
                :controls="false"
              ></el-input-number>
            </el-form-item>
          </el-form>
          <el-form size="small" label-width="95px">
            <el-form-item label="产品描述">
              <el-input
                v-model="skuInfo.sku_extension_info.basic_info.sku_description"
                class="block-input"
                type="textarea"
                :rows="2"
              ></el-input>
            </el-form-item>
            <el-form-item label="补充说明">
              <el-input
                v-model="skuInfo.sku_extension_info.basic_info.additional_info"
                class="block-input"
                type="textarea"
                :rows="2"
              ></el-input>
            </el-form-item>
            <el-form-item label="进口税说明图片" class="upload_wrap">
              <el-input
                v-model="skuInfo.sku_extension_info.basic_info.import_tax_url"
                class="input-img-url"
                size="small"
              ></el-input>
              <upload
                @change="
                  (file, fileList) => {
                    fileChange(
                      file,
                      fileList,
                      'import_tax_url',
                      'import_tax_url'
                    )
                  }
                "
                accept="image/png, image/jpeg"
                :fileList="import_tax_url"
              ></upload>
            </el-form-item>
            <el-form-item label="进口国显示图片" class="upload_wrap">
              <el-input
                v-model="
                  skuInfo.sku_extension_info.basic_info.import_country_url
                "
                class="input-img-url"
                size="small"
              ></el-input>
              <upload
                @change="
                  (file, fileList) => {
                    fileChange(
                      file,
                      fileList,
                      'import_country_url',
                      'import_country_url'
                    )
                  }
                "
                accept="image/png, image/jpeg"
                :fileList="import_country_url"
              ></upload>
            </el-form-item>
            <el-form-item label="产品参数">
              <div class="picture-text-content">
                <div class="picture-text">
                  <span class="label">标题：</span>
                  <el-input
                    class="block-input"
                    v-model="
                      skuInfo.sku_extension_info.basic_info.specification.title
                    "
                  ></el-input>
                </div>
                <div class="picture-text">
                  <span class="label">说明：</span>
                  <el-input
                    class="block-input"
                    v-model="
                      skuInfo.sku_extension_info.basic_info.specification
                        .explanation
                    "
                    type="textarea"
                    :rows="2"
                  ></el-input>
                </div>
                <div class="picture-text">
                  <span class="label">图片：</span>
                  <upload
                    @change="
                      (file, fileList) => {
                        fileChange(
                          file,
                          fileList,
                          'specification',
                          'specification'
                        )
                      }
                    "
                    accept="image/png, image/jpeg"
                    :fileList="specification"
                  ></upload>
                  <el-input
                    v-model="
                      skuInfo.sku_extension_info.basic_info.specification
                        .image_url
                    "
                    class="input-img-url"
                    size="small"
                  ></el-input>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="产品服务">
              <div class="picture-text-content">
                <div class="picture-text">
                  <span class="label">标题：</span>
                  <el-input
                    v-model="
                      skuInfo.sku_extension_info.basic_info.service_description
                        .title
                    "
                    class="block-input"
                  ></el-input>
                </div>
                <div class="picture-text">
                  <span class="label">说明：</span>
                  <el-input
                    v-model="
                      skuInfo.sku_extension_info.basic_info.service_description
                        .explanation
                    "
                    class="block-input"
                    type="textarea"
                    :rows="2"
                  ></el-input>
                </div>
                <div class="picture-text">
                  <span class="label">图片：</span>
                  <upload
                    @change="
                      (file, fileList) => {
                        fileChange(
                          file,
                          fileList,
                          'service_description',
                          'service_description'
                        )
                      }
                    "
                    accept="image/png, image/jpeg"
                    :fileList="service_description"
                  ></upload>
                  <el-input
                    v-model="
                      skuInfo.sku_extension_info.basic_info.service_description
                        .image_url
                    "
                    class="input-img-url"
                    size="small"
                  ></el-input>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div id="marketing">
          <div>
            <span class="tag">营销配置</span>
            <el-divider></el-divider>
          </div>
          <el-form size="small" label-width="100px">
            <el-form-item label="搜索关键字">
              <el-tag
                v-for="(tag, index) in key_word_tags"
                :key="tag"
                size="small"
                closable
                @close="delKeyWordTag(index)"
                class="key-word-tag"
              >
                {{ tag }}
              </el-tag>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="key_word_text"
                type="textarea"
                class="block-input"
                :rows="1"
              ></el-input>
              <div class="mt20">
                <el-button type="primary" size="small" @click="createKeyWords"
                  >添加</el-button
                >
              </div>
            </el-form-item>
          </el-form>
          <el-form inline size="small" label-width="100px">
            <el-form-item label="产品卖点">
              <el-input
                v-model="
                  skuInfo.sku_extension_info.marketing_configuration
                    .sku_selling_points
                "
              ></el-input>
            </el-form-item>
            <el-form-item label="营销标签">
              <el-select
                v-model="
                  skuInfo.sku_extension_info.marketing_configuration
                    .marketing_tags[0]
                "
                size="small"
                value-key="id"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in marketing_tag_list"
                  :key="item.id"
                  :value="item"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="榜单标签">
              <el-input
                size="small"
                clearable
                v-model="
                  skuInfo.sku_extension_info.marketing_configuration
                    .recommend_tag
                "
              ></el-input>
            </el-form-item>
          </el-form>
          <el-form label-width="100px">
            <el-form-item label="产品标签">
              <draggable-select
                v-model="
                  skuInfo.sku_extension_info.marketing_configuration
                    .product_tags
                "
                multiple
                class="block-input"
                size="small"
                value-key="id"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in product_label_list"
                  :key="item.id"
                  :value="item"
                  :label="item.name"
                ></el-option>
              </draggable-select>
            </el-form-item>
            <el-form-item label="榜单推荐话术">
              <el-input
                v-model="
                  skuInfo.sku_extension_info.marketing_configuration
                    .recommend_words
                "
                class="block-input"
                type="textarea"
                :rows="2"
              ></el-input>
            </el-form-item>
            <el-form-item label="媒体获奖标签">
              <draggable-select
                v-model="
                  skuInfo.sku_extension_info.marketing_configuration.award_tags
                "
                class="block-input"
                value-key="id"
                size="small"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in award_tag_list"
                  :key="item.id"
                  :value="item"
                  :label="item.name"
                ></el-option>
              </draggable-select>
            </el-form-item>
          </el-form>
        </div>
        <div id="productPictrue">
          <div>
            <div class="product-pictrue-header">
              <span class="tag">产品图片</span>
              <div class="handle-btn">
                <el-popover
                  placement="bottom"
                  popper-class="example-popover"
                  width="300"
                  trigger="hover"
                >
                  <p>
                    <span>产品png图片.jpg；</span>
                  </p>
                  <p>
                    <span class="header">产品列表</span>
                  </p>
                  <p>
                    <span>产品列表图片-官网PC端-图片1.jpg；</span>
                  </p>
                  <p>
                    <span>产品列表图片-官网PC端-视频1.mp4；</span>
                  </p>
                  <p>
                    <span>产品列表图片-官网PC端-图片2.jpg；</span>
                  </p>
                  <p>
                    <span>产品列表图片-官网移动端-图片1.jpg；</span>
                  </p>
                  <p>
                    <span>产品列表图片-APP小程序-图片1.jpg；</span>
                  </p>
                  <p>
                    <span class="header">产品头图</span>
                  </p>
                  <p>
                    <span>产品头图-官网PC端-图片1.jpg；</span>
                  </p>
                  <p>
                    <span>产品头图-APP小程序官网移动端-图片1.jpg；</span>
                  </p>
                  <p>
                    <span class="header">产品详情</span>
                  </p>
                  <p>
                    <span>产品详情-官网PC端-图片1.jpg；</span>
                  </p>
                  <p>
                    <span>产品头图-APP小程序官网移动端-图片1.jpg；</span>
                  </p>

                  <el-button size="small" slot="reference"
                    >批量上传文件名示例</el-button
                  >
                </el-popover>
                <upload-folder @change="updateFileList"></upload-folder>
              </div>
            </div>
            <el-divider></el-divider>
          </div>
          <el-form size="small" label-width="110px">
            <el-form-item label="产品png图片">
              <el-input
                v-model="skuInfo.sku_extension_info.sku_images.png_image_url"
                class="input-img-url"
                size="small"
              ></el-input>
              <upload
                @change="
                  (file, fileList) => {
                    fileChange(file, fileList, 'png_image_url', 'png_image_url')
                  }
                "
                accept="image/png, image/jpeg"
                :fileList="png_image_url"
              ></upload>
            </el-form-item>
            <el-form-item label="促销banner图">
              <el-input
                v-model="skuInfo.sku_extension_info.sku_images.promotion_banner"
                class="input-img-url"
                size="small"
              ></el-input>
              <upload
                @change="
                  (file, fileList) => {
                    fileChange(
                      file,
                      fileList,
                      'promotion_banner',
                      'promotion_banner'
                    )
                  }
                "
                accept="image/png, image/jpeg"
                :fileList="promotion_banner"
              ></upload>
            </el-form-item>
            <!-- 产品列表图片 -->
            <div>产品列表图片</div>
            <el-divider></el-divider>
            <el-form-item label="官网PC端（280*360）">
              <upload
                @change="
                  (file, fileList) => {
                    fileChange(
                      file,
                      fileList,
                      'list_image_url&official_website_pc',
                      'list_image_official_website_pc'
                    )
                  }
                "
                accept="image/png, image/jpeg"
                :multiple="true"
                :showFileList="false"
              ></upload>
              <div class="draggable-div">
                <draggable
                  v-model="
                    skuInfo.sku_extension_info.sku_images.list_image_url
                      .official_website_pc
                  "
                  @change="draggableChange"
                >
                  <div
                    v-for="(item, index) in skuInfo.sku_extension_info
                      .sku_images.list_image_url.official_website_pc"
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
                            @click="del(item, true)"
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
                              'list_image_url&official_website_pc',
                              'list_image_official_website_pc',
                              'image_url',
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
                              'list_image_url&official_website_pc',
                              'list_image_official_website_pc',
                              'video_url',
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
                      @click="
                        delItem(
                          index,
                          skuInfo.sku_extension_info.sku_images.list_image_url
                            .official_website_pc
                        )
                      "
                    ></i>
                  </div>
                </draggable>
              </div>
            </el-form-item>
            <el-form-item label="官网移动端（280*400）">
              <upload
                @change="
                  (file, fileList) => {
                    fileChange(
                      file,
                      fileList,
                      'list_image_url&official_website_mobile',
                      'list_image_official_website_mobile'
                    )
                  }
                "
                accept="image/png, image/jpeg"
                :multiple="true"
                :showFileList="false"
              ></upload>
              <div class="draggable-div">
                <draggable
                  v-model="
                    skuInfo.sku_extension_info.sku_images.list_image_url
                      .official_website_mobile
                  "
                  @change="draggableChange"
                >
                  <div
                    v-for="(item, index) in skuInfo.sku_extension_info
                      .sku_images.list_image_url.official_website_mobile"
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
                            @click="del(item, true)"
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
                              'list_image_url&official_website_mobile',
                              'list_image_official_website_mobile',
                              'image_url',
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
                              'list_image_url&official_website_mobile',
                              'list_image_official_website_mobile',
                              'video_url',
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
                      @click="
                        delItem(
                          index,
                          skuInfo.sku_extension_info.sku_images.list_image_url
                            .official_website_mobile
                        )
                      "
                    ></i>
                  </div>
                </draggable>
              </div>
            </el-form-item>
            <el-form-item label="APP/小程序（400*400）">
              <upload
                @change="
                  (file, fileList) => {
                    fileChange(
                      file,
                      fileList,
                      'list_image_url&app',
                      'list_image_app'
                    )
                  }
                "
                accept="image/png, image/jpeg"
                :multiple="true"
                :showFileList="false"
              ></upload>
              <div class="draggable-div">
                <draggable
                  v-model="
                    skuInfo.sku_extension_info.sku_images.list_image_url.app
                  "
                  @change="draggableChange"
                >
                  <div
                    v-for="(item, index) in skuInfo.sku_extension_info
                      .sku_images.list_image_url.app"
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
                            @click="del(item, true)"
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
                              'list_image_url&app',
                              'list_image_app',
                              'image_url',
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
                              'list_image_url&app',
                              'list_image_app',
                              'video_url',
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
                      @click="
                        delItem(
                          index,
                          skuInfo.sku_extension_info.sku_images.list_image_url
                            .app
                        )
                      "
                    ></i>
                  </div>
                </draggable>
              </div>
            </el-form-item>
            <!-- 产品头图 -->
            <div>产品头图</div>
            <el-divider></el-divider>
            <el-form-item label="官网PC端（400*400）">
              <upload
                @change="
                  (file, fileList) => {
                    fileChange(
                      file,
                      fileList,
                      'head_image_url&official_website_pc',
                      'head_image_official_website_pc'
                    )
                  }
                "
                accept="image/png, image/jpeg"
                :multiple="true"
                :showFileList="false"
              ></upload>
              <div class="draggable-div">
                <draggable
                  v-model="
                    skuInfo.sku_extension_info.sku_images.head_image_url
                      .official_website_pc
                  "
                  @change="draggableChange"
                >
                  <div
                    v-for="(item, index) in skuInfo.sku_extension_info
                      .sku_images.head_image_url.official_website_pc"
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
                            @click="del(item, true)"
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
                              'head_image_url&official_website_pc',
                              'head_image_official_website_pc',
                              'image_url',
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
                              'head_image_url&official_website_pc',
                              'head_image_official_website_pc',
                              'video_url',
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
                      @click="
                        delItem(
                          index,
                          skuInfo.sku_extension_info.sku_images.head_image_url
                            .official_website_pc
                        )
                      "
                    ></i>
                  </div>
                </draggable>
              </div>
            </el-form-item>
            <el-form-item label="APP/小程序/官网移动端（750*520）">
              <upload
                @change="
                  (file, fileList) => {
                    fileChange(
                      file,
                      fileList,
                      'head_image_url&app',
                      'head_image_app'
                    )
                  }
                "
                accept="image/png, image/jpeg"
                :multiple="true"
                :showFileList="false"
              ></upload>
              <div class="draggable-div">
                <draggable
                  v-model="
                    skuInfo.sku_extension_info.sku_images.head_image_url.app
                  "
                  @change="draggableChange"
                >
                  <div
                    v-for="(item, index) in skuInfo.sku_extension_info
                      .sku_images.head_image_url.app"
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
                            @click="del(item, true)"
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
                              'head_image_url&app',
                              'head_image_app',
                              'image_url',
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
                              'head_image_url&app',
                              'head_image_app',
                              'video_url',
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
                      @click="
                        delItem(
                          index,
                          skuInfo.sku_extension_info.sku_images.head_image_url
                            .app
                        )
                      "
                    ></i>
                  </div>
                </draggable>
              </div>
            </el-form-item>
            <!-- 产品详情 -->
            <div>产品详情</div>
            <el-divider></el-divider>
            <el-form-item label="官网PC端">
              <upload
                @change="
                  (file, fileList) => {
                    fileChange(
                      file,
                      fileList,
                      'detail_image_url&official_website_pc',
                      'detail_image_official_website_pc',
                      'image_url'
                    )
                  }
                "
                accept="image/png, image/jpeg"
                :multiple="true"
                :showFileList="false"
              ></upload>
              <div class="draggable-div special-draggable-div">
                <draggable
                  v-model="
                    skuInfo.sku_extension_info.sku_images.detail_image_url
                      .official_website_pc
                  "
                  @change="draggableChange"
                >
                  <div
                    v-for="(item, index) in skuInfo.sku_extension_info
                      .sku_images.detail_image_url.official_website_pc"
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
                            @click="del(item, true)"
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
                              'detail_image_url&official_website_pc',
                              'detail_image_official_website_pc',
                              'image_url',
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
                              'detail_image_url&official_website_pc',
                              'detail_image_official_website_pc',
                              'video_url',
                              item
                            )
                          }
                        "
                        accept="video/*"
                        :showFileList="false"
                        btnName="添加视频"
                      ></upload>
                    </div>
                    <div>
                      <el-form-item label="跳转链接">
                        <el-input
                          v-model="item.jump_target_url"
                          size="small"
                        ></el-input>
                      </el-form-item>
                    </div>
                    <i
                      class="el-icon-delete del-item"
                      @click="
                        delItem(
                          index,
                          skuInfo.sku_extension_info.sku_images.detail_image_url
                            .official_website_pc
                        )
                      "
                    ></i>
                  </div>
                </draggable>
              </div>
            </el-form-item>
            <el-form-item label="APP/小程序/官网移动端 （750*高度不限）">
              <upload
                @change="
                  (file, fileList) => {
                    fileChange(
                      file,
                      fileList,
                      'detail_image_url&app',
                      'detail_image_app',
                      'image_url'
                    )
                  }
                "
                accept="image/*"
                :multiple="true"
                :showFileList="false"
              ></upload>
              <div class="draggable-div special-draggable-div">
                <draggable
                  v-model="
                    skuInfo.sku_extension_info.sku_images.detail_image_url.app
                  "
                  @change="draggableChange"
                >
                  <div
                    v-for="(item, index) in skuInfo.sku_extension_info
                      .sku_images.detail_image_url.app"
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
                            @click="del(item, true)"
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
                              'detail_image_url&app',
                              'detail_image_app',
                              'image_url',
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
                              'detail_image_url&app',
                              'detail_image_app',
                              'video_url',
                              item
                            )
                          }
                        "
                        accept="video/*"
                        :showFileList="false"
                        btnName="添加视频"
                      ></upload>
                    </div>
                    <div>
                      <el-form-item label="跳转链接：">
                        <el-input
                          v-model="item.jump_target_url"
                          size="small"
                        ></el-input>
                      </el-form-item>
                    </div>
                    <div>
                      <el-form-item label="不可见平台:">
                        <el-checkbox-group v-model="item.invisible_platform">
                          <el-checkbox :label="1">玫琳凯之窗APP</el-checkbox>
                          <el-checkbox :label="4">RC APP</el-checkbox>
                          <el-checkbox :label="2">小程序</el-checkbox>
                          <el-checkbox :label="3">官网移动端</el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                    </div>
                    <i
                      class="el-icon-delete del-item"
                      @click="
                        delItem(
                          index,
                          skuInfo.sku_extension_info.sku_images.detail_image_url
                            .app
                        )
                      "
                    ></i>
                  </div>
                </draggable>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div id="sheSay">
          <div>
            <div class="product-pictrue-header">
              <span class="tag">TA说</span>
              <el-button type="primary" size="small" @click="newSheSays"
                >新增</el-button
              >
            </div>
            <el-divider></el-divider>
          </div>
          <div
            class="picture-text-content"
            v-for="(item, index) in skuInfo.sku_extension_info.she_says"
            :key="item.id"
          >
            <div class="icon-del">
              <i class="el-icon-delete" @click="delSheSays(index)"></i>
            </div>
            <el-form size="small" label-width="95px">
              <el-form-item label="有效期">
                <el-date-picker
                  v-model="item.validDate"
                  type="datetimerange"
                  value-format="timestamp"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
              <!-- <el-form-item label="标签">
                <el-select
                  v-model="item.she_says_tag"
                  class="block-input"
                  size="small"
                  value-key="id"
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in she_says_tag_list"
                    :key="item.id"
                    :value="item"
                    :label="item.name"
                  ></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="文案">
                <el-input
                  v-model="item.she_says_description"
                  type="textarea"
                  class="block-input"
                  :rows="2"
                ></el-input>
              </el-form-item>
              <el-form-item label="图片">
                <el-input
                  v-model="item.she_says_image_url"
                  class="input-img-url"
                  size="small"
                ></el-input>
                <upload
                  @change="
                    (file, fileList) => {
                      fileChange(
                        file,
                        fileList,
                        'she_says_image_url',
                        'she_says_image_url_list',
                        'image_url',
                        item
                      )
                    }
                  "
                  accept="image/png, image/jpeg"
                  :fileList="item.she_says_image_url_list"
                ></upload>
              </el-form-item>
              <el-form-item label="视频封面图片">
                <el-input
                  v-model="item.she_says_video_cover_url"
                  class="input-img-url"
                  size="small"
                ></el-input>
                <upload
                  @change="
                    (file, fileList) => {
                      fileChange(
                        file,
                        fileList,
                        'she_says_video_cover_url',
                        'she_says_video_cover_url_list',
                        'image_url',
                        item
                      )
                    }
                  "
                  accept="image/png, image/jpeg"
                  :fileList="item.she_says_video_cover_url_list"
                ></upload>
              </el-form-item>
              <el-form-item label="视频">
                <el-input
                  v-model="item.she_says_video_url"
                  class="input-img-url"
                  size="small"
                ></el-input>
                <upload
                  @change="
                    (file, fileList) => {
                      fileChange(
                        file,
                        fileList,
                        'she_says_video_url',
                        'she_says_video_url',
                        'video_url',
                        item
                      )
                    }
                  "
                  accept="video/*"
                  :showFileList="false"
                ></upload>
                <div
                  class="img-wrap"
                  style="display:inline-block"
                  v-if="item.she_says_video_url"
                >
                  <img
                    class="item-img video_cover_url"
                    src="../../../../images/placeholder.png"
                    alt=""
                  />
                  <div class="box-mask">
                    <i
                      class="el-icon-zoom-in"
                      @click="
                        preview(
                          {
                            video_url: item.she_says_video_url
                          },
                          false
                        )
                      "
                    ></i>
                    <i
                      class="el-icon-delete"
                      @click="item.she_says_video_url = ''"
                    ></i>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div id="share">
          <div>
            <span class="tag">分享</span>
            <el-divider></el-divider>
          </div>
          <el-form size="small" label-width="95px">
            <el-form-item label="能否分享RC小程序">
              <el-radio-group
                v-model="
                  skuInfo.sku_extension_info.share_and_recommend.can_share_rc
                "
              >
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="分享标题">
              <el-input
                v-model="
                  skuInfo.sku_extension_info.share_and_recommend.share_title
                "
              ></el-input>
            </el-form-item>
            <el-form-item label="分享话术（BC）">
              <el-select
                v-model="
                  skuInfo.sku_extension_info.share_and_recommend.share_words
                "
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
            <el-form-item>
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
            <el-form-item label="分享话术（女主人）">
              <el-select
                v-model="
                  skuInfo.sku_extension_info.share_and_recommend
                    .hostess_share_words
                "
                multiple
                size="small"
                class="block-input"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, i) in hostess_share_words"
                  :key="`${item}_${i}`"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="hostess_share_word_text"
                type="textarea"
                class="block-input"
                :rows="3"
              ></el-input>
              <div class="mt20">
                <el-button
                  type="primary"
                  size="small"
                  @click="createHostessShareWords"
                  >添加</el-button
                >
              </div>
            </el-form-item>

            <el-form-item label="促销海报图（1280*2272）">
              <upload
                @change="
                  (file, fileList) => {
                    fileChange(
                      file,
                      fileList,
                      'promotion_posters',
                      'promotion_posters'
                    )
                  }
                "
                accept="image/png, image/jpeg"
                :multiple="true"
                :showFileList="false"
              ></upload>
              <div class="draggable-div">
                <draggable
                  v-model="
                    skuInfo.sku_extension_info.share_and_recommend
                      .promotion_posters
                  "
                  @change="draggableChange"
                >
                  <div
                    v-for="(item, index) in skuInfo.sku_extension_info
                      .share_and_recommend.promotion_posters"
                    :key="item.id"
                    class="file-list"
                  >
                    <div class="file-item">
                      <div class="img-wrap">
                        <img class="item-img preview-img" :src="item" alt="" />
                      </div>
                    </div>
                    <div class="whispace file-name">{{ item }}</div>
                    <i
                      class="el-icon-delete del-item"
                      @click="
                        delItem(
                          index,
                          skuInfo.sku_extension_info.share_and_recommend
                            .promotion_posters
                        )
                      "
                    ></i>
                  </div>
                </draggable>
              </div>
            </el-form-item>

            <el-form-item label="分享图片（1000*1000）">
              <upload
                @change="
                  (file, fileList) => {
                    fileChange(
                      file,
                      fileList,
                      'share_poster_urls',
                      'share_poster_urls'
                    )
                  }
                "
                accept="image/png, image/jpeg"
                :multiple="true"
                :showFileList="false"
              ></upload>
              <div class="draggable-div">
                <draggable
                  v-model="
                    skuInfo.sku_extension_info.share_and_recommend
                      .share_poster_urls
                  "
                  @change="draggableChange"
                >
                  <div
                    v-for="(item, index) in skuInfo.sku_extension_info
                      .share_and_recommend.share_poster_urls"
                    :key="item.id"
                    class="file-list"
                  >
                    <div class="file-item">
                      <div class="img-wrap">
                        <img class="item-img preview-img" :src="item" alt="" />
                      </div>
                    </div>
                    <div class="whispace file-name">{{ item }}</div>
                    <i
                      class="el-icon-delete del-item"
                      @click="
                        delItem(
                          index,
                          skuInfo.sku_extension_info.share_and_recommend
                            .share_poster_urls
                        )
                      "
                    ></i>
                  </div>
                </draggable>
              </div>
            </el-form-item>
            <el-form-item label="分享视频（690*300）">
              <upload
                @change="
                  (file, fileList) => {
                    fileChange(
                      file,
                      fileList,
                      'download_image_urls',
                      'download_image_urls'
                    )
                  }
                "
                accept="image/png, image/jpeg"
                :multiple="true"
                :showFileList="false"
              ></upload>
              <div class="draggable-div">
                <draggable
                  v-model="
                    skuInfo.sku_extension_info.share_and_recommend
                      .download_image_urls
                  "
                  @change="draggableChange"
                >
                  <div
                    v-for="(item, index) in skuInfo.sku_extension_info
                      .share_and_recommend.download_image_urls"
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
                            @click="del(item, true)"
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
                              'download_image_urls',
                              'download_image_urls',
                              'image_url',
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
                              'download_image_urls',
                              'download_image_urls',
                              'video_url',
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
                      @click="
                        delItem(
                          index,
                          skuInfo.sku_extension_info.share_and_recommend
                            .download_image_urls
                        )
                      "
                    ></i>
                  </div>
                </draggable>
              </div>
            </el-form-item>
            <el-form-item label="分享封面（640*506）">
              <el-input
                v-model="
                  skuInfo.sku_extension_info.share_and_recommend.share_cover_url
                "
                class="input-img-url"
                size="small"
              ></el-input>
              <upload
                @change="
                  (file, fileList) => {
                    fileChange(
                      file,
                      fileList,
                      'share_cover_url',
                      'share_cover_url'
                    )
                  }
                "
                accept="image/png, image/jpeg"
                :fileList="share_cover_url"
              ></upload>
            </el-form-item>
          </el-form>
        </div>
        <div id="customize">
          <div>
            <span class="tag">自定义参数</span>
            <el-divider></el-divider>
          </div>
          <div>
            <el-form size="small" label-width="95px">
              <el-form-item
                v-for="item in skuInfo.sku_extension_info.custom_parameters"
                :label="item.name"
                :key="item.id"
              >
                <el-input
                  v-model="item.default_value"
                  v-if="item.type !== 3"
                ></el-input>
                <div v-else>
                  <el-input
                    v-model="item.default_value"
                    class="input-img-url"
                  ></el-input>
                  <upload
                    @change="
                      (file, fileList) => {
                        fileChange(
                          file,
                          fileList,
                          'default_value',
                          'imageList',
                          'image_url',
                          item
                        )
                      }
                    "
                    accept="image/png, image/jpeg"
                    :fileList="item.imageList"
                  ></upload>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="sidebar">
          <span
            :class="{ 'is-select': isSelect == '#pim' }"
            @click="goAnchor('#pim')"
            >pim信息</span
          >
          <el-divider style="margin:0;"></el-divider>
          <span
            :class="{ 'is-select': isSelect == '#base' }"
            @click="goAnchor('#base')"
            >基础信息</span
          >
          <el-divider style="margin:0;"></el-divider>
          <span
            :class="{ 'is-select': isSelect == '#marketing' }"
            @click="goAnchor('#marketing')"
            >营销配置</span
          >
          <el-divider style="margin:0;"></el-divider>
          <span
            :class="{ 'is-select': isSelect == '#productPictrue' }"
            @click="goAnchor('#productPictrue')"
            >产品图片</span
          >
          <el-divider style="margin:0;"></el-divider>
          <span
            :class="{ 'is-select': isSelect == '#sheSay' }"
            @click="goAnchor('#sheSay')"
            >TA说</span
          >
          <el-divider style="margin:0;"></el-divider>
          <span
            :class="{ 'is-select': isSelect == '#share' }"
            @click="goAnchor('#share')"
            >分享</span
          >
          <el-divider style="margin:0;"></el-divider>
          <span
            :class="{ 'is-select': isSelect == '#customize' }"
            @click="goAnchor('#customize')"
            >自定义参数</span
          >
        </div>
      </el-tab-pane>
      <el-tab-pane label="xml content" name="xml">
        <el-form size="small" label-width="120px">
          <el-form-item label="海淘报关价">
            <el-input-number
              size="small"
              v-model="skuInfo.sku_extension_info.xml_content.custom_price"
              style="width:177px"
              controls-position="right"
              :controls="false"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="image-version">
            <el-input
              v-model="skuInfo.sku_extension_info.xml_content.image_version"
            ></el-input>
          </el-form-item>
          <el-form-item label="推荐产品列表">
            <div class="product-list">
              <el-input
                v-model="code"
                type="textarea"
                class="block-input"
                autosize
                style="margin-right:10px;"
              ></el-input>
              <el-button @click="addProduct" type="primary">添加</el-button>
              <el-button type="danger" @click="deleteAllProduct">
                全部删除
              </el-button>
            </div>
            <draggable
              v-model="skuInfo.sku_extension_info.xml_content.related_products"
              style="margin-top:20px;"
              @change="changeProductSort"
            >
              <div
                v-for="row in skuInfo.sku_extension_info.xml_content
                  .related_products"
                :key="row.id"
                class="product-item"
              >
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
            <div
              v-if="
                !skuInfo.sku_extension_info.xml_content.related_products.length
              "
              class="no-products"
            >
              暂无数据
            </div>
          </el-form-item>
          <el-form-item label="xml-content">
            <el-input
              v-model="skuInfo.sku_extension_info.xml_content.extend_properies"
              type="textarea"
              autosize
              :rows="4"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div>
      <el-button size="small" type="primary" @click="save">保存</el-button>
      <el-button size="small" @click="cancel">取消</el-button>
    </div>
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
      title="复制"
      :visible.sync="copyDialog"
      width="500px"
      @closed="
        copyDialog = false
        copyInfo = null
      "
    >
      <el-form>
        <el-form-item label="复制自">
          <el-select
            v-model="copyInfo"
            filterable
            remote
            style="width:370px"
            size="small"
            placeholder="请输入货号或名称"
            :remote-method="querySearchAsync"
            value-key="sku_info_from_pim"
            :loading="loading"
          >
            <el-option
              v-for="item in searchProducts"
              :key="item.sku_info_from_pim.sku"
              :label="item.sku_info_from_pim.sku"
              :value="item"
            >
              <span style="float: left">{{ item.sku_info_from_pim.sku }}</span>
              <span style="float: right">{{
                item.sku_info_from_pim.name
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <div class="text-center">
          <el-button type="primary" size="small" @click="copyItem"
            >确定</el-button
          >
          <el-button
            size="small"
            @click=";(copyDialog = false), (copyInfo = null)"
            >取消</el-button
          >
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import Upload from '@/components/upload'
import uploadFolder from '@/components/uploadFolder'
import DraggableSelect from '@/components/dragSelect/index.vue'
import upload from '@/mixins/upload.js'
import { uploadToResource } from '@/api/index.js'
import {
  getProductInfoBySKU,
  updateProduct,
  getProducts
} from '@/api/product/products.js'
import { getAttachments } from '@/api/product/tags.js'
import { treeData2Arr, oneOf, clones } from '@/utility/index.js'
import storage from 'good-storage'
import draggable from 'vuedraggable'
export default {
  name: 'Detail',
  components: { Upload, uploadFolder, draggable, DraggableSelect },
  mixins: [upload],
  data() {
    return {
      code: '',
      isSelect: '#pim',
      activeName: 'info',
      isShowList: false,
      extend_properies: '',
      skuInfo: {
        sku_info_from_pim: {
          product_title: '',
          include_in_search: true,
          product_type: null,
          section_code: null,
          product_line: null,
          sku: '',
          name: '',
          retail_price: null,
          suggest_retail_price: null,
          redeem_point: null,
          child_products: []
        },
        sku_extension_info: {
          basic_info: {
            substitute_sku: '',
            english_name: '',
            volume: '',
            shade_group: '',
            rgb_color: '',
            rgb_color_name: '',
            delivery_method: '',
            market_price: '',
            sku_description: '',
            additional_info: '',
            import_tax_url: '',
            import_country_url: '',
            series: {},
            specification: {
              title: '',
              explanation: '',
              image_url: ''
            },
            service_description: {
              title: '',
              explanation: '',
              image_url: ''
            }
          },
          marketing_configuration: {
            sku_selling_points: '',
            marketing_tags: [],
            product_tags: [],
            recommend_tag: '',
            recommend_words: '',
            award_tags: [],
            key_tag: []
          },
          sku_images: {
            png_image_url: '',
            promotion_banner: '',
            list_image_url: {
              official_website_pc: [],
              official_website_mobile: [],
              app: [],
              applet: []
            },
            head_image_url: {
              official_website_pc: [],
              official_website_mobile: [],
              app: [],
              applet: []
            },
            detail_image_url: {
              official_website_pc: [],
              official_website_mobile: [],
              app: [],
              applet: []
            }
          },
          she_says: [
            {
              validDate: [],
              she_says_tag: {},
              she_says_description: '',
              she_says_image_url: '',
              she_says_video_url: '',
              she_says_video_cover_url: ''
            }
          ],
          share_and_recommend: {
            share_title: '',
            share_words: [],
            hostess_share_words: [],
            share_cover_url: '',
            promotion_posters: [],
            share_poster_urls: [],
            download_image_urls: []
          },
          custom_parameters: [],
          xml_content: {
            custom_price: null,
            related_products: [],
            extend_properies: '',
            image_version: null
          }
        }
      },
      share_words: [],
      hostess_share_words: [],
      share_word_text: '',
      hostess_share_word_text: '',
      key_word_tags: [],
      key_word_text: '',
      copyDialog: false,
      copyInfo: null,
      loading: false,
      series_list: [],
      searchProducts: [],
      marketing_tag_list: [],
      product_label_list: [],
      award_tag_list: [],
      imageList: [],
      she_says_tag_list: [],
      sku_service_image: [],
      service_description: [],
      specification: [],
      import_tax_url: [],
      import_country_url: [],
      png_image_url: [],
      promotion_banner: [],
      list_image_official_website_pc: [],
      list_image_official_website_mobile: [],
      list_image_app: [],
      head_image_official_website_pc: [],
      head_image_app: [],
      detail_image_official_website_pc: [],
      detail_image_app: [],
      list_image_applets: () => {
        return this.list_image_app
      },
      head_image_applets: () => {
        return this.head_image_app
      },
      head_image_official_website_mobile: () => {
        return this.head_image_app
      },
      detail_image_applets: () => {
        return this.detail_image_app
      },
      detail_image_official_website_mobile: () => {
        return this.detail_image_app
      },
      share_cover_url: [],
      promotion_posters: [],
      share_poster_urls: [],
      download_image_urls: [],
      she_says_image_url_list: [],
      she_says_video_cover_url_list: [],
      she_says_video_url: [],
      parameters: [],
      fileList: [],
      form: {},
      imageUrl: '',
      uploadType: 'url',
      previewDialog: false,
      isImage: true,
      previewUrl: ''
    }
  },
  async mounted() {
    let list = await this.getProductLabelList()
    if (list) {
      this.getSkuDetail(this.$route.query.sku, false)
    }
  },
  methods: {
    initDetail(res, isCopy) {
      console.log(res.result.sku_extension_info.basic_info.sku_description)
      // let sku_description =
      //   res.result.sku_extension_info.basic_info.sku_description
      // console.log(sku_description.split(/\n/g))
      let marketing_configuration =
          res.result.sku_extension_info.marketing_configuration,
        xml_content = res.result.sku_extension_info.xml_content
      res.result.sku_extension_info.marketing_configuration.award_tags = marketing_configuration.award_tags
        ? marketing_configuration.award_tags
        : []
      res.result.sku_extension_info.marketing_configuration.marketing_tags = marketing_configuration.marketing_tags
        ? marketing_configuration.marketing_tags
        : []
      res.result.sku_extension_info.marketing_configuration.product_tags = marketing_configuration.product_tags
        ? marketing_configuration.product_tags
        : []
      res.result.sku_extension_info.xml_content.related_products = xml_content.related_products
        ? xml_content.related_products
        : []
      let sku_images = res.result.sku_extension_info.sku_images,
        list_image = sku_images.list_image_url,
        head_image = sku_images.head_image_url,
        detail_image = sku_images.detail_image_url
      if (!list_image.official_website_pc) {
        res.result.sku_extension_info.sku_images.list_image_url[
          'official_website_pc'
        ] = []
      } else {
        res.result.sku_extension_info.sku_images.list_image_url[
          'official_website_pc'
        ] = list_image.official_website_pc.map(o => ({
          image_url: o.image_url ? o.image_url : '',
          video_cover_url: o.video_cover_url ? o.video_cover_url : '',
          video_url: o.video_url ? o.video_url : ''
        }))
      }
      if (!list_image.official_website_mobile) {
        res.result.sku_extension_info.sku_images.list_image_url[
          'official_website_mobile'
        ] = []
      } else {
        res.result.sku_extension_info.sku_images.list_image_url[
          'official_website_mobile'
        ] = list_image.official_website_mobile.map(o => ({
          image_url: o.image_url ? o.image_url : '',
          video_cover_url: o.video_cover_url ? o.video_cover_url : '',
          video_url: o.video_url ? o.video_url : ''
        }))
      }
      if (!list_image.app) {
        res.result.sku_extension_info.sku_images.list_image_url['app'] = []
      } else {
        res.result.sku_extension_info.sku_images.list_image_url[
          'app'
        ] = list_image.app.map(o => ({
          image_url: o.image_url ? o.image_url : '',
          video_cover_url: o.video_cover_url ? o.video_cover_url : '',
          video_url: o.video_url ? o.video_url : ''
        }))
      }
      if (!list_image.applet) {
        res.result.sku_extension_info.sku_images.list_image_url['applet'] = []
      } else {
        res.result.sku_extension_info.sku_images.list_image_url[
          'applet'
        ] = list_image.applet.map(o => ({
          image_url: o.image_url ? o.image_url : '',
          video_cover_url: o.video_cover_url ? o.video_cover_url : '',
          video_url: o.video_url ? o.video_url : ''
        }))
      }

      if (!head_image.official_website_pc) {
        res.result.sku_extension_info.sku_images.head_image_url[
          'official_website_pc'
        ] = []
      } else {
        res.result.sku_extension_info.sku_images.head_image_url[
          'official_website_pc'
        ] = head_image.official_website_pc.map(o => ({
          image_url: o.image_url ? o.image_url : '',
          video_cover_url: o.video_cover_url ? o.video_cover_url : '',
          video_url: o.video_url ? o.video_url : ''
        }))
      }
      if (!head_image.official_website_mobile) {
        res.result.sku_extension_info.sku_images.head_image_url[
          'official_website_mobile'
        ] = []
      } else {
        res.result.sku_extension_info.sku_images.head_image_url[
          'official_website_mobile'
        ] = head_image.official_website_mobile.map(o => ({
          image_url: o.image_url ? o.image_url : '',
          video_cover_url: o.video_cover_url ? o.video_cover_url : '',
          video_url: o.video_url ? o.video_url : ''
        }))
      }
      if (!head_image.app) {
        res.result.sku_extension_info.sku_images.head_image_url['app'] = []
      } else {
        res.result.sku_extension_info.sku_images.head_image_url[
          'app'
        ] = head_image.app.map(o => ({
          image_url: o.image_url ? o.image_url : '',
          video_cover_url: o.video_cover_url ? o.video_cover_url : '',
          video_url: o.video_url ? o.video_url : ''
        }))
      }
      if (!head_image.applet) {
        res.result.sku_extension_info.sku_images.head_image_url['applet'] = []
      } else {
        res.result.sku_extension_info.sku_images.head_image_url[
          'applet'
        ] = head_image.applet.map(o => ({
          image_url: o.image_url ? o.image_url : '',
          video_cover_url: o.video_cover_url ? o.video_cover_url : '',
          video_url: o.video_url ? o.video_url : ''
        }))
      }

      if (!detail_image.official_website_pc) {
        res.result.sku_extension_info.sku_images.detail_image_url[
          'official_website_pc'
        ] = []
      } else {
        res.result.sku_extension_info.sku_images.detail_image_url[
          'official_website_pc'
        ] = detail_image.official_website_pc.map(o => ({
          image_url: o.image_url ? o.image_url : '',
          video_cover_url: o.video_cover_url ? o.video_cover_url : '',
          video_url: o.video_url ? o.video_url : '',
          invisible_platform: o.invisible_platform ? o.invisible_platform : [],
          jump_target_url: o.jump_target_url ? o.jump_target_url : ''
        }))
      }
      if (!detail_image.official_website_mobile) {
        res.result.sku_extension_info.sku_images.detail_image_url[
          'official_website_mobile'
        ] = []
      } else {
        res.result.sku_extension_info.sku_images.detail_image_url[
          'official_website_mobile'
        ] = detail_image.official_website_mobile.map(o => ({
          image_url: o.image_url ? o.image_url : '',
          video_cover_url: o.video_cover_url ? o.video_cover_url : '',
          video_url: o.video_url ? o.video_url : ''
        }))
      }
      if (!detail_image.app) {
        res.result.sku_extension_info.sku_images.detail_image_url['app'] = []
      } else {
        res.result.sku_extension_info.sku_images.detail_image_url[
          'app'
        ] = detail_image.app.map(o => ({
          image_url: o.image_url ? o.image_url : '',
          video_cover_url: o.video_cover_url ? o.video_cover_url : '',
          video_url: o.video_url ? o.video_url : '',
          invisible_platform: o.invisible_platform ? o.invisible_platform : [],
          jump_target_url: o.jump_target_url ? o.jump_target_url : ''
        }))
      }
      if (!detail_image.applet) {
        res.result.sku_extension_info.sku_images.detail_image_url['applet'] = []
      } else {
        res.result.sku_extension_info.sku_images.detail_image_url[
          'applet'
        ] = detail_image.applet.map(o => ({
          image_url: o.image_url ? o.image_url : '',
          video_cover_url: o.video_cover_url ? o.video_cover_url : '',
          video_url: o.video_url ? o.video_url : ''
        }))
      }
      if (!res.result.sku_extension_info.she_says) {
        // res.result.sku_extension_info.she_says = [
        //   {
        //     she_says_tag: {},
        //     she_says_description: '',
        //     she_says_image_url: '',
        //     she_says_video_url: '',
        //     she_says_video_cover_url: '',
        //     she_says_image_url_list: [],
        //     she_says_video_cover_url_list: [],
        //     validDate: []
        //   }
        // ]
        res.result.sku_extension_info.she_says = []
      } else {
        res.result.sku_extension_info.she_says.forEach(o => {
          if (o.valid_period_start_date || o.valid_period_end_date) {
            o.validDate = [
              o.valid_period_start_date ? o.valid_period_start_date : null,
              o.valid_period_end_date ? o.valid_period_end_date : null
            ]
          } else {
            o.validDate = []
          }
          if (!o.she_says_description) {
            o.she_says_description = ''
          }
          if (!o.she_says_image_url) {
            o.she_says_image_url = ''
            o.she_says_image_url_list = []
          } else {
            o.she_says_image_url_list = [
              {
                name: o.she_says_image_url,
                url: o.she_says_image_url
              }
            ]
          }
          if (!o.she_says_video_cover_url) {
            o.she_says_video_cover_url = ''
            o.she_says_video_cover_url_list = []
          } else {
            o.she_says_video_cover_url_list = [
              {
                name: o.she_says_video_cover_url,
                url: o.she_says_video_cover_url
              }
            ]
          }
          if (!o.she_says_video_url) {
            o.she_says_video_url = ''
          }
        })
      }
      if (!res.result.sku_extension_info.custom_parameters) {
        res.result.sku_extension_info.custom_parameters = []
      } else {
        res.result.sku_extension_info.custom_parameters.forEach(o => {
          if (o.type === 3) {
            if (o.default_value) {
              o.imageList = [
                {
                  name: o.default_value,
                  url: o.default_value
                }
              ]
            } else {
              o.imageList = []
            }
          }
        })
      }
      if (res.result.sku_extension_info.basic_info.import_tax_url) {
        this.import_tax_url = [
          {
            name: res.result.sku_extension_info.basic_info.import_tax_url,
            url: res.result.sku_extension_info.basic_info.import_tax_url
          }
        ]
      } else {
        res.result.sku_extension_info.basic_info.import_tax_url = ''
      }
      if (res.result.sku_extension_info.basic_info.import_country_url) {
        this.import_country_url = [
          {
            name: res.result.sku_extension_info.basic_info.import_country_url,
            url: res.result.sku_extension_info.basic_info.import_country_url
          }
        ]
      } else {
        res.result.sku_extension_info.basic_info.import_country_url = ''
      }
      if (res.result.sku_extension_info.basic_info.specification.image_url) {
        this.specification = [
          {
            name:
              res.result.sku_extension_info.basic_info.specification.image_url,
            url:
              res.result.sku_extension_info.basic_info.specification.image_url
          }
        ]
      } else {
        res.result.sku_extension_info.basic_info.specification.image_url = ''
      }
      if (
        res.result.sku_extension_info.basic_info.service_description.image_url
      ) {
        this.service_description = [
          {
            name:
              res.result.sku_extension_info.basic_info.service_description
                .image_url,
            url:
              res.result.sku_extension_info.basic_info.service_description
                .image_url
          }
        ]
      } else {
        res.result.sku_extension_info.basic_info.service_description.image_url =
          ''
      }
      if (res.result.sku_extension_info.sku_images['png_image_url']) {
        this.png_image_url = [
          {
            name: res.result.sku_extension_info.sku_images['png_image_url'],
            url: res.result.sku_extension_info.sku_images['png_image_url']
          }
        ]
      } else {
        res.result.sku_extension_info.sku_images['png_image_url'] = ''
      }
      // promotion_banner
      if (res.result.sku_extension_info.sku_images['promotion_banner']) {
        this.promotion_banner = [
          {
            name: res.result.sku_extension_info.sku_images['promotion_banner'],
            url: res.result.sku_extension_info.sku_images['promotion_banner']
          }
        ]
      } else {
        res.result.sku_extension_info.sku_images['promotion_banner'] = ''
      }
      if (
        res.result.sku_extension_info.share_and_recommend['share_cover_url']
      ) {
        this.share_cover_url = [
          {
            name:
              res.result.sku_extension_info.share_and_recommend[
                'share_cover_url'
              ],
            url:
              res.result.sku_extension_info.share_and_recommend[
                'share_cover_url'
              ]
          }
        ]
      } else {
        res.result.sku_extension_info.share_and_recommend['share_cover_url'] =
          ''
        this.share_cover_url = []
      }
      if (
        res.result.sku_extension_info.share_and_recommend['share_poster_urls']
      ) {
        this.share_poster_urls = res.result.sku_extension_info.share_and_recommend[
          'share_poster_urls'
        ].map(o => ({
          name: o,
          url: o
        }))
      } else {
        res.result.sku_extension_info.share_and_recommend[
          'share_poster_urls'
        ] = []
        this.share_poster_urls = []
      }
      // promotion_posters
      if (
        res.result.sku_extension_info.share_and_recommend['promotion_posters']
      ) {
        this.promotion_posters = res.result.sku_extension_info.share_and_recommend[
          'promotion_posters'
        ].map(o => ({
          name: o,
          url: o
        }))
      } else {
        res.result.sku_extension_info.share_and_recommend[
          'promotion_posters'
        ] = []
        this.promotion_posters = []
      }
      // download_image_urls
      if (
        res.result.sku_extension_info.share_and_recommend['download_image_urls']
      ) {
        res.result.sku_extension_info.share_and_recommend[
          'download_image_urls'
        ] = res.result.sku_extension_info.share_and_recommend[
          'download_image_urls'
        ].map(o => ({
          image_url: o.image_url ? o.image_url : '',
          video_cover_url: o.video_cover_url ? o.video_cover_url : '',
          video_url: o.video_url ? o.video_url : ''
        }))
      } else {
        res.result.sku_extension_info.share_and_recommend[
          'download_image_urls'
        ] = []
      }
      if (!res.result.sku_extension_info.share_and_recommend['share_title']) {
        res.result.sku_extension_info.share_and_recommend['share_title'] = ''
      }
      if (!res.result.sku_extension_info.share_and_recommend['share_words']) {
        res.result.sku_extension_info.share_and_recommend['share_words'] = []
      } else {
        this.share_words = this.skuInfo.sku_extension_info.share_and_recommend.share_words
      }
      if (
        !res.result.sku_extension_info.share_and_recommend[
          'hostess_share_words'
        ]
      ) {
        res.result.sku_extension_info.share_and_recommend[
          'hostess_share_words'
        ] = []
      } else {
        this.hostess_share_words = this.skuInfo.sku_extension_info.share_and_recommend.hostess_share_words
      }

      // can_share_rc
      if (!res.result.sku_extension_info.share_and_recommend['can_share_rc']) {
        res.result.sku_extension_info.share_and_recommend[
          'can_share_rc'
        ] = false
      }
      this.skuInfo.sku_extension_info = res.result.sku_extension_info
      if (!isCopy) {
        this.skuInfo.sku_info_from_pim = res.result.sku_info_from_pim
      } else {
        this.copyDialog = false
        this.copyInfo = null
      }
      // 搜索关键字
      if (!res.result.sku_extension_info.marketing_configuration['key_tag']) {
        res.result.sku_extension_info.marketing_configuration['key_tag'] = []
        this.key_word_tags = []
      } else {
        this.key_word_tags = clones(
          res.result.sku_extension_info.marketing_configuration.key_tag
        )
      }
      this.share_words = res.result.sku_extension_info.share_and_recommend
        .share_words
        ? clones(res.result.sku_extension_info.share_and_recommend.share_words)
        : []
      this.hostess_share_words = res.result.sku_extension_info
        .share_and_recommend.hostess_share_words
        ? clones(
            res.result.sku_extension_info.share_and_recommend
              .hostess_share_words
          )
        : []
    },
    getSkuDetail(sku, isCopy) {
      getProductInfoBySKU(sku)
        .then(res => {
          this.initDetail(res, isCopy)
        })
        .catch(message => {
          this.$notify({
            message,
            type: 'error',
            duration: 3000
          })
        })
    },
    async getProductLabelList() {
      return new Promise((resolve, reject) => {
        getAttachments()
          .then(res => {
            let list = res.results.list
            this.marketing_tag_list = list
              .filter(o => o.type === 1)
              .map(o => ({ id: o.id, name: o.name, type: o.type }))
            this.product_label_list = list
              .filter(o => o.type === 2)
              .map(o => ({ id: o.id, name: o.name, type: o.type }))
            this.award_tag_list = list
              .filter(o => o.type === 4)
              .map(o => ({
                id: o.id,
                name: o.name,
                type: o.type,
                imge_url: o.url
              }))
            this.she_says_tag_list = list
              .filter(o => o.type === 3)
              .map(o => ({ id: o.id, name: o.name, type: o.type }))
            this.series_list = list
              .filter(o => o.type === 7)
              .map(o => ({ id: o.id, name: o.name, value: o.value }))
            resolve(true)
          })
          .catch(() => {
            reject(false)
          })
      })
    },
    newSheSays() {
      this.skuInfo.sku_extension_info.she_says.push({
        she_says_tag: {},
        she_says_description: '',
        she_says_image_url: '',
        she_says_video_url: '',
        she_says_video_cover_url: '',
        she_says_video_cover_url_list: [],
        she_says_image_url_list: []
      })
    },
    delSheSays(index) {
      this.skuInfo.sku_extension_info.she_says.splice(index, 1)
    },
    querySearchAsync(queryString) {
      console.log(queryString)
      if (!queryString) return
      let param = {
        is_return_sku_all_field: true
      }
      let reg = /^[0-9]*$/
      if (reg.test(queryString)) {
        param.skus = queryString
      } else {
        param.name = queryString
      }
      getProducts(param).then(res => {
        console.log(res.results.list)
        this.searchProducts = res.results.list
      })
    },
    copyItem() {
      if (this.copyInfo) {
        this.$confirm(`该操作将覆盖本页面信息，是否确定执行？`, 'Tips', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            console.log(this.copyInfo.sku_extension_info)
            this.initDetail({ result: this.copyInfo }, true)
          })
          .catch(() => {})
      }
    },
    fileChange(file, fileList, name, list, fileType, item) {
      // if (file && !checkImageSize(file, 1024 * 20)) {
      //   this.$notify.error({
      //     title: 'Error',
      //     message: `Please upload JPG, PNG, JPEG format pictures, size limit of less than 20M`,
      //     duration: 3000
      //   })
      //   return
      // }
      // 获取上传文件类型
      let isImage = file.raw.type.includes('image')
      this.handleUploadFile(file, fileList, name, list, url => {
        this.fileList = fileList
        let arr = []
        if (name.includes('&')) {
          arr = name.split('&')
        }
        switch (name) {
          case 'import_tax_url':
          case 'import_country_url':
            this.skuInfo.sku_extension_info.basic_info[name] = url
            break
          case 'specification':
          case 'service_description':
            this.skuInfo.sku_extension_info.basic_info[name].image_url = url
            break
          case 'png_image_url':
          case 'promotion_banner':
            this.skuInfo.sku_extension_info.sku_images[name] = url
            break
          // eslint-disable-next-line no-duplicate-case
          case 'list_image_url&official_website_pc':
          case 'list_image_url&official_website_mobile':
          case 'list_image_url&app':
          case 'head_image_url&official_website_pc':
          case 'head_image_url&app':
          case 'detail_image_url&official_website_pc':
          case 'detail_image_url&app':
            if (item) {
              item[fileType] = url
              if (fileType == 'video_url') {
                item.video_cover_url = item.imageUrl
              }
            } else {
              this.skuInfo.sku_extension_info.sku_images[arr[0]][arr[1]].push({
                image_url: url,
                video_url: '',
                video_cover_url: '',
                invisible_platform: [],
                jump_target_url: ''
              })
            }
            break
          case 'she_says_image_url':
          case 'default_value':
          case 'she_says_video_cover_url':
            console.log(list)
            item[name] = url
            if (url) {
              item[list] = [
                {
                  name: url,
                  url: url
                }
              ]
            }
            break
          case 'she_says_video_url':
            item[name] = url
            break
          case 'share_cover_url':
            this.skuInfo.sku_extension_info.share_and_recommend[name] = url
            break
          case 'download_image_urls':
            if (item) {
              item[fileType] = url
              if (fileType == 'video_url') {
                item.video_cover_url = item.imageUrl
              }
            } else {
              this.skuInfo.sku_extension_info.share_and_recommend.download_image_urls.push(
                {
                  image_url: url,
                  video_url: '',
                  video_cover_url: ''
                }
              )
            }
            break
          case 'share_poster_urls':
          case 'promotion_posters':
            if (url) {
              this.skuInfo.sku_extension_info.share_and_recommend[name].push(
                url
              )
            } else {
              // this[fileList] = fileList
              this.skuInfo.sku_extension_info.share_and_recommend[
                name
              ] = fileList.map(o => o.url)
            }
            break
        }
        if (url) {
          console.log(this[list])
          this.uploadImageToResource(
            file.name.substring(0, file.name.lastIndexOf('.')),
            url,
            isImage
          )
        }
      })
    },
    handleClick() {},
    copy() {
      this.copyDialog = true
    },
    goAnchor(selector) {
      this.isSelect = selector
      this.$el.querySelector(selector).scrollIntoView()
    },
    updateFileList(file) {
      console.log(file)
      if (!file.type) return
      let arr = []
      let sort = null
      if (file.name.includes('-')) {
        arr = file.name.split('.')[0].split('-')
        // 获取文件序号 -1:js 数组从0开始
        sort = Number(arr[2].replace(/[^0-9]/gi, '')) - 1
      }
      // 获取文件名 不包含后缀
      let name = file.name.includes('-') ? arr[0] : file.name.split('.')[0]
      // 获取上传文件类型
      let isImage = file.type.includes('image')
      this.handleUploadFolder(file, url => {
        switch (name) {
          case '产品png图片':
            if (!this.skuInfo.sku_extension_info.sku_images['png_image_url']) {
              this.skuInfo.sku_extension_info.sku_images['png_image_url'] = ''
            }
            this.skuInfo.sku_extension_info.sku_images['png_image_url'] = url
            this.png_image_url = [
              {
                name: url,
                url: url
              }
            ]
            break
          case '促销banner图':
            if (
              !this.skuInfo.sku_extension_info.sku_images['promotion_banner']
            ) {
              this.skuInfo.sku_extension_info.sku_images['promotion_banner'] =
                ''
            }
            this.skuInfo.sku_extension_info.sku_images['promotion_banner'] = url
            this.promotion_banner = [
              {
                name: url,
                url: url
              }
            ]
            break
          case '产品列表图片':
            switch (arr[1]) {
              case '官网PC端':
                console.log(this.skuInfo.sku_extension_info.sku_images)
                if (
                  this.skuInfo.sku_extension_info.sku_images['list_image_url'][
                    'official_website_pc'
                  ][sort]
                ) {
                  if (isImage) {
                    this.skuInfo.sku_extension_info.sku_images[
                      'list_image_url'
                    ]['official_website_pc'][sort].image_url = url
                  } else {
                    this.skuInfo.sku_extension_info.sku_images[
                      'list_image_url'
                    ]['official_website_pc'][sort].video_url = url
                  }
                } else {
                  if (isImage) {
                    this.skuInfo.sku_extension_info.sku_images[
                      'list_image_url'
                    ]['official_website_pc'].push({
                      image_url: url,
                      video_url: '',
                      video_cover_url: ''
                    })
                  } else {
                    this.skuInfo.sku_extension_info.sku_images[
                      'list_image_url'
                    ]['official_website_pc'].push({
                      image_url: '',
                      video_url: url,
                      video_cover_url: ''
                    })
                  }
                }
                break
              case '官网移动端':
                if (
                  this.skuInfo.sku_extension_info.sku_images['list_image_url'][
                    'official_website_mobile'
                  ][sort]
                ) {
                  if (isImage) {
                    this.skuInfo.sku_extension_info.sku_images[
                      'list_image_url'
                    ]['official_website_mobile'][sort].image_url = url
                  } else {
                    this.skuInfo.sku_extension_info.sku_images[
                      'list_image_url'
                    ]['official_website_mobile'][sort].video_url = url
                  }
                } else {
                  if (isImage) {
                    this.skuInfo.sku_extension_info.sku_images[
                      'list_image_url'
                    ]['official_website_mobile'].push({
                      image_url: url,
                      video_url: '',
                      video_cover_url: ''
                    })
                  } else {
                    this.skuInfo.sku_extension_info.sku_images[
                      'list_image_url'
                    ]['official_website_mobile'].push({
                      image_url: '',
                      video_url: url,
                      video_cover_url: ''
                    })
                  }
                }
                break
              case 'APP小程序':
                if (
                  this.skuInfo.sku_extension_info.sku_images['list_image_url'][
                    'app'
                  ][sort]
                ) {
                  if (isImage) {
                    this.skuInfo.sku_extension_info.sku_images[
                      'list_image_url'
                    ]['app'][sort].image_url = url
                  } else {
                    this.skuInfo.sku_extension_info.sku_images[
                      'list_image_url'
                    ]['app'][sort].video_url = url
                  }
                } else {
                  if (isImage) {
                    this.skuInfo.sku_extension_info.sku_images[
                      'list_image_url'
                    ]['app'].push({
                      image_url: url,
                      video_url: '',
                      video_cover_url: ''
                    })
                  } else {
                    this.skuInfo.sku_extension_info.sku_images[
                      'list_image_url'
                    ]['app'].push({
                      image_url: '',
                      video_url: url,
                      video_cover_url: ''
                    })
                  }
                }
                break
            }
            break
          case '产品头图':
            switch (arr[1]) {
              case '官网PC端':
                if (
                  this.skuInfo.sku_extension_info.sku_images['head_image_url'][
                    'official_website_pc'
                  ][sort]
                ) {
                  if (isImage) {
                    this.skuInfo.sku_extension_info.sku_images[
                      'head_image_url'
                    ]['official_website_pc'][sort].image_url = url
                  } else {
                    this.skuInfo.sku_extension_info.sku_images[
                      'head_image_url'
                    ]['official_website_pc'][sort].video_url = url
                  }
                } else {
                  if (isImage) {
                    this.skuInfo.sku_extension_info.sku_images[
                      'head_image_url'
                    ]['official_website_pc'].push({
                      image_url: url,
                      video_url: '',
                      video_cover_url: ''
                    })
                  } else {
                    this.skuInfo.sku_extension_info.sku_images[
                      'head_image_url'
                    ]['official_website_pc'].push({
                      image_url: '',
                      video_url: url,
                      video_cover_url: ''
                    })
                  }
                }
                break
              case 'APP小程序官网移动端':
                if (
                  this.skuInfo.sku_extension_info.sku_images['head_image_url'][
                    'app'
                  ][sort]
                ) {
                  if (isImage) {
                    this.skuInfo.sku_extension_info.sku_images[
                      'head_image_url'
                    ]['app'][sort].image_url = url
                  } else {
                    this.skuInfo.sku_extension_info.sku_images[
                      'head_image_url'
                    ]['app'][sort].video_url = url
                  }
                } else {
                  if (isImage) {
                    this.skuInfo.sku_extension_info.sku_images[
                      'head_image_url'
                    ]['app'].push({
                      image_url: url,
                      video_url: '',
                      video_cover_url: ''
                    })
                  } else {
                    this.skuInfo.sku_extension_info.sku_images[
                      'head_image_url'
                    ]['app'].push({
                      image_url: '',
                      video_url: url,
                      video_cover_url: ''
                    })
                  }
                }
                break
            }
            break
          case '产品详情':
            switch (arr[1]) {
              case '官网PC端':
                if (
                  this.skuInfo.sku_extension_info.sku_images[
                    'detail_image_url'
                  ]['official_website_pc'][sort]
                ) {
                  if (isImage) {
                    this.skuInfo.sku_extension_info.sku_images[
                      'detail_image_url'
                    ]['official_website_pc'][sort].image_url = url
                  } else {
                    this.skuInfo.sku_extension_info.sku_images[
                      'detail_image_url'
                    ]['official_website_pc'][sort].video_url = url
                  }
                } else {
                  if (isImage) {
                    this.skuInfo.sku_extension_info.sku_images[
                      'detail_image_url'
                    ]['official_website_pc'].push({
                      image_url: url,
                      video_url: '',
                      video_cover_url: '',
                      invisible_platform: [],
                      jump_target_url: ''
                    })
                  } else {
                    this.skuInfo.sku_extension_info.sku_images[
                      'detail_image_url'
                    ]['official_website_pc'].push({
                      image_url: '',
                      video_url: url,
                      video_cover_url: '',
                      invisible_platform: [],
                      jump_target_url: ''
                    })
                  }
                }
                break
              case 'APP小程序官网移动端':
                if (
                  this.skuInfo.sku_extension_info.sku_images[
                    'detail_image_url'
                  ]['app'][sort]
                ) {
                  if (isImage) {
                    this.skuInfo.sku_extension_info.sku_images[
                      'detail_image_url'
                    ]['app'][sort].image_url = url
                  } else {
                    this.skuInfo.sku_extension_info.sku_images[
                      'detail_image_url'
                    ]['app'][sort].video_url = url
                  }
                } else {
                  if (isImage) {
                    this.skuInfo.sku_extension_info.sku_images[
                      'detail_image_url'
                    ]['app'].push({
                      image_url: url,
                      video_url: '',
                      video_cover_url: '',
                      invisible_platform: [],
                      jump_target_url: ''
                    })
                  } else {
                    this.skuInfo.sku_extension_info.sku_images[
                      'detail_image_url'
                    ]['app'].push({
                      image_url: '',
                      video_url: url,
                      video_cover_url: '',
                      invisible_platform: [],
                      jump_target_url: ''
                    })
                  }
                }
                break
            }
            break
        }
        if (url) {
          this.uploadImageToResource(
            file.name.substring(0, file.name.lastIndexOf('.')),
            url,
            isImage
          )
        }
      })
    },
    uploadImageToResource(name, url, isImage) {
      let moduleId
      let menus = storage.get('menus')
      moduleId = treeData2Arr(menus, 'subMenus').filter(
        o => o.path === '/productManage/product'
      )[0].id
      let data = {
        name: name,
        moduleId: moduleId,
        url: url,
        resourceType: isImage ? 'Image' : 'Video',
        client: 'BackEnd'
      }
      uploadToResource(data)
    },
    draggableChange() {},
    preview(item, isImage) {
      this.isImage = isImage
      this.previewUrl = isImage ? item.image_url : item.video_url
      this.previewDialog = true
    },
    del(item, isImage) {
      if (isImage) {
        item.image_url = ''
      } else {
        item.video_url = ''
        item.video_cover_url = ''
      }
    },
    delItem(item, list) {
      list.splice(item, 1)
    },
    save() {
      let params = {
        sku_extension_info: this.skuInfo.sku_extension_info
      }
      params.sku_extension_info.she_says = params.sku_extension_info.she_says.map(
        o => {
          return {
            she_says_description: o.she_says_description,
            she_says_image_url: o.she_says_image_url,
            she_says_video_cover_url: o.she_says_video_cover_url,
            she_says_video_url: o.she_says_video_url,
            valid_period_start_date:
              o.validDate && o.validDate[0] ? o.validDate[0] : null,
            valid_period_end_date:
              o.validDate && o.validDate[1] ? o.validDate[1] : null
          }
        }
      )
      let vaild = true
      params.sku_extension_info.she_says.forEach(o => {
        if (
          !(
            o.she_says_description ||
            o.she_says_image_url ||
            o.she_says_video_cover_url ||
            o.she_says_video_url ||
            o.valid_period_start_date ||
            o.valid_period_end_date
          )
        ) {
          this.$notify({
            message: 'TA说不能为空卡片，请填写数据或清空卡片',
            type: 'error',
            duration: 3000
          })
          vaild = false
        }
      })
      params.sku_extension_info.sku_images.list_image_url.applet =
        params.sku_extension_info.sku_images.list_image_url.app

      params.sku_extension_info.sku_images.head_image_url.applet =
        params.sku_extension_info.sku_images.head_image_url.app
      params.sku_extension_info.sku_images.head_image_url.official_website_mobile =
        params.sku_extension_info.sku_images.head_image_url.app
      params.sku_extension_info.sku_images.detail_image_url.applet =
        params.sku_extension_info.sku_images.detail_image_url.app
      params.sku_extension_info.sku_images.detail_image_url.official_website_mobile =
        params.sku_extension_info.sku_images.detail_image_url.app
      if (vaild) {
        updateProduct(this.$route.query.sku, params).then(res => {
          if (res.code === 0) {
            this.$notify({
              message: '保存成功！',
              type: 'success',
              duration: 3000
            })
            // this.$router.back()
          } else {
            this.$notify({
              message: res.message || '更新失败',
              type: 'error',
              duration: 3000
            })
          }
        })
      }
    },
    createKeyWords() {
      if (!this.key_word_text) return
      if (oneOf(this.key_word_text, this.key_word_tags)) {
        this.$notify({
          message: '请勿添加重复内容',
          type: 'error',
          duration: 3000
        })
        return
      }
      this.key_word_tags.push(this.key_word_text)
      this.skuInfo.sku_extension_info.marketing_configuration.key_tag.push(
        this.key_word_text
      )
      this.key_word_text = ''
    },
    delKeyWordTag(index) {
      this.key_word_tags.splice(index, 1)
      this.skuInfo.sku_extension_info.marketing_configuration.key_tag.splice(
        index,
        1
      )
    },
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
      this.skuInfo.sku_extension_info.share_and_recommend.share_words.push(
        this.share_word_text
      )
      this.share_word_text = ''
    },
    createHostessShareWords() {
      if (!this.hostess_share_word_text) return
      if (oneOf(this.hostess_share_word_text, this.hostess_share_words)) {
        this.$notify({
          message: '请勿添加重复内容',
          type: 'error',
          duration: 3000
        })
        return
      }
      this.hostess_share_words.push(this.hostess_share_word_text)
      this.skuInfo.sku_extension_info.share_and_recommend.hostess_share_words.push(
        this.hostess_share_word_text
      )
      this.hostess_share_word_text = ''
    },
    cancel() {
      this.$router.back()
    },
    changeProductSort() {},
    // 删除分类下所有产品

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
              if (o === j.sku) {
                params.push({
                  sku: j.sku,
                  name: j.name
                })
              }
            })
          }
        })
        params = params.map((o, i) => ({
          sku: o.sku,
          name: o.name,
          sort: i + 1
        }))
        console.log(params)
        // 查询到的产品信息
        if (
          this.skuInfo.sku_extension_info.xml_content.related_products &&
          this.skuInfo.sku_extension_info.xml_content.related_products.length
        ) {
          this.skuInfo.sku_extension_info.xml_content.related_products.forEach(
            o => {
              if (
                !oneOf(
                  o.sku,
                  params.map(item => item.sku)
                )
              ) {
                params.push(o)
              }
            }
          )
        }
        this.skuInfo.sku_extension_info.xml_content.related_products = params
        this.code = ''
      })
    },
    deleteAllProduct() {
      this.skuInfo.sku_extension_info.xml_content.related_products = []
    },
    // 根据产品id删除分类下一个产品
    delProduct(row) {
      this.skuInfo.sku_extension_info.xml_content.related_products.splice(
        row,
        1
      )
    }
  }
}
</script>
<style lang="less" scoped>
.detail {
  position: relative;
  .header {
    position: absolute;
    right: 0;
    z-index: 11;
    display: flex;
    justify-content: flex-end;
    .add-btn {
      display: flex;
      /deep/.uploader-btn {
        border: none;
        margin-left: 20px;
        background: #409eff;
        color: #fff;
      }
    }
  }
  .el-divider--horizontal {
    margin: 10px 0;
  }
  .sidebar {
    position: fixed;
    right: 0;
    top: 30vh;
    z-index: 111;
    width: 100px;
    // border: 1px solid #ccc;
    background-color: #fff;
    border-radius: 5px 0 0 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    .el-divider--horizontal {
      margin: 0;
    }
    span {
      display: block;
      padding: 10px;
      color: #333;
      cursor: pointer;
    }
    .is-select {
      background-color: #2d8cf0;
      color: #fff;
    }
  }
  .picture-text-content {
    width: 800px;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 5px;
    margin-bottom: 20px;
    .icon-del {
      text-align: right;
      margin-bottom: 5px;
      .el-icon-delete {
        cursor: pointer;
      }
    }
    .picture-text {
      display: flex;
      margin-bottom: 10px;
      .label {
        display: inline-block;
        width: 60px;
        text-align: right;
        flex: 0 0 auto;
      }
      .input-img-url {
        left: 155px;
      }
    }
  }
  .draggable-div {
    width: 600px;
    .file-list {
      display: flex;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 8px;
      align-items: center;
      position: relative;
      margin-bottom: 10px;
      .file-item {
        margin-right: 20px;
      }
      .file-name {
        width: 450px;
        &:hover {
          color: #409eff;
        }
      }
      .del-item {
        position: absolute;
        right: 5px;
        top: 5px;
        cursor: pointer;
      }
    }
  }
  .special-draggable-div {
    width: 100%;
    .file-list {
      align-items: flex-end;
    }
    /deep/ .el-form-item {
      margin: 0;
    }
    /deep/ .el-checkbox {
      margin-right: 10px;
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
  .input-img-url {
    position: absolute;
    left: 90px;
    width: 510px !important;
  }
  .block-input {
    width: 600px !important;
  }
  .el-form-item__content {
    position: relative;
  }
  .tag {
    font-weight: bold;
    color: #409eff;
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

  .no-products {
    margin-top: 20px;
    border: 1px solid #dcdfe6;
    text-align: center;
    line-height: 40px;
  }
  /deep/.el-select,
  .el-input {
    width: 177px;
  }
  .block {
    width: 100%;
  }
  .g-upload {
    max-width: 600px;
  }
  .show-btn {
    position: absolute;
    right: 0;
    top: 5px;
  }
  .hidden-body {
    /deep/.el-table__body-wrapper {
      height: 0;
    }
  }
  .product-pictrue-header {
    display: flex;
    justify-content: space-between;
    .handle-btn {
      display: flex;
    }
  }
}
.example-popover {
  line-height: 24px;
  height: 500px !important;
  .header {
    font-weight: bold;
    color: #409eff;
  }
}

.product-list {
  display: flex;
  align-items: flex-start;
}

.key-word-tag {
  margin-right: 10px;
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
