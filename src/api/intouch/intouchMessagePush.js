import Http from '../http.js'
import { createQuery } from '../../utility/index'
const basePath = ''
export const getMessageList = params =>
  Http({
    method: 'GET',
    url: `${basePath}xxxxxxx-message/batches?${createQuery(params)}`
  })

export const getMessageType = () =>
  Http({
    method: 'GET',
    url: `${basePath}xxxxxxx-message/types`
  })

export const getMessageDetail = batchId =>
  Http({
    method: 'GET',
    url: `${basePath}xxxxxxx-message/batches/${batchId}`
  })

export const addMessage = data =>
  Http({
    method: 'POST',
    url: `${basePath}xxxxxxx-message/batch`,
    data: data
  })

export const updateMessage = (batchId, data) =>
  Http({
    method: 'PUT',
    url: `${basePath}xxxxxxx-message/batches/${batchId}`,
    data: data
  })

export const cancelMessage = batchId =>
  Http({
    method: 'PUT',
    url: `${basePath}xxxxxxx-message/batches/${batchId}/cancel`
  })

export const delMessage = batchId =>
  Http({
    method: 'DELETE',
    url: `${basePath}xxxxxxx-message/batches/${batchId}`
  })

export const uploadList = data =>
  Http({
    method: 'POST',
    url: `${basePath}xxxxxxx-message/batches/upload`,
    data: data
  })
