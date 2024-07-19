import Http from '../http'
import { createQuery } from '../../utility/index'

export const getTableList = data =>
  Http({
    method: 'GET',
    basePath: '/proxy/articles',
    url: `/internal/collections?page_num=${data.page_num}&page_size=20&type=30&sort=sort`
  })

export const publishTopic = (collection_id, data) =>
  Http({
    method: 'PUT',
    basePath: '/proxy/articles',
    url: `/internal/collections/${collection_id}/publish`,
    data: data
  })

export const deleteTopic = collection_id =>
  Http({
    method: 'DELETE',
    basePath: '/proxy/articles',
    url: `/internal/collections/${collection_id}`
  })

export const setSort = data =>
  Http({
    method: 'PATCH',
    basePath: '/proxy/articles',
    url: `/internal/collections/set-sort`,
    data: data
  })

export const getItemList = (collection_id, query) =>
  Http({
    method: 'GET',
    basePath: '/proxy/articles',
    url: `/internal/collections/${collection_id}/items?${createQuery(query)}`
  })

export const setChosen = (collection_id, item_id, data) =>
  Http({
    method: 'PATCH',
    basePath: '/proxy/articles',
    url: `/internal/collections/${collection_id}/items/${item_id}/set-carefully-chosen`,
    data: data
  })

export const setTop = (collection_id, item_id, data) =>
  Http({
    method: 'PATCH',
    basePath: '/proxy/articles',
    url: `/internal/collections/${collection_id}/items/${item_id}/set-top`,
    data: data
  })

export const setOnline = (collection_id, item_id, data) =>
  Http({
    method: 'PATCH',
    basePath: '/proxy/articles',
    url: `/internal/collections/${collection_id}/items/${item_id}/set-online`,
    data: data
  })

export const deleteItem = (collection_id, item_id) =>
  Http({
    method: 'DELETE',
    basePath: '/proxy/articles',
    url: `/internal/collections/${collection_id}/items/${item_id}`
  })

export const addTopic = data =>
  Http({
    method: 'POST',
    basePath: '/proxy/articles',
    url: `/internal/collections`,
    data: data
  })

export const updateTopic = (collection_id, data) =>
  Http({
    method: 'PUT',
    basePath: '/proxy/articles',
    url: `/internal/collections/${collection_id}`,
    data: data
  })

export const topicDetail = collection_id =>
  Http({
    method: 'GET',
    basePath: '/proxy/articles',
    url: `/internal/collections/${collection_id}`
  })
