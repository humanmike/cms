import {request} from "./requests";


// 查询商品列表数据Api
export function getGoodsListApi(query) {
  return request({
    url: '/goods',
    method: 'get',
    params: query,
  })
}
