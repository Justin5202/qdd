// 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
// this.$store.commit(method, params)

import store from '../store'
import cookie from '../../utils/cookie'
import util from '../../utils'
import config from '@/configs/config'
import Vue from 'vue'
import {Toast} from 'mint-ui'

export default {
  //登录成功跳转
  updateIsLogin (state, data) {
    state.isLogin = data
  },
  //token相关
  updateStr (state, data) {
    state.str = data
  },
  updatePlayTypeShow (state, data) {
    state.playTypeShow = data
  },
  updateWxLoginInfo() {
    state.wxLoginInfo = data
  },
  // 底部工具栏显示
  updateTool (state, data) {
    state.ToolShow = data
  },
  updateEmoji (state, data) {
    state.emojiShow = data
  },
  updateTeamMemberShow (state, data) {
    state.teamMemberShow = data
  },
  //加好友通知信息
  updateSysMsg (state, data) {
    state.sysMsg.push(data)
  },
  //红包show
  updateRedBag (state, data) {
    state.redbagShow = data
  },
  updateExchangeNum (state, data) {
    state.exchangeNum = data
  },
  updateRedBagInfo (state, data) {
    state.redBagInfo = data
  },
  updateOpenRedBagShow (state, data) {
    state.openRedBagShow = data
  },
  updateOpenedRedBagShow (state, data) {
    state.openedRedBagShow = data
  },
  updateJlRedBagInfo (state, data) {
    state.jlRedBagInfo = data
  },
  updateLastRedBag (state, data) {
    state.lastRedBag = data
  },
  updateSolitaireRedBagInfo (state, data) {
    state.solitaireRedBagInfo = data
  },
  updateRewardRedBagInfo (state, data) {
    state.rewardRedBagInfo = data
  },
  updateBtnItemShow (state,data) {
    state.btnItemShow = data
  },
  //房间相关
  updateCurrRoomList (state, data) {
    state.currRoomList = data
  },
  updateCreateRoomShow (state, data) {
    state.createRoomShow = data
  },
  updateUrl (state, data) {
    state.url = data
  },
  updateAlipayUrl (state, data) {
    state.alipayUrl = data
  },
  //喇叭相关
  updateSpeakerShow (state, data) {
    state.speakerShow = data
  },
  updateSpeakerMsgs (state, data) {
    if(data) {
      state.speakerMsgs.push(data)
      if(state.speakerMsgs.length >= 3) {
        state.speakerMsgs = state.speakerMsgs.slice(state.speakerMsgs.length - 3)
      }
    } else {
      state.speakerMsgs = []
    }
  },
  updateBigSpeakerMsgs (state, data) {
    if(data) {
      state.bigSpeakerMsgs.push(data)
      if(state.bigSpeakerMsgs.length >= 3) {
        state.bigSpeakerMsgs = state.bigSpeakerMsgs.slice(state.bigSpeakerMsgs.length - 3)
      }
    } else {
      state.bigSpeakerMsgs = []
    }
  },
  //清空喇叭
  updateDeleteSpeakerMsgs (state, data) {
    state.speakerMsgs.splice(data, 1)
  },
  updateMyInfo (state, data) {
    state.myInfo = data
  },
  updateRefreshState (state) {
    state.isRefresh = false
  },
  updateLoading (state, status) {
    clearTimeout(state.loadingTimer)
    state.loadingTimer = setTimeout(() => {
      state.isLoading = status
    }, 20)
  },
  updateFullscreenImage (state, obj) {
    obj = obj || {}
    if (obj.src && obj.type === 'show') {
      state.fullscreenImgSrc = obj.src
      state.isFullscreenImgShow = true
    } else if (obj.type === 'hide') {
      state.fullscreenImgSrc = ' '
      state.isFullscreenImgShow = false
    }
  },
  updateUserUID (state, loginInfo) {
    state.userUID = loginInfo.uid
    state.sdktoken = loginInfo.sdktoken
    cookie.setCookie('uid', loginInfo.uid)
    cookie.setCookie('sdktoken', loginInfo.sdktoken)
  },
  updateMyInfo (state, myInfo) {
    state.myInfo = util.mergeObject(state.myInfo, myInfo)
  },
  updateUserInfo (state, users) {
    let userInfos = state.userInfos
    users.forEach(user => {
      let account = user.account
      if (account) {
        userInfos[account] = util.mergeObject(userInfos[account], user)
      }
    })
    state.userInfos = util.mergeObject(state.userInfos, userInfos)
  },
  updateUserSelected (state, data) {
    state.userSelected = data
  },
  updateNameCardShow (state, data) {
    state.isZoomIn = data
  },
  updateIsFriend (state, data) {
    state.isFriend = data
  }, 
  updateFriends (state, data) {
    state.friendslist = data
  },
  // updateFriends (state, friends, cutFriends = []) {
  //   const nim = state.nim
  //   state.friendslist = nim.mergeFriends(state.friendslist, friends)
  //   // state.friendslist = nim.cutFriends(state.friendslist, cutFriends)
  //   state.friendslist = nim.cutFriends(state.friendslist, friends.invalid)
  // },
  updateRobots (state, robots) {
    const nim = state.nim
    robots = robots.map(item => {
      if (item.avatar) {
        item.originAvatar = item.avatar
        item.avatar = nim.viewImageSync({
          url: item.avatar, // 必填
          thumbnail: { // 生成缩略图， 可选填
            width: 40,
            height: 40,
            mode: 'cover'
          }
        })
      } else {
        item.avatar = config.defaultUserIcon
      }
      return item
    })
    state.robotslist = robots
    state.robotInfos = Object.create(null)
    robots.forEach(robot => {
      state.robotInfos[robot.account] = robot
      state.robotInfosByNick[robot.nick] = robot
    })
  },
  updateBlacklist (state, blacks) {
    const nim = state.nim
    state.blacklist = nim.cutFriends(state.blacklist, blacks.invalid)
    let addBlacks = blacks.filter(item => {
      return item.isBlack === true
    })
    let remBlacks = blacks.filter(item => {
      return item.isBlack === false
    })
    // 添加黑名单
    state.blacklist = nim.mergeFriends(state.blacklist, addBlacks)
    // 解除黑名单
    state.blacklist = nim.cutFriends(state.blacklist, remBlacks)
  },
  updateSearchlist (state, obj) {
    const type = obj.type
    switch (type) {
      case 'user':
        if (obj.list.length !== 0 || state.searchedUsers.length !== 0) {
          state.searchedUsers = obj.list
        } else {
          state.searchedUsers = []
        }
        break
      case 'team':
        if (obj.list.length !== 0 || state.searchedTeams.length !== 0) {
          state.searchedTeams = obj.list
        } else {
          state.searchedTeams = []
        }
        break
    }
  },
  //禁言列表
  updateMuteMembers (state, data) {
    state.muteMembers = data
  }, 
  // 未读消息总数
  updateUnread (state, data) {
    state.unread = data
  },
  updateSessions (state, sessions) {
    const nim = state.nim
    state.sessionlist = nim.mergeSessions(state.sessionlist, sessions)
    state.sessionlist = state.sessionlist.filter(item => {
      if (/^team-/.test(item.id)) {
        return false
      }
      return true
    })
    state.sessionlist.sort((a, b) => {
      return b.updateTime - a.updateTime
    })
    let data = state.friendslist,
        count = 0
    state.sessionlist.forEach(item => {
      for(let i in data) {
        if('p2p-' + data[i].acid == item.id) {
          Vue.set(data[i], 'unread', item.unread)
        }
        let unread = item.unread
        count += unread
        store.commit('updateUnread', count)          
      }
      state.sessionMap[item.id] = item
    })
  },
  deleteSessions (state, sessionIds) {
    const nim = state.nim
    state.sessionlist = nim.cutSessionsByIds(state.sessionlist, sessionIds)
  },
  updateCurrSession (state, data) {
    state.currSession = data
  },
  //
  updateCurrP2pSession (state, data) {
    state.currP2pSession = data
  },
  // 初始化，收到离线漫游消息时调用
  updateMsgs (state, msgs) {
    const nim = state.nim
    let tempSessionMap = {}
    msgs.forEach(msg => {
      let sessionId = msg.sessionId
      tempSessionMap[sessionId] = true
      if (!state.msgs[sessionId]) {
        state.msgs[sessionId] = []
      }
      // sdk会做消息去重
      state.msgs[sessionId] = nim.mergeMsgs(state.msgs[sessionId], [msg])
      // state.msgs[sessionId].push(msg)
    })
    store.commit('updateMsgByIdClient', msgs)
    for (let sessionId in tempSessionMap) {
      state.msgs[sessionId].sort((a, b) => {
        if (a.time === b.time) {
          // 机器人消息，回复消息时间和提问消息时间相同，提问在前，回复在后
          if (a.type === 'robot' && b.type === 'robot') {
            if (a.content && a.content.msgOut) {
              return 1
            }
            if (b.content && b.content.msgOut) {
              return -1
            }
          }
        }
        return a.time - b.time
      })
      if (sessionId === state.currSessionId) {
        store.commit('updateCurrSessionMsgs', {
          type: 'init'
        })
      }
    }
  },
  // 更新追加消息，追加一条消息
  putMsg (state, msg) {
    let sessionId = msg.sessionId
    if (!state.msgs[sessionId]) {
      state.msgs[sessionId] = []
    }
    store.commit('updateMsgByIdClient', msg)
    let tempMsgs = state.msgs[sessionId]
    let lastMsgIndex = tempMsgs.length  - 1
    if (tempMsgs.length === 0 || msg.time >= tempMsgs[lastMsgIndex].time) {
      tempMsgs.push(msg)
    } else {
      for (let i = lastMsgIndex; i >= 0; i--) {
        let currMsg = tempMsgs[i]
        if (msg.time >= currMsg.time) {
          state.msgs[sessionId].splice(i, 0, msg)
          break
        }
      }
    }
  },
  // 删除消息列表消息
  deleteMsg (state, msg) {
    let sessionId = msg.sessionId
    let tempMsgs = state.msgs[sessionId]
    if (!tempMsgs || tempMsgs.length === 0) {
      return
    }
    let lastMsgIndex = tempMsgs.length  - 1
    for (let i = lastMsgIndex; i >= 0; i--) {
      let currMsg = tempMsgs[i]
      if (msg.idClient === currMsg.idClient) {
        state.msgs[sessionId].splice(i, 1)
        break
      }
    }
  },
  // 替换消息列表消息，如消息撤回
  replaceMsg (state, obj) {
    let {sessionId, idClient, msg} = obj
    let tempMsgs = state.msgs[sessionId]
    if (!tempMsgs || tempMsgs.length === 0) {
      return
    }
    let lastMsgIndex = tempMsgs.length  - 1
    for (let i = lastMsgIndex; i >= 0; i--) {
      let currMsg = tempMsgs[i]
      console.log(idClient, currMsg.idClient, currMsg.text)
      if (idClient === currMsg.idClient) {
        state.msgs[sessionId].splice(i, 1, msg)
        break
      }
    }
  },
  // 用idClient 更新消息，目前用于消息撤回
  updateMsgByIdClient (state, msgs) {
    if (!Array.isArray(msgs)) {
      msgs = [msgs]
    }
    let tempTime = (new Date()).getTime()
    msgs.forEach(msg => {
      // 有idClient 且 5分钟以内的消息
      if (msg.idClient && (tempTime - msg.time < 1000 * 300)) {
        state.msgsMap[msg.idClient] = msg
      }
    })
  },
  //
  updateCurrScene (state, data) {
    state.currScene = data
  },
  updateWhoAddMsg (state, data) {
    state.whoAddMsg = data
  },
  // 更新当前会话id，用于唯一判定是否在current session状态
  updateCurrSessionId (state, obj) {
    let type = obj.type || ''
    if (type === 'destroy') {
      state.currSessionId = null
    } else if (type === 'init') {
      if (obj.sessionId && (obj.sessionId !== state.currSessionId)) {
        state.currSessionId = obj.sessionId
      }
    }
  },
  //邀请信息
  updateInviteInfo (state, data) {
    state.inviteInfo = data
  },
  updateInviteShow (state, data) {
    state.inviteShow = data
  },
  // 更新当前会话列表的聊天记录，包括历史消息、单聊消息等，不包括聊天室消息
  // replace: 替换idClient的消息
  updateCurrSessionMsgs (state, obj) {
    let type = obj.type || ''
    if (type === 'destroy') { // 清空会话消息
      state.currSessionMsgs = []
      state.currSessionLastMsg = null
      store.commit('updateCurrSessionId', {
        type: 'destroy'
      })
    } else if (type === 'init') { // 初始化会话消息列表
      if (state.currSessionId) {
        let sessionId = state.currSessionId
        let currSessionMsgs = [].concat(state.msgs[sessionId] || [])
        // 做消息截断
        let limit = config.localMsglimit
        let msgLen = currSessionMsgs.length
        if (msgLen - limit > 0) {
          state.currSessionLastMsg = currSessionMsgs[msgLen - limit]
          currSessionMsgs = currSessionMsgs.slice(msgLen - limit, msgLen)
        } else if (msgLen > 0) {
          state.currSessionLastMsg = currSessionMsgs[0]
        } else {
          state.currSessionLastMsg = null
        }
        state.currSessionMsgs = []
        let lastMsgTime = 0
        currSessionMsgs.forEach(msg => {
          if(msg.type == 'notification' || msg.type == 'text' || msg.from != "qdd@phone@0") {
            // if ((msg.time - lastMsgTime) > 1000 * 60 * 5) {
            //   lastMsgTime = msg.time
            //   state.currSessionMsgs.push({
            //     type: 'timeTag',
            //     text: util.formatDate(msg.time, false)
            //   })
            // }
            let now = Math.round(new Date().getTime())
            if((now - msg.time) < 150 * 1000) {
              state.currSessionMsgs.push(msg)
            }
          }
        })
      }
    } else if (type === 'put') { // 追加一条消息
      let newMsg = obj.msg ? obj.msg : obj.customSysMsgs
      let lastMsgTime = 0
      let lenCurrMsgs = state.currSessionMsgs.length
      if (lenCurrMsgs > 0) {
        lastMsgTime = state.currSessionMsgs[lenCurrMsgs - 1].time
      }
      if (newMsg) {
        if(newMsg.content  && JSON.parse(newMsg.content).uid == store.state.myInfo.id) {
          if(JSON.parse(newMsg.content).type == 'post') {
            store.commit('updateBtnItemShow', 1)
            store.dispatch('showRedBag')
            store.dispatch('sendMsg', {
                type: 'custom',
                scene: newMsg.scene,
                to: newMsg.to,
                content: {
                  type: 'winbag',
                  uid: JSON.parse(newMsg.content).uid
                }
            })
          } else if(JSON.parse(newMsg.content).type == 'give') {
            store.commit('updateBtnItemShow', 3)
            store.dispatch('showRedBag')
            store.dispatch('sendMsg', {
                type: 'custom',
                scene: newMsg.scene,
                to: newMsg.to,
                content: {
                  type: 'winning',
                  uid: JSON.parse(newMsg.content).uid
                }
            })
          } else if(JSON.parse(newMsg.content).type == 'reward') {
            store.commit('updateRewardRedBagInfo', JSON.parse(newMsg.content))
            store.commit('updateBtnItemShow', 5)
            store.dispatch('showRedBag')
          } 
        } else if(newMsg.content && JSON.parse(newMsg.content).type == 'smallSpeaker') {
          store.commit('updateSpeakerMsgs', newMsg)
        } else if(newMsg.content && JSON.parse(newMsg.content).type == 'bag') {
          store.commit('updateLastRedBag', JSON.parse(newMsg.content).data)
        } else if(newMsg.attach && newMsg.attach.type == "removeTeamMembers" && newMsg.attach.accounts[0] && newMsg.attach.accounts[0] == store.state.myInfo.acid) {
          window.history.go(-1)
          Toast('你已经被管理员踢出房间')
        } else if(newMsg.attach && newMsg.attach.type == "dismissTeam") {
          window.history.go(-1)
          Toast('房主余额不足或者退出自动解散房间')
        }
        state.currSessionMsgs.push(newMsg)
      }
    } else if (type === 'concat') {
      // 一般用于历史消息拼接
      let currSessionMsgs = []
      let lastMsgTime = 0
      obj.msgs.forEach(msg => {
        // if ((msg.time - lastMsgTime) > 1000 * 60 * 5) {
        //   lastMsgTime = msg.time
        //   currSessionMsgs.push({
        //     type: 'timeTag',
        //     text: util.formatDate(msg.time, false)
        //   })
        // }
        let now = Math.round(new Date().getTime())
        if((now - msg.time) < 150 * 1000) {
          currSessionMsgs.push(msg)
        }
        if(msg.scene == 'p2p') {
          currSessionMsgs.push(msg)
        }
        // if(msg.from != "qdd@phone@0" || msg.type == "notification") {
        //   if ((msg.time - lastMsgTime) > 1000 * 150) {
        //     lastMsgTime = msg.time
        //     currSessionMsgs.push({
        //       type: 'timeTag',
        //       text: util.formatDate(msg.time, false)
        //     })
        //   } 
        //   currSessionMsgs.push(msg)
        // } else if(msg.content && JSON.parse(msg.content).type == 'bag' || msg.content && JSON.parse(msg.content).type == 'remind') {
        //   if ((msg.time - lastMsgTime) > 1000 * 150) {
        //     lastMsgTime = msg.time
        //     state.currSessionMsgs.push({
        //       type: 'timeTag',
        //       text: util.formatDate(msg.time, false)
        //     })
        //   }
        //   currSessionMsgs.push(msg)
        // }
      })
      currSessionMsgs.reverse()
      currSessionMsgs.forEach(msg => {
        state.currSessionMsgs.unshift(msg)
      })
      if (obj.msgs[0]) {
        state.currSessionLastMsg = obj.msgs[0]
      }
    } else if (type === 'replace') {
      let msgLen = state.currSessionMsgs.length
      let lastMsgIndex = msgLen - 1
      if (msgLen > 0) {
        for (let i = lastMsgIndex; i >= 0; i--) {
          if (state.currSessionMsgs[i].idClient === obj.idClient) {
            state.currSessionMsgs.splice(i, 1, obj.msg)
            break
          }
        }
      }
    }
  },
  updateSysMsgs (state, sysMsgs) {
    const nim = state.nim
    if (!Array.isArray(sysMsgs)) {
      sysMsgs = [sysMsgs]
    }
    sysMsgs = sysMsgs.map(msg => {
      msg.showTime = util.formatDate(msg.time, false)
      return msg
    })
    // state.sysMsgs = nim.mergeSysMsgs(state.sysMsgs, sysMsgs)
    state.sysMsgs = [].concat(nim.mergeSysMsgs(state.sysMsgs, sysMsgs))
    console.log(state.sysMsgs)
  },
  updateSysMsgUnread (state, obj) {
    state.sysMsgUnread = obj
  },
  updateCustomSysMsgs (state, sysMsgs) {
    const nim = state.nim
    if (!Array.isArray(sysMsgs)) {
      sysMsgs = [sysMsgs]
    }
    sysMsgs = sysMsgs.map(msg => {
      msg.showTime = util.formatDate(msg.time, false)
      return msg
    })
    // state.customSysMsgs = nim.mergeSysMsgs(state.customSysMsgs, sysMsgs)
    state.customSysMsgs = state.customSysMsgs.concat(sysMsgs)
    store.commit('updateCustomSysMsgUnread', {
      type: 'add',
      unread: sysMsgs.length
    })
  },
  updateCustomSysMsgUnread (state, obj) {
    let {type, unread} = obj
    switch (type) {
      case 'reset':
        state.customSysMsgUnread = unread || 0
        break
      case 'add':
        state.customSysMsgUnread += unread
        break
    }
  },
  resetSysMsgs (state, obj) {
    let type = obj.type
    switch (type) {
      case 0:
        state.sysMsgs = []
        break
      case 1:
        state.customSysMsgs = []
        store.commit('updateCustomSysMsgUnread', {
          type: 'reset'
        })
        break
    }
  },
  setNoMoreHistoryMsgs (state) {
    state.noMoreHistoryMsgs = true
  },
  resetNoMoreHistoryMsgs (state) {
    state.noMoreHistoryMsgs = false
  },
  // 继续与机器人会话交互
  continueRobotMsg (state, robotAccid) {
    state.continueRobotAccid = robotAccid
  },

  initChatroomInfos (state, obj) {
    state.chatroomInfos = obj
  },
  setCurrChatroom (state, chatroomId) {
    state.currChatroomId = chatroomId
    state.currChatroom = state.chatroomInsts[chatroomId]
    state.currChatroomMsgs = []
    state.currChatroomInfo = {}
    state.currChatroomMembers = []
  },
  resetCurrChatroom (state) {
    state.currChatroomId = null
    state.currChatroom = null
    state.currChatroomMsgs = []
    state.currChatroomInfo = {}
    state.currChatroomMembers = []
  },
  // 聊天室相关逻辑
  updateChatroomInfo (state, obj) {
    state.currChatroomInfo = Object.assign(state.currChatroomInfo, obj)
  },
  updateCurrChatroomMsgs (state, obj) {
    let {type, msgs} = Object.assign({}, obj)
    if (type === 'put') {
      msgs.forEach(msg => {
        let chatroomId = msg.chatroomId
        if (chatroomId === state.currChatroomId) {
          msgs.forEach(msg => {
            state.currChatroomMsgs.push(msg)
          })
        }
      })
    } else if (type === 'concat') {
      // 一般用于历史消息拼接
      let currSessionMsgs = obj.msgs
      currSessionMsgs.reverse()
      currSessionMsgs.forEach(msg => {
        state.currSessionMsgs.unshift(msg)
      })
      if (obj.msgs[0]) {
        state.currSessionLastMsg = obj.msgs[0]
      }
    }
  },
  getChatroomInfo (state, obj) {
    state.currChatroomInfo = obj
  },
  updateChatroomMembers (state, obj) {
    let {type, members} = obj
    if (type === 'destroy') {
      state.currChatroomMembers = []
    } else if (type === 'put') {
      members.forEach(member => {
        if (member.online) {
          state.currChatroomMembers.push(member)
        }
      })
    }
  },
  updateTeams (state, teams,) {
    console.log('群列表', teams)
    const nim = state.nim
    state.teamlist = nim.mergeTeams(state.teamlist, teams)
  },
  updateTeam (state, team) {
    console.log('你创建了一个群', team)
    const nim = state.nim
    state.teamlist = nim.mergeTeams(state.teamlist, team)
  },
  onInvalidTeams(state, teams) {
    const nim = state.nim
    state.teamlist = nim.cutTeams(state.teamlist, teams)
    state.invalidTeams = nim.mergeTeams(state.invalidTeams, teams)
  },
  updateTeamMember(state, teamMember) {
    console.log('群成员信息更新了', teamMember);
    onTeamMembers({
      teamId: teamMember.teamId,
      members: teamMember
    });
  },
  teamMembers(state, obj){
    console.log('收到群成员obj', obj)
    var teamId = obj.teamId
    var members = obj.members
    state.teamMembers = state.teamMembers || {}
    state.teamMembers[teamId] = nim.mergeTeamMembers(state.teamMembers[teamId], members)
    state.teamMembers[teamId] = nim.cutTeamMembers(state.teamMembers[teamId], members.invalid)
  },
  currentTeamMember(state, obj){
    console.log('mutation->currentTeamMember', obj)
    state.currentTeamMember = obj
  },
  currentIMTeamMember (state, obj) {
    state.currentIMTeamMember = obj
  },
  currentTeam(state, obj){
    console.log('mutation->currentTeam', obj)
    state.currentTeam = obj
  },
  createTeam(state, obj){
    console.log('mutation->createTeam', obj)
    state.createTeam = obj
  },
  Users(state, users) {
    console.log('收到用户名片列表', users);
    state.users = nim.mergeUsers(state.users, users);
  }
}