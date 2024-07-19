import Http from '../http.js'
import { createQuery } from '../../utility/index'
export const getLibraries = params =>
  Http({
    method: 'GET',
    url: `xxxxxxx-dashboard/library-contents?${createQuery(params)}`
  })

export const createLibrary = params =>
  Http({
    method: 'POST',
    url: `xxxxxxx-dashboard/library-contents`,
    data: params
  })

export const updateLibrary = (libraryId, params) =>
  Http({
    method: 'PUT',
    url: `xxxxxxx-dashboard/library-contents/${libraryId}`,
    data: params
  })

export const delLibraryById = libraryId =>
  Http({
    method: 'DELETE',
    url: `xxxxxxx-dashboard/library-contents/${libraryId}`
  })

export const sortLibrary = data =>
  Http({
    method: 'POST',
    url: `xxxxxxx-dashboard/library-contents/sort/update`,
    data: data
  })
