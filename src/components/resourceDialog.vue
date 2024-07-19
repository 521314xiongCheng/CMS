<template>
  <el-dialog title="Choose Video" :visible.sync="visible">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="Tag">
        <el-input v-model="tag" auto-complete="off" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchResource"
          >Search</el-button
        >
      </el-form-item>
    </el-form>
    <el-row>
      <el-col
        :span="6"
        v-for="(resource, index) in resources"
        :key="index"
        :offset="1"
        :style="{ marginBottom: '20px' }"
      >
        <el-card :body-style="{ padding: '0px' }">
          <img :src="resource.coverImageUrl" class="image" />
          <div style="padding: 14px;">
            <span class="title">{{ resource.tag }}</span>
            <div class="bottom clearfix">
              <el-button
                type="text"
                class="button"
                @click="
                  handleChoose(
                    resource.id,
                    resource.coverImageUrl,
                    resource.url
                  )
                "
                >Choose</el-button
              >
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  name: 'resource-dialog',
  props: {
    resourceDialogVisible: {
      type: Boolean,
      default: false
    },
    resources: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      tag: '',
      visible: this.resourceDialogVisible
    }
  },
  watch: {
    resourceDialogVisible(v) {
      this.tag = ''
      this.visible = v
    },
    visible(v) {
      this.$emit('change', v)
    }
  },
  methods: {
    handleSearchResource() {
      this.$emit('search', this.tag)
    },
    handleChoose(id, coverImageUrl, videoUrl) {
      this.visible = false
      this.$emit('choose', id, coverImageUrl, videoUrl)
    }
  }
}
</script>

<style scoped>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  display: block;
}

.title {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.clearfix::before,
.clearfix::after {
  display: table;
  content: '';
}

.clearfix::after {
  clear: both;
}
</style>
