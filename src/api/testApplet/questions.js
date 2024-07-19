import Http from '../http'
import { createQuery } from '../../utility/index'

export const getFromRedis = params =>
  Http({
    method: 'GET',
    url: `templates/${params.type}?${createQuery(params)}`
  })

export const addToRedis = params =>
  Http({
    method: 'POST',
    url: `templates/${params.type}/upload`,
    data: params
  })

export const docToJson = params => {
  const formData = new FormData()
  formData.append('file', params.data)
  return Http({
    basePath: '/',
    method: 'POST',
    url: `doctojson`,
    params: {
      type: params.type
    },
    data: formData
  })
}
