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
            <el-button type="primary" size="medium" @click="handleEditClick(null,'add')">新增</el-button>
          </div>
          <label class="inline margL20">课程编号：</label>
          <div class="inline">
             <el-input v-model="course_id" size="medium" placeholder="查询内容" clearable></el-input>
          </div>
          <div class="inline">
            <el-button type="primary" size="medium" @click="search">查询</el-button>
          </div>
        </div>
      </div>
      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column
          prop="area.name"
          label="地区">
          <!-- <template slot-scope="scope">
              {{scope.row.area.name}}
           </template> -->
        </el-table-column>
        <el-table-column prop="name" label="课程名称" width="160">
           <template slot-scope="scope">
              {{scope.row.serial}}({{scope.row.name}})
           </template>
        </el-table-column>
        <el-table-column
          prop="absent_count"
          label="允许缺课次数" width="110">
        </el-table-column>
        <el-table-column
          prop="selection_count"
          label="最大选课次数" width="110">
        </el-table-column>
        <el-table-column
          prop="capacity"
          label="课程容量">
        </el-table-column>
        <el-table-column
          prop="is_use_level"
          label="是否区分等级" width="110">
          <template slot-scope="scope">
            {{scope.row.is_use_level==1?'是':'否'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="课程教师类型" width="110">
          <template slot-scope="scope">
            {{scope.row.type | filterTeacherType}}
          </template>
        </el-table-column>
        <el-table-column
          prop="is_use_level"
          label="是否区分等级" width="110">
          <template slot-scope="scope">
            {{scope.row.is_auth_drop==1?'允许':scope.row.is_auth_drop==2?'不允许':''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="reservation"
          label="无需预订">
          <template slot-scope="scope">
              {{scope.row.reservation==1?'是':'否'}}
           </template>
        </el-table-column>
        <el-table-column prop="name" label="操作" width="160" fixed="right">
          <template slot-scope="scope">
            <el-button @click="handleDetailClick(scope.row)" type="text" size="small" icon="el-icon-view">查看</el-button>
            <el-button @click="handleEditClick(scope.row,'edit')" type="text" size="small" icon="el-icon-edit-outline">修改</el-button>
            <el-button @click="handleDeleteClick(scope.row)" type="text" size="small" icon="el-icon-close">{{scope.row.is_deleted==0?'删除':'恢复'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="tableBottom" v-show="showPageTag">
        <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-size="pageSize" :page-sizes="[6,8,10]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="isShowAddCourseDialog" :append-to-body="true" :fullscreen="false" width="500px">
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
        <!-- <div class="element margT10">
          <label class="inline">课程类型：</label>
          <div class="inline">
            <el-select class="width140" size="medium" v-model="form.type_id" placeholder="请选择">
              <el-option
                v-for="item in courseTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div> -->
        <div class="element margT10">
          <label class="inline">课程名称：</label>
          <div class="inline">
             <el-input v-model="form.name" size="medium" placeholder="请输入内容"></el-input>
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
            <el-select class="width140" size="medium" v-model="form.type" placeholder="请选择">
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
          <label class="inline">课程容量：</label>
          <div class="inline">
             <el-input v-model="form.capacity" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline">允许选课次数：</label>
          <div class="inline">
             <el-input v-model="form.selection_count" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline">允许缺课次数：</label>
          <div class="inline">
             <el-input v-model="form.absent_count" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline">是否区分课程等级：</label>
          <div class="inline">
             <!-- <el-input v-model="form.is_use_level" size="medium" placeholder="请输入内容"></el-input> -->
             <el-select class="width140" size="medium" v-model="form.is_use_level" placeholder="请选择">
              <el-option
                v-for="item in is_use_levelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline">是否允许自助退课：</label>
          <div class="inline">
             <!-- <el-input v-model="form.is_auth_drop" size="medium" placeholder="请输入内容"></el-input> -->
             <el-select class="width140" size="medium" v-model="form.is_auth_drop" placeholder="请选择">
              <el-option
                v-for="item in is_auth_dropOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
      loading: true,
      pageIndex: 1,
      pageSize: 10,
      total: 100,
      showPageTag:false,
      course_id: '',
      title:'',
      tableData: [],
      isShowAddCourseDialog:false,
      schoolOptions:JSON.parse(localStorage.getItem('_schoolsOptions')),
      levelOptions:[],
      is_use_levelOptions:[{label:'是',value:1},{label:'不是',value:2}],
      is_auth_dropOptions:[{label:'允许',value:1},{label:'不允许',value:0}],
      courseTypeOptions:[],// t==1?'中教':t==2?'外教':t==3?'中外教':t==4?'班主任':''
      teacherTypeOptions:[{label:'中教',value:1},{label:'外教',value:2},{label:'中外教',value:3},{label:'班主任',value:4}],
      form: {
        school_id:localStorage.getItem("_school_id"),
        course_id:"",//OK
        serial:'',
        total:'',
        level_id:"",//ok
        type:"",//ok
        name:"",//ok
        teacher_type_id:'',//ok
        capacity:'',//ok
        absent_count:'',
        selection_count:'',
        is_use_level:'',
        is_auth_drop:'',
        introduction:'',//ok
        teacher_type_id:'',
        reservation:false//ok 0不需要1需要
      }
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
    console.log(this.schoolOptions,"schoolOptions")
    this.getCourseLevelList();
    // this.getCourseTypeList();
    // this.getTeacherTypeList();
  },
  methods: {
    search() {
      this.getList();
    },
    handleEditClick(row,operate) {
      this.isShowAddCourseDialog = true;
      if(operate == 'edit') {
        this.title = '编辑课程'
        this.form.course_id = row.id;
        this.form.level_id = row.level_id;
        this.form.type = row.type; // =========================
        this.form.name = row.name;
        this.form.serial = row.serial;
        this.form.total = row.total;
        this.form.teacher_type_id = row.type_id;
        this.form.capacity = row.capacity;
        this.form.absent_count = row.absent_count ;
        this.form.selection_count = row.selection_count;
        this.form.is_use_level = row.is_use_level;
        this.form.is_auth_drop = row.is_auth_drop;
        this.form.introduction = row.introduction;
        this.form.reservation = row.reservation?true:false;
        console.log(this.form,"formformformformformform")
      }else{
        this.title = '新增课程'
        this.form.course_id = '';
        this.form.level_id = '';
        this.form.type = '';
        this.form.name = '';
        this.form.serial = '';
        this.form.total = '';
        this.form.teacher_type_id = '';
        this.form.capacity = '';
        this.form.absent_count = '';
        this.form.selection_count = '';
        this.form.is_use_level = '';
        this.form.is_auth_drop = '';
        this.form.introduction = '';
        this.form.reservation = false;
      }
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
        console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
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
        console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          // that.tableData = result.data.course;
          that.levelOptions = result.data.list;
          for(var i=0;i<that.levelOptions.length;i++){
            that.levelOptions[i].label = that.levelOptions[i].name
            that.levelOptions[i].value = that.levelOptions[i].id
          }
          console.log(that.levelOptions,"levelOptions")
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
        schoole_id: localStorage.getItem("_school_id"),
        course_id: row.id,
        is_deleted: row.is_deleted==0?1:0
      }
      var url = courseDeleteUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
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
        course_id:this.course_id,
        offset: (that.pageIndex-1)*that.pageSize,
        limit: that.pageSize
      }
      var url = courseListUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        that.loading = false;
        var result = res.data;
        console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
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


