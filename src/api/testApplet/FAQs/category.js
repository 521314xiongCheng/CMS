import Http from '../../http'
import { createQuery } from '../../../utility/index'
export const get = params =>
  Http({
    method: 'GET',
    url: `faqCategories?${createQuery(params)}`
  })

export const getList = () =>
  Http({
    method: 'GET',
    url: `faqCategories`
  })

export const create = params =>
  Http({
    method: 'POST',
    url: 'faqCategories',
    data: params
  })

export const del = params =>
  Http({
    method: 'DELETE',
    url: `faqCategories/${params.id}`
  })

export const edit = params =>
  Http({
    method: 'PUT',
    url: `faqCategories/${params.id}`,
    data: params.data
  })
