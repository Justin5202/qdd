<template>
	<div>
		<div class="mask" @click="hide" v-show="isShow"></div>
		<transition enter-active-class="zoomIn" leave-active-class="zoomOut">
			<div class="bag" v-if="isShow">
				<h2>邀请函</h2>
				<div class="invite-content">
					{{msg.from}} 邀请你一起抢宝箱
					<span class="room-info" v-if="msg.room.rtype == 1">房间类型：{{msg.room.name}} 接龙房间</span>
          <span class="room-info" v-else-if="msg.room.rtype == 2">房间类型：{{msg.room.name}}扫雷房间</span>
          <span class="room-info">房间倍数：{{msg.room.gold / 100}}豆 {{msg.room.number}}包 {{msg.room.multiple}}倍</span>
				</div>
				<div class="btn-wrapper">
					<span class="ref" @click="hide">拒绝</span>
					<span class="rec" @click="rec(msg.room)">接受</span>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import Qs from 'qs'
	import Api from '@/api/index'

	export default {
		data() {
			return {
				
			}
		},
		props: {
			msg: {
				type: Object,
				default: {}
			}
		},
		methods: {
			rec(item) {
				let that = this
				let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				this.$store.dispatch('showLoading')
				Api.enterRoom(
					Qs.stringify({
						time: time,
						token: token,
						rid: item.id
				})).then(function (res) {
					that.$store.dispatch('hideLoading')
					that.$store.commit('updateInviteShow', false)
	    			if(res.data.code == 200) {
	    				if (item) {
	    					that.$store.commit('updateCurrSession', item)
        					that.$router.push({path: '/chat/team-' + item.imtid})
	    				}	
	    			} else {
	    				pageUtil.resCode(res)
	    			}
	  			})
	  			.catch(function (error) {
	    			console.log(error);
	  			})
			},
			hide() {
				this.$store.commit('updateInviteShow', false)
			}
		},
		computed: {
			isShow() {
				return this.$store.state.inviteShow
			}
		}
	}
</script>

<style scoped lang="scss">
	.bag {
		position: fixed;
		top: 50%;
		left: 50%;
		width: 5.9rem;
		max-height: 4.39rem;
		padding-top: 0.2rem;
		margin-top: -2.195rem;
		margin-left: -2.95rem;
		background: rgba(255,255,255, 1);
		border-radius: 0.12rem;
		z-index: 9999;
		text-align: center;
		h2 {
			padding-bottom: 0.2rem;
			color: #592E12;
		}
		.invite-content {
			padding: 0 0.3rem;
			text-align: left;
			span {
				display: block;
			}
		}
		.btn-wrapper {
			border-top: 1px solid #ddd;
			margin-top: 0.1rem;
			width: 100%;
			span {
				float: left;
				display: inline-block;
				width: 49.9%;
				height: 0.88rem;
				line-height: 0.88rem;
				text-align: center;
			}
			.rec {
				border-left: 1px solid #ddd;
				color: #E6615D;
			}
		}
	}
</style>