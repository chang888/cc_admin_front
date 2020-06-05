import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/auth/jwt/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    // url: '/vue-admin-template/user/info',
    url: '/admin/user/info',
    method: 'get',
    params: { token }
  })
  // return request({
  //   url: '/dev-api/vue-admin-template/user/info',
  //   method: 'get',
  //   params: { token }
  // })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
