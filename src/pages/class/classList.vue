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
          <el-breadcrumb-item><span>课程列表</span></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="operateTableBox">
      <div class="functionBox">
        <div class="element">
          <div class="inline">
            <el-button type="primary" size="medium" @click="addBtn">新增</el-button>
          </div>
          <label class="inline margL20">课程名：</label>
          <div class="inline">
             <el-input v-model="name" size="medium" placeholder="请输入所要查询的课程名"></el-input>
          </div>
          <div class="inline">
            <el-button type="primary" size="medium" @click="search">查询</el-button>
          </div>
        </div>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column
          prop="school_id"
          label="校区">
        </el-table-column>
        <el-table-column prop="name" label="课程名称" width="200">
           <template slot-scope="scope">
              {{scope.row.serial}}({{scope.row.name}})
           </template>
        </el-table-column>
        <el-table-column
          prop="level.name"
          label="课程级别">
        </el-table-column>
        <el-table-column
          prop="type.name"
          label="课程类型">
        </el-table-column>
        <el-table-column
          prop="total"
          label="课程人数">
        </el-table-column>
        <el-table-column
          prop="reservation"
          label="无需预订">
          <template slot-scope="scope">
              {{scope.row.reservation==1?'是':'否'}}
           </template>
        </el-table-column>
        <el-table-column prop="name" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="handleDetailClick(scope.row)" type="text" size="small" icon="el-icon-view">查看</el-button>
            <el-button @click="handleEditClick(scope.row)" type="text" size="small" icon="el-icon-edit-outline">修改</el-button>
            <el-button @click="handleDeleteClick(scope.row)" type="text" size="small" icon="el-icon-close">{{scope.row.is_deleted==0?'删除':'恢复'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="tableBottom" v-show="showPageTag">
        <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-size="pageSize" :page-sizes="[6,8,10]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="新增课程" :visible.sync="isShowAddCourseDialog" :append-to-body="true" :fullscreen="false" width="500px">
      <div class="dialogBody">
        <div class="element margT10">
          <label class="inline">级别名称：</label>
          <div class="inline">
             <!-- <el-input v-model="lesson_id" size="medium" placeholder="请输入内容"></el-input> -->
             <el-select class="width200" size="medium" v-model="form.level_id" placeholder="请选择">
              <el-option
                v-for="item in levelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline">课程类型：</label>
          <div class="inline">
             <!-- <el-input v-model="room_id" size="medium" placeholder="请输入内容"></el-input> -->
             <el-select class="width140" size="medium" v-model="form.type_id" placeholder="请选择">
              <el-option
                v-for="item in courseTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline">课程名称：</label>
          <div class="inline">
             <el-input v-model="form.name" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline">课程编号：</label>
          <div class="inline">
             <el-input v-model="form.serial" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline">课程节数：</label>
          <div class="inline">
             <el-input v-model="form.total" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline">教师类型：</label>
          <div class="inline">
            <el-select class="width140" size="medium" v-model="form.teacher_type_id" placeholder="请选择">
              <el-option
                v-for="item in teacherTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline">课程人数：</label>
          <div class="inline">
             <el-input v-model="form.capacity" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline">课程描述：</label>
          <div class="inline">
             <el-input v-model="form.introduction" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline">无须预订：</label>
          <div class="inline">
            <el-checkbox v-model="form.reservation"></el-checkbox>
             <!-- <el-input v-model="form.reservation" size="medium" placeholder="请输入内容"></el-input> -->
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAddCourseDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCourseEvent">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { ERR_OK } from '@/api/index'
// import { getFullDate } from '@/common/js/utils'
import {courseListUrl,courseEditUrl,courseLevelListUrl,courseTypeListUrl,teacherTypeListUrl,courseDeleteUrl,ERR_OK} from "@/api/index"
export default {
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      total: 100,
      showPageTag:true,
      name: '',
      tableData: [],
      isShowAddCourseDialog:false,
      schoolOptions:[],
      levelOptions:[],
      courseTypeOptions:[],
      teacherTypeOptions:[],
      form: {
        school_id:localStorage.getItem("_school_id"),
        course_id:"",//OK
        serial:'',
        total:'',
        level_id:"",//ok
        type_id:"",//ok
        name:"",//ok
        teacher_type_id:'',//ok
        capacity:'',//ok
        introduction:'',//ok
        teacher_type_id:'',
        reservation:false//ok 0不需要1需要
      }
    }
  },
  created() {
    this.getList()

    this.getCourseLevelList();
    this.getCourseTypeList();
    this.getTeacherTypeList();
  },
  methods: {
    search() {
      this.getList();
    },
    handleEditClick(row) {
      this.isShowAddCourseDialog = true;

      this.form.course_id = row.id;
      this.form.level_id = row.level.id;
      this.form.type_id = row.type.id;
      this.form.name = row.name;
      this.form.serial = row.serial;
      this.form.total = row.total;
      this.form.teacher_type_id = row.type_id;
      this.form.capacity = row.capacity;
      this.form.introduction = row.introduction;
      this.form.reservation = row.reservation?true:false;
    },
    addBtn(){
      this.isShowAddCourseDialog = true;
    },
    getTeacherTypeList() {
      let that = this;
      var params = {
        school_id: this.form.school_id
      }
      var url = teacherTypeListUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
          // that.tableData = result.data.course;
          that.teacherTypeOptions = result.data;
          for(var i=0;i<that.teacherTypeOptions.length;i++){
            that.teacherTypeOptions[i].label = that.teacherTypeOptions[i].name
            that.teacherTypeOptions[i].value = that.teacherTypeOptions[i].id
          }
        }
      });
    },
    getCourseTypeList() {
      let that = this;
      var params = {
        school_id: this.form.school_id
      }
      var url = courseTypeListUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
          // that.tableData = result.data.course;
          that.courseTypeOptions = result.data;
          for(var i=0;i<that.courseTypeOptions.length;i++){
            that.courseTypeOptions[i].label = that.courseTypeOptions[i].name
            that.courseTypeOptions[i].value = that.courseTypeOptions[i].id
          }
        }
      });
    },
    getCourseLevelList() {
      let that = this;
      var params = {
        school_id: this.form.school_id
      }
      var url = courseLevelListUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
          // that.tableData = result.data.course;
          that.levelOptions = result.data;
          for(var i=0;i<that.levelOptions.length;i++){
            that.levelOptions[i].label = that.levelOptions[i].name
            that.levelOptions[i].value = that.levelOptions[i].id
          }
        }
      });
    },
    addCourseEvent() {
      let that = this;
      var params = that.form;
      params.reservation = params.reservation?1:0;
      var url = courseEditUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
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
    handleDetailClick(row) {
      var course_id = row.id;
      var coursename = row.name
      this.$cookie.set('course_id',course_id)
      this.$cookie.set('coursename',coursename)
      console.log(course_id,coursename)
      this.$router.push({
        path:'/lessonOneList'
      })
    },
    handleDeleteClick(row) {
      var that = this;
      var status = ""
      if(row.is_deleted==0){
        status = '删除'
      }else{
        status = '恢复'
      }
      that.$confirm(`此操作将此数据设置成${status}状态, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.delete(row);
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消操作'
          });          
        });
    },
    delete(row) {
      let that = this;
      var params = {
        course_id: row.id,
        is_deleted: row.is_deleted==0?1:0
      }
      var url = courseDeleteUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
          // that.tableData = result.data.course;
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
        name:this.name,
        school_id: this.form.school_id,
        offset: (that.pageIndex-1)*that.pageSize,
        limit: that.pageSize
      }
      var url = courseListUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
          that.tableData = result.data.course;
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
    }
  }
}
</script>


