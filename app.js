//app.js
App({
  globalData: {
    appid: "wx356c38b936e71084",
    secret:"35935a5c5a144d3d587563916895e1e6",
    userInfo: null,
    userId: null,
    isLogin: false,
    token: null,
    userPic:null,
    nickName:null,
    userInfo:null
  },
  onLaunch: function() {
    var that=this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          console.log(res.code);
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + that.globalData.appid + '&secret=' + that.globalData.secret + '&js_code=' + res.code + '&grant_type=authorization_code',
            success: function(result) {
              console.log(result)
              var data = result.data;
              if (result.data.openid!=null){
                that.globalData.userId = result.data.openid;
                wx.getUserInfo({
                  success:function(res){
                    that.globalData.nickName = res.userInfo.nickName;
                    that.globalData.userPic = res.userInfo.avatarUrl;
                    that.globalData.userInfo = res.userInfo;

                    console.log(res.userInfo);
                    wx.request({
                      url: 'https://www.huaxinapp.xyz/api/user/userLogin.do?userId=' + that.globalData.userId,
                      method: 'POST',
                      success: function (result) {
                        var data = result.data;
                        console.log(result);
                        if(data.success){
                          console.log(result);
                          that.globalData.token=data.value.token;
                          console.log(that.globalData.token);

                        }
                        else if (data.error == 'user not exist') {
                          //用户未注册 所以要调用新增用户接口
                          console.log(data.error);
                          wx.request({
                            url: 'https://www.huaxinapp.xyz/api/user/createUser.do',
                            method: 'POST',
                            header: {
                              'content-type': 'application/json',

                            },
                            data: {
                              userId: that.globalData.userId,
                              nickname: that.globalData.nickName,
                              userPic: that.globalData.userPic
                            },

                          })



                        }


                      }

                    })











                  }
                })
               

                





              }

              

            }
          })



        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
 
})