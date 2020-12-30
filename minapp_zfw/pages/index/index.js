// pages/index/index.js
const app=getApp();
import cache from "../../utils/Cache.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swipers:[],//轮播图
    filed_group:[],//租房小组属性
    fang_rent_class:[],//租赁方式
    page:1,//默认起始页
    last_page:1,//总页数
    hous:[],//房源列表
    topnum:0,
    up_show: false,//回到顶部
    showbottom:false,//到底通知
    show: ['', '', '', ''],
    showflag: [false, false, false, false],
    arrows:['icon-xiangxia','icon-xiangxia','icon-xiangxia','icon-xiangxia'],
    province:'北京'
  },
  enscroll:function(e){
    if (e.detail.scrollTop > 300) {
      this.setData({
        up_show: true
      });
    } else {
      this.setData({
        up_show: false
      });
    }
  },
  goTop: function (e) {  // 一键回到顶部
    this.setData({
      topnum:0,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(cache.has('province')){
      this.setData({
        province:cache.get("province")
      })
    }
  },
  getProvince(){
    const _this=this;
      //位置授权
      wx.getLocation({
        type: 'wgs84',
        success (res) {
          const latitude = res.latitude
          const longitude = res.longitude
          const speed = res.speed
          const accuracy = res.accuracy
          //let _this=this;
          wx.request({
            url: app.globalData.url+'/api/getusercitybylocation',
            method:"GET",
            data:{
              latitude:latitude,
              longitude:longitude
            },
            success(ret){
              if(ret.data.status==1){
                cache.set('province',ret.data.province)
                 _this.setData({
                province:ret.data.province
              })
             }            
            }
          })
        }
      })
   },
  onShow(){
     // app.
     let _this=this;
     //获取轮播图
     wx.request({
       url: app.globalData.url+'/api/getrecommend',
       method:"GET",
       success:function(ret){
         // console.log(ret.data.data)
         _this.setData({
           swipers:ret.data.data
         })
       }
     })
     //获取租房小组属性
     wx.request({
       url: app.globalData.url+'/api/gethousattrs',
       method:"GET",
       data:{
         field_name:"fang_rent_class"
       },
       success:function(ret){
         // console.log(ret.data.data)
         _this.setData({
           fang_rent_class:ret.data.data
         })
       }
     })
       //获取租赁方式
       wx.request({
       url: app.globalData.url+'/api/gethousattrs',
       method:"GET",
       data:{
         field_name:"fang_group"
       },
       success:function(ret){
         // console.log(ret.data.data)
         _this.setData({
           filed_group:ret.data.data
         })
       }
     })
     this.fang();
     // onShow(){
       let that=this;
      
     // },
  },
  //获取房源
  fang:function(){
    let _this=this;
    if(this.data.last_page>=this.data.page){
      wx.showLoading({
        title: '加载中',
        mask:true
      })
       wx.request({
        url: app.globalData.url+'/api/gethous',
        method:"GET",
        data:{
          page:_this.data.page
        },
        success:function(ret){
          _this.setData({
            hous:[..._this.data.hous,...ret.data.data.data],
            last_page:ret.data.data.last_page,
            page:_this.data.page+1
          })
          //console.log(_this.data.hous)
          wx.hideLoading({})
        },
      })
    }else{
     _this.setData({
       showbottom:true
     })
    } 
  },
  // 遮罩
  onShadeDiv(evt) {
    let index = evt.currentTarget.dataset.index;
    let show = this.data.show;
    let showflag = this.data.showflag;
    let arrows = this.data.arrows;

    if (showflag[index]) { // 已显示，再次点击隐藏起来
      show[index] = '';
      showflag[index] = false;
      arrows[index] = 'icon-xiangxia';
    } else {
      for (let key in show) {
        if (key == index) {
          show[key] = 'now';
          showflag[key] = true;
          arrows[key] = 'icon-xiangshang';
        } else {
          show[key] = '';
          showflag[key] = false;
          arrows[key] = 'icon-xiangxia';
        }
      }
    }
    this.setData({
      show,
      showflag,
      arrows
    })
  }
})