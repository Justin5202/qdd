<!-- 标题栏组件 -->
<template>
	<div class="friend">
		<top-bar txt="系统消息" returnShow="true"></top-bar>
		<div class="content">
			<ul>
				<li v-if="!sysMsgLists">暂没有系统消息</li>
				<li class="clearfix" v-for="(item, index) in sysMsgLists">
					<div class="item-content" @click="showBtn(index, item)">{{ item.showText }}
						<span class="unread" v-if="!item.read"></span>
					</div>
					<transition enter-active-class="slideInDown" leave-active-class="slideOutUp">
						<div>
							<div class="item-btn" v-if="!item.read && activeIndex === index">
								<span class="btn" @click="handle(item, pass, JSON.parse(item.ps).uid)">接受</span><span class="btn" @click="handle(item, refuse, JSON.parse(item.ps).uid)">拒绝</span>
							</div>
							<div class="item-btn tips" v-else-if="item.read && activeIndex === index">{{ tips }}
							</div>
						</div>
					</transition>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import TopBar from '@/components/common/top-bar/top-bar'
	import Qs from 'qs'
	import Api from '@/api/index'
	import {Toast} from 'mint-ui'
	import pageUtil from '@/utils/page'
	import util from '@/utils'

	export default {
		components: {
			TopBar,
		},
		data () {
			return {
				isShow: false,
				showTips: false,
				activeIndex: '',
				pass: 1,
				refuse: 2,
				tips: '你们已经成为好友',
				friendList: ''
			}
		},
		props: {},
	  	watch: {},
	  	methods: {
	  		showBtn (index, item) {
	  			if(!item.msgType) {
	  				this.activeIndex = index
	  				this.isShow = !this.isShow
	  			} else {
	  				this.$store.dispatch('markSysMsgRead', item)
	  				this.getFriend()
	  			}
	  		},
	  		handle (item, status, uid) {
	  			let that = this
				let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				this.$store.dispatch('showLoading')
				Api.handleFriend(
					Qs.stringify({
						time: time,
						token: token,
						fuid: uid,
						status: status
				})).then(function (res) {
					that.$store.dispatch('hideLoading')	
		    		if(res.data.code == 200) {
		    			that.isShow = false
		    			that.showTips = true
		    			Toast(res.data.msg)
		    			that.getFriend()
		    			//标记消息已经处理
		    			that.$store.dispatch('markSysMsgRead', item)
		    		} else {
		    			pageUtil.resCode(res)
		    		}
		  		})
		  		.catch(function (error) {
		    		console.log(error);
		  		})
	  		},
	  		getFriend () {
	  			let that = this
				let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
	  			Api.getFriend(Qs.stringify({
					time: time,
					token: token,
					page: 1
				})).then(res => {
					if(res.data.code == 200) {
						that.friendList = res.data.data
						that.$store.commit('updateFriends', res.data.data)
					}
				})
	  		}
	  	},
	  	filters: {},
	  	computed: {
	  		userInfos () {
	  			console.log(this.$store.state.userInfos)
		      	return this.$store.state.userInfos
		    },
	  		sysMsgs () {
		      	let sysMsgs = this.$store.state.sysMsgs.filter(msg => {
		        	switch (msg.type) {
			          	case 'addFriend':
				            msg.showText = `${msg.friend.alias || msg.friend.account} 添加您为好友~`
				            msg.avatar = this.userInfos[msg.from].avatar
				        	return true
				        case 'applyFriend':
				            // msg.showText = this.userInfos[msg.from].nickname + '请求添加您为好友~'
				            if(JSON.parse(msg.ps).nickname) {
				            	msg.showText = JSON.parse(msg.ps).nickname + '请求添加您为好友~'
				            } else {
				            	msg.msgType = 'notification'
				            	msg.showText = JSON.parse(msg.ps).content
				            }
				        	return true
			          	case 'deleteFriend':
				            msg.showText = `${msg.from} 将您从好友中删除`
				            msg.avatar = this.userInfos[msg.from].avatar
				        	return false
			        }
			        return false
			    })
			    if(sysMsgs.length > 0) {
			    	localStorage.setItem('SysMsgs', JSON.stringify(sysMsgs))
			    }
		      	return sysMsgs
		    },
		    sysMsgLists () {
		    	let data = this.sysMsgs
		    	return JSON.parse(localStorage.getItem('SysMsgs'))
		    },
		    customSysMsgs () {
		      	let customSysMsgs = this.$store.state.customSysMsgs.filter(msg => {
		        if (msg.scene === 'p2p') {
		          	let content = JSON.parse(msg.content)
		          	msg.showText = `${content.content}`
		          	msg.avatar = this.userInfos[msg.from].avatar
		          	return msg
		        }
		        	return false
		      	})
		      	return customSysMsgs
		    }
	  	},
	  	mounted () {
	  		// this.$store.dispatch('getLocalSysMsgs')
	    	// this.$store.dispatch('markSysMsgRead')
	    	// this.$store.dispatch('markCustomSysMsgRead')
	    	mui.back = function() {
            	history.go(-1)
	        }
	  	},
	  	updated () {
	    	// this.$store.dispatch('markSysMsgRead')
	    	// this.$store.dispatch('markCustomSysMsgRead')
	  	},
	  	created () {},
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
		margin: 0 0.3rem;
		margin-top: 1.2rem;
		padding: 0 0.3rem;
		font-size: 0.36rem;
		box-shadow: 0 0.02rem 0.04rem 0 rgba(0,0,0,0.18);
		border-radius: 0.1rem;
		background-color: #fff;
		ul li {
			border-bottom: 1px solid #efefef;
			.item-content {
				height: 0.88rem;
				line-height: 0.88rem;
				padding: 0.14rem 0;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
				.unread {
					width: 0.2rem;
					height: 0.2rem;
					margin-top: 0.37rem;
				}
			}
			.item-btn {
				margin: 0 -0.3rem;
				background-color: #f7f7f7;
				height: 0.88rem;
				line-height: 0.88rem;
				text-align: center;
				.btn {
					display: inline-block;
					width: 50%;
					border: 0;
					background-color: transparent;
				}
				:nth-child(2), .tips {
					color: #bbbbbb;
				}
			}
			.tips {
				color: #bbbbbb;
			}
		}
	}
</style>