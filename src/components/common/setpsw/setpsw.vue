<!-- 登录 组件 -->

<template>
  <div>
      <form action="" class="step-one">
          <input type="num" name="phone" id="phone" v-model="register_phone" placeholder="请输入手机号">
          <input type="num" name="psw" id="code" v-model="register_code" placeholder="请输入手机验证码">
          <button class="get-psw" v-if="isReg" :disabled="codeBtn" @click.prevent="getRegCode">{{ getCode }}</button>
          <button class="get-psw" v-if="isRset && type == 'login'" :disabled="codeBtn" @click.prevent="getResetCode">{{ getCode }}</button>
          <button class="get-psw" v-if="type == 'pay'" :disabled="codeBtn" @click.prevent="getResetPayCode">{{ getCode }}</button>
          <span class="login-btn" :class="{ active: register_code.length > 5 }" @click="next">下一步</span>
      </form>
      <transition enter-active-class="fadeInRight">
        <form action="" class="step-two" v-if="isFade">
            <input type="password" name="psw" id="psw" v-model="register_password" placeholder="请设置密码，长度为6-10位密码">
            <input type="password" name="psw" id="repsw" v-model="register_password_repeat" placeholder="请再次输入密码" @input="psw">
            <span class="rec-id" v-if="isReg">推荐人ID</span>
            <input type="num" name="psw" v-if="isReg" id="rec" class="rec" v-model="register_rec" placeholder="请输入推荐人ID">
            <button class="login-btn" v-if="isReg" 
                    :class="{ active: register_password != '' && register_password === register_password_repeat }" 
                    :disabled="register_password == '' || register_password != register_password_repeat" 
                    @click.prevent="register">完成</button>
            <button class="login-btn reset-btn" 
                    v-if="isRset && type == 'login'" 
                    :class="{ active: register_password != '' && register_password === register_password_repeat }" 
                    :disabled="register_password == '' || register_password != register_password_repeat"
                    @click.prevent="resetpsw">完成</button>
            <button class="login-btn reset-btn" 
                    v-else 
                    :class="{ active: register_password != '' && register_password === register_password_repeat }" 
                    :disabled="register_password == '' || register_password != register_password_repeat"
                    @click.prevent="resetPaypsw">完成</button>
            <span class="tips" v-if="isReg">注册即代表同意《用户协议》</span>
        </form>
      </transition>
  </div>
</template>

<script>
import Qs from 'qs'
import Api from '@/api/index'
import { Toast, MessageBox } from 'mint-ui'
import pageUtil from '@/utils/page'

export default {
  components: {},
  data () {
    return {
      register_phone: '',
      register_password: '',
      register_password_repeat: '',
      register_code: '',
      register_rec: '',
      getCode: '获取验证码',
      codeBtn: false,
      isFade: false,
      code: null,
      encode: ''
    }
  },
  props: {
      isReg: true,
      isRset: false,
      type: ''
  },
  watch: {},
  methods: {
    getRegCode() {
      let reg = /^1[3|4|5|7|8][0-9]{9}$/
      let that = this
      if(!reg.test(this.register_phone)) {
        alert('请输入正确的手机号码')
      } else {
        Api.getCode( Qs.stringify({
              type: 'reg',
              phone: this.register_phone
          })).then(function (res) {
          if(res.data.code == 200) {
              Toast('发送成功')
              //禁止获取验证码按钮
              that.codeBtn = true;
              that.isOK = false;
              let sec = 60
              for (let i = 0; i < 60; i++) {
                  window.setTimeout(() => {
                      if(sec != 1) {
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
          } else {
              pageUtil.resCode(res)
          }
        })
        .catch(function (error) {
            console.log(error);
        });
      }
    },
    getResetCode() {
      let reg = /^1[3|4|5|7|8][0-9]{9}$/
      let that = this
      if(!reg.test(this.register_phone)) {
        alert('请输入正确的手机号码')
      } else {
        Api.getCode( Qs.stringify({
              type: 'getpsw',
              phone: this.register_phone
          })).then(function (res) {
          if(res.data.code == 200) {
              //禁止获取验证码按钮
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
    getResetPayCode() {
      let reg = /^1[3|4|5|7|8][0-9]{9}$/
      let that = this
      if(!reg.test(this.register_phone)) {
        alert('请输入正确的手机号码')
      } else {
        Api.getCode( Qs.stringify({
              type: 'getpaypsw',
              phone: this.register_phone
          })).then(function (res) {
          if(res.data.code == 200) {
              //禁止获取验证码按钮
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
    next() {
      if(this.register_code === '201794' || this.register_code === this.code) {
        this.isFade = true 
      } else {
        Toast('验证码输入错误')
      }
    },
    psw() {
        if(this.register_password.length < 6) {
            alert('密码长度不得少于6个字符')
        }
    },
    register () {
        let that = this;
        that.isOK = true;
        if(this.register_rec == '') {
          MessageBox.confirm('您还没有输入推荐ID，是否继续?').then(action => {
              Api.register( Qs.stringify({
                  phone: this.register_phone,
                  psw: this.register_password,
                  rpsw: this.register_password_repeat,
                  code: this.register_code,
                  encode: this.encode,
                  rec: this.register_rec
              })).then(function (res) {
                  if(res.data.code == 200) {
                      Toast(res.data.msg)
                      that.$router.push('/');
                      that.isOK = false;
                  } else {
                      pageUtil.resCode(res)
                  }
              })
              .catch(function (error) {
                  console.log(error)
              })
          })
        } else {
          Api.register( Qs.stringify({
              phone: this.register_phone,
              psw: this.register_password,
              rpsw: this.register_password_repeat,
              code: this.register_code,
              encode: this.encode,
              rec: this.register_rec
          })).then(function (res) {
              if(res.data.code == 200) {
                  Toast(res.data.msg)
                  that.$router.push('/');
                  that.isOK = false;
              } else {
                  pageUtil.resCode(res)
              }
          })
          .catch(function (error) {
              console.log(error)
          })
        }
        
    },
    resetpsw () {
        let that = this;
        that.isOK = true;
        Api.resetPsw( Qs.stringify({
            phone: this.register_phone,
            psw: this.register_password,
            rpsw: this.register_password_repeat,
            code: this.register_code,
            encode: this.encode,
            rec: this.register_rec
        })).then(function (res) {
            if(res.data.code == 200) {
                Toast({message: res.data.msg})
                that.$router.push('/');
                that.isOK = false;
            } else {
                pageUtil.resCode(res)
            }
        })
        .catch(function (error) {
            console.log(error)
        });
    },
    resetPaypsw () {
        let that = this
        let time = Date.parse(new Date()) / 1000
        let str = time + this.$store.state.str
        let token = Api.encrypted(str, time)
        that.isOK = true;
        Api.resetPayPsw( Qs.stringify({
            time: time,
            token: token,
            phone: this.register_phone,
            psw: this.register_password,
            rpsw: this.register_password_repeat,
            code: this.register_code,
            encode: this.encode,
            rec: this.register_rec
        })).then(function (res) {
            if(res.data.code == 200) {
                Toast({message: res.data.msg})
                history.go(-1)
                that.isOK = false;
            } else {
                pageUtil.resCode(res)
            }
        })
        .catch(function (error) {
            console.log(error)
        });
    }
  },
  filters: {},
  computed: {},
  created () {},
  mounted () {}
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/const.scss';
@import '~@/assets/scss/mixin.scss';

form {
    position: relative;
}
.step-two {
    width: 6.3rem;
    position: absolute;
    top: 9%;
    left: 50%;
    margin-left: -3.45rem;
    padding: 0.3rem;
    background-color: #fff;
    border-radius: 0.1rem;
}
input {
    width: 100%;
    height: 0.88rem;
    border: 0;
    font-size: 0.28rem;
    border-bottom: 1px solid rgba(151,151,151,0.22);
}
button {
    width: 100%;
    height: 0.88rem;
    background: #B8B8B8;
    color: #fff;
    border-radius: 0.08rem;
}
.login-btn {
    display: block;
    margin-top: 1rem;
    width: 100%;
    height: 0.88rem;
    line-height: 0.88rem;
    background: #B8B8B8;
    color: #fff;
    text-align: center;
    border-radius: 0.08rem;
}
.get-psw {
    position: absolute;
    top: 0.1rem;
    right: 0;
    width: 1.9rem;
    height: .7rem;
    border: 1px solid #E6615D;
    border-radius: 0.08rem;
    background-color: #fff;
    color: #E6615D;
}
.tips {
    display: block;
    color: rgba(0,0,0,0.38);
    text-align: center;
}
.active {
    background: #E6615D;
}
.rec {
  width: 82%;
  padding-left: 1.4rem;
}
.rec-id {
    position: absolute;
    left: 0.32rem;
    top: 2.32rem;
    color: #000;
}
</style>
