import cache from "../../utils/Cache.js";
const app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
   new:[],
   collect_on:false,//收藏功能
    hous_collect:[],
    hous_id:0,
    recommend_information:[]
  },
 //添加收藏
 collect:function(e){
  console.log('on');
  let _this=this;
  let new_id=e.target.dataset.id;//获取房源id
  wx.request({
    url: app.globalData.url+'/api/addcollect',
    data:{
      openid:cache.get('openid'),
      typeid:new_id,
      type:'article'
    },
    method:"POST",
    success(ret){
      console.log(ret);
      if(ret.data.status==1){
        wx.showToast({
          title: '添加收藏成功',
        })
        _this.setData({
          collect_on:true
        })
      }
    }
  })
},
//取消收藏
collect_off:function(e){
  console.log('off');
  let _this=this;
  let new_id=e.target.dataset.id;//获取房源id
  wx.request({
    url: app.globalData.url+'/api/offcollect',
    data:{
      openid:cache.get('openid'),
      typeid:new_id,
      type:'article'
    },
    method:"POST",
    success(ret){
      wx.showToast({
        title: '取消收藏成功',
      })
      console.log(ret);
      if(ret.data.status==1){
        _this.setData({
          collect_on:false
        })
      }
    }
  })
},
//获取用户信息
getUserinfo:function(id){
  let _this=this;
 // let hous_id=this.data.hous_id
  wx.request({
    url: app.globalData.url+'/api/getuserinfo',
    method:"GET",
    data:{
      openid:cache.get('openid'),
    },
    success(ret){
      if(ret.data.status==1){
        let arr=ret.data.data.article_collect
        arr.forEach(function(item, index){
          if(item==id){
            _this.setData({
              collect_on:true
            })
          }
        });
      }
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    let _this=this;
    // console.log(options.id)
    wx.request({
      url: app.globalData.url+'/api/getarticleone',
      method:"GET",
      data:{
        id:options.id
      },
      success:function(ret){
        // console.log(ret.data.data)
        _this.setData({
          new:ret.data.data
        })
        _this.getUserinfo(options.id);
        wx.hideLoading({})
      }
    })
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.new.title,
      path: '/pages/newsdetail/newsdetail?id='+this.data.new.id,
      imageUrl:this.data.new.image
    }
  },
  onAddToFavorites(res) {
    // webview 页面返回 webviewUrl
    console.log('WebviewUrl: ', res.webviewUrl)
    return {
      title: this.data.new.title,
      imageUrl: this.data.new.image,
      query: '欢迎收藏',
    }
  }
})