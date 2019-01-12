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
    <div class="right manage-box margR20" @click="logout">
      <i class="iconfont iconstyle icon-logout"></i>退出登录
    </div>
    <div class="right manage-box margR20" @click="logout">
      {{username}} {{roleName}}
    </div>
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
      school_id:''
    }
  },
  created() {
    this.provincesList = getProvinces();
    // console.log(this.provincesList);
    for(var i=0;i<this.provincesList.length;i++) {
      this.provincesList[i].label =  this.provincesList[i].name;
      this.provincesList[i].value = this.provincesList[i].name;
    }
    this.getSchoolList();
  },
  methods: {
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
      // console.log(JSON.stringify(this.coordinates),"--=-=-=-=-=-=-=")
      var params = {
        area_id: localStorage.getItem("area_id")
      }
      var url = schoolListUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
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