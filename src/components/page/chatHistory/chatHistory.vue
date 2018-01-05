<template>
  <div class="g-inherit m-article p-chat-history">
    <!-- <x-header class="m-tab" :left-options="leftBtnOptions" @on-click-back = "onClickBack">
      <h1 class="m-tab-top">{{sessionName}}</h1>
      <a slot="left"></a>
      <group class="m-tab-right" slot="right">
        <datetime v-model="selectedDate" format="YYYY-MM-DD HH:mm" @on-change="selectDate" title="">历史日期</datetime>
      </group>
    </x-header> -->
    <div class="m-chat-main">
      <chat-list
        ref="chatlist"
        type="session"
        :canLoadMore="canLoadMore"
        :msglist="msglist"
        :userInfos="userInfos"
        :myInfo="myInfo"
        v-touch:swipedown="loadMore"
      ></chat-list>
    </div>
  </div>
</template>

<script>
import ChatList from '@/components/common/chatlist/chatlist'
import util from '@/utils'
import pageUtil from '@/utils/page'

export default {
  beforeMount () {
    // 如果是刷新页面，重定向至聊天页面
    // if (this.$store.state.isRefresh) {
    //   location.href = `#/chat/${this.sessionId}`
    // }
  },
  mounted () {
    this.$store.dispatch('resetNoMoreHistoryMsgs')
    this.getHistoryMsgs()
  },
  updated () {
    let tempPagePos = pageUtil.getChatListHeight()
    pageUtil.scrollChatListDown(tempPagePos - this.currPagePos)
    this.currPagePos = tempPagePos
  },
  components: {
    ChatList
  },
  data () {
    return {
      leftBtnOptions: {
        backText: ' ',
        preventGoBack: true,
      },
      currPagePos: 0,
      scene: 'team'
      // selectedDate: ''
    }
  },
  computed: {
    sessionId() {
        let sessionId = this.$route.params.sessionId
        console.log(sessionId)
        return sessionId
    },
    scene () {
        return this.thisScene
    },
    to () {
        return this.sessionId
    },
    myInfo () {
        return this.$store.state.myInfo
    },
    userInfos () {
        return this.$store.state.userInfos
    },
    msglist () {
        let msgs = this.$store.state.currSessionMsgs
        return msgs
    },
    canLoadMore () {
        return !this.$store.state.noMoreHistoryMsgs
    }
  },
  methods: {
    getHistoryMsgs () {
      if (this.canLoadMore) {
        this.$store.dispatch('getHistoryMsgs', {
          scene: this.scene,
          to: this.to
        })
      }
    },
    loadMore () {
      if (pageUtil.getChatListScroll() <= 5) {
        this.getHistoryMsgs()
      }
    },
    onClickBack: function () {
      // location.href = `#/chat/${this.sessionId}`
      window.history.go(-1)
    }
  }
}
</script>

<style scoped>
  .p-chat-history {
    .m-chat-main {
      padding: 0;
    }
  }
</style>
