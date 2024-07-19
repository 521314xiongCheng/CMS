import Http from '../../http'
import { createQuery } from '../../../utility/index'

export const getList = (categoryId, params) =>
  Http({
    method: 'GET',
    url: `courses/${categoryId}?${createQuery(params)}`
  })

export const delCourse = courseId =>
  Http({
    method: 'DELETE',
    url: `courses/${courseId}`
  })

export const addCourse = (categoryId, params) =>
  Http({
    method: 'POST',
    url: `courses/${categoryId}`,
    data: params
  })

export const sortCourse = params =>
  Http({
    method: 'PUT',
    url: `courses/sort`,
    data: params
  })

export const pendingBgcList = (categoryId, params) =>
  Http({
    method: 'GET',
    url: `bgcs/${categoryId}/choose?${createQuery(params)}`
  })
