<template>
  <el-container id="app">
    <app-header :userName="userName"></app-header>
    <el-container class="app-container">
      <el-aside class="app-menu">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-menu
            :default-active="$route.fullPath"
            style="height: 100%;"
            :collapse="isCollapse"
            :router="true"
            :unique-opened="true"
          >
            <el-menu-item index="/">
              <template slot="title">
                <!-- <i class="el-icon-location"></i>
                <span>Dashboard</span> -->
                <item icon="el-icon-s-platform" title="Dashboard" />
              </template>
            </el-menu-item>
            <template v-for="menu in menus">
              <el-menu-item
                :index="menu.subMenus[0].path"
                v-if="
                  menu.subMenus.length &&
                    menu.subMenus.length === 1 &&
                    menu.subMenus[0].subMenus &&
                    !menu.subMenus[0].subMenus.length
                "
                :key="menu.id"
              >
                <item :icon="getIcon(menu)" :title="menu.name" />
              </el-menu-item>
              <el-submenu
                :index="menu.name"
                :key="menu.id"
                v-else-if="menu.subMenus.length"
              >
                <template slot="title">
                  <item :icon="getIcon(menu)" :title="menu.name" />
                </template>
                <template v-for="subMenu in menu.subMenus">
                  <el-menu-item
                    :index="subMenu.path"
                    :key="subMenu.id"
                    v-if="subMenu.subMenus.length === 0"
                  >
                    <span slot="title">{{ subMenu.name }}</span>
                  </el-menu-item>
                  <el-submenu
                    :index="subMenu.name"
                    :key="subMenu.id"
                    v-else-if="subMenu.subMenus"
                  >
                    <template slot="title">
                      <span slot="title">{{ subMenu.name }}</span>
                    </template>

                    <template v-for="childMenu in subMenu.subMenus">
                      <el-menu-item :index="childMenu.path" :key="childMenu.id">
                        <span slot="title">{{ childMenu.name }}</span>
                      </el-menu-item>
                    </template>
                  </el-submenu>
                </template>
              </el-submenu>
            </template>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-main style="padding:0;">
        <crumbs :crumbsData="crumbsData"></crumbs>
        <div v-if="active === '/' || active === ''" class="mainless">
          <el-row :gutter="20">
            <el-col
              :span="6"
              v-for="externalMenu in externalMenus"
              :key="externalMenu.id"
            >
              <div class="grid-content">
                <a :href="externalMenu.path" target="_blank">
                  <div class="menu-name">{{ externalMenu.name }}</div>
                </a>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="mainless" id="loding">
          <transition name="fade-transform" mode="out-in">
            <router-view></router-view>
          </transition>
          <!-- <transition name="fade-transform" mode="out-in">
            <keep-alive>
              <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
          </transition>
          <transition name="fade-transform" mode="out-in">
            <router-view v-if="!$route.meta.keepAlive"></router-view>
          </transition> -->
        </div>
      </el-main>
    </el-container>
    <el-button
      class="setting"
      type="primary"
      @click="drawer = true"
      icon="el-icon-s-tools"
    ></el-button>
    <el-drawer title="换肤" :visible.sync="drawer" size="260px">
      <theme-config />
    </el-drawer>
    <el-dialog
      :visible.sync="localLogin"
      custom-class="local-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :fullscreen="true"
    >
      <div class="local-login-form">
        <div class="title">Local Login</div>
        <el-row>
          <el-col :span="24">
            <el-input
              v-model="emailAddress"
              placeholder="please input your email"
              >email</el-input
            >
          </el-col>
          <el-col :span="24">
            <el-button
              type="primary"
              style="width:300px;margin-top:20px;"
              @click="localVerified"
              @keyup.enter="localVerified"
              >邮箱验证</el-button
            >
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import themeConfig from '@/components/themeConfig/themeConfig'
import { submenu } from './config/index'
import { localLogin } from './api/index'
import { readCookie, treeData2Arr, createCookie, isLocalhost } from '@/utility'
import Http from '@/api/http'
import storage from 'good-storage'
import item from '@/components/item'
import Cookie from 'js-cookie'
import appHeader from '@/layouts/header'
import crumbs from '@/components/crumbs'

export default {
  data() {
    return {
      isCollapse: false,
      active: '',
      userName: '',
      isDashboard: false,
      submenu: submenu,
      homepage: '/',
      menus: [],
      externalMenus: [],
      email: '',
      crumbsData: [],
      activeRouter: '',
      drawer: false,
      path: '',
      localLogin: false,
      emailAddress: ''
    }
  },
  components: { themeConfig, item, appHeader, crumbs },
  computed: {
    key() {
      // console.log(this.$route.path)
      return this.$route.path
    }
  },
  methods: {
    getIcon(item) {
      return item.name
    },
    test(index) {
      if (this.path === index) {
        this.$router.push('/back')
      } else {
        this.path = index
      }
    },
    switchCollapse() {
      this.isCollapse = !this.isCollapse
    },
    goHome() {
      this.active = ''
      this.$router.push({ path: this.homepage })
    },
    signOut() {
      location.href = '/signOut'
    },
    getMenus() {
      Http({
        url: 'system/menus?email=' + this.email
      }).then(res => {
        this.menus = res.menus
        this.getCrumbsData(this.$route.path)
        storage.set('menus', this.menus)
      })
    },
    getParentData(data) {
      const traverse = arr => {
        arr.forEach(o => {
          if (o.subMenus) {
            if (!o.path) {
              o.subMenus.forEach(s => {
                s.parent = []
                s.parent.push({
                  name: o.name
                })
              })
            } else {
              o.subMenus.forEach(s => {
                s.parent = []
                let list = []
                list.push({
                  name: o.name
                })
                s.parent = o.parent.concat(list)
              })
            }
            traverse(o.subMenus)
          }
        })
      }
      traverse(data)
      return data
    },
    // crumbs
    getCrumbsData(path) {
      if (!path || path === '/') {
        this.crumbsData = []
        return
      }
      let list = this.getParentData(this.menus)
      treeData2Arr(list, 'subMenus').forEach(o => {
        if (o.path === path) {
          let item = { name: o.name }
          this.crumbsData = o.parent.concat(item)
        } else if (path.includes(o.path)) {
          let item = { name: o.name, path: o.path }
          let r = path.split('/')
          let lastName = r[r.length - 1]
          this.crumbsData = o.parent.concat(item).concat({ name: lastName })
        } else if (path === '/404') {
          if (this.crumbsData.length) {
            this.crumbsData[this.crumbsData.length - 1].name = '404'
          }
        }
        // console.log(this.crumbsData)
      })
    },
    async localVerified() {
      if (!this.emailAddress) {
        this.$message.error('email不能为空!')
        return
      }
      try {
        let result = await localLogin(this.emailAddress)

        if (result) {
          createCookie('token', result.token)
        }
        // await this.getUser()
        location.reload()
      } catch (e) {
        this.$message.error(e.response.data)
      }
    }
  },
  watch: {
    menus() {
      this.getCrumbsData(this.$route.path)
    },
    $route(n) {
      let route = this.$route.path
      const r = route.split('/')
      // console.log(r)
      if (r.length - 1 >= 2) {
        route = `${r[0]}/${r[1]}/${r[2]}`
        if (typeof r[3] != 'undefined') {
          route = `${r[0]}/${r[1]}/${r[2]}/${r[3]}`
        }
      }

      if (r[1] == 'pad') {
        this.isPad = true
        this.isPhone = false
      }

      this.active = route
      this.getCrumbsData(n.path)
    }
  },
  created() {
    if (readCookie('token')) {
      Http({
        method: 'POST',
        url: `users/verified`,
        data: {
          token: readCookie('token')
        }
      })
        .then(userInfo => {
          localStorage.setItem('userInfo', JSON.stringify(userInfo))
          this.userName = userInfo.nickName
          this.email = userInfo.email
          this.getMenus()
        })
        .catch(() => {
          Cookie.remove('token')
          if (isLocalhost()) {
            location.href = `/`
          } else {
            location.href = `/index`
          }
        })
    }
  },
  beforeMount() {
    if (isLocalhost()) {
      if (!readCookie('token')) this.localLogin = true
    }
  }
}
</script>
<style lang="less" scoped>
@blackBgColor: #001529;
@blackFontColor: rgba(255, 255, 255, 0.7);
@blackHoverBgColor: #263445;
@blackHoverFontColor: #fff;
@whiteBgColor: #fff;
@whiteFontColor: #333;
@whiteHoverBgColor: #94a8bd;
@whiteHoverFontColor: #fff;

//.white-theme {
.app-menu {
  border-right: 1px solid #e6e6e6;
  background-color: #fff;
  /deep/.el-menu {
    width: 200px;
    background-color: @whiteBgColor;
    .el-submenu__title:hover {
      background-color: #ecf5ff;
    }
    .el-menu-item.is-active {
      background-color: #ecf5ff;
      color: #409eff;
    }
    .el-submenu__title {
      color: #303133;
      transition: border-color 0.3s, background-color 0.3s, color 0.3s;
    }
    .el-menu-item {
      color: @whiteFontColor;
      &:hover {
        background-color: #ecf5ff !important;
        color: @whiteHoverFontColor !important;
      }
    }
  }
}
.app-header {
  //background: @whiteBgColor;
  background-image: linear-gradient(45deg, #1278f6, #00b4aa 50%, #1278f6);
  color: #fff;
  border-color: #e6e6e6;
}

.el-aside {
  width: inherit !important;
  background-color: @whiteBgColor;
  overflow-x: hidden;
}
//}
.black-theme {
  .app-menu {
    width: 200px;
    /deep/.el-menu {
      width: 200px;
      height: 100%;
      background-color: @blackBgColor;
      .el-submenu__title,
      .el-menu-item {
        color: @blackFontColor;
        &:hover {
          background-color: @blackHoverBgColor !important;
          color: @blackHoverFontColor;
        }
      }
    }
  }
  .el-aside {
    width: inherit !important;
    background-color: @blackBgColor;
  }

  .app-header {
    background: @blackBgColor;
    color: @blackFontColor;
  }
}

#app {
  height: 100%;
  flex-direction: column;
  /deep/.local-dialog {
    background-color: #2d3a4b;
    .local-login-form {
      width: 300px;
      margin: 100px auto;
      text-align: center;
      .title {
        margin-bottom: 20px;
        font-size: 24px;
        color: #fff;
      }
    }
  }
}
.app-container {
  overflow: scroll;
}

/deep/ .el-scrollbar {
  overflow: inherit;
}
/deep/ .el-scrollbar__bar.is-vertical {
  right: 0px;
}

.el-main {
  padding: 0;
}

// .el-menu {
//   width: 220px;
//   overflow: hidden;
//   border-right: none;
//   &.el-menu--collapse {
//     width: 64px;
//   }
//   /deep/ .el-menu-item.is-active {
//     background-color: #2d8cf0 !important;
//     color: #fff;
//   }
//   .el-menu-item:focus,
//   .el-menu-item:hover {
//     color: #fff !important;
//   }
// }

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.link {
  cursor: pointer;
  display: flex;
  align-items: center;
}

@media screen and (max-width: 780px) {
  .el-menu-header {
    min-width: 1250px;
  }
}
.grid-content {
  text-align: center;

  a {
    text-decoration: none;
    color: #303133;
  }

  .menu-name {
    font-size: 25px;
    padding: 20px;
    margin-bottom: 20px;
    border: 1px solid #e6e6e6;
    border-radius: 10px;
  }
}
.setting {
  position: absolute;
  right: 0;
  bottom: 10%;
  font-size: 20px;
  // color: #fff;
  // background-color: #1890ff;
  border-radius: 5px 0 0 5px;
  padding: 10px;
  z-index: 3;
}
</style>
<style lang="less">
// #app .el-submenu__title:hover,
// #app .el-submenu .el-menu-item:hover,
// #app .nest-menu .el-submenu > .el-submenu__title:hover {
//   color: #fff !important;
// }
// #app .is-active > .el-submenu__title {
//   color: #f4f4f5 !important;
// }
</style>
