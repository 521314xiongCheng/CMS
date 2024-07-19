import Http from '../http.js'
import { createQuery } from '../../utility/index'
export const getGoodsIndex = () =>
  Http({
    method: 'GET',
    url: `xxxxxxx-dashboard/product-categories`
  })

export const getGoods = (seqId, params) =>
  Http({
    method: 'GET',
    url: `xxxxxxx-dashboard/product-categories/${seqId}?${createQuery(params)}`
  })

export const addGood = params =>
  Http({
    method: 'POST',
    url: `xxxxxxx-dashboard/product-category`,
    data: params,
    NoErrNotify: true
  })

export const updateGood = (goodsId, params) =>
  Http({
    method: 'PUT',
    url: `xxxxxxx-dashboard/product-categories/${goodsId}`,
    data: params,
    NoErrNotify: true
  })

export const delGood = goodsId =>
  Http({
    method: 'DELETE',
    url: `xxxxxxx-dashboard/product-categories/${goodsId}`
  })
