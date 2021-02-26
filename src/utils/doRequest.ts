import request, { Response } from 'request'

export const doRequest = (uri: string, options: request.CoreOptions = {}) => {
  return new Promise((resolve, reject) => {
    request(uri, options, (error, res: Response, body) =>
      !error && res.statusCode == 200 ? resolve(body) : reject(error)
    )
  })
}
