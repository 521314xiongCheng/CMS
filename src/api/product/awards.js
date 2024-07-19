import Http from '../http.js'
import { createQuery } from '../../utility/index'

export const getAwards = params =>
  Http({
    method: 'GET',
    basePath: '/proxy/product/',
    url: `internal/awards?${createQuery(params)}`
  })

export const addAward = params =>
  Http({
    method: 'POST',
    basePath: '/proxy/product/',
    url: `internal/awards`,
    data: params
  })

export const getDetailById = id =>
  Http({
    method: 'GET',
    basePath: '/proxy/product/',
    url: `internal/awards/${id}`
  })

export const updateAward = (id, params) =>
  Http({
    method: 'PUT',
    basePath: '/proxy/product/',
    url: `internal/awards/${id}`,
    data: params
  })

export const delAward = id =>
  Http({
    method: 'DELETE',
    basePath: '/proxy/product/',
    url: `internal/awards/${id}`
  })
