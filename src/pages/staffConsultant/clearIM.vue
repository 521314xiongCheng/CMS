<template>
  <div>
    <div>
      <el-input placeholder="请输入AT" v-model="access_token">
        <template slot="prepend">清除IM</template>
        <el-button slot="append" @click="clearIM">清除</el-button>
      </el-input>
    </div>
  </div>
</template>
<script>
import { clearIM } from '../../api/staffConsultant/clearIM'
export default {
  name: 'component_name',
  data() {
    return {
      access_token: ''
    }
  },
  methods: {
    async clearIM() {
      const data = await clearIM(this.access_token)
      console.log(data)
    }
  }
}
</script>
<style lang="less" scoped></style>
