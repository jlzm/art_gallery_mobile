import FastClick from 'fastclick'

function getStyle(node, attr) {
  if (typeof getComputedStyle !== 'undefined') {
    var value = getComputedStyle(node, null).getPropertyValue(attr)
    return attr === 'opacity' ? value * 100 : value // 兼容不透明度，如果是不透明度，则返回整数方便计算
  } else if (typeof node.currentStyle !== 'undefined') {
    if (attr === 'opacity') { // 兼容不透明度
      return Number(node.currentStyle.getAttribute('filter').match(/(?:opacity[=:])(\d+)/)[1])
    } else {
      return node.currentStyle.getAttribute(attr)
    }
  }
}
/**
 *
 * @param {string} dateStr
 */
function formatDate(dateStr, type) {
  var month = dateStr.slice(4, 6)
  var day = dateStr.slice(6)
  var nowYear = new Date().getFullYear()
  if (type === 2) {
    // toISOString "2018-10-02T03:02:06.000Z"
    month = dateStr.slice(5, 7)
    day = dateStr.slice(8, 10)
  }
  if (Number(month) < 10) {
    month = '0' + month
  }
  if (Number(day) < 10) {
    day = '0' + day
  }
  if (type === 1) {
    return nowYear + '-' + month + '-' + day
  } else if (type === 2) {
    return nowYear + '年' + month + '月' + day + '日'
  }
  return month + '/' + day
}
/**
 * fastclick fix double click
 */
function fDbClick(el, type) {
  var u = navigator.userAgent,
    app = navigator.appVersion;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  var notNeed = FastClick.notNeeded(document.body)
  el.click()
    // if (!notNeed && isIOS) {
    //   el.click()
    // }
}
export default {
  getStyle,
  formatDate,
  fDbClick
}