import Http from '../http'

export const getCategoryGroups = () =>
  Http({
    method: 'GET',
    basePath: '/proxy/dashboard',
    url: `/category_group/list`
  })

export const addCategoryGroup = params =>
  Http({
    method: 'POST',
    basePath: '/proxy/dashboard',
    url: `/category_group`,
    data: params
  })

export const updateCategoryGroup = (id, params) =>
  Http({
    method: 'PUT',
    basePath: '/proxy/dashboard',
    url: `/category_group/${id}`,
    data: params
  })

export const updateStatus = (id, params) =>
  Http({
    method: 'PUT',
    basePath: '/proxy/dashboard',
    url: `/category_group/${id}/status`,
    data: params
  })

export const deleteCategoryGroupById = id =>
  Http({
    method: 'DELETE',
    basePath: '/proxy/dashboard',
    url: `/category_group/${id}`
  })

export const getCategoriesByGroupId = id =>
  Http({
    method: 'GET',
    basePath: '/proxy/dashboard',
    url: `/category_group/${id}`
  })

export const addCategory = (id, params) =>
  Http({
    method: 'POST',
    basePath: '/proxy/dashboard',
    url: `/category_group/${id}/category`,
    data: params
  })

export const updateCategory = (id, params) =>
  Http({
    method: 'PUT',
    basePath: '/proxy/dashboard',
    url: `/category_group/category/${id}`,
    data: params
  })

export const deleteCategoryById = id =>
  Http({
    method: 'DELETE',
    basePath: '/proxy/dashboard',
    url: `/category_group/category/${id}`
  })
