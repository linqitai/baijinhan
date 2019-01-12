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
         <!--  <label class="inline">教师编号：</label>
          <div class="inline width140">
             <el-input v-model="teacher_id" size="medium" clearable placeholder="查询内容"></el-input>
          </div> -->
          <div class="inline width120">
            <el-select class="inputTitle" v-model="typevalue" placeholder="请选择" @change="typeChange" clearable>
              <el-option
                v-for="item in typeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="inline width140" v-if="typevalue=='教师'">
             <el-select class="inputTitle" v-model="teacher_id" placeholder="请选择教师" @change="teacherChange" clearable>
              <el-option
                v-for="item in teachersOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="inline width140" v-if="typevalue=='课程'">
             <el-select class="inputTitle" v-model="course_id" placeholder="请选择课程" @change="courseChange" clearable>
              <el-option
                v-for="item in coursesOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
import {lastMonthSignUrl,getTeacherCourseUrl,teacherListUrl,ERR_OK} from "@/api/index";
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
      typevalue:'课程',
      typeOption:[{lable:'教师',value:'教师'},{lable:'课程',value:'课程'}],
      coursesOption:[],
      teachersOption:[],
      teacher_id:'',
      course_id:'',
      canvasId: 'myCanvas',
      type: 'bar',
      options: {
        title: '到课率统计'
      }
    }
  },
  created() {
    this.getCourseList();
    this.getTeacherList();
  },
  components:{
    Schart
  },
  methods: {
    typeChange(value) {
      if(value=='教师') {
        this.course_id = ''
      }else if(value=='课程') {
        this.teacher_id = ''
      }
    },
    teacherChange(value) {
      this.lastMonthSign();
    },
    courseChange(value) {
      this.lastMonthSign();
    },
    getTeacherList() {
      var that = this;
      var params = {
        offset: 0,
        limit: 1000
      }
      var url = teacherListUrl;
      // console.log(params,"params")
      that.$axios.post(url,params).then((res)=>{
        var result = res.data;
        if(result.code == ERR_OK){
          that.teachersOption = result.data.teachers;
          if(that.teachersOption){
            for(var i=0;i<that.teachersOption.length;i++){
              that.teachersOption[i].value = that.teachersOption[i].id
              that.teachersOption[i].label = that.teachersOption[i].en_name
            }  
          }else{

          }
          console.log(that.teachersOption,'that.teachersOption')
        }
      });
    },
    getCourseList() {
      var that = this;
      var params = {
      }
      var url = getTeacherCourseUrl;
      // console.log(params,"=========params============")
      that.$axios.post(url,params).then((res)=>{
        var result = res.data;
        // console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          that.coursesOption = result.data.course;
          for(var i=0;i<that.coursesOption.length;i++){
             that.coursesOption[i].value = that.coursesOption[i].id
             that.coursesOption[i].label = that.coursesOption[i].name
             if(i==0) {
                that.course_id = that.coursesOption[i].id
             }
          }
          that.lastMonthSign();
          // console.log(that.coursesOption,"that.coursesOption")
        }
      });
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
        console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          that.tableData = result.data;
          for(var i=0;i<that.tableData.length;i++) {
            if(this.typevalue == '课程'){
              that.tableData[i].name = that.tableData[i].teacher.en_name;
              that.tableData[i].value = that.tableData[i].choose_ratio;
            }else if(this.typevalue == '教师') {
              that.tableData[i].value = that.tableData[i].choose_ratio;
              that.tableData[i].name = that.tableData[i].course.name;
            }
          }
        }
      });
    },
  }
}
</script>


