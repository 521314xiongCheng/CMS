/* eslint-disable prettier/prettier */
import Http from '../http'
import { readUserInfo, createQuery } from '../../utility/index'
export const getDepartmentList = params =>
    Http({
        method: 'GET',
        basePath: '/proxy/entWechat',
        url: `/departments/list?${createQuery(params)}`
    })
export const addDepartment = params =>
    Http({
        method: 'POST',
        basePath: '/proxy/entWechat',
        url: `/departments/create`,
        data: params,
        headers: { 'x-operation-user': readUserInfo().email }
    })
export const updateDepartment = (params) =>
    Http({
        method: 'PUT',
        basePath: '/proxy/entWechat',
        url: `/departments/update`,
        data: params,
        headers: { 'x-operation-user': readUserInfo().email }
    })
export const deleteDepartment = (id) =>
    Http({
        method: 'DELETE',
        basePath: '/proxy/entWechat',
        url: `/departments/${id}`,
        headers: { 'x-operation-user': readUserInfo().email }
    })

export const getEmployeeList = (params) =>
    Http({
        method: 'GET',
        basePath: '/proxy/entWechat',
        url: `/employees/list?${createQuery(params)}`,
    })
export const addEmployee = params =>
    Http({
        method: 'POST',
        basePath: '/proxy/entWechat',
        url: `/employees/create`,
        data: params,
        headers: { 'x-operation-user': readUserInfo().email }
    })
export const updateEmployee = (params) =>
    Http({
        method: 'PUT',
        basePath: '/proxy/entWechat',
        url: `/employees/update`,
        data: params,
        headers: { 'x-operation-user': readUserInfo().email }
    })
export const deleteEmployee = (params) =>
    Http({
        method: 'DELETE',
        basePath: '/proxy/entWechat',
        url: `/employees/batchdelete`,
        data: params,
        headers: { 'x-operation-user': readUserInfo().email }
    })
export const getEmployeeById = (params) =>
    Http({
        method: 'GET',
        basePath: '/proxy/entWechat',
        url: `/employees?${createQuery(params)}`,
    })
export const exportEmployees = (params) =>
    Http({
        method: 'GET',
        basePath: '/proxy/entWechat',
        url: `/employees/export?${createQuery(params)}`,
        responseType: 'blob'
    })

export const importEmployees = (params) =>
    Http({
        method: 'POST',
        basePath: '/proxy/entWechat',
        url: `/employees/import?${createQuery(params)}`,
        headers: { 'x-operation-user': readUserInfo().email }
    })
export const changeUserDepartment = (params) =>
    Http({
        method: 'PUT',
        basePath: '/proxy/entWechat',
        url: `/employees/change-department`,
        data: params,
        headers: { 'x-operation-user': readUserInfo().email }
    })
    export const inviteUser = (params) =>
    Http({
        method: 'POST',
        basePath: '/proxy/entWechat',
        url: `/employees/invite`,
        data: params,
        headers: { 'x-operation-user': readUserInfo().email }
    })
    export const getUploadList = (params) =>
    Http({
        method: 'GET',
        basePath: '/proxy/entWechat',
        url: `/employees/upload-list?${createQuery(params)}`
    })