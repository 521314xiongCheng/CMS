import Http from '../../http'
import { createQuery } from '../../../utility/index'

export const getList = params =>
  Http({
    method: 'GET',
    url: `diagnose/page-list?${createQuery(params)}`
  })
export const addInquiry = params =>
  Http({
    method: 'POST',
    url: `diagnose/add`,
    data: params
  })

export const publishInquiry = id =>
  Http({
    method: 'PUT',
    url: `diagnose/deploy/${id}`
  })

export const unPublishInquiry = id =>
  Http({
    method: 'PUT',
    url: `diagnose/undeploy/${id}`
  })
// https://mock.xxxxxxx.com.cn/mock/137/v1/diagnose/update
export const updateInquiry = params =>
  Http({
    method: 'PUT',
    url: `diagnose/update`,
    data: params
  })

export const exportInquiry = id =>
  Http({
    headers: { filename: 'utf-8' },
    method: 'GET',
    url: `diagnose/export/${id}`,
    responseType: 'arraybuffer'
  })

export const addQuestion = params =>
  Http({
    method: 'POST',
    url: `diagnose/add-question`,
    data: params
  })
export const delQuestion = diagnoseQuestionId =>
  Http({
    method: 'DELETE',
    url: `diagnose/del-question/${diagnoseQuestionId}`
  })
export const delInquiry = onlineDiagnoseId =>
  Http({
    method: 'DELETE',
    url: `diagnose/${onlineDiagnoseId}`
  })

export const getQuestions = onlineDiagnoseId =>
  Http({
    method: 'GET',
    url: `diagnose/questions/${onlineDiagnoseId}`
  })

export const delBGC = bgcId =>
  Http({
    method: 'DELETE',
    url: `bgcs/${bgcId}`
  })
