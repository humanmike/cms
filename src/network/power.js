import {request} from "./requests";

// 获取权限列表数据Api列表形式返回
export function getRightsListApi() {
  return request({
    url: '/rights/list',
    method: 'get',
  })
}

// 获取权限列表数据Api树状结构返回
export function getRightsListTreeApi() {
  return request({
    url: '/rights/tree',
    method: 'get',
  })
}

// 获取角色列表数据Api
export function getRolesListApi() {
  return request({
    url: '/roles',
    method: 'get',
  })
}

// 删除角色指定权限
export function deleteRolesRightApi(roleId, rightId) {
  return request({
    url: `/roles/${roleId}/rights/${rightId}`,
    method: 'delete',
  })
}

// 修改角色授权
export function updateRolesRightApi(roleId, rids) {
  return request({
    url: `/roles/${roleId}/rights`,
    method: 'post',
    data: rids
  })
}
