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
          <el-breadcrumb-item><span>退课列表</span></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="operateTableBox">
      <div class="functionBox">
        <div class="element">
          <label class="inline">学号：</label>
          <div class="inline">
             <el-input v-model="serial" size="medium" placeholder="请输入所要查询的学号"></el-input>
          </div>
          <div class="inline">
            <el-button type="primary" size="medium" @click="search">查询</el-button>
          </div>
        </div>
      </div>
      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="user.serial" label="学号" width="100">
        </el-table-column>
        <el-table-column
          prop="user.en_name"
          label="学生姓名">
        </el-table-column>
        <el-table-column
          prop="user.mobile"
          label="手机号码"
          width="120">
        </el-table-column>
        <el-table-column
          prop="arranging.updatad_at" label="退课时间" width='160'>
          <template slot-scope="scope">
              {{scope.row.arranging.updated_at}}
          </template>
        </el-table-column>
        <el-table-column prop="arranging.begin_time" label="上课时间" width="120">
          <template slot-scope="scope">
              {{scope.row.arranging.begin_time | filterTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="arranging.course.name"
          label="课程名称" width="140">
        </el-table-column>
         <el-table-column
          prop="arranging.lesson.name"
          label="话题名称" width="200">
        </el-table-column>
        <el-table-column
          prop="arranging.course.type_id"
          label="课程类型">
        </el-table-column>
        <el-table-column
          prop="name"
          label="是否本人退课"
          width="120">
        </el-table-column>
        <el-table-column
          prop="drop_people.en_name"
          label="退课人">
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button @click="operateBtn(scope.row,'agreeDrop')" type="text" size="small" icon="el-icon-edit-outline">同意</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="tableBottom" v-show="showPageTag">
        <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-size="pageSize" :page-sizes="[4,6,8]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div> -->
    </div>
  </div>
</template>
<script>
import { dropsListUrl,agreeDropUrl,ERR_OK } from '@/api/index'
import { getFullDate,getFullTime,getFullDateTime } from '@/common/js/utils'
export default {
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      total: 100,
      schoole_id: localStorage.getItem("_school_id"),
      showPageTag:false,
      serial: '',
      tableData: [],
      loading:true
    }
  },
  filters:{
    filterSex(t){
      return t==1?"男":"女"
    },
    filterDate(t){
      return getFullDate(t)
    },
    filterTime(t){
      return getFullDateTime(t)
    }
  },
  created() {
    this.getList()
  },
  methods: {
    operateBtn(row,operate) {
      var that = this
      var message = ''
      if(operate=='agreeDrop') {
        message=`此操作将同意${row.user.en_name}退课，是否继续？`
      }
      this.$confirm( message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.agreeDropEvent(row);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    agreeDropEvent(row) {
      let that = this;
      var params = {
        user_id: row.user.id,
        arranging_id: row.arranging_id
      }
      var url = agreeDropUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          that.getList();
          that.$message({
            showClose: true,
            message: '操作成功',
            type: 'success'
          });
        }
      }).catch(res=>{
        that.$message({
          showClose: true,
          message: '系统故障',
          type: 'warning'
        });
      });
    },
    search() {
      this.getList();
    },
    getList() {
      var that = this;
          that.loading=true;
      var params = {
        serial: that.serial
        // school_id: that.schoole_id
      }
      var url = dropsListUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          that.tableData = result.data;
          that.loading=false;
        }
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      // this.getList();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      console.log(val);
      // this.getList();
    }
  }
}
</script>


