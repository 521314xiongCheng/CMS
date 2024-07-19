import Http from '../http.js'
import { createQuery } from '../../utility/index'

export const getParameters = params =>
  Http({
    method: 'GET',
    basePath: '/proxy/product/',
    url: `internal/parameters?${createQuery(params)}`
  })

export const addParameter = params =>
  Http({
    method: 'POST',
    basePath: '/proxy/product/',
    url: `internal/parameters`,
    data: params
  })

export const updateParameter = (id, params) =>
  Http({
    method: 'PUT',
    basePath: '/proxy/product/',
    url: `internal/parameters/${id}`,
    data: params
  })

export const delParameter = id =>
  Http({
    method: 'DELETE',
    basePath: '/proxy/product/',
    url: `internal/parameters/${id}`
  })
