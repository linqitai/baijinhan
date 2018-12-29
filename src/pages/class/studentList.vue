<style lang="scss" scoped>
.labelWidth{
  width: 100px;
}
.apply{
  .operateTableBox{
    .functionBox{
     
    }
  }
  .changeStatusDialog{
    box-shadow:3px 3px 20px 3px rgba(0,0,0,0.5);
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
          <el-breadcrumb-item><span class="nocurrent">学生</span></el-breadcrumb-item>
          <el-breadcrumb-item><span>学生列表</span></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="operateTableBox">
      <div class="functionBox">
        <div class="element">
          <div class="inline">
            <el-button type="primary" size="medium" @click="handleEditClick(null,'add')">新增</el-button>
          </div>
          <div class="inline margL20">
            <el-select class="width120" size="medium" v-model="option" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="inline">
             <el-input style="width: 160px;" v-model="value" placeholder="查询内容" size="medium"></el-input>
          </div>
          <div class="inline">
            <el-button type="primary" size="medium" @click="search">查询</el-button>
          </div>
          <div class="inline margL20">
            <el-checkbox class="">叠加查询</el-checkbox>
          </div>
          <div class="inline right margL20">
            <el-button type="primary" size="medium">导入</el-button>
          </div>
          <div class="inline right">
            <el-button type="primary" size="medium">导出</el-button>
          </div>
        </div>
      </div>
      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="end_time" label="最后跟踪时间" width="120">
          <template slot-scope="scope">
              {{scope.row.end_time|filterDate}}
           </template>
        </el-table-column>
        <el-table-column prop="track_people.en_name" label="班主任" width="120">
        </el-table-column>
        <el-table-column prop="contract_no" label="合同编号" width="180">
        </el-table-column>
        <el-table-column prop="serial" label="学号">
        </el-table-column>
        <el-table-column prop="cn_name" label="中文名">
        </el-table-column>
        <el-table-column prop="en_name" label="英文名">
        </el-table-column>
        <el-table-column prop="sex" label="性别">
          <template slot-scope="scope">
              {{scope.row.sex | filterSex}}
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机" width="120">
        </el-table-column>
        <el-table-column prop="home_phone" label="家庭电话" width="120">
        </el-table-column>
        <el-table-column
          prop="begin_level.name"
          label="开始级别">
        </el-table-column>
        <el-table-column
          prop="end_level.name"
          label="结束级别">
        </el-table-column>
        <el-table-column
          prop="level.name"
          label="当前级别">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <!-- 1未签,2执行3结束4冻结 -->
          <template slot-scope="scope">
              {{scope.row.status | filterStatus}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template slot-scope="scope">
            <el-button @click="handleEditClick(scope.row,'edit')" type="text" size="small" icon="el-icon-edit-outline">编辑</el-button>
            <el-button @click="handleEditStatusClick(scope.row)" type="text" size="small" icon="el-icon-edit-outline">修改状态</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="tableBottom" v-show="showPageTag">
        <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-size="pageSize" :page-sizes="[6,8,10]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

    <el-dialog class="changeStatusDialog" title="修改状态" :visible.sync="isShowStatusDialog"  :modal="true" :append-to-body="true"  width="400px">
      <div class="lineBox">
        <el-radio-group v-model="status">
          <el-radio :label="1">未签</el-radio>
          <el-radio :label="2">执行</el-radio>
          <el-radio :label="3">结束</el-radio>
          <el-radio :label="4">冻结</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowStatusDialog = false">取 消</el-button>
        <el-button type="primary" @click="sureBtn">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="dialogFormVisible" :append-to-body="true" :fullscreen="false" width="500px">
      <div class="dialogBody">
        <div class="element">
          <label class="inline labelWidth">中文名：</label>
          <div class="inline">
             <el-input v-model="form.cn_name" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline labelWidth">英文名：</label>
          <div class="inline">
             <el-input v-model="form.en_name" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline labelWidth">性别：</label>
          <div class="inline">
             <!-- <el-input v-model="form.sex" size="medium" placeholder="请输入内容"></el-input> -->
             <el-select size="medium" v-model="form.sex" placeholder="请选择">
              <el-option
                v-for="item in sexOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline labelWidth">手机号：</label>
          <div class="inline">
             <el-input v-model="form.mobile" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline labelWidth">家庭电话：</label>
          <div class="inline">
             <el-input v-model="form.home_phone" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline labelWidth">开始级别：</label>
          <div class="inline">
             <!-- <el-input v-model="form.begin_level" size="medium" placeholder="请输入内容"></el-input> -->
            <el-select  size="medium" v-model="form.begin_level" placeholder="请选择">
              <el-option
                v-for="item in courseLevelOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline labelWidth">结束级别：</label>
          <div class="inline">
             <!-- <el-input v-model="form.end_level" size="medium" placeholder="请输入内容"></el-input> -->
             <el-select size="medium" v-model="form.end_level" placeholder="请选择">
              <el-option
                v-for="item in courseLevelOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline labelWidth">班主任：</label>
          <div class="inline">
             <!-- <el-input v-model="form.track_people" size="medium" placeholder="请输入内容"></el-input>teacherTrackOption -->
             <el-select size="medium" v-model="form.track_people" placeholder="请选择">
              <el-option
                v-for="item in teacherTrackOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline labelWidth">状态：</label>
          <div class="inline">
             <!-- <el-input v-model="form.status" size="medium" placeholder="请输入内容"></el-input> -->
            <el-select size="medium" v-model="form.status" placeholder="请选择">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline labelWidth">合同类型：</label>
          <div class="inline">
             <!-- <el-input v-model="form.status" size="medium" placeholder="请输入内容"></el-input> -->
            <el-select size="medium" v-model="form.contract_type" placeholder="请选择">
              <el-option
                v-for="item in contract_typeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline labelWidth">培训开始时间：</label>
          <div class="inline">
             <!-- <el-input v-model="form.begin_time" size="medium" placeholder="请输入内容"></el-input> -->
            <!-- <el-date-picker
              v-model="form.begin_time"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="timestamp">
            </el-date-picker> -->
            <el-date-picker
                v-model="form.begin_time"
                type="date"
                size="medium"
                placeholder="选择日期"
                style="width: 160px;">
              </el-date-picker>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline labelWidth">培训结束时间：</label>
          <div class="inline">
             <!-- <el-input v-model="form.begin_time" size="medium" placeholder="请输入内容"></el-input> -->
            <!-- <el-date-picker
              v-model="form.end_time"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="timestamp">
            </el-date-picker> -->
            <el-date-picker
                v-model="form.end_time"
                type="date"
                size="medium"
                placeholder="选择日期"
                style="width: 160px;">
              </el-date-picker>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="medium">取 消</el-button>
        <el-button type="primary" @click="sureEditBtn" size="medium">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getStudentListUrl,editStudentInfoUrl,courseLevelListUrl,teacherTrackUrl,contractTypeUrl,ERR_OK } from '@/api/index'
import { getFullDate,getFullTime,getTime } from '@/common/js/utils'
export default {
  data() {
    return {
      begin_time:'',
      loading:true,
      pageIndex: 1,
      pageSize: 6,
      total: 0,
      schoole_id: localStorage.getItem("_school_id"),
      showPageTag:false,
      no: '',
      tableData: [],
      option:"serial",
      options:[{
        value:"",
        label:"全部"
      },{
        value:"serial",
        label:"学号"
      },{
        value:"en_name",
        label:"英文名"
      }],
      sexOption:[{
        value:1,
        label:"男"
      },{
        value:2,
        label:"女"
      }],
      // 1未签,2执行3结束4冻结
      statusOptions:[{
        value:1,
        label:"未签"
      },{
        value:2,
        label:"执行"
      },{
        value:3,
        label:"结束"
      },{
        value:4,
        label:"冻结"
      }],
      courseLevelOption:[],
      teacherTrackOption:[],
      contract_typeOption:[],
      value:"",
      isShowStatusDialog: false,//编辑状态
      dialogFormVisible: false,//编辑学生信息
      maskIsShow: false,
      status: "",
      serial:'',
      en_name:'',
      form:{
        user_id:"",
        cn_name:"",
        en_name:"",
        sex:1,
        mobile:"",
        home_phone:"",
        contract_type:"",
        begin_level:"",
        end_level:"",
        status:"",
        track_people:"",
        begin_time:'',
        end_time:''
      },
      title:'',
      operate:''
    }
  },
  filters:{
    // <!-- 1未签,2执行3结束4冻结 -->
    filterStatus(t){
      return t==1?"未签":t==2?"执行":t==3?"结束":"冻结"
    },
    filterSex(t){
      return t==1?"男":"女"
    },
    filterDate(t){
      return getFullDate(t)
    },
    filterTime(t){
      return getFullTime(t)
    }
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取合同类型数据 contractTypeUrl
    getContract_typeList() {
      let that = this;
      var params = {
        schoole_id: localStorage.getItem("_school_id"),
        area_id: localStorage.getItem('area_id')
      }
      var url = contractTypeUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
          that.contract_typeOption = result.data;
          for(var i=0;i<that.contract_typeOption.length;i++){
             that.contract_typeOption[i].value = that.contract_typeOption[i].id
             that.contract_typeOption[i].label = that.contract_typeOption[i].name
          }
        }
      });
    },
    // 获取班主任列表
    getTeacherTrackList(){
      // teacherTrackUrl
      let that = this;
      var params = {
        schoole_id: localStorage.getItem("_school_id"),
        area_id: localStorage.getItem('area_id')
      }
      var url = teacherTrackUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
          that.teacherTrackOption = result.data;
          for(var i=0;i<that.teacherTrackOption.length;i++){
             that.teacherTrackOption[i].value = that.teacherTrackOption[i].id
             that.teacherTrackOption[i].label = that.teacherTrackOption[i].en_name
          }
          console.log(that.teacherTrackOption,"teacherTrackOption")
        }
      });
    },
    getCourseLevelList() {
      let that = this;
      var params = {
        schoole_id: localStorage.getItem("_school_id"),
        area_id: localStorage.getItem('area_id')
      }
      var url = courseLevelListUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
          that.courseLevelOption = result.data.list;
          for(var i=0;i<that.courseLevelOption.length;i++){
             that.courseLevelOption[i].value = that.courseLevelOption[i].id
             that.courseLevelOption[i].label = that.courseLevelOption[i].name
          }
        }
      });
    },
    handleEditClick(row,operate) {
      console.log(row,"row,row")
      this.dialogFormVisible = true;
      this.operate = operate;
      this.getCourseLevelList();
      this.getTeacherTrackList();
      this.getContract_typeList();
      if(operate=='edit'){
        this.title = '编辑学生信息'
        this.form = {
          schoole_id: localStorage.getItem("_school_id"),
          user_id: row.id,
          cn_name: row.cn_name,
          en_name: row.en_name,
          sex: row.sex,
          mobile: row.mobile,
          home_phone: row.home_phone,
          contract_type: parseInt(row.contract_type),
          begin_level: row.begin_level.id,
          end_level: row.end_level.id,
          status: parseInt(row.status),
          track_people: parseInt(row.track_people.id),
          begin_time: row.begin_time,
          end_time: row.end_time
        }
      }else{
        this.title = '新增学生信息'
        this.form = {
          schoole_id: localStorage.getItem("_school_id"),
          user_id:'',
          cn_name:'',
          en_name:'',
          sex:'',
          mobile:'',
          home_phone:'',
          contract_type:'',
          begin_level:"",
          end_level:"",
          status:"",
          track_people:"",
          begin_time:'',
          end_time:''
        }
      }
      console.log(this.form,"this.form")
    },
    sureEditBtn() {
      var that = this;
      var params = that.form;
      params.begin_time = getTime(that.form.begin_time)/1000;
      params.end_time = getTime(that.form.end_time)/1000;
      var url = editStudentInfoUrl;
      console.log(params,"params")                                                                                                          
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
          that.$alert('修改成功');
          that.getList();
          that.dialogFormVisible = false;
        }else{
          that.$alert('所填写的数据有误');
        }
      }).catch(res => {
        that.$alert('所填写的数据有误');
      })
    },
    handleEditStatusClick(row) {
      this.isShowStatusDialog = true;
      this.form.user_id = row.id
    },
    sureBtn() {
      this.isShowStatusDialog = false;
      this.maskIsShow = false;
      var that = this;
      var params = {
        schoole_id: localStorage.getItem("_school_id"),
        user_id: this.form.user_id,
        status: that.status
      }
      var url = editStudentInfoUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
          that.$alert('修改成功');
          that.getList();
        }
      })
    },
    search() {
      this.getList()
    },
    getList() {
      var that = this;
      if(that.option=='serial'){
        that.serial = that.value;
        that.en_name="";
      }else if(that.option == 'en_name'){
        that.serial="";
        that.en_name = that.value
      }else{
        that.serial="";
        that.en_name="";
      }
      var params = {
        serial: that.serial,
        en_name: that.en_name,
        school_id: that.schoole_id,
        offset: (that.pageIndex-1)*that.pageSize,
        limit: that.pageSize
      }
      var url = getStudentListUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        that.loading = false;
        var result = res.data;
        console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
          that.tableData = result.data.user;
          that.total = result.data.count;
          if(that.total<that.pageSize) {
            that.showPageTag = false;
          }else{
            that.showPageTag = true;
          }
        }
      })
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
    }
  }
}
</script>


