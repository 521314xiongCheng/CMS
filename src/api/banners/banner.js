import Http from '../http'
// import { createQuery, readCookie } from '../../utility/index'

export const getPages = params =>
  Http({
    method: 'GET',
    url: `banners?pageNo=1&pageSize=1000&bannerId=${params.bannerId}&bannerTag=${params.bannerTag}&title=${params.title}&status=${params.status}`
  })

export const create = params =>
  Http({
    method: 'POST',
    url: `banner`,
    data: params
  })

export const getDetail = params =>
  Http({
    method: 'GET',
    url: `banner/${params}`
  })

export const update = params =>
  Http({
    method: 'PUT',
    url: `banner`,
    data: params
  })

export const add = params =>
  Http({
    method: 'POST',
    url: 'casedetail',
    data: params.data,
    headers: {
      username: encodeURIComponent(params.username)
    }
  })

export const assignFollower = params =>
  Http({
    method: 'PUT',
    url: `case/follower`,
    data: params.data,
    headers: {
      username: encodeURIComponent(params.username)
    }
  })

export const editStatus = params =>
  Http({
    method: 'PUT',
    url: `case/status`,
    data: params.data,
    headers: {
      username: encodeURIComponent(params.username)
    }
  })
