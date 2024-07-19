import Http from '../http'
import { createQuery } from '../../utility/index'
export const get = params =>
  Http({
    method: 'GET',
    url: `msgpush/singlepushs?${createQuery(params)}`
  })

export const getDetail = params =>
  Http({
    method: 'GET',
    url: `msgpush/singlepush/${params.id}`
  })

export const edit = params =>
  Http({
    method: 'PUT',
    url: 'msgpush/singlepushtask',
    data: params.data
  })
