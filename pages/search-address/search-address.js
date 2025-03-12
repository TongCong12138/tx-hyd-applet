Page({
  data: {
    keyword: '',
    searchResults: [],
    hasSearched: false,
    region: null
  },

  onLoad(options) {
    if (options.region) {
      console.log(options.region);
      this.setData({
        region: JSON.parse(options.region)
      });
      // 打印街道
      console.log('打印范围 --- ', this.data.region);
    }
  },

  onSearchInput: function(e) {
    const keyword = e.detail.value.trim();
    this.setData({ keyword });
    
    if (keyword) {
      this.searchAddress(keyword);
    } else {
      this.setData({
        searchResults: [],
        hasSearched: false
      });
    }
  },

  searchAddress: function(keyword) {
    const region = this.data.region;
    if (!region) return;

    console.log('搜索 --- ', keyword);
    

    wx.showLoading({ title: '搜索中...' });
    
    wx.request({
      url: 'https://apis.map.qq.com/ws/place/v1/suggestion',
      data: {
        keyword: keyword,
        region: region.name,
        region_fix: 1,
        policy: 1,
        boundary: `region(${region.name},0)`,
        key: 'XX2BZ-YNPL3-IQO3Q-OZD25-UGMKE-IFBV5'
      },
      success: (res) => {
        // 
        console.log('搜索结果111 --- ', res);
        if (res.data.status === 0) {
          const results = res.data.data.map(item => ({
            id: item.id,
            title: item.title,
            address: item.address
          }));
          this.setData({
            searchResults: results,
            hasSearched: true
          });
        } else {
          wx.showToast({
            title: '搜索失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  selectAddress: function(e) {
    const address = e.currentTarget.dataset.address;
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    
    prevPage.setData({
      'formData.address': address.title
    });
    
    wx.navigateBack();
  }
});