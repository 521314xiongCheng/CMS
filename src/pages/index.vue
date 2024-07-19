<template>
  <div class="portal-container">
    <el-row :gutter="20">
      <el-col
        :span="6"
        v-for="externalMenu in externalMenus"
        :key="externalMenu.id"
      >
        <div class="portal-block">
          <a :href="externalMenu.path" target="_blank">
            <!-- <img class="region" :src="externalMenu.path" alt="" /> -->
            <div class="portal-name">{{ externalMenu.name }}</div>
          </a>
          <i class="el-icon-s-promotion portal-icon"></i>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="less" scope>
.portal-container {
  width: 100%;
  height: 100%;
  .portal-block {
    position: relative;
    margin-bottom: 20px;
    // height: 48px;
    padding: 10px;
    background-color: #fff;
    border-radius: 8px;
    color: #515a6e;
    border: 1px solid #515a6e;
    &:hover {
      border-color: #57a3f3;
      color: #57a3f3;
    }
    a {
      display: flex;
      align-items: center;
      color: #515a6e;
      justify-content: center;
      &:hover {
        color: #57a3f3;
      }
      .region {
        margin-right: 10px;
        width: 28px;
        height: 28px;
      }
      .portal-name {
        font-size: 18px;
        line-height: 28px;
      }
    }
    .portal-icon {
      position: absolute;
      top: -10px;
      right: -3px;
      height: 20px;
      width: 20px;
      font-size: 2rem;
      // color: #666;
    }
  }
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
    .chart-head {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>

<script>
import { readCookie } from '../lib/help'
export default {
  components: {},
  data() {
    return {
      email: '',
      externalMenus: []
    }
  },
  created() {},
  methods: {
    // 菜单获取
    async getMenus() {
      let result = await this.$curl.get(`system/menus?email=${this.email}`)
      console.log(result)
      this.externalMenus = result.externalMenus
    },
    // 用户信息校验
    async getUser() {
      let userInfo = await this.$curl.post('users/verified', {
        token: readCookie('token')
      })
      this.email = userInfo.email
      await this.getMenus()
    }
  },
  computed: {},
  async mounted() {
    this.getUser()
  }
}
</script>
