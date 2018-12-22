<style lang="scss" scoped>
.apply{
  .operateTableBox{
    .functionBox{
      .status{
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
          <el-breadcrumb-item><span>课程等级列表</span></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="operateTableBox">
      <div class="functionBox">
        <div class="inline">
          <el-button type="primary" size="medium" @click="addBtn">新增</el-button>
        </div>
      </div>
      <el-table :data="tableData" border style="width: 100%;">
        <el-table-column prop="name" label="等级名称" width="180">
        </el-table-column>
        <el-table-column prop="level" label="级别">
        </el-table-column>
        <el-table-column prop="shool_id" label="校区">
        </el-table-column>
        <el-table-column prop="" label="地区">
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间">
        </el-table-column>
        <el-table-column prop="updatad_at" label="修改时间">
        </el-table-column>
        <el-table-column prop="name" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="handleEditClick(scope.row)" type="text" size="small" icon="el-icon-edit-outline">修改</el-button>
            <el-button @click="handleDeleteClick(scope.row)" type="text" size="small" icon="el-icon-close">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="修改话题" :visible.sync="dialogFormVisible" :append-to-body="true" :fullscreen="false" width="500px">
      <div class="dialogBody">
        <div class="element">
          <label class="inline">等级名称：</label>
          <div class="inline">
             <el-input v-model="form.name" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="element margT20">
          <label class="inline">级别：</label>
          <div class="inline">
             <el-input v-model="form.serial" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="element margT20">
          <label class="inline">校区：</label>
          <div class="inline">
             <el-input v-model="form.introduce" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="element margT20">
          <label class="inline">地区：</label>
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
import { courseLevelListUrl,lessonEditUrl,ERR_OK } from '@/api/index'
// import { getFullDate } from '@/common/js/utils'
export default {
  data() {
    return {
      pageIndex: 1, // offset/10+1
      pageSize: 8,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      tableData:[],
      form: {
        course_id:"",
        name:"",
        serial:"",
        introduce:""
      },
      name:''
    }
  },
  created() {
    this.getList();
  },
  methods: {
    addBtn() {
      
    },
    sureEdit(){
      let that = this;
      var params = {
        course_id: this.form.course_id,
        name: this.form.name,
        serial: this.form.serial,
        introduce: this.form.introduce
      }
      var url = lessonEditUrl;
      console.log(params,"params")
      /*this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
          // that.tableData = result.data.lesson;
          // that.$message("修改成功")
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
      });*/
    },
    getList() {
      let that = this;
      var params = {
        // offset: (that.pageIndex-1)*that.pageSize,
        // limit: that.pageSize,
      }
      var url = courseLevelListUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
          that.tableData = result.data;
          
        }
      });
    },
    handleEditClick(row) {
      this.form = {
        course_id:row.course_id,
        name:row.name,
        serial:row.serial,
        introduce:row.introduce
      }
      this.dialogFormVisible = true;
    },
    handleDeleteClick(row) {

    },
  }
}
</script>