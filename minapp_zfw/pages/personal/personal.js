import cache from "../../utils/Cache.js";
const app=getApp();
// pages/personal/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    age:'未知',
    nickname:'未知',
    phone:'未知',
    sex:'未知',
    avatar:''
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
            avatar:ret.data.data.avatar,
            age:ret.data.data.age,
            phone:ret.data.data.phone?ret.data.data.phone:'未知',
            sex:ret.data.data.sex?ret.data.data.sex:'未知',
          })
        }
      }
    })
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

  }
})