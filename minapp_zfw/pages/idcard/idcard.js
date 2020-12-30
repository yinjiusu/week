import cache from "../../utils/Cache.js";
const app=getApp();
// pages/editpersonal/editpersonal.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    text:"身份认证将提高租房成功率！",
    card:'',
    truename:'',
    idcard_imgs:[],
    show:true,
    show_from:true,
  },
  /* 文件上传 */
  upfile:function(){
    let _this=this;
    wx.chooseImage({
      count:3,
      success (res) {
        const tempFilePaths = res.tempFilePaths
        tempFilePaths.map(item=>{
          wx.uploadFile({
            url: app.globalData.url+'/api/upfile', 
            filePath: item,
            name: 'file',
            formData: {
              openid:cache.get('openid'),
            },
            success (res){
              const data = res.data         
              if(data){  
               _this.setData({
                idcard_imgs:[..._this.data.idcard_imgs,data]
               })
               if(_this.data.idcard_imgs.length==3){
                _this.setData({
                  show:false
                 })
               }
              }
            }
          })         
        })
      },
    })
  },
  //表单提交
  fromsubmit:function(e){
    var _this=this;
    let form_data=e.detail.value;//接收真实姓名和身份证号
    let card_img='';//用于接收存放照片
    this.data.idcard_imgs.map(item=>{
      card_img+=','+item;
    })
    form_data.card_img=card_img.substr(1);
    wx.request({
      url: app.globalData.url+'/api/upcard',
      method:'POST',
      data:{
        openid:cache.get('openid'),
        form_data
      },
      success:function(ret){
        let status=ret.data;
        if(status.status==1){
          _this.setData({
            truename:form_data.truename,
            card:form_data.card,
            show_from:false,
            text:'已认证成功'
          })
          wx.showToast({
            title: '认证成功',      
            icon: 'success',      
            duration: 2000//持续的时间       
          });
        }else{
          wx.showToast({
            title: status.msg,
            icon: 'none',
            duration: 2000//持续的时间
          })
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
    this.getUserinfo();
    // this.data.idcard_imgs.push(this.data.idcard_img);
  },
  getUserinfo:function(){
    var _this=this;
    wx.request({
      url: app.globalData.url+'/api/getuserinfo',
      method:'get',
      data:{
        openid:cache.get('openid')
      },
      success:function(ret){
        let user=ret.data.data;
        if(user.is_auth==1){
          _this.setData({
            truename:user.truename,
            card:user.card,
            show_from:false,
            text:'已认证成功'
          })
        }
      },
      complete(){
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