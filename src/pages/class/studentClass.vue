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
            <span class="nocurrent">学生</span>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <span>学生课程</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="operateTableBox">
      <div class="functionBox">
        <div class="element">
          <label class="inline">学号：</label>
          <div class="inline">
            <el-input v-model="serial" size="medium" placeholder="请输入所要查询的姓名"></el-input>
          </div>
          <div class="inline">
            <el-button type="primary" size="medium" @click="getStudentWithCourses">查询</el-button>
          </div>
        </div>
      </div>
      <div style="margin-left:20px;color:pink">*******目前仅统计学生订课数量，结课数量待更新</div>
      <div class="functionBox">
        <table class="mytable">
          <tr class="header">
            <th>
              <p style="line-height:30px;font-size:12px">学号</p>
            </th>
            <th>
              <p style="line-height:30px;font-size:12px">英文名</p>
            </th>
            <th v-for="(item,index) in customCourses">
              <p style="line-height:30px;font-size:12px">{{item.name}}</p>
            </th>
          </tr>
          <tr v-for="(items,index) in userWithCourses">
            <td>{{items.contract_no}}</td>
            <td>{{items.en_name}}</td>
            <td
              v-for="(item,index) in items.arrangings"
              :class="[item.count>0?'orderBgColor':'']"
              @click="showDetail(item)"
            >
              <div style="margin: 0 10px">
                <div>
                  <div>{{item.count}}</div>
                </div>
              </div>
            </td>
          </tr>
        </table>

        <div class="tableBottom" v-show="showPageTag" style="margin-bottom:20px">
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
        <!-- <el-table :data="userWithCourses"  border style="width: 100%;margin-top: 10px;">
          <template v-for="(item,i) in customCourses">
            <el-table-column
                :label="item.course_name"
                :prop=""
                :key="item.id"
              ></el-table-column>
          </template>
        
          <el-table-column
            label="测试"
            prop="id"
          ></el-table-column>
        </el-table>-->
      </div>
    </div>
    <el-dialog
      title="订课明细"
      :visible.sync="dialog"
      :append-to-body="true"
      width="700px"
     
    >
      <!-- <div class="dialogBody"> -->
      <!-- <div class="element"> -->
      <el-table :data="myClass">
        <el-table-column label="课程" prop="name"></el-table-column>
        <el-table-column label="上课次数" prop="arrangings_count"></el-table-column>
      </el-table>
      <div class="tableBottom" v-show="showPageTag2" style="margin-bottom:20px">
          <el-pagination
            class="pagination"
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page.sync="pageIndex2"
            :page-size="pageSize2"
            :page-sizes="[6,8,10]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total2"
          ></el-pagination>
        </div>
      <!-- </div> -->
      <!-- </div> -->
    </el-dialog>
  </div>
</template>
<script>
import {
  ListCustomCourseUrl,
  ListUsersWithClassUrl,
  ListMyClassUrl,
  ERR_OK
} from "@/api/index";
import { getSex, getFullDate } from "@/common/js/utils";
export default {
  data() {
    return {
      customCourses: [],
      userWithCourses: [],
      pageSize: 10,
      pageIndex: 0,
      total: 0,
      serial: "",
      showPageTag: "",

      myClass:[],
      dialog: false,
      pageSize2: 10,
      pageIndex2: 0,
      total2: 0,
      showPageTag2: "",
      course_id:'',
      level_id:''
    
    };
  },
  created() {
    this.getCustomCourses();
    this.getStudentWithCourses();
  },
  // watch:{
  //     userWithCourses:function(){
  //       var that = this;

  //           that.$nextTick(function () {

  //               that.getStudentWithCourses()

  //           });


  //   }
  // },
  methods: {
    getCustomCourses() {
      var that = this;
      var url = ListCustomCourseUrl;
      this.$axios.post(url).then(res => {
        var result = res.data;
        if (result.code == ERR_OK) {
          that.customCourses = result.data.list;
        }
      });
    },
    getStudentWithCourses() {
      var that = this;
      var url = ListUsersWithClassUrl;
      var param = {
        offset: (that.pageIndex - 1) * that.pageSize,
        limit: that.pageSize,
        serial: that.serial
      };
      this.$axios.post(url, param).then(res => {
        var result = res.data;
        if (result.code == ERR_OK) {
          var list = result.data.list;
          that.total = result.data.count;
          if (that.total < that.pageSize) {
            that.showPageTag = false;
          } else {
            that.showPageTag = true;
          }

          var contrast = this.customCourses;
          var kk = [];
          for (var key = 0; key < list.length; key++) {
            var item = list[key]; //每个学生
            var arr = [];
            for (var subkey = 0; subkey < contrast.length; subkey++) {
              //课名s
              // console.log(subkey,'---kkk');
              // console.log(contrast,'llll')
              // console.log(item.level.courses,'ccc')
              // console.log(item.level.courses.length);
              var sub2 = {
                count: 0,
                course_id: 0
              }; //单个学生的课程
              for (var index = 0; index < item.arrangings.length; index++) {
                var sub2item = item.arrangings[index];
                if (contrast[subkey].id == sub2item.course_id) {
                  // console.log(sub2item);
                  sub2 = sub2item;
                }
              }
              sub2.course_name = contrast[subkey].name;
              arr.push(sub2);
            }
            // console.log(arr);
            item.arrangings = arr;
            item.index = key;
            kk.push(item);
          }
          this.userWithCourses = kk;
        }
      });
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getStudentWithCourses();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      // console.log(val);
      this.getStudentWithCourses();
    },
    showDetail(item) {
      if (item.count > 0) {
          this.course_id = item.course_id,
          this.user_id =item.pivot.user_id;
          this.getMyClass()
      } else {
      }
    },
    getMyClass(){
       var that = this;
        var url = ListMyClassUrl;
        var param = {
          offset: (that.pageIndex2 - 1) * that.pageSize2,
          limit: that.pageSize2,
          course_id: this.course_id,
          user_id:this.user_id
        };
        this.$axios.post(url, param).then(res => {
          var result = res.data;
          if (result.code == ERR_OK) {
            // var list = result.data.list;
            that.total2 = result.data.count;
            that.myClass = result.data.list;
            if (that.total2 < that.pageSize2) {
              that.showPageTag2 = false;
            } else {
              that.showPageTag2 = true;
            }
            this.dialog = true;
          }
        });
    },
    handleSizeChange2(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize2 = val;
      this.getMyClass();
    },
    handleCurrentChange2(val) {
      this.pageIndex2 = val;
      // console.log(val);
      this.getMyClass();
    },
  }
};
</script>
<style lang="scss" scoped>
$tableBorderColor: #c7c7c7;
$mainColor: #409eff;
$height: 30px;
.apply {
  .operateTableBox {
    .functionBox {
      overflow: auto;
    }
  }
}
table.mytable {
  width: 100%;
  border: 1px solid $tableBorderColor;
  border-right: none;
  margin-left: 0px;
  background-color: white;
  .header {
    background-color: $mainColor;
    color: white;
  }
  tr {
    white-space: nowrap;
    border-bottom: 1px solid $tableBorderColor;
    // &:nth-child(2),&:nth-child(5),&:nth-child(10){
    //   background-color: #B1F1FF;
    // }
    &:nth-child(even) {
      background-color: #ecfcff;
    }
  }
  tr > th {
    width: 50px;
    height: $height;
    line-height: $height;
    border-right: 1px solid $tableBorderColor;
    box-sizing: content-box;
    padding: 0 6px;
  }
  tr > td {
    width: 50px;
    height: $height;
    border-right: 1px solid $tableBorderColor;
    box-sizing: content-box;
    padding: 0 6px;
    cursor: pointer;
    &:hover {
      background-color: rgba(0, 44, 253, 0.3);
    }
  }
}
</style>
