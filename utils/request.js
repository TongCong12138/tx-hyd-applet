const BASE_URL = 'https://your-api-domain.com'

class WxRequest {
  constructor() {
    this.interceptors = {
      request: [],
      response: []
    }
  }

  _request(method, url, data, header = {}) {
    return new Promise((resolve, reject) => {
      let requestConfig = this._runInterceptors({
        url: `${BASE_URL}${url}`,
        method,
        data,
        header: {
          'content-type': 'application/json',
          ...header
        }
      }, 'request')

      wx.showLoading({ title: '加载中...' })

      wx.request({
        ...requestConfig,
        success: (res) => {
          const processedRes = this._runInterceptors(res, 'response')
          if (res.statusCode === 200) {
            resolve(processedRes.data)
          } else {
            reject(this._handleError(res))
          }
        },
        fail: (err) => reject(this._handleError(err)),
        complete: () => wx.hideLoading()
      })
    })
  }

  _runInterceptors(config, type) {
    let currentConfig = config
    this.interceptors[type].forEach(interceptor => {
      currentConfig = interceptor(currentConfig)
    })
    return currentConfig
  }

  _handleError(error) {
    const errorMap = {
      400: '请求参数错误',
      401: '登录过期',
      404: '资源不存在',
      500: '服务器错误'
    }
    return {
      code: error.statusCode || -1,
      message: error.errMsg || errorMap[error.statusCode] || '网络异常'
    }
  }

  get(url, data) { return this._request('GET', url, data) }
  post(url, data) { return this._request('POST', url, data) }
  put(url, data) { return this._request('PUT', url, data) }
  delete(url, data) { return this._request('DELETE', url, data) }

  addInterceptor(type, interceptor) {
    this.interceptors[type].push(interceptor)
  }
}

export default new WxRequest()