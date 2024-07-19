/* eslint-disable prettier/prettier */
import Http from '../http'
import { readUserInfo, createQuery } from '../../utility/index'

export const getConsultantList = params =>
    Http({
      method: 'GET',
      basePath: '/proxy/entWechat',
      url: `/consultant/list?${createQuery(params)}`,
    })
  

export const syncConsultants = params =>
    Http({
      method: 'GET',
      basePath: '/proxy/entWechat',
      url: `/consultant/sync/${params.employeeId}?${createQuery(params)}`,
    })

export const getChanges = params =>
    Http({
        method: 'GET',
        basePath: '/proxy/entWechat',
        url: `/consultant/changes?${createQuery(params)}`,
    })

export const getChangeInfoList = params =>
    Http({
        method: 'GET',
        basePath: '/proxy/entWechat',
        url: `/consultant/change-info-list?${createQuery(params)}`,
    })

export const sendMessage = params =>
    Http({
        method: 'POST',
        basePath: '/proxy/entWechat',
        url: `/consultant/batch/message`,
        data: params,
        headers: { 'x-operation-user': readUserInfo().email }
    })

export const searchEmployees = params =>
    Http({
      method: 'GET',
      basePath: '/proxy/entWechat',
      url: `/employees/search?${createQuery(params)}`,
    })


export const getTaskStatus = params =>
    Http({
      method: 'GET',
      basePath: '/proxy/entWechat',
      url: `/consultant/task-status/${params.employeeId}?${createQuery(params)}`,
    })


