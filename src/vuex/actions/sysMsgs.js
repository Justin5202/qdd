import store from '../store'
import {onUpdateFriend, onDeleteFriend} from './friends'
import {onRevocateMsg} from './msgs'

export function onSysMsgs (sysMsgs) {
  store.commit('updateSysMsgs', sysMsgs)
}

export function onSysMsg (sysMsg) {
  switch (sysMsg.type) {
    // 在其他端添加或删除好友
    case 'addFriend':
      onUpdateFriend(null, {
        account: sysMsg.from
      })
      store.commit('updateSysMsgs', [sysMsg])
      break
    case 'applyFriend':
      console.log(2)
      store.commit('updateSysMsgs', [sysMsg])
      break
    case 'deleteFriend':
      onDeleteFriend(null, {
        account: sysMsg.from
      })
      break
    // 对方消息撤回
    case 'deleteMsg':
      sysMsg.sessionId = `${sysMsg.scene}-${sysMsg.from}`
      onRevocateMsg(null, sysMsg)
      break
  }
}

export function onSysMsgUnread (obj) {
  store.commit('updateSysMsgUnread', obj)
}

export function onCustomSysMsgs (customSysMsgs) {
  console.log(customSysMsgs)
  let msg = customSysMsgs
  if ('team-' + msg.to === store.state.currSessionId) {
    store.commit('updateCurrSessionMsgs', {
      type: 'put',
      msg
    })
  }
  if (!Array.isArray(customSysMsgs)) {
    customSysMsgs = [customSysMsgs]
  }
  customSysMsgs = customSysMsgs.filter(msg => {
    if (msg.type === 'custom') {
      if (msg.content) {
        try {
          let content = JSON.parse(msg.content)
          // 消息正在输入中
          if ((content.id + '') === '1') {
            return false
          }
        } catch (e) {}
      }
    }
    return true
  })
  if (customSysMsgs.length > 0) {
    store.commit('updateCustomSysMsgs', customSysMsgs)
  }
}

// 不传obj则全部重置
export function markSysMsgRead ({state, commit}, obj) {
  const nim = state.nim
  // let sysMsgs = []
  // if (obj && obj.sysMsgs) {
  //   sysMsgs = obj.sysMsgs
  // } else {
  //   sysMsgs = state.sysMsgs
  // }
  if(obj) {
    nim.markSysMsgRead({
      sysMsgs: obj,
      done: markSysMsgReadDone
    })
  }
  // if (Array.isArray(sysMsgs) && sysMsgs.length > 0) {
  //   nim.markSysMsgRead({
  //     sysMsgs,
  //     done: markSysMsgReadDone
  //   })
  // }
}

function markSysMsgReadDone(error, obj) {
    console.log('标记系统通知为已读状态' + (!error?'成功':'失败'));
    // store.commit('updateSysMsgUnread', obj)
}

export function markCustomSysMsgRead ({state, commit}) {
  commit('updateCustomSysMsgUnread', {
    type: 'reset'
  })
}

export function resetSysMsgs ({state, commit}, obj) {
  commit('resetSysMsgs', obj)
}

export function getLocalSysMsgs ({state, commit}, obj) {
  const nim = state.nim
  nim.getLocalSysMsgs({
    lastIdServer: '',
    limit: 100,
    done: getLocalSysMsgsDone
  })
}

function getLocalSysMsgsDone(error, obj) {
    console.log(error);
    console.log(obj);
    console.log('获取本地系统通知' + (!error?'成功':'失败'));
    if (!error) {
        console.log(obj.sysMsgs);
    }
}