Page({
  data: {
    currentCategory: 0,
    statusBarHeight: 20,
    categories: [
      { id: 1, name: '饮用水' },
      { id: 2, name: '碳酸饮料' },
      { id: 3, name: '功能饮料' },
      { id: 4, name: '茶饮料' },
      { id: 5, name: '果汁饮料' },
      { id: 6, name: '咖啡饮料' },
      { id: 7, name: '乳制品' },
      { id: 8, name: '植物蛋白饮料' },
      { id: 9, name: '运动饮料' },
      { id: 10, name: '含酒精饮料' }
    ],
    currentProducts: [],
    productsByCategory: {
      0: Array(10).fill().map((_, i) => ({
        id: i + 1,
        name: ['农夫山泉', '恒大冰泉', '怡宝', '百岁山', '景田'][i % 5] + '饮用水',
        spec: ['380ml', '550ml', '1.5L'][i % 3],
        price: Math.floor(Math.random() * 3) + 2,
        quantity: 1,
        originalPrice: Math.floor(Math.random() * 3) + 8,
        image: '/assets/images/store.png'
      })),
      1: Array(8).fill().map((_, i) => ({
        id: 100 + i,
        name: ['可口可乐', '百事可乐', '雪碧', '芬达', '七喜'][i % 5] + (i > 4 ? '无糖' : ''),
        spec: ['330ml', '500ml', '2L'][i % 3],
        price: Math.floor(Math.random() * 2) + 3,
        quantity: 1,
        image: '/assets/images/store.png'
      })),
      2: Array(6).fill().map((_, i) => ({
        id: 200 + i,
        name: ['红牛', '魔爪', '体质能量', '东鹏特饮'][i % 4],
        spec: ['250ml', '330ml'][i % 2],
        price: Math.floor(Math.random() * 3) + 5,
        quantity: 1,
        image: '/assets/images/store.png'
      }))
    }
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync();
    const navBarHeight = 44; // 导航栏固定高度
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      navTotalHeight: systemInfo.statusBarHeight + navBarHeight
    });

    // 初始化显示第一个分类的商品
    this.setData({
      currentProducts: this.data.productsByCategory[0] || []
    });
  },

  goToSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },

  switchCategory(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentCategory: index,
      currentProducts: this.data.productsByCategory[index] || []
    });
  },

  increaseQuantity(e) {
    const index = e.currentTarget.dataset.index;
    const product = this.data.currentProducts[index];
    product.quantity += 1;
    this.setData({
      [`currentProducts[${index}].quantity`]: product.quantity
    });
  },

  decreaseQuantity(e) {
    const index = e.currentTarget.dataset.index;
    const product = this.data.currentProducts[index];
    if (product.quantity > 1) {
      product.quantity -= 1;
      this.setData({
        [`currentProducts[${index}].quantity`]: product.quantity
      });
    }
  },

  addToCart(e) {
    const index = e.currentTarget.dataset.index;
    const product = this.data.currentProducts[index];
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    });
  },

  buyNow(e) {
    const index = e.currentTarget.dataset.index;
    const product = this.data.currentProducts[index];
    // TODO: 实现立即购买逻辑
  }
})