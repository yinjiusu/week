import cache from "../../utils/Cache.js";
const app=getApp();
// pages/fang/fang.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hous:[],
    hous_img:[],
    markers: [],
    collect_on:false,//收藏功能
    hous_collect:[],
    hous_id:0
  },
  //拨打电话
  callphone:function(e){
    let phone=e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone, //仅为示例，并非真实的电话号码,
      success:function(){
        console.log('拨打成功');
      },
      fail:function(){
        console.log('取消拨打');
      }
    })
  },
  //添加收藏
  collect:function(e){
    console.log('on');
    let _this=this;
    let hous_id=e.target.dataset.id;//获取房源id
    wx.request({
      url: app.globalData.url+'/api/addcollect',
      data:{
        openid:cache.get('openid'),
        typeid:hous_id,
        type:'hous'
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
    let hous_id=e.target.dataset.id;//获取房源id
    wx.request({
      url: app.globalData.url+'/api/offcollect',
      data:{
        openid:cache.get('openid'),
        typeid:hous_id,
        type:'hous'
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
          let arr=ret.data.data.hous_collect
          console.log(arr);
          console.log(id);
          arr.forEach(function(item, index){
            if(item==id){
              console.log('存在')
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
    this.setData({
      hous_id:options.id
    })
    let id=options.id;
    let _this=this;
    wx.request({
      url: app.globalData.url+'/api/gethousdetails',
      method:"GET",
      data:{
        hous_id:id
      },
      success(ret){
        _this.setData({
          hous:ret.data.data,
          markers:[{
            title:ret.data.data.fang_addr,
            iconPath: app.globalData.url+"/Icon/map_coordinate.png",
            id: ret.data.data.id,
            latitude: ret.data.data.latitude,
            longitude: ret.data.data.longitude,
            width: 30,
            height: 30
          }]
        })
        _this.getUserinfo(id);
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.hous.fang_name,
      path: '/page/user?id='+this.data.hous.id,
      imageUrl:this.data.hous.fand_pic_url
    }
  }
})