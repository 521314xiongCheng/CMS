import Http from '../http'

export const getNoticeList = () =>
  Http({
    method: 'GET',
    basePath: '/proxy/dashboard',
    url: `/notice/list`
  })

export const addNotice = params =>
  Http({
    method: 'POST',
    basePath: '/proxy/dashboard',
    url: `/notice`,
    data: params
  })

export const updateNotice = (id, params) =>
  Http({
    method: 'PUT',
    basePath: '/proxy/dashboard',
    url: `/notice/${id}`,
    data: params
  })

export const updateStatus = (id, params) =>
  Http({
    method: 'PUT',
    basePath: '/proxy/dashboard',
    url: `/notice/${id}/status`,
    data: params
  })

export const deleteNoticeById = id =>
  Http({
    method: 'DELETE',
    basePath: '/proxy/dashboard',
    url: `/notice/${id}`
  })
