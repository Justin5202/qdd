<!-- 标题栏组件 -->
<template>
	<div>
		<div 
			class="mask" 
			@click="hide"
			v-if="isZoomIn"></div>
		<transition
			enter-active-class="zoomIn" leave-active-class="zoomOut">
			<div class="friend-info clearfix"
				v-if="isZoomIn"
				v-model="userSelected">
				<img :src="userSelected.header" alt="" class="fl">
				<div class="info fl">
					<span class="info-name">{{ userSelected.nickname }}</span>
					<span class="info-id">ID：{{ userSelected.fuid }}</span>
					<span class="info-z">
						<i class="icon-z" @click="addPraise(userSelected.fuid)"></i>
						{{ userSelected.praise }}
					</span>
				</div>
				<div class="fr">
					<button class="btn" v-if="isFriend" @click="addFriend(userSelected.id)">加为好友</button>
					<button class="btn" v-if="!isFriend" @click="deleteFriend(userSelected.fuid)">删除好友</button>
					<button class="btn" v-if="!isFriend" @click="enterChat(userSelected)">私聊</button>
					<button class="btn" v-if="!isFriend" @click="gift(userSelected.id)">赠送</button>
				</div>
			</div>
		</transition>
		<sendredbag></sendredbag>
	</div>
</template>

<script>
	import Qs from 'qs'
	import Api from '@/api/index'
	import {Toast} from 'mint-ui'
	import pageUtil from '@/utils/page'
	import Sendredbag  from '@/components/common/sendRedBag/sendRedBag'

	export default {
		components: {
			Sendredbag
		},
		data () {
			return {
				isShow: false
			}
		},
		props: {},
	  	watch: {},
	  	methods: {
	  		addFriend (id) {
		      	let that = this
		  		let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				this.$store.dispatch('showLoading')
				Api.addFriend(Qs.stringify({
					time: time,
					token: token,
					fuid: id
				})).then(res => {
					this.$store.dispatch('hideLoading')
					if(res.data.code == 200) {
						that.$store.commit('updateIsFriend', false)
						that.$store.commit('updateNameCardShow', false)
						that.getFriend()
						Toast(res.data.msg)
					} else {
						pageUtil.resCode(res)
					}
				})
		    },
		    deleteFriend (id) {
		      	let that = this
		  		let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				this.$store.dispatch('showLoading')
				Api.deleteFriend(Qs.stringify({
					time: time,
					token: token,
					fuid: id
				})).then(res => {
					this.$store.dispatch('hideLoading')
					if(res.data.code == 200) {
						that.$store.commit('updateIsFriend', true)
						that.$store.commit('updateNameCardShow', false)
						that.getFriend()
						Toast(res.data.msg)
					} else {
						pageUtil.resCode(res)
					}
				})
		    },
		    gift (id) {
		    	this.isShow = true
		    	this.$store.commit('updateNameCardShow', false)
		    	this.$store.commit('updateBtnItemShow', 2)
		    	this.$store.dispatch('showRedBag')
		    },
		    enterChat (session) {
		    	// if (this.hideDelBtn())
       //  			return
      			if (session && session.acid)
      				this.$store.commit('updateNameCardShow', false)
      				this.$store.commit('updateCurrP2pSession', session)
      				this.$router.push({path: '/p2pchat/p2p-' + session.acid})
		    },
	  		hide () {
	  			this.$store.commit('updateNameCardShow', false)
	  		},
	  		addPraise(id) {
	  			let that = this
		  		let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				this.$store.dispatch('showLoading')
				Api.addPraise(Qs.stringify({
					time: time,
					token: token,
					fuid: id
				})).then(res => {
					this.$store.dispatch('hideLoading')
					if(res.data.code == 200) {
						that.userSelected.praise += 1
						Toast(res.data.msg)
					} else {
						pageUtil.resCode(res)
					}
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
					if(res.data.code >= 200 && res.data.code < 300) {
						that.$store.commit('updateFriends', res.data.data)
						that.$store.commit('updateIsFriend', false)
					} else {
						pageUtil.resCode(res)
					}
				})
	  		}
	  	},
	  	filters: {},
	  	computed: {
	  		isZoomIn () {
	  			return this.$store.state.isZoomIn
	  		},
	  		isFriend () {
	  			return this.$store.state.isFriend
	  		},
	  		userSelected () {
	          	return this.$store.state.userSelected
	        }
	  	},
	  	created () {},
	  	mounted () {},
	  	destroyed () {}
	}
</script>

<style lang="scss" scoped>
	@import '~@/assets/scss/const.scss';
	@import '~@/assets/scss/mixin.scss';
	.friend-info {
		position: fixed;
		top: 50%;
		left: 50%;
		width: 6.3rem;
		margin-top: -1.08rem;
		margin-left: -3.45rem;
		img {
			width: 1.67rem;
			height: 1.67rem;
			border-radius: 100%;
		}
		padding: 0.18rem 0.3rem;
		background-color: #fff;
		border-radius: 0.1rem;
		z-index: 1000;
		.info {
			margin-left: 0.3rem;
			position: relative;
			width: 43%;
			.info-name {
				display: block;
				margin-top: 0.2rem;
				font-size: 0.32rem;
				color: #2d2d2d;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}
			.info-id {
				display: block;
				margin: 0.1rem 0;
				color: rgba(46,46,46,0.66);
			}
			.info-z {
				font-weight: bold;
				color: #E6615D;
				margin-left: 0.6rem;
			}
			.icon-z {
				position: absolute;
			}
		}
		button {
			display: block;
			width: 1.5rem;
			margin-top: 0.1rem;
		}
		button:nth-child(4) {
			margin-bottom: 0;
		}
	}
</style>