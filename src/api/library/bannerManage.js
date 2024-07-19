import Http from '../http.js'
import { createQuery } from '../../utility/index'

export const getBanners = params =>
  Http({
    method: 'GET',
    url: `library/banners?${createQuery(params)}`
  })

export const addBanner = params =>
  Http({
    method: 'POST',
    url: `library/banners`,
    data: params
  })

export const updateBanner = (bannerId, params) =>
  Http({
    method: 'PUT',
    url: `library/banners/${bannerId}`,
    data: params
  })

export const delBanner = bannerId =>
  Http({
    method: 'DELETE',
    url: `library/banners/${bannerId}`
  })

export const sortBanners = data =>
  Http({
    method: 'POST',
    url: `library/banners/sort`,
    data: data
  })
