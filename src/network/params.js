import {request} from "./requests";

// 获取级联菜单的多级商品分类信息
// 可选参数type,pagenum pagesize
// type: 不传参的话默认获取所有级别的分类
// pagenum: 当前页码值 不传的话获取所有分类(传的话就是制作分页效果)
// pagesize: 每页显示多少条数据 不传的话获取所有分类(传的话就是制作分页效果)
// 获取商品分类数据列表Api
export function getCategoriesApi(query) {
  return request({
    url: '/categories',
    method: 'get',
    params: query,
  })
}

// 获取分类参数的动静态属性参数列表
// id:最后三级菜单的选中的三级菜单id
// sel: 具体是获取动态还是静态参数
export function getParamsStateApi(id,sel) {
  return request({
    url: `categories/${id}/attributes`,
    method: 'get',
    params: sel,
  })
}

// 添加动静态参数
// threeId当前三级菜单的id
// attrForm应该包含
// 1.attr_name 新参数名称
// 2.attr_sel 属于动态还是静态(many only)
export function addParamsStateApi(threeId,attrForm) {
  return request({
    url: `categories/${threeId}/attributes`,
    method: 'post',
    data: attrForm,
  })
}

// 编辑动静态参数
// threeId当前三级菜单的id
// attrId 三级菜单下的参数id
// attrForm应该包含
// 1.attr_name 新参数名称
// 2.attr_sel 属于动态还是静态(many only)
export function changeParamsStateApi(threeId,attrId,attrForm) {
  return request({
    url: `categories/${threeId}/attributes/${attrId}`,
    method: 'put',
    data: attrForm,
  })
}


// 删除动静态参数
// threeId当前三级菜单的id
// attrId 三级菜单下的参数id
// attrForm应该包含
// 1.attr_sel 属于动态还是静态(many only)
export function deleteParamsStateApi(threeId,attrId,attrForm) {
  return request({
    url: `categories/${threeId}/attributes/${attrId}`,
    method: 'delete',
    params: attrForm,
  })
}

// 添加三级菜单子参数
// threeId当前三级菜单的id
// attrId 三级菜单下的参数id
// attrForm应该包含
// 1.attr_name 新参数名称
// 2.attr_sel 属于动态还是静态(many only)
// 3.attr_vals: 修改后的三级菜单子参数的字符串
export function addParamsThreeApi(threeId,attrId,attrForm) {
  return request({
    url: `categories/${threeId}/attributes/${attrId}`,
    method: 'put',
    data: attrForm,
  })
}


