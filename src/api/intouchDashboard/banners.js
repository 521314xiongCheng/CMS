import Http from '../http.js'
import { createQuery } from '../../utility/index'
export const getBanners = params =>
  Http({
    method: 'GET',
    url: `xxxxxxx-dashboard/banners?${createQuery(params)}`
  })

export const addBanner = params =>
  Http({
    method: 'POST',
    url: `xxxxxxx-dashboard/banners`,
    data: params
  })

export const updateBanner = (bannerId, params) =>
  Http({
    method: 'PUT',
    url: `xxxxxxx-dashboard/banners/${bannerId}`,
    data: params
  })

export const delBanner = bannerId =>
  Http({
    method: 'DELETE',
    url: `xxxxxxx-dashboard/banners/${bannerId}`
  })

export const sortBanners = data =>
  Http({
    method: 'POST',
    url: `xxxxxxx-dashboard/banners/sort/update`,
    data: data
  })
