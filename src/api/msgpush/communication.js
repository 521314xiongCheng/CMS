import Http from '../http'
export const getMessage = id =>
  Http({
    method: 'GET',
    basePath: '/proxy/xxxxxxx',
    url: `/communication/v1/management/messages/${id}`
  })

export const addMessage = params =>
  Http({
    method: 'POST',
    basePath: '/proxy/xxxxxxx',
    url: `/communication/v1/management/message`,
    data: params
  })

export const editMessage = params =>
  Http({
    method: 'PUT',
    basePath: '/proxy/xxxxxxx',
    url: `/communication/v1/management/messages/${params.message_id}`,
    data: params
  })

export const publishMessage = params =>
  Http({
    method: 'PUT',
    basePath: '/proxy/xxxxxxx',
    url: `/communication/v1/management/messages/publish/${params.message_id}?operator=${params.operator}`
  })

export const deleteMessage = params =>
  Http({
    method: 'DELETE',
    basePath: '/proxy/xxxxxxx',
    url: `/communication/v1/management/message/${params.message_id}?operator=${params.operator}`
  })

export const searchMessages = params =>
  Http({
    method: 'POST',
    basePath: '/proxy/xxxxxxx',
    url: `/communication/v1/management/messages/search`,
    data: params
  })
