import Http from '../http.js'

export const clearIM = assess_token =>
  Http({
    method: 'POST',
    url: `/clearIM`,
    data: {
      assess_token
    }
  })
