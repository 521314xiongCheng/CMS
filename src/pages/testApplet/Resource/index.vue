<template>
  <div>
    <div style="margin-bottom: 15px;" class="page-title">
      {{ tabLabel }} Management
    </div>
    <el-tabs @tab-click="tabClick" type="border-card">
      <el-tab-pane label="Picture">
        <PicList
          :picLabelRadio="false"
          :searchPic="true"
          v-if="tabLabel === 'Picture'"
        ></PicList>
      </el-tab-pane>
      <!-- <el-tab-pane label="Video"> -->
      <!-- 暂时删去 -->
      <!-- <VideoList
          :videoLabelRadio="false"
          :searchVideo="true"
          v-if="tabLabel === 'Video'"
        ></VideoList> -->
      <!-- </el-tab-pane> -->
      <el-tab-pane label="Audio">
        <AudioList
          :audioLabelRadio="false"
          :searchAudio="true"
          v-if="tabLabel === 'Audio'"
        ></AudioList>
      </el-tab-pane>
      <el-tab-pane label="Animation">
        <AnimationList
          :animationLabelRadio="false"
          :searchAnimation="true"
          v-if="tabLabel === 'Animation'"
        ></AnimationList>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PicList from './pic/index.vue'
import AudioList from './audio/index.vue'
import AnimationList from './animation/index.vue'
// import VideoList from './videoList/index.vue'
export default {
  name: 'resource-index',
  components: {
    PicList,
    AudioList,
    AnimationList
    // VideoList
  },
  data() {
    return {
      tabLabel: 'Picture'
    }
  },
  mounted() {},
  methods: {
    tabClick(tab) {
      console.log(tab.label)
      this.tabLabel = tab.label
    }
  }
}
</script>
<style lang="less" scoped>
.page-box {
  margin: 30px 0;
  text-align: right;
}
/deep/ .el-tabs__content {
  min-height: 430px;
}
/*.text-right{*/
/*text-align: right;*/
/*}*/
.ml15 {
  margin-left: 15px;
}
</style>
