import {request} from "./requests";

// 获取商品分类数据列表Api
export function getCategoriesApi(query) {
  return request({
    url: '/categories',
    method: 'get',
  })
}

// 获取动态参数Api
// threeId:最后三级菜单的选中的三级菜单id
// sel: 具体是获取动态还是静态参数
export function getParamsDynamicStateApi(threeId) {
  return request({
    url: `categories/${threeId}/attributes`,
    method: 'get',
    params: {
      sel: 'many'
    }
  })
}

// 获取静态参数Api
// threeId:最后三级菜单的选中的三级菜单id
// sel: 具体是获取动态还是静态参数
export function getParamsStaticStateApi(threeId) {
  return request({
    url: `categories/${threeId}/attributes`,
    method: 'get',
    params: {
      sel: 'only'
    }
  })
}

// 提交商品数据Api
export function addGoodsApi(form) {
  return request({
    url: '/goods',
    method: 'post',
    data: form
  })
}

