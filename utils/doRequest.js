import request from 'request'

export const doRequest = (url) => {
  return new Promise((resolve, reject) => {
    request(url, (error, res, body) => {
      if (!error && res.statusCode == 200) {
        resolve(body)
      } else {
        reject(error)
      }
    })
  })
}
