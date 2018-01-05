/*
 * 用户账号信息
 */

import store from '../store'
import config from '@/configs/config'
import util from '@/utils'
import Axios from 'axios'
import Qs from 'qs'
import Api from '@/api/index'
import pageUtil from '@/utils/page'

export function formatUserInfo (obj) {
  const nim = store.state.nim
  let gender = ''
  switch (obj.gender) {
    case 'male':
      gender = '男'
      break
    case 'female':
      gender = '女'
      break
    case 'unknown':
      gender = ''
      break
  }

  let custom = obj.custom || ''
  try {
    custom = JSON.parse(custom)
  } catch (e) {
    custom = {
      data: custom
    }
  }

  if (obj.avatar) {
    obj.avatar = nim.viewImageSync({
      url: obj.avatar, // 必填
      thumbnail: { // 生成缩略图， 可选填
        width: 40,
        height: 40,
        mode: 'cover'
      }
    })
    // obj.avatar += '?imageView&thumbnail=40x40&quality=85'
  } else {
    obj.avatar = config.defaultUserIcon
  }

  let result = Object.assign(obj, {

    account: obj.account,
    uid: obj.uid || '',
    id: obj.id || '',
    praise: obj.praise || '',
    nickname: obj.nickname || '',
    avatar: obj.avatar || config.defaultUserIcon,
    birth: obj.birth || '',
    email: obj.email || '',
    tel: obj.tel || '',
    gender,
    sign: obj.sign || '',
    custom,
    createTime: obj.createTime || (new Date()).getTime(),
    updateTime: obj.updateTime || (new Date()).getTime()
  })

  return result
}

export function onMyInfo (obj) {
  obj = util.mergeObject(store.state.myInfo, obj);
  let myInfo = formatUserInfo(obj)
  store.commit('updateMyInfo', myInfo)
}

export function onUserInfo (users) {
  if (!Array.isArray(users)) {
    users = [users]
  }
  users = users.map(formatUserInfo)
  store.commit('updateUserInfo', users)
}

export function updateUserGoldInfo () {
  let that = this
  let time = Date.parse(new Date()) / 1000
  let str = time + store.state.str
  let token = Api.encrypted(str, time)
  Axios.post(config.API_ROOT + '/index/user/info/time/' + time,
    Qs.stringify({
      time: time,
      token: token
  })).then(function (res) {
    if(res.data.code == 200) {
      store.commit('updateMyInfo', res.data.data)
    } else {
      pageUtil.resCode(res)
    }
  })
  .catch(function (error) {
    console.log(error);
  })
}