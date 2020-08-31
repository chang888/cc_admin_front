import request from '@/utils/request'

export function getTemplateList(data) {
  return request({
    url: 'admin/mp/temMsg/getTemplateList',
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
export function previewMsg(id) {
  return request({
    url: 'admin/mp/temMsg/preview',
    method: 'post',
    data: {id}
  })
}
export function sendMsg(id) {
  return request({
    url: 'admin/mp/temMsg/send',
    method: 'post',
    data: {id}
  })
}
export function getTagsList() {
  return request({
    url: 'admin/mp/tags/list',
    method: 'get',
  })
}


