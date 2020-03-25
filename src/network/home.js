import {request} from "./requests";


// 获取侧边栏数据
export function getSidePageData() {
  return request({
    url: '/menus',
    method: 'get',
  })
}
