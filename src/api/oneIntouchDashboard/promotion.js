import Http from '../http'

export const getSales = () =>
  Http({
    method: 'GET',
    basePath: '/proxy/dashboard',
    url: `/sales/list`
  })

export const addSale = params =>
  Http({
    method: 'POST',
    basePath: '/proxy/dashboard',
    url: `/sales`,
    data: params
  })

export const updateSale = (id, params) =>
  Http({
    method: 'PUT',
    basePath: '/proxy/dashboard',
    url: `/sales/${id}`,
    data: params
  })

export const updateStatus = (id, params) =>
  Http({
    method: 'PUT',
    basePath: '/proxy/dashboard',
    url: `/sales/${id}/status`,
    data: params
  })

export const deleteSaleById = id =>
  Http({
    method: 'DELETE',
    basePath: '/proxy/dashboard',
    url: `/sales/${id}`
  })

export const getSaleProducts = id =>
  Http({
    method: 'GET',
    basePath: '/proxy/dashboard',
    url: `/sales/${id}`
  })

export const addProduct = (id, params) =>
  Http({
    method: 'POST',
    basePath: '/proxy/dashboard',
    url: `/sales/${id}/product`,
    data: params
  })

export const updateProduct = (id, params) =>
  Http({
    method: 'PUT',
    basePath: '/proxy/dashboard',
    url: `/sales/product/${id}`,
    data: params
  })

export const deleteProductById = id =>
  Http({
    method: 'DELETE',
    basePath: '/proxy/dashboard',
    url: `/sales/product/${id}`
  })
