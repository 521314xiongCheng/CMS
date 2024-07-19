import Http from '../http.js'
import { createQuery } from '../../utility/index'

export const getTags = params =>
  Http({
    method: 'GET',
    url: `library/labels?${createQuery(params)}`
  })

export const addTag = params =>
  Http({
    method: 'POST',
    url: `library/labels`,
    data: params
  })

export const updateTag = (labelId, params) =>
  Http({
    method: 'PUT',
    url: `library/labels/${labelId}`,
    data: params
  })

export const delTag = labelId =>
  Http({
    method: 'DELETE',
    url: `library/labels/${labelId}`
  })

export const sortTags = data =>
  Http({
    method: 'POST',
    url: `library/labels/sort`,
    data: data
  })
