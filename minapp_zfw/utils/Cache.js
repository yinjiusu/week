// 缓存类
class Cache {
  // 构造方法 单位秒
  constructor({ expire = 3600 }) {
    // 成员属性  过期时间
    // 毫秒
    this.expire = new Date().getTime() + expire * 1000;
  }
  // 设置
  set(key, value) {
    let data = { expire: this.expire, value };
    // 设置缓存
    wx.setStorageSync(key, data);
  }
  // 永久
  forever(key, value) {
    let expire = new Date().getTime() + 9999999999 * 1000;
    let data = { expire, value };
    // 设置缓存
    wx.setStorageSync(key, data);
  }
  // 判断是否存在缓存
  has(key) {
    // 获取当前时间
    let time = new Date().getTime();
    // 缓存数据
    let data = wx.getStorageSync(key);
    if (data != '') {
      if (time > data.expire) {  // 缓存过期
        // 删除过期缓存
        wx.removeStorageSync(key);
        return false;
      }
      return true;
    }
    return false;
  }
  // 获取
  get(key) {
    if (this.has(key)) {
      return wx.getStorageSync(key).value;
    }
    return null;
  }
  // 删除
  del(key) {
    wx.removeStorageSync(key);
  }
}
// 导出 有效期1小时
export default new Cache({ expire: 3600 });