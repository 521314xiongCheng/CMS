import Http from '../http.js'
import { createQuery } from '../../utility/index'

export const getActivities = params =>
  Http({
    method: 'GET',
    url: `library/activities?${createQuery(params)}`
  })

export const getActivityDetail = activityId =>
  Http({
    method: 'GET',
    url: `library/activities/${activityId}`
  })

export const addActivity = params =>
  Http({
    method: 'POST',
    url: `library/activities`,
    data: params
  })

export const updateActivity = (activityId, params) =>
  Http({
    method: 'PUT',
    url: `library/activities/${activityId}`,
    data: params
  })

export const delActivity = activityId =>
  Http({
    method: 'DELETE',
    url: `library/activities/${activityId}`
  })
