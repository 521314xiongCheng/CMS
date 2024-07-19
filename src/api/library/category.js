import Http from '../http.js'

export const getCategories = () =>
  Http({
    method: 'GET',
    url: `library/categories`
  })

export const createCategory = params =>
  Http({
    method: 'POST',
    url: `library/categories`,
    data: params
  })

export const updateCategory = (categoryId, params) =>
  Http({
    method: 'PUT',
    url: `library/categories/${categoryId}`,
    data: params
  })

export const delCategoryById = categoryId =>
  Http({
    method: 'DELETE',
    url: `library/categories/${categoryId}`,
    NoNotify: true
  })

export const sortCategory = (categoryId, data) =>
  Http({
    method: 'PUT',
    url: `library/categories/${categoryId}/sort`,
    data: data
  })

export const categorySelect = categoryType =>
  Http({
    method: 'GET',
    url: `library/categories/select?categoryType=${categoryType}`
  })

export const pushCategory = (contentId, data) =>
  Http({
    method: 'PUT',
    url: `library/contents/${contentId}/push`,
    data: data
  })
