import Http from '../http.js'
import { createQuery } from '../../utility/index'

export const getContents = params =>
  Http({
    method: 'GET',
    url: `library/contents?${createQuery(params)}`
  })

export const addContent = params =>
  Http({
    method: 'POST',
    url: `library/contents`,
    data: params
  })

export const updateContent = (contentId, params) =>
  Http({
    method: 'PUT',
    url: `library/contents/${contentId}`,
    data: params
  })

export const delContent = contentId =>
  Http({
    method: 'DELETE',
    url: `library/contents/${contentId}`
  })

export const pushContent = (contentId, params) =>
  Http({
    method: 'PUT',
    url: `library/contents/${contentId}/push`,
    data: params
  })

export const topContent = contentId =>
  Http({
    method: 'PUT',
    url: `library/contents/${contentId}/top`,
    data: {}
  })

export const getContentDetail = contentId =>
  Http({
    method: 'GET',
    url: `library/contents/${contentId}`
  })

export const sortContent = data =>
  Http({
    method: 'POST',
    url: `library/contents/sort`,
    data: data
  })

// 只返回文件流
// export const getTts = text =>
//   Http({
//     method: 'POST',
//     url: `/ttsTest`,
//     data: { text: text },
//     responseType: 'blob'
//   })

// 将文件流上传s3，返回s3地址
export const getTts = text =>
  Http({
    method: 'POST',
    url: `/getTts`,
    data: { text: text }
  })
