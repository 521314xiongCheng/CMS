import Http from '../http'
import { createQuery } from '../../utility/index'
export const get = params =>
  Http({
    method: 'GET',
    url: `examCategories?${createQuery(params)}`
  })

export const create = params =>
  Http({
    method: 'POST',
    url: 'examCategories',
    data: params
  })

export const del = params =>
  Http({
    method: 'DELETE',
    url: `examCategories/${params.id}`
  })

export const edit = params =>
  Http({
    method: 'PUT',
    url: `examCategories/${params.id}`,
    data: params.data
  })
