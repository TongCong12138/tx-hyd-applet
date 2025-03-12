const provinces = require('../../utils/area-data/provinces');
const cities = require('../../utils/area-data/cities');
Page({
  data: {
    formData: {
      name: '',
      phone: '',
      region: '',
      address: '',
      houseNumber: '',
      remark: '',
      isDefault: false
    },
    currentLevel: 0,  // 0:省, 1:市, 2:区, 3:街道
    selectedRegion: [], // 存储已选择的地区信息
    areaList: [],      // 当前显示的地区列表
    showRegionPicker: false
  },

  onLoad() {
    // 初始化显示省份列表
    this.setData({
      areaList: provinces,
      currentLevel: 0
    });
  },

  // 地区选择处理
  handleAreaSelect(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.areaList[index];
    const { currentLevel, selectedRegion } = this.data;

    // 保存选择
    selectedRegion[currentLevel] = item;

    if (currentLevel === 0) {
      // 选择省份后显示城市
      this.setData({
        areaList: cities[item.code] || [],
        currentLevel: 1,
        selectedRegion
      });
    } else if (currentLevel === 1) {
      // 选择城市后获取区域
      wx.showLoading({ title: '加载中...' });
      wx.request({
        url: 'https://apis.map.qq.com/ws/district/v1/getchildren',
        data: {
          id: item.code,
          key: 'XX2BZ-YNPL3-IQO3Q-OZD25-UGMKE-IFBV5'
        },
        success: (res) => {
          console.log('获取的区域列表：', res.data);
          if (res.data.status === 0) {
            const districts = res.data.result[0].map(item => ({
              code: item.id,
              name: item.fullname
            }));
            this.setData({
              areaList: districts,
              currentLevel: 2,
              selectedRegion
            });
          }
        },
        complete: () => {
          wx.hideLoading();
        }
      });
    } else if (currentLevel === 2) {
      // 选择区域后获取街道
      wx.showLoading({ title: '加载中...' });
      wx.request({
        url: 'https://apis.map.qq.com/ws/district/v1/getchildren',
        data: {
          id: item.code,
          key: 'XX2BZ-YNPL3-IQO3Q-OZD25-UGMKE-IFBV5'
        },
        success: (res) => {
          if (res.data.status === 0) {
            const streets = res.data.result[0].map(item => ({
              code: item.id,
              name: item.fullname
            }));
            this.setData({
              areaList: streets,
              currentLevel: 3,
              selectedRegion
            });
          }
        },
        complete: () => {
          wx.hideLoading();
        }
      });
    } else if (currentLevel === 3) {
      // 选择街道
      selectedRegion[3] = item;
      this.setData({
        selectedRegion
      });
    }
  },

  // 返回上一级
  handleBack() {
    const { currentLevel, selectedRegion } = this.data;
    if (currentLevel === 0) return;

    let areaList = [];
    // 更新selectedRegion，移除当前级别的选择
    selectedRegion.splice(currentLevel);

    if (currentLevel === 1) {
      areaList = provinces;
      // 返回到省份时清空selectedRegion
      this.setData({
        currentLevel: currentLevel - 1,
        areaList,
        selectedRegion: []
      });
      return;
    } else if (currentLevel === 2) {
      // 返回到市级
      areaList = cities[selectedRegion[0].code] || [];
      this.setData({
        currentLevel: currentLevel - 1,
        areaList,
        selectedRegion
      });
      return;
    } else if (currentLevel === 3) {
      // 返回到区级
      wx.showLoading({ title: '加载中...' });
      wx.request({
        url: 'https://apis.map.qq.com/ws/district/v1/getchildren',
        data: {
          id: selectedRegion[1].code,
          key: 'XX2BZ-YNPL3-IQO3Q-OZD25-UGMKE-IFBV5'
        },
        success: (res) => {
          if (res.data.status === 0) {
            const districts = res.data.result[0].map(item => ({
              code: item.id,
              name: item.fullname
            }));
            this.setData({
              areaList: districts,
              currentLevel: currentLevel - 1,
              selectedRegion
            });
          }
        },
        complete: () => {
          wx.hideLoading();
        }
      });
      return;
    }
  },
  // 多列选择器列改变时触发
  bindMultiPickerColumnChange(e) {
    const { column, value } = e.detail;
    const data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[column] = value;

    switch (column) {
      case 0:  // 选择省份
        data.multiArray[1] = cities[provinces[value].code] || [];
        data.multiArray[2] = districts[data.multiArray[1][0].code] || [];
        data.multiArray[3] = streets[data.multiArray[2][0].code] || [];
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        data.multiIndex[3] = 0;
        break;
      case 1:  // 选择城市
        data.multiArray[2] = districts[data.multiArray[1][value].code] || [];
        data.multiArray[3] = streets[data.multiArray[2][0].code] || [];
        data.multiIndex[2] = 0;
        data.multiIndex[3] = 0;
        break;
      case 2:  // 选择区县
        data.multiArray[3] = streets[data.multiArray[2][value].code] || [];
        data.multiIndex[3] = 0;
        break;
    }
    this.setData(data);
  },

  // 多列选择器值改变时触发
  bindMultiPickerChange(e) {
    const { multiArray, multiIndex } = this.data;
    const region = `${multiArray[0][multiIndex[0]].name}${multiArray[1][multiIndex[1]].name}${multiArray[2][multiIndex[2]].name}${multiArray[3][multiIndex[3]].name}`;
    
    this.setData({
      'formData.region': region
    });
  },

  // 打开地区选择器
  openRegionPicker() {
    this.setData({
      showRegionPicker: true,
      areaList: provinces,
      currentLevel: 0,
      selectedRegion: []
    });
  },

  hideRegionPicker() {
    this.setData({
      showRegionPicker: false
    });
  },

  // 确认选择地区
  handleConfirm() {
    const { selectedRegion } = this.data;
    if (selectedRegion.length === 4) {
      const region = selectedRegion.map(item => item.name).join('');
      this.setData({
        'formData.region': region,
        showRegionPicker: false,
        selectedStreet: selectedRegion[3]
      });
    }
  },

  // 跳转到地址搜索页面
  goToSearchAddress() {
    if (!this.data.selectedStreet) {
      wx.showToast({
        title: '请先选择所在地区',
        icon: 'none'
      });
      return;
    }
    // 传递城市信息作为搜索范围
    const { selectedRegion } = this.data;
    const cityInfo = selectedRegion[1];
    wx.navigateTo({
      url: `/pages/search-address/search-address?region=${JSON.stringify(cityInfo)}`
    });
  },

  // 获取当前位置
  getLocation() {
    wx.showLoading({ title: '定位中...' });
    wx.getLocation({
      // type: 'gcj02',
      type: 'gcj02',
      success: (res) => {
        const { latitude, longitude } = res;
        // 打印res
        console.log('获取的经纬度：', { latitude, longitude });
        // 使用腾讯地图逆地址解析
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/',
          data: {
            location: `${latitude},${longitude}`,
            key: 'XX2BZ-YNPL3-IQO3Q-OZD25-UGMKE-IFBV5', // 替换为你的腾讯地图 Key
            get_poi: 1
          },
          success: (res) => {
            // 打印结果
            console.log('腾讯地图逆地址解析结果：', res.data);
            if (res.data.status === 0) {
              const result = res.data.result;
              const adInfo = result.ad_info;
              // 根据返回的行政区划代码匹配本地数据
              this.setData({
                'formData.region': `${result.address_component.province}${result.address_component.city}${result.address_component.district}${result.address_component.street}`,
                'formData.address': result.address_component.street_number,
                selectedProvince: adInfo.province_code,
                selectedCity: adInfo.city_code,
                selectedDistrict: adInfo.district_code
              });
              // 打印数据
              console.log('获取的行政区划代码：', {
                province: adInfo.province_code,
                city: adInfo.city_code,
                district: adInfo.district_code
              });
            } else {
              wx.showToast({
                title: '定位失败',
                icon: 'none'
              });
            }
          },
          complete: () => {
            wx.hideLoading();
          }
        });
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: '定位失败',
          icon: 'none'
        });
      }
    });
  },

  // 表单提交
  submitForm(e) {
    const formData = e.detail.value
    if (!formData.name) {
      return wx.showToast({ title: '请输入收货人姓名', icon: 'none' })
    }
    if (!formData.phone) {
      return wx.showToast({ title: '请输入手机号码', icon: 'none' })
    }
    if (!/^1\d{10}$/.test(formData.phone)) {
      return wx.showToast({ title: '手机号码格式不正确', icon: 'none' })
    }
    if (!this.data.formData.region) {
      return wx.showToast({ title: '请选择所在地区', icon: 'none' })
    }
    if (!formData.address) {
      return wx.showToast({ title: '请输入详细地址', icon: 'none' })
    }

    // TODO: 调用后端接口保存地址
    console.log('提交的表单数据：', {
      ...formData,
      region: this.data.formData.region
    })
  }
})