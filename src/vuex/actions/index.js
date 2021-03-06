
// Action 提交的是 mutation，而不是直接变更状态。
// Action 可以包含任意异步操作。
import cookie from '../../utils/cookie'
import pageUtil from '../../utils/page'
import Api from '@/api/index'
import config from '@/configs/config'

/* 导出actions方法 */
import {showLoading, hideLoading, showRedBag, hideRedBag, showFullscreenImg, hideFullscreenImg} from './widgetUi'
import {initNimSDK} from './initNimSDK'
import {initChatroomSDK, resetChatroomSDK} from './initChatroomSDK'
import {updateBlack} from './blacks'
import {updateFriend, addFriend, deleteFriend} from './friends'
import {updateUserGoldInfo} from './userInfo'
import {resetSearchResult, searchUsers} from './search'
import {deleteSession, setCurrSession, resetCurrSession} from './session'
import {sendMsg, sendFileMsg, sendMsgReceipt, sendRobotMsg, revocateMsg, getHistoryMsgs, resetNoMoreHistoryMsgs, continueRobotMsg} from './msgs'
import {markSysMsgRead, resetSysMsgs, markCustomSysMsgRead, getLocalSysMsgs} from './sysMsgs'
import {leaveTeam, getTeamMembers, removeTeamMembers, updateMuteStateInTeam, getMutedTeamMembers} from './team'
import {sendChatroomMsg, sendChatroomRobotMsg, sendChatroomFileMsg, getChatroomHistoryMsgs} from './chatroomMsgs'
import {initChatroomInfos, getChatroomInfo, getChatroomMembers, clearChatroomMembers} from './chatroomInfos'


function connectNim ({state, commit, dispatch}, obj) {
	//深拷贝
  let {force} = Object.assign({}, obj)
  let that = this
  // 操作为内容页刷新页面，此时无nim实例
  if (!state.nim || force) {
    let loginInfo = {
      uid: localStorage.getItem('uid'),
      sdktoken: localStorage.getItem('sdktoken')
    }
    if (!loginInfo.uid) {
      // 无cookie，直接跳转登录页
      // pageUtil.turnPage('无历史登录记录，请重新登录', 'login')
    } else {
      // 有cookie，重新登录
      dispatch('initNimSDK', loginInfo)
    }
  }
}

function connectChatroom ({state, commit, dispatch}, obj) {
  let {chatroomId} = Object.assign({}, obj)
  const nim = state.nim
  if (nim) {
    dispatch('showLoading')
    nim.getChatroomAddress({
      chatroomId,
      done: function getChatroomAddressDone (error, obj) {
        if (error) {
          alert(error.message)
          location.href = '#/room'
          return
        }
        dispatch('initChatroomSDK', obj)
      }
    })
  }
}

export default {
  // UI 及页面状态变更
  showLoading,
  hideLoading,
  showRedBag,
  hideRedBag,

	// 连接sdk请求，false表示强制重连
  connect (store, obj) {
    let {type} = Object.assign({}, obj)
    // type 可为 nim chatroom
    type = type || 'nim'
    switch (type) {
      case 'nim':
        connectNim(store, obj)
        break
      case 'chatroom':
        connectChatroom(store, obj)
        break
    }
  },
  // 用户触发的登出逻辑
  logout ({ state, commit }) {
    cookie.delCookie('uid')
    cookie.delCookie('sdktoken')
    cookie.delCookie('tokenStr')
    localStorage.removeItem('phone')
    localStorage.removeItem('psw')
    localStorage.removeItem('uid')
    localStorage.removeItem('sdktoken')
    if (state.nim) {
      state.nim.disconnect()
      state.nim = null
    }
    pageUtil.turnPage('', 'login')
  },
  // // 初始化 重新连接SDK
  initNimSDK,
  // // 清空所有搜索历史纪录
  // resetSearchResult,
  // // 搜索用户信息
  searchUsers,
  // 用户信息
  updateUserGoldInfo,
  // // 更新黑名单
  updateBlack,
  // // 更新好友
  addFriend,
  deleteFriend,
  updateFriend,
  // // 删除会话
  // deleteSession,
  // // 设置当前会话
  setCurrSession,
  // // 重置当前会话
  resetCurrSession,
  // 群操作
  // applyTeam,
  leaveTeam,
  getTeamMembers,
  removeTeamMembers,
  updateMuteStateInTeam,
  getMutedTeamMembers,
  // // 发送消息
  sendMsg,
  // sendFileMsg,
  // sendRobotMsg,
  // 发送消息已读回执
  sendMsgReceipt,
  // 消息撤回
  revocateMsg,
  getHistoryMsgs,
  // 重置历史消息状态
  resetNoMoreHistoryMsgs,
  // 标记系统消息已读
  markSysMsgRead,
  markCustomSysMsgRead,
  resetSysMsgs,
  getLocalSysMsgs,

  initChatroomSDK,
  initChatroomInfos,
  resetChatroomSDK,
  sendChatroomMsg,
  sendChatroomRobotMsg,
  sendChatroomFileMsg,
  getChatroomHistoryMsgs,
  getChatroomInfo,
  getChatroomMembers,
  clearChatroomMembers
}