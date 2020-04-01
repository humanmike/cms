import axios from 'axios'


// 网络请求封装
export function request(config) {
  const instance = new axios.create({
    baseURL: 'http://192.168.0.107:8888/api/private/v1',
    timeout: '5000',
  })

  // 请求前拦截
  instance.interceptors.request.use((req) => {

    // 请求前拦截添加请求头内容
    req.headers.Authorization = window.sessionStorage.token
    return req
  })

  // 响应后拦截
  instance.interceptors.response.use(rep => {
    return rep.data
  }, rep => {
    console.log('网络错误原因是: ' + rep);
  })

  return instance(config)
}
