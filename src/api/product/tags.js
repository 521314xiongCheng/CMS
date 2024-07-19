import Http from '../http.js'
import { createQuery } from '../../utility/index'

export const getTags = params =>
  Http({
    method: 'GET',
    basePath: '/proxy/product/',
    url: `internal/tags?${createQuery(params)}`
  })

export const getAttachments = params =>
  Http({
    method: 'GET',
    basePath: '/proxy/product/',
    url: `internal/attachments?${createQuery(params)}`
  })

export const addTag = params =>
  Http({
    method: 'POST',
    basePath: '/proxy/product/',
    url: `internal/tags`,
    data: params
  })

export const updateTag = (id, params) =>
  Http({
    method: 'PUT',
    basePath: '/proxy/product/',
    url: `internal/tags/${id}`,
    data: params
  })

export const delTag = id =>
  Http({
    method: 'DELETE',
    basePath: '/proxy/product/',
    url: `internal/tags/${id}`
  })
