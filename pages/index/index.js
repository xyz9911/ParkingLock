//index.js
//获取应用实例
const app = getApp()

//预设车位锁
const normalCallout = { 
  id: 1,
  latitude: 37.528123,
  longitude: 122.077678,
  iconPath: '/icon/location.png',
  callout: {
    content: 'N1',
    color: '#ff0000',
    fontSize: 14,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#000000',
    bgColor: '#fff',
    padding: 5,
    display: 'ALWAYS',
    textAlign: 'center'
  }
}

const customCallout1 = {
  id: 2,
  latitude: 37.527923,
  longitude: 122.077585,
  iconPath: '/icon/location.png',
  // customCallout: {
  //   anchorY: 0,
  //   anchorX: 0,
  //   display: 'ALWAYS'
  // },
  callout: {
    content: 'N2',
    color: '#ff0000',
    fontSize: 14,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#000000',
    bgColor: '#fff',
    padding: 5,
    display: 'ALWAYS',
    textAlign: 'center'
  }
}

const customCallout2 = {
  id: 3,
  latitude: 37.527100,
  longitude: 122.077986,
  iconPath: '/icon/location.png',
  // customCallout: {
  //   anchorY: 10,
  //   anchorX: 0,
  //   display: 'ALWAYS',
  // },
  callout: {
    content: 'N3',
    color: '#ff0000',
    fontSize: 14,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#000000',
    bgColor: '#fff',
    padding: 5,
    display: 'ALWAYS',
    textAlign: 'center'
  }
}

const customCallout3 = {
  id: 4,
  latitude: 37.527345,
  longitude: 122.077124,
  iconPath: '/icon/location.png',
  callout: {
    content: 'N4',
    color: '#ff0000',
    fontSize: 14,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#000000',
    bgColor: '#fff',
    padding: 5,
    display: 'ALWAYS',
    textAlign: 'center'
  }
}

const allMarkers = [normalCallout, customCallout1, customCallout2, customCallout3]




Page({
  data: {
    markers: [], //车位锁标记
    modalHidden:true,//是否隐藏对话框
    chosennum:1,

    buttonHidden:true,//是否隐藏"取消使用"按钮
    confirm_modalHidden:true,//是否隐藏"确认使用"对话框

    //存储计时器
    setInter:"",
    num:1,


    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color:"#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 1,
      iconPath: '/icon/location.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }]
  },

  regionchange(e) {
    console.log(e.type)
  },

    //事件处理函数
    bindViewTap: function() {
      this.setData({
        modalHidden:!this.data.modalHidden
      })  
    },

    //使用按钮事件处理函数
    confirm_bindViewTap: function() {
      this.setData({
        confirm_modalHidden:!this.data.confirm_modalHidden
      })  
    },

    //确定按钮点击事件
    modalBindaconfirm:function(){
      this.setData({
        modalHidden:!this.data.modalHidden,
      })
      this.startSetInter();
      this.setData({
        buttonHidden:!this.data.buttonHidden, //改变"停止使用"按钮显示状态
      })
    },
    //取消按钮点击事件
    modalBindcancel:function(){
      this.setData({
        modalHidden:!this.data.modalHidden,
      })
    }, 
    //“确定使用”按钮点击事件
    confirm_modalBindaconfirm:function(){
      this.setData({
        confirm_modalHidden:!this.data.confirm_modalHidden,
      })
      this.endSetInter();
      this.setData({
        buttonHidden:true, //设置"停止使用"按钮显示状态
      })
    },




  markertap(e) {
    console.log("点击的图标编号"+e.detail.markerId);
    console.log(e);
    this.setData({
      chosennum:e.detail.markerId,
    })
    console.log(this.data.chosennum);
    this.bindViewTap();


  },

  controltap(e) {
    console.log(e.detail.controlId)
  },
addMarker() {
  const markers = allMarkers
  this.setData({
    markers,
    customCalloutMarkerIds: [2,3,4],
  })
},


startSetInter: function(){
  var that = this;
  //将计时器赋值给setInter
  that.data.setInter = setInterval(
      function () {
          var numVal = that.data.num + 1;
          that.setData({ num: numVal });
          console.log('setInterval==' + that.data.num);
      }
, 2000);   
},
endSetInter: function(){
  var that = this;
  //清除计时器  即清除setInter
  clearInterval(that.data.setInter)
},
onHide: function () {

},
onUnload: function () {
  var that =this;
  //清除计时器  即清除setInter
  clearInterval(that.data.setInter)
},









  onLoad: function () { 
    this.addMarker(); //加载页面后显示车位锁信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
