<!-- 标题栏组件 -->
<template>
	<div class="friend" v-if="isShow">
		<div class="content">
			<ul class="control" v-if="lists.is_manager">
				<li @click="deleteMember">踢出玩家<i class="icon-arrow_right fr"></i></li>
				<li @click="bannedWords">设置禁言<i class="icon-arrow_right fr"></i></li>
				<li @click="checkMuteList">解除禁言<i class="icon-arrow_right fr"></i></li>
			</ul>
			<div class="blank" v-if="lists.is_manager"></div>
			<div class="mint-checklist" v-if="!muteShow">
				<a class="mint-cell" v-for="(item, index) in lists.user">
					<div class="mint-cell-left"></div> 
					<div class="mint-cell-wrapper">
						<div class="mint-cell-title">
							<label class="mint-checklist-label" :for="item.id" @click="getFriend(item)">
								<span class="mint-checkbox is-right" v-if="checkShow">
									<input type="radio" class="mint-checkbox-input" v-model="value" :value="item.id">
									<span class="mint-checkbox-core"></span>
								</span> 
								<span class="mint-checkbox-label">
									<img :src="item.header" alt="">
									<span class="name">{{ item.nickname }}</span>
								</span>
							</label>
						</div> 
						<div class="mint-cell-value">
							<span></span>
						</div>
						</div> 
					<div class="mint-cell-right"></div>
				</a>
			</div>
			<div class="mint-checklist" v-if="muteShow">
				<a class="mint-cell" v-if="muteMembers.length == 0">
					<div class="mint-cell-wrapper">
						<span class="mint-checkbox-label">
							<span>没有被禁言的成员</span>
						</span>
					</div>
				</a>
				<div v-for="item in lists.user">
					<a class="mint-cell" v-for="muteItem in muteMembers" v-if="item.acid == muteItem.account">
						<div class="mint-cell-left"></div> 
						<div class="mint-cell-wrapper">
							<div class="mint-cell-title">
								<label class="mint-checklist-label" :for="item.acid" @click="getFriend(item)">
									<span class="mint-checkbox is-right">
										<input type="radio" class="mint-checkbox-input" v-model="value" :value="item.acid">
										<span class="mint-checkbox-core"></span>
									</span> 
									<span class="mint-checkbox-label">
										<img :src="item.header" alt="">
										<span>{{ item.nickname }}</span>
									</span>
								</label>
							</div> 
							<div class="mint-cell-value">
								<span></span>
							</div>
							</div> 
						<div class="mint-cell-right"></div>
					</a>
				</div>
			</div>
		</div>
		<div class="top-bar">
			<div class="top-bar-box">
				<i class="icon-arrow_left" @click="back"></i>
				<span>成员列表</span>
				<button class="btn" @click="confirmDelete" v-if="id == 1 && checkShow">删除</button>
				<button class="btn" @click="confirmBanned" v-if="id == 2 && checkShow">禁言</button>
				<button class="btn" @click="cancelMute" v-if="id == 3 && checkShow">解除</button>
			</div>
		</div>
		<name-card></name-card>
	</div>
</template>

<script>
	import Vue from 'vue'
	import Qs from 'qs'
	import Api from '@/api/index'
	import {Toast, Checklist, MessageBox} from 'mint-ui'
	import pageUtil from '@/utils/page'
	import util from '@/utils'
	import NameCard  from '@/components/common/nameCard/nameCard'

	export default {		
		components: {
			NameCard
		},
		data () {
			return {
				value: [],
				checkShow: false,
				id: 0,
				muteShow: false
			}
		},
		props: {},
	  	watch: {},
	  	methods: {
	  		getFriend (session) {
	  			// if (session && session.acid) {
	  			// 	this.$store.commit('updateCurrP2pSession', session)
      			// 		this.$router.push({path: '/p2pchat/p2p-' + session.acid})
	  			// }	
	  		},
	  		deleteMember () {
	  			this.muteShow = false
	  			this.checkShow = !this.checkShow
	  			this.id = 1
	  		},
	  		bannedWords () {
	  			this.muteShow = false
	  			this.checkShow = !this.checkShow
	  			this.id = 2
	  		},
	  		checkMuteList () {
	  			this.checkShow = !this.checkShow
	  			this.muteShow = !this.muteShow
	  			this.id = 3
	  			this.$store.dispatch('getMutedTeamMembers', this.currSession.imtid)
	  		},
	  		confirmDelete () {
	  			if(this.value != '') {
	  				MessageBox.confirm('确定删除该成员？').then(action => {
              			let that = this
					    let time = Date.parse(new Date()) / 1000
					    let str = time + this.$store.state.str
					    let token = Api.encrypted(str, time)
					    this.$store.dispatch('showLoading')
					    Api.removeTeamMember(
						   	Qs.stringify({
						     	time: time,
						     	token: token,
						     	uid: this.value,
						     	id: this.currSession.id
						})).then(function (res) {
							that.$store.dispatch('hideLoading')
						    if(res.data.code == 200) {
						    	Toast(res.data.msg)
						    	that.getMembers()
						    } else {
						       	pageUtil.resCode(res)
						    } 
						}).catch(function (error) {
						    console.log(error);
						})
          			})
	  			}
	  		},
	  		confirmBanned () {
	  			if(this.value != '') {
	  				let acid
	  				for(let i in this.lists.user) {
	  					if(this.value == this.lists.user[i].id) {
	  						acid = this.lists.user[i].acid
	  					}
	  				}
	  				let obj = {}
	  				obj.account = acid
	  				obj.teamId = this.currSession.imtid
	  				obj.booln = true
	  				MessageBox.confirm('确定禁言该成员？').then(action => {
              			this.$store.dispatch('updateMuteStateInTeam', obj)
          			})
	  			}
	  		},
	  		cancelMute () {
	  			if(this.value.length > 0) {
	  				let obj = {}
	  				obj.account = this.value
	  				obj.teamId = this.currSession.imtid
	  				obj.booln = false
	  				MessageBox.confirm('确定解除该成员的禁言？').then(action => {
              			this.$store.dispatch('updateMuteStateInTeam', obj)
          			})
	  			}
	  		},
	  		getMembers () {
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
	  		back () {
	  			this.$store.commit('updateTeamMemberShow', false)
	  			this.muteShow = false
	  			this.checkShow = false
	  			this.id = 0
	  		}
	  	},
	  	filters: {},
	  	computed: {
	  		currSession () {
	  			return this.$store.state.currSession
	  		},
	  		muteMembers () {
	  			return this.$store.state.muteMembers
	  		},
	  		lists () {
	  			return this.$store.state.currentTeamMember
	  		},
	  		isShow () {
	  			return this.$store.state.teamMemberShow
	  		}
	  	},
	  	updated () {},
	  	created () {},
	  	mounted () {},
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
    	z-index: 25;
		.top-bar {
			position: fixed;
			top: 0;
			width: 100%;
			height: 0.88rem;
			line-height: 0.88rem;
			text-align: center;
			background-color: #fff;
			z-index: 999;
			.top-bar-box {
				padding: 0 0.24rem;
				.icon-arrow_left {
					margin: 0.25rem;
					position: fixed;
					top: 0;
					left: 0;
					z-index: 1000;
				}
				span {
					font-size: 0.36rem;
				}
				.btn {
					position: absolute;
					top: 0.14rem;
					right: 0.3rem;
					height: 0.6rem;
					border: 0;
					color: #fff;
					background-color: #E5615D;
					span {
						font-size: 0.28rem;
					}
				}
			}
		}
	}
	.content {
		margin: 0 0.3rem;
		margin-top: 1.18rem;
		font-size: 0.36rem;
		background-color: #fff;
		box-shadow: 0 0.02rem 0.04rem 0 rgba(0,0,0,0.18);
		border-radius: 0.1rem;
		.blank {
			height: 0.3rem;
			background-color: #f7f7f7;
		}
		.control li {
			padding: 0 0.3rem;
			line-height: 0.88rem;
			height: 0.88rem;
			border-bottom: 1px solid #efefef;
			position: relative;
		}
		.mint-checkbox-label {
			display: block;
			width: 85%;
			font-size: 0.36rem;
			margin: 0;
			img {
				display: inline-block;
				width: 0.6rem;
				height: 0.6rem;
				border-radius: 100%;
			}
			span {
				display: inline-block;
			}
			.name {
				line-height: 0.6rem;
				max-width: 80%;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}
		}
		.mint-checkbox {
			margin-top: 0.15rem;
		}
	}
</style>