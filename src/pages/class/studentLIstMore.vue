<style lang="scss" scoped>
.labelWidth {
  width: 100px;
}
.apply {
  .operateTableBox {
    .functionBox {
    }
  }
  .changeStatusDialog {
    box-shadow: 3px 3px 20px 3px rgba(0, 0, 0, 0.5);
  }
  .closeLesson {
    box-shadow: 3px 3px 20px 3px rgba(0, 0, 0, 0.5);
  }
 
}
.table-expand {
  font-size: 0;
}
.table-expand label{
  width: 90px;
  color: #99a9bf;
}
.table-expand .el-form-item {
  margin-right: 0; 
  margin-bottom: 0;
  width: 50%;
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
            <span class="nocurrent">学生</span>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <span>学生列表</span>
          </el-breadcrumb-item>
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
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="inline">
            <el-input style="width: 160px;" v-model="value" placeholder="查询内容" size="medium"></el-input>
          </div>
          <div class="inline">
            <el-button type="primary" size="medium" @click="search">查询</el-button>
          </div>
          <div class="inline margL20">
            <el-checkbox class>叠加查询</el-checkbox>
          </div>
          <div class="inline margL20">
             <label class="inline">班主任筛选</label>
            <el-select
              v-model="tracksChoosed"
              placeholder="请选择"
              size="medium"
              @change="tracksChoose"
              type="index"
            >
              <el-option
                v-for="item in teacherTrackOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="inline margL20">
            <el-button type="primary" size="medium" @click="reset">取消筛选</el-button>
          </div>

          <div class="inline right margL20">
            <el-button type="primary" size="medium">导入</el-button>
          </div>
          <div class="inline right">
            <el-button type="primary" size="medium">导出</el-button>
          </div>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading"
        @sort-change="sortChange"
        stripe
        fit
        highlight-current-row
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item>
                <label>中文名：</label>
                <span>{{ props.row.cn_name }}</span>
              </el-form-item>
              <el-form-item prop="props">
                <label>性别：</label>
                <span>
                  {{props.row.sex==1?"男":"女"}}
                  <!-- <template slot-scope="scope">{{scope.row.sex | filterSex}}</template> -->
                </span>
              </el-form-item>
              <el-form-item>
                <label>联系电话：</label>
                <span>{{ props.row.mobile }}</span>
              </el-form-item>
              <el-form-item>
                <label>开始级别：</label>
                <span>{{ props.row.begin_level.name}}</span>
              </el-form-item>
              <el-form-item>
                <label>结束级别</label>
                <span>{{ props.row.end_level.name }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="contract_no" label="学号" width="100" sortable="custom"></el-table-column>
        <el-table-column prop="track_people.en_name" label="班主任" width="120" class-name="fontsize12"></el-table-column>
        <el-table-column prop="en_name" label="英文名"  width="100"></el-table-column>
        <el-table-column prop="cn_name" label="中文名"  width="80"></el-table-column>
        <el-table-column prop="mobile" label="联系电话"  width="120"></el-table-column>
        <!-- <el-table-column prop="sex" label="性别" width="60">
          <template slot-scope="scope">{{scope.row.sex | filterSex}}</template>
        </el-table-column> -->
      
        <!-- <el-table-column prop="home_phone" label="家庭电话" width="120"></el-table-column> -->
        <!-- <el-table-column prop="begin_level.name" label="开始级别" width="120" sortable></el-table-column> -->
        <!-- <el-table-column prop="end_level.name" label="结束级别" width="120"></el-table-column> -->
        <el-table-column prop="level.name" label="当前级别" width="120" sortable></el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <!-- 1未签,2执行3结束4冻结 -->
          <template slot-scope="scope">{{scope.row.status | filterStatus}}</template>
        </el-table-column>
        <!-- <el-table-column prop="contract.name" label="合同类型" width="120"></el-table-column> -->
        <el-table-column prop="begin_time" label="开始时间" width="120" sortable></el-table-column>
        <el-table-column prop="end_time" label="结束时间" width="120"></el-table-column>
        <el-table-column prop="end_time" label="学生类型" width="120">
          <template slot-scope="scope">{{scope.row.student_type_id|filterType}}</template>
        </el-table-column>
        <el-table-column label="操作" width="270" fixed="right">
          <template slot-scope="scope">
            <el-button
              @click="handleEditClick(scope.row,'edit')"
              type="text"
              size="small"
              icon="el-icon-edit-outline"
            >编辑</el-button>
            <el-button
              @click="handleListClick(scope.row,'edit')"
              type="text"
              size="small"
              icon="el-icon-edit-outline"
            >结课</el-button>
            <el-button
              @click="handleEditStatusClick(scope.row)"
              type="text"
              size="small"
              icon="el-icon-edit-outline"
            >修改状态</el-button>
             <el-button
              @click="handleEditTypeClick(scope.row)"
              type="text"
              size="small"
              icon="el-icon-edit-outline"
            >学生类型</el-button>
                <el-button
              @click="handleEditPassworldClick(scope.row)"
              type="text"
              size="small"
              icon="el-icon-edit-outline"
            >重置密码</el-button>
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
      class="changeStatusDialog"
      title="修改状态"
      :visible.sync="isShowStatusDialog"
      :modal="true"
      :append-to-body="true"
      width="400px"
    >
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

    <el-dialog
      class="changeStatusDialog"
      title="修改学生类型"
      :visible.sync="isShowTypeDialog"
      :modal="true"
      :append-to-body="true"
      width="500px"
    >
      <div class="lineBox">
        <el-radio-group v-model="type">
          <el-radio :label="1">TM</el-radio>
          <el-radio :label="2">新常规</el-radio>
          <el-radio :label="3">VIP</el-radio>
          <el-radio :label="4">精英汇</el-radio>
          <el-radio :label="5">蓝标</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowTypeDialog = false">取 消</el-button>
        <el-button type="primary" @click="sureTypeBtn">确 定</el-button>
      </span>
    </el-dialog>
      <el-dialog
      class="changeStatusDialog"
      title="重置学生密码"
      :visible.sync="isShowPasswordDialog"
      :modal="true"
      :append-to-body="true"
      width="500px"
    >
      <div class="lineBox">
        
        <el-radio-group v-model="type">
          <el-radio :label="1">TM</el-radio>
         
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowTypeDialog = false">取 消</el-button>
        <el-button type="primary" @click="sureTypeBtn">确 定</el-button>
      </span>
    </el-dialog>


    <el-dialog
      class="closeLesson"
      title="学生结课"
      :visible.sync="closeLesson"
      :modal="true"
      :append-to-body="true"
      width="800px"
    >
      <el-tag
        type="info"
      >当前等级：{{chooseUser&&chooseUser.level&&chooseUser.level.name?chooseUser.level.name:''}}</el-tag>
      <el-tag type="info">中文名：{{chooseUser.cn_name}}</el-tag>
      <el-tag type="info">英文名：{{chooseUser.en_name}}</el-tag>
      <el-select
        class="width120"
        size="medium"
        v-model="courseListItem"
        placeholder="请选择"
        @change="lesson"
      >
        <el-option v-for="item in courseList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>

      <el-tabs
        type="border-card"
        style="margin-top:10px"
        @tab-click="lessonTab"
        v-model="lessonStatus"
      >
        <el-tab-pane label="未结课程" name="1">
          <el-table
            v-loading="lessonLoading"
            ref="multipleTable"
            :data="lessonList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="lessonSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <!-- <el-table-column label="课程" width="120">
          <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>-->
            <el-table-column prop="name" label="话题" width="650px"></el-table-column>
            <!-- <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column> -->
          </el-table>

          <div class="tableBottom">
            <el-pagination
              class="pagination"
              @size-change="handleSizeChange"
              @current-change="handleLessonChange"
              :current-page.sync="lessonPageIndex"
              :page-size="lessonPageSize"
              :page-sizes="[6,8,10]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="lessonTotal"
            ></el-pagination>
          </div>

          <div style="margin-top: 20px">
            <!-- <el-button @click="toggleSelection([tableData3[1], tableData3[2]])">切换第二、第三行的选中状态</el-button> -->
            <!-- <el-button @click="toggleSelection()">关闭</el-button> -->
            <el-button @click="sureEdit()">确认选中</el-button>
            <small style="color:grey;font-size:12px">** 请每页结果都进行确认操作</small>
          </div>
        </el-tab-pane>
        <el-tab-pane label="已结课程" name="2">
          <el-table
            v-loading="lessonLoading"
            ref="multipleTable"
            :data="lessonList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="lessonSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <!-- <el-table-column label="课程" width="120">
          <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>-->
            <el-table-column prop="name" label="话题" width="450px"></el-table-column>
            <el-table-column  label="操作" width="200px">
              <template slot-scope="scope">
                <el-button @click="restore(scope.row)" size="small">恢复</el-button>
              </template>
               
            </el-table-column>
          
            <!-- <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column> -->
          </el-table>

          <div class="tableBottom">
            <el-pagination
              class="pagination"
              @size-change="handleSizeChange"
              @current-change="handleLessonChange"
              :current-page.sync="lessonPageIndex"
              :page-size="lessonPageSize"
              :page-sizes="[6,8,10]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="lessonTotal"
            ></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
<!-- 学生编辑 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogFormVisible"
      :append-to-body="true"
      :fullscreen="false"
      width="500px"
    >
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
                :value="item.value"
              ></el-option>
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
          <label class="inline labelWidth">当前级别：</label>
          <div class="inline">
            <!-- <el-input v-model="form.begin_level" size="medium" placeholder="请输入内容"></el-input> -->
            <el-select size="medium" v-model="form.level_id" placeholder="请选择">
              <el-option
                v-for="item in courseLevelOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>

        <div class="element margT10">
          <label class="inline labelWidth">开始级别：</label>
          <div class="inline">
            <!-- <el-input v-model="form.begin_level" size="medium" placeholder="请输入内容"></el-input> -->
            <el-select size="medium" v-model="form.begin_level" placeholder="请选择">
              <el-option
                v-for="item in courseLevelOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
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
                :value="item.value"
              ></el-option>
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
                :value="item.value"
              ></el-option>
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
                :value="item.value"
              ></el-option>
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
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline labelWidth">合同号：</label>
          <div class="inline">
            <el-input v-model="form.contract_no" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline labelWidth">培训开始时间：</label>
          <div class="inline">
            <el-date-picker
              v-model="form.begin_time"
              type="date"
              size="medium"
              placeholder="选择日期"
              style="width: 160px;"
            ></el-date-picker>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline labelWidth">培训结束时间：</label>
          <div class="inline">
            <el-date-picker
              v-model="form.end_time"
              type="date"
              size="medium"
              placeholder="选择日期"
              style="width: 160px;"
            ></el-date-picker>
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
import {
  getStudentListUrl,
  editStudentInfoUrl,
  courseLevelListUrl,
  teacherTrackUrl,
  contractTypeUrl,
  getTeacherCourseUrl,
  waitCloseLessonUrl,
  closeLessonUrl,
  restoreLessonUrl,
  studentTypeListUrl,
  updateStudentTypeUrl,
  ERR_OK
} from "@/api/index";
import {
  getFullDate,
  getFullTime,
  getTime,
  formClear
} from "@/common/js/utils";
export default {
  data() {
    return {
      begin_time: "",
      loading: true,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      showPageTag: false,
      no: "",
      tableData: [],
      option: "serial",
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "serial",
          label: "学号"
        },
        {
          value: "en_name",
          label: "英文名"
        },
         {
          value: "cn_name",
          label: "中文名"
        },
        {
          value:"mobile",
          label:"联系电话"
        }
      ],
      sexOption: [
        {
          value: 1,
          label: "男"
        },
        {
          value: 2,
          label: "女"
        }
      ],
      // 1未签,2执行3结束4冻结
      statusOptions: [
        {
          value: 1,
          label: "未签"
        },
        {
          value: 2,
          label: "执行"
        },
        {
          value: 3,
          label: "结束"
        },
        {
          value: 4,
          label: "冻结"
        }
      ],
      courseLevelOption: [],
      teacherTrackOption: [],
      contract_typeOption: [],
      studentTypeOptions:[],
      value: "",
      isShowStatusDialog: false, //编辑状态
      dialogFormVisible: false, //编辑学生信息
      closeLesson: false,
      maskIsShow: false,
      status: "",
      type:"",
      serial: "",
      en_name: "",
      form: {
        user_id: "",
        cn_name: "",
        en_name: "",
        sex: 1,
        mobile: "",
        home_phone: "",
        contract_type: "",
        contract_no: "",
        level: "",
        level_id: 0,
        begin_level: "",
        end_level: "",
        status: "",
        track_people: "",
        begin_time: "",
        end_time: ""
      },
      title: "",
      operate: "",

      // ----------- 2018.1.16 dtc新增
      course_id: "", // 选课选取的课程id
      courseList: [], //课程list
      courseListItem: "", //选中的课程
      lessonList: [], //话题list
      chooseUser: {
        //选中的学生的数据
        level: { name: "" },
        en_name: "",
        cn_name: "",
        id: 0
      },
      lessonPageIndex: 1, //话题列表页数
      lessonPageSize: 10, //话题列表页面内容数量
      lesson_ids: [], //选中的lesson_ids
      lessonTotal: 0, //话题列表总数
      tracksList: [], //班主任列表
      tracksChoosed: "", //选中的班主任
      lessonStatus: "1" ,//话题状态
      lessonLoading : true,
      isShowTypeDialog:false, //是否显示学生类型
      isShowPasswordDialog:false//是否显示重置密码
    };
    //-------------end
  },
  filters: {
    // <!-- 1未签,2执行3结束4冻结 -->
    filterStatus(t) {
      return t == 1 ? "未签" : t == 2 ? "执行" : t == 3 ? "结束" : "冻结";
    },
    filterSex(t) {
      return t == 1 ? "男" : "女";
    },
    filterDate(t) {
      return getFullDate(t);
    },
    filterTime(t) {
      return getFullTime(t);
    },
    filterType(t){
      var res = '未知';
      switch (t){
        case 1:
          res = "TM";
          break;
        case 2:
          res="新常规";
          break;
        case 3:
          res="VIP";
          break;
        case 4:
          res="精英汇";
          break;
        case 5:
          res="蓝标";
          break;   
      }
      return res;
      // console.log('TTTTTTTTTTTTT');
      // var res = '未知';
      // for(var i =0 ; i<vm.studentTypeOptions.length;i++){
      //   if(vm.studentTypeOptions[i].id == t){
      //     res = vm.studentTypeOptions[i].name
      //     break;
      //   }
      // }
      // return res;
    }
  },
  created() {
    this.getStudentTypeList();
    this.getCourseList();
    this.getTeacherTrackList();
    this.getList();
    
   
  },
  methods: {
    // 获取合同类型数据 contractTypeUrl
    getContract_typeList() {
      let that = this;
      var params = {};
      var url = contractTypeUrl;
      console.log(params, "params");
      this.$axios.post(url, params).then(res => {
        var result = res.data;
        console.log(result.code, "--res.code--");
        if (result.code == ERR_OK) {
          that.contract_typeOption = result.data;
          for (var i = 0; i < that.contract_typeOption.length; i++) {
            that.contract_typeOption[i].value = that.contract_typeOption[i].id;
            that.contract_typeOption[i].label =
              that.contract_typeOption[i].name;
          }
        }
      });
    },
    // 获取班主任列表
    getTeacherTrackList() {
      // teacherTrackUrl
      let that = this;
      var params = {};
      var url = teacherTrackUrl;
      console.log(params, "params");
      this.$axios.post(url, params).then(res => {
        var result = res.data;
        console.log(result.code, "--res.code--");
        if (result.code == ERR_OK) {
          that.teacherTrackOption = result.data;
          for (var i = 0; i < that.teacherTrackOption.length; i++) {
            that.teacherTrackOption[i].value = that.teacherTrackOption[i].id;
            that.teacherTrackOption[i].label =
              that.teacherTrackOption[i].en_name;
          }
          console.log(that.teacherTrackOption, "teacherTrackOption");
        }
      });
    },
    getCourseLevelList() {
      let that = this;
      var params = {};
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
    //获取学生列表
    getStudentTypeList(){
      let that = this;
      var params = {
        offset:0,
        limit:999
      };
      var url = studentTypeListUrl;
      this.$axios.post(url, params).then(res => {
        var result = res.data;
        if (result.code == ERR_OK) {
          that.studentTypeOptions = result.data.list;
        }
      });
    },
    handleListClick(row, operate) {
      (this.courseListItem = ""),
        (this.lessonList = []),
        (this.closeLesson = true);
      this.getCourseList();
      this.chooseUser = {
        id: row.id,
        en_name: row.en_name,
        level: row.level,
        cn_name: row.cn_name
      };
      console.log(row);
    },
    handleEditClick(row, operate) {
      console.log(row, "row,row");
      this.dialogFormVisible = true;
      this.operate = operate;
      this.getCourseLevelList();
      this.getTeacherTrackList();
      this.getContract_typeList();
      if (operate == "edit") {
        this.title = "编辑学生信息";
        this.form = {
          user_id: row.id,
          cn_name: row.cn_name,
          en_name: row.en_name,
          sex: row.sex,
          mobile: row.mobile,
          home_phone: row.home_phone,
          contract_type: parseInt(row.contract_type),
          contract_no: row.contract_no,
          level: row.level,
          level_id: row.level.id ? row.level.id : row.level_id,
          begin_level: row.begin_level.id,
          end_level: row.end_level.id,
          status: parseInt(row.status),
          track_people: parseInt(row.track_people.id),
          begin_time: row.begin_time,
          end_time: row.end_time
        };
        console.log(this.form.level,'level')
      } else {
        this.title = "新增学生信息";
        formClear(this.form);
      }
    },
    sureEditBtn() {
      var that = this;
      var params = that.form;
      params.begin_time = getTime(that.form.begin_time) / 1000;
      params.end_time = getTime(that.form.end_time) / 1000;
      var url = editStudentInfoUrl;
      console.log(params, "params");
      this.$axios
        .post(url, params)
        .then(res => {
          var result = res.data;
          console.log(result.code, "--res.code--");
          if (result.code == ERR_OK) {
            that.$message({
              showClose: true,
              message: "操作成功",
              type: "success"
            });
            that.dialogFormVisible = false;
            that.getList();
          } else {
            that.$alert("所填写的数据有误");
          }
        })
        .catch(res => {
          that.$alert("所填写的数据有误");
        });
    },
    handleEditStatusClick(row) {
      this.isShowStatusDialog = true;
      this.form.user_id = row.id;
    },
    handleEditTypeClick(row) {
      this.isShowTypeDialog = true;
      this.form.user_id = row.id;
    },
      handleEditPasswordClick(row) {
      this.isShowPasswordDialog = true;
      this.form.user_id = row.id;
    },
    sureBtn() {
      this.isShowStatusDialog = false;
      this.maskIsShow = false;
      var that = this;
      var params = {
        user_id: this.form.user_id,
        status: that.status
      };
      var url = editStudentInfoUrl;
      console.log(params, "params");
      this.$axios.post(url, params).then(res => {
        var result = res.data;
        console.log(result.code, "--res.code--");
        if (result.code == ERR_OK) {
          that.$message({
            showClose: true,
            message: "操作成功",
            type: "success"
          });
          that.getList();
        }
      });
    },
    //修改类型按钮
    sureTypeBtn(){
       this.isShowTypeDialog = false;
        var that = this;
        var params = {
          user_id: this.form.user_id,
          type: that.type
        };
        var url = updateStudentTypeUrl;
        this.$axios.post(url, params).then(res => {
          var result = res.data;
          if (result.code == ERR_OK) {
            that.$message({
              showClose: true,
              message: "操作成功",
              type: "success"
            });
            that.getList();
          }
        });
    },
    search() {
      this.getList();
    },
    getList() {
      var that = this;
      if (that.option == "serial") {
        that.serial = that.value;
        that.en_name = "";
        that.cn_name = "";
        that.mobile = "";
      } else if (that.option == "en_name") {
        that.serial = "";
        that.en_name = that.value;
        that.cn_name = "";
        that.mobile = "";
      } else if (that.option == "cn_name"){
        that.serial = "";
        that.en_name = "";
        that.cn_name = that.value;
        that.mobile = "";
      }else if(that.option == "mobile"){
        that.serial = "";
        that.en_name = ""
        that.cn_name = ""
        that.mobile = that.value;
      }else {
        that.serial = "";
        that.en_name = "";
        that.cn_name = "";
        that.mobile = "";
      }

      var params = {
        serial: that.serial,
        en_name: that.en_name,
        cn_name:that.cn_name,
        mobile:that.mobile,
        offset: (that.pageIndex - 1) * that.pageSize,
        limit: that.pageSize
      };
      if (that.tracksChoosed) {
        params.track_people = that.tracksChoosed;
      }

      var url = getStudentListUrl;
      console.log(params, "params");
      this.$axios.post(url, params).then(res => {
        that.loading = false;
        var result = res.data;
        console.log(result.code, "--res.code--");
        if (result.code == ERR_OK) {
          that.tableData = result.data.user;
          that.total = result.data.count;
          if (that.total < that.pageSize) {
            that.showPageTag = false;
          } else {
            that.showPageTag = true;
          }
        }
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

    //-------------2019.1.16 dtc修改
    handleLessonChange(val) {
      this.lessonPageIndex = val;
      this.lesson();
    },
    lessonSelectionChange(val) {
      console.log(val);
      var arr = [];
      for (var i = 0; i < val.length; i++) {
        arr.push(val[i].id);
      }
      this.lesson_ids = arr;
    },
    getCourseList(level = false) {
      var url = getTeacherCourseUrl;
      var that = this;
      var params = {};
      if (level) {
        params = {
          level_id: level
        };
      }
      this.$axios.post(url, params).then(res => {
        var result = res.data;
        if (result.code == ERR_OK) {
          that.courseList = result.data.course;
        }
      });
    },
    //获取结课列表
    lesson(res) {
      this.lessonLoading = true;
      console.log(this.loading);
      if (res != void 0 && res != this.course_id) {
        this.lessonPageIndex = 1;
        this.course_id = res;
      }
      var url = waitCloseLessonUrl,
        params = {},
        that = this;
      params.course_id = this.course_id;
      if (void 0 == that.chooseUser.level.id) {
        return that.$message({
          showClose: true,
          message: "请先设置正确的学生等级",
          type: "error"
        });
      }
      params.course_level = that.chooseUser.level.id;
      params.user_id = that.chooseUser.id;
      params.lesson_status = that.lessonStatus;
      (params.offset = (that.lessonPageIndex - 1) * that.lessonPageSize),
        (params.limit = that.lessonPageSize);
      this.$axios.post(url, params).then(res => {
        var result = res.data;
        if (result.code == ERR_OK) {
          that.lessonList = result.data.lesson;
          that.lessonTotal = result.data.count;
        }
         this.lessonLoading = false;
      });
       
    },
    toggleSelection(res) {
      console.log(res);
    },
    //提交结课批量操作
    sureEdit() {
      var url = closeLessonUrl,
        params = {},
        that = this;
      params.lesson_ids = that.lesson_ids;
      params.user_id = that.chooseUser.id;
      this.$axios.post(url, params).then(res => {
        var result = res.data;
        if (result.code == ERR_OK) {
          that.$message({
            showClose: true,
            message: "操作成功",
            type: "success"
          });
          that.lesson();
        } else {
          that.$message({
            showClose: true,
            message: "操作失败",
            type: "error"
          });
        }
      });
    },
    lessonTab(res) {
      this.lessonStatus = res.name;
      this.lesson();
    },
    //select 班主任选中事件
    tracksChoose() {
      this.getList();
    },
    //清空查找 与 筛选
    reset() {
      this.option = ""; //清空查找
      this.tracksChoosed = ""; //清空班主任筛选条件
      this.getList();
    },
    //恢复已结课程
    restore(row){
      var params = {
        user_id:this.chooseUser.id,
        lesson_ids : [row.id]
      },
      url = restoreLessonUrl,
      that = this;
      this.$axios.post(url,params).then(function(res){
           var result = res.data;
        if (result.code == ERR_OK) {
          that.$message({
            showClose: true,
            message: "操作成功",
            type: "success"
          });
          that.lesson();
        } else {
          that.$message({
            showClose: true,
            message: "操作失败",
            type: "error"
          });
        }
      })
      console.log(row,'restore ------------')
    },

    //排序
    sortChange(res) {
      console.log(res);
    }
  }

  //-------------------------------end
};
</script>


