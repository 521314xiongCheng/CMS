import Http from '../http'

export const addResource = params =>
  Http({
    url: 'system/resources',
    method: 'POST',
    data: params
  })

export const editResource = (id, params) =>
  Http({
    url: `system/resources/${id}`,
    method: 'PUT',
    data: params
  })

export const getResourceList = params =>
  Http({
    url: 'system/resources',
    method: 'GET',
    params: params
  })

export const delResource = id =>
  Http({
    url: `system/resources/${id}`,
    method: 'DELETE'
  })
