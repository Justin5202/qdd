<!-- 登录 组件 -->

<template>
  <div class="login">
      <top-bar txt="登录"></top-bar>
      <div class="mask" v-if="maskShow"></div>
      <div class="content">
          <div>
              <form action="" :model="loginForm">
                  <input type="num" name="phone" id="phone" v-model="loginForm.login_phone" placeholder="请输入手机号">
                  <input type="password" name="psw" id="psw" v-model="loginForm.login_password" placeholder="请输入密码">
                  <div class="auto-login">
                    <mt-switch v-model="autologin">自动登录</mt-switch>
                  </div>
                  <button class="login-btn" v-bind:class="{ active: loginForm.login_password.length >= 6 }" :disabled="loginForm.login_password.length < 6" @click.prevent="login">登录</button>
              </form>
              <div class="psw-service clearfix">
                  <router-link tag="span" class="forgot fl" to="/resetpsw/login">忘记密码</router-link>
                  <router-link tag="span" class="register fr" to="/register">注册</router-link>
              </div>
          </div>
          <div class="other-login">
            <p>其他方式登录</p>
            <div class="wx-login">
              <i class="icon-wx" @click="wxLogin"></i>
              <p>微信登录</p>
            </div>
          </div>
          <div class="version">
            <p>版本号：1.0.3</p>
          </div>
      </div>
      <!-- 提示框 -->
      <div class="tips" v-if="isShow">
        <p>更新提示</p>
        <span>您必须更新到最新版本才能使用</span>
        <button class="big-btn" @click="download">立即升级</button>
      </div>
      <!-- 首次微信进入绑定提示 -->
      <div class="bind-box" v-if="bindShow">
        <form action="" class="step-one">
          <input type="num" class="bind-input" name="phone" id="phone" v-model="bind_phone" placeholder="请输入手机号">
          <input type="num" class="bind-input" name="psw" id="code" v-model="bind_code" placeholder="请输入手机验证码">
          <button class="get-psw" :disabled="codeBtn" @click.prevent="getBindCode">{{ getCode }}</button>
          <span class="btn big-btn bind-btn" :class="{active: bind_code.length > 5}" @click="bind">绑定</span>
      </form>
      </div>
      <!-- <mt-progress :value="60">
          <div slot="start">0%</div>
          <div slot="end" class="end">60%</div>
      </mt-progress> -->
  </div>
</template>

<script>
import TopBar from '@/components/common/top-bar/top-bar'
import Api from '@/api/index'
import Axios from 'axios'
import Qs from 'qs'
import pageUtil from '@/utils/page'
import cookie from '@/utils/cookie'
import { Toast, Progress, Switch, MessageBox } from 'mint-ui'
import wx from 'weixin-js-sdk'

export default {
  components: {
    TopBar
  },
  beforeMount () {
    if(localStorage.getItem('phone') && localStorage.getItem('psw')) {
      this.loginForm.login_phone = localStorage.getItem('phone')
      this.loginForm.login_password = localStorage.getItem('psw')
    }
  },
  data () {
    return {
      loginForm: {
        login_phone: '',
        login_password: ''
      },
      disabled: true,
      show: false,
      isShow: false,
      maskShow: false,
      bindShow: false,
      token: '',
      autologin: true,
      downUrl: '',
      auths: null,
      wxInfo: '',
      bind_phone: '',
      bind_code: '',
      codeBtn: false,
      getCode: '获取验证码',
      code: null,
      encode: ''
    }
  },
  props: {},
  watch: {},
  methods: {
    login () {
      let that = this;
      let reg = /^1[3|4|5|7|8][0-9]{9}$/
      if (this.token) {
          this.$store.commit(types.LOGIN, this.token)
          let redirect = decodeURIComponent(this.$route.query.redirect || '/');
          this.$router.push({
              path: redirect
          })
      } else if(!reg.test(this.loginForm.login_phone)) {
          alert('请输入正确的手机号码')
      } else {
        this.$store.state.nim = null
        this.$store.dispatch('showLoading')
        Api.login(
            Qs.stringify({
                type: 2,
                phone: this.loginForm.login_phone,
                psw: this.loginForm.login_password
        })).then(res => {
            if(res.data.code == 200) {
                // let tokenStr = '||===||'+ res.data.data.uid +'||===||'+ this.loginForm.login_phone +'||===||'+  Api.md(this.loginForm.login_password)
                let tokenStr = '||===||'+ res.data.data.uid +'||===||'+ this.loginForm.login_phone +'||===||'
                cookie.setCookie('tokenStr', tokenStr)
                if(that.autologin) { //勾选自动登录，保存登录信息
                  localStorage.setItem('phone', that.loginForm.login_phone)
                  localStorage.setItem('psw', that.loginForm.login_password)
                }
                // localStorage.setItem('tokenStr', tokenStr)
                this.$store.commit('updateStr', tokenStr)
                cookie.setCookie('uid', res.data.data.acid)
                cookie.setCookie('sdktoken', res.data.data.token)
                localStorage.setItem('uid', res.data.data.acid)
                localStorage.setItem('sdktoken', res.data.data.token)
                that.$store.dispatch('connect')
            } else {
                this.$store.dispatch('hideLoading')
                pageUtil.resCode(res)
            }
        }).catch(err => {
            console.log(err)
        })
      }
      
    },
    autoLogin (loginInfo) {
      let that = this
      this.$store.dispatch('showLoading')
      Api.login(
        Qs.stringify({
          type: 2,
          phone: loginInfo.phone,
          psw: loginInfo.psw
      })).then(function (res) {
        that.$store.dispatch('hideLoading')
          if(res.data.code == 200) {
            // let tokenStr = '||===||'+ res.data.data.uid +'||===||'+ loginInfo.phone +'||===||'+  Api.md(loginInfo.psw)
            let tokenStr = '||===||'+ res.data.data.uid +'||===||'+ loginInfo.phone +'||===||'
            cookie.setCookie('tokenStr', tokenStr)
            that.$store.commit('updateStr', tokenStr)
            cookie.setCookie('uid', res.data.data.acid)
            cookie.setCookie('sdktoken', res.data.data.token)
            localStorage.setItem('uid', res.data.data.acid)
            localStorage.setItem('sdktoken', res.data.data.token)
            that.$store.dispatch('connect')
          } else {
            // that.isShow = true
          }
      })
      .catch(function (error) {
        pageUtil.resCode(res)
      })
    },
    download () {
      plus.runtime.openURL( this.downUrl )
    },
    weixinLogin (info, phone, psw) {
      let that = this
      let telphone = localStorage.getItem('bindPhone')
      let password = psw
      let reg = /^1[3|4|5|7|8][0-9]{9}$/
      this.$store.dispatch('showLoading')
      Api.wxLogin(
        Qs.stringify({
          openid: info.openid,
          nickname: info.nickname,
          header: info.headimgurl,
          phone: telphone,
          psw: password,
          code: this.bind_code,
          encode: this.encode,
      })).then(function (res) {
          if(res.data.code == 200) {
            if(that.autologin) { //勾选自动登录，保存登录信息
              localStorage.setItem('wxpsw', password)
            }
            // let tokenStr = '||===||'+ res.data.data.uid +'||===||'+ telphone +'||===||'+  Api.md(password)
            let tokenStr = '||===||'+ res.data.data.uid +'||===||'+ telphone +'||===||'
            cookie.setCookie('tokenStr', tokenStr)
            that.$store.commit('updateStr', tokenStr)
            cookie.setCookie('uid', res.data.data.acid)
            cookie.setCookie('sdktoken', res.data.data.token)
            localStorage.setItem('uid', res.data.data.acid)
            localStorage.setItem('sdktoken', res.data.data.token)
            that.$store.dispatch('connect')
          } else if(res.data.code == 201) {
            that.maskShow = true
            that.bindShow = true
          } else {
            pageUtil.resCode(res)
          }
      })
      .catch(function (error) {
        
      })
    },
    getBindCode() {
      let reg = /^1[3|4|5|7|8][0-9]{9}$/
      let that = this
      if(!reg.test(this.bind_phone)) {
        Toast('请输入正确的手机号码')
      } else {
        Api.getCode( Qs.stringify({
              type: 'wxlogin',
              phone: this.bind_phone
          })).then(function (res) {
          if(res.data.code == 200) {
              //禁止获取验证码按钮
              localStorage.setItem('bindPhone', that.bind_phone)
              that.codeBtn = true;
              that.isOK = false;
              let sec = 60
              for (let i = 0; i < 60; i++) {
                  window.setTimeout(() => {
                      if(sec != 0) {
                          that.getCode = '重新发送(' + sec + ')'
                          sec--
                      } else {
                        sec = 60
                        that.getCode = '获取验证码'
                        that.codeBtn = false
                      }
                  }, i * 1000)
              }
              that.code = res.data.data.code
              that.encode = Api.encrypted(res.data.data.code)
              Toast('发送成功')
          } else {
              pageUtil.resCode(res)
          }
        })
        .catch(function (error) {
            console.log(error);
        });
      }
    },
    bind () {
      if(this.bind_code === '201794' || this.bind_code === this.code) {
        this.weixinLogin(this.wxInfo, this.bind_phone, this.wxInfo.openid.substr(6, 20))
      } else {
        Toast('验证码输入错误')
      }
    },
    wxLogin () {
      let auths = this.auths
      let that = this
      // that.weixinLogin()
      plus.oauth.getServices(function(services) {
        auths = services;
        for(var k in auths) {
          console.log(auths[k].id)
        }
        var s;
        for (var i = 0; i < auths.length; i++) {
          if (auths[i].id == 'weixin'){
           s = auths[i];
           break; 
          }
        }
        
        if(!s.authResult) {
          s.login(function(e){
            // 获取登录操作结果
            s.getUserInfo( function(e){
              mui.toast('登录成功')
              localStorage.setItem('wxuserinfo', s.userInfo)
              that.wxInfo = s.userInfo
              that.weixinLogin(s.userInfo)
              that.$store.commit('updateWxLoginInfo', s.userInfo)
            }, function(e){
              mui.toast('获取用户信息失败')
            })
          }, function(e){
            alert('1' + JSON.stringify(e))
            mui.toast('登录认证失败')
          })
        } else {
          //已经登录认证
          mui.toast('登录成功')
          that.wxInfo = that.wxLoginedInfo
          that.weixinLogin(that.wxLoginedInfo)
        }
     
      }, function(e){
        mui.toast('登录认证失败')
      })
    }
  },
  filters: {},
  computed: {
    wxLoginedInfo () {
      return this.$store.state.wxLoginInfo
    }
  },
  created () {},
  mounted () {
    let loginInfo = {
      phone: localStorage.getItem('phone'),
      psw: localStorage.getItem('psw')
    }
    let wxLogin = {
      wxuserinfo: localStorage.getItem('wxuserinfo'),
      phone: localStorage.getItem('bindPhone'),
      psw: localStorage.getItem('wxpsw'),
    }
    let that = this
    let time = Date.parse(new Date()) / 1000
    let str = time + this.$store.state.str
    let token = Api.encrypted(str, time)
    this.$store.dispatch('showLoading')
    Api.checkVer(
      Qs.stringify({
        time: time,
        token: token,
        ver: '1.0.3'
    })).then(function (res) {
        that.$store.dispatch('hideLoading')
        if(res.data.code == 200 || res.data.code == 201) {
          if(loginInfo.phone != null && loginInfo.psw != null) {
            that.autoLogin(loginInfo)
          } else if(wxLogin.phone != null && wxLogin.psw != null) {
            that.weixinLogin (wxLogin.wxuserinfo, wxLogin.phone, wxLogin.psw)
          }
        } else {
          localStorage.setItem('version', res.data.data.version)
          that.isShow = true
          that.maskShow = true
          that.downUrl = res.data.data.down
        }
    })
    .catch(function (error) {
      console.log(error);
    })

    let first = null
    mui.back = function() {
        //首次按键，提示‘再按一次退出应用’
        if (!first) {
            first = new Date().getTime();//记录第一次按下回退键的时间
            mui.toast('再按一次退出应用');
            setTimeout(function() {//1s中后清除
                first = null;
            }, 1000);
        } else {
            if (new Date().getTime() - first < 1000) {//如果两次按下的时间小于1s，
                plus.runtime.quit();//那么就退出app
          } 
        } 
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/const.scss';
@import '~@/assets/scss/mixin.scss';
.login {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    background-color: #f7f7f7;
}
.content {
    height: 10.7rem;
    margin: 1.2rem 0.3rem 0 0.3rem;
    padding: 0.3rem;
    background: #FFFFFF;
    box-shadow: 0 0.02rem 0.04rem 0 rgba(0,0,0,0.18);
    border-radius: 0.1rem;
    position: relative;
    .auto-login {
      padding-top: 0.2rem;
    }
}
.login-btn {
    margin-top: 0.8rem;
    width: 100%;
    height: 0.88rem;
    background: #B8B8B8;
    color: #fff;
    border-radius: 0.08rem;
}
input {
    width: 100%;
    height: 0.88rem;
    border: 0;
    font-size: 0.28rem;
    border-bottom: 1px solid rgba(151,151,151,0.22);
}
.active {
    background: #E6615D;
}
.psw-service {
    margin-top: 0.2rem;
    font-size: 0.24rem;
    .foget {
        color: rgba(0,0,0,0.38);
    }
    .register {
      color: #E6615D;
    }
}
.tips {
  position: absolute;
  top: 35%;
  left: 50%;
  width: 80%;
  margin-left: -40%;
  padding: 0.2rem 0;
  text-align: center;
  background-color: #fff;
  border-radius: 0.08rem;
  z-index: 999;
  p {
    font-size: 0.36rem;
  }
  span {
    display: block;
    padding: 0.2rem 0;
  }
  button {
    width: 80%;
    border-radius: 0.08rem;
  }
}
.other-login {
  padding-top: 1.6rem;
  text-align: center;
  font-size: 0.3rem;
  .wx-login {
    margin-top: 0.8rem;
    .icon-wx {
      margin: 0 auto;
      display: block;
      width: 1rem;
      height: 1rem;
      background: url('../../../assets/icon/wx.png') no-repeat;
      background-size: 100%;
    }
    p {
      padding: 0.3rem 0;
      font-size: 0.24rem;
    }
  }
}
.version {
  position: absolute;
  bottom: 0.7rem;
  right: 0.03rem;
  color: #999;
}
.bind-box {
  padding: 0.2rem;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -1.63rem;
  margin-left: -3.2rem;
  width: 80%;
  z-index: 23;
  background-color: #fff;
  border-radius: 0.08rem;
}
.bind-input {
  width: 100%;
  height: 0.88rem;
  border: 0;
  font-size: 0.28rem;
  border-bottom: 1px solid rgba(151,151,151,0.22);
}
.get-psw {
    position: absolute;
    top: 0.28rem;
    right: 0.25rem;
    width: 1.9rem;
    height: .7rem;
    border: 1px solid #E6615D;
    border-radius: 0.08rem;
    background-color: #fff;
    color: #E6615D;
}
.bind-btn {
  display: block;
  margin-top: 0.2rem;
  background: #B8B8B8;
  text-align: center;
}
.active {
    background: #E6615D;
}
</style>
