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
          <el-breadcrumb-item><span>话题列表</span></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="operateTableBox">
      <search-condition @clickSearchData="search">
        <div class="element">
          <div class="inline">
            <el-button type="primary" size="medium" @click="operateBtn(null,'add')">新增</el-button>
          </div>
        </div>
        <div class="element">
          <p class="inline">话题名称</p>
          <div class="inline">
             <el-input v-model="name" size="medium" placeholder="请输入内容" clearable></el-input>
          </div>
        </div>
        <div class="element">
          <label class="inline">课程名称：</label>
          <div class="inline width160">
            <el-select class="" size="medium" v-model="course_id" placeholder="请选择" clearable>
              <el-option
                v-for="item in courseOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="element">
          <label class="inline">课程等级：</label>
          <div class="inline width140">
            <el-select class="" size="medium" v-model="course_level_id" placeholder="请选择" clearable>
              <el-option
                v-for="item in courseLevelOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
      </search-condition>

      <el-table :data="tableData" border style="width: 100%"  v-loading="loading">
        <el-table-column prop="name" label="话题名称" width="180">
          <template slot-scope="scope">
            <label class="ellipsis">{{scope.row.name}}</label>
          </template>
        </el-table-column>
        <el-table-column prop="course.name" label="课程" width="160"></el-table-column>
        <el-table-column prop="level.name" label="等级"></el-table-column>
        <el-table-column prop="capacity" label="选课上限"></el-table-column>
        <el-table-column prop="teacher_type" label="教师类型"></el-table-column>
        <el-table-column prop="introduce" label="话题简介" width="200">
          <template slot-scope="scope">
            <label class="ellipsis">{{scope.row.introduce}}</label>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="话题顺序">
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="160"></el-table-column>
        <el-table-column prop="name" label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button @click="operateBtn(scope.row,'edit')" type="text" size="small" icon="el-icon-edit-outline">修改</el-button>
            <el-button @click="handleDeleteClick(scope.row)" type="text" size="small" icon="el-icon-close">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="tableBottom" v-show="showPageTag">
        <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-size="pageSize" :page-sizes="[6,8,10]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="dialogAddFormVisible" :append-to-body="true" :fullscreen="false" width="500px">
      <div class="dialogBody">
        <div class="element">
          <label class="inline width80">课程等级：</label>
          <div class="inline">
            <!-- <el-input v-model="form.course_id" size="medium" placeholder="请输入内容"></el-input> -->
            <el-select class="" size="medium" v-model="form.course_level_id" placeholder="请选择" clearable>
              <el-option
                v-for="item in courseLevelOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="element margT20">
          <label class="inline width80">课程名称：</label>
          <div class="inline">
            <!-- <el-input v-model="form.course_id" size="medium" placeholder="请输入内容"></el-input> -->
            <el-select class="" size="medium" v-model="form.course_id" placeholder="请选择" clearable>
              <el-option
                v-for="item in courseOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="element margT20">
          <label class="inline width80">话题名称：</label>
          <div class="inline">
             <el-input v-model="form.name" size="medium" placeholder="请输入内容" clearable></el-input>
          </div>
        </div>
        <div class="element margT20">
          <label class="inline width80">教师：</label>
          <div class="inline">
            <!-- <el-input v-model="form.course_id" size="medium" placeholder="请输入内容"></el-input> -->
            <el-select class="inputTitle" v-model="form.type" placeholder="请选择" clearable>
              <el-option
                v-for="item in teacherTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="element margT20">
          <label class="inline width80">选课上限：</label>
          <div class="inline">
             <el-input v-model="form.capacity" size="medium" placeholder="请输入内容" clearable></el-input>
          </div>
        </div>
        <div class="element margT20">
          <label class="inline width80">排序：</label>
          <div class="inline">
             <el-input v-model="form.sort" size="medium" placeholder="请输入内容" clearable></el-input>
          </div>
        </div>
        <div class="element margT20">
          <label class="inline width80">话题介绍：</label>
          <div class="inline">
             <el-input v-model="form.introduce" size="medium" placeholder="请输入内容" clearable></el-input>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureEvent">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { lessonListUrl,lessonEditUrl,lessonDeleteUrl,getCourseListUrl,courseLevelListUrl,lessonSearchUrl,ERR_OK } from '@/api/index'
import { getTeacherTypeOptions } from '@/common/js/teacherType'
import { formClear } from '@/common/js/utils'
import searchCondition from 'components/searchCondition.vue'
export default {
  data() {
    return {
      loading: true,
      pageIndex: 1, // offset/10+1
      pageSize: 8,
      total: 100,
      title:'',
      dialogFormVisible: false,
      dialogAddFormVisible: false,
      formLabelWidth: '120px',
      showPageTag: false,
      tableData:[],
      courseOptions:[],
      courseLevelOption:[],// t==1?'中教':t==2?'外教':t==3?'中外教':t==4?'班主任':''
      teacherTypeOptions:getTeacherTypeOptions(),
      lessonOption:[],
      form: {
        lesson_id:"",
        course_level_id:'',
        course_id:"",
        type:"",
        capacity:'',
        name:"",
        sort:"",
        introduce:""
      },
      name:'',
      course_id:'',
      course_level_id:'',
      operate:'',
      schoole_id: localStorage.getItem("_school_id")
    }
  },
  created() {
    this.getList();
    this.getCourseList();
    this.getCourseLevelList();
  },
  components: {
    searchCondition
  },
  methods: {
    search() {
      this.getList();
    },
    operateBtn(row,operate) {
      var that = this;
      this.operate = operate;
      if(operate=='add') {
        that.title="新增话题"
        formClear(that.form);
      }else{
        that.title="编辑话题"
        that.form = {
          lesson_id:row.id,
          course_level_id:row.level.id,
          course_id:row.course_id,
          type:row.course.type,
          capacity:row.capacity,
          name:row.name,
          sort:row.sort,
          introduce:row.introduce
        }
      }
      this.dialogAddFormVisible = true;
    },
    sureEvent() {
      let that = this;
      var params = that.form;
      this.operate=='add'?params.lesson_id='':'';
      var url = lessonEditUrl;
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
          that.dialogAddFormVisible = false;   
        }else{
          that.$alert('系统出错，请向技术人员汇报', '提示');
        }
      }).catch(error => {
        that.$alert('系统出错，请向技术人员汇报', '提示');
      })
    },
    getCourseLevelList() {
      let that = this;
      var params = {
      }
      var url = courseLevelListUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          that.courseLevelOption = result.data.list;
          for(var i=0;i<that.courseLevelOption.length;i++){
             that.courseLevelOption[i].value = that.courseLevelOption[i].id
             that.courseLevelOption[i].label = that.courseLevelOption[i].name
          }
        }
      });
    },
    courseLevelChange(){
      // this.form.name = "";
      // this.getlessonList();
    },
    courseChange(){
      // this.form.name = "";
      // this.getlessonList();
    },
    getlessonList() {
      let that = this;
      var params = {
        course_id: that.form.course_id,
        course_level_id: that.form.course_level_id
      }
      var url = lessonSearchUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        // console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          that.lessonOption = result.data.lesson;
          for(var i=0;i<that.lessonOption.length;i++){
            that.lessonOption[i].label = that.lessonOption[i].name;
            that.lessonOption[i].value = that.lessonOption[i].id;
          }
        }
      });
    },
    getCourseList() {
      let that = this;
      var params = {
        school_id: that.school_id
      }
      var url = getCourseListUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          that.courseOptions = result.data.course;
          for(var i=0;i<that.courseOptions.length;i++){
            that.courseOptions[i].label = that.courseOptions[i].name
            that.courseOptions[i].value = that.courseOptions[i].id
          }
        }
      });
    },
    delete() {
      let that = this;
      var params = {
        schoole_id: localStorage.getItem("_school_id"),
        lesson_id: this.form.lesson_id,
        is_deleted: 1
      }
      var url = lessonDeleteUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          that.getList();
          that.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          });
          that.dialogFormVisible = false;        
          that.form =  {
            course_id:"",
            name:"",
            serial:"",
            introduce:""
          }
        }
      });
    },
    getList() {
      let that = this;
      var params = {
        name:that.name,
        course_id:that.course_id,
        course_level_id:that.course_level_id,
        offset: (that.pageIndex-1)*that.pageSize,
        limit: that.pageSize,
      }
      var url = lessonListUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        that.loading = false;
        var result = res.data;
        console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          that.tableData = result.data.lesson;
          that.total = result.data.count || 100;
          if(that.total<that.pageSize) {
            that.showPageTag = false;
          }else{
            that.showPageTag = true;
          }
        }
      });
    },
    handleDeleteClick(row) {
      var that = this
      this.form.lesson_id = row.id
      this.$confirm(`此操作将永久删除话题${row.name}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.delete();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
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


