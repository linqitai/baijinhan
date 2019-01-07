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
        <m-time @getTimeData="getTimeData"></m-time>
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
      <el-table :data="tableData" border style="width: 100%; margin-top: 12px;" v-loading="loading">
        <!-- <el-table-column
          prop="en_name"
          label="上课日期">
        </el-table-column> -->
        <el-table-column prop="begin_time" label="上课时间" width="160">
          <template slot-scope="scope">
              {{scope.row.begin_time | filterDateTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="course.name"
          label="课程名称">
        </el-table-column>
        <el-table-column
          prop="type.name"
          label="课程类型">
        </el-table-column>
        <el-table-column
          prop="role.name"
          label="已选人数">
        </el-table-column>
        <el-table-column prop="capacity" label="可选人数">
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-edit-outline" @click="alterSelectBtn(scope.row)">代订课</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="tableBottom" v-show="showPageTag">
        <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-size="pageSize" :page-sizes="[6,8,10]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
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
      pageSize: 6,
      total: 100,
      showPageTag:false,
      schoole_id: localStorage.getItem("_school_id"),
      weekth:'',
      courseValue: '',
      teacherValue: '',
      isShowPaikeDialog:false,
      week:1,
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
      arranging_id:""
    }
  },
  components: {
    mTime
  },
  created() {
    // this.getList();
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
      var params = {
        serial: that.serial,
      }
      var url = getStudentListUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
          var user = result.data.user;
          if(user.length>0) {
            that.en_name = user[0].en_name;
            that.user_id = user[0].id;
            // that.cn_name = user[0].cn_name;
            that.studentInfo = `英文名：${user[0].en_name},中文名：${user[0].cn_name}`
          }else{
            that.studentInfo = '并无此学生'
          }
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
        console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
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
      var params = {
        weekth: that.weekth,
        week:that.week,
        offset: (that.pageIndex-1)*that.pageSize,
        limit: that.pageSize
      }
      var url = alterSelectListUrl;
      console.log(params,"params")
      that.$axios.post(url,params).then((res)=>{
        that.loading = false;
        var result = res.data;
        console.log(result,'--result--')
        if(result.status_code == ERR_OK){
          that.tableData = result.data.list;
          that.total = result.data.count;
          if(that.total<that.pageSize) {
            that.showPageTag = false;
          }else{
            that.showPageTag = true;
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