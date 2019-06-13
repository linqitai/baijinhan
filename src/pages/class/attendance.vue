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

         <div class="block" style="margin-bottom:20px">
    <span class="demonstration">时间筛选:</span>
    <el-date-picker
      v-model="timeInterval"
      @change="lastMonthSign"
      type="datetimerange"
      align="right"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :default-time="['8:00:00', '23:59:59']">
    </el-date-picker>
  </div>
  <span class="demonstration">条件筛选:</span>
   <div class="inline width140" >
             <el-select class="inputTitle" v-model="week" placeholder="周" @change="lastMonthSign" clearable>
              <el-option
                v-for="item in weeks"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>

  <div class="inline width140" >
             <el-select class="inputTitle" v-model="hour" placeholder="时" @change="lastMonthSign" clearable>
              <el-option
                v-for="item in hours"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="inline width140">
             <el-select class="inputTitle" v-model="course_id" placeholder="请选择课程" @change="lastMonthSign" clearable>
              <el-option
                v-for="item in coursesOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>

            <div class="inline width140">
             <el-select class="inputTitle" v-model="school_id" placeholder="请选择课程" @change="lastMonthSign" clearable>
              <el-option
                v-for="item in schools"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>

          <div class="right" style="margin-right:50px">
             <el-tag type="success"
                      effect="dark">
            平均满课率：{{avg}}%
          </el-tag>
           
          </div>
        <!-- <div class="element">
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
        </div> -->
      </div>
      <div>
        <!-- <schart  style="height: 500px;" :canvasId="canvasId" :type="type" :data="tableData" :options="options"></schart> -->
          <el-table :data="tableData" border style="width: 100%" v-loading="loading">
  
        <el-table-column prop="s_name" label="校区" width="160"> </el-table-column>
        <el-table-column  label="星期" width="110">
           <template slot-scope="scope">周 {{scope.row.begin_time | filterWeek}}</template>
        </el-table-column>
        <el-table-column  label="时间" width="110">
           <template slot-scope="scope">{{scope.row.begin_time | filterHour}}</template>
        </el-table-column>
        <el-table-column prop="c_name" label="课程类型" width="300"></el-table-column>
        <el-table-column prop="l_name" label="实订课时" width="300"></el-table-column>
        <el-table-column prop="capacity" label="上课人数" width="110"></el-table-column>
        <el-table-column prop="sign_count" label="实订人数" width="110"></el-table-column>
        <!-- <el-table-column prop="is_use_level" label="实订人数" width="110"> -->
          <!-- <template slot-scope="scope">{{scope.row.is_custom==1?'是':scope.row.is_custom==0?'否':''}}</template> -->
        <!-- </el-table-column> -->
        <el-table-column  label="满课率">
          <template slot-scope="scope">{{scope.row |filterProportion}}</template>
        </el-table-column>
          </el-table>
      </div>
       <div class="tableBottom" v-show="showPageTag">
        <el-pagination
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageIndex"
          :page-size="pageSize"
          :page-sizes="[6,8,10,20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
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
      timeInterval:[],
      loading: true,
      pageIndex: 1,
      pageSize: 10,
      total: 100,
      avg:'',
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
        title: '到课率统计',
        autoWidth:true,
        yEqual:1
      },
      hour:'',
      week:'',
      begin:'',
      end:'',
      school_id:'',
      course_id:'',
      hours:[
        {value:9,label:"9:00"},
        {value:10,label:"10:00"},
        {value:11,label:"11:00"},
        {value:12,label:"12:00"},
        {value:13,label:"13:00"},
        {value:14,label:"14:00"},
        {value:15,label:"15:00"},
        {value:16,label:"16:00"},
        {value:17,label:"17:00"},
        {value:18,label:"18:00"},
        {value:18.5,label:"18:30"},
        {value:19,label:"19:00"},
        {value:20,label:"20:00"},
      ],
      weeks:[
        {value:1,label:"一"},
        {value:2,label:"二"},
        {value:3,label:"三"},
        {value:4,label:"四"},
        {value:5,label:"五"},
        {value:6,label:"六"},
        {value:7,label:"日"}
      ],
      schools:[
        {value:1,label:"财富"},
        {value:2,label:"银泰"}
      ]
    }
  },
  created() {
   this.weekBegin();
    this.getCourseList();
    // this.getTeacherList();
  },
  components:{
    Schart
  },
  filters:{
    filterHour(t){
      let data = new Date(t*1000);
      return help(data.getHours() +1) +':'+help(data.getMinutes());
    },

    filterWeek(t){
      t = new Date(t*1000).getDay(); 
      var one ;
      switch(t){
        case 1:
          one =  "一"
          break
        case 2:
          one =  "二"
          break
        case 3:
          one =  "三"
          break
        case 4:
          one =  "四"
          break
        case 5:
          one =  "五"
          break
        case 6:
          one =  "六"
          break
        case 0:
          one =  "日"
          break
      }
      return one
    },
    filterProportion(row){
      return (row.sign_count/row.capacity).toFixed(2)*100 + '%'
    }
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
    // getTeacherList() {
    //   var that = this;
    //   var params = {
    //     offset: 0,
    //     limit: 1000
    //   }
    //   var url = teacherListUrl;
    //   // console.log(params,"params")
    //   that.$axios.post(url,params).then((res)=>{
    //     var result = res.data;
    //     if(result.code == ERR_OK){
    //       that.teachersOption = result.data.teachers;
    //       if(that.teachersOption){
    //         for(var i=0;i<that.teachersOption.length;i++){
    //           that.teachersOption[i].value = that.teachersOption[i].id
    //           that.teachersOption[i].label = that.teachersOption[i].en_name
    //         }  
    //       }else{

    //       }
    //       console.log(that.teachersOption,'that.teachersOption')
    //     }
    //   });
    // },
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
          }
          that.lastMonthSign();
          // console.log(that.coursesOption,"that.coursesOption")
        }
      });
    },
    lastMonthSign() {
      let that = this;
      this.loading=true;  
      if(this.timeInterval.length<=0){
        this.open()
        return 
      }
      var params = {
         begin:(this.timeInterval[0].getTime()/1000).toFixed(0),
         end:(this.timeInterval[1].getTime()/1000).toFixed(0),
         offset: (that.pageIndex - 1) * that.pageSize,
          limit: that.pageSize
      }
      if(this.course_id){
        params.course_id = this.course_id;
      }
      if(this.school_id){
        params.school_id = this.school_id;
      }
      if(this.week){
        params.week = this.week;
      }
      if(this.hour){
        params.hour = this.hour;
      }
      var url = lastMonthSignUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          that.loading = false;
          that.tableData = result.data.list;
          that.total = result.data.count[0].count;
          that.avg = parseFloat(result.data.avg[0].avg*100).toFixed(2);
          if (that.total < that.pageSize) {
            that.showPageTag = false;
          } else {
            that.showPageTag = true;
          }
        }
      });
    },
     open() {
        this.$alert('请先选择时间', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${ action }`
            });
          }
        });
      },
      weekBegin(){
        var data = new Date();
        var week = data.getDay()
         week = week==0?7:week;
         var time = new Date(data.getFullYear(),data.getMonth(),data.getDate(),8).getTime()-(week-1)*86400*1000;
         var begin = new Date(time)
         var end = new Date(time+86400*1000*7+3600*1000*12);
         this.timeInterval[0]=begin;
         this.timeInterval[1]=end;
      },
       handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.lastMonthSign();
    },
    handleCurrentChange(val) {
      this.loading = true;
      this.pageIndex = val;
      console.log(val);
      this.lastMonthSign();
    },
 
  }
}
function  help(char){
      console.log(char);
      if((char+"").length ==1){
         return '0'+char
      }else{
        return char+'';
      }
      
    }
</script>


