Page({
  data: {
    addressList: []
  },

  onLoad() {
    // 页面加载时获取地址列表
    this.getAddressList()
  },

  getAddressList() {
    // 这里可以调用后端接口获取地址列表
    // 暂时使用模拟数据
    this.setData({
      addressList: []
    })
  },

  addNewAddress() {
    wx.navigateTo({
      url: '/pages/add-address/add-address'
    })
  }
})