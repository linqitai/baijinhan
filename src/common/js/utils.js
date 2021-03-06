/*  说明：
 *  插件文件：utils.js
 *  作者：林祺泰  QQ：514917919
 * */
// 管理员状态( 0:禁用 1:启用),点击禁用,0,点击启用,1
export function getLimiteText(value) {
  let len = 24
  if (value.length > len) {
    return value.substr(0, len) + '···'
  } else {
    return value
  }
}
export function getDaysInYearMonth(year, month){
  var date = new Date(year, month, 0);
  return date.getDate();
}
export function getTime(value) {
  var time = new Date(value).getTime()
  return time
}
//得到当天是周几
export function getDay(date) {
  var day = new Date(date).getDay()
  return day;
}
export function getMonth(date) {
  var month = new Date(date).getMonth()
  return month+1;
}
export function getFullDate(t){
  if(t) {
    var value=''
    if(t.toString().length==10){
      value = parseInt(t)*1000
    }else{
      value = parseInt(t)
    }
    var time = new Date(value)
    var y = time.getFullYear()
    var m = time.getMonth() + 1
    var d = time.getDate()
    return y + '/' + (m < 10 ? '0' + m : m) + '/' + (d < 10 ? '0' + d : d)
  }else{
    return '--'
  }
  
}
export function getFullDateTime(t){
  var value=''
  if(t.toString().length==10){
    value = parseInt(t)*1000
  }else{
    value = parseInt(t)
  }
  var time = new Date(value)
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  var h = time.getHours()
  var minute = time.getMinutes()
  var s = time.getSeconds()
  return y + '/' + (m < 10 ? '0' + m : m) + '/' + (d < 10 ? '0' + d : d) + ' ' + (h < 10 ? '0' + h : h) + ':' + (minute < 10 ? '0' + minute : minute) + ':' + (s < 10 ? '0' + s : s)
}
export function getFullTime(t){
  var value=''
  if(t.toString().length==10){
    value = parseInt(t)*1000
  }else{
    value = parseInt(t)
  }
  var time = new Date(value)
  var hour = time.getHours()
  return `${hour}:00~${hour+1}:00`
}

export function getTodayDate(value) {
  var time = new Date(value)
  var d = time.getDate()
  return d;
}

export function getSex(t){
  return t==1?"男":"女"
}

export function hasNull(params){
  var keys = Object.keys(params);
  for (var i = 0; i < keys.length; i++) {
    var obj = params[keys[i]];
    if (obj === 0) {
      return false;
    }
    if (!obj || obj == '') {
      return true;
    }
  }
  return false;
}

export function formClear(params) {
  var keys = Object.keys(params);
  var form = params;
  for (var i = 0; i < keys.length; i++) {
    form[keys[i]] = '';
  }
  return form;
}

/**
 * param 将要转为URL参数字符串的对象
 * key URL参数字符串的前缀
 * encode true/false 是否进行URL编码,默认为true
 * 
 * return URL参数字符串
 */
export function urlEncode(param, key, encode) {
  if(param==null) return '';
  var paramStr = '';
  var t = typeof (param);
  if (t == 'string' || t == 'number' || t == 'boolean') {
    paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
  } else {
    for (var i in param) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      paramStr += urlEncode(param[i], k, encode);
    }
  }
  return paramStr;
}


