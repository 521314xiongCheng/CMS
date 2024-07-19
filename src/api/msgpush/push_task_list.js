import Http from '../http'
import { createQuery } from '../../utility/index'
export const get = params =>
  Http({
    method: 'GET',
    url: `msgpush/batchpushs?${createQuery(params)}`
  })

export const getDetail = params =>
  Http({
    method: 'GET',
    url: `msgpush/batchpush/${params.id}`
  })

export const add = params =>
  Http({
    method: 'POST',
    url: 'msgpush/batchpushtask',
    data: params.data
  })

export const edit = params =>
  Http({
    method: 'PUT',
    url: 'msgpush/batchpushtask',
    data: params.data
  })

export const pushMsgNow = params =>
  Http({
    method: 'POST',
    url: 'msgpush/pushnow/' + params.id,
    data: {}
  })
