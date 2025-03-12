import request from './request'

// 用户模块API
export const userApi = {
  login: (data) => request.post('/user/login', data),
  getUserInfo: () => request.get('/user/info'),
  updateProfile: (data) => request.put('/user/profile', data)
}

// 商品模块API
export const productApi = {
  getList: (page) => request.get('/products', { page }),
  getDetail: (id) => request.get(`/products/${id}`),
  createProduct: (data) => request.post('/products', data)
}

// 订单模块API
export const orderApi = {
  createOrder: (data) => request.post('/orders', data),
  getOrderList: (status) => request.get('/orders', { status }),
  cancelOrder: (id) => request.delete(`/orders/${id}`)
}

// 添加请求拦截器
request.addInterceptor('request', (config) => {
  const token = wx.getStorageSync('token')
  if (token) {
    config.header.Authorization = `Bearer ${token}`
  }
  return config
})

// 添加响应拦截器
request.addInterceptor('response', (response) => {
  if (response.data.code === 401) {
    wx.navigateTo({ url: '/pages/login/index' })
  }
  return response
})