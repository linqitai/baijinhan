<style lang="scss" scoped>
@import '../../common/scss/common.scss';
$height:66px;
$height2:72px;
$tableLeft:100px;
.apply{
  .operateTableBox{
    .functionBox{
      .el-radio+.el-radio{
        margin-left: 16px;
      }
      .el-radio-group{
        vertical-align: unset;
      }
      .el-radio__label{
        margin-left: 4px !important;
      }
    }
    .tableBox{
      clear: both;
      // display: flex;
      text-align: center;
      position: relative;
      box-sizing: border-box;
      color: #646464;
      .tableLeft{
        // flex: 0 0 60px;
        width: $tableLeft;
        border-left:1px solid $tableBorderColor;
        border-top:1px solid $tableBorderColor;
        border-bottom:1px solid $tableBorderColor;
        position: absolute;
        left: 0;
        top: 0;
        background-color: $mainColor;
        color: white;
        box-sizing: border-box;
        label{
          height: 40px;
          line-height: 40px;
          display: block;
        }
        li{
          height: $height2;
          line-height: $height2;
          border-top:1px solid $tableBorderColor;
          display: block;
          // box-sizing: border-box;
        }
      }
      .tableWrapper{
        overflow: scroll;
        box-sizing:content-box;
        table.thatTable{
          width: 100%;
          // border: 1px solid $tableBorderColor;
          border-right:none;
          margin-left: $tableLeft;
          background-color: white;
          box-sizing:content-box;
          .header{
            background-color: $mainColor;
            color: white;
            box-sizing:content-box;
          }
          tr{
            white-space:nowrap;
            // border-bottom: 1px solid $tableBorderColor;
            box-sizing:content-box;
          }
          tr>th{
            width: 120px;
            height: 40px;
            line-height: 40px;
            border-right:1px solid $tableBorderColor;
            padding: 0 6px; 
            box-sizing:content-box;
          }
          tr{
            box-sizing:content-box;
            td{
              height: $height2;
              border-right:1px solid $tableBorderColor;
              overflow: hidden;
              box-sizing:content-box;
              .item{
                width: 120px;
                padding: 0 6px; 
                height: 100%;
                color: $headerColor;
                white-space:normal;
                word-break:break-all;
                word-wrap:break-word;
                display: flex;
                // flex-direction: column;
                // align-content: space-between;
                flex-wrap:wrap;
                .line1,.line2,.line3{
                  flex: auto;
                }
                .line1{
                  margin-top: 8px;
                  min-width: 50px;
                }
                .line3{
                  margin-bottom: 3px;
                }
              }
            }
          }
          
        }
      }
    }
  }
  .el-card__body{
    padding: 0px;
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
          <el-breadcrumb-item><span>教师排班明细表</span></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="operateTableBox">
      <div class="functionBox">
        <div class="element">
          
          <label class="inline">课程日期：</label>
          <div class="inline">
             <!-- <el-input v-model="name" placeholder="请输入所要查询的姓名"></el-input> -->
              <el-date-picker
                v-model="date"
                type="date"
                size="medium"
                @change="dateChange"
                placeholder="选择日期"
                style="width: 160px;">
              </el-date-picker>
          </div>
          <label class="inline margL20">教师编号：</label>
          <div class="inline">
             <el-input style="width: 160px;"  v-model="serial" placeholder="教师编号" size="medium" @keyup.enter.native="search" clearable></el-input>
          </div>
          <el-radio-group class="margL20" v-model="type" @change="changeType">
            <el-radio :label="0">全部</el-radio>
            <el-radio :label="2">外教</el-radio>
            <el-radio :label="1">中教</el-radio>
          </el-radio-group> 
          <div class="inline margL20">
            <el-button type="primary" size="medium" @click="importTable">导出</el-button>
          </div>
        </div>
      </div>
      <div class="tableBox">
        <ul class="tableLeft">
          <label>教师姓名</label>
          <li v-for="(item,index) in teachers">{{item.teacher}}</li>
        </ul>
        <div class="tableWrapper">
          <table class="thatTable">
            <tr class="header">
              <!-- <th v-for="(item,index) in rooms">{{item.name}}</th> -->
              <th>09:00</th>
              <th>10:00</th>
              <th>11:00</th>
              <th>12:00</th>
              <th>13:00</th>
              <th>14:00</th>
              <th>15:00</th>
              <th>16:00</th>
              <th>17:00</th>
              <th>18:00</th>
              <th>18:30</th>
              <th>19:00</th>
              <th>20:00</th>
            </tr>
            <tr v-for="(items,index) in teachers">
              <td v-for="(item,index) in items.blocks" class="width120">
                <div v-show="item.course" class="item">
                  <div class="line1 ellipsis">{{item.course}}</div>
                  <div class="line2 ellipsis" :style="{'color':item.school=='财富校区'?'#f37b1d':'black'}">（{{item.school}}){{item.room}}</div>
                  <!-- <div class="line2 ellipsis">{{item.room}}</div> -->
                  <div class="line3 ellipsis">订课人数：{{item.users_count}}/{{item.capacity}}</div>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { teachersArrangingsListUrl,importTableUrl,ERR_OK } from '@/api/index'
import { getFullDate,getTime } from '@/common/js/utils'
import qs from 'qs'
import axios from 'axios'

var list = []
export default {
  data() {
    return {
      teachers:[],
      hours:[
        9,10,11,12,13,14,15,16,17,18,18.5,19,20
      ],
      name:"",
      time1Options:[],
      date:"",
      time:"",
      type:0,
      serial:"",
      schoole_id: localStorage.getItem("_school_id"),
      importTableUrl:""
    }
  },
  created() {
    var that = this;
    this.date = getFullDate(new Date().getTime())
    this.time = Math.floor(new Date(this.date).getTime()/1000)
    console.log("getSchoole_id：",localStorage.getItem("_school_id")) 
    this.schoole_id = localStorage.getItem("_school_id")
    var url = importTableUrl + `?time=${that.time}&school_id=${localStorage.getItem("_school_id")}`;
    that.importTableUrl = url;
    // this.getTime1Option()
    this.getList()
  },

  methods: {
    importTable() {
      let that = this;
      var params = {
        time:that.time,
        school_id:localStorage.getItem("_school_id")
      }
      // http://bjh.chinaxywl.com/api/admin/excel/dayarrangings-export?time=1545235200&school_id=1
      var url = importTableUrl + `?time=${that.time}&school_id=${localStorage.getItem("_school_id")}`;
      // that.importTableUrl = url;
      // var url = importTableUrl;
      // console.log(params,"params")
      axios.request({
        url: url,
        method:'post',
        responseType:'blob'
      }).then(function(res){
        //这里res.data是返回的blob对象     
    　　var blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
    　　var downloadElement = document.createElement('a');
    　　var href = window.URL.createObjectURL(blob); //创建下载的链接
    　　downloadElement.href = href;
    　　downloadElement.download = `${that.date}教师排班明细表.xlsx`; //下载后文件名
    　　document.body.appendChild(downloadElement);
    　　downloadElement.click(); //点击下载
    　　document.body.removeChild(downloadElement); //下载完成移除元素
    　　window.URL.revokeObjectURL(href); //释放掉blob对象 
      });
    },
    changeType() {
      if(!this.date){
        this.$alert('请先选择课程日期', '提示');
        return;
      }
      console.log(this.type)
      this.getList()
    },
    dateChange() {
      this.time = Math.floor(new Date(this.date).getTime()/1000)
      console.log(this.time,"time")
      this.getList()
    },
    search() {
      this.time = Math.floor(new Date(this.date).getTime()/1000)
      console.log(this.time,"time")
      this.getList()
    },
    getList(){
      let that = this;
      var params = {
        schoole_id: this.schoole_id,
        time:this.time,
        serial:this.serial,
        type:this.type
      }
      var url = teachersArrangingsListUrl;
      console.log(params,"params")
      this.$axios.post(url,params).then((res)=>{
        var result = res.data;
        console.log(result.code,'--res.code--')
        if(result.code == ERR_OK){
          var resultObj = result.data.teacher;
          // var resultArray = result.data.teacher;
          //除了help_arranging  与 填充 空白
          // console.log(resultArray.length,'llllll');
          // for(var k=0; k<resultArray.length; k++){
          //   var arr1 = resultArray[k].arrangings;
          //   var arr2 = resultArray[k].help_arrangings;
          //   var arr = arr1.concat(arr2);
          //   resultArray[k].arrangings = arr;
          //   for(var i =0 ;i<resultArray[k].arrangings.length;i++){
          //     for(var j=0;j<that.hours.length;j++){
          //        if(resultArray[k].arrangings[i].hour != that.hours[j]){
          //         //  console.log(123123);
          //          resultArray[k].arrangings.push({})
          //       }
          //     }
          //   }
          // }   
          console.log(resultObj,"resultObj")
          var keys = Object.keys(resultObj)
          console.log(keys,"keys");
          var arr = [];
          for(var i=0;i<keys.length;i++){
            var object = {}
            object.teacher=resultObj[i].en_name 
            var obj = resultObj[keys[i]];
            var blocks = []
            for(var j=0;j<obj.arrangings.length;j++){
              var item = obj.arrangings[j]
              blocks.push(item)
            }
            for(var k=0;k<obj.help_arrangings.length;k++){
              var item = obj.help_arrangings[k]
              blocks.push(item)
            }
            object.blocks = blocks
            arr.push(object)
          }
          // lists = list
          console.log(arr,"arr")
          that.initList(arr)
          console.log(arr.length,"arr.length")
          for(var i=0;i<list.length;i++){
            for(var j=0;j<arr.length;j++){
              if(list[i].teacher==arr[j].teacher){
                for(var k=0;k<arr[i].blocks.length;k++){
                  for(var t=0;t<list[i].blocks.length;t++){
                    // console.log(k);
                    // console.log(arr[i].blocks,'11111');
                    // console.log(i);
                    // console.log(list,'22222');
                    //这里blocks 里面会存在 viod 0  具体原因未知
                    if(void 0 != arr[i].blocks[k] && arr[i].blocks[k].hour == list[i].blocks[t].hour){
                      list[i].blocks[t] = {
                        hour:arr[i].blocks[k].hour,
                        lesson:arr[i].blocks[k].lesson.serial,
                        course:arr[i].blocks[k].lesson.name,
                        school:arr[i].blocks[k].school.name,
                        room:arr[i].blocks[k].room.name,
                        capacity:arr[i].blocks[k].capacity,
                        users_count:arr[i].blocks[k].users_count
                      }
                    }
                  }
                }
              }
            }
          }
          that.teachers = list;
          // that.teachers =resultArray
        }
      });
    },
    initList(arr){
      var that = this;
      list = []
      for ( var i = 0; i < arr.length; i++) { //一维长度为8
        var item = {
          teacher: arr[i].teacher
        }
        var blocks = []
        for ( var j = 0; j < this.hours.length; j++) {
          var block = {
            hour: this.hours[j]+'',
            lesson:'',
            course:'',
            school:'',
            room:'',
            users_count:''
          }
          blocks.push(block)
        }
        item.blocks=blocks
        list.push(item)
      }
      console.log(list,"list")
      that.teachers = list
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      // this.getList();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      console.log(val);
      // this.getList();
    }
  }
}
</script>


