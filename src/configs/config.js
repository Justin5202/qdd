const Config = {
  API_ROOT: 'http://192.168.0.31:233',
  // API_ROOT: 'http://api.17qdd.cn',
  SDK: 'NIM_Web_SDK_v4.2.0.js',
  appkey: '36e70d80d3f6fce86566c543aa2545ca',
  loginUrl: '#/',

  // 资源路径根目录，为了方便用户部署在二级以上URL路径上
  resourceUrl: '@/assets/icon',
  // 用户logo地址
  logo: 'http://yx-web.nos.netease.com/webdoc/h5/im/logo.png',
  // 默认用户头像
  defaultUserIcon: 'http://yx-web.nos.netease.com/webdoc/h5/im/default-icon.png',
  // 系统通知图标
  noticeIcon: 'http://yx-web.nos.netease.com/webdoc/h5/im/notice-icon.png',
  // 我的手机图标
  myPhoneIcon: 'http://yx-web.nos.netease.com/webdoc/h5/im/my-phone.png',
  // 本地消息显示数量，会影响性能
  localMsglimit: 36,
  // 游戏名字
  defaultName: '宝箱'
}

module.exports = Config