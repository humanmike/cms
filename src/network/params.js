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
