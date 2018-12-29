<style lang="scss" scoped>
@import '../../common/scss/common.scss';
.apply{
  .operateTableBox{
    .functionBox{
     
    }
  }
  .margR{
    margin-right: 4px;
  }
  
  .functionBox{
    padding: 6px 10px;
  }
  .cardHeader{
    justify-content: space-between;
    border-bottom: 1px solid #c7c7c7;
    overflow: hidden;
    .headerTitle{
      font-size: 15px;
      color: #585858;
      padding: 12px 6px 12px 10px;
      color: $mainColor;
      font-weight: bold;
    }
    .close{
      font-size: 18px;
      margin-right: 4px;
      margin-top: 4px;
    }
  }
  
  .dialogBoxOuter{
    position:absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 928px;
    height: 560px;
    background-color: white;
    z-index: 1001;
    overflow: hidden;
    // box-shadow:3px 3px 20px 3px rgba(0,0,0,0.5);
    border: 1px solid #D6D6D6;
    border-radius: 10px;
    
  }
  .el-card__body{
    padding: 0px;
  }
  .headerDialog{
    font-size: 24px;
    height: 60px;
    line-height: 60px;
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
          <el-breadcrumb-item><span class="nocurrent">教师</span></el-breadcrumb-item>
          <el-breadcrumb-item><span>教师列表</span></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="operateTableBox">
      <div class="functionBox">
        <div class="element">
          <label class="inline">教师编码：</label>
          <div class="inline">
             <el-input v-model="serial" size="medium" placeholder="请输入所要查询的内容" clearable></el-input>
          </div>
          <label class="inline margL20">中文姓名：</label>
          <div class="inline">
             <el-input v-model="cn_name" size="medium" placeholder="请输入所要查询的内容" clearable></el-input>
          </div>
          <div class="inline">
            <el-button type="primary" size="medium" @click="search">查询</el-button>
          </div>
        </div>
      </div>
      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column
          prop="head_img_url"
          label="头像">
          <template slot-scope="scope">
              <img :src="scope.row.head_img_url" class="avatarUrl" width="60">
          </template>
        </el-table-column>
        <el-table-column
          prop="en_name"
          label="英文名称">
        </el-table-column>
        <el-table-column
          prop="cn_name"
          label="中文名称">
        </el-table-column>
        <el-table-column
          prop="serial"
          label="编码">
        </el-table-column>
        <el-table-column
          prop="type.name"
          label="教师类型">
        </el-table-column>
        <el-table-column prop="role.name" label="角色名称" width="100">
          <template slot-scope="scope">
              {{scope.row.role_id|filterRole}}
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="role_id"
          label="角色权限">
          <template slot-scope="scope">
              {{scope.row.role_id|filterRole}}
          </template>
        </el-table-column> -->
        <el-table-column
          prop="mobile"
          label="手机"
          width="120">
        </el-table-column>
        <el-table-column
          prop="address"
          label="住址">
        </el-table-column>
        <el-table-column
          prop="school_id"
          label="所在校区">
          <template slot-scope="scope">
              {{scope.row.school_id|filterSchool}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button @click="selectFreeTimeClick(scope.row)" type="text" size="small" icon="el-icon-edit-outline">选择空闲时间</el-button>
            <el-button @click="setClassClick(scope.row)" type="text" size="small" icon="el-icon-edit-outline">排课</el-button>
            <el-button @click="setPermissionClick(scope.row)" type="text" size="small" icon="el-icon-edit-outline">设置角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="tableBottom" v-show="showPageTag">
        <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-size="pageSize" :page-sizes="[6,8,10]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="排课" :visible.sync="dialogFormVisible" :append-to-body="true" :fullscreen="false" width="500px">
      <div class="dialogBody">
        <div class="element">
          <label class="inline">选择课程：</label>
          <div class="inline">
             <!-- <el-input v-model="lesson_id" size="medium" placeholder="请输入内容"></el-input> -->
             <el-select class="width140" size="medium" v-model="course_id" @change="courseChange" placeholder="请选择">
              <el-option
                v-for="item in courseList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="element margT20">
          <label class="inline">选择话题：</label>
          <div class="inline">
             <!-- <el-input v-model="lesson_id" size="medium" placeholder="请输入内容"></el-input> -->
             <el-select class="width200" size="medium" v-model="lesson_id" @change="lessonChange" placeholder="请选择">
              <el-option
                v-for="item in lessonList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="element margT20">
          <label class="inline">选择教室：</label>
          <div class="inline">
             <!-- <el-input v-model="room_id" size="medium" placeholder="请输入内容"></el-input> -->
             <el-select class="width140" size="medium" v-model="room_id" @change="roomChange" placeholder="请选择">
              <el-option
                v-for="item in rooms"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setClassEvent">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="设置空余时间" :visible.sync="isShowTableSetFreeDialog" :append-to-body="true" :fullscreen="true" :before-close="handleClose">
      <div class="functionBox">
        <div class="element">
          <label class="inline">教师名称：</label>
          <div class="inline">
             <el-select class="width140" v-model="teacherValue" size="medium" placeholder="请选择">
              <el-option
                v-for="item in tableData"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <m-time class="margL20" @getTimeData="getTimeData"></m-time>
        </div>
      </div>
      <table class="thisTableCheck">
        <tr class="header">
          <td class="tablelineheight" v-for="(item,index) in days">{{item.name}}</td>
        </tr>
        <tr v-for="(item,index) in list">
          <td class="tablelineheight">{{item.time}}</td>
          <td class="tablelineheight" v-for="(checkeds,index) in item.checkeds" :data-week="checkeds.week" :data-hour="checkeds.hour">
            <el-checkbox v-model="coordinatesAttr[checkeds.week][checkeds.hour].check"></el-checkbox>
          </td>
        </tr>
      </table>
      <div class="functionBox margT10">
         <div class="element">
          <el-button type="primary" size="medium" @click="showThisDay">批量钩选班次</el-button>
          <div class="inline" v-show="isShowDaySelect">
            <label class="inline">日期：</label>
            <el-select class="width100" v-model="thisDay" size="medium" placeholder="请选择" @change="thisDayChange">
              <el-option
                v-for="item in daysOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <label class="inline">班次：</label>
            <el-select class="width140" v-model="banci" size="medium" placeholder="请选择" @change="banciChange">
              <el-option
                v-for="item in bancisOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <!-- <el-button type="primary" size="medium" @click="lastTeacher">上一位教师</el-button>
          <el-button type="primary" size="medium" @click="nextTeacher">下一位教师</el-button> -->
          <!-- <el-button type="primary" size="medium" @click="addBan">加班</el-button> -->
          <el-button type="primary" class="" size="medium" @click="saveBtn">保存</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- ============================================================== -->
    <el-dialog title="给此教师的空余时间排课" :visible.sync="isShowTableSetCourseDialog" :append-to-body="true" :fullscreen="true" :before-close="handleClose">
      <div class="functionBox">
        <div class="element">
          <label class="inline">教师名称：</label>
          <div class="inline">
             <el-select class="width140" v-model="teacherValue" size="medium" placeholder="请选择">
              <el-option
                v-for="item in tableData"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <m-time class="margL20" @getTimeData="getTimeData"></m-time>
        </div>
      </div>
      <table class="thisTableCheck">
        <tr class="header">
          <td class="tablelineheight" v-for="(item,index) in days">{{item.name}}</td>
        </tr>
        <tr v-for="(item,index) in list">
          <td class="tablelineheight">{{item.time}}</td>
          <td style="text-align: left;" v-for="(checkeds,index) in item.checkeds" :data-week="checkeds.week" :data-hour="checkeds.hour" :class="[coordinatesAttr[checkeds.week][checkeds.hour].check==true?'freeColor':'']">
            <!-- <template v-if="coordinatesAttr[checkeds.week][checkeds.hour]">
              <el-checkbox v-model="coordinatesAttr[checkeds.week][checkeds.hour]"></el-checkbox>
            </template> -->
            <div>
              <el-checkbox class="tablelineheight" style="margin-left: 10px; float: left;" v-if="coordinatesAttr[checkeds.week][checkeds.hour].check" v-model="coordinatesAttr2[checkeds.week][checkeds.hour].check"></el-checkbox>
              <div v-if="coordinatesAttr[checkeds.week][checkeds.hour].arranging" style="float:left;color:white;margin-left: 6px;">
                <div class="ellipsis width120 margT4">{{coordinatesAttr[checkeds.week][checkeds.hour].course}}</div>
                <div class="ellipsis width120">{{coordinatesAttr[checkeds.week][checkeds.hour].lesson}}</div>
                <div class="ellipsis  width120">{{coordinatesAttr[checkeds.week][checkeds.hour].room}}.{{coordinatesAttr[checkeds.week][checkeds.hour].teacher}}</div>
              </div>
              <!-- <label v-if="coordinatesAttr[checkeds.week][checkeds.hour].arranging"></label> -->
            </div>
          </td>
        </tr>
      </table>
      <div class="functionBox margT10">
        <div class="element">
          <el-button type="primary" class="left margR" size="medium" @click="setClassBtn">给选中排课</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="设置角色" :visible.sync="setPermissionDialog" :append-to-body="true" :fullscreen="false" width='400'>
      <div class="headerDialog">
        <div class="element">
          <label class="inline">选择角色：</label>
          <div class="inline">
             <el-select class="width140" v-model="role_id" size="medium" placeholder="请选择">
              <el-option
                v-for="item in roleList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setPermissionDialog = false">取 消</el-button>
        <el-button type="primary" @click='setPermissionEvent'>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { teacherListUrl,teacherFreeEditUrl,teacherFreeUrl,setClassMoreUrl,getRoomsUrl,courseListUrl,lessonListUrl,roleListUrl,roleBindUrl,rolePermissionsUrl,schoolListUrl,ERR_OK } from '@/api/index'
import { getFullDate,getTime } from '@/common/js/utils'
import mTime from '../../components/time.vue'
var coordinatesAttr = new Array(); //先声明一维 
for ( var i = 0; i < 8; i++) { //一维长度为8
    coordinatesAttr[i] = new Array(); //再声明二维 
    for ( var j = 0; j < 21; j++) { //二维长度为21
        coordinatesAttr[i][j] = {}; // 赋值，每个数组元素的值为i+j
        coordinatesAttr[i][j].check = false;
    }
}
var coordinatesAttr2 = new Array(); //先声明一维 
for ( var i = 0; i < 8; i++) { //一维长度为8
    coordinatesAttr2[i] = new Array(); //再声明二维 
    for ( var j = 0; j < 21; j++) { //二维长度为21
        coordinatesAttr2[i][j] = {}; // 赋值，每个数组元素的值为i+j
        coordinatesAttr2[i][j].check = false;
    }
}
var coordinates = []
var oneDayTime = 24*60*60*1000
var list2 = [
        {time:'09:00~10:00',checkeds:[{week:'1',hour:'9'},{week:'2',hour:'9'},{week:'3',hour:'9'},{week:'4',hour:'9'},{week:'5',hour:'9'},{week:'6',hour:'9'},{week:'7',hour:'9'}]},
        {time:'10:00~11:00',checkeds:[{week:'1',hour:'10'},{week:'2',hour:'10'},{week:'3',hour:'10'},{week:'4',hour:'10'},{week:'5',hour:'10'},{week:'6',hour:'10'},{week:'7',hour:'10'}]},
        {time:'11:00~12:00',checkeds:[{week:'1',hour:'11'},{week:'2',hour:'11'},{week:'3',hour:'11'},{week:'4',hour:'11'},{week:'5',hour:'11'},{week:'6',hour:'11'},{week:'7',hour:'11'}]},
        {time:'12:00~13:00',checkeds:[{week:'1',hour:'12'},{week:'2',hour:'12'},{week:'3',hour:'12'},{week:'4',hour:'12'},{week:'5',hour:'12'},{week:'6',hour:'12'},{week:'7',hour:'12'}]},
        {time:'13:00~14:00',checkeds:[{week:'1',hour:'13'},{week:'2',hour:'13'},{week:'3',hour:'13'},{week:'4',hour:'13'},{week:'5',hour:'13'},{week:'6',hour:'13'},{week:'7',hour:'13'}]},
        {time:'14:00~15:00',checkeds:[{week:'1',hour:'14'},{week:'2',hour:'14'},{week:'3',hour:'14'},{week:'4',hour:'14'},{week:'5',hour:'14'},{week:'6',hour:'14'},{week:'7',hour:'14'}]},
        {time:'15:00~16:00',checkeds:[{week:'1',hour:'15'},{week:'2',hour:'15'},{week:'3',hour:'15'},{week:'4',hour:'15'},{week:'5',hour:'15'},{week:'6',hour:'15'},{week:'7',hour:'15'}]},
        {time:'16:00~17:00',checkeds:[{week:'1',hour:'16'},{week:'2',hour:'16'},{week:'3',hour:'16'},{week:'4',hour:'16'},{week:'5',hour:'16'},{week:'6',hour:'16'},{week:'7',hour:'16'}]},
        {time:'17:00~18:00',checkeds:[{week:'1',hour:'17'},{week:'2',hour:'17'},{week:'3',hour:'17'},{week:'4',hour:'17'},{week:'5',hour:'17'},{week:'6',hour:'17'},{week:'7',hour:'17'}]},
        {time:'18:00~19:00',checkeds:[{week:'1',hour:'18'},{week:'2',hour:'18'},{week:'3',hour:'18'},{week:'4',hour:'18'},{week:'5',hour:'18'},{week:'6',hour:'18'},{week:'7',hour:'18'}]},
        {time:'19:00~20:00',checkeds:[{week:'1',hour:'19'},{week:'2',hour:'19'},{week:'3',hour:'19'},{week:'4',hour:'19'},{week:'5',hour:'19'},{week:'6',hour:'19'},{week:'7',hour:'19'}]},
        {time:'20:00~21:00',checkeds:[{week:'1',hour:'20'},{week:'2',hour:'20'},{week:'3',hour:'20'},{week:'4',hour:'20'},{week:'5',hour:'20'},{week:'6',hour:'20'},{week:'7',hour:'20'}]}
      ]
var roleList=[]
var schoolsOptions=[]
export default {
  data() {
    return {
      maskIsShow: false,
      hackReset: false,
      isShowDaySelect: false,
      loading:true,
      pageIndex: 1,
      pageSize: 6,
      total: 100,
      showPageTag:false,
      name: '',
      en_name:'',
      tableData: [],
      dialogVisible: false,
      isShowTableDialog: false,
      teachers:[],
      teacherValue:'',
      coordinatesAttr:coordinatesAttr,
      coordinatesAttr2:coordinatesAttr2,
      weekth:'',
      // thisDate: '',
      thisDay: '',
      room_id:"",
      lesson_id:"",
      coordinates: [],
      teacher_id:'',
      schoole_id: localStorage.getItem("_school_id"),
      daysOption:[{label:'周一',value:1},{label:'周二',value:2},{label:'周三',value:3},{label:'周四',value:4},{label:'周五',value:5},{label:'周六',value:6},{label:'周日',value:7}],
      bancisOption:[{label:'09:00~12:00',value:'9~12'},{label:'12:00~18:00',value:'12~18'},{label:'18:00~21:00',value:'18~21'}],
      banci:'',
      days:[{name:'时间'},{name:'周一'},{name:'周二'},{name:'周三'},{name:'周四'},{name:'周五'},{name:'周六'},{name:'周日'}],
      list:list2,
      dialogFormVisible: false,
      rooms:'',
      room_id:'',
      courseList:'',
      course_id:'',
      lessonList:'',
      title:'',
      serial:"",
      cn_name:"",
      isShowTableSetCourseDialog:false,
      isShowTableSetFreeDialog:false,
      roleList:[],
      setPermissionDialog: false,
      roleName:"",
      user_id:"",
      role_id:""
      // schoolsOptions:localStorage.getItem("_schoolsOptions"))
    }
  },
  created() {
    schoolsOptions = JSON.parse(localStorage.getItem("_schoolsOptions"))
    console.log("_schoolsOptions",localStorage.getItem("_schoolsOptions"))
    // this.getTime1Option()
    this.getRoleList()
  },
  filters:{
    filterRole(t){
      if(t==0) {
        return '超级管理员';
      }
      for(var i=0;i<roleList.length;i++) {
        if(t==roleList[i].id) {
          return roleList[i].name;
        }
      }
    },
    filterSchool(t){
      console.log(t,"t")
      console.log(schoolsOptions,"schoolsOptions")
      for(var i=0;i<schoolsOptions.length;i++) {
        if(t==schoolsOptions[i].value) {
          console.log(schoolsOptions[i].name,"schoolsOptions[i].name")
          return schoolsOptions[i].name;
        }
      }
    }
  },
  components: {
    mTime
  },
  methods: {
    getRoleList() {
      let that = this;
      var params = {
        schoole_id: localStorage.getItem("_school_id"),
        area_id:localStorage.getItem('area_id')
      }
      var url = roleListUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        that.loading = false;
        var result = res.data;
        console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
          roleList = result.data;
          that.roleList = roleList;
          for(var i=0;i<that.roleList.length;i++){
            that.roleList[i].label = that.roleList[i].name
            that.roleList[i].value = that.roleList[i].id
          }
          this.getList()
        }
      });
    },
    setPermissionClick(row) {
      this.setPermissionDialog = true;
      // this.roleName = row.role.name
      this.user_id = row.id;
      this.role_id = row.role_id;
    },
    setPermissionEvent() {
      let that = this;
      var params = {
        schoole_id: localStorage.getItem("_school_id"),
        user_id:this.user_id,
        role_id:this.role_id
      }
      var url = roleBindUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        that.loading = false;
        var result = res.data;
        console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
          this.setPermissionDialog = false;
          that.getList()
          that.$message({
            message: '操作成功',
            type: 'success'
          });
        }
      })
    },
    search() {
      this.getList();
    },
    clickCheckbox(week,hour) {
      console.log(`${week},${hour}`)
      coordinates.push(`${week},${hour}`)
    },
    lessonChange(value) {
      // console.log(this.lesson_id,"lesson_id")
    },
    courseChange(value) {
      // console.log(this.course_id,"course_id")
      this.getLessonList()
    },
    roomChange(value) {
      // console.log(this.room_id,"room_id")
    },
    getLessonList() {
      let that = this;
      var params = {
        schoole_id: localStorage.getItem("_school_id"),
        course_id:that.course_id
        // offset: (that.pageIndex-1)*that.pageSize,
        // limit: that.pageSize,
      }
      var url = lessonListUrl;
      // console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        // console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
          that.lessonList = result.data.lesson;
          for(var i=0;i<that.lessonList.length;i++){
            that.lessonList[i].label = that.lessonList[i].name
            that.lessonList[i].value = that.lessonList[i].id
          }
        }
      });
    },
    getRooms() {
      var that = this;
      var params = {
        school_id: that.schoole_id
      }
      var url = getRoomsUrl;
      // console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        // console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
          // that.tableData = result.data.category;
          that.rooms = result.data.rooms;
          // console.log(that.rooms,"that.rooms")
          for(var i=0;i<that.rooms.length;i++){
            that.rooms[i].label = that.rooms[i].name
            that.rooms[i].value = that.rooms[i].id
          }
          // that.initList();
          // // console.log(that.list,"that.list")
        }
      })
    },
    getCourseList() {
      let that = this;
      var params = {
        school_id: this.school_id,
        // offset: (that.pageIndex-1)*that.pageSize,
        // limit: that.pageSize,
      }
      var url = courseListUrl;
      // console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        // console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
          that.courseList = result.data.course;
          for(var i=0;i<that.courseList.length;i++){
            that.courseList[i].label = that.courseList[i].name
            that.courseList[i].value = that.courseList[i].id
          }
        }
      });
    },
    setClassBtn(){
      this.getRooms();
      this.getCourseList();
      this.dialogFormVisible = true;
      // this.coordinates = coordinates;
      // console.log(coordinates,"coordinates")
    },
    setClassEvent() {
      let that = this;
      var con = []
      for ( var i = 1; i < 8; i++) { //一维长度为8
        for(var j=9;j<21;j++) {
          if(that.coordinatesAttr2[i][j].check == true) {
            con.push(`${i},${j}`)
          }
        }
      }
      this.coordinates = con;
      console.log("this.coordinates",this.coordinates)
      if(this.weekth==""){
        this.$message('请先选择排课周期');
        return;
      }
      if(this.coordinates==""){
        this.$message('请选择空余时间');
        return;
      }
      // console.log(JSON.stringify(this.coordinates),"--=-=-=-=-=-=-=")
      var params = {
        weekth: this.weekth,//ok
        coordinates: JSON.stringify(this.coordinates),
        room_id:this.room_id,//ok
        lesson_id:this.lesson_id,//ok
        teacher_id: this.teacherValue,//ok
        school_id: this.schoole_id
      }
      var url = setClassMoreUrl;
      // console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        // console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
          // that.tableData = result.data;
          that.getTeacherFree();
          that.$message({
            message: '操作成功',
            type: 'success'
          });
          that.isShowTableDialog = false;
          that.dialogFormVisible = false;
          // that.clearTable();
        }else{
          that.$message({
            message: result.message,
            type: 'error'
          });
        }
      });
    },
    // 排课
    setClassClick(row){
      var that = this;
      this.teacher_id = row.id;
      this.teacherValue = row.id;
      this.isShowTableSetCourseDialog = true;
      coordinates = []
      this.clearTable();
      this.getTimeData();
    },
    selectFreeTimeClick(row){
      this.teacher_id = row.id;
      this.teacherValue = row.id;
      this.isShowTableSetFreeDialog = true;
      this.getTimeData();
    },
    handleClose() {
      this.isShowTableSetCourseDialog = false;
      this.isShowTableSetFreeDialog = false;
      // this.clearTable()
    },
    lastTeacher() {

    },
    nextTeacher() {

    },
    showThisDay() {
      this.isShowDaySelect = true
    },
    banciChange(value) {
      var day = this.thisDay
      // console.log("周几：",this.thisDay)
      // console.log("班次：",value)
      var start = parseInt(value.split('~')[0])
      var end = parseInt(value.split('~')[1])
      // console.log("start:",start)
      // console.log("end:",end)
      for(var i=start;i<end;i++){
        this.coordinatesAttr[day][i].check = true
      }
    },
    thisDayChange(value) {
      // // console.log("this.thisDate:",this.thisDate)
      // var firstDate = this.$cookie.get("_firstDay")
      // var t = getTime(firstDate)+oneDayTime*(value-1)
      // this.thisDate = getFullDate(t)
      // // console.log("date:",getFullDate(t))
    },
    saveBtn() {
      var con = []
      for ( var i = 1; i < 8; i++) { //一维长度为8
        for(var j=9;j<21;j++) {
          if(this.coordinatesAttr[i][j].check == true) {
            con.push(`${i},${j}`)
          }
        }
      }
      this.coordinates = con;
      this.save();
    },
    save(){
      // console.log(this.weekth,"this.weekth")
      let that = this;
      if(this.weekth==""){
        this.$message('请先选择排课周期');
        return;
      }
      if(this.coordinates==""){
        this.$message('请选择空余时间');
        return;
      }
      // console.log(JSON.stringify(this.coordinates),"--=-=-=-=-=-=-=")
      var params = {
        weekth: this.weekth,
        coordinates: JSON.stringify(this.coordinates),
        teacher_id: this.teacherValue,
        school_id: this.schoole_id
      }
      var url = teacherFreeEditUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        // console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
          // that.tableData = result.data;
          this.$message({
            message: '保存成功',
            type: 'success'
          });
          // this.isShowTableDialog = false;
        }
      });
    },
    clearTable() {
      for ( var i = 1; i < 8; i++) { //一维长度为8
        for(var j=9;j<21;j++) {
          this.coordinatesAttr2[i][j].check = false;
          this.coordinatesAttr[i][j].check = false;
          this.coordinatesAttr[i][j].arranging = '';
          this.coordinatesAttr[i][j].course = '';
          this.coordinatesAttr[i][j].lesson = '';
          this.coordinatesAttr[i][j].room = '';
          this.coordinatesAttr[i][j].teacher = '';
        }
      }
    },
    getTimeData() {
      this.weekth = this.$cookie.get("_weekth")
      // console.log(this.weekth,"this.weekth")
      this.getTeacherFree()
      // 重置底部数据
      this.isShowDaySelect = false
      this.thisDay = ''
      this.banci = ''
    },
    getTeacherFree(){
      let that = this;
      var params = {
        weekth: this.weekth,
        teacher_id: this.teacherValue,
        school_id: this.schoole_id
      }
      var url = teacherFreeUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        // console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
          var list = result.data;
          if(list.length==0){
            that.clearTable()
          }else{
            that.clearTable()
            for(var i=0;i<list.length;i++){
              coordinatesAttr[list[i].week][list[i].hour].check = true
              // console.log(list[i].arranging,"list[i].arranging")
              if(list[i].arranging==null){
                console.log('null')
              }else{
                coordinatesAttr[list[i].week][list[i].hour].arranging = 1;
                coordinatesAttr[list[i].week][list[i].hour].course = list[i].arranging.course.name
                coordinatesAttr[list[i].week][list[i].hour].lesson = list[i].arranging.lesson.name
                coordinatesAttr[list[i].week][list[i].hour].room = list[i].arranging.room.name
                coordinatesAttr[list[i].week][list[i].hour].teacher = list[i].arranging.teacher.en_name
              }
            } 
            that.coordinatesAttr = coordinatesAttr
            console.log(that.coordinatesAttr,"that.coordinatesAttr")
          }
          that.list = [];
          that.list = list2;
        }
      });
    },
    getList(){
      let that = this;
      var params = {
        serial:that.serial,
        cn_name:that.cn_name,
        school_id: that.schoole_id,
        offset: (that.pageIndex-1)*that.pageSize,
        limit: that.pageSize
      }
      var url = teacherListUrl;
      // console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        that.loading = false;
        var result = res.data;
        // console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
          that.tableData = result.data.teachers;
          for(var i=0;i<that.tableData.length;i++) {
            that.tableData[i].label = that.tableData[i].cn_name;
            that.tableData[i].value = that.tableData[i].id;
          }

          that.total = result.data.count || 100;
          if(that.total<that.pageSize) {
            that.showPageTag = false;
          }else{
            that.showPageTag = true;
          }
        }
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


