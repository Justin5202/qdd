<!-- 标题栏组件 -->
<template>
	<div class="chat">
		<div class="chat-top clearfix">
			<div class="gold-coin fl" v-if="currSession.gold_type == 1">
				<i class="ico-gold fl"></i>
				<span class="fl">{{ myInfo.gold / 100 }}</span>
			</div>
			<div class="gold-coin fl" v-else-if="currSession.gold_type == 2">
				<i class="ico-silver fl"></i>
				<span class="fl">{{ myInfo.silver / 100 }}</span>
			</div>
			<ul class="bag-list fl">
				<li v-if="!lastRedBag.length" @click="openRedBag(lastRedBag.bid)">
					<i class="icon-hb icon-bag"></i>
				</li>
				<li class="bag-list-item" v-else v-for="item in lastRedBag" @click="openRedBag(item.id)">
					<i class="icon-hb icon-bag"></i>
				</li>
			</ul>
		</div>
		<!-- 大喇叭 -->
		<div class="speaker" id="demo" ref="demo" v-if="speakerMsglist.length != 0">
			<!-- <ul :class="{ message : speakerMsgs.length != 0 }"> -->
			<div class="qimo">
				<div class="demo1 fl" id="demo1" ref="demo1">
					<ul>
						<li class="blank"></li>
						<li v-for="item in speakerMsglist">
							<span class="icon-speaker"></span>
							<span :class="{color:item[0].from == 'qdd@phone@0'}">
								{{ item[0].fromNick }}：{{ item[0].text }}
							</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<open-red-bag v-if="opened" :bid="bid"></open-red-bag>
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
		<div class="top-bar">
			<div class="top-bar-box">
				<span class="room-name">{{ roomName }}(房号: {{ currSession.id }})</span>
				<small v-if="currSession.gold_type == 1">
					(<small>{{ currSession.tname }} {{ currSession.gold / 100 }}金豆 {{ currSession.number }}包 {{ currSession.multiple }}倍 </small>
					<small v-if="currSession.reward && currSession.reward.sz">顺子:奖励{{ currSession.reward.sz }}</small> 
					<small v-if="currSession.reward && currSession.reward.zd">炸弹:奖励{{ currSession.reward.zd }}</small>)<small v-if="currSession.rtype == 1 && currSession.type == 1">最小</small><small v-else-if="currSession.rtype == 1 && currSession.type == 2">最大</small>
				</small>
				<small v-else>
					(<small>{{ currSession.tname }} {{ currSession.gold / 100 }}金豆 {{ currSession.number }}包 {{ currSession.multiple }}倍 </small>
					<small v-if="currSession.reward && currSession.reward.sz">顺子:奖励{{ currSession.reward.sz }}</small> 
					<small v-if="currSession.reward && currSession.reward.zd">炸弹:奖励{{ currSession.reward.zd }}</small>)<small v-if="currSession.rtype == 1 && currSession.type == 1">最小</small><small v-else-if="currSession.rtype == 1 && currSession.type == 2">最大</small>
				</small>
				<span class="group" @click="showTeamMember"></span>
			</div>
		</div>
		<i class="icon-arrow_left" @click="leaveGroup"></i>
		<chateditor
			v-if="!opened"
			:scene="scene"
        	:to="to"
        	:goldType="gold_type"
        	:id="id"
        	:number="number"
        	:goldNum="gold_num"
        	:addShow="true">
		</chateditor>
		<red-bag v-if="openRedBagShow"></red-bag>
		<sendredbag
			v-if="sendRedBagShow"
		    :scene="scene"
		    :to="to"
		    :goldType="gold_type"
		    :id="id"
		    :number="number"
		    :goldNum="gold_num"
		    :giveGoldNum="solitaireRedBagInfo.gold"
		    :qid="solitaireRedBagInfo.qid"
		    :fuid="fuid">
		</sendredbag>
		<group-member></group-member>
	</div>
</template>

<script>
	import Vue from 'vue'
	import TopBar from '@/components/common/top-bar/top-bar'
	import ChatList from '@/components/common/chatlist/chatlist'
	import Chateditor from '@/components/common/chateditor/chateditor'
	import Sendredbag  from '@/components/common/sendRedBag/sendRedBag'
	import redBag from '@/components/common/redbag/redbag'
	import OpenRedBag  from '@/components/page/openRedBag/openRedBag'
	import GroupMember  from '@/components/page/GroupMember/GroupMember'
	import Qs from 'qs'
	import Api from '@/api/index'
	import pageUtil from '@/utils/page'
	import util from '@/utils'
	import { MessageBox, Toast } from 'mint-ui'

	export default {
		beforeMount () {
			// 如果是刷新页面，重定向至聊天室列表页面
		    // this.$store.dispatch('connect', {
		    //     type: 'group',
		    //     groupId: this.sessionId
		    // })
		    this.$store.commit('updateOpenRedBagShow', false)
		    this.$store.dispatch('hideRedBag')
		   	this.$store.commit('updateSpeakerShow', false)
		},
		components: {
			TopBar,
			ChatList,
			Chateditor,
			redBag,
			Sendredbag,
			OpenRedBag,
			GroupMember
		},
		data () {
			return {
				currPagePos: 0,
				activeIndex: 0,
				msgs: this.$store.state.speakerMsgs,
				timer: ''
			}
		},
		props: {},
	  	watch: {
	  		// msgs: 'marquee'
	  	},
	  	methods: {
	  		leaveGroup () {
	  			this.$store.dispatch('getTeamMembers', this.to)
		    	if(this.allowReturn) {
		    		if(this.currSession.uid != this.myInfo.id) {
		    			MessageBox.confirm('是否退出当前房间？').then(action => {
              				this.leaveRoom()
          				})
		    		} else {
		    			MessageBox.confirm('退出后会直接解散房间，是否确认退出？').then(action => {
		    				let members = this.lists.members
		    				let obj = {
		    					teamId: this.lists.teamId,
		    					type: 'dismissTeam',
		    					account: []
		    				}
		    				for(let i in members) {
		    					if(members[i].account && members[i].account !== this.myInfo.acid) {
		    						obj.account.push(members[i].account)
		    					}
		    				}
		    				if(obj.account.length == 0) {
		    					this.leaveRoom()
		    				} else {
		    					this.$store.dispatch('removeTeamMembers', obj)
		    					this.leaveRoom()
		    				}
		    				
              				
          				})
		    		}
		    	}
		    },
		    leaveRoom () {
		    	let that = this
				let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				this.$store.dispatch('showLoading')
				Api.leaveRoom(
					Qs.stringify({
						time: time,
						token: token,
						rid: this.currSession.id
				})).then(function (res) {
					that.$store.dispatch('hideLoading')	
		    		if(res.data.code == 200) {
		    			//隐藏所有组件
		    			history.go(-1)
		    		} else {
		    			pageUtil.resCode(res)
		    		}
		  		})
		  		.catch(function (error) {
		    		console.log(error);
		  		})
		    },
		    msgsLoaded () {
		      	pageUtil.scrollChatListDown()
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
		    },
			hideElement () {
				this.$store.commit('updateTool', false)
				this.$store.commit('updateEmoji', false)
				this.$store.commit('updateTeamMemberShow', false)
			},
			getInfo () {
	  			let that = this
		        let time = Date.parse(new Date()) / 1000
		        let str = time + this.$store.state.str
		        let token = Api.encrypted(str, time)
		        this.$store.dispatch('showLoading')
		        Api.getTeamMembersInfo(
				   	Qs.stringify({
				     	time: time,
				     	token: token,
				     	id: this.currSession.id
				})).then(function (res) {
					that.$store.dispatch('hideLoading')
				    if(res.data.code >= 200 && res.data.code < 300 ) {
				    	that.$store.commit('currentTeamMember', res.data.data)
				    } else {
				       	pageUtil.resCode(res)
				    } 
				}).catch(function (error) {
				    console.log(error);
				})
	  		},
			showTeamMember () {
				this.getInfo()
				this.$store.commit('updateTeamMemberShow', true)
			},
			marquee () {
				let that = this
				if(this.speakerMsglist.length != 0) {
					let demo = this.$refs.demo
					let demo1 = this.$refs.demo1
					that.timer = setInterval(() => {
						if(demo && demo1) {
							if(demo.scrollLeft - demo1.offsetWidth >= 200) {
							 	demo.scrollLeft -= demo1.offsetWidth
							 	this.$store.commit('updateSpeakerMsgs', '')
							}
							else {
							 	demo.scrollLeft++
							}
						}
					}, 10)
				}
			},
			getLastRedBag() {
		        let that = this
		        let time = Date.parse(new Date()) / 1000
		        let str = time + this.$store.state.str
		        let token = Api.encrypted(str, time)
		        Api.getLastRedBag(
		          Qs.stringify({
		            time: time,
		            token: token,
		            rid: this.currSession.id
		        })).then(function (res) {
		            if(res.data.code == 200) {
		            	that.$store.commit('updateLastRedBag', res.data.data)
		            }
		        }).catch(function (error) {
		            console.log(error);
		        })
		    },
		    openRedBag (bid) {
		        let that = this
		        let time = Date.parse(new Date()) / 1000
		        let str = time + this.$store.state.str
		        let token = Api.encrypted(str, time)
		        this.$store.dispatch('showLoading')
		        Api.hbInfo(
		          Qs.stringify({
		            time: time,
		            token: token,
		            bid: bid
		        })).then(function (res) {
		            that.$store.dispatch('hideLoading')
		            that.$store.commit('updateRedBagInfo', res.data.data)
		            if(res.data.code == 200 ) {
		              if(res.data.data.status == 1) {
		                that.$store.commit('updateOpenRedBagShow', true)
		              } else if(res.data.data.status == 2) {
		                Toast(res.data.msg)
		              } else {
		                that.$store.commit('updateOpenRedBagShow', true)
		              }
		            } else if(res.data.code == 500) {
		              Toast(res.data.msg)
		            } else if(res.data.code > 200 && res.data.code < 500) {
		              that.$store.commit('updateOpenedRedBagShow', true)
		            } else {
		              pageUtil.resCode(res)
		            }
		        }).catch(function (error) {
		            console.log(error);
		        })
		      }
	  	},
	  	filters: {},
	  	computed: {
	  		allowReturn () {
	  			if(this.$store.state.btnItemShow != -1) {
	  				return false
	  			} else {
	  				return true
	  			}
	  		},
	  		currSession () {
	  			return this.$store.state.currSession
	  		},
	  		sessionId() {
	  			let sessionId = this.$route.params.sessionId
      			return sessionId
	  		},
	  		roomName() {
	  			let roomName = this.currSession.name
	  			return roomName
	  		},
	  		id () {
	  			return this.currSession.id
	  		},
	  		gold_type () {
	  			return this.currSession.gold_type
	  		},
	  		number () {
	  			return this.currSession.number
	  		},
	  		gold_num () {
	  			return this.currSession.gold
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
		    canLoadMore () {
		      	return !this.$store.state.noMoreHistoryMsgs
		    },
		    // speakerMsgs () {
		    // 	return this.$store.state.speakerMsgs
		    // },
		    speakerMsglist () {
		      	return this.$store.state.speakerMsgs
		    },
		    solitaireRedBagInfo () {
	  			return this.$store.state.solitaireRedBagInfo
	  		},
	  		fuid () {
	        	return this.$store.state.userSelected.id
	        },
	        redBagInfo () {
	  			return this.$store.state.redBagInfo
	  		},
	        bid () {
	        	return this.redBagInfo.id
	        },
	        opened () {
	  			return this.$store.state.openedRedBagShow
	  		},
	  		sendRedBagShow () {
	  			return this.$store.state.redbagShow
	  		},
	  		lastRedBag() {
	  			return this.$store.state.lastRedBag
	  		},
	  		lists () {
	  			return this.$store.state.currentIMTeamMember
	  		},
	  		isShow () {
	  			return this.$store.state.teamMemberShow
	  		},
	  		speakerShow () {
	  			return this.$store.state.speakerShow
	  		}
	  	},
	  	created () {
	  		this.getLastRedBag()
	  	},
	  	mounted () {
	  		// 此时设置当前会话
    		this.$store.dispatch('setCurrSession', this.sessionId)
    		this.$store.dispatch('getTeamMembers', this.to)
    		this.$store.dispatch('resetNoMoreHistoryMsgs')
    		this.getHistoryMsgs()
    		let that = this
    		mui.back = function() {
				if(that.opened || that.sendRedBagShow || that.openRedBagShow || that.isShow || that.speakerShow) {
					that.$store.commit('updateTeamMemberShow', false)
			    	that.$store.commit('updateOpenedRedBagShow', false)
			    	that.$store.commit('updateOpenRedBagShow', false)
					that.$store.commit('updateSpeakerShow', false)
					that.$store.commit('updateSpeakerShow', false)
					return
				}
				if(that.$store.state.btnItemShow == -1) {
		  			if(that.currSession.uid != that.myInfo.id) {
			    		MessageBox.confirm('是否退出当前房间？').then(action => {
	              			that.leaveRoom()
	          			})
			    	} else {
			    		MessageBox.confirm('退出后会直接解散房间，是否确认退出？').then(action => {
	              			that.leaveRoom()
	          			})
			    	}
		  		}
    			
	        }
	  	},
	  	updated () {
	  		clearInterval(this.timer)
	  		this.marquee()
	  		pageUtil.scrollChatListDown()
	  	},
	  	destroyed () {
	  		this.$store.dispatch('resetCurrSession')
	  		this.$store.commit('updateTeamMemberShow', false)
		    this.$store.commit('updateOpenedRedBagShow', false)
		    this.$store.commit('updateOpenRedBagShow', false)
			this.$store.commit('updateSpeakerShow', false)
	  	}
	}
</script>

<style lang="scss" scoped>
	@import '~@/assets/scss/const.scss';
	@import '~@/assets/scss/mixin.scss';
	
	.content {
		margin-top: 0;
	}
	.top-bar {
		position: fixed;
		top: 0;
		width: 100%;
		height: 0.88rem;
		text-align: center;
		background-color: #fff;
		z-index: 0;
		.top-bar-box {
			padding: 0 0.24rem;
			span {
				margin-top: 0.18rem;
				display: block;
			    font-size: 0.32rem;
			    color: #000;
			}
			.room-name {
				margin-top: 0.13rem;
			}
			small {
				display: inline-block;
				font-size: 0.22rem;
				color: #bbbbbb;
			}
			.group {
				position: absolute;
				top: 0;
				right: 0.25rem;
				width: 0.5rem;
				height: 0.5rem;
				background: url('../../../assets/icon/group_fill.png') no-repeat;
				background-size: 100%;
			}
		}
	}
	.chat {
		position: absolute;
	    padding-top: 1.79rem;
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
	.chat-top {
		width: 100%;
		position: fixed;
		top: 0.88rem;
		left: 0;
		padding: 0.2rem 0.3rem;
		z-index: 0;
		border-top: 1px solid #eaeaea;
		background-color: #fff;
		.bag-list {
			margin-left: 1.1rem;
			.icon-bag {
			    width: 0.7rem;
			    height: 0.5rem;
				background: url('../../../assets/icon/bag.gif') no-repeat;
				background-size: 100%;
			}
		}
	}
	.icon-arrow_left {
		margin: 0.25rem;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 0;
	}
	.gold-coin {
		margin-top: 0.1rem;
		min-width: 2rem;
		.ico-gold, .ico-silver {
			margin-right: 0.3rem;
		}
	}
	.speaker {
		width: 100%;
		position: fixed;
		top: 1.63rem;
		background-color: #fee3ae;
		z-index: 24;
		overflow: hidden;
		.qimo {
			width: 8000%;
			height: 0.6rem;
			.demo1, .demo2 {
				float: left;
			}
			ul {
				float: left;
				// margin-left: 100%;
				overflow: hidden;
				position: relative;
				.blank {
					width: 7.5rem;
					height: 0.6rem;
				}
				li {
					float: left;
					padding: 0 0.5rem;
					line-height: 0.6rem;
					position: relative;
					.icon-speaker {
						position: absolute;
						left: 0;
						top: 0.1rem;
					}
				}
				.color {
					color: #E5615D;
				}
			}
		}
	}
</style>