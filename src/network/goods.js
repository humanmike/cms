import {request} from "./requests";


// 查询商品列表数据Api
export function getGoodsListApi(query) {
  return request({
    url: '/goods',
    method: 'get',
    params: query,
  })
}

// 删除商品Api
// gid: 商品具体的id
export function deleteGoodsApi(gid) {
  return request({
    url: `/goods/${gid}`,
    method: 'delete',
  })
}
