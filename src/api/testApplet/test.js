import Http from '../http'
import { createQuery } from '../../utility/index'

export const get = params =>
  Http({
    method: 'GET',
    url: `exams/${params.examCategoryId}?${createQuery(params)}`
  })

export const create = params =>
  Http({
    method: 'POST',
    url: `exams?${params.examCategoryId}`,
    data: params
  })

export const del = params =>
  Http({
    method: 'DELETE',
    url: `exams/${params.id}`
  })

export const edit = params =>
  Http({
    method: 'PUT',
    url: `exams/${params.id}`,
    data: params.data
  })
