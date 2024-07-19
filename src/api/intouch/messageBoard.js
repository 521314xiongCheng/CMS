import Http from '../http.js'
import { createQuery } from '../../utility/index'
const basePath = ''
export const getCommunications = params =>
  Http({
    method: 'GET',
    url: `${basePath}communications?${createQuery(params)}`
  })

export const getCommunicationDetail = communicationId =>
  Http({
    method: 'GET',
    url: `${basePath}communications/${communicationId}`
  })

export const addCommunication = data =>
  Http({
    method: 'POST',
    url: `${basePath}communications`,
    data: data
  })

export const updateCommunication = (communicationId, data) =>
  Http({
    method: 'PUT',
    url: `${basePath}communications/${communicationId}`,
    data: data
  })

export const delCommunication = communicationId =>
  Http({
    method: 'DELETE',
    url: `${basePath}communications/${communicationId}`
  })

export const sortCommunications = data =>
  Http({
    method: 'POST',
    url: `${basePath}communications/sort`,
    data: data
  })

export const topCommunication = communicationId =>
  Http({
    method: 'PUT',
    url: `${basePath}communications/${communicationId}/top`,
    data: {}
  })

export const uploadWhiteList = data =>
  Http({
    method: 'POST',
    url: `${basePath}communications/upload`,
    data: data
  })

export const getRules = () =>
  Http({
    method: 'GET',
    url: `${basePath}communication/rules`
  })
