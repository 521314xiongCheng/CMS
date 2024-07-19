import Http from '../http'
import { createQuery } from '../../utility/index'
export const get = params =>
  Http({
    method: 'GET',
    url: `types?${createQuery(params)}`
  })

export const add = params =>
  Http({
    method: 'POST',
    url: 'type',
    data: params.data,
    headers: {
      username: encodeURIComponent(params.username)
    }
  })

// export const del = params => Http({
//   method: 'DELETE',
//   url: `activities/${params.id}`,
// })

export const edit = params =>
  Http({
    method: 'PUT',
    url: `type/${params.id}`,
    data: params.data,
    headers: {
      username: encodeURIComponent(params.username)
    }
  })
