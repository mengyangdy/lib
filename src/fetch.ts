import qs from 'qs'
import { isObject } from "./is";

/**
 * request([config])
 * url 请求地址
 * method 请求方式 默认GET/DELETE/HEAD/OPTIONS/POST/PUT/PATCH
 * credentials 携带资源凭证 * include/same-origin/omit
 * headers:{} 自定义的请求头信息 格式必须是纯粹对象
 * body:null 请求主体信息 只针对POST系列请求，根据当前服务器要求，如果用户传递的是一个纯粹对象，我们需要把其转变为urlencoded格式字符串
 * params:null 设定问号传参格式 格式必须是纯粹对象，我们在内部把其拼接到url的末尾
 * responseType 预设服务器反返回结果的读取方式 json/text/arrayBuffer/blob
 * signal 中断请求的信号
 */

// 核心方法
export const request = function request(config:any) {
  if (!isObject(config)) config = {} 
  config = Object.assign({
    url: '',
    method: 'GET',
    credentials: 'include',
    headers: null,
    body: null,
    params: null,
    responseType: 'json',
    signal: null
  }, config)
  if (!isObject(config.headers)) config.headers = {}
  if (config.params !== null && !isObject(config.params)) config.params = null
  let { url, method, credentials, headers, body, params, responseType, signal } = config

  // 处理URL：params存在我们需要把params中的每一项拼接到URL末尾
  if (params) url += `${url.includes('?') ? '&' : '?'}${qs.stringify(params)}`

  // 处理请求主体 只针对POST系列请求：body是个纯粹对象 根据当前后台要求 把其变成urlencoded格式
  if (isObject(body)) {
    body = qs.stringify(body)
    if (headers) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }
  }

  // 类似于axios中的拦截器
  let token = localStorage.getItem('token')
  if (token) {
    if (headers) {
      headers['Authorzation'] = token
    }
  }

  method = method.toUpperCase()
  config = {
    method,
    credentials,
    headers,
    cache: 'no-cache',
    mode: 'cors'
  } 
  if (/^(POST|PUT|PATCH)$/i.test(method) && body) config.body = body
  if (signal) config.signal = signal
  return fetch(url, config).then(response => {
    let { status, statusText } = response
    let result
    if (!/^(2|3)\d{2}$/.test(status)) return Promise.reject({ code: -1, status, statusText })
    switch (responseType.toLowerCase()) {
      case 'json':
        result = response.json()
        break
      case 'text':
        result = response.text()
        break
      case 'arraybuffer':
        result = response.arrayBuffer()
        break
      case 'blob':
        result = response.blob()
        break
      default:
        result = response.json()
        break
    }
    return result.then(null, reason => Promise.reject({ code: -2, reason }))
  }).catch(reason => {
    return Promise.reject(reason)
  })
}

// ['GET', 'HEAD', 'DELETE', 'OPTIONS'].forEach(item => {
//   request[item.toLowerCase()] = function (url, config) {
//     if (!isObject(config)) config = {} 
//     config['url'] = url
//     config['method'] = item
//     return request(config)
//   }
// })
// ['POST', 'PUT', 'PATCH'].forEach(item => {
//   request[item.toLowerCase()] = function (url: string, body: any, config){
//     if (!isObject(config)) config = {} 
//     config['url'] = url
//     config['method'] = item
//     config['body'] = body
//     return request(config)
//   }
// })

