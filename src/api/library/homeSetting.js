import Http from '../http.js'

export const getHomeSetting = () =>
  Http({
    method: 'GET',
    url: `library/dashboards`
  })

export const addHomeSetting = data =>
  Http({
    method: 'POST',
    url: `library/dashboards`,
    data: data
  })

export const updateHomeSetting = (dashboardId, data) =>
  Http({
    method: 'PUT',
    url: `library/dashboards/${dashboardId}`,
    data: data
  })

export const getCategorySelect = () =>
  Http({
    method: 'GET',
    url: `library/categories/dashboard`
  })

export const delHomeSetting = dashboardId =>
  Http({
    method: 'DELETE',
    url: `library/dashboards/${dashboardId}`
  })

export const sortHomeSetting = data =>
  Http({
    method: 'POST',
    url: `library/dashboards/sort`,
    data: data
  })
