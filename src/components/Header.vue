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
  </div>
</template>
<script>
import { logoutUrl,schoolListUrl, ERR_OK } from '@/api/index'
export default {
  data() {
    return {
      role: '',
      username: 'admin',
      icon: 'icon-manage',
      schoolsOptions:[],
      school_id:''
    }
  },
  created() {
    this.getSchoolList()
  },
  methods: {
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
        // console.log(result.status_code,'--res.status_code--')
        if(result.status_code == ERR_OK){
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
    logout() {
      /*window.localStorage.removeItem("authorization");
      console.log(localStorage.getItem('authorization'),'--authorization---')
      var url = logoutUrl;
      this.$axios.post(url,null).then((res)=>{
        var result = res.data;
        console.log(result.status_code,'--result.status_code--');
        if(result.status_code == ERR_OK){
          this.$router.push('/login');
        }
      });*/
    },
    toFirstPage() {
      // this.$router.push('./firstPage')
    },
    getUserInfo() {
      
    }
  }
}
</script>