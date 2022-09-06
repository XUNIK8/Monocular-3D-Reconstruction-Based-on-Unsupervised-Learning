import { base64src } from '../../base64.js'
const app = getApp();
var startPoint
Page({
  data: {
    StatusBar: 20,
    CustomBar: 60,
    PageCur: 'basics',
    pictitle:"深度图",
    imgsave:'',
    srcShow:'',        // 这里定义了一个用于显示图片的变量！！！！！！！！！！！！！！！！！！！！！！
    
    // 这里src改成了下面两个，origin作为存储原图像的变量，process作为存储处理后图像
    flag:0,
    par:0,
    bool:'0',

   array: [{
    mode: 'aspectFit',
    text: 'aspectFit：保持纵横比缩放图片，使图片的长边能完全显示出来'
  }], 
  iconList: [{
    icon: 'cardboardfill',
    color: 'blue',
    badge: 120,
    name: '原图',
    flag:1
  }, {
    icon: 'recordfill',
    color: 'purple',
    badge: 1,
    name: '深度图',
    flag:2
  }, {
    icon: 'picfill',
    color: 'mauve',
    badge: 0,
    name: '点云文件',
    flag:4
  },
  //  {
  //   icon: 'noticefill',
  //   color: 'olive',
  //   badge: 22,
  //   name: '锐化',
  //   flag:4
  // },{
  //   icon: 'clothesfill',
  //   color: 'blue',
  //   badge: 1,
  //   name: '自适应阈值',
  //   flag:5
  // }, {
  //   icon: 'discoverfill',
  //   color: 'purple',
  //   badge: 1,
  //   name: 'sauvola阈值',
  //   flag:6
  // },{
  //   icon: 'commandfill',
  //   color: 'purple',
  //   badge: 1,
  //   name: '腐蚀',
  //   flag:8
  // },
  // {
  //   icon: 'brandfill',
  //   color: 'purple',
  //   badge: 1,
  //   name: '膨胀',
  //   flag:9
  // // },
  // {
  //   icon: 'brandfill',
  //   color: 'mauve',
  //   badge: 1,
  //   name: '一键复原',
  //   flag:7
  // }
],
  gridCol:3,
  skin: false,
  info: ''
},
onLoad:function(option){
    var that = this;
    that.srcProcess = option.srcProcess
    that.setData({
      srcShow:option.srcProcess
    })
    
    console.log('option',option)
    that.setData({
      srcOrigin:option.srcOrigin,
      srcProcess:option.srcProcess
    })
},

clickflag(e){
  var _this = this
  var flag = e.currentTarget.dataset.name;
   console.log("选择的功能",flag);
   if(flag == '1'){
     _this.setData({
       //显示原图*********************************************
       srcShow:_this.data.srcOrigin,      
       pictitle:"原图"
     })
   }
   if(flag == '2'){
    _this.setData({
      //显示深度图*********************************************
      srcShow:_this.data.srcProcess,
      pictitle:'深度图'
    })
  }
  if(flag == '4'){
    _this.setData({
      //显示点云
      srcShow:'../../images/cloudpoints.jpg',
      pictitle:'点云文件'
    })
    wx.showToast({
      title: '尚未开放，仅能预览',
      icon:"none"
    })
  }
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
     },
     fail: function() {
     // fail
     },
     complete: function() {
     // complete
     }
    })
    
   },

  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  onShareAppMessage() {
    return {
      title: 'ColorUI-高颜值的小程序UI组件库',
      imageUrl: '/images/share.jpg',
      path: '/pages/index/index'
    }
  },
  sliderchange: function(event){
    var _this = this
    var par=event.detail.value
  
    console.log('参数修改为',par)
   _this.setData({
     par:par
   })
   },

// 图像处理部分（服务器）
  processImg:function(){
    var _this = this
    // 服务器部分
   if(_this.data.srcOrigin == '../../images/zanCode.jpg'){ 
    wx.showToast({
      title: '请选择图片',
      icon: 'none',
    })
  }else{
    // _this.setData({
    //   srcProcess:_this.data.srcOrigin
    //  })
    wx.showLoading({
      title: '处理图片中...',
    })
    console.log('Ffffffffff'+_this.data.srcProcess)
    console.log(_this.data.corner)
    wx.uploadFile({
      // 改下地址！！！！！
      url: 'https://175.24.17.148:8015',
      filePath: _this.data.srcOrigin,
      name: 'file',
      // 传送功能标志、参数值
      formData:{
        'flag': _this.data.flag,
        'par': Number(_this.data.par),
        'bool':_this.data.bool,
        'corner1':Number(_this.data.corner[0][0]),
        'corner2':Number(_this.data.corner[0][1]),
        'corner3':Number(_this.data.corner[1][0]),
        'corner3':Number(_this.data.corner[1][0]),
        'corner4':Number(_this.data.corner[1][1]),
        'corner5':Number(_this.data.corner[2][0]),
        'corner6':Number(_this.data.corner[2][1]),
        'corner7':Number(_this.data.corner[3][0]),
        'corner8':Number(_this.data.corner[3][1])
        },
      
      success (res){
        console.log('000')    
        wx.hideLoading()
        _this.setData({
          // 转换图像格式
          srcProcess: "data:image/png;base64," + res.data,
          bool:'1',
          corner:[[0,0],[0,0],[0,0],[0,0]]
        })
          console.log(_this.data.srcProcess)

        console.log('SSSSSSSSSSS'+ _this.data.srcProcess)
        wx.hideLoading(),
        wx.showToast({
          title: '处理成功',//提示文字
          duration:1000,//显示时长
          icon:'success', //图标，支持"success"、"loading" 
        })
      },
      fail(res){
        console.log('111')
        wx.hideLoading(),
        wx.showToast({
          title: '处理失败',//提示文字
          duration:1000,//显示时长
          icon:'error', //图标
        })
      }
    })
  }
  
  },

    // 长按保存功能
   // 长按保存功能
   saveImage (e) {
    console.log('000',e)
    // var bool =this.data.bool,
    if(this.data.bool=='1'){
    base64src(e.currentTarget.dataset.url, res => {
      // console.log('zhuan',res) // 返回图片地址，直接赋值到image标签即可
      var url = res
      console.log('urlsave',url)
      const { saveImage1, saveImage2, saveImage3, saveImage4 } = this
      saveImage1(url).then(saveImage2).then(saveImage3).then(saveImage4)
    });
  }else{
    var url = e.currentTarget.dataset.url
    const { saveImage1, saveImage2, saveImage3, saveImage4 } = this
      saveImage1(url).then(saveImage2).then(saveImage3).then(saveImage4)
  }
  },
    // 吊起 actionsheet
    saveImage1 (url) {
      const p1 = new Promise((resolve, reject) => {
        wx.showActionSheet({
          itemList: ['保存到相册'],
          success: res => {
            resolve(url)
          },
          fail: err => {
            reject(err)
          }
        })
      })
      return p1
    },
    // 授权
    saveImage2 (url) {
      const p2 = new Promise((resolve, reject) => {
        wx.getSetting({
          success: settings => {
            if (!settings.authSetting['scope.writePhotosAlbum']) {
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success: () => {
                    // 同意授权
                    resolve(url)
                },
                fail: () => {
                    wx.showModal({
                        title: '保存失败',
                        content: '请开启访问手机相册权限',
                        success: () => {
                          wx.openSetting()
                        }
                    })
                    reject()
                }
              })
            } else {
              // 已经有权限了
              resolve(url)
            }
          }
        })
      })
      return p2
    },
    // 转换图片格式为本地路径
    saveImage3 (url) {
      const p3 = new Promise((resolve, reject) => {
        wx.getImageInfo({
          src: url,
          success: res => {
            resolve(res.path)
          },
          fail: () => {
            reject()
          }
        })
      })
      return p3
    },
    // 保存
    saveImage4 (path) {
      const p4 = new Promise((resolve, reject) => {
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success: () => {
              wx.showToast({
                 title: '已保存到相册',
              })
          },
          fail: err => {
            console.log(err)
          }
        })
      })
      return p4
    },

    fuyuan(){
      var that =this;
      that.setData({
        srcProcess:that.data.srcOrigin,
        corner:[[0,0],[0,0],[0,0],[0,0]],
        bool:'0'
      })
      wx.getSystemInfo({
        success: function (res) {
          console.log(res);
          // 屏幕宽度、高度
          console.log('height=' + res.windowHeight);
          console.log('width=' + res.windowWidth);
          // 高度,宽度 单位为px
          that.setData({
            windowHeight:  res.windowHeight,
            windowWidth:  res.windowWidth,
            buttonTop1:res.windowHeight*0.88,//这里定义按钮的初始位置
            buttonLeft1:res.windowWidth*0.70,//这里定义按钮的初始位置
            buttonTop2:res.windowHeight*0.88,//这里定义按钮的初始位置
            buttonLeft2:res.windowWidth*0.80,//这里定义按钮的初始位置
            buttonTop3:res.windowHeight*0.93,//这里定义按钮的初始位置
            buttonLeft3:res.windowWidth*0.80,//这里定义按钮的初始位置
            buttonTop4:res.windowHeight*0.93,//这里定义按钮的初始位置
            buttonLeft4:res.windowWidth*0.70,//这里定义按钮的初始位置
          })
        } 
    })
  } 
})