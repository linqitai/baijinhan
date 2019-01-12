<template>
  <div class="inline">
    <label class="inline">排课周期：</label>
    <div class="inline">
       <el-select class="width140" v-model="time1" @change="time1Change" placeholder="请选择" size="medium">
        <el-option
          v-for="item in time1Options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="inline">
       <el-select class="width200" v-model="time2" @change="time2Change" placeholder="请选择" size="medium">
        <el-option
          v-for="item in time2Options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
import { getFullDate,getTime,getDay,getDaysInYearMonth,getMonth,getTodayDate } from '@/common/js/utils'
// 一天有多少毫秒
var oneDayTime = 24*60*60*1000
var oneDaySecond = 24*60*60
export default {
  data() {
    return {
      time1:"",
      time2:"",
      time1Options:[],
      time2Options:[],
      firstDay:''
    }
  },
  created() {
    // this.getFirst()
    this.getTime1Option();
  },
  methods: {
    getTime1Option() {
      var that = this;
      var datatime = new Date();
      var year = datatime.getFullYear();
      var month = datatime.getMonth();
      var monthNow = datatime.getMonth()+1;
      var arr = [];
      for(var i=month;i<12;i++){
        if(monthNow == (i+1)){
          that.time1 = `${year}/${i+1}`
          that.time1Change(that.time1)
        }
        var item = {label:`${year}/${i+1}`,value: `${year}/${i+1}`}
        arr.push(item)
      }
      var year2 = parseInt(year) + 1
      for(var i=0;i<12;i++){
        var item = {label:`${year2}/${i+1}`,value: `${year2}/${i+1}`}
        arr.push(item)
      }
      // // console.log(arr,"arr")
      this.time1Options = arr
    },
    time1Change(value) {// value: 2018/11
      var that = this;
      var isGetList = false;
      //获取目前的时间戳
      var timeNow = new Date().getTime()
      var month = value.split('/')[1]
      var firstDay = value.toString() + "/1"
      var arr = []
      var range = null
      var time = getTime(firstDay)//获取时间戳
      var firstD = getDay(time)
      if(firstD!=1){
          range = getFullDate(time-oneDayTime*(firstD-1)) + "~" + getFullDate(time+(7-firstD)*oneDayTime)
          console.log(range,"rangerangerangerangerangerange===============================range")
          var item = {label:range,value:range}
          arr.push(item)//这是加上这个月的最后一周
        }
      var days = getDaysInYearMonth(value.split('/')[0],month)//这个月有多少天
      // console.log(days,"天数")
      for(var i=0;i<days;i++){
        var d = getDay(time)
        //判断d是否是星期一
        if(d==1){
          var lastRange = getFullDate(time) // 周一的年月日
          var m = getMonth(lastRange)
          if(month == m) {
            range = getFullDate(time)+"~"+getFullDate(time+oneDayTime*6)
            // var range = getFullDate(time)+"~"+getFullDate(time+oneDayTime*6)
            var item = {label:range,value:range}
            arr.push(item)
            // getTodayDate(timeNow) - getTodayDate(time)<=6 && getTodayDate(timeNow) - getTodayDate(time)>=0
            var endDate = range.split('~')[1]
            var endDateTime = getTime(endDate)
            console.log(endDate,getTodayDate(endDateTime))
            console.log("================================================")
            
            if(getTodayDate(timeNow)<=getTodayDate(endDateTime)) {
              console.log(getTodayDate(timeNow),"getTodayDate(timeNow)")
              console.log(getTodayDate(endDateTime+oneDayTime*6),"getTodayDate(endDateTime+oneDayTime*6)")
              if(isGetList == false) {
                that.time2 = range
                that.time2Change(that.time2)
                isGetList = true
              }
            }
          }
        }
        time = time + oneDayTime
      }
      that.time2Options = arr
    },
    time2Change(value) {
      this.firstDay = value.split('~')[0]
      var time1 = getTime(value.split('~')[0]).toString()
      var len1 = time1.length
      var time2 = getTime(value.split('~')[1]).toString()
      var len2 = time2.length
      var timebegin = time1.substring(0,len1-3);
      var timeend = parseInt(time2.substring(0,len2-3))+oneDaySecond;

      var w = []
      w.push(timebegin)
      w.push(timeend)
      this.weekth = w.join(',')
      // console.log(this.weekth,"weekth")
      //还是通过设置缓存的方式来获取数据吧
      this.$cookie.set("_weekth",this.weekth)
      this.$cookie.set("_firstDay",this.firstDay)
      // this.getList()
      this.$emit('getTimeData')
    },
  }
}
</script>