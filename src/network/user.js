import {request} from "./requests";


// 获取用户列表数据
export function getUserList(queryInfo) {
  return request({
    url: '/users',
    method: 'get',
    params: queryInfo,
  })
}


// 修改用户权限状态
export function getUserTypeToChange(uid, type) {
  return request({
    url: `/users/${uid}/state/${type}`,
    method: 'put'
  })
}
