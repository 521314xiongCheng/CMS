import Http from '../http'

export const getCategoryProducts = () =>
  Http({
    method: 'GET',
    basePath: '/proxy/dashboard',
    url: `/category_products/list`
  })

export const addCategory = params =>
  Http({
    method: 'POST',
    basePath: '/proxy/dashboard',
    url: `/category_products`,
    data: params
  })

export const updateCategory = (id, params) =>
  Http({
    method: 'PUT',
    basePath: '/proxy/dashboard',
    url: `/category_products/${id}`,
    data: params
  })

export const updateStatus = (id, params) =>
  Http({
    method: 'PUT',
    basePath: '/proxy/dashboard',
    url: `/category_products/${id}/status`,
    data: params
  })

export const deleteCategoryById = id =>
  Http({
    method: 'DELETE',
    basePath: '/proxy/dashboard',
    url: `/category_products/${id}`
  })

export const getProducts = id =>
  Http({
    method: 'GET',
    basePath: '/proxy/dashboard',
    url: `/category_products/${id}`
  })

export const addProduct = (id, params) =>
  Http({
    method: 'POST',
    basePath: '/proxy/dashboard',
    url: `/category_products/${id}/product`,
    data: params
  })

export const updateProduct = (id, params) =>
  Http({
    method: 'PUT',
    basePath: '/proxy/dashboard',
    url: `/category_products/product/${id}`,
    data: params
  })

export const deleteProductById = id =>
  Http({
    method: 'DELETE',
    basePath: '/proxy/dashboard',
    url: `/category_products/product/${id}`
  })
