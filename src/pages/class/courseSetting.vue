<style lang="scss" scoped>
.apply{
  .operateTableBox{
    .functionBox{
     
    }
  }
}
</style>
<template>
  <div class="apply" ref="apply">
    <div class="breadcrumbWrapper">
      <div class="breadcrumb">
        <i class="iconfont icon-home iconhomestyle nocurrent"></i>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">
            <span class="nocurrent">首页</span>
          </el-breadcrumb-item>
          <el-breadcrumb-item><span class="nocurrent">课程</span></el-breadcrumb-item>
          <el-breadcrumb-item><span>课程设置</span></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="operateTableBox">
      课程设置
    </div>
  </div>
</template>
<script>
// import { ERR_OK } from '@/api/index'
// import { getFullDate } from '@/common/js/utils'
import {courseSettingUrl,ERR_OK} from "@/api/index"
export default {
  data() {
    return {
      
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      var that = this;
      var params = {
      }
      var url = courseSettingUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          // that.$message({
          //   showClose: true,
          //   message: '操作成功',
          //   type: 'success'
          // });
        }
      })
    },
  }
}
</script>


