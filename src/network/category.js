import {request} from "./requests";

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

// 添加分类
export function addCategoriesApi(form) {
  return request({
    url: '/categories',
    method: 'post',
    data: form,
  })
}
