Page({
  data: {
    userInfo: {
      userName: '小章',
      mobile: '13301637173',
      address: '哈工大威海11公寓'
    },
    addressList: [],
    addressEdit: false,
    cancelBtn: false,

    pickerRegionRange: [],
    pickerSelect:[0, 0, 0],
    showRegionStr: '选择行政地址（省、市、区县）',

    addressData: {}
  },
  // 添加地址
  addAddress: function() {
    this.setData({
      addressEdit: true,
      cancelBtn: true,
      id: null,
      addressData: {}
    })
  },
  // 取消编辑
  editCancel: function(){
    this.setData({
      addressEdit: false,         
    })
  },
  // 编辑地址
  // 删除地址按钮
  // 微信读取
  readFromWx : function () {
    const _this = this
    wx.chooseAddress({
      success: function (res) {
        console.log(res)
        _this.initRegionDB(res.provinceName, res.cityName, res.countyName)
        _this.setData({
          wxaddress: res
        });
      }
    })
  },  
  // 获取地址列表
  async initShippingAddress() {
    wx.showLoading({
      title: '',
    })
    const res = await WXAPI.queryAddress(wx.getStorageSync('token'))
    wx.hideLoading({
      success: (res) => {},
    })
    if (res.code == 0) {
      this.setData({
        addressList: res.data
      });
    } else {
      this.setData({
        addressList: null
      });
    }
  },   
  // 省市选择器 三栏
  initRegionPicker () {
    WXAPI.province().then(res => {
      if (res.code === 0) {
        let _pickerRegionRange = []
        _pickerRegionRange.push(res.data)
        _pickerRegionRange.push([{ name: '请选择' }])
        _pickerRegionRange.push([{ name: '请选择' }])
        this.data.pickerRegionRange = _pickerRegionRange
        this.bindcolumnchange({ detail: { column: 0, value: 0 } })
      }
    })
  },
  async initRegionDB (pname, cname, dname) {
    this.data.showRegionStr = pname + cname + dname
    let pObject = undefined
    let cObject = undefined
    let dObject = undefined
    if (pname) {
      const index = this.data.pickerRegionRange[0].findIndex(ele=>{
        return ele.name == pname
      })      
      if (index >= 0) {
        this.data.pickerSelect[0] = index
        pObject = this.data.pickerRegionRange[0][index]
      }
    }    
    if (!pObject) {
      return
    }
    const _cRes = await WXAPI.nextRegion(pObject.id)
    if (_cRes.code === 0) {
      this.data.pickerRegionRange[1] = _cRes.data
      if (cname) {
        const index = this.data.pickerRegionRange[1].findIndex(ele => {
          return ele.name == cname
        })        
        if (index >= 0) {
          this.data.pickerSelect[1] = index
          cObject = this.data.pickerRegionRange[1][index]
        }
      }
    }    
    if (!cObject) {
      return
    }
    const _dRes = await WXAPI.nextRegion(cObject.id)
    if (_dRes.code === 0) {
      this.data.pickerRegionRange[2] = _dRes.data
      if (dname) {
        const index = this.data.pickerRegionRange[2].findIndex(ele => {
          return ele.name == dname
        })        
        if (index >= 0) {
          this.data.pickerSelect[2] = index
          dObject = this.data.pickerRegionRange[2][index]
        }
      }
    }
    this.setData({
      pickerRegionRange: this.data.pickerRegionRange,
      pickerSelect: this.data.pickerSelect,
      showRegionStr: this.data.showRegionStr,
      pObject: pObject,
      cObject: cObject,
      dObject: dObject
    })
    
  },  
  bindchange: function(e) {    
    const pObject = this.data.pickerRegionRange[0][e.detail.value[0]]
    const cObject = this.data.pickerRegionRange[1][e.detail.value[1]]
    const dObject = this.data.pickerRegionRange[2][e.detail.value[2]]
    const showRegionStr = pObject.name + cObject.name + dObject.name
    this.setData({
      pObject: pObject,
      cObject: cObject,
      dObject: dObject,
      showRegionStr: showRegionStr
    })
  },
  bindcolumnchange: function(e) {
    const column = e.detail.column
    const index = e.detail.value    
    const regionObject = this.data.pickerRegionRange[column][index]    
    if (column === 2) {
      this.setData({
        pickerRegionRange: this.data.pickerRegionRange
      })
      return
    }
    if (column === 1) {
      this.data.pickerRegionRange[2] = [{ name: '请选择' }]
    }
    if (column === 0) {
      this.data.pickerRegionRange[1] = [{ name: '请选择' }]
      this.data.pickerRegionRange[2] = [{ name: '请选择' }]
    }
    // // 后面的数组全部清空
    // this.data.pickerRegionRange.splice(column+1)
    // 追加后面的一级数组
    WXAPI.nextRegion(regionObject.id).then(res => {
      if (res.code === 0) {
        this.data.pickerRegionRange[column + 1] = res.data     
      }
      this.bindcolumnchange({ detail: { column: column + 1, value: 0 } })
    })
  },  
  // 
  async provinces(provinceId, cityId, districtId) {
    const res1 = await WXAPI.province()    
    const provinces = res1.data  
    this.setData({
      provinces,
    })     
    var pIndex = provinces.findIndex(ele => {
      return ele.id == provinceId
    })  
     
    const pid = this.data.provinces[pIndex].id    
    const res2 = await WXAPI.nextRegion(pid)
    const cities = res2.data  
    this.setData({
      cities,
    })  
    var  cIndex = cities.findIndex(ele => {
      return ele.id == cityId
    })
    
    const cid = this.data.cities[cIndex].id
    const res3 = await WXAPI.nextRegion(cid);
    const areas = res3.data
    this.setData({
      areas,
    })
    var aIndex = areas.findIndex(ele => {
      return ele.id == districtId
    })
    // var pIndex = pIndex + 1
    // var cIndex = cIndex + 1
    // var aIndex = aIndex + 1
    this.setData({
      pIndex: pIndex,
      cIndex: cIndex,
      aIndex: aIndex,
    })  
    
  },
  usernameChange(e) {
    const userInfo = this.data.userInfo
    userInfo.userName = e.detail
    this.setData({
       userInfo
    })
  },
  mobileChange(e) {
    const userInfo = this.data.userInfo
    userInfo.mobile = e.detail
    this.setData({
      userInfo
    })
  },
  addressChange(e) {
    const userInfo = this.data.userInfo
    userInfo.address = e.detail
    this.setData({
      userInfo
    })
  },
  // 保存按钮
  async bindSave() {
    wx.navigateBack({
      delta: 0,
    })
    
  },
  onLoad: function (e) {
  },
  onShow: function() {
  },  
  
  // 判断电话号码格式
  setTelModal:function(e) {
    // console.log(e)    
    var mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
    // var myreg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;  //判断是否是座机电话
    
    var isMobile = mobile.exec(e.detail.value)
    //输入有误的话，弹出模态框提示
    if(!isMobile){
      wx.showModal({
        title: '错误',
        content: '手机号码格式不正确',
        showCancel:false
      })
    }   
    
  },
  
  
})
