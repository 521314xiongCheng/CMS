import Http from '../http'
import { createQuery } from '../../utility/index'

export const get = params =>
  Http({
    method: 'GET',
    url: `cases?${createQuery(params)}`
  })

export const getFollowers = params =>
  Http({
    method: 'GET',
    url: `followers?${createQuery(params)}`
  })

export const getDetail = params =>
  Http({
    method: 'GET',
    url: `case/${params.id}`
  })

export const add = params =>
  Http({
    method: 'POST',
    url: 'casedetail',
    data: params.data,
    headers: {
      nickName: encodeURIComponent(params.username)
    }
  })

export const assignFollower = params =>
  Http({
    method: 'PUT',
    url: `case/follower`,
    data: params.data,
    headers: {
      nickName: encodeURIComponent(params.username)
    }
  })

export const editStatus = params =>
  Http({
    method: 'PUT',
    url: `case/status`,
    data: params.data,
    headers: {
      nickName: encodeURIComponent(params.username)
    }
  })
