import Http from '../../http'
import { createQuery } from '../../../utility/index'

export const getList = params =>
  Http({
    method: 'GET',
    url: `bgcs?${createQuery(params)}`
  })

export const publishBgc = bgcId =>
  Http({
    method: 'PUT',
    url: `bgcs/${bgcId}/publish`
  })

export const delBGC = bgcId =>
  Http({
    method: 'DELETE',
    url: `bgcs/${bgcId}`
  })

export const addBGC = params =>
  Http({
    method: 'POST',
    url: `bgcs`,
    data: params
  })
//v1/bgcs/{bgcId}
export const editBGC = params =>
  Http({
    method: 'PUT',
    url: `bgcs/${params.id}`,
    data: params
  })
