import Http from '../http'

export const getArticles = params =>
  Http({
    method: 'GET',
    basePath: '/proxy/articles',
    url: `/internal/articles?page_num=${params.page_num}&page_size=${params.page_size}&keyword=${params.keyword}`
  })
export const getArticlesById = id =>
  Http({
    method: 'GET',
    basePath: '/proxy/articles',
    url: `/internal/articles/${id}`
  })
export const addArticle = params =>
  Http({
    method: 'POST',
    basePath: '/proxy/articles',
    url: `/internal/articles`,
    data: params
  })
export const updateArticle = (params, id) =>
  Http({
    method: 'PUT',
    basePath: '/proxy/articles',
    url: `/internal/articles/${id}`,
    data: params
  })
export const publishArticle = (params, id) =>
  Http({
    method: 'PUT',
    basePath: '/proxy/articles',
    url: `/internal/articles/${id}/publish`,
    data: params
  })
export const deleteArticle = id =>
  Http({
    method: 'DELETE',
    basePath: '/proxy/articles',
    url: `/internal/articles/${id}`
  })
