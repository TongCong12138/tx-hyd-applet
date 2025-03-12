// pages/home/home.js
Page({
  data: {
    statusBarHeight: 20,
    isHeaderFixed: false,
    bannerList: [
      { imageUrl: '/assets/images/store.png' },
      { imageUrl: '/assets/images/store.png' },
      { imageUrl: '/assets/images/store.png' }
    ],
    hotProducts: [
      {
        id: 1,
        name: '农夫山泉桶装水18.9L',
        imageUrl: '/assets/images/store.png',
        specification: '18.9L/桶',
        price: 16.00,
        originalPrice: 19.00,
        quantity: 0
      },
      {
        id: 2,
        name: '怡宝纯净水4.5L*4桶',
        imageUrl: '/assets/images/store.png',
        specification: '4.5L*4桶/箱',
        price: 36.00,
        originalPrice: 42.00,
        quantity: 0
      },
      {
        id: 3,
        name: '景田百岁山天然矿泉水4L*4桶',
        imageUrl: '/assets/images/store.png',
        specification: '4L*4桶/箱',
        price: 45.00,
        quantity: 0
      },
      {
        id: 4,
        name: '屈臣氏蒸馏水8L*2桶',
        imageUrl: '/assets/images/store.png',
        specification: '8L*2桶/箱',
        price: 32.00,
        originalPrice: 38.00,
        quantity: 0
      },
      {
        id: 5,
        name: '恒大冰泉天然矿泉水5L*4桶',
        imageUrl: '/assets/images/store.png',
        specification: '5L*4桶/箱',
        price: 48.00,
        originalPrice: 56.00,
        quantity: 0
      },
      {
        id: 6,
        name: '乐百氏天然矿泉水4L*6桶',
        imageUrl: '/assets/images/store.png',
        specification: '4L*6桶/箱',
        price: 52.00,
        quantity: 0
      },
      {
        id: 7,
        name: '华润怡宝纯净水18.9L',
        imageUrl: '/assets/images/store.png',
        specification: '18.9L/桶',
        price: 18.00,
        originalPrice: 22.00,
        quantity: 0
      },
      {
        id: 8,
        name: '昆仑山天然矿泉水4L*4桶',
        imageUrl: '/assets/images/store.png',
        specification: '4L*4桶/箱',
        price: 42.00,
        originalPrice: 48.00,
        quantity: 0
      },
      {
        id: 9,
        name: '雀巢优活饮用水5L*4桶',
        imageUrl: '/assets/images/store.png',
        specification: '5L*4桶/箱',
        price: 38.00,
        quantity: 0
      }
    ]
  },

  onPageScroll(e) {
    const query = wx.createSelectorQuery();
    query.select('.hot-products').boundingClientRect((rect) => {
      if (rect) {
        const isHeaderFixed = rect.top <= 88;
        if (this.data.isHeaderFixed !== isHeaderFixed) {
          this.setData({
            isHeaderFixed: isHeaderFixed
          });
        }
      }
    }).exec();
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync();
    const navBarHeight = 44; // 导航栏固定高度
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      navTotalHeight: systemInfo.statusBarHeight + navBarHeight
    });
  },

  goToAddress() {
    wx.navigateTo({
      url: '/pages/address/address'
    });
  },

  goToWaterTicket() {
    // 跳转到水票购买页面
  },

  goToInvite() {
    // 跳转到邀请有礼页面
  },

  goToSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },

  goToProductDetail(e) {
    const id = e.currentTarget.dataset.id;
    // 跳转到商品详情页面
  },

  decreaseQuantity(e) {
    const id = e.currentTarget.dataset.id;
    const products = this.data.hotProducts.map(item => {
      if (item.id === id && item.quantity > 0) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    this.setData({ hotProducts: products });
  },

  increaseQuantity(e) {
    const id = e.currentTarget.dataset.id;
    const products = this.data.hotProducts.map(item => {
      if (item.id === id) {
        return { ...item, quantity: (item.quantity || 0) + 1 };
      }
      return item;
    });
    this.setData({ hotProducts: products });
  },

  addToCart(e) {
    const id = e.currentTarget.dataset.id;
    // 添加到购物车
  },

  buyNow(e) {
    const id = e.currentTarget.dataset.id;
    // 立即购买
  }
})