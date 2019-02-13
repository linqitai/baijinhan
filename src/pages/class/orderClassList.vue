<style lang="scss" scoped>
@import '../../common/scss/common.scss';
.apply{
  .operateTableBox{
    min-height: 780px;
    .tableBox{
      clear: both;
      // display: flex;
      text-align: center;
      position: relative;
      .tableLeft{
        // flex: 0 0 60px;
        width: 60px;
        border-left:1px solid $tableBorderColor;
        border-right:1px solid $tableBorderColor;
        border-bottom:1px solid $tableBorderColor;
        position: absolute;
        left: 0;
        top: 0;
        background-color: $mainColor;
        color: white;
        li{
          height: $height;
          line-height: $height;
          border-top:1px solid $tableBorderColor;
          display: block;
        }
      }
      .tableWrapper{
        overflow: scroll;
      }
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
          <el-breadcrumb-item><span>订课总览</span></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="operateTableBox">
      <div class="functionBox">
        <div class="element">
          <label class="inline">排课周期：</label>
          <my-time v-model="weekth" @change="getList"> </my-time>
          <!-- <div class="inline">
             <el-select class="width140" size="medium" v-model="time1" @change="time1Change" placeholder="请选择">
              <el-option
                v-for="item in time1Options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="inline">
             <el-select class="width200" size="medium" v-model="time2" @change="time2Change" placeholder="请选择">
              <el-option
                v-for="item in time2Options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div> -->
          <el-radio-group class="margL20" v-model="book_value" @change="changeBook">
            <el-radio :label="2">全部</el-radio>
            <el-radio :label="0">未订</el-radio>
            <el-radio :label="1">已订</el-radio>
          </el-radio-group> 
          <!-- <div class="inline">
            <el-button type="primary" size="">查询</el-button>
          </div> -->
        </div>
        <div style="margin-top: 10px;">
          <!-- <el-button type="primary" size="medium" @click="preparePublish">预发布课程</el-button> -->
          <!-- <el-button type="primary" size="medium" @click="publish">发布课程</el-button>
          <el-button type="primary" size="medium">上周未定课程统计</el-button> -->
        </div>
        <div style="margin-top: 18px;">
          <el-radio-group v-model="week" @change="changeweek">
            <el-radio :label="1">周一</el-radio>
            <el-radio :label="2">周二</el-radio>
            <el-radio :label="3">周三</el-radio>
            <el-radio :label="4">周四</el-radio>
            <el-radio :label="5">周五</el-radio>
            <el-radio :label="6">周六</el-radio>
            <el-radio :label="7">周日</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="tableBox">
        <ul class="tableLeft">
          <li></li>
          <li>09:00</li>
          <li>10:00</li>
          <li>11:00</li>
          <li>12:00</li>
          <li>13:00</li>
          <li>14:00</li>
          <li>15:00</li>
          <li>16:00</li>
          <li>17:00</li>
          <li>18:00</li>
          <li>19:00</li>
          <li>20:00</li>
        </ul>
        <div class="tableWrapper">
          <table class="thatTable">
            <tr class="header">
              <th v-for="(item,index) in rooms">{{item.name}}</th>
            </tr>
            <tr v-for="(items,index) in list">
              <td v-for="(item,index) in items.blocks" :class="[item.users_count>0?'orderBgColor':'']" @click="showDetail(item)">
                <div style="min-width: 160px;">
                  <div :class="[item.is_released==1?'blue':'gray']" v-if="item.lessonName">
                    <div class="">{{item.lessonSerial}}({{item.users_count}}-{{item.capacity}})</div>
                    <div>{{item.courseName}}</div>
                    <div>{{item.lessonName}} {{item.teacherName}}</div>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <el-dialog title="课堂信息" :visible.sync="showDetailDialog" :append-to-body="true" :fullscreen="false" width="500">
      <div class="" v-if="oneInfo">
        <el-row :gutter="24">
          <el-col :span="12">课程：{{oneInfo.course.name}}</el-col>
          <el-col :span="12">授课老师：{{oneInfo.teacher.en_name}}</el-col>
        </el-row>
        <el-row :gutter="24" class="margT10">
          <el-col :span="12">话题级别：{{oneInfo.lesson?oneInfo.lesson.level.name:''}}</el-col>
          <el-col :span="12">上课地点：{{oneInfo.room.name}}</el-col>
        </el-row>
        <el-row :gutter="24" class="margT10">
          <el-col :span="24">话题名称：{{oneInfo.lesson?oneInfo.lesson.name:''}}</el-col>
        </el-row>
        <div class="users" v-for="(item,index) in oneInfo.users">
          <img class="avater" :src="item.head_img_url">
          <label class="name">{{item.en_name}} {{item.cn_name}}</label>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { testUrl,bookCourseListUrl,classListUrl,teacherFreeUrl,getRoomsUrl,teacherListUrl,getTeacherCourseUrl,getCourseListUrl,editClassUrl,arrangingReleaseUrl,arrangingOneUrl,ERR_OK } from '@/api/index'
import { getFullDate,getTime,getDay,getDaysInYearMonth,getMonth,getTodayDate } from '@/common/js/utils'
import myTime  from '@/components/time'
// 一天有多少毫秒
var oneDayTime = 24*60*60*1000
var oneDaySecond = 24*60*60
var list = []
export default {
  data() {
    return {
      schoole_id: localStorage.getItem("_school_id"),
      weekTime:'',
      weekth:'',
      courseValue: '',
      teacherValue: '',
      isShowPaikeDialog:false,
      week:1,
      time1Options:[],
      time2Options:[],
      time1:"",
      time2:"",
      teachersOption:[],
      coursesOption:[],
      rooms:[],
      list:[],
      hour:'',
      room_id:'',
      lession_id:'',
      course_id:'',
      book_value:1,
      book:'1',
      showDetailDialog: false,
      info:{
       courseName:'',
       teacherName:'',
       lessonLevel:'',
       roomName:'',
       lessonName:''
      },
      oneInfo:''
    }
  },
  created() {
    this.getRooms();
    // this.getTest();
  },
  components: {
    myTime
  },
  methods: {
    test(){
      console.log(12312312312312312);
    },
    showDetail(item) {
      console.log(item,"item");
      if(item.is_released == 1) {
        this.showDetailDialog = true;
      
        var that = this;
        var params = {
          schoole_id: localStorage.getItem("_school_id"),
          area_id: item.area_id,
          arranging_id: item.id
        }
        var url = arrangingOneUrl;
        // console.log(params,"params")
        this.$axios.post(url,params).then((res)=>{
          var result = res.data;
          // console.log(result.code,'--res.code--')
          if(result.code == ERR_OK){
            that.oneInfo = result.data;
          }
        })
      }
    },
    courseChange(e) {
      this.course_id = e.split(',')[0]
      this.lession_id = e.split(',')[1]
      // console.log(this.courseValue,"courseValue")
      // console.log(this.lession_id,"lession_id")
    },
    getRooms() {
      var that = this;
      var params = {
        school_id: that.schoole_id
      }
      var url = getRoomsUrl;
      // console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        // console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          // that.tableData = result.data.category;
          that.rooms = result.data.rooms;
          that.initList();
        }
      })
    },
    getTeacherCourseEvent() {
      var that = this;
      that.getCourseList()
    },
    getCourseList() {
      var that = this;
      var params = {
        school_id: that.schoole_id,
        teacher_id: that.teacherValue,
      }
      var url = getTeacherCourseUrl;
      // console.log(params,"=========params============")
      that.$axios.post(url,params).then((res)=>{
        // console.log(res,"resresresres")
        var result = res.data;
        // console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          that.coursesOption = result.data.course;
          for(var i=0;i<that.coursesOption.length;i++){
            // var serial = that.coursesOption[i].serial
            for(var j=0;j<that.coursesOption[i].lessons.length;j++){
              that.coursesOption[i].value = that.coursesOption[i].id
              that.coursesOption[i].label = that.coursesOption[i].lessons[j].name
              // that.coursesOption[i].lession_id = that.coursesOption[i].lessons[j].id
            }
          }
          // console.log(that.coursesOption,"that.coursesOption")
        }
      });
    },
    getTeacherList() {
      var that = this;
      var params = {
        school_id: that.schoole_id
      }
      var url = teacherListUrl;
      // console.log(params,"params")
      that.$axios.post(url,params).then((res)=>{
        var result = res.data;
        // console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          // that.tableData = result.data.category;
          // console.log(result.data.teachers,"result.data.teachers;")
          that.teachersOption = result.data.teachers;
          for(var i=0;i<that.teachersOption.length;i++){
            // console.log(that.teachersOption[i].id,"that.teachersOption[i].id")
            that.teachersOption[i].value = that.teachersOption[i].id
            that.teachersOption[i].label = that.teachersOption[i].teacher.en_name
          }
        }
      });
    },
    openDialogModel(room_id,hour) {
      var that = this;
      that.room_id = room_id;
      that.hour = hour;
      // console.log(that.hour,"that.hour")
      if(that.weekth==""){
        that.$alert('请先选择排课周期', '提示');
        return;
      }
      if(that.teachersOption.length>0){

      }else{
        that.teachersOption = []
        that.coursesOption = []
        that.getTeacherList()
      }
      that.isShowPaikeDialog = true
    },
    editClass(){
      var that = this;
      // console.log(that.weekth.split(',')[0],"begin")
      // console.log(that.week,"week")
      var params = {
        time:parseInt(that.weekth.split(',')[0]) + oneDaySecond*(that.week-1) + that.hour*60*60,// 当前选择方块的时间戳，比如：2018年 9月 24号 1点的课程
        room_id:that.room_id,
        lesson_id: that.lession_id,
        course_id: that.course_id,
        school_id: that.schoole_id,
        teacher_id: that.teacherValue,
      }
      var url = editClassUrl;
      // console.log(params,"=========params============")

      that.$axios.post(url,params).then((res)=>{
        // console.log(res,"resresresres")
        var result = res.data;
        // console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          // console.log("success")
          that.getList();
          that.isShowPaikeDialog = false
        }else if(result.code == 433) {
          that.$alert(result.message, '提示');
        }
      });
    },
    initList(){
      var that = this;
      list = []
      for ( var i = 0; i < 12; i++) { //一维长度为8
        var item = {
          hour: i+9
        }
        var blocks = []
        for ( var j = 0; j < that.rooms.length; j++) {
          var block = {
            room_id: that.rooms[j].id,
            roomName: that.rooms[j].name,
            course:'',
            teacher:'',
            courseSerial:'',
            lessonSerial:'',
            lessonName:'',
            teacherName:'',
            hour:i+9,
            users_count:'',
            capacity:''
          }
          blocks.push(block)
        }
        item.blocks=blocks
        list.push(item)
      }
      that.list = list
    },
    changeBook() {
      // console.log(this.book,"book")
      if(this.book_value==2){
        this.book = "";
      }else{
        this.book = this.book_value;
      }
      this.getList();
    },
    getList() {
      var that = this;
      var params = {
        schoole_id: localStorage.getItem("_school_id"),
        weekth: that.weekth,
        week:that.week,
        book:that.book//0只显示未订课程  1只显示已定课程  不传全部都显示
      }
      var url = bookCourseListUrl;
      // console.log(params,"params")
      that.$axios.post(url,params).then((res)=>{
        console.log(res,"resresresresresresresresresresresresresresresresres")
        var result = res.data;
        // console.log(result,'--result--')
        if(result.code == ERR_OK){
          // that.tableData = result.data.category;
          var arranging = result.data;
          // console.log(arranging,"arranging");
          // console.log(Object.keys(arranging),"keys");
          var keys = Object.keys(arranging);
          var arr = [];
          for(var i=0;i<keys.length;i++){
            // console.log(arranging[keys[i]],"arranging")
            var obj = arranging[keys[i]];
            console.log(obj,"objobjobjobjobjobjobj")
            for(var j=0;j<obj.length;j++){
              var item = {
                week:obj[j].week,
                hour:obj[j].hour,
                lessonSerial:obj[j].course.serial,
                lessonName:obj[j].lesson.name,
                courseName:obj[j].course.name,
                teacherName:obj[j].teacher?obj[j].teacher.en_name:'',
                roomName:obj[j].room.name,
                is_released:obj[j].is_released,
                users_count:obj[j].users_count,
                capacity:obj[j].capacity,
                id:obj[j].id,
                area_id:obj[j].area_id
              }
              arr.push(item)
            }
          }
          that.initList();
          for(var i=0;i<arr.length;i++){
            // console.log(arr,"arr")
            // console.log(arr[i],"arr[i]")
            // console.log(arr[i].hour,"arr[i].hour")
            for(var j=0;j<list.length;j++){
              if(list[j].hour==arr[i].hour){
                for(var k=0;k<list[j].blocks.length;k++){
                  if(list[j].blocks[k].roomName==arr[i].roomName){
                    list[j].blocks[k].lessonSerial = arr[i].lessonSerial;
                    list[j].blocks[k].lessonName = arr[i].lessonName;
                    list[j].blocks[k].courseName = arr[i].courseName;
                    list[j].blocks[k].teacherName = arr[i].teacherName;
                    list[j].blocks[k].is_released = arr[i].is_released;
                    list[j].blocks[k].users_count = arr[i].users_count;
                    list[j].blocks[k].capacity = arr[i].capacity;
                    list[j].blocks[k].id = arr[i].id;
                    list[j].blocks[k].area_id = arr[i].area_id;
                  }
                }
              }
            }
          }
          that.list = list;
          // console.log(arr,"arr")
        }
      });
    },
    preparePublish() {
      var that = this;
      // if(that.time2){
      //   that.isShowPaikeDialog = true;
      // }else{
      //   that.$message("请选择排课周期")
      // }
    },
    publishEvent() {
      let that = this;
      var params = {
        schoole_id: localStorage.getItem("_school_id"),
        weekth: this.weekth
      }
      // Object.assign(params, params, p);
      var url = arrangingReleaseUrl;
      // console.log(params,"params")
      that.$axios.post(url,params).then((res)=>{
        var result = res.data;
        // console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          that.$message({
            type: 'success',
            message: '操作成功!'
          });
        }
      });
    },
    publish() {
      // arrangingReleaseUrl
      var that = this;
      this.$confirm('此操作将发布课程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.publishEvent()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    changeweek(){
      var that = this;
      // console.log(that.week,"week")
      if(that.weekth==""){
        that.$alert('请先选择排课周期', '提示');
      }else{
        that.getList()
      }
    }
  }
}
</script>