<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>
<style lang="scss">
@import './common/scss/common';
#app{
  min-width: 1250px;
}
.el-breadcrumb {
  font-size: 13px !important;
}
.apply{
  padding:12px 20px;
  background-color: white;
  .operateTableBox{
    margin-top: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
    padding-right: 10px;
    border: 1px solid #F3F2F2;
    background-color: #F2F2F2;
    .functionBox{
      padding: 12px 6px 6px 6px;
    }
  }
}
.lineBox{ 
  display: flex;
  align-items: center;
  margin-top:10px;
  .icon{
    flex: 0 0 10px;
    color: red; 
    font-size: 18px;
    height: 18px;
    line-height: 24px;
  }
  .text{
    flex: 0 0 70px;
    color: #646464;
  }
  .inputTitle_middle{
    flex: 0 0 260px;
  }
  .inputTitle{
    flex: 0 0 300px;
  }
  .inputTitle2{
    flex: 0 0 auto;
    margin-left: 3px;
  }
  .upload-demo{
    margin-left: 0px;
  }
  .danwei{
    flex: 0 0 160px;
    margin-left: 12px;
  }
}
.el-pager {
  li {
    &.active {
      border-color: $mainColor !important;
      background-color: $mainColor !important;
      color: #fff !important;
    }
  }
}

</style>
