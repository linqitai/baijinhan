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
          <el-breadcrumb-item><span class="nocurrent">统计</span></el-breadcrumb-item>
          <el-breadcrumb-item><span>到课率</span></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="operateTableBox">
      <div class="functionBox">
        <div class="element">
          <label class="inline">教师编号：</label>
          <div class="inline width140">
             <el-input v-model="teacher_id" size="medium" clearable placeholder="查询内容"></el-input>
          </div>
          <label class="inline margL10">课程编号：</label>
          <div class="inline width140">
             <el-input v-model="course_id" size="medium" clearable placeholder="查询内容"></el-input>
          </div>
          <div class="inline">
            <el-button type="primary" size="medium" @click="search">查询</el-button>
          </div>
        </div>
      </div>
      <div>
        <schart  style="height: 500px;" :canvasId="canvasId" :type="type" :data="tableData" :options="options"></schart>
      </div>
      <!-- <div>
        <line-example></line-example>
      </div> -->
    </div>
  </div>
</template>
<script>
// import { getFullDate } from '@/common/js/utils'
import {lastMonthSignUrl,ERR_OK} from "@/api/index";
import Schart from 'vue-schart';
// import LineExample from './components/LineChart.js'
export default {
  data() {
    return {
      loading: true,
      pageIndex: 1,
      pageSize: 10,
      total: 100,
      showPageTag:false,
      tableData: [],
      teacher_id:'',
      course_id:'',
      canvasId: 'myCanvas',
      type: 'bar',
      data: [
        {name: '2014', value: 1342},
        {name: '2015', value: 2123},
        {name: '2016', value: 1654},
        {name: '2017', value: 1795},
        {name: '2018', value: 1795},
        {name: '2019', value: 1795},
      ],
      options: {
        title: '到课率统计'
      }
    }
  },
  created() {
    this.lastMonthSign()
  },
  components:{
    Schart
  },
  methods: {
    search() {

    },
    lastMonthSign() {
      let that = this;
      var params = {
        teacher_id:that.teacher_id,
        course_id:that.course_id
      }
      var url = lastMonthSignUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
          that.tableData = result.data;
          for(var i=0;i<that.tableData.length;i++) {
            that.tableData[i].name = that.tableData[i].course.name;
            that.tableData[i].value = that.tableData[i].choose_ratio;
          }
        }
      });
    },
  }
}
</script>


