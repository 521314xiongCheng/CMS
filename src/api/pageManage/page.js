import Http from '../http'
import { createQuery } from '../../utility/index'

export const getPages = params =>
  Http({
    method: 'GET',
    url: `pages?appName=${params.appName}`
  })

export const savePage = params =>
  Http({
    method: 'POST',
    url: `page`,
    data: params
  })

export const getModuleDetail = params =>
  Http({
    method: 'GET',
    url: `pagemodule/${params.moduleId}`
  })

export const getModules = params =>
  Http({
    method: 'GET',
    url: `pagemodules/${params.pageId}`
  })

export const saveModule = params =>
  Http({
    method: 'POST',
    url: 'pagemodule',
    data: params
  })

export const updateModule = params =>
  Http({
    method: 'PUT',
    url: 'pagemodule',
    data: params
  })

export const searchArticle = params =>
  Http({
    method: 'GET',
    url: `publish/articles?pageSize=${params.pageSize}&publishState=1&pageNo=${params.pageNo}&title=${params.title}&id=${params.id}&clientId=${params.clientId}`
  })
export const searchBanners = params =>
  Http({
    method: 'GET',
    url: `banners?pageSize=${params.pageSize}&pageNo=${params.pageNo}&title=${params.title}&bannerId=${params.id}`
  })

export const searchProductsAndSKUs = params =>
  Http({
    method: 'POST',
    url: `moduleresource/search`,
    data: params
  })

export const getBannerDetail = params =>
  Http({
    method: 'GET',
    url: `banner/${params}`
  })

export const searchClients = () =>
  Http({
    method: 'GET',
    url: `system/clients?state=1`
  })

export const getCMSArticleInfo = articleId =>
  Http({
    method: 'GET',
    url: `articles/${articleId}/details`
  })

export const saveModuleResource = params =>
  Http({
    method: 'POST',
    url: `moduleresource`,
    data: params
  })

export const editModuleResource = params =>
  Http({
    method: 'PUT',
    url: `moduleresource`,
    data: params
  })

export const moduleAllResource = params =>
  Http({
    method: 'GET',
    url: `moduleresources?${createQuery(params)}`,
    data: params
  })

export const sortModuleResource = params =>
  Http({
    method: 'POST',
    url: `moduleresource/sort`,
    data: params
  })

export const delModuleResource = params =>
  Http({
    method: 'DELETE',
    url: `moduleresource/${params.resourceId}`,
    data: params
  })

export const publishModule = params =>
  Http({
    method: 'POST',
    url: `pagemodule/publish/${params.moduleId}`
  })
