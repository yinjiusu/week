import cache from "../../utils/Cache.js";
const app=getApp();

// pages/editpersonal/editpersonal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formdata:'',
    avatar:'',
    show:true,
    avatar_path:''
  },
  editperson:function(e){
    let form_data=e.detail.value;
    form_data.avatar=this.data.avatar_path
    console.log(form_data)
    wx.request({
      url: app.globalData.url+'/api/edituserinfo',
      method:'POST',
      data:{
        openid:cache.get('openid'),
        form_data:form_data
      },
      success:function(ret){
        console.log(ret)
      }
    })
  },
  upfile:function(){
    var _this=this;
    wx.chooseImage({
      success (res) {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.url+'/api/upfile', 
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {          
          },
          success (res){
            const data = res.data
            _this.setData({
              avatar_path:data,
              avatar:app.globalData.url+data
            })
          }
        })
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
        url: app.globalData.url+'/api/getuserinfo',
        method:'GET',
        data:{
          openid:cache.get('openid')
        },
        success:function(ret){
          console.log(ret.data.data.avatar);
          
          if (ret.data.data.avatar){
            _this.setData({
              formdata:ret.data.data,
              avatar:ret.data.data.avatar,
              show:false
            })
          }else{
            _this.setData({
              formdata:ret.data.data,
            })
          }
          console.log(_this.data.formdata);
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