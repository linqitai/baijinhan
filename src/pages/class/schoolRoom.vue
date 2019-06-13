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
          <el-breadcrumb-item><span class="nocurrent">校区</span></el-breadcrumb-item>
          <el-breadcrumb-item><span>校区教室</span></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="operateTableBox">
      <div class="functionBox">
        <div class="element">
          <div class="inline">
            <el-button type="primary" size="medium" @click="handleEditClick(null,'add')">新增</el-button>
          </div>
        </div>
      </div>
      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="school.name" label="校区">
        </el-table-column>
        <el-table-column
          prop="area.name"
          label="地区">
        </el-table-column>
        <el-table-column
          prop="name"
          label="教室名">
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="创建时间" width="160">
         <!--  <template slot-scope="scope">
            {{scope.row.is_use_level==1?'是':'否'}}
          </template> -->
        </el-table-column>
        <el-table-column
          prop="updated_at"
          label="修改时间" width="160">
          <!-- <template slot-scope="scope">
            {{scope.row.type | filterTeacherType}}
          </template> -->
        </el-table-column>
        <el-table-column prop="name" label="操作" width="160" fixed="right">
          <template slot-scope="scope">
            <el-button @click="handleEditClick(scope.row,'edit')" type="text" size="small" icon="el-icon-edit-outline">修改</el-button>
            <el-button @click="handleEditClick(scope.row,'delete')" type="text" size="small" icon="el-icon-edit-outline">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="tableBottom" v-show="showPageTag">
        <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-size="pageSize" :page-sizes="[6,8,10]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div> -->
    </div>
    <el-dialog :title="title" :visible.sync="isShowAddCourseDialog" :append-to-body="true" :fullscreen="false" width="500px">
      <div class="dialogBody">
        <div class="element margT10">
          <label class="inline">教室名：</label>
          <div class="inline">
            <el-input v-model="form.name" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline">上课点：</label>
          <div class="inline">
             <el-select v-model="form.school_id" placeholder="请选择校区">
            <el-option
              v-for="item in schools"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          </div>
        </div>
         
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAddCourseDialog = false">取 消</el-button>
        <el-button type="primary" @click="operateEvent">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { ERR_OK } from '@/api/index'
// import { getFullDate } from '@/common/js/utils'
import {roomListUrl,roomEditUrl,roomDeleteUrl,schoolListUrl,ERR_OK} from "@/api/index"
export default {
  data() {
    return {
      loading: true,
      pageIndex: 1,
      pageSize: 10,
      total: 100,
      showPageTag:false,
      course_id: '',
      title:'',
      tableData: [],
      isShowAddCourseDialog:false,
      form: {
        room_id:'',
        name:"",//ok
        school_id:""
      },
      schools:[]
    }
  },
  filters:{
    filterSchool(t){
     var schoolsOptions = JSON.parse(localStorage.getItem('_schoolsOptions'));
      for(var i=0;i<schoolsOptions.length;i++) {
        if(t==schoolsOptions[i].value) {
          console.log(schoolsOptions[i].name,"schoolsOptions[i].name")
          return schoolsOptions[i].name;
        }
      }
    },
    filterTeacherType(t){
      return t==1?'中教':t==2?'外教':t==3?'中外教':t==4?'班主任':''
    }
  },
  created() {
    this.getList()
    this.getSchoolList()
  },
  methods: {
    search() {
      this.getList();
    },
    handleEditClick(row,operate) {
      if(operate == 'delete') {
        var that = this
        this.$confirm(`此操作将删除${row.name}教室, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.deleteEvent(row);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        return; 
      }
      this.isShowAddCourseDialog = true;
      if(operate == 'edit') {
        this.form.school_id = row.school_id;
        this.form.room_id = row.id;
        this.form.name = row.name;
      }else if(operate == 'add') {

        this.form.school_id = '';
        this.form.room_id = '';
        this.form.name = '';
      }
    },
    deleteEvent(row) {
      let that = this;
      var params = {
         room_id:row.id
      }
      var url = roomDeleteUrl;
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
      });
    },
    operateEvent() {
      let that = this;
      var params = that.form;
      var url = roomEditUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          // that.tableData = result.data.course;
          that.isShowAddCourseDialog = false;
          that.getList();
          that.$message({
            message: '操作成功',
            type: 'success'
          });
        }
      });
    },
    getList() {
      let that = this;
      var params = {
        // offset: (that.pageIndex-1)*that.pageSize,
        // limit: that.pageSize
      }
      var url = roomListUrl;
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
      });
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
    },
    //校区
    getSchoolList()
    {
      let that = this;
      var url = schoolListUrl;
      this.$axios.post(url).then((res)=>{
        var result = res.data;
        if(result.code == ERR_OK){
          that.schools = result.data.school;
        }
      });
    }
  }
}
</script>
