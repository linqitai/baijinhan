<style lang="scss" scoped>
@import '../../common/scss/common.scss';
$height:50px;
.apply{
  .operateTableBox{
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
.table{
  li{
    border:solid grey
  }
}
.calendar{
  padding:20px; 
}
 .el-row {
    margin-bottom: 10px;
    border-bottom: solid #000 1px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    line-height: 36px;
    text-align: center;
    width: 50px
  }
  .grid-content2 {
    // border-radius: 4px;
    min-height: 26px;
    line-height: 26px;
    text-align: center;
    width: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space:nowrap; //溢出不换行
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
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
          <el-breadcrumb-item><span>代订课</span></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="operateTableBox">
      <div class="functionBox">
        <m-time v-model="weekth"></m-time>
        <div class="element margT10">
          <label class="inline">学号：</label>
          <div class="inline width120">
             <el-input v-model="serial" size="medium" placeholder="请输入学号" clearable></el-input>
          </div>
          <label class="inline">{{studentInfo}}</label>
          <div class="inline">
            <el-button type="primary" size="medium" @click="searchBySerial">查询</el-button>
          </div>
        </div>
      </div>
      <div style="margin-top: 10px;margin-left: 6px;">
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
       <div class="calendar">
        <!-- 小时 -->
        <el-row class="table" v-for="item in hours" :key="item.value" :gutter="8">
          <el-col :span="2">
            <div class="grid-content bg-purple">
            {{item.label}}
            </div>
          </el-col>
          <el-col :span="1" v-for="subItem in item.data" :key="subItem.id" style="width:200px">
             <div class="grid-content2 bg-purple" style="width:200px">
               {{subItem.course.name}}
            </div>
              <div class="grid-content2 bg-purple" style="width:200px">
               {{subItem.lesson.name}}
            </div>
              <div class="grid-content2 bg-purple" style="width:200px">
               {{subItem.teacher.en_name}}
            </div>
              <div class="grid-content2 bg-purple" style="width:200px">
               {{subItem.users_count}} / {{subItem.capacity}}
            </div>
          </el-col>
        </el-row>
       </div>
    </div>
  </div>
</template>
<script>
import { alterSelectUrl,getStudentListUrl,alterSelectListUrl,ERR_OK } from '@/api/index'
import { getFullDate,getTime,getDay,getDaysInYearMonth,getMonth,getTodayDate,getFullDateTime } from '@/common/js/utils'
import mTime from '../../components/time.vue'
// 一天有多少毫秒
var oneDayTime = 24*60*60*1000
var oneDaySecond = 24*60*60
var list = []
export default {
  data() {
    return {
      loading:true,
      pageIndex: 1,
      pageSize: 10,
      total: 100,
      showPageTag:false,
      weekth:'',
      courseValue: '',
      teacherValue: '',
      isShowPaikeDialog:false,
      week:(new Date()).getDay()==0?7:(new Date()).getDay(),
      hours:[
        {value:9,label:"9:00",data:[]},
        {value:10,label:"10:00",data:[]},
        {value:11,label:"11:00",data:[]},
        {value:12,label:"12:00",data:[]},
        {value:13,label:"13:00",data:[]},
        {value:14,label:"14:00",data:[]},
        {value:15,label:"15:00",data:[]},
        {value:16,label:"16:00",data:[]},
        {value:17,label:"17:00",data:[]},
        {value:18,label:"18:00",data:[]},
        {value:18.5,label:"18:30",data:[]},
        {value:19,label:"19:00",data:[]},
        {value:20,label:"20:00",data:[]},
      ],
      time1Options:[],
      time2Options:[],
      time1:"",
      time2:"",
      tableData:[],
      hour:'',
      room_id:'',
      lession_id:'',
      course_id:'',
      book_value:'',
      book:'1',
      studentInfo:"",
      serial:"",
      en_name:"",
      user_id:"",
      arranging_id:"",
      level_id:''
    }
  },
  components: {
    mTime
  },
  watch:{
      weekth:function(){
        var that = this;

            that.$nextTick(function () {

                that.getList()

            });


    }
  },
  created() {
    this.getList();
  },
  filters:{
    filterDateTime(t){
      return getFullDateTime(t)
    }
  },
  methods: {
  	getTimeData() {
      this.weekth = this.$cookie.get("_weekth")
      // console.log(this.weekth,"this.weekth")
      this.getList()
    },
    searchBySerial() {
      var that = this;
      if(that.serial=='') {
        that.$alert('请先输入学号', '提示');
      }
      var params = {
        serial: that.serial,
      }
      var url = getStudentListUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          var user = result.data.user;
          console.log(user,"useruser")
          if(user.length>0) {
            that.en_name = user[0].en_name;
            that.user_id = user[0].id;
            that.level_id = user[0].level.id;
            console.log(that.level_id,"level_id")
            // that.cn_name = user[0].cn_name;
            that.studentInfo = `英文名：${user[0].en_name},中文名：${user[0].cn_name}`
          }else{
            that.studentInfo = '并无此学生'
          }
          that.getList()
        }
      })
    },
    alterSelectBtn(row) {
      var that = this
      console.log(this.serial,"this.serial")
      console.log(this.en_name,"this.en_name")
      if(this.serial&&this.en_name){

      }else{
        that.$alert('请先根据学号查询出代订课的学生', '提示');
        return;
      }
      this.arranging_id = row.id
      this.$confirm(`确定要为${this.en_name}订课?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.alterSelectEvent(row);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    alterSelectEvent(row) {
      var that = this;
      var params = {
        time:row.begin_time,
        user_id: that.user_id,
        arranging_id: that.arranging_id
      }
      var url = alterSelectUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          that.getList()
          // var user = result.data.user;
          this.$message({
            type: 'success',
            message: '操作成功'
          }); 
        }
      })
    },
    getList() {
      var that = this;
      this.hours=[
        {value:9,label:"9:00",data:[]},
        {value:10,label:"10:00",data:[]},
        {value:11,label:"11:00",data:[]},
        {value:12,label:"12:00",data:[]},
        {value:13,label:"13:00",data:[]},
        {value:14,label:"14:00",data:[]},
        {value:15,label:"15:00",data:[]},
        {value:16,label:"16:00",data:[]},
        {value:17,label:"17:00",data:[]},
        {value:18,label:"18:00",data:[]},
        {value:18.5,label:"18:30",data:[]},
        {value:19,label:"19:00",data:[]},
        {value:20,label:"20:00",data:[]},
      ];
      var params = {
        weekth: that.weekth,
        level_id: that.level_id,
        week: that.week,
        offset: (that.pageIndex-1)*that.pageSize,
        limit: that.pageSize,
        user_id:that.user_id
      }
      var url = alterSelectListUrl;
      console.log(params,"params")
      that.$axios.post(url,params).then((res)=>{
        that.loading = false;
        var result = res.data;
        console.log(result,'--result--')
        if(result.code == ERR_OK){
          // that.tableData = result.data.list;
          // that.total = result.data.count;
          // if(that.total<that.pageSize) {
          //   that.showPageTag = false;
          // }else{
          //   that.showPageTag = true;
          // }
          let data = result.data;
          for(var i=0;i<data.length;i++){
              for(var j=0;j<this.hours.length;j++){
                console.log(this.hours[j].value,data[i].hour,'12312');
                 if(this.hours[j].value == data[i].hour){
                   console.log('123');
                   this.hours[j].data.push(data[i]);
                 }
              }
          }
        }
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
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      // console.log(val);
      this.getList();
    }
  }
}
</script>