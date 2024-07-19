import Http from './http'

/**
 * @param url required
 * @param params
 */

export const get = (url, params = {}, basePath = '') =>
  Http({
    method: 'GET',
    basePath: basePath,
    url,
    params
  })

export const create = (url, params = {}) =>
  Http({
    method: 'POST',
    url,
    data: params
  })

export const edit = (url, params = {}) =>
  Http({
    method: 'PUT',
    url,
    data: params
  })

export const online = url =>
  Http({
    method: 'PUT',
    url
  })

export const del = url =>
  Http({
    method: 'DELETE',
    url
  })
