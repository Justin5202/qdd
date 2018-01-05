<!-- 标题栏组件 -->
<template>
	<div class="friend">
		<top-bar v-if="from == 1" txt="我的好友" addShow="true" :isFriend="true"></top-bar>
		<top-bar v-else-if="from == 2" txt="邀请好友" returnShow="true"></top-bar>
		<tab-bar v-if="from == 1"></tab-bar>
		<div class="content">
			<ul class="sys-msg">
				<router-link v-if="from == 1" tag="li" to="/sysmsg">你有{{ sysUnreadMsgs.total }}未读系统消息</router-link>
			</ul>
			<div class="friend-wrapper">
				<!-- <div class="search">
					<input type="num" class="search-friend" v-model="value" @keyup="search(value)" placeholder="输入好友ID">
				</div> -->
				<ul v-if="friendList.length == 0">
					<li v-if="friend.length == 0">暂没有好友</li>
					<li class="clearfix" v-else v-for="item in friend">
						<span class="left">
							<img :src="item.header" alt="" @click="showNameCard(item)">
						</span>
						<span class="right" v-if="from == 1" @click="getFriend(item)">
							<span class="name" v-if="!item.remark">{{ item.nickname }}</span>
							<span class="name"v-else>{{ item.remark }}（{{item.nickname}}）</span>
						</span>
						<span class="right" v-else-if="from == 2">
							<span class="name" v-if="!item.remark">{{ item.nickname }}</span>
							<span class="name"v-else>{{ item.remark }}</span>
						</span>
						<span 
							class="unread" 
							v-for="unreadItem in sessionMap"
							v-if="unreadItem.to == item.acid && unreadItem.unread > 0 && from == 1">{{ unreadItem.unread }}</span>
						<input class="fr" type="radio" v-if="from == 2" v-model="userSelected" :value="item" name="userSelected">
					</li>
					<button v-if="from == 2" 
					:disabled="friend.length == 0" 
					class="btn big-btn" 
					:class="{active:userSelected}"
					@click="sendInvite">确定</button>
				</ul>
				<ul v-else>
					<li class="clearfix" v-for="item in friendList">
						<span class="left">
							<img :src="item.header" alt="" @click="showNameCard(item)">
						</span>
						<span class="right" v-if="from == 1" @click="getFriend(item)">
							<span class="name" v-if="!item.remark">{{ item.nickname }}</span>
							<span class="name"v-else>{{ item.remark }}</span>
						</span>
						<span class="right" v-else-if="from == 2">
							<span class="name" v-if="!item.remark">{{ item.nickname }}</span>
							<span class="name"v-else>{{ item.remark }}</span>
						</span>
						<span 
							class="unread" 
							v-for="unreadItem in sessionMap"
							v-if="unreadItem.to == item.acid && unreadItem.unread > 0 && from == 1">{{ unreadItem.unread }}</span>
						<input class="fr" type="radio" v-if="from == 2" v-model="userSelected" :value="item" name="userSelected">
					</li>
				</ul>
			</div>
		</div>
		<name-card></name-card>
	</div>
</template>

<script>
	import Vue from 'vue'
	import TopBar from '@/components/common/top-bar/top-bar'
	import TabBar from '@/components/common/tab-bar/tab-bar'
	import NameCard from '@/components/common/nameCard/nameCard'
	import Qs from 'qs'
	import Api from '@/api/index'
	import {Toast} from 'mint-ui'
	import pageUtil from '@/utils/page'
	import util from '@/utils'

	export default {
		components: {
			TopBar,
			TabBar,
			NameCard
		},
		data () {
			return {
				userSelected: '',
				value: '',
				friendList: []
			}
		},
		props: {},
	  	watch: {},
	  	methods: {
	  		getFriend (session) {
	  			if (session && session.acid) {
	  				this.$store.commit('updateCurrP2pSession', session)
      				this.$router.push({path: '/p2pchat/p2p-' + session.acid})
	  			}	
	  		},
	  		sendInvite () {
	  			this.$store.dispatch('sendMsg', {
				    type: 'custom',
				    scene: 'p2p',
				    to: this.userSelected.acid,
				    content: {
				    	type: 'invite',
				    	room: this.currSession,
				    	toName: this.userSelected.nickname
				    }
				})
	  		},
	  		showNameCard (item) {
	  			this.$router.push(`/userinfo/${item.fuid}`)
	  		},
	  		search(id) {
	  			let friend = this.$store.state.friendslist
	  			this.friendList = []
	  			for(let i = 0; i < friend.length; i++) {
	  				if(friend[i].fuid == id) {
	  					this.friendList.push(friend[i])
	  				}
	  			}
	  		}
	  	},
	  	filters: {},
	  	computed: {
	  		friend () {
	  			return this.$store.state.friendslist
	  		},
	  		sessionlist () {
		      	return this.$store.state.sessionlist
		    },
		    sessionMap () {
		    	return this.$store.state.sessionMap
		    },
		    myInfo() {
		    	return this.$store.state.myInfo
		    },
	        currSession () {
	  			return this.$store.state.currSession
	  		},
	  		from () {
	  			return this.$route.params.id
	  		},
	  		sysUnreadMsgs () {
	  			return this.$store.state.sysMsgUnread
	  		}
	  	},
	  	updated () {

	  	},
	  	created () {
	  		let that = this
			let time = Date.parse(new Date()) / 1000
			let str = time + this.$store.state.str
			let token = Api.encrypted(str, time)
	  		Api.getFriend(Qs.stringify({
					time: time,
					token: token,
					page: 1
			})).then(res => {
				if(res.data.code == 200 || res.data.code == 201) {
					that.$store.commit('updateFriends', res.data.data)
					that.$store.commit('updateIsFriend', false)
				}
			})	
	  	},
	  	mounted () {
	  		let first = null
	  		let that = this
			mui.back = function() {
            	//首次按键，提示‘再按一次退出应用’
            	if(that.from == 1) {
            		if (!first) {
		                first = new Date().getTime();//记录第一次按下回退键的时间
		                mui.toast('再按一次退出应用');
		                setTimeout(function() {//1s中后清除
		                    first = null;
		                }, 1000);
		            } else {
		                if (new Date().getTime() - first < 1000) {//如果两次按下的时间小于1s，
		                    plus.runtime.quit();//那么就退出app
		            	} 
		          	} 
            	} else {
            		history.go(-1)
            	}
	        }
	  	},
	  	destroyed () {}
	}
</script>

<style lang="scss" scoped>
	@import '~@/assets/scss/const.scss';
	@import '~@/assets/scss/mixin.scss';
	
	.friend {
		position: absolute;
    	width: 100%;
    	height: 100%;
    	top: 0;
    	background-color: #f7f7f7;
	}

	.content {
		margin-top: 1.2rem;
		.search {
			display: flex;
			margin-top: 0.2rem;
			.search-friend {
				width: 100%;
				height: 0.6rem;
				outline: 0;
				flex: 1;
				font-size: 0.28rem;
				padding: 0 0.2rem; 
				border: 0;
				border-bottom: 1px solid rgba(151,151,151,0.22);
			}
		}
		.sys-msg, .friend-wrapper {
			height: 100%;
			margin-left: 0.3rem;
			margin-right: 0.3rem;
			margin-bottom: 0.3rem;
			padding: 0 0.3rem;
			font-size: 0.36rem;
			background-color: #fff;
			box-shadow: 0 0.02rem 0.04rem 0 rgba(0,0,0,0.18);
			border-radius: 0.1rem;
			overflow-y: scroll;
    		overflow-x: hidden;
		}
		li {
			display: flex;
			padding: 0.14rem 0;
			border-bottom: 1px solid #efefef;
			img {
				display: inline-block;
				width: 0.7rem;
				height: 0.7rem;
				border-radius: 100%;
			}
			.name {
				display: inline-block;
				line-height: 0.8rem;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}
			input {
				width: 0.35rem;
				height: 0.35rem;
				margin-top: 0.28rem;
			}
			.left {
				-webkit-box-flex: 0;
			    -ms-flex: 0 0 0.6rem;
			    flex: 0 0 0.6rem;
			}
			.right {
				max-width: 80%;
				display: flex;
				flex: 1;
				margin-left: 0.3rem;
			}
			.unread {
				margin-top: 0.28rem;
			}
		}
		.big-btn {
			margin: 0.3rem 0;
			background-color: #b8b8b8;
		}
		.active {
			background-color: #E5615D;
		}
	}
</style>