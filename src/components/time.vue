//周选择器
//周时间设置 1-7 整体向后推移1天。
<template>
  <div class="inline">
    <!-- <label class="inline">排课周期：</label> -->
    <div class="inline">
      <div class="block">
        <span class="demonstration">年</span>
        <el-date-picker
          width="100px"
          v-model="month"
          type="month"
          @change="fn2"
          placeholder="选择年"
          size="medium"
        ></el-date-picker>
      </div>
    </div>
    <div class="inline">
      <el-select
        class="width280"
        style="text-align:center"
        v-model="time2label"
        @change="time2Change"
        placeholder="请选择"
        size="medium"
      >
        <el-option
          v-for="item in time2Options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <div class="block">
        <!-- <span class="demonstration">周</span> -->
        <!-- <el-date-picker
      v-model="value3"
      type="week"
      format="yyyy 第 WW 周"
      placeholder="选择周"
      picker-options.firstDayOfWeek=1
      周选择器无法达到显示效果
      >
        </el-date-picker>-->
      </div>
    </div>
  </div>
</template>
<script>
import {
  getFullDate,
  getTime,
  getDay,
  getDaysInYearMonth,
  getMonth,
  getTodayDate
} from "@/common/js/utils";
// 一天有多少毫秒
const oneDayTime = 24 * 60 * 60 * 1000;
export default {
  data() {
    return {
      month: new Date(),
      time2: {
        value: "",
        label: ""
      },
      time2label: "",
      time2Options: [],
      firstDay: "",
      value3: ""
    };
  },

  model: {
    prop: "time",
    event: "change"
  },

  props: {
    onlyFuture: {
      //只显示未来的时间
      default: false
    },
    defaultTime: {
      //默认时间
      default: false
    }
  },

  created() {
    // this.getFirst()
    // this.getTime1Option();
    this.monthChange();
  },

  methods: {
    fn2() {
      this.monthChange();
      this.$emit("change", this.time2.value);
    },
    monthChange() {
      // value: 2018/11
      var that = this;
      var isGetList = false;
      var time = dayBeginTime(this.month).getTime(); //默认为当日，选择月后为月开始日（日开始时间戳）
      var day = this.month.getDay(); //默认为当日，选择月后为月开始日 (周几)
      if(day == 0){
        day = 7
      }
      var arr = [];
      var weekBegin = time - (day - 1) * oneDayTime;
      arr = getWeeksInMonth(new Date(time));
      //默认时间展示
      if (this.month.getMonth() == new Date().getMonth()) {
        this.time2 = weekTime(new Date(weekBegin));
      } else {
        console.log(arr, "!!!!!!!!");
        this.time2 = arr[0];
      }
      this.time2label = this.time2.label;
      that.time2Options = arr;
      this.$emit("change", this.time2.value);
    },
    time2Change(value) {
      this.$emit("change", value);
    }
  }
};
/**
 * @param obj time Date 对象
 * @return obj Date 对象
 */
function dayBeginTime(time) {
  let d = time.getDate();
  let m = time.getMonth();
  let y = time.getFullYear();
  return new Date(y, m, d);
}
/**
 * @param obj time Date 对象
 * @return intval 当月有多少天
 */
function getDaysByDate(time) {
  var date = new Date(time.getFullYear(), time.getMonth(), 0);
  return date.getDate();
}

/**
 * @param obj time Date 对象
 * @return  array arr
 */
function getWeeksInMonth(time) {
  var days = getDaysByDate(time); //这个月有多少天
  var timestamp = dayBeginTime(time);
  var monthBegin = monthBeginTime(time);
  var arr = [];
  for (var i = 0; i < days; i++) {
    //   //判断d是否是星期一
    let temp = new Date(monthBegin.getTime() + i * oneDayTime);
    if (temp.getDay() == 1) {
      arr.push(weekTime(temp));
    }
  }
  return arr;
}
/**
 * @param obj weekBegin Date 对象
 * @return obj
 */
function weekTime(weekBegin) {
  weekBegin = weekBegin.getTime();
  return {
    label:
      getFullDate(weekBegin) +
      "   ~   " +
      getFullDate(weekBegin + oneDayTime * 6),
    value:
      parseInt(weekBegin / 1000) +
      "," +
      parseInt((weekBegin + oneDayTime * 7 - 1000) / 1000)
  };
}
/**
 * 格式化时间
 * @param obj time Date 对象
 * @return string
 */
function formatData(time) {
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  return y + "/" + (m < 10 ? "0" + m : m) + "/" + (d < 10 ? "0" + d : d);
}

/**
 * @param obj time Date对象
 * @return obj Date对象
 */
function monthBeginTime(time) {
  return new Date(time.getFullYear(), time.getMonth(), 1);
}
</script>