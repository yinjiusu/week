// pages/find/find.js
import cache from "../../utils/Cache.js";
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    condition:[],//属性条件
    hous_condition:{attr:'',id:''},//房源搜索条件
    hous:[],//房源列表
    topnum:0,//置顶
    showTotop:false,//显示置顶小火箭
    showbottom:false,//是否显示底部
    page:1,//当前页
    last_page:1,//总页数
    show: ['', '', '', ''],
    showflag: [false, false, false, false],
    arrows:['icon-xiangxia','icon-xiangxia','icon-xiangxia','icon-xiangxia'],
    province:'北京'
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
   //刷新
   onRefresh(){
    //在当前页面显示导航条加载动画
    wx.showNavigationBarLoading(); 
    //显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框 (根据实际需求选择)
    wx.showLoading({
      title: '刷新中...',
    }),
    this.setData({
      hous_condition:{attr:'',id:''},//清空条件
      page:1,//页数为1
      hous:[] //清空数据
    },function(){
      this.getData();
      this.getCondition();
    })
  },
//网络请求，获取数据
getData(){
  let _this=this;
    wx.request({
      url: app.globalData.url+'/api/gethous',
      method:"GET",
      data:{
        page:_this.data.page,
        attr:_this.data.hous_condition.attr,
        id:_this.data.hous_condition.id
      },
      success(ret){
        _this.setData({
          hous:[..._this.data.hous,...ret.data.data.data],
          last_page:ret.data.data.last_page,
          page:_this.data.page+1
        })
      },
      //网络请求执行完后将执行的动作
      complete(res){
        //隐藏loading 提示框
        wx.hideLoading();
        //隐藏导航条加载动画
        wx.hideNavigationBarLoading();
        //停止下拉刷新
        wx.stopPullDownRefresh();
    }
  })
},
/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh: function () {
    //调用刷新时将执行的方法
  this.onRefresh();
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
    wx.showLoading({
      title: '加载中',
    })
    this.getCondition();
    this.getData();
  },
  
  //获取属性
  getCondition:function(){
    let _this=this;
    wx.request({
      url: 'http://www.house1.com/api/getcondition',
      method:"GET",
      success(ret){
        // console.log(ret.data);
        _this.setData({
          condition:ret.data
        })
      }
    })
  },
  //房源属性选择
  shareByhousattr:function(e){
    let attr=e.target.dataset.attr;//接到字段名
    let id=e.target.dataset.id;//接到字段对应的id
    let _this=this;
    wx.request({
      url: app.globalData.url+'/api/gethous',
      method:"GET",
      data:{
        attr:attr,
        id:id
      },
      success(ret){
        _this.setData({
          hous:ret.data.data.data,
          hous_condition:{attr:attr,id:id},
          show: ['', '', '', ''],
          showflag: [false, false, false, false],
           arrows:['icon-xiangxia','icon-xiangxia','icon-xiangxia','icon-xiangxia']
        })
      }
    })
  },
  // 遮罩
  onShadeDiv(evt) {
    let index = evt.currentTarget.dataset.index;
    let show = this.data.show;
    let showflag = this.data.showflag;
    let arrows = this.data.arrows;

    if(showflag[index]){ // 已显示，再次点击隐藏起来
      show[index] = '';
      showflag[index] = false;
      arrows[index] = 'icon-xiangxia';
    }else{
      for(let key in show){
        if(key == index){
          show[key] = 'now';
          showflag[key] = true;
          arrows[key] = 'icon-xiangshang';
        }else{
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