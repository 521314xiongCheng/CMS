<template>
  <div class="offline-activity">
    <el-form
      size="small"
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="专题名称" prop="title">
        <el-input class="block-input" v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="专题内头图" prop="coverImageUrl">
        <div>
          <el-input
            v-model="form.coverImageUrl"
            class="input-img-url"
            size="small"
          ></el-input>
          <el-button size="mini" type="primary" @click="uploadDialog = true"
            >上传</el-button
          >
        </div>
        <div class="file-item" v-if="form.coverImageUrl">
          <div class="img-wrap">
            <el-image
              class="item-img"
              :src="form.coverImageUrl"
              fit="cover"
            ></el-image>
            <label class="whispace img-label">{{ form.coverImageUrl }}</label>
          </div>
          <label class="item-status-label">
            <i class="el-icon-upload-success el-icon-check"></i>
            <i class="el-icon-close del-item" @click="delItem"></i>
          </label>
        </div>
        <p>
          *尺寸为750*320，大小不超过300kb
        </p>
      </el-form-item>
      <el-form-item label="专题描述">
        <tinymce v-model="form.description"></tinymce>
      </el-form-item>

      <el-form-item label=" ">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="submit('form')">确定</el-button>
      </el-form-item>
    </el-form>
    <upload-and-select-in-resource
      :uploadDialog="uploadDialog"
      :fileSize="{ size: 300 }"
      @uploadFile="uploadFile"
      @selectResource="selectResource"
      @closeUploadDialog="uploadDialog = false"
    ></upload-and-select-in-resource>
  </div>
</template>
<script>
import uploadAndSelectInResource from '@/components/selectInResources/uploadAndSelectInResource.vue'
import tinymce from '@/components/tinymce/index'
import upload from '@/mixins/upload.js'
import storage from 'good-storage'
import { treeData2Arr } from '@/utility'
import { uploadToResource } from '@/api/index.js'
import { addTopic, updateTopic } from '@/api/library/topic.js'
import { clones } from '../../../utility'
export default {
  components: {
    tinymce,
    uploadAndSelectInResource
  },
  mixins: [upload],
  data() {
    return {
      uploadDialog: false,
      activeName: 'info',
      form: {
        title: '',
        coverImageUrl: '',
        description: ''
      },
      rules: {
        title: [{ required: true, message: '必填项', trigger: 'blur' }],
        coverImageUrl: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      fileList: []
    }
  },
  created() {
    if (this.$route.query.id) {
      let topicInfo = storage.get('topicInfo')
      this.form = clones(topicInfo)
    }
  },
  methods: {
    uploadImageToResource(name, url, property) {
      let moduleId
      let menus = storage.get('menus')
      moduleId = treeData2Arr(menus, 'subMenus').filter(
        o => o.path === '/library/topic'
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
    uploadFile(data) {
      this.uploadDialog = false
      this.form.coverImageUrl = data.url
      this.uploadImageToResource(data.name, data.url, data.fileInfo)
    },
    selectResource(data) {
      this.uploadDialog = false
      this.form.coverImageUrl = data.url
    },
    delItem() {
      this.form.coverImageUrl = ''
    },
    handleCancel() {
      this.$router.back()
    },
    submit(form) {
      this.$refs[form].validate(async valid => {
        if (valid) {
          let data = {
            title: this.form.title,
            coverImageUrl: this.form.coverImageUrl,
            description: this.form.description
          }
          console.log(data)
          if (this.$route.query.id) {
            updateTopic(this.form.id, data).then(res => {
              console.log(res)
              this.$router.back()
            })
          } else {
            addTopic(data).then(res => {
              console.log(res)
              this.$router.back()
            })
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
.block-input {
  width: 600px;
}

.input-img-url {
  position: absolute;
  left: 90px;
  width: 510px !important;
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

.video_cover_url {
  height: 70px;
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
#tinymceTextarea {
  width: 500px;
}

.file-item {
  border-radius: 8px;
  border: 1px solid #ccc;
  padding: 10px;
  position: relative;
  overflow: hidden;
  margin-top: 10px;
  width: 600px;
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
/deep/.preview-dialog {
  background-color: #f5f4f5;
  width: 400px !important;
  .el-drawer__body {
    overflow-y: auto;
    .preview-detail {
      padding: 24px/2;
      margin: 0 auto;
      width: 702px/2;
      box-sizing: content-box;
      background-color: #fff;
      .title {
        height: 44px/2;
        font-size: 44px/2;
        font-weight: 500;
        color: rgba(48, 49, 51, 1);
        line-height: 44px/2;
        margin-bottom: 25px/2;
      }
      .subtitle {
        display: flex;
        justify-content: space-between;
        height: 24px/2;
        font-size: 24px/2;
        font-weight: 500;
        color: rgba(144, 147, 153, 1);
        line-height: 24px/2;
        margin-bottom: 50px/2;
      }
      .introduce {
        display: flex;
        align-items: center;
        height: 32px/2;
        font-size: 32px/2;
        font-weight: 500;
        color: rgba(48, 49, 51, 1);
        line-height: 32px/2;
        margin-bottom: 26px/2;
        .introduce-icon {
          width: 32px/2;
          height: 36px/2;
          margin-right: 13px/2;
        }
      }
      .content {
        font-size: 32px/2;
        font-weight: 500;
        color: rgba(96, 98, 102, 1);
        line-height: 48px/2;
        img {
          max-width: 100%;
          height: auto;
        }
      }
      .resource-list {
        margin-top: 50px/2;
        .list-item {
          background: rgba(249, 249, 251, 1);
          border-radius: 14px/2;
          padding: 40px/2 30px/2 40px/2 12px/2;
          .list-item-div {
            display: flex;
            align-items: flex-start;
            font-size: 32px/2;
            font-weight: 500;
            color: rgba(48, 49, 51, 1);
            line-height: 46px/2;
            margin-bottom: 30px/2;
            img {
              width: 92px/2;
              height: 92px/2;
            }
          }
          .item-btn-div {
            display: flex;
            justify-content: flex-end;
            font-size: 24px/2;
            font-weight: 500;
            color: rgba(242, 104, 153, 1);
            line-height: 60px/2;
            .item-btn {
              width: 120px/2;
              text-align: center;
              height: 60px/2;
              border-radius: 10px/2;
              border: 2px/2 solid rgba(242, 104, 153, 1);
              background-color: #fff;
              margin-left: 20px/2;
            }
            .copy {
              width: 180px/2;
              height: 60px/2;
              background: rgba(242, 104, 153, 1);
              box-shadow: 0px 4px/2 12px/2 0px rgba(255, 134, 134, 0.3);
              border-radius: 10px/2;
              color: #fff;
            }
          }
        }
      }
      .forword {
        width: 630px/2;
        height: 90px/2;
        margin: 50px/2 0 20px/2 30px/2;
        background: rgba(242, 104, 153, 1);
        box-shadow: 0px 4px/2 12px/2 0px rgba(255, 134, 134, 0.3);
        border-radius: 10px/2;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px/2;
        color: #fff;
        .icon {
          width: 32px/2;
          height: 32px/2;
          margin-right: 20px/2;
        }
      }
    }
  }
}
.g-upload {
  max-width: 600px;
}
</style>
