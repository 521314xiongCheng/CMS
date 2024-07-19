import Http from '../http.js'
import { createQuery } from '../../utility/index'

export const getSeries = params =>
  Http({
    method: 'GET',
    basePath: '/proxy/product/',
    url: `internal/series?${createQuery(params)}`
  })

export const addSerie = params =>
  Http({
    method: 'POST',
    basePath: '/proxy/product/',
    url: `internal/series`,
    data: params
  })

export const updateSerie = (id, params) =>
  Http({
    method: 'PUT',
    basePath: '/proxy/product/',
    url: `internal/series/${id}`,
    data: params
  })

export const delSerie = id =>
  Http({
    method: 'DELETE',
    basePath: '/proxy/product/',
    url: `internal/series/${id}`
  })
