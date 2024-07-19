import Http from './http'
import { createQuery } from '../utility/index'
export const get = params =>
  Http({
    method: 'GET',
    url: `activities?${createQuery(params)}`
  })

export const add = params =>
  Http({
    method: 'POST',
    url: 'activities',
    data: params
  })

export const del = params =>
  Http({
    method: 'DELETE',
    url: `activities/${params.id}`
  })

export const edit = params =>
  Http({
    method: 'PUT',
    url: `activities/${params.id}`,
    data: params.data
  })
