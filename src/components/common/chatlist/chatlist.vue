<template>
  <ul id="chat-list" class="m-chat-list p-chat-list">
    <li class="u-msg item-time" v-if="canLoadMore">
      上拉加载更多
    </li>
    <li class="u-msg item-time" v-else>
       已无更多记录
    </li>
    <chat-item
      v-for="msg in msglist"
      :type="type"
      :rawMsg="msg"
      :isRobot="isRobot"
      :userInfos="userInfos"
      :myInfo="myInfo"
      :key="msg.idClient"
      @msg-loaded="msgLoaded"
    ></chat-item>
    <name-card></name-card>
  </ul>
</template>
<script>
  import util from '../../../utils'
  import config from '@/configs/config'
  import emojiObj from '@/configs/emoji'
  import ChatItem from '../chatItem/chatItem'
  import NameCard  from '../nameCard/nameCard'

  export default {
    components: {
      ChatItem,
      NameCard
    },
    props: {
      type: String, // 类型，chatroom, session
      canLoadMore: [String, Boolean],
      isRobot: {
        type: Boolean,
        default () {
          return false
        }
      },
      msglist: {
        type: Array,
        default () {
          return []
        }
      },
      userInfos: {
        type: Object,
        default () {
          return {}
        }
      },
      myInfo: {
        type: Object,
        default () {
          return {}
        }
      },
      // robotInfos: {
      //   type: Object,
      //   default () {
      //     return {}
      //   }
      // }
    },
    data () {
      return {
        isFullImgShow: false,
        msgLoadedTimer: null
      }
    },
    computed: {},
    methods: {
      showFullImg (src) {
        this.$store.dispatch('showFullscreenImg', {
          src
        })
      },
      msgLoaded () {
        clearTimeout(this.msgLoadedTimer)
        this.msgLoadedTimer = setTimeout(() => {
          this.$emit('msgs-loaded')
        }, 20)
      }
    }
  }
</script>

<style lang="scss">
  .m-chat-list {
      position: relative;
      display: block;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      padding: 0 0.3rem;
      width: 100%;
      height: 100%;
      -webkit-overflow-scrolling: touch;
      overflow-y: scroll;
      overflow-x: hidden;
  }
  .item-time {
    text-align: center;
    padding: 0.2rem 0;
  }
</style>