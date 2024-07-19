<template>
  <div class="edit">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="月份" prop="month">
        <el-date-picker
          style="width: 350px"
          v-model="form.month"
          type="month"
          @change="selectedMonth"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="选择月"
        >
        </el-date-picker>

        <!--            <el-input v-model="form.name"></el-input>-->
      </el-form-item>
      <el-form-item label="开始日期" prop="display_start_time">
        <el-date-picker
          :picker-options="startEndDate"
          @change="selectSearchDate"
          :disabled="!form.month"
          :default-value="defaultTime"
          v-model="date"
          style="width: 350px"
          type="daterange"
          range-separator="至"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker
        ><span style="color: #666;margin-left: 15px;"
          >默认00:00:00 -- 23:59:59</span
        >
      </el-form-item>
      <el-form-item label="护肤气象指数" prop="meteorological_index">
        <div>
          <el-select
            :disabled="!form.month"
            v-model="form.meteorological_index"
            placeholder="请选择护肤气象指数"
            style="width: 350px"
          >
            <el-option
              v-for="val in weatherIndex"
              :key="val"
              :label="val"
              :value="val"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="露出内容" prop="meteorological_index_configs">
        <el-button type="primary" @click="editAction()" size="small"
          >新增</el-button
        >
        <div class="edit-table">
          <el-table
            :data="form.meteorological_index_configs"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="resource_type"
              label="类型"
              align="center"
              width="100"
            >
              <template slot-scope="scope">
                <span>{{
                  scope.row.resource_type === 'PRODUCT' ? '产品' : '促销'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="resource_name"
              label="产品"
              align="center"
              width="160"
            ></el-table-column>
            <el-table-column
              prop="resource_id"
              label="ID"
              align="center"
              width="160"
            ></el-table-column>
            <el-table-column
              prop="care_description"
              label="分享话术"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="weight"
              label="占比"
              align="center"
              width="160"
            ></el-table-column>
            <el-table-column label="操作" align="center" width="180">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="editAction(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteAction(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')" size="small"
          >保存</el-button
        >
        <el-button size="small" @click="back">取消</el-button>
      </el-form-item>
    </el-form>

    <expose-content
      :editDialog="editDialog"
      :editFlag="editFlag"
      :editInfo="editInfo"
      @editExposeContent="editExposeContent"
    ></expose-content>
  </div>
</template>

<script>
import {
  getExposeContent,
  getWeatherIndex,
  editWeatherIndex,
  addWeatherIndex
} from '@/api/xxxxxxx/weather.js'
import ExposeContent from '../../../components/xxxxxxx/weatherExposeContent'
// import utils from '../../../utils/utils'
export default {
  name: 'xxxxxxx-weather-edit',
  components: { ExposeContent },
  data() {
    return {
      startEndDate: this.processDate(),
      form: {
        month: '',
        display_start_time: '',
        display_end_time: '',
        meteorological_index: '',
        meteorological_index_configs: []
      },
      date: [],
      rules: {
        month: [{ required: true, message: '请选择月份', trigger: 'change' }],
        display_start_time: [
          { required: true, message: '请选择日期', trigger: 'change' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        meteorological_index: [
          { required: true, message: '请选择护肤指数', trigger: 'change' }
        ],
        meteorological_index_configs: [
          { required: true, message: '请添加露出内容', trigger: 'change' }
        ]
      },
      weatherIndex: [],
      editDialog: false,
      editInfo: {
        resource_type: 'PRODUCT',
        resource_name: '',
        poster_url: '',
        care_description: '',
        weight: '',
        resource_id: ''
      },
      month: '',
      editFlag: 'NEW',
      reference_id: '',
      year: '',
      defaultTime: ''
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.getExposeContent(this.$route.query.id)
    }
  },
  methods: {
    editAction(row) {
      if (row) {
        this.editFlag = 'EDIT'
        this.editInfo = { ...row }
      } else {
        this.editFlag = 'NEW'
        this.initForm()
      }
      this.editDialog = true
    },
    processDate() {
      let self = this
      return {
        disabledDate(time) {
          return (
            time.getTime() >= new Date(self.year, self.month) ||
            time.getTime() < new Date(self.year, self.month - 1)
          )
        }
      }
    },
    initForm() {
      this.editInfo = {
        resource_type: 'PRODUCT',
        resource_name: '',
        poster_url: '',
        care_description: '',
        weight: '',
        resource_id: ''
      }
    },
    deleteAction(row) {
      this.form.meteorological_index_configs.forEach((item, index) => {
        if (item.resource_id === row.resource_id) {
          this.form.meteorological_index_configs.splice(index, 1)
        }
      })
    },
    editExposeContent(data) {
      console.log(data)
      if (data) {
        if (data.editFlag === 'NEW') {
          if (this.form.meteorological_index_configs.length) {
            let item = ''
            // console.log('d=========>', data)
            item = this.form.meteorological_index_configs.filter(function(i) {
              //questionId的话，就删除一个该元素然后新增
              return i.resource_id === data.editInfo.resource_id
            })
            if (item.length) {
              this.$message.warning('该商品已经存在！')
            } else {
              this.form.meteorological_index_configs.push(data.editInfo)
              this.editDialog = false
              // this.initForm()
            }
          } else {
            this.form.meteorological_index_configs.push(data.editInfo)
            this.editDialog = false
            // this.initForm()
          }
        } else {
          this.form.meteorological_index_configs.forEach((item, index) => {
            if (item.id === data.editInfo.id) {
              this.form.meteorological_index_configs.splice(
                index,
                1,
                data.editInfo
              )
            }
          })
          this.editDialog = false
        }
      } else {
        this.editDialog = false
      }
    },
    getExposeContent(id) {
      getExposeContent(id).then(res => {
        console.log(res)
        let data = JSON.parse(sessionStorage.getItem('weatherEditRow'))
        console.log(data)
        let {
          month,
          meteorological_index,
          display_start_time,
          display_end_time,
          id
        } = data
        this.selectedMonth(month)

        this.form.month = month
        this.form.meteorological_index = meteorological_index
        this.form.display_start_time = display_start_time
        this.form.display_end_time = display_end_time

        this.reference_id = id
        this.date = [data.startDate, data.endDate]

        for (let item of res.results.list) {
          this.form.meteorological_index_configs.push({
            weight: item.weight,
            resource_name: item.resource_name,
            resource_id: item.resource_id,
            resource_type: item.resource_type,
            poster_url: item.poster_url,
            care_description: item.care_description,
            id: item.id
          })
        }
        console.log(this.form)
      })
    },
    selectedMonth(date) {
      let arr = []
      if (date) {
        arr = date.split('-')
        this.year = arr[0]
        if (arr[1].slice(0, 1).indexOf('0') != -1) {
          this.month = arr[1].slice(1)
        } else {
          this.month = arr[1]
        }
        this.getWeatherIndex()
        this.defaultTime = new Date(this.form.month + '-01')
      } else {
        this.month = ''
        this.year = ''
      }
      this.date = []
      this.form.meteorological_index = ''
      this.form.display_start_time = ''
      this.form.display_end_time = ''
      console.log(this.form)
    },
    getWeatherIndex() {
      getWeatherIndex({ month: this.month }).then(res => {
        this.weatherIndex = { ...res.results.list }
      })
    },

    back() {
      this.$router.push({ name: 'xxxxxxx-weather-index' })
    },
    edit() {
      editWeatherIndex(this.form, this.reference_id).then(res => {
        console.log('edit===========>', res)
        this.$message('成功！')
        setTimeout(() => {
          this.back()
        }, 1000)
      })
    },
    add() {
      addWeatherIndex(this.form).then(res => {
        console.log('add===========>', res)
        this.$message('成功！')
        setTimeout(() => {
          this.back()
        }, 1000)
      })
    },
    selectSearchDate(date) {
      if (date) {
        this.form.display_start_time = new Date(date[0] + ' 00:00:00').getTime()
        this.form.display_end_time = new Date(date[1] + ' 23:59:59').getTime()
      } else {
        this.form.display_start_time = ''
        this.form.display_end_time = ''
        this.defaultTime = new Date(this.form.month + '-01')
        // this.date = new Date(this.form.month+'-01')
      }
      console.log(this.form)
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let num = 0
          for (let item of this.form.meteorological_index_configs) {
            num += parseInt(item.weight)
          }
          if (num === 100) {
            if (this.reference_id) {
              // console.log('=========', this.reference_id)
              this.edit()
            } else {
              if (num === 100) {
                this.add()
              }
            }
          } else {
            this.$message.warning('各项占比之和非100%，请检查')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
.edit {
  .edit-table {
    width: 1200px;
    margin-top: 15px;
  }
  /deep/ .el-table th {
    padding: 0;
  }
  /deep/ .el-table tr {
    padding: 6px 0;
  }
}
</style>
