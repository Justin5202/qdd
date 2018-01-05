/* 内存数据状态 */
import cookie from '@/utils/cookie'

export default {
  // 正在加载中
  isLoading: false,
  // 操作是否是刷新页面，刷新初始没有nim实例，会导致时序问题
  isRefresh: true,
  // 全屏显示的原图
  isFullscreenImgShow: false,
  fullscreenImgSrc: '',
  // 切页动画 forward，backward
  transitionName: 'forward',

  //token相关
  // str: cookie.readCookie('tokenStr'),
  str: '',
  token: null,
  //登录成功跳转首页
  isLogin: false,
  wxLoginInfo: '',

  // IM相关
  // NIM SDK 实例
  nim: null,
  // 登录账户ID
  userUID: null,
  // 用户名片
  isZoomIn: false,
  userSelected: {},
  myInfo: {},
  // 好友/黑名单/陌生人名片, 数据结构如：{cid: {attr: ...}, ...}
  userInfos: {},
  // 用户订阅的事件同步, 数据结构如：{cid: {typeid: {...}, ...}, ...}
  userSubscribes: {},
  //url
  url: '',
  alipayUrl: '',
  playTypeShow: 0,
  ToolShow: false,
  emojiShow: false,
  teamMemberShow: false,
  //红包相关
  redbagShow: false,
  redBagInfo: {},
  openRedBagShow: false,
  openedRedBagShow: false,
  btnItemShow: -1,
  exchangeNum: '',
  //接龙红包信息
  jlRedBagInfo: '',
  //结算红包信息
  solitaireRedBagInfo: '',
  rewardRedBagInfo: '',
  lastRedBag: [],
  //房间相关
  currRoomList: '',
  //创建房间
  createRoomShow: false,
  //喇叭
  speakerShow: '',
  bigSpeakerMsgs: [],
  // 好友列表
  friendslist: [],
  isFriend: '',
  // 机器人列表
  robotslist: [],
  // 用于判定帐号是否是robots
  robotInfos: {},
  robotInfosByNick: {},
  // 黑名单列表
  blacklist: [],
  // 禁言列表
  // mutelist: [],
  //群相关
  //是否已加群
  isInGroups: false,
  teamlist: [],
  // 群自身的属性，数据结构如：{tid: {attr: ...}, ...}
  teamAttrs: {},
  // 群对象的成员列表，数据结构如：{tid: {members: [...], ...}, ...}
  teamMembers: {},
  muteMembers: [], //禁言列表
  currentTeamMember: {},
  currentIMTeamMember: {},
  // 消息列表
  msgs: {}, // 以sessionId作为key
  msgsMap: {}, // 以idClient作为key，诸如消息撤回等的消息查找
  unread: '', //未读消息总数
  whoAddMsg: [],
  //邀请信息
  inviteInfo: {},
  inviteShow: false,
  // 会话列表
  sessionlist: [],
  sessionMap: {},
  //当前群列表
  currSession: {},
  //当前个人会话
  currP2pSession:{},
  // 当前会话ID（即当前聊天列表，只有单聊群聊采用，可用于判别）
  currSessionId: null,
  currScene: null,
  currSessionMsgs: [],
  // 是否有更多历史消息，用于上拉加载更多
  noMoreHistoryMsgs: false,
  // 继续对话的机器人id
  continueRobotAccid: '',

  // 系统消息
  sysMsg: [],
  sysMsgs: [],
  customSysMsgs: [],
  sysMsgUnread: {
    total: 0
  },
  customSysMsgUnread: 0,

  // 临时变量
  // 缓存需要获取的用户信息账号,如searchUser
  searchedUsers: [],
  // 缓存需要获取的群组账号
  searchedTeams: [],

  // 聊天室相关
  // 聊天室sdk实例
  chatroomInsts: {},
  chatroomInfos: {},
  // 聊天室分房间消息集合
  chatroomMsgs: {},
  //聊天室作为公告栏
  speakerMsgs: [],
  // 当前聊天室实例及id
  currChatroom: null,
  currChatroomId: null,
  currChatroomMsgs: [],
  currChatroomInfo: {},
  // 聊天室成员列表
  currChatroomMembers: [],
}