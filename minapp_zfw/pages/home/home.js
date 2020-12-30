import cache from "../../utils/Cache.js";
const app=getApp();
// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:true,
    user_icon:"",
    nickname:'未授权',
    is_auth:'未认证',
    recommend_information:[],
    province:'北京'
  },
  //授权
  getuser:function(ret){
    let user=ret.detail.userInfo;
    //存入数据库
    wx.request({
      url: app.globalData.url+'/api/setuserinfo',
      data:{
        openid:cache.get('openid'),
        userinfo:user
      },
      method:'POST',
      success:function(ret){
        console.log(ret);
      }
    })
    console.log(user);
    this.setData({
      user_icon:user.avatarUrl,
      nickname:user.nickName,
      show:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.getUserinfo();
    if(app.globalData.recommend_information){
      this.setData({
        recommend_information:app.globalData.recommend_information
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   // console.log(user);
  },
  getUserinfo:function(){
    let _this=this;
    wx.request({
      url: app.globalData.url+'/api/getuserinfo',
      data:{
        openid:cache.get('openid'),
      },
      method:'get',
      success:function(ret){
        console.log(ret);
        if(ret.data.status==1){
          _this.setData({
            nickname:ret.data.data.nickname,
            user_icon:ret.data.data.avatar,
            is_auth:ret.data.data.is_auth=='1'?'认证':'未认证',
            show:false
          })
        }
        wx.hideLoading()
      }
    })
  },
  
})