import Http from '../../http'
import { createQuery } from '../../../utility/index'
export const get = params =>
  Http({
    method: 'GET',
    url: `faq?${createQuery(params)}`
  })

export const create = params =>
  Http({
    method: 'POST',
    url: 'faq',
    data: params
  })

export const del = params =>
  Http({
    method: 'DELETE',
    url: `faq/${params.id}`
  })

export const edit = params =>
  Http({
    method: 'PUT',
    url: `faq/${params.id}`,
    data: params.data
  })
