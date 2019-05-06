import request from '@/utils/request'

export function publicApi(url, data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}

