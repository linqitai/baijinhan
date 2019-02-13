<style lang="scss" scoped>
@import "../../common/scss/common.scss";
$height: 50px;
.apply {
  .operateTableBox {
    min-height: 820px;
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
            <span>课程安排</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="operateTableBox">
      <div class="functionBox">
        <div class="element">
          <label class="inline">排课周期：</label>
           <my-time v-model="weekth" @change="getList"> </my-time>
          <!-- <div class="inline">
            <el-button type="primary" size="">查询</el-button>
          </div>-->
        </div>
        <div style="margin-top: 10px;">
          <!-- <el-button type="primary" size="medium" @click="preparePublish">预发布课程</el-button> -->
          <el-button type="primary" size="medium" @click="publish">发布当天课程</el-button>
          <el-button type="primary" size="medium" @click="publishWeek">发布当周课程</el-button>
          <el-button type="primary" size="medium" @click="statistics">上周未定课程统计</el-button>
        </div>
        <div style="margin-top: 18px;">
          <el-radio-group v-model="week" @change="changeweek">
            <el-radio :label="1">周一</el-radio>
            <el-radio :label="2">周二</el-radio>
            <el-radio :label="3">周三</el-radio>
            <el-radio :label="4">周四</el-radio>
            <el-radio :label="5">周五</el-radio>
            <el-radio :label="6">周六</el-radio>
            <el-radio :label="7">周日</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="tableBox">
        <ul class="tableLeft">
          <li></li>
          <li>09:00</li>
          <li>10:00</li>
          <li>11:00</li>
          <li>12:00</li>
          <li>13:00</li>
          <li>14:00</li>
          <li>15:00</li>
          <li>16:00</li>
          <li>17:00</li>
          <li>18:00</li>
          <li>19:00</li>
          <li>20:00</li>
        </ul>
        <div class="tableWrapper">
          <table class="thatTable">
            <tr class="header">
              <th v-for="(item,index) in rooms">{{item.name}}</th>
            </tr>
            <tr v-for="(items,index) in list">
              <td v-for="(item,index) in items.blocks" @click="openDialogModel(item)">
                <div style="width: 180px;">
                  <div v-if="item.capacity" :class="[item.is_released==1?'blue':'gray']">
                    <!-- ({{item.lesson.name}}) -->
                    <div
                      class="ellipsis"
                    >{{item.courseSerial}} {{item.courseName}}({{item.lessonLevelName}})</div>
                    <div class="ellipsis">{{item.lessonName}}</div>
                    <div class="ellipsis">{{item.teacherName}}(capacity:{{item.capacity}})</div>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <el-dialog
      title="排课"
      :visible.sync="isShowPaikeDialog"
      :append-to-body="true"
      :fullscreen="false"
      width="500px"
    >
      <div v-if="!isShowDeleteBtn">
        <div class="lineBox">
          <b class="icon">*</b>
          <b class="text">课程级别</b>
          <el-select
            class="inputTitle"
            v-model="courseLevelValue"
            placeholder="请选择课程等级"
            @change="courseLevelChange"
            clearable
          >
            <el-option
              v-for="item in courseLevelOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="lineBox">
          <b class="icon">*</b>
          <b class="text">课程</b>
          <el-select
            class="inputTitle"
            v-model="courseValue"
            placeholder="请选择课程"
            @change="courseChange"
            clearable
          >
            <el-option
              v-for="item in coursesOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="lineBox">
          <b class="icon">*</b>
          <b class="text">话题</b>
          <el-select
            class="inputTitle"
            v-model="lessonValue"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :loading="loading"
            clearable
            @change="lessonChange"
          >
            <el-option
              v-for="item in options4"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="lineBox">
          <b class="icon"></b>
          <b class="text">教师</b>
          <el-select
            class="inputTitle"
            v-model="teacherValue"
            placeholder="请选择教师"
            @change="getTeacherCourseEvent"
            multiple
            clearable
          >
            <el-option
              v-for="item in teachersOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <span class="dialog-footer">
          <el-button @click="isShowPaikeDialog = false" class="right margT20">取 消</el-button>
          <el-button class="right margT20 margR20" type="primary" @click="editClass">确 定</el-button>
          <div style="clear: both;"></div>
        </span>
      </div>
      <div v-else>
        <div class="lineBox">
          <label class="width80">课程级别：</label>
          {{show.lessonLevelName}}
        </div>
        <div class="lineBox">
          <label class="width80">课程：</label>
          {{show.courseName}}
        </div>
        <div class="lineBox">
          <label class="width80">话题：</label>
          {{show.lessonName}}
        </div>
        <div class="lineBox" v-if="show.tearcherName">
          <label class="width80">教师：</label>
          {{show.tearcherName}}
        </div>
        <span class="dialog-footer">
          <el-button @click="isShowPaikeDialog = false" class="right margT20">取 消</el-button>
          <el-button type="danger" class="margT20 margR20 right" @click="cancel">删 除</el-button>
          <div style="clear: both;"></div>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  arrangingDeleteUrl,
  classListUrl,
  teacherFreeUrl,
  getRoomsUrl,
  teacherFreesUrl,
  getTeacherCourseUrl,
  lessonSearchUrl,
  editClassUrl,
  arrangingReleaseUrl,
  courseLevelListUrl,
  ERR_OK
} from "@/api/index";
import {
  getFullDate,
  getTime,
  getDay,
  getDaysInYearMonth,
  getMonth,
  getTodayDate
} from "@/common/js/utils";
import myTime  from '@/components/time'
// 一天有多少毫秒
var oneDayTime = 24 * 60 * 60 * 1000;
var oneDaySecond = 24 * 60 * 60;
var list = [];
export default {
  data() {
    return {
      schoole_id: localStorage.getItem("_school_id"),
      weekth: "",
      courseValue: "",
      courseLevelValue: "",
      teacherValue: [],
      isShowPaikeDialog: false,
      week: 1,
      weekTime: "",
      time1Options: [],
      time2Options: [],
      time1: "",
      time2: "",
      teachersOption: [],
      coursesOption: [],
      courseLevelOption: [],
      lessonOption: [],
      rooms: [],
      list: [],
      hour: "",
      room_id: "",
      lesson_id: "",
      course_id: "",
      lessonValue: "",
      restaurants: [],
      state1: "",
      state2: "",
      options4: [],
      options5: [],
      loading: false,
      arranging_ids: "",
      isShowDeleteBtn: false,
      show: {
        lessonLevelName: "",
        courseName: "",
        lessonName: "",
        tearcherName: ""
      }
    };
  },
  components:{
    myTime
  },
  created() {
    this.getRooms();
    // this.getCourseList()
    this.getCourseLevelList();
    // this.getlessonList();
  },
  methods: {
    getTeacherList() {
      var that = this;
      var params = {
        time: that.weekTime,
        offset: 0,
        limit: 1000
      };
      var url = teacherFreesUrl;
      // console.log(params,"params")
      that.$axios.post(url, params).then(res => {
        var result = res.data;
        if (result.code == ERR_OK) {
          that.teachersOption = result.data.teachers;
          if (that.teachersOption) {
            for (var i = 0; i < that.teachersOption.length; i++) {
              that.teachersOption[i].value = that.teachersOption[i].id;
              that.teachersOption[i].label = that.teachersOption[i].en_name;
            }
          } else {
          }
          console.log(that.teachersOption, "that.teachersOption");
        }
      });
    },
    getlessonList() {
      let that = this;
      var params = {
        course_id: this.course_id,
        course_level_id: this.course_level_id
        // offset: 0,
        // limit: 1000
      };
      var url = lessonSearchUrl;
      console.log(params, "params");
      this.$axios.post(url, params).then(res => {
        var result = res.data;
        // console.log(result.code,'--res.code--')
        if (result.code == ERR_OK) {
          that.lessonOption = result.data.lesson;
          var aaa = [];
          for (var i = 0; i < that.lessonOption.length; i++) {
            var item = {
              label: that.lessonOption[i].name,
              value: that.lessonOption[i].id
            };
            aaa.push(item);
          }
          that.options4 = aaa;
          that.lessonValue = that.lesson_id;
          // console.log(that.options4,"that.options4")
        }
      });
    },
    lessonChange(value) {
      this.lesson_id = value;
    },
    statistics() {
      this.$router.push("./orderClassOne");
    },
    courseChange(value) {
      console.log(value, "value");
      this.course_id = value;
      this.lessonValue = "";
      this.teacherValue = [];
      // 获取话题列表
      this.getlessonList();
    },
    getCourseList() {
      var that = this;
      var params = {};
      var url = getTeacherCourseUrl;
      // console.log(params,"=========params============")
      that.$axios.post(url, params).then(res => {
        var result = res.data;
        // console.log(result.code,'--res.code--')
        if (result.code == ERR_OK) {
          that.coursesOption = result.data.course;
          for (var i = 0; i < that.coursesOption.length; i++) {
            that.coursesOption[i].value = that.coursesOption[i].id;
            that.coursesOption[i].label = that.coursesOption[i].name;
          }
          // console.log(that.coursesOption,"that.coursesOption")
        }
      });
    },
    courseLevelChange(value) {
      var that = this;
      this.course_level_id = value;
      this.lessonValue = "";
      this.getCourseList();
      this.teacherValue = [];
      console.log(value, "course_level_id");
      console.log(
        that.courseLevelOption,
        "that.courseLevelOptionthat.courseLevelOption"
      );
      for (var i = 0; i < that.courseLevelOption.length; i++) {
        console.log(i, "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
        if (that.courseLevelOption[i].id == value) {
          that.coursesOption = that.courseLevelOption[i].courses;
          for (var i = 0; i < that.coursesOption.length; i++) {
            that.coursesOption[i].value = that.coursesOption[i].id;
            that.coursesOption[i].label = that.coursesOption[i].name;
          }
          break;
        }
      }
      // 获取话题列表
      // this.getlessonList();
    },
    getCourseLevelList() {
      let that = this;
      var params = {
        schoole_id: localStorage.getItem("_school_id"),
        area_id: localStorage.getItem("area_id")
      };
      var url = courseLevelListUrl;
      console.log(params, "params");
      this.$axios.post(url, params).then(res => {
        var result = res.data;
        console.log(result.code, "--res.code--");
        if (result.code == ERR_OK) {
          that.courseLevelOption = result.data.list;
          for (var i = 0; i < that.courseLevelOption.length; i++) {
            that.courseLevelOption[i].value = that.courseLevelOption[i].id;
            that.courseLevelOption[i].label = that.courseLevelOption[i].name;
          }
        }
      });
    },
    getRooms() {
      var that = this;
      var params = {
        school_id: that.schoole_id
      };
      var url = getRoomsUrl;
      // console.log(params,"params")
      this.$axios.post(url, params).then(res => {
        var result = res.data;
        // console.log(result.code,'--res.code--')
        if (result.code == ERR_OK) {
          // that.tableData = result.data.category;
          that.rooms = result.data.rooms;
          that.initList();
        }
      });
    },
    getTeacherCourseEvent() {
      var that = this;
    },
    openDialogModel(item) {
      var that = this;
      that.lessonValue = "";
      if (item.id) {
        that.isShowDeleteBtn = true;
      } else {
        that.isShowDeleteBtn = false;
      }
      that.show.lessonLevelName = item.lessonLevelName;
      that.show.courseName = item.courseName;
      that.show.lessonName = item.lessonName;
      that.show.tearcherName = item.teacherName;
      console.log(item, "itemtitemitem");
      that.room_id = item.room_id;
      that.hour = item.hour;
      that.arranging_ids = item.id;
      that.isShowPaikeDialog = true;
      that.courseLevelValue = item.level_id;
      console.log(that.teachersOption, "that.teachersOption");
      if (this.teachersOption) {
        that.teacherValue.push2(item.teacher_id);
      } else {
        that.teacherValue = [];
      }
      that.courseValue = item.course_id;
      that.course_id = item.course_id;
      that.course_level_id = item.level_id;
      that.lesson_id = item.lesson_id;

      //获取时间 weekTime
      var weekTime =
        getTime(that.time2.split("~")[0]) +
        getTime(oneDayTime * (that.week - 1)) +
        getTime(oneDayTime * (that.hour / 24));
      console.log(weekTime, "weekTime");
      that.weekTime = weekTime / 1000;
      // that.getlessonList();
      that.getTeacherList();
    },
    cancel() {
      var that = this;
      var ids = [];
      ids.push(that.arranging_ids);
      var params = {
        arranging_ids: ids
      };
      var url = arrangingDeleteUrl;
      // console.log(params,"params")
      this.$axios.post(url, params).then(res => {
        var result = res.data;
        // console.log(result.code,'--res.code--')
        if (result.code == ERR_OK) {
          that.isShowPaikeDialog = false;
          that.getList();
          that.$message({
            type: "success",
            message: "操作成功!"
          });
        }
      });
    },
    editClass() {
      var that = this;
      // console.log(that.weekth.split(',')[0],"begin")
      // console.log(that.week,"week")
      var params = {
        time:
          parseInt(that.weekth.split(",")[0]) +
          oneDaySecond * (that.week - 1) +
          that.hour * 60 * 60, // 当前选择方块的时间戳，比如：2018年 9月 24号 1点的课程
        room_id: that.room_id,
        lesson_id: that.lesson_id,
        course_id: that.course_id,
        school_id: that.schoole_id,
        teacher_id: that.teacherValue
      };
      var url = editClassUrl;
      // console.log(params,"=========params============")

      that.$axios
        .post(url, params)
        .then(res => {
          console.log(res, "resresresres");
          var result = res.data;
          console.log(result.code, "--res.code--");
          if (result.code == ERR_OK) {
            // console.log("success")
            that.clearPaikeDialog();
            that.getList();
            that.isShowPaikeDialog = false;
          } else if (result.code == 433) {
            // that.$alert(result.message, '提示');
            that.$alert("该教室已有课程", "提示");
          } else if (result.code == 422) {
            that.$alert(result.message, "提示");
          }
        })
        .catch(res => {
          that.$alert("参数错误", "提示");
        });
    },
    clearPaikeDialog() {
      var that = this;
      that.teacherValue = "";
      that.courseValue = "";
      that.courseLevelValue = "";
      that.lessonValue = "";
    },
    initList() {
      var that = this;
      list = [];
      for (var i = 0; i < 12; i++) {
        //一维长度为8
        var item = {
          hour: i + 9
        };
        var blocks = [];
        for (var j = 0; j < that.rooms.length; j++) {
          var block = {
            room_id: that.rooms[j].id,
            roomName: that.rooms[j].name,
            id: "",
            course: "",
            teacher: "",
            courseName: "",
            level_id: "",
            teacher_id: "",
            course_id: "",
            lesson_id: "",
            lessonName: "",
            teacherName: "",
            capacity: "",
            hour: i + 9
          };
          blocks.push(block);
        }
        item.blocks = blocks;
        list.push(item);
      }
      that.list = list;
    },
    getList() {
      var that = this;
      var params = {
        schoole_id: localStorage.getItem("_school_id"),
        weekth: that.weekth,
        week: that.week,
        is_released: 0
      };
      var url = classListUrl;
      // console.log(params,"params")
      that.$axios.post(url, params).then(res => {
        var result = res.data;
        // console.log(result,'--result--')
        if (result.code == ERR_OK) {
          // that.tableData = result.data.category;
          var arranging = result.data.arranging;
          // console.log(arranging,"arranging");
          // console.log(Object.keys(arranging),"keys");
          var keys = Object.keys(arranging);
          var arr = [];
          for (var i = 0; i < keys.length; i++) {
            // console.log(arranging[keys[i]],"arranging")
            var obj = arranging[keys[i]];
            console.log(obj, "obj");
            for (var j = 0; j < obj.length; j++) {
              var item = {
                week: obj[j].week,
                hour: obj[j].hour,
                id: obj[j].id,
                lessonName: obj[j].lesson.name,
                lessonLevelName: obj[j].lesson.level
                  ? obj[j].lesson.level.name
                  : "",
                courseSerial: obj[j].lesson.course
                  ? obj[j].lesson.course.serial
                  : "",
                courseName: obj[j].lesson.course
                  ? obj[j].lesson.course.name
                  : "",
                level_id: obj[j].lesson.level_id,
                teacher_id: obj[j].teacher.id,
                course_id: obj[j].lesson.course_id,
                lesson_id: obj[j].lesson.id,
                teacherName: obj[j].teacher ? obj[j].teacher.en_name : "",
                roomName: obj[j].room.name,
                capacity: obj[j].capacity,
                is_released: obj[j].is_released
              };
              arr.push(item);
            }
          }
          that.initList();
          for (var i = 0; i < arr.length; i++) {
            // console.log(arr,"arr")
            // console.log(arr[i],"arr[i]")
            // console.log(arr[i].hour,"arr[i].hour")
            for (var j = 0; j < list.length; j++) {
              if (list[j].hour == arr[i].hour) {
                for (var k = 0; k < list[j].blocks.length; k++) {
                  if (list[j].blocks[k].roomName == arr[i].roomName) {
                    list[j].blocks[k].id = arr[i].id;
                    list[j].blocks[k].hour = arr[i].hour;
                    list[j].blocks[k].level_id = arr[i].level_id;
                    list[j].blocks[k].teacher_id = arr[i].teacher_id;
                    list[j].blocks[k].course_id = arr[i].course_id;
                    list[j].blocks[k].lesson_id = arr[i].lesson_id;
                    list[j].blocks[k].courseSerial = arr[i].courseSerial;
                    list[j].blocks[k].courseName = arr[i].courseName;
                    list[j].blocks[k].lessonName = arr[i].lessonName;
                    list[j].blocks[k].lessonLevelName = arr[i].lessonLevelName;
                    list[j].blocks[k].teacherName = arr[i].teacherName;
                    list[j].blocks[k].is_released = arr[i].is_released;
                    list[j].blocks[k].capacity = arr[i].capacity
                      ? arr[i].capacity
                      : "--";
                  }
                }
              }
            }
          }
          that.list = list;
          // console.log(that.list,"list==================================")
        }
      });
    },
    preparePublish() {
      var that = this;
      // if(that.time2){
      //   that.isShowPaikeDialog = true;
      // }else{
      //   that.$message("请选择排课周期")
      // }
    },
    publishEvent() {
      let that = this;
      var params = {
        schoole_id: localStorage.getItem("_school_id"),
        weekth: this.weekth,
        week: this.week
      };
      // Object.assign(params, params, p);
      var url = arrangingReleaseUrl;
      // console.log(params,"params")
      that.$axios.post(url, params).then(res => {
        var result = res.data;
        // console.log(result.code,'--res.code--')
        if (result.code == ERR_OK) {
          that.getList();
          that.$message({
            type: "success",
            message: "操作成功!"
          });
        }
      });
    },
    publish() {
      // arrangingReleaseUrl
      var that = this;
      this.$confirm("此操作将发布当天课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that.publishEvent();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    publishWeekEvent() {
      let that = this;
      var params = {
        schoole_id: localStorage.getItem("_school_id"),
        weekth: this.weekth
      };
      // Object.assign(params, params, p);
      var url = arrangingReleaseUrl;
      // console.log(params,"params")
      that.$axios.post(url, params).then(res => {
        var result = res.data;
        // console.log(result.code,'--res.code--')
        if (result.code == ERR_OK) {
          that.getList();
          that.$message({
            type: "success",
            message: "操作成功!"
          });
        }
      });
    },
    publishWeek() {
      var that = this;
      this.$confirm("此操作将发布当周课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that.publishWeekEvent();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    changeweek() {
      var that = this;
      console.log(that.week, "week");
      if (that.weekth == "") {
        that.$alert("请先选择排课周期", "提示");
      } else {
        that.getList();
      }
    }
  }
};
Array.prototype.push2 = function (args) {
  console.log(args,'123123');
  for (var i = 0; i < args.length; i++) {
    var ele = args[i];
    if (this.indexOf(ele) == -1) {  
      this.push(ele);
    }
  }
};

</script>


