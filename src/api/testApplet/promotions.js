import Http from '../http'
import { createQuery } from '../../utility/index'
export const get = params =>
  Http({
    method: 'GET',
    url: `promotions?${createQuery(params)}`
  })

export const create = params =>
  Http({
    method: 'POST',
    url: 'promotions',
    data: params
  })

export const del = params =>
  Http({
    method: 'DELETE',
    url: `promotions/${params.id}`
  })

export const edit = params =>
  Http({
    method: 'PUT',
    url: `promotions/${params.id}`,
    data: params.data
  })
