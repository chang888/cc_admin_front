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
    url: 'admin/mp/temMsg/saveOrEdit',
    method: 'post',
    data
  })
}
export function getOne(id) {
  return request({
    url: 'admin/mp/temMsg/getOne',
    method: 'post',
    data: {id}
  })
}
export function delMsg(id) {
  return request({
    url: 'admin/mp/temMsg/delete',
    method: 'post',
    data: {id}
  })
}

export function getMsgList() {
  return request({
    url: 'admin/mp/temMsg/getMsgList',
    method: 'post',
  })
}


