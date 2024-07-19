import Http from '../http.js'

export const getCategories = () =>
  Http({
    method: 'GET',
    basePath: '/proxy/catalog/',
    url: `internal/catalogs/list`
  })

export const onlineCategory = (id, params) =>
  Http({
    method: 'POST',
    basePath: '/proxy/catalog/',
    url: `category/${id}/online`,
    data: params
  })

export const getCategorysById = id =>
  Http({
    method: 'GET',
    basePath: '/proxy/catalog/',
    url: `internal/catalogs/${id}/categories`
  })

export const createCategory = params =>
  Http({
    method: 'POST',
    basePath: '/proxy/catalog/',
    url: `internal/category`,
    data: params
  })

export const getCategoryDetailById = id =>
  Http({
    method: 'GET',
    basePath: '/proxy/catalog/',
    url: `internal/categories/${id}`
  })

export const publishCatalog = (id, params) =>
  Http({
    method: 'POST',
    basePath: '/proxy/catalog/',
    url: `internal/catalogs/${id}/publish`,
    data: params
  })

export const updateCategory = (cid, params) =>
  Http({
    method: 'PUT',
    basePath: '/proxy/catalog/',
    url: `internal/categories/${cid}`,
    data: params
  })

export const delCategoryById = cid =>
  Http({
    method: 'DELETE',
    basePath: '/proxy/catalog/',
    url: `internal/categories/${cid}`
  })

export const sortCategory = (cid, data) =>
  Http({
    method: 'PUT',
    basePath: '/proxy/catalog/',
    url: `internal/categories/${cid}/reorg`,
    data: data
  })

export const copyCategory = (cid, data) =>
  Http({
    method: 'POST',
    basePath: '/proxy/catalog/',
    url: `internal/categories/${cid}/duplicate`,
    data: data
  })

export const categoryProducts = id =>
  Http({
    method: 'GET',
    basePath: '/proxy/catalog/',
    url: `internal/categories/${id}/skus`
  })

export const addProducts = (cid, data) =>
  Http({
    method: 'POST',
    basePath: '/proxy/catalog/',
    url: `internal/categories/${cid}/skus`,
    data: data,
    NoNotify: true
  })

export const deleteProduct = (cid, id) =>
  Http({
    method: 'DELETE',
    basePath: '/proxy/catalog/',
    url: `internal/categories/${cid}/sku/${id}`
  })

export const delAllProducts = cid =>
  Http({
    method: 'DELETE',
    basePath: '/proxy/catalog/',
    url: `internal/categories/${cid}/skus`
  })

export const sortProducts = (cid, data) =>
  Http({
    method: 'PUT',
    basePath: '/proxy/catalog/',
    url: `internal/categories/${cid}/skus/sort`,
    data: data
  })

export const exportCatalogs = id =>
  Http({
    method: 'GET',
    basePath: '/proxy/catalog/',
    url: `internal/catalogs/${id}/csv`,
    responseType: 'arraybuffer'
  })
