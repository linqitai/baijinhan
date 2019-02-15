<style lang="scss" scoped>
@import '../common/scss/common.scss';
.header {
  position: relative;
  width: 100%;
  height: $headerTop;
  line-height: $headerTop;
  color: #ffffff;
  // background-color:#11132A;
  background-color: #434B7E;
  .logoIcon {
    width: 80px;
    height: 50px;
  }
  .manage-box{
    font-size: 14px;
    cursor: pointer;
    .iconstyle{
      font-size: 14px;
      padding-right: 3px;
    }
  }
}
.el-dropdown-link {
  cursor: pointer;
  color: white;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
<template>
  <div class="header">
    <div class="left width100"><img class="logoIcon" src="https://xywl-1256946438.cos.ap-chengdu.myqcloud.com/bjh%2Fbjh.png"></div>
    <div class="left manage-box">
      白金汉后台管理系统
    </div>
    <div class="left manage-box">
      <div class="element margL20" v-if="role_id!=0">
        <label class="inline">地区：{{areaName}}</label>
    </div>
      <div class="element margL20" v-if="role_id==0">
        <label class="inline">地区：</label>
        <div class="inline">
          <el-select class="width140" size="small" v-model="sheng" @change="shengChange" placeholder="请选择">
            <el-option
              v-for="item in provincesList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="inline" v-if="sheng">
          <el-select class="width140" size="small" v-model="number" @change="areaChange" placeholder="请选择">
            <el-option
              v-for="item in areaList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="left manage-box">
      <div class="element margL20">
        <label class="inline">选择校区：</label>
        <div class="inline">
          <el-select class="width140" size="small" v-model="school_id" @change="schoolChange" placeholder="请选择">
            <el-option
              v-for="item in schoolsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <el-dropdown class="right manage-box margR20" @command="handleCommand">
      <span class="el-dropdown-link">
        {{username}} {{roleName}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="edit">修改密码</el-dropdown-item>
        <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- <div class="right manage-box margR20" @click="logout">
      <i class="iconfont iconstyle icon-logout"></i>退出登录
    </div>
    <div class="right manage-box margR20">
      {{username}} {{roleName}}
    </div> -->
    <el-dialog title="修改密码" :visible.sync="editPDialog" :append-to-body="true" :fullscreen="false" width="500px">
      <div class="dialogBody">
        <div class="element margT10">
          <label class="inline">旧密码：</label>
          <div class="inline">
             <el-input v-model="oldP" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="element margT10">
          <label class="inline">新密码：</label>
          <div class="inline">
             <el-input v-model="newP" size="medium" placeholder="请输入内容"></el-input>
          </div>
        </div>
      </div>  
      <div slot="footer" class="dialog-footer">
        <el-button @click="editPDialog = false">取 消</el-button>
        <el-button type="primary" @click="savePEvent">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { logoutUrl,schoolListUrl, ERR_OK } from '@/api/index'
import { getProvinces } from '@/common/js/city'
export default {
  data() {
    return {
      role_id: localStorage.getItem('role_id'),
      areaName: localStorage.getItem('areaName'),
      username: localStorage.getItem('en_name'),
      roleName: localStorage.getItem('roleName'),
      icon: 'icon-manage',
      schoolsOptions:[],
      provincesList:[],
      areaList:[],
      sheng:'',
      number:'',
      school_id:'',
      editPDialog: false,
      newP:'',
      oldP:'',
    }
  },
  created() {
    this.provincesList = getProvinces();
    for(var i=0;i<this.provincesList.length;i++) {
      this.provincesList[i].label =  this.provincesList[i].name;
      this.provincesList[i].value = this.provincesList[i].name;
    }
    this.getSchoolList();
  },
  methods: {
    savePEvent() {
      
    },
    handleCommand(command) {
      let that = this;
      // this.$message('click on item ' + command);
      switch (command) {
        case 'edit':
          that.editPDialog = true;
          break;
        case 'logout':
          that.logout()
          break;
        default:
          // statements_def
          break;
      }
    },
    logout() {
      var that = this;
      var params = {
        
      }
      var url = logoutUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        // console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          that.$router.replace({
            path: '/login'
          })
        }
      });
    },
    shengChange(value) {
      // var areaList = []
      for(var i=0;i<this.provincesList.length;i++) {
        if(value == this.provincesList[i].name) {
          this.areaList = this.provincesList[i].list;
          break;
        }
      }
      for(var i=0;i<this.areaList.length;i++) {
        this.areaList[i].label = this.areaList[i].city;
        this.areaList[i].value = this.areaList[i].number;
      }
    },
    areaChange(value) {
      console.log(value,"areaNumber")
      localStorage.setItem('areaNumber', value)
    },
    getSchoolList() {
      let that = this;
      var url = schoolListUrl;
      this.$axios.post(url).then((res)=>{
        var result = res.data;
        // console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          that.schoolsOptions = result.data.school;
          for(var i=0;i<that.schoolsOptions.length;i++){
            that.schoolsOptions[i].label = that.schoolsOptions[i].name
            that.schoolsOptions[i].value = that.schoolsOptions[i].id
          }
          console.log(that.schoolsOptions,"that.schoolsOptions")
          localStorage.setItem("_schoolsOptions",JSON.stringify(that.schoolsOptions))
          that.school_id = parseInt(localStorage.getItem("_school_id"))
          // this.$message({
          //   message: '保存成功',
          //   type: 'success'
          // });
          // this.isShowTableDialog = false;
        }
      });
    },
    schoolChange(value) {
      this.school_id = value
      console.log(value,"_school_id")
      localStorage.setItem("_school_id",value);
      // alert("reload")
      location.reload()
    },
    manage(){
      // localStorage.setItem('_lSidebar','manage');
      // this.$emit('childToParentEvent', 'manage')
      this.$router.push('/apply');
    },
    setting() {
      // localStorage.setItem('_lSidebar','setting');
      // this.$emit('childToParentEvent', 'setting')
      this.$router.push('/setting');
    },
    toFirstPage() {
      // this.$router.push('./firstPage')
    },
    getUserInfo() {
      
    }
  }
}
</script>