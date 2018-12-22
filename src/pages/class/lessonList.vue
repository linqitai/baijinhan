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
      <div class="functionBox">
        <div class="element">
          <div class="inline">
            <el-button type="primary" size="medium" @click="addBtn">新增</el-button>
          </div>
          <label class="inline margL20">话题名称：</label>
          <div class="inline">
             <el-input v-model="name" size="medium" placeholder="请输入所要查询的姓名"></el-input>
          </div>
          <div class="inline">
            <el-button type="primary" size="medium" @click="search">查询</el-button>
          </div>
        </div>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="话题名称" width="180">
        </el-table-column>
        <el-table-column prop="serial" label="话题编号">
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="160">
        </el-table-column>
        <el-table-column prop="introduce" label="话题简介">
        </el-table-column>
        <el-table-column prop="sort" label="话题顺序">
        </el-table-column>
        <el-table-column prop="name" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="handleEditClick(scope.row)" type="text" size="small" icon="el-icon-edit-outline">修改</el-button>
            <el-button @click="handleDeleteClick(scope.row)" type="text" size="small" icon="el-icon-close">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="tableBottom" v-show="showPageTag">
        <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-size="pageSize" :page-sizes="[6,8,10]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="新增话题" :visible.sync="dialogAddFormVisible" :append-to-body="true" :fullscreen="false" width="500px">
      <div class="dialogBody">
        <div class="element">
          <label class="inline">课程名称：</label>
          <div class="inline">
            <!-- <el-input v-model="form.course_id" size="medium" placeholder="请输入内容"></el-input> -->
            <el-select class="width120" size="medium" v-model="form.course_id" placeholder="请选择">
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
          <label class="inline">话题名称：</label>
          <div class="inline">
             <el-input v-model="form.name" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="element margT20">
          <label class="inline">话题编号：</label>
          <div class="inline">
             <el-input v-model="form.serial" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="element margT20">
          <label class="inline width70">排序：</label>
          <div class="inline">
             <el-input v-model="form.sort" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="element margT20">
          <label class="inline">话题介绍：</label>
          <div class="inline">
             <el-input v-model="form.introduce" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureEdit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改话题" :visible.sync="dialogFormVisible" :append-to-body="true" :fullscreen="false" width="500px">
      <div class="dialogBody">
        <div class="element">
          <label class="inline">话题名称：</label>
          <div class="inline">
             <el-input v-model="form.name" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="element margT20">
          <label class="inline">话题编号：</label>
          <div class="inline">
             <el-input v-model="form.serial" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="element margT20">
          <label class="inline width70">排序：</label>
          <div class="inline">
             <el-input v-model="form.sort" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="element margT20">
          <label class="inline">话题介绍：</label>
          <div class="inline">
             <el-input v-model="form.introduce" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { lessonListUrl,lessonEditUrl,lessonDeleteUrl,getCourseListUrl,ERR_OK } from '@/api/index'
// import { getFullDate } from '@/common/js/utils'
export default {
  data() {
    return {
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
      form: {
        lesson_id:"",
        course_id:"",
        name:"",
        serial:"",
        sort:"",
        introduce:""
      },
      name:'',
      schoole_id: localStorage.getItem("_school_id")
    }
  },
  created() {
    this.getList();
  },
  methods: {
    search() {
      this.getList();
    },
    addBtn() {
      this.title="新增话题"
      this.form = {
        lesson_id:"",
        course_id:"",
        name:"",
        serial:"",
        sort:"",
        introduce:""
      }
      this.dialogAddFormVisible = true;
      this.getCourseList();
    },
    addEvent() {

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
        console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
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
        lesson_id: this.form.lesson_id,
        is_deleted: 1
      }
      var url = lessonDeleteUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
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
    sureEdit() {
      let that = this;
      var params = {
        lesson_id: this.form.lesson_id,
        course_id: this.form.course_id,
        name: this.form.name,
        serial: this.form.serial,
        sort:this.form.sort,
        introduce: this.form.introduce
      }
      var url = lessonEditUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
          that.getList();
          that.$message({
            showClose: true,
            message: '操作成功',
            type: 'success'
          });
          that.dialogFormVisible = false;
          that.dialogAddFormVisible = false;        
          that.form =  {
            lesson_id:"",
            course_id:"",
            name:"",
            serial:"",
            sort:"",
            introduce:""
          }
        }
      });
    },
    getList() {
      let that = this;
      var params = {
        name:that.name,
        offset: (that.pageIndex-1)*that.pageSize,
        limit: that.pageSize,
      }
      var url = lessonListUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
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
    handleEditClick(row) {
      this.title="修改话题"
      this.form = {
        lesson_id:row.id,
        course_id:row.course_id,
        name:row.name,
        serial:row.serial,
        sort:row.sort,
        introduce:row.introduce
      }
      this.dialogFormVisible = true;
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


