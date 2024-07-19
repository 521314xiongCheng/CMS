import Http from './http'
import { createQuery } from '../utility/index'

export const get = params =>
  Http({
    method: 'GET',
    url: `coupons?${createQuery(params)}&activityId=${params.activityId}`
  })

export const create = params =>
  Http({
    method: 'POST',
    url: `coupons?activityId=${params.activityId}`,
    data: params
  })

export const del = params =>
  Http({
    method: 'DELETE',
    url: `coupons/${params.id}`
  })

export const edit = params =>
  Http({
    method: 'PUT',
    url: `coupons/${params.id}`,
    data: params.data
  })
