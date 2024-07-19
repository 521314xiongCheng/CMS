import Http from '../http.js'
import { createQuery } from '../../utility/index'

export const getTemplates = params =>
  Http({
    method: 'GET',
    basePath: '/proxy/catalog/',
    url: `internal/templates?${createQuery(params)}`
  })

export const addTemplate = params =>
  Http({
    method: 'POST',
    basePath: '/proxy/catalog/',
    url: `internal/templates`,
    data: params
  })

export const updateTemplate = (id, params) =>
  Http({
    method: 'PUT',
    basePath: '/proxy/catalog/',
    url: `internal/templates/${id}`,
    data: params
  })

export const delTemplate = id =>
  Http({
    method: 'DELETE',
    basePath: '/proxy/catalog/',
    url: `internal/templates/${id}`
  })
