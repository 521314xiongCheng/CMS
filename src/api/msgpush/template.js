import Http from '../http'
import { createQuery } from '../../utility/index'
export const get = params =>
  Http({
    method: 'GET',
    url: `msgpush/templates?${createQuery(params)}`
  })

export const edit = params =>
  Http({
    method: 'PUT',
    url: 'msgpush/templates',
    data: params.data
  })

export const add = params =>
  Http({
    method: 'POST',
    url: 'msgpush/templates',
    data: params.data
  })

// export const getTypes = async params =>
//   Http({
//     method: 'GET',
//     url: `msgpush/template/types?client=${params.client}&market=${
//       params.market
//     }`
//   })
