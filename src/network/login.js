import {request} from "./requests";

// 登陆请求
export function loginApi(usrForm) {
  return request({
    url: '/login',
    method: 'post',
    data: usrForm,
  })
}