<template>
  <div class="product-list">
    <el-table :data="categories" border ref="table" size="small" row-key="id">
      <el-table-column label="排序" align="center" width="100">
        <template slot-scope="{ row }">
          <el-input v-model="row.sort" size="small"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="icon" width="60" align="center">
        <template slot-scope="{ row }">
          <avatar-upload
            @change="
              (file, filelist) => {
                fileChange(file, fileList, row)
              }
            "
            accept="image/png, image/jpeg"
            :imageUrl="row.iconUrl"
          ></avatar-upload>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="{ row }">
          <el-input v-model="row.categoryName" size="small"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="跳转地址" align="center">
        <template slot-scope="{ row }">
          <el-input v-model="row.targetUrl" size="small"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" width="80">
        <template slot="header">
          <el-button type="primary" size="mini" @click="add">添加</el-button>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="delAction(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="handle-btn">
      <el-button type="primary" size="small" @click="submit">submit</el-button>
      <el-button type="primary" size="small" @click="cancel">cancel</el-button>
    </div>
  </div>
</template>

<script>
import avatarUpload from '@/components/avatarUpload'
import upload from '@/mixins/upload.js'
import { getHomeSetting, updateHomeSetting } from '@/api/library/homeSetting.js'
import { formatDate, checkImageSize } from '@/utility/index.js'
// import Http from '@/api/http'
export default {
  components: {
    avatarUpload
  },
  mixins: [upload],
  data() {
    return {
      dialogTitle: '添加',
      form: {},
      fileList: [],
      dialogFormVisible: false,
      rules: {},
      categories: [
        {
          categoryName: '',
          iconUrl: '',
          fileList: [],
          targetUrl: '',
          sortIndex: 1
        }
      ],
      tableData: {
        header: [
          {
            tableId: 'id',
            tableName: 'ID'
          },
          {
            tableId: 'name',
            tableName: '标签名'
          },
          {
            tableId: 'type',
            tableName: '标签类型',
            formatter: row => {
              switch (row.type) {
                case 1:
                  return '营销标签'
                case 2:
                  return '产品标签'
                case 3:
                  return 'TA说标签'
                case 6:
                  return '目录标签'
              }
            }
          },
          {
            tableId: 'updater',
            tableName: '操作人',
            formatter: row => {
              return row.updated_by ? row.updated_by : row.created_by
            }
          },
          {
            tableId: 'updaterTime',
            tableName: '操作时间',
            formatter: row => {
              return row.updated_time
                ? formatDate(new Date(row.updated_time))
                : formatDate(new Date(row.created_time))
            }
          }
        ],
        data: [],
        pageData: {
          pageSize: 20,
          totalCount: 0
        }
      },
      filters: {
        page_size: 20,
        page_num: 1
      }
    }
  },
  created() {
    getHomeSetting().then(res => {
      console.log(res)
      if (res.categories) {
        res.categories.forEach(o => {
          if (o.iconUrl) {
            o.fileList = [
              {
                name: o.iconUrl,
                url: o.iconUrl
              }
            ]
          }
        })
      }
      this.categories = res.categories
    })
  },
  mounted() {},
  methods: {
    fileChange(file, fileList, item) {
      if (file && !checkImageSize(file, 1024)) {
        this.$notify.error({
          title: 'Error',
          message: `Please upload JPG, PNG, JPEG format pictures, size limit of less than 1024KB`,
          duration: 3000
        })
        return
      }
      this.customUploadObjectKey(
        {
          file: file,
          fileList: fileList,
          fileUrl: 'iconUrl',
          fileArray: 'fileList',
          objectKey: 'LibraryResource'
        },
        url => {
          if (url) {
            item.iconUrl = url
            // this.uploadImageToResource(
            //   file.name.substring(0, file.name.lastIndexOf('.')),
            //   url
            // )
          }
        }
      )
    },
    changeSort() {},
    add() {
      this.categories.push({
        categoryName: '',
        iconUrl: '',
        fileList: [],
        targetUrl: ''
      })
    },
    cancel() {
      this.$router.back()
    },
    submit() {
      let date = this.categories.map((o, i) => {
        return {
          categoryName: o.categoryName,
          iconUrl: o.iconUrl,
          targetUrl: o.targetUrl,
          sort: i
        }
      })
      updateHomeSetting(date).then(res => {
        console.log(res)
      })
    },
    delAction(index) {
      this.categories.splice(index, 1)
    }
  }
}
</script>
<style lang="less">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.avatar {
  width: 40px;
  height: 40px;
  display: block;
}

.handle-btn {
  margin-top: 20px;
}
</style>
