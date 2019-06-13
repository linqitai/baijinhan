<style lang="scss" scoped>
.apply {
  .operateTableBox {
    .functionBox {
    }
  }
  .clear {
    clear: both;
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
            <span class="nocurrent">统计</span>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <span>学生课程进度</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="operateTableBox">
      <div class="functionBox"></div>
      <div style="width:300px;height:300px;margin-bottom:20px;float:left">
        <canvas id="myChart" width="100" height="100"></canvas>
      </div>
       <div style="width:300px;height:300px;margin-bottom:20px ;float:left">
        <canvas id="myChart1" width="100" height="100"></canvas>
      </div>
       <div style="width:300px;height:300px;margin-bottom:20px;float:left">
        <canvas id="myChart2" width="100" height="100"></canvas>
      </div>
       <div style="width:300px;height:300px;margin-bottom:20px;float:left">
        <canvas id="myChart3" width="100" height="100;"></canvas>
      </div>
       <div style="width:300px;height:300px;margin-bottom:20px;float:left">
        <canvas id="myChart4" width="100" height="100"></canvas>
      </div>
       <div style="width:300px;height:300px;margin-bottom:20px;float:left">
        <canvas id="myChart5" width="100" height="100"></canvas>
      </div>
       <div style="width:300px;height:300px;margin-bottom:20px;float:left">
        <canvas id="myChart6" width="100" height="100"></canvas>
      </div>
       <div style="width:300px;height:300px;margin-bottom:20px;float:left">
        <canvas id="myChart7" width="100" height="100"></canvas>
      </div>
       <div style="width:300px;height:300px;margin-bottom:20px;float:left">
        <canvas id="myChart8" width="100" height="100"></canvas>
      </div>
      <div class="clear"></div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="uid" label="编号" width="80"></el-table-column>
        <el-table-column prop="en_name" label="学生中文名" width="80"></el-table-column>
        <el-table-column prop="serial" label="合同号" width="120"></el-table-column>
        <el-table-column prop="level_name" label="学生等级" width="100"></el-table-column>
        <el-table-column prop="PrivateClass" label="Private Class" width="200">
            <template scope="scope">
               
                <el-tag>{{scope.row['Private Class'] | filterArrangingCount}}</el-tag>
                <el-tag>{{scope.row['Private Class'] | filterSign}}</el-tag>
                <el-tag>{{scope.row['Private Class'] | filterNoSign}}</el-tag>
                <el-tag>{{scope.row['Private Class'] | filterOver}}</el-tag>
                <el-tag>{{scope.row['Private Class'] | filterPass}}</el-tag>
                <el-tag>{{scope.row['Private Class'] | filterReset}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column  label="Salon" width="200">
              <template slot-scope="scope">
                 <el-tag>{{scope.row['Salon'] | filterArrangingCount}}</el-tag>
                <el-tag>{{scope.row['Salon'] | filterSign}}</el-tag>
                <el-tag>{{scope.row['Salon'] | filterNoSign}}</el-tag>
                <el-tag>{{scope.row['Salon'] | filterOver}}</el-tag>
               <el-tag>{{scope.row['Salon'] | filterPass}}</el-tag>
                <el-tag>{{scope.row['Salon'] | filterReset}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="TopNotch" label="Top Notch" width="200">
              <template slot-scope="scope">
                   <el-tag>{{scope.row['Top Notch'] | filterArrangingCount}}</el-tag>
                
                <el-tag>{{scope.row['Top Notch'] | filterSign}}</el-tag>
                <el-tag>{{scope.row['Top Notch'] | filterNoSign}}</el-tag>
                <el-tag>{{scope.row['Top Notch'] | filterOver}}</el-tag>
             <el-tag>{{scope.row['Top Notch'] | filterPass}}</el-tag>
                <el-tag>{{scope.row['Top Notch'] | filterReset}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="IceBreak" label="Ice Break" width="200">
              <template scope="scope">
                 <el-tag>{{scope.row['Ice Break'] | filterArrangingCount}}</el-tag>
          
                <el-tag>{{scope.row['Ice Break'] | filterSign}}</el-tag>
                <el-tag>{{scope.row['Ice Break'] | filterNoSign}}</el-tag>
                <el-tag>{{scope.row['Ice Break'] | filterOver}}</el-tag>
                     <el-tag>{{scope.row['Ice Break'] | filterPass}}</el-tag>
                <el-tag>{{scope.row['Ice Break'] | filterReset}}</el-tag>
            </template>
        </el-table-column>
        <!-- <el-table-column prop="arranging_count" label="新系统上课" width="120">
              <template scope="scope">
                <el-tag v-for="(item,key) in scope.row.PrivateClass" :key="key">{{item}}</el-tag>
            </template>
        </el-table-column>
         <el-table-column prop="over" label="" width="120">
              <template scope="scope">
                <el-tag v-for="(item,key) in scope.row.PrivateClass" :key="key">{{item}}</el-tag>
            </template>
        </el-table-column> -->
        
      </el-table>
      <div class="tableBottom" v-show="showPageTag">
        <el-pagination
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageIndex"
          :page-size="pageSize"
          :page-sizes="[4,6,8,10]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js";
import { userArrangingCountUrl, ERR_OK } from "@/api/index";
import { getFullDate, getFullTime, urlEncode } from "@/common/js/utils";
export default {
  data() {
    return {
      month: "",
      tableData: [],
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      showPageTag: true,
      name: "",
      all:[],
      group:[]
    };
  },
  created() {
    
   
   
   
  },
   filters:{
    filterPass(obj){
       if(obj ==void 0||obj.pass == void 0){
           return '';
       }else{
           console.log(obj,'---');
           return '通过:'+obj.pass;
       }
      
    },
     filterNoSign(obj){
       if(obj ==void 0||obj.nosign == void 0){
           return '';
       }else{
           console.log(obj,'---');
           return '缺课:'+obj.nosign;
       }
      
    },
     filterOver(obj){
       if(obj ==void 0||obj.over == void 0){
           return '';
       }else{
           console.log(obj,'---');
           return '结课'+obj.over;
       }
      
    },
     filterArrangingCount(obj){
       if(obj ==void 0||obj.arranging_count == void 0){
           return '';
       }else{
           console.log(obj,'---');
           return '订课:'+obj.arranging_count;
       }
      
    },
     filterSign(obj){
       if(obj ==void 0||obj.sign == void 0){
           return '';
       }else{
           console.log(obj,'---');
           return '签到:'+obj.sign;
       }
      
    },
     filterReset(obj){
       if(obj ==void 0||obj.reset == void 0){
           return '';
       }else{
           console.log(obj,'---');
           return '重修:'+obj.reset;
       }
      
    }
    // filter(t){
    //   return getFullDate(t)
    // }
  },
  mounted: function() {
      this.getList();
       

 
  },
  methods: {
    search: function() {},
    getList: function() {
      let that = this;
      var params = {
        offset: (that.pageIndex - 1) * that.pageSize,
        limit: that.pageSize,
        serial: ""
      };
      var url = userArrangingCountUrl;
      this.$axios
        .post(url, params)
        .then(res => {
          var result = res.data;
          if (result.code == ERR_OK) {
            var list  = result.data.list;
            var obj = {}
            for(var i=0;i<list.length;i++){
                var item = list[i]; 
                if(obj[item.uid] == void 0){
                    obj[item.uid] = {}
                    obj[item.uid].level_name = item.level_name;
                    obj[item.uid].serial = item.serial;
                    obj[item.uid].en_name = item.en_name;
                    obj[item.uid].uid = item.uid;
                }
                    // console.log(item,'iiiii');
            
                obj[item.uid][item.name]={
                    pass:item.pass,
                    reset:item.reset,
                    sign:item.sign,
                    nosign:item.nosign,
                    arranging_count:item.arranging_count,
                    over:item.over
                    };
                //  console.log(obj[item.uid][item.name].pass,'!!@#!@#!@#!@#');
                // obj[item.uid][item.level_name]=item.passall;
                // obj[item.uid][item.level_name].reset=item.resetall;
                // obj[item.uid][item.level_name].sign=item.signall;
                // obj[item.uid][item.level_name].nosign=item.nosignall;
                // obj[item.uid][item.level_name].arranging_count=item.arranging_countall;
                // obj[item.uid][item.level_name].over=item.overall;   
           }
            var arr = []
            for (let j in obj) {
                arr.push(obj[j]); //属性
            }
            that.tableData = arr;
            that.total = result.data.count;
            that.all = result.data.all;
            that.group = result.data.group;
            if (that.count > that.pageSize) {
              that.showPageTag = false;
            };
            this.chart();
          }
        })
        .catch(res => {
          that.$message({
            showClose: true,
            message: "系统故障1",
            type: "warning"
          });
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getList();
    },

    chart:function(){
    
    var ctx = document.getElementById("myChart");
    var that =this;
      var myChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: [
          "上课10节以内",
          "上课10-20节",
          "上课20-30节",
          "上课30-40节",
          "上课40节以上"
        ],
        datasets: [
          {
            label: "test1",
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)"
            ],
            borderWidth: 1,
            pointStrokeColor: "#fff",
            pointStyle: "crossRot",
            data: [that.all[0].Less10,that.all[0]['10-20'],that.all[0]['20-30'],that.all[0]['30-40'],that.all[0].More40],
            cubicInterpolationMode: "monotone",
            spanGaps: "true",
            fill: "true"
          }
        ]
      },
      options: {}
    });

    for(var i=0;i<that.group.length;i++){
        var id = "myChart"+(i+1);
       
        var ctx = document.getElementById(id);
        var item = that.group[i];
        var arr = []; 
        for(var key in item){
            arr.push(key+"");
        }
         
      myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels:arr,
        datasets: [
          {
            label: that.group[i].level_name,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)"
            ],
            borderWidth: 1,
            pointStrokeColor: "#fff",
            pointStyle: "crossRot",
            data: [that.group[i].Less10,that.group[i]['10-20'],that.group[i]['20-30'],that.group[i]['30-40'],that.group[i].More40],
            cubicInterpolationMode: "monotone",
            spanGaps: "false",
            fill: "false"
          }
        ]
      },
      options: {}
    });
}
    }
  }
};
</script>
