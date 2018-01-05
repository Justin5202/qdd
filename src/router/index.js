import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import store from '../vuex/store'
import Index from '@/components/page/index/index'
import CreateRoom from '@/components/page/createRoom/createRoom'
import RoomList from '@/components/page/index/RoomList/RoomList'
import Post from '@/components/page/post/post'
import Postdetail from '@/components/page/post/postdetail/postdetail'
import Shop from '@/components/page/shop/shop'
import ChatRoom from '@/components/page/ChatRoom/ChatRoom'
import Friend from '@/components/page/friend/friend'
import Mine from '@/components/page/mine/mine'
import Login from '@/components/page/login/login'
import Register from '@/components/page/register/register'
import Resetpsw from '@/components/page/resetpsw/resetpsw'
import Service from '@/components/page/service/service'
import Setting from '@/components/page/setting/setting'
import Modify from '@/components/page/modify/modify'
import History from '@/components/page/history/history'
import Chat from '@/components/page/Chat/Chat'
import P2pChat from '@/components/page/p2pChat/p2pChat'
import Openredbag from '@/components/page/openRedBag/openRedBag'
import ChatHistory from '@/components/page/chatHistory/chatHistory'
import Recharge from '@/components/page/Recharge/Recharge'
import Url from '@/components/page/url/url'
import GroupMember from '@/components/page/GroupMember/GroupMember'
import SysMsg from '@/components/page/SysMsg/SysMsg'
import Pay from '@/components/page/pay/pay'
import AddFriend from '@/components/page/addFriend/addFriend'
import MyQrCode from '@/components/page/myqrcode/myqrcode'
import About from '@/components/page/about/about'
import UserInfo from '@/components/page/userinfo/userinfo'
import Agent from '@/components/page/agent/agent'
import Author from '@/components/page/author/author'

Vue.use(Router)

const routes = [
  		//根路径
	    {
	      	path: '/',
	      	redirect: '/login'
	    },
      {
          path: '/login',
          component: Login
      },
	    // 首页
    	{
      		path: '/index',         
      		component: Index,
          meta: {
            keepAlive: true
          }
    	},
      {
          path: '/author',
          component: Author
      },
      //房间列表
      {
          path: '/roomlist/:tid/:vip',         
          component: RoomList,
          meta: {
            keepAlive: false
          }
      },
      //添加好友
      {
          path: '/search/:from',         
          component: AddFriend
      },
      {
          path: '/userinfo/:uid',         
          component: UserInfo
      },
      // 创建房间
      {
        path: '/createroom',         
        component: CreateRoom,
        meta: {
          keepAlive: true
        }
      },
      //公告
      {
          path: '/post',
          component: Post,
          children: [
            {
              path: 'postdetail/:id',
              component: Postdetail
            }
          ] 
      },
      //商城
      {
        path: '/shop',
        component: Shop,
        meta: {
          keepAlive: true
        }
      },
      //聊天大厅
      {
        path: '/ChatRoom',
        component: ChatRoom,
        meta: {
          keepAlive: true
        }
      },
      //好友
      {
        path: '/friend/:id',
        component: Friend
      },
      //个人中心
      {
        path: '/mine',
        component: Mine
      },
      //代理
      {
        path: '/agent',
        component: Agent
      },
      //记录
      {
        path: '/history',
        component: History
      },
      //登录 
      {
        path: '/login',
        component: Login
      },
      //注册
      {
        path: '/register',
        component: Register
      },
      //找回密码
      {
        path: '/resetpsw/:type',
        component: Resetpsw
      },
      //客服
      {
        path: '/service',
        component: Service
      },
      //设置
      {
        path: '/setting',
        component: Setting
      },
      //推荐码
      {
        path: '/myqrcode',
        component: MyQrCode
      },
      //关于
      {
        path: '/about',
        component: About
      },
      //修改
      {
        path: '/modify/:title/:index',
        component: Modify
      },
      // 群聊天
      {
        path: '/chat/:sessionId',
        component: Chat
      },
      //私聊
      {
        path: '/p2pchat/:sessionId',
        component: P2pChat
      },
      // 聊天历史记录
      {
        path: '/chathistory/:sessionId',
        component: ChatHistory
      },
      //拆开红包
      {
        path: '/openRedBag/:bid',
        component: Openredbag
      },
      //余额充值
      {
        path: '/recharge',
        component: Recharge
      },
      //外部链接
      {
        path: '/url',
        component: Url
      },
      //群成员
      {
        path: '/groupmember',
        component: GroupMember
      },
      //系统消息
      {
        path: '/sysmsg',
        component: SysMsg
      },
      //支付
      {
        path: '/pay/:money',
        component: Pay
      }
  	]

const router = new Router({
    routes
});

// router.beforeEach((to, from, next) => {
//     if (to.matched.some(r => r.meta.requireAuth)) {
//         if (store.state.token) {
//             next();
//         }
//         else {
//             next({
//                 path: '/login',
//                 query: {redirect: to.fullPath}
//             })
//         }
//     }
//     else {
//         next();
//     }
// })

export default router