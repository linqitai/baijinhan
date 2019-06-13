<style lang="scss" scoped>
@import "../../common/scss/common.scss";
.apply {
  .operateTableBox {
    min-height: 780px;
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
            <span>订课总览</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="operateTableBox">
      <div class="functionBox">
        <div class="element">
          <label class="inline">排课周期：</label>
          <my-time v-model="weekth" @change="getList"></my-time>
          <!-- <div class="inline">
             <el-select class="width140" size="medium" v-model="time1" @change="time1Change" placeholder="请选择">
              <el-option
                v-for="item in time1Options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="inline">
             <el-select class="width200" size="medium" v-model="time2" @change="time2Change" placeholder="请选择">
              <el-option
                v-for="item in time2Options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>-->
          <el-radio-group class="margL20" v-model="book_value" @change="changeBook">
            <el-radio :label="2">全部</el-radio>
            <el-radio :label="0">未订</el-radio>
            <el-radio :label="1">已订</el-radio>
          </el-radio-group>
          <!-- <div class="inline">
            <el-button type="primary" size="">查询</el-button>
          </div>-->
        </div>
        <div style="margin-top: 10px;">
          <!-- <el-button type="primary" size="medium" @click="preparePublish">预发布课程</el-button> -->
          <!-- <el-button type="primary" size="medium" @click="publish">发布课程</el-button>
          <el-button type="primary" size="medium">上周未定课程统计</el-button>-->
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
          <li>18:30</li>
          <li>19:00</li>
          <li>20:00</li>
        </ul>
        <div class="tableWrapper">
          <table class="thatTable">
            <tr class="header">
              <th v-for="item in rooms" :key="item.id">
                <p style="line-height:30px;font-size:12px">{{item.school.name}}</p>
                <p style="line-height:30px">{{item.name}}</p>
              </th>
            </tr>
            <tr v-for="(items,index) in list" :key="index">
              <td
                v-for="item in items.blocks"
                :key="item.id"
                :class="[item.users_count>0?'orderBgColor':'']"
                @click="showDetail(item)"
              >
                <div style="min-width: 160px;">
                  <div :class="[item.is_released==1?'blue':'gray']" v-if="item.lessonName">
                    <div>{{item.lessonName}}({{item.lessonType}})</div>
                    <div
                      style="color:black"
                    >{{item.teacherName}} ({{item.teacherType|filterTeacherType}}) {{item.helpTeacherName?'、'+item.helpTeacherName:''}}</div>
                    <div>{{item.courseName}}</div>
                    <div class>({{item.users_count}}-{{item.capacity}})</div>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <el-dialog
      title="课堂信息"
      :visible.sync="showDetailDialog"
      :append-to-body="true"
      :fullscreen="false"
      width="500"
    >
      <div class v-if="oneInfo">
        <el-row :gutter="24">
          <el-col :span="12">课程：{{oneInfo.course.name}}</el-col>
          <el-col :span="12">授课老师：{{oneInfo.teacher.en_name}}</el-col>
        </el-row>
        <el-row :gutter="24" class="margT10">
          <el-col :span="12">话题级别：{{oneInfo.lesson?oneInfo.lesson.level.name:''}}</el-col>
          <el-col :span="12">上课地点：{{oneInfo.room.name}}</el-col>
        </el-row>
        <el-row :gutter="24" class="margT10">
          <el-col :span="24">话题名称：{{oneInfo.lesson?oneInfo.lesson.name:''}}</el-col>
        </el-row>

        <div class="users">
          <!-- <img class="avater" :src="item.head_img_url"> -->
          <el-table
            :data="oneInfo.users"
            title="课堂学生"
            highlight-current-row
            stripe
            border
            style="width: 100%"
          >
            <el-table-column label="头像" width="60">
              <template slot-scope="scope">
                <img :src="scope.row.head_img_url" class="avater">
                <!-- <el-button type="text" size="small">其他功能</el-button> -->
              </template>
            </el-table-column>
            <el-table-column prop="cn_name" label="中文名" width="80"></el-table-column>
            <el-table-column prop="en_name" label="英文名" width="100"></el-table-column>
            <el-table-column prop="serial" label="学号" width="100"></el-table-column>
             <el-table-column label="是否结课" width="80">
              <template slot-scope="scope">
                 {{scope.row.pivot.is_sign|filterSign}}
              </template>
            </el-table-column>
            <el-table-column label="是否通过" width="80">
              <template slot-scope="scope">
                 {{scope.row.pivot.results|filterResults}}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
              <template slot-scope="scope">
                <el-button @click="handleClickCloseLesson(scope.row)" type="text" size="small" v-if="scope.row.pivot.is_sign == 0">代结课</el-button>
                <el-button @click="handleClickCloseLesson(scope.row)" type="text" size="small" v-else>查看</el-button>
                <!-- <el-button type="text" size="small">其他功能</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="代结课"
      :visible.sync="isShowCloseLessonDialog"
      :append-to-body="true"
      :fullscreen="false"
      width="300px"
      @before-close='hideCloseLesson' 
    >
      <div class="block">
        <div>
          <span class="demonstration">grammar:</span>
          <el-rate v-model="grammar" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate>
        </div>

        <div>
          <span class="demonstration">vocabulary:</span>
          <el-rate v-model="vocabulary" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate>
        </div>

        <div>
          <span class="demonstration">pronunciation:</span>
          <el-rate v-model="pronunciation" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate>
        </div>

        <div>
          <span class="demonstration">listening_skings:</span>
          <el-rate v-model="listening_skings" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate>
        </div>

        <div>
          <span class="demonstration">fluency:</span>
          <el-rate v-model="fluency" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate>
        </div>
        <div>
          <span class="demonstration">results:</span>
          <el-radio-group v-model="results">
          <el-radio  label="2">repeat</el-radio>
          <el-radio  label="1">pass</el-radio>
          </el-radio-group>
        </div>
        <br>
        <br>
        <div>
         <el-button @click="CloseLessonSubmit()" type="primary" size="small">确认</el-button>
         <el-button @click="hideCloseLesson()" type="" size="small">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  testUrl,
  bookCourseListUrl,
  classListUrl,
  teacherFreeUrl,
  getRoomsUrl,
  teacherListUrl,
  getTeacherCourseUrl,
  getCourseListUrl,
  editClassUrl,
  arrangingReleaseUrl,
  arrangingOneUrl,
  TeacherCloseLessonUrl,
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
import myTime from "@/components/time";
// 一天有多少毫秒
var oneDayTime = 24 * 60 * 60 * 1000;
var oneDaySecond = 24 * 60 * 60;
var list = [];
export default {
  data() {
    return {
      schoole_id: localStorage.getItem("_school_id"),
      weekTime: "",
      weekth: "",
      courseValue: "",
      teacherValue: "",
      isShowPaikeDialog: false,
      week: (new Date()).getDay()==0?7:(new Date()).getDay(),
      time1Options: [],
      time2Options: [],
      time1: "",
      time2: "",
      teachersOption: [],
      coursesOption: [],
      rooms: [],
      hours:[
        9,10,11,12,13,14,15,16,17,18,18.5,19,20,
      ],
      list: [],
      hour: "",
      room_id: "",
      lession_id: "",
      course_id: "",
      book_value: 1,
      book: "1",
      showDetailDialog: false,
      info: {
        courseName: "",
        teacherName: "",
        lessonLevel: "",
        roomName: "",
        lessonName: ""
      },
      deatil:{
        id:0//arranging_id
      },
      oneInfo: "",
      isShowCloseLessonDialog: false, //结课
      data:{},
      grammar: 5,
      vocabulary: 5,
      pronunciation: 5,
      listening_skings: 5,
      fluency: 5,
      results: "1",
      is_sign: ""
    };
  },
  created() {
    this.getRooms();
    // this.getTest();
  },
  components: {
    myTime
  },
  filters: {
    filterTeacherType(t) {
      if (t == 1) {
        return "中教";
      } else if (t == 2) {
        return "外教";
      }
    },
    filterResults(t) {
      if (t == 1) {
        return "已通过";
      } else{
        return "未通过";
      }
    },
    filterSign(t){
       if (t == 0) {
        return "缺课";
      } else if (t == 1) {
        return "已结课";
      }
    }
  },
  methods: {
    test() {
      console.log(12312312312312312);
    },
    showDetail(item) {
      console.log(item, "item");
      if(!item ||!item.id){
        item = this.deatil;
      }else{
        this.deatil = item;
      }
      if (item.is_released == 1) {
        this.showDetailDialog = true;

        var that = this;
        var params = {
          arranging_id: item.id
        };
        var url = arrangingOneUrl;
        // console.log(params,"params")
        this.$axios.post(url, params).then(res => {
          var result = res.data;
          // console.log(result.code,'--res.code--')
          if (result.code == ERR_OK) {
            that.oneInfo = result.data;
          }
        });
      }
    },
    courseChange(e) {
      this.course_id = e.split(",")[0];
      this.lession_id = e.split(",")[1];
      // console.log(this.courseValue,"courseValue")
      // console.log(this.lession_id,"lession_id")
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
      that.getCourseList();
    },
    getCourseList() {
      var that = this;
      var params = {
        school_id: that.schoole_id,
        teacher_id: that.teacherValue
      };
      var url = getTeacherCourseUrl;
      // console.log(params,"=========params============")
      that.$axios.post(url, params).then(res => {
        // console.log(res,"resresresres")
        var result = res.data;
        // console.log(result.code,'--res.code--')
        if (result.code == ERR_OK) {
          that.coursesOption = result.data.course;
          for (var i = 0; i < that.coursesOption.length; i++) {
            // var serial = that.coursesOption[i].serial
            for (var j = 0; j < that.coursesOption[i].lessons.length; j++) {
              that.coursesOption[i].value = that.coursesOption[i].id;
              that.coursesOption[i].label =
                that.coursesOption[i].lessons[j].name;
              // that.coursesOption[i].lession_id = that.coursesOption[i].lessons[j].id
            }
          }
          // console.log(that.coursesOption,"that.coursesOption")
        }
      });
    },
    getTeacherList() {
      var that = this;
      var params = {
        school_id: that.schoole_id
      };
      var url = teacherListUrl;
      // console.log(params,"params")
      that.$axios.post(url, params).then(res => {
        var result = res.data;
        // console.log(result.code,'--res.code--')
        if (result.code == ERR_OK) {
          // that.tableData = result.data.category;
          // console.log(result.data.teachers,"result.data.teachers;")
          that.teachersOption = result.data.teachers;
          for (var i = 0; i < that.teachersOption.length; i++) {
            // console.log(that.teachersOption[i].id,"that.teachersOption[i].id")
            that.teachersOption[i].value = that.teachersOption[i].id;
            that.teachersOption[i].label =
              that.teachersOption[i].teacher.en_name;
          }
        }
      });
    },
    openDialogModel(room_id, hour) {
      var that = this;
      that.room_id = room_id;
      that.hour = hour;
      // console.log(that.hour,"that.hour")
      if (that.weekth == "") {
        that.$alert("请先选择排课周期", "提示");
        return;
      }
      if (that.teachersOption.length > 0) {
      } else {
        that.teachersOption = [];
        that.coursesOption = [];
        that.getTeacherList();
      }
      that.isShowPaikeDialog = true;
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
        lesson_id: that.lession_id,
        course_id: that.course_id,
        school_id: that.schoole_id,
        teacher_id: that.teacherValue
      };
      var url = editClassUrl;
      // console.log(params,"=========params============")

      that.$axios.post(url, params).then(res => {
        // console.log(res,"resresresres")
        var result = res.data;
        // console.log(result.code,'--res.code--')
        if (result.code == ERR_OK) {
          // console.log("success")
          that.getList();
          that.isShowPaikeDialog = false;
        } else if (result.code == 433) {
          that.$alert(result.message, "提示");
        }
      });
    },
    initList() {
      var that = this;
      list = [];
      for (var i = 0; i < this.hours.length; i++) {
        //一维长度为8
        var item = {
          hour: this.hours[i]+''
        };
        var blocks = [];
        for (var j = 0; j < that.rooms.length; j++) {
          var block = {
            room_id: that.rooms[j].id,
            roomName: that.rooms[j].name,
            course: "",
            teacher: "",
            courseSerial: "",
            lessonSerial: "",
            lessonName: "",
            teacherName: "",
            helpTeacherName:"",
            hour: this.hours[i],
            users_count: "",
            capacity: ""
          };
          blocks.push(block);
        }
        item.blocks = blocks;
        list.push(item);
      }
      that.list = list;
    },
    changeBook() {
      // console.log(this.book,"book")
      if (this.book_value == 2) {
        this.book = "";
      } else {
        this.book = this.book_value;
      }
      this.getList();
    },
    getList() {
      var that = this;
      var params = {
        schoole_id: localStorage.getItem("_school_id"),
        weekth: that.weekth,
        week: that.week,
        book: that.book //0只显示未订课程  1只显示已定课程  不传全部都显示
      };
      var url = bookCourseListUrl;
      // console.log(params,"params")
      that.$axios.post(url, params).then(res => {
        console.log(res, "resresresresresresresresresresresresresresresresres");
        var result = res.data;
        // console.log(result,'--result--')
        if (result.code == ERR_OK) {
          // that.tableData = result.data.category;
          var arranging = result.data;
          // console.log(arranging,"arranging");
          // console.log(Object.keys(arranging),"keys");
          var keys = Object.keys(arranging);
          var arr = [];
          for (var i = 0; i < keys.length; i++) {
            // console.log(arranging[keys[i]],"arranging")
            var obj = arranging[keys[i]];
            console.log(obj, "objobjobjobjobjobjobj");
            for (var j = 0; j < obj.length; j++) {
              var item = {
                week: obj[j].week,
                hour: obj[j].hour,
                lessonSerial: obj[j].course.serial,
                lessonName: obj[j].lesson.name,
                courseName: obj[j].course.name,
                teacherName: obj[j].teacher ? obj[j].teacher.en_name : "",
                helpTeacherName:obj[j].help_teacher?obj[j].help_teacher.en_name:"",
                roomName: obj[j].room.name,
                is_released: obj[j].is_released,
                users_count: obj[j].users_count,
                capacity: obj[j].capacity,
                lessonType: obj[j].lesson.teacher_type,
                teacherType: obj[j].teacher?obj[j].teacher.type_id:0,
                id: obj[j].id,
                area_id: obj[j].area_id
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
                    list[j].blocks[k].lessonSerial = arr[i].lessonSerial;
                    list[j].blocks[k].lessonName = arr[i].lessonName;
                    list[j].blocks[k].courseName = arr[i].courseName;
                    list[j].blocks[k].teacherName = arr[i].teacherName;
                    list[j].blocks[k].helpTeacherName = arr[i].helpTeacherName;
                    list[j].blocks[k].is_released = arr[i].is_released;
                    list[j].blocks[k].users_count = arr[i].users_count;
                    list[j].blocks[k].capacity = arr[i].capacity;
                    list[j].blocks[k].id = arr[i].id;
                    list[j].blocks[k].lessonType = arr[i].lessonType;
                    list[j].blocks[k].teacherType = arr[i].teacherType;
                    list[j].blocks[k].area_id = arr[i].area_id;
                  }
                }
              }
            }
          }
          that.list = list;
          // console.log(arr,"arr")
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
        weekth: this.weekth
      };
      // Object.assign(params, params, p);
      var url = arrangingReleaseUrl;
      // console.log(params,"params")
      that.$axios.post(url, params).then(res => {
        var result = res.data;
        // console.log(result.code,'--res.code--')
        if (result.code == ERR_OK) {
          that.$message({
            type: "success",
            message: "操作成功!"
          });
        }
      });
    },
    // hea(value){
    //   console.log(value)
    // },
    publish() {
      // arrangingReleaseUrl
      var that = this;
      this.$confirm("此操作将发布课程, 是否继续?", "提示", {
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
    changeweek() {
      var that = this;
      // console.log(that.week,"week")
      if (that.weekth == "") {
        that.$alert("请先选择排课周期", "提示");
      } else {
        that.getList();
      }
    },
    handleClickCloseLesson(row) {
      this.isShowCloseLessonDialog = true;
      var data = {
        arranging_id: row.pivot.arranging_id,
        user_id: row.id
      };
      this.data = data;
      this.grammar = row.pivot.grammar;
      this.vocabulary = row.pivot.vocabulary;
      this.pronunciation = row.pivot.pronunciation;
      this.listening_skings = row.pivot.listening_skings;
      this.fluency = row.pivot.fluency;
      this.results = row.pivot.results+"";
      this.is_sign = row.pivot.is_sign;
    },
    hideCloseLesson(row){
       this.isShowCloseLessonDialog = false;
       this.clearCloseLesson();
    },
    CloseLessonSubmit(){
        var url = TeacherCloseLessonUrl,
        params  = this.data;
        params.grammar =  this.grammar;
        params.vocabulary = this.vocabulary;
        params.pronunciation =this.pronunciation;
        params.listening_skings = this.listening_skings;
        params.fluency = this.fluency;
        params.results =this.results;
        var that = this;
        this.$axios.post(url,params).then(function(res){
            var result = res.data;
            if(result.code == ERR_OK){
               that.$message({
                type: "success",
                message: "操作成功!"
              });
            };
            that.hideCloseLesson();
            that.showDetail();
        })
    },
    clearCloseLesson(){
      this.grammar = 5;
      this.vocabulary =5 ;
      this.pronunciation=5;
      this.listening_skings=5;
      this.fluency=5;
      this.results="1";
    }
  }
};
</script>