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
          <el-breadcrumb-item><span>代退课</span></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="operateTableBox">
      <div class="functionBox">
        <div class="element">
           <label class="inline"></label>
          <div class="inline">
             <myTime v-model="time"></myTime>
          </div>
          <label class="inline margL20">学号：</label>
          <div class="inline">
             <el-input class="width160" v-model="no" size="medium" placeholder="请输入学号" clearable></el-input>
          </div>
          <label class="inline margL20">课程名称：</label>
          <div class="inline">
             <el-input v-model="courseName" size="medium" placeholder="请输入所要查询的课程名称" clearable></el-input>
          </div>
          <div class="inline">
            <el-button type="primary" size="medium" @click="search">查询</el-button>
          </div>
        </div>
      </div>
      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
         <el-table-column
          prop="user.contract_no"
          label="学号">
        </el-table-column>

        <el-table-column
          prop="user.en_name"
          label="订课学生">
        </el-table-column>
    
        <!-- <el-table-column
          prop="user.sex"
          label="性别">
            <template slot-scope="scope">
              {{scope.row.user.sex|filterSex}}
            </template>
        </el-table-column> -->
        <el-table-column prop="arranging.begin_time" label="订课时间" width="100">
          <template slot-scope="scope">
              {{scope.row.arranging.begin_time|filterDate}}
          </template>
        </el-table-column>
        <el-table-column
          prop="arranging.course.name"
          label="课程类型名称" width="160">
        </el-table-column>
        <el-table-column prop="arranging.lesson.name" label="话题" width="200">
          <template slot-scope="scope">
              <label class="ellipsis">{{scope.row.arranging.lesson.name}}</label>
          </template>
        </el-table-column>
        <el-table-column prop="arranging.school.name" label="校区" width="200">
          <!-- <template slot-scope="scope">
              <label class="ellipsis">{{scope.row.arranging.lesson.name}}</label>
          </template> -->
        </el-table-column>
        <el-table-column prop="arranging.begin_time" label="上课时间" width="140">
          <template slot-scope="scope">
              {{scope.row.arranging.begin_time|filterDate}} {{scope.row.arranging.hour}}点
          </template>
        </el-table-column>
        <el-table-column
          prop="arranging.room.name"
          label="教室名称">
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button @click="handleDropClick(scope.row)" type="text" size="small" icon="el-icon-close">退课</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="tableBottom" v-show="showPageTag">
        <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-size="pageSize" :page-sizes="[4,6,8,10]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { studentBookListUrl,dropArrangingUrl,ERR_OK } from '@/api/index'
import { getSex,getFullDate } from '@/common/js/utils'
import myTime from '@/components/time.vue'
export default {
  data() {
    return {
      loading: true,
      pageIndex: 1,
      pageSize: 10,
      total: 100,
      showPageTag:false,
      no: '',
      courseName: '',
      tableData: [],
      time:'',
    }
  },
  components:{
    myTime
  },
  watch:{
    time:function(){
        var that = this;

            that.$nextTick(function () {

                that.getList()

            });


    }
  },
  watch:{
    time:function(){
        var that = this;

            that.$nextTick(function () {

                that.getList()

            });


    }
  },
  created() {
    this.getList()
  },
  filters:{
    filterSex(t){
      return t==1?"男":"女"
    },
    filterDate(t){
      return getFullDate(t)
    }
  },
  methods: {
    handleDropClick(row) {
      var that = this;
      this.$confirm(`此操作将帮学生${row.user.en_name}退课, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.dropArrangingEvent(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    dropArrangingEvent(row) {
      var that = this;
      var params = {
        schoole_id: localStorage.getItem("_school_id"),
        user_id: row.user_id,
        arranging_id: row.arranging_id
      }
      var url = dropArrangingUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          that.getList();
          that.$message({
            type: 'success',
            message: '操作成功!'
          });
        }
      })
    },
    search() {
      this.getList()
    },
    getList() {
      var that = this;
      var params = {
        serial: that.no,
        course_name: that.courseName,
        offset: (that.pageIndex-1)*that.pageSize,
        limit: that.pageSize,
        weekth:that.time
      } 
      var url = studentBookListUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        that.loading = false;
        var result = res.data;
        console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          that.tableData = result.data.list;
          that.total = result.data.count;
          if(that.total<that.pageSize) {
            that.showPageTag = false;
          }else{
            that.showPageTag = true;
          }
        }
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      console.log(val);
      this.getList();
    }
  }
}
</script>


