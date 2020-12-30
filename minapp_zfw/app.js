import cache from "./utils/Cache.js"; //引入缓冲文件

App({
  globalData:{
    recommend_information:[],//推荐房源
    url:"http://175.24.116.196",//接口地址
    // url:"http://www.house1.com",
  },
  onLaunch() {
    const _this=this;
     //当缓冲中没有存储openid时  走接口获取openid
     if(!cache.has('openid')){
      // 登录请求
      wx.login({
        timeout:2000,
        success:({code})=>{
          // code有效期是5分钟
          // 发起request请求到自己的服务器
          wx.request({
            url:  _this.globalData.url+'/api/wxlogin',
            data: {code},
            method: 'GET',
            success:ret=>{
              //把获取到的openid存入到cache中
              cache.forever('openid',ret.data.data.openid);
            }
          })
        }
      })
   }
    //获取房源推荐信息
    wx.request({
      url: _this.globalData.url+'/api/gethousviewpager',
      method:"GET",
      success:function(ret){
        _this.globalData.recommend_information=ret.data.data
      }
    })
   }
})