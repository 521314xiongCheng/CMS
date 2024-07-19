import Http from '../http'
import { createQuery } from '../../utility/index'
export const get = params =>
  Http({
    method: 'GET',
    url: `ageRanges?${createQuery(params)}`
  })

export const create = params =>
  Http({
    method: 'POST',
    url: 'ageRanges',
    data: params
  })

export const del = params =>
  Http({
    method: 'DELETE',
    url: `ageRanges/${params.id}`
  })

export const edit = params =>
  Http({
    method: 'PUT',
    url: `ageRanges/${params.id}`,
    data: params.data
  })
