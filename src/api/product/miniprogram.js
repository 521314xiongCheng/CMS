import Http from '../http.js'
import { createQuery } from '../../utility/index'

export const getMiniprograms = params =>
  Http({
    method: 'GET',
    basePath: '/proxy/catalog/',
    url: `internal/miniprogram/list?${createQuery(params)}`
  })

export const addMiniprogram = params =>
  Http({
    method: 'POST',
    basePath: '/proxy/catalog/',
    url: `internal/miniprogram`,
    data: params
  })

export const updateMiniprogram = params =>
  Http({
    method: 'PUT',
    basePath: '/proxy/catalog/',
    url: `internal/miniprogram`,
    data: params
  })

export const delMiniprogram = id =>
  Http({
    method: 'DELETE',
    basePath: '/proxy/catalog/',
    url: `internal/miniprogram/${id}`
  })
