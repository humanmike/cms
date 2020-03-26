import {request} from "./requests";


// 获取用户列表数据
export function getUserListApi(queryInfo) {
  return request({
    url: '/users',
    method: 'get',
    params: queryInfo,
  })
}


// 修改用户权限状态
export function getUserTypeToChangeApi(uid, type) {
  return request({
    url: `/users/${uid}/state/${type}`,
    method: 'put'
  })
}

// 添加新用户信息
export function addUserApi(userForm) {
  return request({
    url: '/users',
    method: 'post',
    data: userForm
  })
}

// 根据Id查询用户信息
export function searchUserApi(id) {
  return request({
    url: `/users/${id}`,
    method: 'get'
  })
}

// 修改用户信息
export function updateUserApi(updateForm) {
  return request({
    url: `/users/${updateForm.id}`,
    method: 'put',
    data: updateForm,
  })
}

// 删除用户信息
export function deleteUserApi(id) {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}
