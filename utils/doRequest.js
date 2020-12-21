import request from 'request'

export const doRequest = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    request(url, options, (error, res, body) =>
      !error && res.statusCode == 200 ? resolve(body) : reject(error)
    )
  })
}
