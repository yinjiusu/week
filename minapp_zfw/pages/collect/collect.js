import cache from "../../utils/Cache.js";
const app=getApp();

// pages/history/history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    now:true,
    dataSet:[],//数据
    type:'',//分类
    currentData:[],//当前数据
    topnum:0,//置顶
    showTotop:false,//显示置顶小火箭
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
  toTop:function(){
    this.setData({
      topnum:0
    })
  },
   //切换收藏类型
  changeType:function(e){
    let type=e.target.dataset.type;
    if(type=="hous"){
      this.setData({
        now:true,
        type:'hous',//分类
        currentData:this.data.dataSet.hous_collect_arr//当前数据
      })
    }else if(type=="article"){
      this.setData({
        now:false,
        type:'article',//分类
        currentData:this.data.dataSet.article_collect_arr//当前数据
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this=this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url+'/api/getcollect',
      method:"GET",
      data:{
        openid:cache.get('openid')
      },
      success:function(ret){
        console.log(ret.data.data);
        _this.setData({
          dataSet:ret.data.data,
          type:'hous',
          currentData:ret.data.data.hous_collect_arr
        })
      },
      complete:function(){
        wx.hideLoading({})
      }
    })
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