<template>
  <div class="staff-con">
    <el-tabs type="border-card" v-model="activeName" @tab-click="tabClick">
      <el-tab-pane label="员工账号管理" name="count">
        <el-form :inline="true" size="small">
          <el-row>
            <el-form-item label="姓名">
              <el-input v-model="filters.employeeName"></el-input>
            </el-form-item>
            <el-form-item label="12位编号">
              <el-input v-model="filters.directSellerId"></el-input>
            </el-form-item>
            <el-form-item label="域帐号">
              <el-input v-model="filters.employeeAccount"></el-input>
            </el-form-item>
            <el-button type="primary" @click="handleSearch" size="small"
              >搜索</el-button
            >
          </el-row>
        </el-form>
        <div class="table-wrap">
          <table-list
            :tableData="tableData"
            :choosePageFn="getTableList"
            :currentPage="pageNo"
          >
            <el-table-column label="操作" align="center" width="180">
              <template slot-scope="{ row }">
                <el-button size="mini" type="primary" @click="edit(row)"
                  >编辑</el-button
                >
                <el-button size="mini" type="success" @click="preview(row)"
                  >预览</el-button
                >
              </template>
            </el-table-column>
          </table-list>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      :visible.sync="showEditorDialog"
      @closed="closedEditor"
      :title="title"
      width="1200px"
    >
      <div slot="title">
        <h4>小组设置</h4>
        <div>
          <el-radio-group v-model="teamCopy" size="mini" @change="getRelation">
            <el-radio-button
              v-for="item of teamsData"
              :key="item.teamCode"
              :label="{ teamCode: item.teamCode, teamName: item.teamName }"
            >
              {{ item.teamName }}
              <span v-if="item.lineNumber">({{ item.lineNumber }})</span>
              <span class="teamChecked" v-if="item.isChecked">(已分配)</span>
            </el-radio-button>
          </el-radio-group>
        </div>
        <h4>身份设置</h4>
        <div>
          <el-radio-group
            v-model="isCheckedList.isTeamLeader"
            @change="teamleader"
          >
            <el-radio :label="true">组长</el-radio>
            <el-radio :label="false">组员</el-radio>
          </el-radio-group>
        </div>
      </div>
      <el-form label-width="90px" label-position="left">
        <el-row :gutter="20" type="flex">
          <el-col>
            <el-card>
              <el-form-item label="未选" class="labelTitle">
                <el-button type="success" size="mini" @click="checkedAll()"
                  >全选</el-button
                >
              </el-form-item>
              <el-input
                v-model="searchInput"
                placeholder="输入关键字搜索"
                prefix-icon="el-icon-search"
                size="mini"
                class="searchInput"
              ></el-input>
              <el-row>
                <div class="select-content">
                  <el-col>
                    <el-table
                      v-show="relationList.nsdList.length"
                      :data="
                        relationList.nsdList.filter(
                          data =>
                            !searchInput ||
                            data.name.includes(searchInput) ||
                            data.nsdContactId.toString().includes(searchInput)
                        )
                      "
                      stripe
                    >
                      <el-table-column
                        prop="name"
                        label="首席区域"
                        align="center"
                      ></el-table-column>
                      <el-table-column
                        prop="directSellerId"
                        label="直销员编号"
                        align="center"
                      ></el-table-column>
                      <el-table-column
                        prop="nsdContactId"
                        label="ContactId"
                        align="center"
                      ></el-table-column>
                      <el-table-column
                        prop="lineNumber"
                        label="管理类别"
                        align="center"
                      >
                        <!-- <template slot-scope="{ row }">
                          <div
                            v-for="item in row.lineNumber"
                            :key="item.number"
                          >
                            <span>{{ item.line }}</span>
                            &nbsp;
                            <el-checkbox v-model="item.isChecked"></el-checkbox>
                          </div>
                        </template> -->
                      </el-table-column>
                      <el-table-column label="操作" align="center">
                        <template slot-scope="{ $index, row }">
                          <el-button
                            type="primary"
                            size="mini"
                            @click="addList($index, row, 'nsdList')"
                            >添加</el-button
                          >
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-table
                      v-show="relationList.province.length"
                      :data="
                        relationList.province.filter(
                          data =>
                            !searchInput || data.province.includes(searchInput)
                        )
                      "
                      stripe
                      row-key="id"
                      :tree-props="{ children: 'cityList' }"
                    >
                      <el-table-column
                        prop="province"
                        label="省"
                        align="center"
                      ></el-table-column>
                      <el-table-column
                        prop="city"
                        label="市"
                        align="center"
                      ></el-table-column>
                      <el-table-column label="操作" prop="city" align="center">
                        <template slot-scope="{ $index, row }">
                          <el-button
                            type="primary"
                            size="mini"
                            @click="addList($index, row, 'province')"
                            >添加</el-button
                          >
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-col>
                </div>
              </el-row>
            </el-card>
          </el-col>
          <el-col>
            <el-card>
              <el-form-item label="已选" class="labelTitle"></el-form-item>
              <el-input
                v-model="isSearchInput"
                placeholder="输入关键字搜索"
                prefix-icon="el-icon-search"
                size="mini"
                class="searchInput"
              ></el-input>
              <el-row>
                <div class="select-content">
                  <el-col>
                    <el-table
                      v-show="isCheckedList.nsdList.length"
                      :data="
                        isCheckedList.nsdList.filter(
                          data =>
                            !isSearchInput ||
                            data.name.includes(isSearchInput) ||
                            data.nsdContactId.toString().includes(isSearchInput)
                        )
                      "
                      stripe
                    >
                      <el-table-column
                        prop="name"
                        label="首席区域"
                        align="center"
                      ></el-table-column>
                      <el-table-column
                        prop="directSellerId"
                        label="直销员编号"
                        align="center"
                      ></el-table-column>
                      <el-table-column
                        prop="nsdContactId"
                        label="ContactId"
                        align="center"
                      ></el-table-column>
                      <el-table-column
                        prop="lineNumber"
                        label="管理类别"
                        align="center"
                      >
                        <!-- <template slot-scope="{ row }">
                          <div
                            v-for="item in row.lineNumber"
                            :key="item.number"
                          >
                            <span>{{ item.line }}</span>
                            &nbsp;
                            <el-checkbox v-model="item.isChecked"></el-checkbox>
                          </div>
                        </template> -->
                      </el-table-column>
                      <el-table-column label="操作" align="center">
                        <template slot-scope="{ $index, row }">
                          <el-button
                            type="danger"
                            size="mini"
                            @click="deleteList($index, row, 'nsdList')"
                            >删除</el-button
                          >
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-table
                      v-show="isCheckedList.province.length"
                      ref="isTable"
                      :data="
                        isCheckedList.province.filter(
                          data =>
                            !isSearchInput ||
                            data.province.includes(isSearchInput)
                        )
                      "
                      stripe
                      row-key="id"
                      :tree-props="{ children: 'cityList' }"
                    >
                      <el-table-column
                        prop="province"
                        label="省"
                        align="center"
                      ></el-table-column>
                      <el-table-column
                        prop="city"
                        label="市"
                        align="center"
                      ></el-table-column>
                      <el-table-column label="操作" align="center">
                        <template slot-scope="{ $index, row }">
                          <el-button
                            type="danger"
                            size="mini"
                            @click="deleteList($index, row, 'province')"
                            >删除</el-button
                          >
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-col>
                </div>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button @click="showEditorDialog = false" size="mini"
          >关闭</el-button
        >
        <el-button type="primary" @click="submitForm" size="mini"
          >保存</el-button
        >
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showPreviewDialog" :title="title" width="1200px">
      <el-form label-width="90px" label-position="left">
        <el-row :gutter="20" type="flex">
          <el-col>
            <el-card>
              <el-row>
                <div class="select-content">
                  <el-col>
                    <el-table :data="consultantList" stripe>
                      <el-table-column
                        prop="name"
                        label="顾问姓名"
                        align="center"
                      ></el-table-column>
                      <el-table-column
                        prop="contactId"
                        label="顾问编号"
                        align="center"
                      ></el-table-column>
                      <el-table-column
                        prop="nsdName"
                        label="首席姓名"
                        align="center"
                      ></el-table-column>
                      <el-table-column
                        prop="offspringLineNumber"
                        label="所属类别"
                        align="center"
                      ></el-table-column>
                      <el-table-column
                        prop="careerLevelCode"
                        label="职级"
                        align="center"
                      ></el-table-column>
                      <el-table-column
                        prop="activityStatusCode"
                        label="状态"
                        align="center"
                      ></el-table-column>
                    </el-table>
                  </el-col>
                </div>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button @click="showPreviewDialog = false" size="mini"
          >关闭</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TableList from '@/components/tableList.vue'
import restfulMixin from '@/mixins/restful.js'
import {
  getTeams,
  getCountDetail,
  saveEdit,
  getPages
} from '@/api/staffConsultant/count'
export default {
  components: { TableList },
  mixins: [restfulMixin],
  data() {
    return {
      pageNo: 1,
      pageConstant: {
        // apiPrefixUrl: 'mock/452/v2/staffconsultants',
        apiPrefixUrl: 'staffconsultants',
        pageName: 'employees',
        dataKey: 'employees'
      },
      teamsData: [],
      team: {},
      teamCopy: {},
      tableChange: false,
      searchInput: '',
      isSearchInput: '',
      tableData: {
        header: [
          {
            tableId: 'employeeName',
            tableName: '姓名'
          },
          {
            tableId: 'department',
            tableName: '部门'
          },
          {
            tableId: 'directSellerId',
            tableName: '12位编号'
          },
          {
            tableId: 'contactId',
            tableName: 'ContactID'
          },
          {
            tableId: 'employeeAccount',
            tableName: '域账号'
          },
          {
            tableId: 'nsdArea',
            tableName: '首席区域'
          },
          {
            tableId: 'updatedDate',
            tableName: '最后修改时间'
          },
          {
            tableId: 'updatedBy',
            tableName: '最后修改者'
          }
        ],
        data: [],
        pageData: {
          pageSize: 50,
          totalCount: 0
        }
      },
      filters: {
        employeeName: '',
        directSellerId: '',
        employeeAccount: ''
      },
      form: {},
      showEditorDialog: false,
      showPreviewDialog: false,
      isCheckedList: {
        teamName: '',
        teamCode: '',
        isTeamLeader: false,
        nsdList: [],
        province: []
      },
      relationList: {
        nsdList: [],
        province: []
      },
      consultantList: [],
      title: '',
      activeName: 'count'
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    getTeamsData() {
      getTeams(`contactId=${this.form.contactId}`).then(res => {
        this.teamsData = res.teamList
      })
    },
    handleSearch() {
      this.pageNo = 1
      this.getTableList(this.pageNo)
    },
    teamleader(value) {
      if (value) {
        this.$confirm('请确认是否要选择组长?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.isCheckedList.isTeamLeader = true
            this.$message({
              type: 'success',
              message: '选择成功!'
            })
          })
          .catch(() => {
            this.isCheckedList.isTeamLeader = false
            this.$message({
              type: 'info',
              message: '已取消选择'
            })
          })
      }
    },
    checkedAll() {
      this.isCheckedList.nsdList = JSON.parse(
        JSON.stringify(this.relationList.nsdList)
      )
      this.isCheckedList.province = JSON.parse(
        JSON.stringify(this.relationList.province)
      )
      this.tableChange = true
    },
    tabClick(e) {
      if (e.index === '0') {
        this.activeName = 'count'
        this.title = ''
      }
    },
    edit(row) {
      this.form = row
      this.getTeamsData()
      // 清空上次数据
      this.team = {}
      this.teamCopy = {}
      this.searchInput = ''
      this.isSearchInput = ''
      this.relationList = {
        nsdList: [],
        province: []
      }
      this.isCheckedList = {
        teamName: '',
        teamCode: '',
        isTeamLeader: false,
        nsdList: [],
        province: []
      }
      this.showEditorDialog = true
    },
    getTeamTable(value) {
      this.team = value
      getCountDetail(this.form.contactId, `teamCode=${value.teamCode}`).then(
        res => {
          this.relationList.nsdList = res.nsdList
          // 树状数据添加id参数
          this.relationList.province = !res.province.length
            ? []
            : res.province.map((e, i) => {
                console.log(i)
                e.id = e.province
                e.cityList = !e.cityList
                  ? []
                  : e.cityList.map((j, k) => {
                      console.log(k)
                      return {
                        province: e.province,
                        id: j + '市',
                        city: j
                      }
                    })
                return e
              })
          // console.log(this.relationList.province);
          this.isCheckedList.nsdList = res.checked.nsdList
            ? res.checked.nsdList
            : []
          this.isCheckedList.isTeamLeader = res.checked.isTeamLeader
            ? true
            : false
          this.isCheckedList.province = !res.checked.province
            ? []
            : res.checked.province.map((e, i) => {
                console.log(i)
                e.id = e.province
                e.cityList = !e.cityList
                  ? []
                  : e.cityList.map((j, k) => {
                      console.log(k)
                      return {
                        province: e.province,
                        id: j + '市',
                        city: j
                      }
                    })
                return e
              })
        }
      )
    },
    getRelation(value) {
      if (this.tableChange) {
        this.$confirm('当前小组的改动未保存,是否保存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            console.log(this.team, value)
            this.submitForm()
            this.getTeamTable(value)
            this.tableChange = false
          })
          .catch(() => {
            this.tableChange = false
            this.getTeamTable(value)
          })
      } else {
        this.getTeamTable(value)
      }
    },
    addList(index, row, type) {
      console.log(index, row, type)
      this.tableChange = true
      if (type == 'nsdList') {
        for (let e of this.isCheckedList.nsdList) {
          if (e.nsdContactId == row.nsdContactId) {
            this.$message.error('当前类目已经添加,请勿重复添加!')
            return false
          }
        }
        this.isCheckedList.nsdList.unshift(row)
        this.$message.success('添加成功!')
        // this.relationList.checked.nsdList.unshift(JSON.parse(JSON.stringify(row)))
      }
      if (type == 'province') {
        // 添加市
        if (row.city) {
          // 判断是否已存在省
          for (let a of this.isCheckedList.province) {
            if (a.province == row.province) {
              // 判断是否已存在市
              for (let e of a.cityList) {
                if (e.city == row.city) {
                  this.$message.error('当前类目已经添加,请勿重复添加!')
                  return false
                }
              }
              a.cityList.unshift(row)
              this.$message.success('添加成功!')
              return false
            }
          }
          this.isCheckedList.province.unshift({
            province: row.province,
            id: row.province,
            cityList: [row]
          })
          this.$message.success('添加成功!')
        }
        // 添加省
        if (row.cityList) {
          for (let [i, e] of this.isCheckedList.province.entries()) {
            console.log(i)
            if (e.province == row.province) {
              e.cityList = JSON.parse(JSON.stringify(row.cityList))
              // this.$refs.isTable.toggleRowExpansion(row, false) //已有省时
              // this.$refs.isTable.toggleRowExpansion(row, true)  //视图更新
              this.$message.success('添加成功!')
              return false
            }
          }
          this.isCheckedList.province.unshift(JSON.parse(JSON.stringify(row))) //删除需要深拷贝
          this.$message.success('添加成功!')
        }
      }
    },
    deleteList(index, row, type) {
      this.tableChange = true
      console.log(index, row, type)
      if (type == 'nsdList') {
        this.isCheckedList.nsdList.splice(index, 1)
        this.$message.success('删除成功!')
      }
      if (type == 'province') {
        for (let [i, e] of this.isCheckedList.province.entries()) {
          if (e.province == row.province) {
            // 删除省
            if (row.cityList) {
              this.isCheckedList.province.splice(i, 1)
              this.$message.success('删除成功!')
            }
            // 删除市
            if (row.city) {
              // 最后一个市时删除省
              if (e.cityList.length == 1) {
                this.isCheckedList.province.splice(i, 1)
                this.$message.success('删除成功!')
              } else {
                for (let [j, k] of e.cityList.entries()) {
                  if (k.city == row.city) {
                    e.cityList.splice(j, 1)
                    this.$message.success('删除成功!')
                  }
                }
              }
            }
          }
        }
      }
    },
    submitForm() {
      if (!this.team.teamCode) {
        this.$message.error('请选择小组进行操作!')
        return false
      }
      if (this.team.teamCode == 0) {
        this.$confirm('管理员拥有查看所有人的权限，请谨慎选择', '提示', {
          confirmButtonText: '继续保存',
          cancelButtonText: '取消保存',
          type: 'warning'
        })
          .then(() => {
            this.saveData()
          })
          .catch(() => {
            this.$message.error('取消保存!')
          })
      } else {
        this.saveData()
      }
    },
    saveData() {
      // 获取数据
      this.isCheckedList.teamCode = this.team.teamCode
      this.isCheckedList.teamName = this.team.teamName
      let params = JSON.parse(JSON.stringify(this.isCheckedList))
      params.province = params.province.map(e => {
        delete e.id
        e.cityList.map((j, i) => {
          e.cityList[i] = j.city
        })
        return e
      })
      console.log('params:', params)
      saveEdit(this.form.contactId, params).then(res => {
        if (res.result) {
          // team数据回显
          this.getTeamsData()
          this.$message.success(
            '当前小组保存成功,请选择其他小组继续操作或者关闭弹框!'
          )
          this.tableChange = false
        } else {
          this.$message.error('保存失败,请稍后重试!')
        }
      })
    },
    preview(row) {
      getPages(row.contactId).then(res => {
        this.consultantList = res.consultantList ? res.consultantList : []
        this.showPreviewDialog = true
      })
    },
    closedEditor() {
      // 弹窗关闭之后刷新列表
      this.getTableList()
    }
  }
}
</script>

<style lang="less" scoped>
.staff-con {
  .select-content {
    height: 400px;
    overflow: hidden;
    overflow-y: scroll;
    .select-option {
      width: 100%;
      line-height: 30px;
      font-size: 16px;
      cursor: pointer;
      padding: 0 20px;
      &:hover {
        background-color: #f5f7fa;
      }
    }
    .is-check {
      color: #409eff;
    }
  }
}
.teamChecked {
  color: #67c23a;
}
.searchInput {
  width: 230px;
}
/**滚动条样式开始**/
.member ul {
  /*ie下的样式，只能修改颜色*/
  scrollbar-base-color: #b9b8b9;
  scrollbar-3dlight-color: #c0c0c0;
  scrollbar-highlight-color: #c0c0c0;
  scrollbar-track-color: #fff;
  scrollbar-arrow-color: #fff;
  scrollbar-shadow-color: #c0c0c0;
}

/*---滚动条默认显示样式--*/
::-webkit-scrollbar-thumb {
  background-color: #b9b8b9;
  height: 50px;
  outline-offset: -2px;
  outline: 1px solid #fff;
  border-radius: 5px;
  border: 2px solid #fff;
}
/*---滚动条大小--*/
::-webkit-scrollbar {
  width: 8px;
  height: 10px;
}

/**滚动条样式结束**/
/* 表头背景色 */
.el-table th {
  background-color: #f6f9ff !important;
}

.labelTitle {
  margin-bottom: 0;
  /deep/ .el-form-item__label {
    font-size: 18px;
  }
}
</style>
