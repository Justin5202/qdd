/* 
 * SDK连接相关
 */
import cookie from '@/utils/cookie'
import config from '@/configs/config'
import pageUtil from '@/utils/page'
import util from '@/utils'
import store from '../store'
import {onFriends, onSyncFriendAction} from './friends'
// import {onRobots} from './robots'
import {onBlacklist, onMarkInBlacklist} from './blacks'
import {onMyInfo, onUserInfo, onUserGoldInfo} from './userInfo'
import {onSessions, onUpdateSession} from './session'
import {onRoamingMsgs, onOfflineMsgs, onMsg, onBroadcastMsg} from './msgs'
import {onSysMsgs, onSysMsg, onSysMsgUnread, onCustomSysMsgs} from './sysMsgs'
import {onTeams, onCreateTeam, onTeamMembers, onSyncTeamMembersDone, onUpdateTeamMember} from './team'

let sdk = config.SDK
const SDK = require('@/sdk/' + sdk)

// 重新初始化 NIM SDK
export function initNimSDK ({ state, commit, dispatch }, loginInfo) {
  if (state.nim) {
      state.nim.disconnect()
  }
  // 初始化SDK
  window.nim = state.nim = SDK.NIM.getInstance({
    appKey: config.appkey,
    account: localStorage.getItem('uid'),
    token: localStorage.getItem('sdktoken'),
    db: false,
    syncSessionUnread: true,
    syncRobots: true,
    autoMarkRead: true, // 默认为true
    onconnect: function onConnect (event) {
        if (loginInfo) {
            // 连接上以后更新uid
            commit('updateUserUID', loginInfo)
        }
    },
    onerror: function onError (event) {
      // alert(JSON.stringify(event))
      alert('网络连接状态异常')
      location.href = config.loginUrl
    },
    onwillreconnect: function onWillReconnect () {
      console.log(event)
    },
    ondisconnect: function onDisconnect (error) {
      switch (error.code) {
        // 账号或者密码错误, 请跳转到登录页面并提示错误
        case 302:
          pageUtil.turnPage('帐号或密码错误', 'login')
          break;
        // 被踢, 请提示错误后跳转到登录页面
        case 'kicked':
          let map = {
            PC: '电脑版',
            Web: '网页版',
            Android: '手机版',
            iOS: '手机版',
            WindowsPhone: '手机版'
          }
          let str = error.from
          let errorMsg = `你的帐号于${util.formatDate(new Date())}被${(map[str]||'其他端')}踢出下线，请确定帐号信息安全!`
          // state.nim = null
          pageUtil.turnPage(errorMsg, 'login')
          break
        default:
          break
      }
    },
    // 多端登录
    onloginportschange: onLoginPortsChange,
    // 用户关系及好友关系
    onblacklist: onBlacklist,
    onsyncmarkinblacklist: onMarkInBlacklist,
    // onmutelist: onMutelist,
    // onsyncmarkinmutelist: onMarkInMutelist,
    onfriends: onFriends,
    onsyncfriendaction: onSyncFriendAction,
    // // 机器人
    // onrobots: onRobots,
    // // 用户名片 - actions/userInfo
    onmyinfo: onMyInfo,
    onupdatemyinfo: onMyInfo,
    onusers: onUserInfo,
    onupdateuser: onUserInfo,
    // 群组
    onteams: onTeams,
    onsynccreateteam: onCreateTeam,
    onteammembers: onTeamMembers,
    onsyncteammembersdone: onSyncTeamMembersDone,
    onupdateteammember: onUpdateTeamMember,
    // 会话
    onsessions: onSessions,
    onupdatesession: onUpdateSession,
    // 消息
    onroamingmsgs: onRoamingMsgs,
    onofflinemsgs: onOfflineMsgs,
    onmsg: onMsg,
    onbroadcastmsg: onBroadcastMsg,
    // 系统通知
    onsysmsg: onSysMsg,
    onofflinesysmsgs: onSysMsgs,
    onupdatesysmsg: onSysMsg, // 通过、拒绝好友申请会收到此回调

    onsysmsgunread: onSysMsgUnread,
    onupdatesysmsgunread: onSysMsgUnread,

    onofflinecustomsysmsgs: onCustomSysMsgs,
    oncustomsysmsg: onCustomSysMsgs,
    // // 同步完成
    onsyncdone: function onSyncDone () {
        dispatch('hideLoading')
        //进入首页
        location.href = '#/index'
    }
  })
}

function onLoginPortsChange(loginPorts) {
    console.log('当前登录帐号在其它端的状态发生改变了', loginPorts);
}