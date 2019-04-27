<style lang="scss" scoped>
@import "../../common/scss/common.scss";
$height: 50px;
.apply {
  .operateTableBox {
    .tableBox {
      clear: both;
      // display: flex;
      text-align: center;
      position: relative;
      .tableLeft {
        // flex: 0 0 60px;
        width: 60px;
        border-left: 1px solid $tableBorderColor;
        border-right: 1px solid $tableBorderColor;
        border-bottom: 1px solid $tableBorderColor;
        position: absolute;
        left: 0;
        top: 0;
        background-color: $mainColor;
        color: white;
        li {
          height: $height;
          line-height: $height;
          border-top: 1px solid $tableBorderColor;
          display: block;
        }
      }
      .tableWrapper {
        overflow: scroll;
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
            <span>课程操作日志</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="operateTableBox">
      <div class="functionBox">
          <label class="inline">时间：</label>
         <el-date-picker
            v-model="time"
            type="date"
            value-format="timestamp"
            placeholder="选择日期">
        </el-date-picker>
        <div class="element margT10">
          <!-- <label class="inline">学号：</label>
          <div class="inline width120">
            <el-input v-model="serial" size="medium" placeholder="请输入学号" clearable></el-input>
          </div> -->
          <!-- <label class="inline">{{studentInfo}}</label>
          <div class="inline">
            <el-button type="primary" size="medium" @click="searchBySerial">查询</el-button>
          </div> -->
        </div>
      </div>
      
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="created_at" label="时间" width="180">
              <template slot-scope="scope">
                 {{scope.row.created_at|filterDateTime}}
              </template>
        </el-table-column>
        <el-table-column prop="teacher.en_name" label="操作人" width="180"></el-table-column>
        <el-table-column prop="arranging.lesson.name" label="课程名称" width="180"></el-table-column>
        <el-table-column prop="arranging.begin_time" label="开始时间">
              <template slot-scope="scope">
                 {{scope.row.arranging.begin_time|filterDateTime}}
              </template>
        </el-table-column>
        <el-table-column prop="type" label="操作类型">
             <template slot-scope="scope">
                 {{scope.row.type|filterType}}
              </template>
        </el-table-column>
        <el-table-column prop="user.serial" label="学生编号"></el-table-column>
        <el-table-column prop="user.en_name" label="学生昵称"></el-table-column>
        <el-table-column prop="is_success" label="操作是否生效">
             <template slot-scope="scope">
                 <el-tag type="success" v-if="scope.row.is_success==1">success</el-tag>
                  <el-tag type="danger" v-else>fail</el-tag>
                 
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
  </div>
</template>
<script>
import {
  ListDateArrangingList,
  ERR_OK
} from "@/api/index";

import { 
    getFullDateTime
} from "@/common/js/utils"
// 一天有多少毫秒
var oneDayTime = 24 * 60 * 60 * 1000;
var oneDaySecond = 24 * 60 * 60;
var list = [];
export default {
  data() {
    return {
      loading: true,
      pageIndex: 1,
      pageSize: 10,
      total: 100,
      showPageTag: false,
      tableData:[],
      time: (new Date()).getTime(),
    };
  },
  watch: {
    time: function() {
      var that = this;
      that.$nextTick(function() {
        that.getList();
      });
    }
  },
  created() {
    this.getList();
  },

  filters: {
    filterDateTime(t) {
      return getFullDateTime(t);
    },
    filterType(t) {
        var type = ''
        switch (t) {
            case 1:
                type =  '选课';
            case 2:
                type = '退课';
            case 3:
                type = '排课';
        }
        return type;
    }
  },
  methods: {
    searchBySerial() {
      var that = this;
      if (that.serial == "") {
        that.$alert("请先输入学号", "提示");
      }
      var params = {
        serial: that.serial
      };
      var url = getStudentListUrl;
      console.log(params, "params");
      this.$axios.post(url, params).then(res => {
        var result = res.data;
        console.log(result.code, "--res.code--");
        if (result.code == ERR_OK) {
          var user = result.data.user;
          console.log(user, "useruser");
          if (user.length > 0) {
            that.en_name = user[0].en_name;
            that.user_id = user[0].id;
            that.level_id = user[0].level.id;
            console.log(that.level_id, "level_id");
            // that.cn_name = user[0].cn_name;
            that.studentInfo = `英文名：${user[0].en_name},中文名：${
              user[0].cn_name
            }`;
          } else {
            that.studentInfo = "并无此学生";
          }
          that.getList();
        }
      });
    },
    getList() {
      var that = this;
      var params = {
        time: that.time,
        offset: (that.pageIndex - 1) * that.pageSize,
        limit: that.pageSize,
      };
      var url = ListDateArrangingList;
      that.$axios.post(url, params).then(res => {
        that.loading = false;
        var result = res.data;
        if (result.code == ERR_OK) {
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
    changeweek() {
      var that = this;
      // console.log(that.week,"week")
      if (that.weekth == "") {
        that.$alert("请先选择排课周期", "提示");
      } else {
        that.getList();
      }
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
};
</script>