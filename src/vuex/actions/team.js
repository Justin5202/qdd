import store from '../store'
import config from '@/configs/config'
import { Indicator, Toast } from 'mint-ui'

export function applyTeamDone(error, obj) {
    console.log(error);
    console.log(obj);
    console.log('申请入群' + (!error?'成功':'失败'));
    if(error) {
    	alert('入群失败' + error)
    } else {
    	store.commit('updateInGroup')
    }
}

export function applyTeam ({state, commit}, obj) {
	const nim = store.state.nim
	obj = obj || {}
	nim.applyTeam({
	    teamId: obj.teamId,
	    ps: '请加',
	    done: applyTeamDone
	})
}

export function onTeams(teams) {
  console.log('onTeams=>群列表', teams)
  store.commit('updateTeams', teams)
  store.commit('onInvalidTeams', teams.invalid)
}

export function onCreateTeam(team, owner) {
  store.commit('updateTeam', team)
  onTeamMembers({
    teamId: team.teamId,
    members: owner
  })
}

export function onSyncTeamMembersDone() {
  console.log('同步群列表完成')
}

export function onUpdateTeamMember({state, commit}, teamMember) {
  console.log('群成员信息更新了', teamMember)
  const nim = state.nim
  nim.onTeamMembers({
    teamId: teamMember.teamId,
    members: teamMember
  })
}

export function onTeamMembers(obj) {
  console.log('onTeamMembers:收到群成员', obj)
  store.commit('teamMembers', obj)
}

export function getTeamMembers({state, commit}, teamId) {
  const nim = state.nim
  nim.getTeamMembers({
    teamId: teamId,
    done: getTeamMembersDone
  });
}

function getTeamMembersDone(error, obj) {
  console.log(error)
  console.log(obj)
  store.commit('currentIMTeamMember', obj)
  console.log('获取群成员' + (!error ? '成功' : '失败'));
  if (!error) {
    onTeamMembers(obj);
  }
}

export function getUser({state, commit}, account) {
  const nim = state.nim
  nim.getUsers({
    accounts: account,
    done: getUserDone
  });
}

//踢人出群
export function removeTeamMembers({state, commit}, obj) {
  const nim = state.nim
  obj = obj || {}
  nim.removeTeamMembers({
      teamId: obj.teamId,
      accounts: obj.account,
      done: removeTeamMembersDone(obj.type)
  })
}
function removeTeamMembersDone(type, error, obj) {
    console.log(type)
    console.log(error); 
    console.log(obj);
    if(type !== 'dismissTeam') {
      Toast('踢人出群' + (!error?'成功':'失败'));
    }
}
//禁言
export function updateMuteStateInTeam({state, commit}, obj) {
  const nim = state.nim
  obj = obj || {}
  nim.updateMuteStateInTeam({
    teamId: obj.teamId,
    account: obj.account,
    mute: obj.booln,
    done: updateMuteStateInTeamDone
  })
}

function updateMuteStateInTeamDone(error, obj) {
    if(!error) {
      store.dispatch('getTeamMembers', obj.teamId)
    }
    console.log('更新群成员禁言状态' + (!error?'成功':'失败'), error, obj)
    if(!error && obj.mute == 1) {
      Toast('禁言成功')
    } else if(!error && obj.mute == 0) {
      Toast('解除禁言成功')
    } else {
      Toast('操作失败')
    }
}

//获取禁言列表
export function getMutedTeamMembers({state, commit}, teamId) {
  const nim = state.nim
  nim.getMutedTeamMembers({
    teamId: teamId,
    done: getMutedTeamMembersDone
  })
}

function getMutedTeamMembersDone (error, obj) {
  console.log('获取群禁言成员列表' + (!error?'成功':'失败'))
  console.log(obj)
  store.commit('updateMuteMembers', obj.members)
}

// 退群
function leaveTeamDone(error, obj) {
  console.log(error);
  console.log(obj);
  console.log('主动退群' + (!error?'成功':'失败'));
}
export function leaveTeam ({state, commit}, teamId) {
  const nim = state.nim
  console.log(teamId)
  nim.leaveTeam({
    teamId: teamId,
    done: leaveTeamDone
  })
}
function getUserDone(error, user) {
  console.log('获取用户名片' + (!error?'成功':'失败'), error, user);
  if (!error && user) {
    store.commit('Users', user)
  }}


export function getTeam({state, commit}, teamId) {
  const nim = state.nim
  nim.getTeam({
    teamId: teamId,
    done: getTeamDone
  });
}

function getTeamDone(error, obj) {
  console.log(error);
  console.log('getTeamDone', obj);
  console.log('获取群' + (!error ? '成功' : '失败'));
  store.commit('currentTeam', obj)
}

// 创建普通群
export function createNormalTeam({state, commit}, obj) {
  const nim = state.nim
  nim.createTeam({
    type: 'normal',
    name: obj.teamName,
    avatar: 'avatar',
    accounts: obj.accounts,
    ps: '我建了一个普通群',
    done: createTeamDone
  })
}

// 创建高级群
export function createAdvancedTeam({state, commit}, obj) {
  const nim = state.nim
  nim.createTeam({
    type: 'advanced',
    name: obj.teamName,
    avatar: 'avatar',
    accounts: obj.accounts,
    intro: '群简介',
    announcement: '群公告',
    /*joinMode: 'needVerify',
    beInviteMode: 'needVerify',
    inviteMode: 'manager',
    updateTeamMode: 'manager',
    updateCustomMode: 'manager',*/
    ps: '我建了一个高级群',
    done: createTeamDone
  });
}

function createTeamDone(error, obj) {
  console.log('创建' + obj.team.type + '群' + (!error ? '成功' : '失败'), error, obj);
  store.commit('createTeam', obj.team)
  if (!error) {
    onCreateTeam(obj.team, obj.owner);
  }
}

export function acceptTeamInvite({state, commit}, obj) {
  const nim = state.nim
  nim.acceptTeamInvite({
    idServer: obj.idServer,
    teamId: obj.teamId,
    from: obj.from,
    done: acceptTeamInviteDone
  })
}

function acceptTeamInviteDone(error, obj) {
  console.log('接受入群邀请' + (!error?'成功':'失败'), error, obj);
}

export function rejectTeamInvite({state, commit}, obj) {
  const nim = state.nim
  nim.rejectTeamInvite({
    idServer: obj.idServer,
    teamId: obj.teamId,
    from: obj.from,
    ps: '就不',
    done: rejectTeamInviteDone
  });
}

function rejectTeamInviteDone(error, obj) {
  console.log('拒绝入群邀请' + (!error?'成功':'失败'), error, obj);
}

export function addTeamMembers({state, commit}, obj) {
  const nim = state.nim
  nim.addTeamMembers({
    teamId: '123',
    accounts: ['a3', 'a4'],
    ps: '加入我们的群吧',
    done: addTeamMembersDone
  });
}

function addTeamMembersDone(error, obj) {
  console.log('入群邀请发送' + (!error?'成功':'失败'), error, obj);
}
