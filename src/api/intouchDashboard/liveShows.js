import Http from '../http.js'
import { createQuery } from '../../utility/index'
export const getLiveShows = params =>
  Http({
    method: 'GET',
    url: `xxxxxxx-dashboard/liveshows?${createQuery(params)}`
  })

export const addLiveShow = data =>
  Http({
    method: 'POST',
    url: `xxxxxxx-dashboard/liveshows`,
    data: data
  })

export const updateLiveShow = (liveShowId, data) =>
  Http({
    method: 'PUT',
    url: `xxxxxxx-dashboard/liveshows/${liveShowId}`,
    data: data
  })

export const delLiveShow = liveShowId =>
  Http({
    method: 'DELETE',
    url: `xxxxxxx-dashboard/liveshows/${liveShowId}`
  })

export const sortLiveShow = data =>
  Http({
    method: 'POST',
    url: `xxxxxxx-dashboard/liveshows/sort/update`,
    data: data
  })
