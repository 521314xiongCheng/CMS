import Http from '../http'
import { createQuery } from '../../utility/index'

export const list = (type, params) =>
  Http({
    method: 'GET',
    url: `resources/${type}?${createQuery(params)}`
  })

export const addResource = params =>
  Http({
    method: 'POST',
    url: `resources`,
    data: params
  })

export const delResource = resourceId =>
  Http({
    method: 'DELETE',
    url: `resources/${resourceId}`
  })
export const editResource = params =>
  Http({
    method: 'PUT',
    url: `resources/${params.id}`,
    data: params
  })
