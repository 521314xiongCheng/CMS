import Http from '../http.js'
import { createQuery } from '../../utility/index'

export const getLogs = params =>
  Http({
    method: 'GET',
    basePath: '/proxy/product/',
    url: `internal/logs/publish?${createQuery(params)}`
  })
