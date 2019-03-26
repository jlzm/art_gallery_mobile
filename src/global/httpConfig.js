import axios from 'axios'
import qs from 'qs'
import global from './global'
import Vue from 'vue'
import { Toast, ToastPlugin } from 'vux'
axios.defaults.headers.post['Content-Type'] = global.CONTENTTYPE
axios.defaults.baseURL = global.BASEURL
axios.defaults.transformRequest = [function(data, config) {
  if (!config['Content-Type']) return qs.stringify(data)
  switch (config['Content-Type'].toLowerCase()) {
    case 'application/json; charset=utf-8':
      return JSON.stringify(data)
    case 'multipart/form-data;charset=utf-8':
      // 默认传入files为文件类型
      let files = data.files
      let formData = new FormData()
      if (files && files.length) {
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i])
        }
      }
      for (let item in data) {
        if (item !== 'files') {
          formData.append(item, data[item])
        }
      }
      return formData
    default:
      return qs.stringify(data)
  }
}]
export function sendRequest({
  method = "GET",
  url,
  data = {},
  parmas = {},
  timeout = 1000 * 50,
  binary = false
}) {
  data = Object.assign({}, data, parmas)
  var config = {
    method,
    url,
    data,
    parmas,
    timeout,
    binary,
    headers: {}
  }
  config.headers['Content-Type'] = global.CONTENTTYPE
  config.headers.Accept = 'application/json, text/plain, */*'
  return axios(config).then(res => res.data).catch(err => Vue.$vux.toast.text(err.message, 'middle'))
}
export function sendFormData({
  method = "post",
  url,
  data = {},
  parmas = {},
  timeout = 1000 * 50,
  binary = false
}) {

  var config = {
    method,
    url,
    data,
    parmas,
    timeout,
    binary,
    headers: {}
  }
  config.headers['Content-Type'] = 'multipart/form-data;charset=UTF-8'
  config.headers.Accept = 'application/json, text/plain, */*'
  return axios(config).then(res => res.data).catch(err => Vue.$vux.toast.text(err.message, 'middle'))
}