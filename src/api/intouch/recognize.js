/* eslint-disable prettier/prettier */
import Http from '../http'
import { readUserInfo,createQuery } from '../../utility/index'
export const getRecognizeList = params =>
    Http({
        method: 'GET',
        basePath: '/proxy/power',
        url: `/v1/internal/recognises?${createQuery(params)}`
        // url: `/mock/409/v1/internal/recognises?${createQuery(params)}`
    })
export const getRecognizeById = id =>
    Http({
        method: 'GET',
        basePath: '/proxy/power',
        // url: `/mock/409/v1/internal/recognises/${id}`
        url: `/v1/internal/recognises/${id}`
    })
export const addRecognize = params =>
    Http({
        method: 'POST',
        basePath: '/proxy/power',
        url: `/v1/internal/recognises`,
        // url: '/mock/409/v1/internal/recognises',
        data: params,
        headers: { 'x-operation-user': readUserInfo().email }
    })
export const updateRecognize = (params, id) =>
    Http({
        method: 'PUT',
        basePath: '/proxy/power',
        url: `/v1/internal/recognises/${id}`,
        // url: `/mock/409/v1/internal/recognises/${id}`,
        data: params,
        headers: { 'x-operation-user': readUserInfo().email }
    })
export const cancelRecognize = id =>
    Http({
        method: 'PUT',
        basePath: '/proxy/power',
        // url: `/mock/409/v1/internal/recognises/${id}/status/cancelled`
        url: `/v1/internal/recognises/${id}/status/cancelled`,
        headers: { 'x-operation-user': readUserInfo().email }
    })
export const delRecognize = id =>
    Http({
        method: 'DELETE',
        basePath: '/proxy/power',
        // url: `/mock/409/v1/internal/recognises/${id}`
        url: `/v1/internal/recognises/${id}`,
        headers: { 'x-operation-user': readUserInfo().email }
    })
export const previewCert = params =>
    Http({
        responseType: 'arraybuffer',
        method: 'GET',
        basePath: '/proxy/power',
        // url: `/mock/409/v1/internal/certificates/previews?${createQuery(params)}`
        url: `/v1/internal/certificates/previews?${createQuery(params)}`,
        headers: { 'x-operation-user': readUserInfo().email }
    })


