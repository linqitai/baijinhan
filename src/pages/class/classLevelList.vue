<style lang="scss" scoped>
.apply {
  .operateTableBox {
    .functionBox {
      .status {
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
          <el-breadcrumb-item>
            <span class="nocurrent">课程</span>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <span>课程等级列表</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="operateTableBox">
      <div class="functionBox">
        <div class="inline">
          <el-button type="primary" size="medium" @click="addBtn">新增</el-button>
        </div>
      </div>
      <el-table :data="tableData" border style="width: 100%;" v-loading="homeLoading">
        <el-table-column prop="name" label="等级名称" width="280"></el-table-column>
        <el-table-column prop="level" label="级别" width="100"></el-table-column>
        <el-table-column prop="area.name" label="校区"></el-table-column>
        <!--         <el-table-column prop="area_id" label="地区">
        </el-table-column>-->
        <el-table-column prop="created_at" label="创建时间" width="250"></el-table-column>
        <el-table-column prop="updated_at" label="修改时间" width="250"></el-table-column>
        <el-table-column prop="name" label="操作" width="250" fixed="right">
          <template slot-scope="scope">
            <el-button
              @click="handleEditClick(scope.row)"
              type="text"
              size="small"
              icon="el-icon-edit-outline"
            >修改</el-button>
            <el-button
              @click="handleCourseClick(scope.row)"
              type="text"
              size="small"
              icon="el-icon-edit-outline"
            >等级可见课程</el-button>
            <el-button
              @click="handleDeleteClick(scope.row)"
              type="text"
              size="small"
              icon="el-icon-close"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="tableBottom" v-show="showPageTag">
        <el-pagination
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageIndex"
          :page-size="pageSize"
          :page-sizes="[6,8,10]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      title="修改等级"
      :visible.sync="dialogFormVisible"
      :append-to-body="true"
      :fullscreen="false"
      width="500px"
    >
      <el-form size="mini" :rules="rules" label-position="right">
        <el-form-item label="等级名称：">
          <el-input v-model="form.name" size="medium" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="级别：">
          <el-input v-model="form.level" size="medium" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureEdit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 设置等级弹窗 -->
    <el-dialog
      title="设置等级可见课程"
      :visible.sync="dialogMidCourse"
      :append-to-body="true"
      :fullscreen="false"
      width="800px"
    >
      <el-table :data="tableData2" 
      border style="width: 100%" 
      v-loading="loading"
      @selection-change="handleSelectionChange"
      ref="multipleTable">
          <el-table-column
      type="selection"
      width="55">
    </el-table-column>
        <el-table-column prop="name" label="课程名称" width="160">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column prop="is_use_level" label="是否区分等级" width="110">
          <template slot-scope="scope">{{scope.row.is_use_level==1?'是':'否'}}</template>
        </el-table-column>
        <el-table-column prop="type" label="课程教师类型" width="110">
          <template slot-scope="scope">{{scope.row.type | filterTeacherType}}</template>
        </el-table-column>
        <el-table-column prop="type" label="是否允许自助退课" width="110">
          <template slot-scope="scope">{{scope.row.is_auth_drop | filterAutoDrop}}</template>
        </el-table-column>
        <el-table-column prop="is_use_level" label="是否常规课程" width="110">
          <template slot-scope="scope">{{scope.row.is_custom==1?'是':scope.row.is_custom==0?'否':''}}</template>
        </el-table-column>
        <!-- <el-table-column prop="name" label="操作" width="160" fixed="right">
          <template slot-scope="scope">
            <el-button
              @click="handleDetailClick(scope.row)"
              type="text"
              size="small"
              icon="el-icon-view"
            >确认</el-button>
          </template>
        </el-table-column>-->
      </el-table>
      <div class="tableBottom" v-show="showPageTag2">
        <el-pagination
          class="pagination"
          @size-change="handleSizeChange2"
          @current-change="handleCurrentChange2"
          :current-page.sync="pageIndex2"
          :page-size="pageSize2"
          :page-sizes="[6,8,10,20,25,30]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total2"
        ></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMidCourse = false">取 消</el-button>
        <el-button type="primary" @click="sureEditCourseChoose">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  courseLevelListUrl,
  lessonEditUrl,
  courseLevelEditUrl,
  ERR_OK,
  courseLevelDeleteUrl,
  ListLevelCoursetUrl,
  LevelBindCoursetUrl
} from "@/api/index";
// import { getFullDate } from '@/common/js/utils'
export default {
  data() {
    return {
      dialogMidCourse: false,
      loading:false,
      homeLoading: false,
      showPageTag: false,
      showPageTag2: false,
      pageIndex: 1, // offset/10+1
      pageSize: 10,
      pageIndex2: 1, // offset/10+1
      pageSize2: 30,
      total: 0,
      total2: 0,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      tableData: [],
      tableData2: [],
      form: {
        course_id: "",
        name: "",
        serial: "",
        introduce: ""
      },
      name: "",
      rules: {
        name: [{ required: true, message: "请输入等级名称", trigger: "blur" }],
        level: [
          {
            required: true,
            message: "请输入实际级别,用于学生升级",
            trigger: "blur"
          }
        ]
      },
      multipleSelection:{}//选中行
    };
  },
  watch:{
    tableData2:function(){
        var that = this;

            that.$nextTick(function () {

                that.toggleSelection(that.tableData2)

            });


    }
  },
  filters: {
    filterSchool(t) {
      var schoolsOptions = JSON.parse(localStorage.getItem("_schoolsOptions"));
      for (var i = 0; i < schoolsOptions.length; i++) {
        if (t == schoolsOptions[i].value) {
          console.log(schoolsOptions[i].name, "schoolsOptions[i].name");
          return schoolsOptions[i].name;
        }
      }
    },
   filterTeacherType(t) {
      return t == 1
        ? "中教"
        : t == 2
        ? "外教"
        : t == 3
        ? "中外教"
        : t == 4
        ? "班主任"
        : "";
    },
    filterAutoDrop(t) {
      return t == 1 ? "允许" : "不允许";
    }
  },
  created() {
    this.getList();
  },
  methods: {
    addBtn() {
      this.dialogFormVisible = true;
    },
    sureEdit() {
      let that = this;
      var params = {
        course_level_id: this.form.course_level_id,
        name: this.form.name,
        level: this.form.level
      };
      var url = courseLevelEditUrl;
      console.log(params, "params");
      this.$axios.post(url, params).then(res => {
        var result = res.data;
        console.log(result.code, "--res.code--");
        if (result.code == ERR_OK) {
          // that.tableData = result.data.lesson;
          // that.$message("修改成功")
          that.$message({
            showClose: true,
            message: "修改成功",
            type: "success"
          });
          that.dialogFormVisible = false;
          that.form = {
            course_levle_id: "",
            name: "",
            serial: "",
            introduce: "",
            level: ""
          };
          that.getList();
        }
      });
    },
    sureEditCourseChoose(){
      console.log(this.multipleSelection)
      var arr = this.multipleSelection;
      var course_ids = []
      for(var i=0; i<arr.length;i++){
        course_ids.push(arr[i].id);
      }
      var url = LevelBindCoursetUrl,
          params = {
            course_level_id:this.course_level_id,
            course_ids:course_ids
          },
          that = this;
          this.$axios.post(url, params).then(res => {
             var result = res.data;
            console.log(result.code, "--res.code--");
             if (result.code == ERR_OK) {
                that.$message({
                type: "success",
                message: "等级可见课程更新成功!"
              });
            that.getCourseList();
             }
          })
    },
    getList() {
      let that = this;
      that.homeLoading = true;
      var params = {
        schoole_id: localStorage.getItem("_school_id"),
        offset: (that.pageIndex - 1) * that.pageSize,
        limit: that.pageSize,
      };
      var url = courseLevelListUrl;
      console.log(params, "params");
      this.$axios.post(url, params).then(res => {
        var result = res.data;
        console.log(result.code, "--res.code--");
        if (result.code == ERR_OK) {
          that.homeLoading = false;
          that.tableData = result.data.list;
          that.total = result.data.count;
          if (that.total < that.pageSize) {
            that.showPageTag = false;
          } else {
            that.showPageTag = true;
          }
        }
      });
    },
    //课程数据携带等级
    getCourseList() {
      let that = this;
      this.loading = true
      var params = {
         course_level_id:that.course_level_id,
        offset: (that.pageIndex2 - 1) * that.pageSize2,
        limit: that.pageSize2
      };
      var url = ListLevelCoursetUrl;
      console.log(params, "params");
      this.$axios.post(url, params).then(res => {
        that.loading = false;
        var result = res.data;
        console.log(result.code, "--res.code--");
        if (result.code == ERR_OK) {
          that.multipleSelection = '';
          that.tableData2 = result.data.course;
          // that.toggleSelection(that.tableData2);
          that.total2 = result.data.count;
          if (that.total2 < that.pageSize2) {
            that.showPageTag2 = false;
          } else {
            that.showPageTag2 = true;
          }
        }
      });
    },
    handleEditClick(row) {
      this.form = {
        course_level_id: row.id,
        name: row.name,
        serial: row.serial,
        introduce: row.introduce,
        level: row.level
      };
      this.dialogFormVisible = true;
    },
    handleDeleteClick(row) {
      this.$confirm("此操作将影响与该级别有关的所有话题, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var that = this,
            url = courseLevelDeleteUrl,
            param = {
              course_level_id: row.id
            };
          this.$axios.post(url, param).then(res => {
            var result = res.data;
            if (result.code == ERR_OK) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              that.getList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
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
    handleSizeChange2(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize2 = val;
      this.getCourseList();
    },
    handleCurrentChange2(val) {
      this.pageIndex2 = val;
      console.log(val);
      this.getCourseList();
    },
    handleCourseClick(row) {
      this.course_level_id = row.id;
      this.getCourseList();
      this.dialogMidCourse = true;
    },
    handleSelectionChange(row){
      console.log(row,'rrrrr')
      //此处存放整行数据
      this.multipleSelection = row;
    },
    toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            if(row.level_count>0){
              console.log(this.$refs,'refs');
              this.$refs.multipleTable.toggleRowSelection(row);
            } 
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },

  }
};
</script>