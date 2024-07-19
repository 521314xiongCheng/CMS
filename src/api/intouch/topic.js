/* eslint-disable prettier/prettier */
import Http from '../http'
import { createQuery } from '../../utility/index'
export const getTopicList = params =>
  Http({
    method: 'GET',
    basePath: '/proxy/topic',
    url: `/topics?${createQuery(params)}`
    // url: `/mock/363/v1/internal/topics?${createQuery(params)}`
  })
export const getTopicById = id =>
  Http({
    method: 'GET',
    basePath: '/proxy/topic',
    url: `/topics/${id}`
    // url: `/mock/363/v1/internal/topics/${id}`
  })
export const addTopic = params =>
  Http({
    method: 'POST',
    basePath: '/proxy/topic',
    url: `/topics`,
    data: params
  })
export const updateTopic =(params,id)  =>
  Http({
    method: 'PUT',
    basePath: '/proxy/topic',
    url: `/topics/${id}`,
    data: params
  })
export const deleteTopic = id =>
  Http({
    method: 'DELETE',
    basePath: '/proxy/topic',
    url: `/topics/${id}`
  })
export const batchUpdateSort = params =>
  Http({
    method: 'PATCH',
    basePath: '/proxy/topic',
    url: `/topics/sequences/batch`,
    data: params
  })
export const getAdminList = params =>
  Http({
    method: 'GET',
    basePath: '/proxy/topic',
    url: `/administrators?${createQuery(params)}`
  })
export const addAdmin = params =>
  Http({
    method: 'POST',
    basePath: '/proxy/topic',
    url: `/administrators`,
    data: params
  })
export const deleteAdmin = id =>
  Http({
    method: 'DELETE',
    basePath: '/proxy/topic',
    url: `/administrators/${id}`
  })

export const setHot = (id ,params)=>
  Http({
    method: 'PATCH',
    basePath: '/proxy/topic',
    url: `/topics/${id}/hot`,
    data: params
  })

