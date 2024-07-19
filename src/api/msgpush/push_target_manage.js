import Http from '../http'
import { createQuery } from '../../utility/index'

export const get = params =>
  Http({
    method: 'GET',
    url: `msgpush/groups?${createQuery(params)}`
  })
export const getDetail = params =>
  Http({
    method: 'GET',
    url: `msgpush/group/${params.id}`
  })

export const add = params =>
  Http({
    method: 'POST',
    url: 'msgpush/group',
    data: params.data
  })

export const edit = params =>
  Http({
    method: 'PUT',
    url: 'msgpush/group',
    data: params.data
  })

export const getSelect = params =>
  Http({
    method: 'GET',
    url: `msgpush/groups/easy?${createQuery(params)}`
  })

export const uploads = params =>
  Http({
    method: 'POST',
    url: 'msgpush/group/upload',
    data: params
  })

export const rules = params =>
  Http({
    method: 'PUT',
    url: 'msgpush/group/rules',
    data: params
  })

export const getCMSArticleInfo = articleId =>
  Http({
    method: 'GET',
    url: `articles/${articleId}/details`
  })

export const getCMSArticlePublish = async articleId =>
  Http({
    method: 'GET',
    url: `publish/articles?id=${articleId}&clientId=5`
  })
