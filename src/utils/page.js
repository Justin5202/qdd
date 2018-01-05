import config from '@/configs/config'
import cookie from '@/utils/cookie'
import { Toast } from 'mint-ui'

const pageMap = {
  'login': config.loginUrl,
  'regist': config.registUrl,
}

var scrollTimer = null

var page = {
  // 切换页面，并错误提示
  turnPage: (message, url) => {
    if (message) {
      alert(message)
    }
    if (url) {
      if (pageMap[url]) {
        url = pageMap[url]
      }
      window.location.href = url
    }
  },
  // 确定导航tab页，是否show nav
  showNav: path => {
    switch (path) {
      case '/':
        return true
      case '/session':
        return true
      case '/contacts':
        return true
      case '/room':
        return true
      case '/general':
        return true
      default:
        return false
    }
  },
  // 滚动聊天列表到底部
  scrollChatListDown: (pos, initCount) => {
    let dom = document.getElementById('chat-list')
    if (!dom) {
      return
    }
    let maxCount = 5
    initCount = initCount || 1
    if (typeof pos !== 'number') {
      pos = Math.max(dom.scrollHeight - dom.clientHeight, 888888)
    }
    dom.scrollTop = pos
    if ((dom.scrollTop < pos) && (initCount < maxCount)) {
      clearTimeout(scrollTimer)
      scrollTimer = setTimeout(() => {
        initCount++
        page.scrollChatListDown(pos, initCount)
      }, 200)
    }
  },
  getChatListHeight: () => {
    return document.getElementById('chat-list').scrollHeight
  },
  getChatListScroll: () => {
    return document.getElementById('chat-list').scrollTop
  },
  resCode: (res) => {
    let code = res.data.code
    if(code == 0) {
      cookie.delCookie('uid')
      cookie.delCookie('sdktoken')
      cookie.delCookie('tokenStr')
      localStorage.removeItem('uid')
      localStorage.removeItem('sdktoken')
      location.href = config.loginUrl
      Toast(res.data.msg)
    } else if(code < 200 && code > 0) {
      Toast(res.data.msg)
    } else if(code > 200) {
      Toast(res.data.msg)
    }
  }
}

export default page