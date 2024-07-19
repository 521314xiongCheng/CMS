import Http from '../http.js'
import { createQuery } from '../../utility/index'

export const getProducts = params =>
  Http({
    method: 'GET',
    basePath: '/proxy/product/',
    url: `internal/skus?${createQuery(params)}`
  })

export const publishProduct = params =>
  Http({
    method: 'POST',
    basePath: '/proxy/product/',
    url: `internal/skus/publish`,
    NoNotify: true,
    data: params
  })

export const updateProduct = (id, params) =>
  Http({
    method: 'PUT',
    basePath: '/proxy/product/',
    url: `internal/skus/${id}`,
    data: params
  })

export const getProductInfoBySKU = sku =>
  Http({
    method: 'GET',
    basePath: '/proxy/product/',
    url: `internal/skus/${sku}`
  })
