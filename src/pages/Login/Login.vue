<style lang="scss" scoped>
.loginWrap {
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  background-color: #2196F3;
  .login_form{
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background-color: #2B2B36;
    border-radius: 10px;
    box-shadow: 10px 10px 15px 1px #0D5187;
    .logo{
      margin-left: 50%;
      transform: translateX(-50%);
      margin-top: 20px;
    }
    .title{
      color: white;
      padding:16px 0;
      text-align: center;
      font-size: 24px;
    }
    .inputWrapper{
      padding:0 20px;
      .inputBox{
        margin-top: 8px;
        border: none;
        border-bottom:1px solid #8F8F8F;
        padding-bottom: 12px;
        .iconStyle{
          color: #8F8F8F;
          font-size: 28px;
          vertical-align: middle;
        }
        .input{
          background-color: inherit;
          border: none;
          height: 34px;
          line-height:34px;
          outline:none;
          font-size: 16px;
          color: #c7c7c7;
          padding-left: 8px;
          width: 300px;
          vertical-align: middle;
        }
      }
    }
    .headButton{
      width: 100%;
      text-align: center;
      height: 60px;
      line-height: 60px;
      background-color: #23232E;
      color: white;
      font-size: 26px;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
    .fotButton{
      width: 100%;
      margin-top:20px;
      text-align: center;
      height: 60px;
      line-height: 60px;
      background-color: #2196F3;
      color: white;
      font-size: 20px;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      cursor: pointer;
      &:hover{
        background-color:#0071CA;
      }
    }
    .statusBox{
      padding: 0 20px;
      padding-top: 20px;
      .el-checkbox{
        margin-left: 5px;
      }
      p{
        float: right;
        color: #2196F3;
        font-size: 14px;
        cursor: pointer;
        line-height: 20px;
      }
    }
  }
}
</style>
<template>
  <div class="loginWrap container" id="particles-js">
    <div class="login_form">
      <div class="headButton">白金汉</div>
      <img class="logo" src="https://xywl-1256946438.cos.ap-chengdu.myqcloud.com/bjh%2Fbjh.png" width="80" height="50">
      <div class="title">欢迎登录</div>
      <div class="inputWrapper">
        <div class="inputBox">
          <i class="iconfont icon-username iconStyle"></i><input class="input" type="text" name="username" v-model="username" @keyup.enter="tonext(1)" placeholder="用户名/手机号">
        </div>
        <div class="inputBox">
          <i class="iconfont icon-password iconStyle"></i><input class="input" type="password" name="password" v-model="password" @keyup.enter="loginBtn" placeholder="请输入登录密码">
        </div>
      </div>
      <div class="statusBox">
        <el-checkbox v-model="statusChecked">记住登录状态</el-checkbox>
        <p>忘记密码</p>
      </div>
      <div class="fotButton" @click="loginBtn">登录</div>
    </div>
  </div>
</template>
<!-- scripts -->
<!-- <script src="js/particles.min.js"></script>
  <script src="js/app.js"></script> -->
<script>

$(function(){
  $('.fotButton').click(function(){
    console.log("click me")
  });
});

// import { loginUrl } from '@/api/index'
import { testlogin,loginUrl,ERR_OK } from '@/api/index'
// import axios from 'axios'
// import pJS from 'pJS'
export default {
  data: function() {
    return {
      username: '', // 
      password: '', // 
      ishover: false,
      autofocus: true,
      loginStatus: "",
      statusChecked: true,
      authorization:''
    }
  },
  created() {
    var inputs = document.getElementsByTagName('input')
  },
  methods: {
    
    hover() {
      this.ishover = !this.ishover
    },
    tonext(index) {
      console.log("click")
      var inputs = document.getElementsByTagName('input')
      inputs[index].focus()
    },
    loginBtn() {
      var that = this;
      if(!this.username||!this.password) {
        this.$message('账号或密码不能为空');
        return;
      }
      var params = {
        username: this.username,
        password: this.password,
        remember: this.statusChecked?'1':'0'
      }
      var url = loginUrl;
      console.log(params)
      this.$axios.request({ 
        url : url, 
        method : 'POST', 
        data : params, 
      }).then(res=>{
        var result = res.data;
        if(result.status_code == 200){
            localStorage.setItem('login_id',result.data.id);
            localStorage.setItem('area_id',result.data.area_id);
            localStorage.setItem('role_id',result.data.role_id);
            localStorage.setItem('school_name',result.data.school.name);
            localStorage.setItem("_school_id",result.data.school_id);
            localStorage.setItem("areaName",result.data.area.name);
            localStorage.setItem("en_name",result.data.en_name);
            localStorage.setItem("roleName",result.data.role.name);
            that.$cookie.set('currentTitleId',0);
            that.$router.push('./orderClassList');
        }
        this.authorization = res.headers.authorization;
        localStorage.setItem('authorization', this.authorization);
      }).catch(err=>{ 
          console.log(err);
          that.$message({
            type: 'info',
            message: '出错了'
          });
      });
    }
  }
}
</script>

