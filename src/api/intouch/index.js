import Http from '../http'

export const get = (page, params) =>
  Http({
    method: 'GET',
    url: `${page}s?module=xxxxxxx`,
    params
  })

export const create = (page, params) =>
  Http({
    method: 'POST',
    url: `${page}?module=xxxxxxx`,
    data: params
  })

export const edit = (page, params) =>
  Http({
    method: 'PUT',
    url: `${page}s/${params.id}?module=xxxxxxx`,
    data: params
  })

export const online = (page, params) =>
  Http({
    method: 'PUT',
    url: `${page}s/${params.id}/online?module=xxxxxxx`
  })

export const del = (page, params) =>
  Http({
    method: 'DELETE',
    url: `${page}s/${params.id}?module=xxxxxxx`
  })
