// pages/search/search.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hous:[],
    topnum:0,
    showbottom:false
  },
  search:function(e){
    let _this=this;
    let search=e.detail.value.search;//接收需要搜索的条件
    wx.request({
      url: app.globalData.url+'/api/elasticsearchbylike',
      method:"GET",
      data:{
        search:search
      },
      success:function(ret){
        console.log(ret.data.data);
        _this.setData({
          hous:ret.data.data
        })
      }
    })
  },
  //滑动到底部事件
  isBottom:function(){
    wx.showLoading({
      title: '加载中',
    })
    if(this.data.page<=this.data.last_page){
      this.getData();
    }else{
      this.setData({
        showbottom:true
      })
      wx.hideLoading({})
    }
  },
  toTop:function(){
    this.setData({
      topnum:0
    })
  },
   //滑动事件
   enscroll:function(e){
    if(e.detail.scrollTop>240){
      this.setData({
        showTotop:true
      })
    }else{
      this.setData({
        showTotop:false
      })
    }
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

  }
})