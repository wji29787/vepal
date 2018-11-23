import axios from 'axios'
// import Vue from 'vue'
import qs from 'qs'

// axios.interceptors.request.use(config => { // 这里的config包含每次请求的内容
//   // 判断localStorage中是否存在api_token
//   if (localStorage.getItem('api_token')) {
//     //  存在将api_token写入 request header
//     config.headers.apiToken = `${localStorage.getItem('api_token')}`
//   }
//   return config
// }, err => {
//   return Promise.reject(err)
// })

// axios.interceptors.response.use(response => {
//   return response
// }, error => {
//   return Promise.resolve(error.response)
// })

// function checkStatus (response) {
//   // 如果http状态码正常，则直接返回数据
//   if (response && (response.status === 200 || response.status === 304 ||
//       response.status === 400)) {
//     return response
//   }
//   // 异常状态下，把错误信息返回去
//   return {
//     status: -404,
//     msg: '网络异常'
//   }
// }

// function checkCode (res) {
//   // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
//   if (res.status === -404) {
//     alert(res.msg)
//   }
//   if (res.data && (!res.data.success)) {
//     // alert(res.data.error_msg)
//   }
//   return res
// }
// 请求方式的配置
// export default {
//   post (url, data) { //  post
//     return axios({
//       method: 'post',
//       baseURL: '/backapis',
//       url,
//       data: qs.stringify(data),
//       timeout: 5000,
//       headers: {
//         'X-Requested-With': 'XMLHttpRequest',
//         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
//       }
//     }).then(
//       (response) => {
//         return checkStatus(response)
//       }
//     ).then(
//       (res) => {
//         return checkCode(res)
//       }
//     )
//   },
//   get (url, params) { // get
//     return axios({
//       method: 'get',
//       baseURL: '/backapis',
//       url,
//       params, // get 请求时带的参数
//       timeout: 5000,
//       headers: {
//         'X-Requested-With': 'XMLHttpRequest'
//       }
//     }).then(
//       (response) => {
//         return checkStatus(response)
//       }
//     ).then(
//       (res) => {
//         return checkCode(res)
//       }
//     )
//   }
// }
let http = axios.create({
  // baseURL: 'http://localhost:8080/',
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  },
  // 后执行request2
  transformRequest: [function (data) {
    // let newData = ''
    // for (let k in data) {
    //   if (data.hasOwnProperty(k) === true) {
    //     newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
    //   }
    // }
    //  console.log(qs.stringify(data))
    return qs.stringify(data)
  }],
  // 先执行response1
  // transformResponse:[(data)=>{
  //     console.log(JSON.parse(data))
  //     return JSON.parse(data)
  // }]
})
// 先执行request1
http.interceptors.request.use((config)=>{
  // console.log(config)
  return config
},(err)=>{
  console.log(err)
})
// 后执行response2
http.interceptors.response.use((data)=>{
  // console.log('inter2')
  // console.log(data)
  return data
})

function apiAxios (method, url, params, response) {
  if (typeof params === 'function') {
    response = params
    params = null
  }
  let config = {
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null
  }
  return http(config)
    .then(function (res) {
      response(res)
    }).catch(function (err) {
      response(err)
    })
}

http.all =axios.all;
export default {
  get: function (url, params, response) {
    return apiAxios('GET', url, params, response)
  },
  post: function (url, params, response) {
    return apiAxios('POST', url, params, response)
  },
  put: function (url, params, response) {
    return apiAxios('PUT', url, params, response)
  },
  delete: function (url, params, response) {
    return apiAxios('DELETE', url, params, response)
  },
  all:function (list,response) {
        let getApi=[]
        list.forEach(api => {
          let config = {
            method :'GET'
          }
          config = Object.assign({},config,api)
          let method = config.method.toUpperCase() 
          config.method = method
          if( method === 'GET' || method === 'DELETE'){
            config.params  = config.data
            config.data = null
          } 
          getApi.push(http(config))
        });
        axios.all(getApi).then(axios.spread(response)).catch(response)
  },
  instance:http
}
