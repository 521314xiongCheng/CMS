import Http from '../http'
import { createQuery } from '../../utility/index'

export const getList = params =>
  Http({
    method: 'GET',
    basePath: '/proxy/weather',
    url: `/meteorologicalIndex?${createQuery(params)}`
  })
export const getWeatherIndex = params =>
  Http({
    method: 'GET',
    basePath: '/proxy/weather',
    url: `/meteorological?${createQuery(params)}`
    // url: `mock/288/v1/internal/meteorological`
  })

export const getExposeContent = id =>
  Http({
    method: 'GET',
    basePath: '/proxy/weather',
    url: `/meteorologicalIndex/${id}`
    // url: `mock/288/v1/internal/meteorologicalIndex/detail`
  })

export const addWeatherIndex = params =>
  Http({
    method: 'POST',
    basePath: '/proxy/weather',
    url: `/meteorologicalIndex`,
    data: params
  })

export const editWeatherIndex = (params, reference_id) =>
  Http({
    method: 'PUT',
    basePath: '/proxy/weather',
    url: `/meteorologicalIndex/${reference_id}`,
    data: params
  })

export const delWeatherIndex = reference_id =>
  Http({
    method: 'DELETE',
    basePath: '/proxy/weather',
    url: `/meteorologicalIndex/${reference_id}`
  })
