Page({
  data: {
    keyword: '',
    productList: []
  },

  onLoad() {
    // 模拟数据
    this.setData({
      productList: [
        {
          id: 1,
          name: '农夫山泉饮用天然水',
          spec: '380ml',
          price: 2,
          quantity: 1,
          image: '/assets/images/store.png'
        },
        {
          id: 2,
          name: '农夫山泉饮用水',
          spec: '550ml',
          price: 3,
          quantity: 1,
          image: '/assets/images/store.png'
        },
        {
          id: 3,
          name: '可口可乐',
          spec: '330ml',
          price: 3.5,
          quantity: 1,
          image: '/assets/images/store.png'
        },
        {
          id: 4,
          name: '百事可乐',
          spec: '330ml',
          price: 3.5,
          quantity: 1,
          image: '/assets/images/store.png'
        },
        {
          id: 5,
          name: '雪碧',
          spec: '330ml',
          price: 3,
          quantity: 1,
          image: '/assets/images/store.png'
        },
        {
          id: 6,
          name: '芬达',
          spec: '330ml',
          price: 3,
          quantity: 1,
          image: '/assets/images/store.png'
        },
        {
          id: 7,
          name: '红牛功能饮料',
          spec: '250ml',
          price: 6,
          quantity: 1,
          image: '/assets/images/store.png'
        }
      ]
    });
  },

  onInput(e) {
    this.setData({
      keyword: e.detail.value
    });
  },

  clearKeyword() {
    this.setData({
      keyword: ''
    });
  },

  onSearch() {
    // 实现搜索逻辑
    const keyword = this.data.keyword.trim();
    if (!keyword) {
      wx.showToast({
        title: '请输入搜索关键词',
        icon: 'none'
      });
      return;
    }
    // TODO: 调用搜索API
  },

  increaseQuantity(e) {
    const index = e.currentTarget.dataset.index;
    const product = this.data.productList[index];
    product.quantity += 1;
    this.setData({
      [`productList[${index}].quantity`]: product.quantity
    });
  },

  decreaseQuantity(e) {
    const index = e.currentTarget.dataset.index;
    const product = this.data.productList[index];
    if (product.quantity > 1) {
      product.quantity -= 1;
      this.setData({
        [`productList[${index}].quantity`]: product.quantity
      });
    }
  },

  addToCart(e) {
    const index = e.currentTarget.dataset.index;
    const product = this.data.productList[index];
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    });
  },

  buyNow(e) {
    const index = e.currentTarget.dataset.index;
    const product = this.data.productList[index];
    // TODO: 实现立即购买逻辑
  }
})