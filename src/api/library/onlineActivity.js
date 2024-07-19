import Http from '../http.js'
import { createQuery } from '../../utility/index'

export const getCourses = params =>
  Http({
    method: 'GET',
    url: `library/courses?${createQuery(params)}`
  })

export const getCourseDetail = courseId =>
  Http({
    method: 'GET',
    url: `library/courses/${courseId}`
  })

export const addCourse = params =>
  Http({
    method: 'POST',
    url: `library/courses`,
    data: params
  })

export const updateCourse = (activityId, params) =>
  Http({
    method: 'PUT',
    url: `library/courses/${activityId}`,
    data: params
  })

export const delCourse = activityId =>
  Http({
    method: 'DELETE',
    url: `library/courses/${activityId}`
  })
