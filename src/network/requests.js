import axios from 'axios'

// 网络请求封装
export function request(config) {
  const instance = new axios.create({
    baseURL: 'http://192.168.0.108:8888/api/private/v1',
    timeout: '5000',
  })

  // 响应后拦截
  instance.interceptors.response.use(rep => {
    return rep.data
  }, rep => {
    console.log('网络错误原因是: ' + rep);
  })

  return instance(config)
}