import request from '@/utils/request'

export function getTemplateList(data) {
  return request({
    url: 'admin/mp/temMsg/getTemplateList',
    method: 'post',
    data
  })
}

export function sendMsg(data) {
  return request({
    url: 'admin/mp/temMsg/sendMsg',
    method: 'post',
    data
  })
}
export function saveOrEditMsg(data) {
  return request({
    url: 'admin/mp/temMsg/saveOrEditMsg',
    method: 'post',
    data
  })
}


