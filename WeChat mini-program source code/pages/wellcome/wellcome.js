// pages/wellcome/wellcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    srcProcess:"../../images/OK.jpg",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getpicwh(e){
    console.log('获取宽高',e.detail)
    var widthpic=e.detail.width
    var heightpic=e.detail.height
    var widthchange, heightchange,x0,y0
  
    if (widthpic > heightpic) {
      widthchange=414
      heightchange=414*heightpic/widthpic
    } else {
      heightchange=331
      widthchange=331*widthpic/heightpic
    }
  
    x0=(414-widthchange)/2
    y0=(331-heightchange)/2+71
  
    this.setData({
      widthpic:widthpic,
      heightpic:heightpic,
      widthchange:widthchange,
      heightchange:heightchange,
      picx0:x0,
      picy0:y0,
    })
  },
  toindex(){
    wx.navigateTo({
      url: '../upload/upload',
    })
  }
})