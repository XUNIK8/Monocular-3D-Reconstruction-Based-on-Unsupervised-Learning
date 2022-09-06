// pages/upload/upload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isupload:0,
    StatusBar: 20,
    CustomBar: 60,
    PageCur: 'basics',
    picx0: 0,
    picy0: 0,
    imgsave: '',
    corner: [[0, 0], [0, 0], [0, 0], [0, 0]], //拖动获取的四个角点
    //按钮位置参数
    buttonTop1: 0,
    buttonLeft1: 0,
    buttonTop2: 0,
    buttonLeft2: 0,
    buttonTop3: 0,
    buttonLeft3: 0,
    buttonTop4: 0,
    buttonLeft4: 0,
    windowHeight: '',
    windowWidth: '',
    widthpic: 0,
    heightpic: 0,
    widthchange: 0,
    heightchange: 0,
    //角标显示数字
    corner_data: 0,

    // 这里src改成了下面两个，origin作为存储原图像的变量，process作为存储处理后图像
    srcOrigin: "../../images/empty.jpg",
    srcProcess: "../../images/empty.jpg",
    flag: 0,
    par: 0,
    bool: '0',


    array: [{
      mode: 'aspectFit',
      text: 'aspectFit：保持纵横比缩放图片，使图片的长边能完全显示出来'
    }],
    gridCol: 4,
    skin: false,
    info: ''
   

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

  gotoShow: function(){
    var _this = this
   wx.chooseImage({
    count: 1, // 最多可以选择的图片张数，默认9
    sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
    sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
    success: function(res){
    // success
    console.log('路径',res.tempFilePaths)
    _this.setData({
     srcOrigin:res.tempFilePaths[0],
     srcProcess:res.tempFilePaths[0],
     bool:'0',
     corner:[[0,0],[0,0],[0,0],[0,0]]
    })
    wx.getSystemInfo({
     success: function (res) {
       console.log(res);
       _this.setData({
         isupload:1
       })
       wx.showToast({
         title: '上传成功',
       })

      //  // 屏幕宽度、高度
      //  console.log('height=' + res.windowHeight);
      //  console.log('width=' + res.windowWidth);
      //  // 高度,宽度 单位为px
      //  _this.setData({
      //    windowHeight:  res.windowHeight,
      //    windowWidth:  res.windowWidth,
      //    buttonTop1:res.windowHeight*0.88,//这里定义按钮的初始位置
      //    buttonLeft1:res.windowWidth*0.70,//这里定义按钮的初始位置
      //    buttonTop2:res.windowHeight*0.88,//这里定义按钮的初始位置
      //    buttonLeft2:res.windowWidth*0.80,//这里定义按钮的初始位置
      //    buttonTop3:res.windowHeight*0.93,//这里定义按钮的初始位置
      //    buttonLeft3:res.windowWidth*0.80,//这里定义按钮的初始位置
      //    buttonTop4:res.windowHeight*0.93,//这里定义按钮的初始位置
      //    buttonLeft4:res.windowWidth*0.70,//这里定义按钮的初始位置
      //  })
     } 
 })
    },
    fail: function() {
    // fail
    },
    complete: function() {
    // complete
    }
   })
   
  },

  begin3d(e){
    var _this = this
    if(_this.data.isupload ==0){
      wx.showToast({
        title: '请先上传图片',
        icon:'none'
      })
    } else {
      // 服务器部分
      wx.showLoading({
        title: '处理图片中...',
      })
      console.log('Ffffffffff' + _this.data.srcProcess)

      wx.uploadFile({
        // 改下地址！！！！！
        url: 'https://175.24.17.148:8015',
        filePath: _this.data.srcOrigin,
        name: 'file',
        // 传送功能标志、参数值
        success(res) {
          console.log('000')
          wx.hideLoading()
          _this.setData({
            // 转换图像格式
            srcProcess: "data:image/jpg;base64," + res.data,
          })
          console.log(_this.data.srcProcess)
          console.log('SSSSSSSSSSS' + _this.data.srcProcess)
          wx.hideLoading(),
            wx.showToast({
              title: '处理成功',//提示文字
              duration: 1000,//显示时长
              icon: 'success', //图标，支持"success"、"loading" 
            })
          wx.navigateTo({
            url: '/pages/index/index?srcOrigin='+_this.data.srcOrigin+'&srcProcess='+_this.data.srcProcess,     
          })
         
        },
        fail(res) {
          console.log('111')
          wx.hideLoading(),
            wx.showToast({
              title: '处理失败',//提示文字
              duration: 1000,//显示时长
              icon: 'none', //图标
            })
        }
      })
    }




  },

})