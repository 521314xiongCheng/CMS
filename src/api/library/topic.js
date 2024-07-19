import Http from '../http.js'
import { createQuery } from '../../utility/index'

export const getTopics = params =>
  Http({
    method: 'GET',
    url: `library/topics?${createQuery(params)}`
  })

export const addTopic = params =>
  Http({
    method: 'POST',
    url: `library/topics`,
    data: params
  })

export const updateTopic = (contentId, params) =>
  Http({
    method: 'PUT',
    url: `library/topics/${contentId}`,
    data: params
  })

export const delTopic = contentId =>
  Http({
    method: 'DELETE',
    url: `library/topics/${contentId}`
  })

export const topTopic = contentId =>
  Http({
    method: 'PUT',
    url: `library/topics/${contentId}/top`,
    data: {}
  })

export const sortTopic = data =>
  Http({
    method: 'POST',
    url: `library/topics/sort`,
    data: data
  })

export const getTopicContents = (topicId, params) =>
  Http({
    method: 'GET',
    url: `library/topicContents/${topicId}?${createQuery(params)}`
  })

export const getLibraryContents = (topicId, params) =>
  Http({
    method: 'GET',
    url: `library/contents/${topicId}/topic?${createQuery(params)}`
  })

export const addTopicContent = (topicId, data) =>
  Http({
    method: 'POST',
    url: `library/topicContents/${topicId}`,
    data: data
  })

export const sortTopicContents = (topicId, data) =>
  Http({
    method: 'POST',
    url: `library/topicContents/${topicId}/sort`,
    data: data
  })

export const delTopicContent = topicContentId =>
  Http({
    method: 'DELETE',
    url: `library/topicContents/${topicContentId}`
  })
