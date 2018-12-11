<style lang="scss" scoped>
.firstPage{
  .contentwrapper{
    width: 1200px;
    border: 1px solid #b6b6b6;
    border-radius: 10px;
    margin-left: 50%;
    transform: translateX(-50%);
    margin-top: 50px;
    padding: 16px 24px;
    .content{
      padding:50px 30px;
      height: 410px;
      .el-row {
        margin-bottom: 10px;
      }
      .el-card{
        background-color: #CCCCCC;
        color: white !important;
        &:hover{
          background-color:#34495E;
        }
        h3{
          height: 40px;
          line-height: 40px;
          font-size: 17px;
        }
        p{
          font-size: 13px;
          line-height: 24px;
        }
        .buttonBox{
          padding-top: 10px;
          overflow: hidden;
          button{
            color: white;
            background-color: inherit;
            border:none;
            border:1px solid white;
            border-radius:2px;
            width: 70px;
            padding: 4px 0;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>
<template>
  <div class="firstPage">
    <div class="contentwrapper">
      <div class="breadcrumbWrapper">
        <div class="breadcrumb">
          <i class="iconfont icon-home iconhomestyle nocurrent"></i>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">
              <span class="nocurrent">我的店铺</span>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="content">
        <el-row :gutter="10">
          <el-col :span="8" v-for="(item,index) in list">
            <el-card shadow="always">
              <div class="cardBox">
                <h3 class="title">{{item.name}}</h3>
                <p>主营分类：</p>
                <p>店铺地址：</p>
                <p>到期时间：{{item.over_at}}</p>
                <div class="buttonBox">
                  <button class="right">进入商城</button>
                  <button class="right" @click="toSetting(item.id)">设置</button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import vHead from 'components/HeaderFirst.vue'
import { ERR_OK } from '@/api/index'
export default {
  data() {
    return {
      list: []
    }
  },
  created() {
   // this.getStores()
  },
  methods: {
    getStores() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      var url = storesUrl;
      this.$axios.post(url,null).then((res)=>{
        var result = res.data;
        console.log(result,'--res--')
        this.list = result;
        loading.close();
      }).catch((res) => {
        this.$message({
          type: 'info',
          message: '系统出错了'
        });          
      });
    },
    toSetting(id) {
      // localStorage.setItem('_lSidebar','setting');
      // localStorage.setItem('_storeId', id);
      // this.$router.push('/setting')
    }
  },
  components: {
    vHead
  }
}
</script>


