<template>
    <li class="u-msg"
    :class="{
      'item-me': msg.flow==='out',
      'item-system': msg.flow==='system',
      'item-you': msg.flow==='in',
      'item-time': msg.type==='timeTag',
      'item-tip': msg.type==='tip',
      'session-chat': type==='session'
    }">
    <div v-if="msg.type==='timeTag'">{{msg.showText}}</div>
    <div v-else-if="msg.type==='tip'" class="tip">{{msg.showText}}</div>
    <div
      v-else-if="msg.flow==='in' || msg.flow==='out' || msg.flow==='system'"
      :idClient="msg.idClient"
      :time="msg.time"
      :flow="msg.flow"
      :type="msg.type"
      v-touch:hold="revocateMsg"
      class="clearfix">

      <a 
        class="msg-head" 
        v-if="msg.avatar && msg.type == 'text' || msg.type == 'redbag' || msg.type == 'invite'"
        @click="getUserInfo(msg.from)" >
        <img :src="msg.avatar">
      </a>
      <p class="msg-user" v-else-if="msg.type!=='notification' && msg.type == 'text' || msg.type == 'redbag' || msg.type == 'invite'"><em>{{msg.showTime}}</em>{{msg.from}}</p>
      <span v-if="msg.flow==='in' && msg.type == 'text' || msg.type == 'redbag'" class="nickname" v-html="msg.fromNick"></span>
      <span v-else-if="msg.flow==='out' && msg.type == 'text' || msg.type == 'redbag' || msg.type == 'invite'" class="nickname" v-html="msg.fromNick"></span>
      <span v-if="msg.type==='text'" class="msg-text" v-html="msg.showText"></span>
      <span v-else-if="msg.type==='custom-type1'" class="msg-text" ref="mediaMsg"></span>
      <span v-else-if="msg.type==='custom-type3'" class="msg-text" ref="mediaMsg"></span>
      <!-- <span v-else-if="msg.type==='image'" class="msg-text" ref="mediaMsg" @click.stop="showFullImg(msg.originLink)"></span> -->
      <!-- <span v-else-if="msg.type==='video'" class="msg-text" ref="mediaMsg"></span> -->
      <!-- <span v-else-if="msg.type==='audio'" class="msg-text" @click="playAudio(msg.audioSrc)">{{msg.showText}}</span> -->
      <!-- <span v-else-if="msg.type==='file'" class="msg-text"><a :href="msg.fileLink" target="_blank"><i class="u-icon icon-file"></i>{{msg.showText}}</a></span> -->
      <span v-else-if="msg.type==='redbag'" class="msg-text redbag-text" @click="openRedBag(msg.bid)">
        <i class="u-icon icon-hb"></i>
        <span class="redbag-word">
          <span v-if="msg.from == 'qdd@phone@0' && msg.rtype == 2">
            <span v-if="msg.gtype == 1">（最大）</span><span v-else>（最小）</span>定庄宝箱</span>
          <span v-else-if="msg.rtype == 1">恭喜发财，大吉大利</span>
          <span v-else-if="(msg.thunder == 0 || msg.thunder) && msg.rtype == 2">中雷尾号为（{{ msg.thunder }}）</span><br>领取宝箱
        </span>
      </span>
      <span v-else-if="msg.type==='robot'" class="msg-text" :class="{'msg-robot': msg.robotFlow!=='out' && !isRobot}">
        <div v-if="msg.robotFlow==='out'">{{msg.showText}}</div>
        <div v-else-if="msg.subType==='bot'">
          <!-- 多次下发的机器人消息 -->
          <div v-for="tmsgs in msg.message">
            <!-- 多个机器人模板 -->
            <div v-for="tmsg in tmsgs">
              <div v-if="tmsg.type==='text'">
                <p>{{tmsg.text}}</p>
              </div>
              <div v-else-if="tmsg.type==='image'">
                <p>
                  <img :src="tmsg.url">
                </p>
              </div>
              <div v-else-if="tmsg.type==='url'">
                <a :class="tmsg.style" :href="tmsg.target" target="_blank">
                  <div v-if="tmsg.image">
                    <p v-for="tmsg2 in tmsg.image">
                      <img :src="tmsg2.url">
                    </p>
                  </div>
                  <div v-if="tmsg.text">
                    <p v-for="tmsg2 in tmsg.text">{{tmsg2.text}}</p>
                  </div>
                </a>
              </div>
              <div v-else-if="tmsg.type==='block'">
                <a :class="tmsg.style" :params="tmsg.params" :target="tmsg.target" @click="sendRobotBlockMsg(tmsg, msg)">
                  <div v-if="tmsg.image">
                    <p v-for="tmsg2 in tmsg.image">
                      <img :src="tmsg2.url">
                    </p>
                  </div>
                  <div v-if="tmsg.text">
                    <p v-for="tmsg2 in tmsg.text">{{tmsg2.text}}</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="msg.subType==='faq'">
          <!--p>{{msg.message.question}}</p-->
          <p>{{msg.message.answer}}</p>
        </div>
        <span v-if="msg.robotFlow!=='out' && !isRobot" class="msg-link">
          <a class="link-right" @click="continueRobotMsg(msg.content.robotAccid)">继续对话</a>
        </span>
      </span>
      <span v-else-if="msg.type==='notification'" class="notify">{{msg.showText}}</span>
      <span v-else-if="msg.type==='whoGeted'" class="notify whoGeted">
        <span class="icon-shb"></span>
        {{msg.showText}}
      </span>
      <span v-else-if="msg.type==='thunder'" class="notify thunder">
        {{msg.showText}}
      </span>
      <span 
        v-else-if="msg.type==='invite'" 
        class="msg-text invite-text" 
        @click="enterRoom(msg.room)">
          <span v-if="msg.from === myInfo.acid">你邀请了 {{msg.toName}} 加入游戏</span>
          <span v-else>{{msg.fromNick}} 邀请你加入游戏<br></span>
          <span class="room-info" v-if="msg.room.rtype == 1">房间类型：{{msg.room.name}}接龙房间</span>
          <span class="room-info" v-else-if="msg.room.rtype == 2">房间类型：{{msg.room.name}}扫雷房间</span>
          <span class="room-info">房间倍数：{{msg.room.gold / 100}}豆{{msg.room.number}}包{{msg.room.multiple}}倍</span>
          <span class="room-info">点击进入</span>
      </span>
      <span v-if="msg.status==='fail'" class="msg-failed"><i class="weui-icon-warn"></i></span>
    </div>
  </li>
</template>

<script type="text/javascript">
  import Vue from 'vue'
  import Sendredbag  from '@/components/common/sendRedBag/sendRedBag'
  import util from '../../../utils'
  import config from '@/configs/config'
  import emojiObj from '@/configs/emoji'
  import Qs from 'qs'
  import Api from '@/api/index'
  import pageUtil from '@/utils/page'
  import {Toast} from 'mint-ui'

  export default {
    components: {
      Sendredbag
    },
    props: {
      type: String, // 类型，chatroom, session
      rawMsg: {
        type: Object,
        default () {
          return {}
        }
      },
      userInfos: {
        type: Object,
        default () {
          return {}
        }
      },
      myInfo: {
        type: Object,
        default () {
          return {}
        }
      },
      isRobot: {
        type: Boolean,
        default () {
          return false
        }
      },
    },
    data () {
      return {
        msg: '',
        isFullImgShow: false,
        currentAudio: null
      }
    },
    computed: {
      robotInfos () {
        return this.$store.state.robotInfos
      },
      currSession () {
        return this.$store.state.currSession
      },
      lists () {
        return this.$store.state.currentTeamMember
      }
    },
    beforeMount () {
      let item = Object.assign({}, this.rawMsg),
          that = this
      // 标记用户，区分聊天室、普通消息
      if (this.type === 'session') {
        if (item.flow === 'in') {
          // if (item.type === 'robot' && item.content && item.content.msgOut) {
          //   // 机器人下行消息
          //   let robotAccid = item.content.robotAccid
          //   item.avatar = this.robotInfos[robotAccid].avatar
          //   item.isRobot = true
          //   item.link = `#/namecard/${robotAccid}`
          // } else 
          if (item.from !== this.$store.state.userUID) {
            item.avatar = (this.userInfos[item.from] && this.userInfos[item.from].avatar) || config.defaultUserIcon
            // item.link = `#/namecard/${item.from}`
          } else {
            item.avatar = this.myInfo.avatar
          }
        } else if (item.flow === 'out') {
          item.avatar = (this.myInfo.avatar) || config.defaultUserIcon
        } else {
          item.avatar = config.defaultUserIcon
          item.fromNick = '系统'
          item.flow = 'system'
        }
      } else {
        // 标记时间，聊天室中
        item.showTime = util.formatDate(item.time)
      }
      if (item.type === 'timeTag') {
        // 标记发送的时间
        item.showText = item.text
      } else if (item.type === 'text') {
        // 文本消息
        item.showText = util.escape(item.text)
        if (/\[[^\]]+\]/.test(item.showText)) {
          let emojiItems = item.showText.match(/\[[^\]]+\]/g)
          emojiItems.forEach(text => {
            let emojiCnt = emojiObj.emojiList.emoji
            if (emojiCnt[text]) {
              item.showText = item.showText.replace(text, `<img class="emoji-small" style="width: 0.56rem;vertical-align: middle;" src="${emojiCnt[text].img}">`)
            }
          })
        }
      } else if (item.type === 'custom') {
        let content = JSON.parse(item.content)
        // type 1 为猜拳消息
        // if (content.type === 1) {
        //   let data = content.data
        //   let resourceUrl = config.resourceUrl
        //   // item.showText = `<img class="emoji-middle" src="${resourceUrl}/im/play-${data.value}.png">`
        //   item.type = 'custom-type1'
        //   item.imgUrl = `${resourceUrl}/im/play-${data.value}.png`
        // // type 3 为贴图表情
        // } else 
        if (content.type === 3) {
          let data = content.data
          let emojiCnt = ''
          if (emojiObj.pinupList[data.catalog]) {
            emojiCnt = emojiObj.pinupList[data.catalog][data.chartlet]
            // item.showText = `<img class="emoji-big" src="${emojiCnt.img}">`
            item.type = 'custom-type3'
            item.imgUrl = `${emojiCnt.img}`
          }
        } else if (content.type === 'bag') {
          let data = content.data
          item.bid = data.bid
          item.type = 'redbag'
          if(data.thunder || data.thunder == 0) {
            item.thunder = data.thunder
          }
          item.rtype = this.currSession.rtype
          item.gtype = data.type
        } else if (content.type === 'give') {
          item.type = 'give'
          if(content.uid == that.myInfo.id) {
            that.$store.commit('updateSolitaireRedBagInfo', content)
          }
        } else if (content.type === 'post') {
          item.type = 'post'
          if(content.uid == that.myInfo.id) {
            that.$store.commit('updateJlRedBagInfo', content)
          }
        } else if (content.type === 'whoGeted') {
          item.type = 'whoGeted'
          item.showText = content.nickname + '开了一个宝箱'
        } else if (content.type === 'winning') {
          if(this.currSession.rtype == 1 && this.currSession.uid > 0) {
            item.type = 'whoGeted'
            item.showText = item.fromNick + ' 中包啦!'
          } else if(this.currSession.rtype == 2){
            item.type = 'whoGeted'
            item.showText = item.fromNick + ' 中雷啦!'
          }
        } else if (content.type === 'winbag') {
          if(this.currSession.rtype == 1 && this.currSession.uid == 0) {
            item.type = 'whoGeted'
            item.showText = item.fromNick + ' 中包啦!'
          } else if(this.currSession.rtype == 2){
            item.type = 'whoGeted'
            item.showText = item.fromNick + ' 中雷啦!'
          }
        } else if (content.type === 'smallSpeaker') {
          item.type = 'smallSpeaker'
        } else if (content.type === 'thunder') {
          item.type = 'thunder'
          item.showText = '该宝箱中雷尾号为' + content.thunder
        } else if (content.type === 'invite') {
          item.type = 'invite'
          item.room = content.room
          item.toName = content.toName
        } else if (content.type === 'gift') {
          item.type = 'text'
          if(content.fromId == that.myInfo.id) {
            item.showText = `你赠送给了${content.to}${content.num}金豆`
          } else {
            item.showText = `${content.from}赠送了${content.num}金豆给你`
          }
        } else if (content.type === 'remind') {
          item.type = 'notification'
          item.showText = content.content
        } else {
          item.showText = util.parseCustomMsg(item)
          if (item.showText !== '[自定义消息]') {
            item.showText += ',请到手机或电脑客户端查看'
          }
        }
      } 
      // else if (item.type === 'image') {
      //   // 原始图片全屏显示
      //   item.originLink = item.file.url
      // } else if (item.type === 'video') {
      //   // ...
      // } else if (item.type === 'audio') {
      //   item.audioSrc = item.file.mp3Url
      //   item.showText = Math.round(item.file.dur / 1000) + '" 点击播放'
      // } else if (item.type === 'file') {
      //   item.fileLink = item.file.url
      //   item.showText = item.file.name
      else if (item.type === 'notification') {
        //对于系统通知，更新下用户信息的状态
        let that = this
        item.avatar = null
        item.showText = util.generateGroupSysMsg(item)
        if(item.attach) {
          if(item.attach.type == "updateTeamMute") {
            if(item.attach.mute) {
              if(item.attach.account == that.myInfo.acid) {
                  item.showText = '"你" 已被管理员禁言'
              } else {
                for(let i in that.lists.user) {
                  if(item.attach.account == that.lists.user[i].acid) {
                    item.showText = '"' + that.lists.user[i].nickname + '" 已被管理员禁言'
                  }
                }
              }  
            } else {
              if(item.attach.account == that.myInfo.acid) {
                  item.showText = '"你" 已被管理员解除禁言'
              } else {
                for(let i in that.lists.user) {
                  if(item.attach.account == that.lists.user[i].acid) {
                    item.showText = '"' + that.lists.user[i].nickname + '" 禁言已被管理员解除'
                  }
                }
              }
            }
          } 
        }
      } 
      else if (item.type === 'tip') {
        //对于系统通知，更新下用户信息的状态
        item.showText = item.tip
      }
      // else if (item.type === 'robot') {
      //   let content = item.content || {}
      //   let message = content.message || []
      //   if (!content.msgOut) {
      //     // 机器人上行消息
      //     item.robotFlow = 'out'
      //     item.showText = item.text
      //   } else if (content.flag === 'bot') {
      //     item.subType = 'bot'
      //     message = message.map(item => {
      //       if (item.type === 'template') {
      //         // 在vuex(store/actions/msgs.js)中已调用sdk方法做了转换
      //         return item.content.json
      //       } else if (item.type === 'text' || item.type === 'answer') {
      //         // 保持跟template结构一致
      //         return [{
      //           type: 'text',
      //           text: item.content
      //         }]
      //       } else if (item.type === 'image') {
      //         // 保持跟template结构一致
      //         return [{
      //           type: 'image',
      //           url: item.content
      //         }]
      //       }
      //     })
      //     item.message = message
      //   } else if (item.content.flag === 'faq') {
      //     item.subType = 'faq'
      //     item.query = message.query
      //     let match = message.match.sort((a, b) => {
      //       // 返回最匹配的答案
      //       return b.score - a.score
      //     })
      //     item.message = match[0]
      //   }
      // } 
      else {
        item.showText = `[${util.mapMsgType(item)}],请到手机或电脑客户端查看`
      }
      this.msg = item
    },
    mounted () {
      let item = this.msg
      // 有时序问题的操作
      this.$nextTick(() => {
        let media = null
        // if (item.type === 'image') {
        //   // 图片消息缩略图
        //   media = new Image()
        //   media.src = item.file.url + '?imageView&thumbnail=180x0&quality=85'
        // } else if (item.type === 'custom-type1') {
        //   // 猜拳消息
        //   media = new Image()
        //   media.className = 'emoji-middle'
        //   media.src = item.imgUrl
        // } else 
        if (item.type === 'custom-type3') {
          // 贴图表情
          media = new Image()
          media.className = 'emoji-big'
          media.src = item.imgUrl
        } else if (item.type === 'video') {
          if (/(mov|mp4|ogg|webm)/i.test(item.file.ext)) {
            media = document.createElement('video')
            media.src = item.file.url
            media.width = 640
            media.height = 480
            media.autoStart = false
            media.preload = 'metadata'
            media.controls = 'controls'
          } else {
            let aLink = document.createElement('a')
            aLink.href = item.file.url
            aLink.target = '_blank'
            aLink.innerHTML = `<i class="u-icon icon-file"></i>${video.name}`
            this.$refs.mediaMsg.appendChild(aLink)
          }
        }
        if (media) {
          if (this.$refs.mediaMsg) {
            this.$refs.mediaMsg.appendChild(media)
          }
          media.onload = () => {
            this.$emit('msg-loaded')
          }
          media.onerror = () => {
            this.$emit('msg-loaded')
          }
        } else {
          this.$emit('msg-loaded')
        }
      }) // end this.nextTick
    },
    methods: {
      getUserInfo (item) {
        if(item == "qdd@phone@0") {
          return
        }
        if(item !== this.myInfo.acid) {
          this.$router.push(`/userinfo/${item}`)
        } else {
          this.$router.push(`/mine`)
        }
      },
      revocateMsg (vNode) {
        // 在会话聊天页
        if (this.$store.state.currSessionId) {
          if (vNode && vNode.data && vNode.data.attrs) {
            let attrs = vNode.data.attrs
            if (attrs.type === 'robot') {
              return
            }
            // 自己发的消息
            if (attrs.flow === 'out') {
              let that = this
              this.$vux.confirm.show({
                title: '确定需要撤回消息',
                onCancel () {
                },
                onConfirm () {
                  that.$store.dispatch('revocateMsg', {
                    idClient: attrs.idClient
                  })
                }
              })
            }
          }
        }
      },
      sendRobotBlockMsg (msg, originMsg) {
        let body = '[复杂按钮模板触发消息]'
        if (msg.text && msg.text.length === 1) {
          body = msg.text[0].text
        }
        let robotAccid = originMsg.content.robotAccid
        if (!this.isRobot) {
          body = `@${this.robotInfos[robotAccid].nick} ${body}`
        }
        if (this.type === 'session') {
          this.$store.dispatch('sendRobotMsg', {
            type: 'link',
            scene: originMsg.scene,
            to: originMsg.to,
            robotAccid,
            // 机器人后台消息
            params: msg.params,
            target: msg.target,
            // 显示的文本消息
            body
          })
        } else if (this.type === 'chatroom') {
          this.$store.dispatch('sendChatroomRobotMsg', {
            type: 'link',
            robotAccid,
            // 机器人后台消息
            params: msg.params,
            target: msg.target,
            // 显示的文本消息
            body
          })
        } 
      },
      continueRobotMsg (robotAccid) {
        this.$store.dispatch('continueRobotMsg', robotAccid)
      },
      showFullImg (src) {
        this.$store.dispatch('showFullscreenImg', {
          src
        })
      },
      playAudio (src) {
        if (!this.currentAudio) {
          this.currentAudio = new Audio(src)
          this.currentAudio.play()
          this.currentAudio.onended = () => {
            this.currentAudio = null
          }
        }
      },
      openRedBag (bid) {
        let that = this
        let time = Date.parse(new Date()) / 1000
        let str = time + this.$store.state.str
        let token = Api.encrypted(str, time)
        this.$store.dispatch('showLoading')
        Api.hbInfo(
          Qs.stringify({
            time: time,
            token: token,
            bid: bid
        })).then(function (res) {
            that.$store.dispatch('hideLoading')
            that.$store.commit('updateRedBagInfo', res.data.data)
            if(res.data.code == 200 ) {
              if(res.data.data.status == 1) {
                that.$store.commit('updateOpenRedBagShow', true)
              } else if(res.data.data.status == 2) {
                Toast(res.data.msg)
              } else {
                that.$store.commit('updateOpenRedBagShow', true)
              }
            } else if(res.data.code == 500) {
              Toast(res.data.msg)
            } else if(res.data.code > 200 && res.data.code < 500) {
              that.$store.commit('updateOpenedRedBagShow', true)
            } else {
              pageUtil.resCode(res)
            }
        }).catch(function (error) {
            console.log(error);
        })
      },
      enterRoom (item) {
        let that = this
        let time = Date.parse(new Date()) / 1000
        let str = time + this.$store.state.str
        let token = Api.encrypted(str, time)
        this.$store.dispatch('showLoading')
        Api.enterRoom(
          Qs.stringify({
            time: time,
            token: token,
            rid: item.id
        })).then(function (res) {
            that.$store.dispatch('hideLoading')
            if(res.data.code == 200) {
              if (item) {
                that.$store.commit('updateCurrSession', item)
                that.$router.push({path: '/chat/team-' + item.imtid})
              } 
            } else {
              pageUtil.resCode(res)
            }
          })
          .catch(function (error) {
            console.log(error);
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
    @import '~@/assets/scss/const.scss';
    @import '~@/assets/scss/mixin.scss';
    
    .u-msg {
        margin-bottom: 0.2rem;
        text-align: center;
        .msg-head {
            float: left;
            width: 0.8rem;
            height: 0.8rem;
            img {
                width: 100%;
                height: 100%;
                border-radius: 100%;
            }
        }
        .msg-text {
            margin-top: 0.2rem;
            margin-left: 0.3rem;
            // margin-bottom: 0.3rem;
            float: left;
            max-width: 4.9rem;
            color: #202020;
            text-align: center;
            padding: 0.16rem 0.15rem;
            border: 1px solid rgba(151,151,151,0.20);
            border-radius: 0.08rem;
            background-color: #fff;
            position: relative;
            &:before, &:after {
                content: '';
                position: absolute;
                top: 0.22rem;
                border-top: 0.14rem solid transparent;
                border-bottom: 0.14rem solid transparent;
                width: 0;
                height: 0;
            }
            &:before {
                left: -0.12rem;
                border-right: 0.15rem solid transparent;
            }
            &:after {
                right: -0.12rem;
                border-left: 0.15rem solid transparent;
            }
            .emoji-small {
              display: block;
              width: 0.56rem;
              height: 0.56rem;
            }
        }
        .invite-text {
          font-size: 0.32rem;
          background-color: #fff !important;
            .room-info {
              display: block;
              text-align: left;
              margin-top: 0.1rem;
              font-size: 0.24rem;
              color: #858585;
            }
            :nth-child(4) {
              color: #E6615D;
            }
        }
        .notify {
          max-width: 80%;
          display: inline-block;
          padding: 0.12rem 0.15rem;
          color: #fff;
          font-size: 0.24rem;
          border-radius: 0.08rem;
          background-color: rgba(0,0,0,.3);
        }
        .whoGeted {
          line-height: 0.5rem;
          padding: 0.06rem 0.15rem;
        }
        .icon-hb, .icon-shb {
          margin-top: 0.1rem;
          float: left;
          display: block;
          width: 0.45rem;
          height: 0.58rem;
          background: url('../../../assets/icon/icon_fhb.png') no-repeat center;
          background-size: 100%;
        }
        .icon-shb {
          margin-top: 0;
          margin-right: 0.08rem;
          width: 0.36rem;
          height: 0.46rem;
        }
        .redbag-text {
            display: block;
            padding: 0.37rem;
            color: #fff;
            background-color: #FA9E3C !important;
            &:before {
                border-right-color: #FA9E3C !important;
            }
            &:after {
                border-left-color: #FA9E3C !important;
            }
            .redbag-word {
                float: left;
                margin-left: 0.3rem;
            }
        }
    }
    .item-time {
        margin-bottom: 0;
        padding: 0.2rem 0;
        text-align: center;
    }
    .item-you, .item-system {
      position: relative;
      .nickname {
          position: absolute;
          top: -0.2rem;
          left: 1.02rem;
          color: #858585;
      }
      .msg-text {
        margin-top: 0.2rem;
        text-align: left;
        &:before {
            border-right-color: #fff !important;
        }
        &:after {
            border-left-color: transparent !important;
        }
      }
      .redbag-text {
          &:before {
            border-right-color: #FA9E3C !important;
        }
      }
    }
    .item-me {
      position: relative;
        .msg-head {
            float: right;
        }
        .nickname {
          position: absolute;
          top: -0.2rem;
          right: 1.02rem;
          color: #858585;
        }
        .msg-text {
            float: right;
            background-color: #DDEEA5;
            margin-left: 0;
            margin-right: 0.3rem;
            text-align: left;
            &:after {
                border-left-color: #DDEEA5;
            }
        }
        .invite-text {
          &:before {
            border-right-color: transparent !important;
          }
          &:after {
              border-left-color: #fff !important;
          }
        }
        .redbag-text {
            &:before {
                border-right-color: transparent !important;
            }
        }
    }
</style>