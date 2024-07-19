import Http from '../../http'
import { createQuery } from '../../../utility/index'

export const getList = (parentId, params) =>
  Http({
    method: 'GET',
    url: `categories/${parentId}?${createQuery(params)}`
  })

export const publishCategory = categoryId =>
  Http({
    method: 'PUT',
    url: `categories/${categoryId}/publish`
  })

export const delCategory = categoryId =>
  Http({
    method: 'DELETE',
    url: `categories/${categoryId}`
  })

export const addCategory = params =>
  Http({
    method: 'POST',
    url: `categories`,
    data: params
  })

export const editCategory = params =>
  Http({
    method: 'PUT',
    url: `categories/${params.id}`,
    data: params
  })
// /v1/categories/sort
export const sortCategory = params =>
  Http({
    method: 'POST',
    url: `categories/sort`,
    data: params
  })
