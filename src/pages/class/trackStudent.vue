<style lang="scss" scoped>
.apply {
  .operateTableBox {
    .functionBox {
    }
  }
  .clear {
    clear: both;
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
            <span>退课列表</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="operateTableBox">
      <div class="functionBox">
        <div class="element" style="float:left">
          <label class="inline">班主任 ：</label>
          <div class="inline">
            <el-select v-model="tracksChoosed" placeholder="请选择" size="medium" @change="arranging" :label="name" type="index">
              <el-option
                v-for="item in tracksList"
                :key="item.id"
                :label="item.en_name" 
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="inline">
            <el-button type="primary" size="medium" @click="search">查询</el-button>
          </div>
        </div>
        <div class="element" style="float:left;margin-left:20px">
          <label class="inline">时间选择</label>
          <el-date-picker v-model="month" type="month" placeholder="选择月" size="medium" @change="arranging"></el-date-picker>
           <el-button type="primary" size="medium" @click="exports">导出</el-button>
        </div>
      </div>
      <div class="clear"></div>
      <el-table :data="students" border style="width: 100%">
        <el-table-column prop="serial" label="学号" width="100"></el-table-column>
        <el-table-column prop="user_en_name" label="学生中文名"></el-table-column>
        <el-table-column prop="user_cn_name" label="学生英文名" width="120"></el-table-column>
        <el-table-column prop="level_name" label="学生等级" width="120"></el-table-column>
        <el-table-column prop="lesson_name" label="话题" width="120"></el-table-column>
        <el-table-column prop="arranging_begin_time" label="课程开始时间" width="120"></el-table-column>
        <el-table-column prop="is_sign" label="是否到客" width="120"></el-table-column>
        <el-table-column prop="results" label="是否通过" width="120"></el-table-column>
        <el-table-column prop="grammar" label="grammar" width="120"></el-table-column>
        <el-table-column prop="vocabulary" label="vocabulary" width="120"></el-table-column>
        <el-table-column prop="pronunciation" label="pronunciation" width="120"></el-table-column>
        <el-table-column prop="listening_skings" label="listening_skings" width="120"></el-table-column>
        <el-table-column prop="fluency" label="fluency" width="120"></el-table-column>
        <el-table-column prop="created_at" label="订课时间" width="120"></el-table-column>
        <!-- <el-table-column prop="teacher_en_name" label="讲师" width="160">
          <template slot-scope="scope">{{scope.row.arranging.updated_at}}</template>
        </el-table-column>
        <el-table-column prop="arranging.begin_time" label="上课时间" width="120">
          <template slot-scope="scope">{{scope.row.arranging.begin_time | filterTime}}</template>
        </el-table-column>
        <el-table-column prop="arranging.course.name" label="课程名称" width="140"></el-table-column>
        <el-table-column prop="arranging.course.type_id" label="课程类型"></el-table-column>
        <el-table-column prop="name" label="是否本人退课" width="120"></el-table-column>
        <el-table-column prop="drop_people.en_name" label="退课人"></el-table-column> -->
        <!-- <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              @click="operateBtn(scope.row,'agreeDrop')"
              type="text"
              size="small"
              icon="el-icon-edit-outline"
            >同意</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="tableBottom" v-show="showPageTag">
        <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-size="pageSize" :page-sizes="[4,6,8,10]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { teacherTrackUrl, trackArranging, ERR_OK } from "@/api/index";
import { getFullDate, getFullTime ,urlEncode} from "@/common/js/utils";
export default {
  data() {
    return {
      month: "",
      tableData: [],
      teacherTrackUrl: "",
      schoole_id: localStorage.getItem("_school_id"),
      area_id: localStorage.getItem("area_id"),
      tracksList: [],
      tracksChoosed:'',
      students:[],
      total:0,
      pageIndex:0,
      pageSize:10,
      showPageTag:true,
      name:''

    };
  },
  mounted: function() {
    let that = this;
    that.teacherTrackUrl =
      teacherTrackUrl +
      "?school_id=" +
      that.schoole_id +
      "&area_id=" +
      that.area_id;
    that.tracks();
    that.month = new Date();
  },
  methods: {
    search: function() {},
    tracks: function() {
      let that = this;
      var params = {
        // user_id: row.user.id,
        // arranging_id: row.arranging_id
      };
      var url = that.teacherTrackUrl;

      this.$axios
        .post(url, params)
        .then(res => {
          var result = res.data;
          console.log(result.code, "--res.code--");
          if (result.code == ERR_OK) {
            that.tracksList = result.data;
            that.tracksChoosed = result.data[0].id
            that.$message({
              showClose: true,
              message: "操作成功",
              type: "success"
            });
            that.arranging();
          }
        })
        .catch(res => {
          that.$message({
            showClose: true,
            message: "系统故障",
            type: "warning"
          });
        });
    },
    arranging:function(e){
      console.log(e,'!!!!!')
      let that = this;
      let url  = trackArranging+
       "?school_id=" +
      that.schoole_id +
      "&area_id=" +
      that.area_id;

      let params = {
        teacher_id:that.tracksChoosed,
        year:that.month.getFullYear(),
        month:that.month.getMonth()+1,
        offset:(that.pageIndex-1)*that.pageSize,
        limit: that.pageSize,
      }
      this.$axios
        .post(url,params)
        .then(res=>{
           var result = res.data;
          console.log(result.code, "--res.code--");
          if (result.code == ERR_OK) {
            that.students = result.data.student;
            that.total = result.data.count;
            that.$message({
              showClose: true,
              message: "操作成功",
              type: "success"
            });
          }
        })
        .catch(res => {
          that.$message({
            showClose: true,
            message: "系统故障",
            type: "warning"
          });
        });
    },
    exports:function(){
      let that = this;
      let url  = trackArranging
      let params = {
        teacher_id:that.tracksChoosed,
        year:that.month.getFullYear(),
        month:that.month.getMonth()+1,
        offset:(that.pageIndex-1)*that.pageSize,
        limit: that.pageSize,
        is_exports:1
      }
      // url = url+"?"+urlEncode(params).slice(1) 
      this.$axios
        .request({
            url: url,
            method:'post',
            responseType:'blob',
            params:params
        })
        .then(res=>{
           var result = res.data;
          // console.log(result.code, "--res.code--");
          // if (result.code == ERR_OK) {
            var blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
        　　 var downloadElement = document.createElement('a');
        　 　var href = window.URL.createObjectURL(blob); //创建下载的链接
        　 　downloadElement.href = href;
        　 　downloadElement.download = `${that.month.getFullYear()}-${that.month.getMonth()+1}.xlsx`; //下载后文件名
        　 　document.body.appendChild(downloadElement);
        　　 downloadElement.click(); //点击下载
        　 　document.body.removeChild(downloadElement); //下载完成移除元素
        　 　window.URL.revokeObjectURL(href); //释放掉blob对象 
            // that.students = result.data.student;
            // that.total = result.data.count;
            that.$message({
              showClose: true,
              message: "操作成功",
              type: "success"
            });
          // }
        })
        .catch(res => {
          that.$message({
            showClose: true,
            message: "系统故障",
            type: "warning"
          });
        });
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.arranging();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      // console.log(val);
      this.arranging();
    }
  }
};
</script>
