import cache from "../../utils/Cache.js";
const app=getApp();
// pages/fangmsg/fangmsg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notices:[]
  },
  tapname:function(e){
    console.log(e.currentTarget.dataset.index)
    wx.showModal({
      content: '拨打'+e.currentTarget.dataset.index+'【仅为模拟】',
      success: function (res) {
        if (res.confirm) {//这里是点击了确定以后
          wx.showToast({
            title: '拨打中...',      
            icon: 'loading',      
            duration: 2000//持续的时间      
          })
        } else {//这里是点击了取消以后 
          console.log('用户点击取消') 
        }
      }
    })
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
    var _this=this;
    wx.request({
      url: app.globalData.url+'/api/getnotices',
      method:'get',
      data:{
        openid:cache.get('openid')
      },
      success:function(ret){
        let notices=ret.data.data;
        notices.map(item=>{
          _this.setData({
            notices:[..._this.data.notices,item]
          })
        })
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