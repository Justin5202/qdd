<template>
  <div id="app">
    <my-audio></my-audio>
    <transition :name="transitionName">
      <!-- <keep-alive> -->
          <router-view></router-view>
      <!-- </keep-alive> -->
    </transition>
    <!-- <transition :name="transitionName"> -->
      <!-- <router-view v-if="!$route.meta.keepAlive"></router-view> -->
    <!-- </transition> -->
    <loading></loading>
    <invite :msg="inviteInfo"></invite>
  </div>
</template>

<script>
import Loading from '@/components/common/loading/loading'
import Invite from '@/components/common/invite/invite'
import MyAudio from '@/components/common/myaudio/myaudio'
import pageUtil from '@/utils/page'

const sessionHistory = window.sessionStorage

export default {
  	components: {
  		Loading,
      Invite,
      MyAudio
  	},
    data () {
      return {
        transitionName: 'forward'
      }
    },
  	name: 'app',
    watch: {
      // 更新页面所在位置，用于判断是前进页还是后退页
      '$route' (to, from) {
        if (to && from) {
          let toPath = to.path
          let fromPath = from.path
          let count = parseInt(sessionHistory.getItem('count'))
          // 如果是导航页或者没有初始记录
          if (Number.isNaN(count)) {
            count = 1
            this.transitionName = 'forward'
          } else {
            count += 1
            let fromCount = parseInt(sessionHistory.getItem(fromPath))
            let toCount = parseInt(sessionHistory.getItem(toPath))
            if (toCount < fromCount && fromCount < count && (!pageUtil.showNav(fromPath))) {
              this.transitionName = 'backward'
              count = toCount
            } else {
              this.transitionName = 'forward'
            }
            if (pageUtil.showNav(toPath)) {
              count = 1
            }
          }
          sessionHistory.setItem(toPath, count)
          sessionHistory.setItem('count', count)
        }
      }
    },
    computed: {
      inviteInfo() {
        return this.$store.state.inviteInfo
      }
    },
    mounted() {},
  	updated () {
	  	// 提交sdk连接请求
	    // this.$store.dispatch('connect', {
     //    $router: this.$router
     //  })
  	}
}
</script>

<style>
</style>
