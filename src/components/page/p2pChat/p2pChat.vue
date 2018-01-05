<!-- 标题栏组件 -->
<template>
	<div class="chat">
		<top-bar :txt="roomName" returnShow="true"></top-bar>
		<div class="chat-main" @click="hideElement">
			<chat-list
		        type="session"
		        :msglist="msglist"
		        :userInfos="userInfos"
		        :myInfo="myInfo"
		        :canLoadMore="canLoadMore"
		        @msgs-loaded="msgsLoaded"
		        v-touch:swipedown="loadMore"
		      ></chat-list>
		</div>
		<chateditor
			:scene="scene"
        	:to="to"
        	:goldType="gold_type"
        	:id="id"
        	:number="number"
        	:goldNum="gold_num"
        	:addShow="false">
		</chateditor>
		<sendredbag
			v-if="sendRedBagShow"
		    :fuid="fuid"
		    :goldType="1">
		</sendredbag>
		<!-- <red-bag v-if="openRedBagShow" :class="{ zoomIn: openRedBagShow }"></red-bag> -->
	</div>
</template>

<script>
	import Vue from 'vue'
	import TopBar from '@/components/common/top-bar/top-bar'
	import ChatList from '@/components/common/chatlist/chatlist'
	import Chateditor from '@/components/common/chateditor/chateditor'
	import redBag from '@/components/common/redbag/redbag'
	import Sendredbag  from '@/components/common/sendRedBag/sendRedBag'
	import Qs from 'qs'
	import Api from '@/api/index'
	import pageUtil from '@/utils/page'
	import util from '@/utils'

	export default {
		beforeMount () {
			// 如果是刷新页面，重定向至聊天室列表页面
		    // this.$store.dispatch('connect', {
		    //     type: 'group',
		    //     groupId: this.sessionId
		    // })
		},
		components: {
			TopBar,
			ChatList,
			Chateditor,
			redBag,
			Sendredbag
		},
		data () {
			return {
				currPagePos: 0
			}
		},
		props: {},
	  	watch: {},
	  	methods: {
		    msgsLoaded () {
		      	pageUtil.scrollChatListDown()
		    },
		    hideElement () {
				this.$store.commit('updateEmoji', false)
			},
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
		    }
	  	},
	  	filters: {},
	  	computed: {
	  		currSession () {
	  			return this.$store.state.currP2pSession
	  		},
	  		sessionId() {
	  			let sessionId = this.$route.params.sessionId
      			return sessionId
	  		},
	  		id () {
	  			let id = this.currSession.id
	  			return id
	  		},
	  		roomName() {
	  			let roomName = this.currSession.nickname
	  			return roomName
	  		},
	  		gold_type () {
	  			return this.currSession.gold_type
	  		},
	  		number () {
	  			return this.currSession.number
	  		},
	  		gold_num () {
	  			return this.currSession.gold_num
	  		},
	  		scene () {
	  			this.$store.commit('updateCurrScene', util.parseSession(this.sessionId).scene)
	  			return util.parseSession(this.sessionId).scene
	  		},
		    to () {
		    	return util.parseSession(this.sessionId).to
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
		    openRedBagShow () {
		    	return this.$store.state.openRedBagShow
		    },
		    goldCoinNum () {
		    	return this.$store.state.myInfo.gold
		    },
		    canLoadMore () {
		      	return !this.$store.state.noMoreHistoryMsgs
		    },
		    sendRedBagShow () {
	  			return this.$store.state.redbagShow
	  		},
	  		fuid () {
	        	return this.$store.state.userSelected.fuid
	        }
	  	},
	  	created () {},
	  	mounted () {
	  		// 此时设置当前会话
    		this.$store.dispatch('setCurrSession', this.sessionId)
    		this.$store.dispatch('resetNoMoreHistoryMsgs')
    		this.getHistoryMsgs()
    		this.$store.dispatch('hideLoading')
    		mui.back = function() {
	            history.go(-1)
	        }
	  	},
	  	updated () {
	  		pageUtil.scrollChatListDown()
	  	},
	  	destroyed () {
	  		this.$store.dispatch('resetCurrSession')
	  	}
	}
</script>

<style lang="scss" scoped>
	@import '~@/assets/scss/const.scss';
	@import '~@/assets/scss/mixin.scss';
	
	.content {
		margin-top: 0;
	}
	.chat {
		position: absolute;
	    padding-top: 0.88rem;
	    display: block;
	    -moz-box-sizing: border-box;
	    box-sizing: border-box;
	    top: 0;
	    bottom: 0;
	    left: 0;
	    width: 100%;
	    height: 100%;
	    -webkit-overflow-scrolling: touch;
	    overflow-y: auto;
	    overflow-x: hidden;
	    background-color: #f7f7f7;
	}
	.chat-main {
		padding-bottom: 1rem; 
		position: relative;
	    display: block;
	    -moz-box-sizing: border-box;
	    box-sizing: border-box;
	    width: 100%;
	    height: 100%;
	    overflow: hidden;
	}
	.icon-arrow_left {
		margin: 0.25rem;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
	}
	.gold-coin {
		width: 100%;
		position: fixed;
		top: 0.88rem;
		left: 0;
		padding: 0.2rem 0.3rem;
		z-index: 998;
		border-top: 1px solid #eaeaea;
		background-color: #fff;
		.ico-gold {
			margin-right: 0.3rem;
		}
	}
</style>