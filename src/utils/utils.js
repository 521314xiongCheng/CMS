export default {
  //时间戳转换方法    date:时间戳数字
  formatDate(date) {
    var date2 = new Date(date)
    var YY = date2.getFullYear() + '-'
    var MM =
      (date2.getMonth() + 1 < 10
        ? '0' + (date2.getMonth() + 1)
        : date2.getMonth() + 1) + '-'
    var DD = date2.getDate() < 10 ? '0' + date2.getDate() : date2.getDate()
    // var hh = (date2.getHours() < 10 ? '0' + date2.getHours() : date2.getHours()) + ':';
    // var mm = (date2.getMinutes() < 10 ? '0' + date2.getMinutes() : date2.getMinutes()) + ':';
    // var ss = (date2.getSeconds() < 10 ? '0' + date2.getSeconds() : date2.getSeconds());
    return YY + MM + DD
  },
  doHandleMonth() {
    var myDate = new Date()
    var tMonth = myDate.getMonth()

    var m = tMonth + 1
    if (m.toString().length == 1) {
      m = '0' + m
    }
    return m
  }
}
