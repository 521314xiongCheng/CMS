import Http from '../http.js'

export const getTeams = params =>
  Http({
    method: 'GET',
    basePath: '/proxy/staffConsultant/',
    url: `teams?${params}`
    // url: `mock/452/v2/teams`,
  })

export const getCountDetail = (contactId, params) =>
  Http({
    method: 'GET',
    basePath: '/proxy/staffConsultant/',
    url: `staffconsultants/${contactId}/relationship?${params}`
    // url: `mock/452/v2/staffconsultants/${contactId}/relation?${params}`,
  })

export const saveEdit = (contactId, params) =>
  Http({
    method: 'POST',
    basePath: '/proxy/staffConsultant/',
    url: `staffconsultants/${contactId}/relationship`,
    // url: `mock/452/v2/staffconsultants/${contactId}/relation`,
    data: params
  })

export const getPages = contactId =>
  Http({
    method: 'GET',
    basePath: '/proxy/staffConsultant/',
    url: `staffconsultants/${contactId}/consultants`
  })
