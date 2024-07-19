<template>
  <div class="expose-content">
    <el-dialog
      title="编辑露出内容"
      :visible.sync="editDialog"
      width="50%"
      :before-close="cancel"
    >
      <div style="width: 600px">
        <el-form
          ref="form"
          :model="editInfo"
          :rules="rules"
          label-width="150px"
        >
          <el-form-item label="类型" prop="resource_type">
            <el-radio-group
              @change="changeType"
              v-model="editInfo.resource_type"
            >
              <el-radio label="PRODUCT">产品</el-radio>
              <el-radio label="PROMITION">促销</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            ref="resourceId"
            :label="editInfo.resource_type === 'PRODUCT' ? '产品ID' : '促销ID'"
            prop="resource_id"
          >
            <el-input
              @blur="changeResourceId"
              v-model="editInfo.resource_id"
            ></el-input>
          </el-form-item>
          <el-form-item
            ref="resourceName"
            :label="
              editInfo.resource_type === 'PRODUCT' ? '产品名称' : '促销名称'
            "
            prop="resource_name"
          >
            <el-input
              @blur="changeResourceName"
              v-model="editInfo.resource_name"
            ></el-input>
          </el-form-item>
          <el-form-item label="海报图片" ref="uploadImg" prop="poster_url">
            <upload
              @change="uploadPicture"
              accept="image/png, image/jpeg"
            ></upload>
            <el-image
              v-if="editInfo.poster_url"
              style="width: 100px; height: 100px"
              :src="editInfo.poster_url"
              :preview-src-list="[editInfo.poster_url]"
            ></el-image>
            <!--          <el-button type="primary" size="small">上传</el-button>-->
          </el-form-item>
          <el-form-item label="分享话术" prop="care_description">
            <el-input
              type="textarea"
              v-model="editInfo.care_description"
            ></el-input>
          </el-form-item>
          <el-form-item label="占比" prop="weight">
            <el-input
              type="text"
              style="width: 80px"
              @change="weightChange"
              oninput="value=value.replace(/[^\d]/g,'')"
              v-model="editInfo.weight"
            ></el-input
            ><span style="margin-left: 10px">%</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('form')" size="small"
              >保存</el-button
            >
            <el-button size="small" @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import upload from '../../mixins/upload.js'
export default {
  name: '',
  mixins: [upload],
  props: {
    editDialog: {
      type: Boolean,
      required: true
    },
    editInfo: {
      type: Object,
      required: true
    },
    editFlag: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      form: {
        poster_url: ''
      },
      rules: {
        resource_type: [
          { required: true, message: '请选择产品类型', trigger: 'change' }
        ],
        resource_id: [
          { required: true, message: `请输入ID`, trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        resource_name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        poster_url: [
          { required: true, message: '请上传海报图片', trigger: 'change' }
        ],
        care_description: [
          { required: true, message: '请输入分享话术', trigger: 'blur' }
        ],
        weight: [{ required: true, message: '请输入占比', trigger: 'blur' }]
      },
      picFileList: [],
      product: {
        id: '',
        name: ''
      },
      promotion: {
        id: '',
        name: ''
      }
    }
  },
  mounted() {
    // if(this.editInfo.resource_type){
    //   this.form = {...this.editInfo}
    //   console.log('form: ',this.form)
    // }
  },
  methods: {
    changeType() {
      console.log(this.editInfo.resource_type)
      if (this.editInfo.resource_type === 'PRODUCT') {
        // this.product.id = this.editInfo.resource_id ? this.editInfo.resource_id : ''
        // this.product.name = this.editInfo.resource_name ? this.editInfo.resource_name : ''
        this.editInfo.resource_id = this.product.id
        this.editInfo.resource_name = this.product.name
      } else {
        this.editInfo.resource_id = this.promotion.id
        this.editInfo.resource_name = this.promotion.name
        // this.promotion.id = this.editInfo.resource_id ? this.editInfo.resource_id : ''
        // this.promotion.name = this.editInfo.resource_name ? this.editInfo.resource_name : ''
      }
      this.$refs['resourceId'].clearValidate()
      this.$refs['resourceName'].clearValidate()
    },
    changeResourceName() {
      if (this.editInfo.resource_type === 'PRODUCT') {
        this.product.name = this.editInfo.resource_name
          ? this.editInfo.resource_name
          : ''
      } else {
        this.promotion.name = this.editInfo.resource_name
          ? this.editInfo.resource_name
          : ''
      }
    },
    changeResourceId() {
      if (this.editInfo.resource_type === 'PRODUCT') {
        this.product.id = this.editInfo.resource_id
          ? this.editInfo.resource_id
          : ''
      } else {
        this.promotion.id = this.editInfo.resource_id
          ? this.editInfo.resource_id
          : ''
      }
    },
    weightChange(event) {
      console.log(event)
      this.editInfo.weight = event
    },
    uploadPicture(file, fileList) {
      this.form.name = file.name
      this.handleUpload(file, fileList, 'poster_url', 'picFileList', () => {
        this.editInfo.poster_url = this.form.poster_url
        console.log(this.editInfo)
        this.$refs['uploadImg'].clearValidate()
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        console.log(this.editInfo)
        if (valid) {
          this.$emit('editExposeContent', {
            editInfo: this.editInfo,
            editFlag: this.editFlag
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancel() {
      this.$emit('editExposeContent')
    }
  }
}
</script>

<style scoped lang="less"></style>
