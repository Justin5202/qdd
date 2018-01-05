<!-- 标题栏组件 -->
<template>
	<div class="red-bag">
		<div class="mask" v-show="isShow"></div>
		<div class="bag-bg" :class="{ zoomIn: isShow }">
			<span class="close" @click="close"></span>
			<span class="owner-header">
				<img :src="redBagInfo.header" alt="">
			</span>
			<span class="name">{{redBagInfo.nickname}}</span>
			<span class="open-btn" 
				:class="{ flipInX: opened }" 
				@click="openRedBag">开宝箱</span>
		</div>
		<audio :src="url" preload="true" @canplay="ready" @error="error" ref="coinAudio"></audio>
	</div>
</template>

<script>
	import Qs from 'qs'
	import Api from '@/api/index'
	import pageUtil from '@/utils/page'
	import util from '@/utils'
	import config from '@/configs/config'

	const API_ROOT = config.API_ROOT

	export default {
		components: {
		},
		data () {
			return {
				opened: false	
			}
		},
	  	watch: {},
	  	methods: {
	  		openRedBag () {
	  			let that = this
				let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				if(!this.clicked) {
					this.opened = true
					this.clicked = true
					that.$refs.coinAudio.play()
					Api.openRedBag(
						Qs.stringify({
							time: time,
							token: token,
							type: that.redBagInfo.type,
							rid: that.redBagInfo.rid,
							bid: that.redBagInfo.id
					})).then(function (res) {
						that.clicked = false
		    			if(res.data.code >= 200 && res.data.code < 300) {
		    				that.$store.commit('updateOpenRedBagShow', false)
		    				that.$store.dispatch('sendMsg', {
					            type: 'custom',
					            scene: that.scene,
					            to: that.to,
					            content: {
					            	type: 'whoGeted',
					            	nickname: that.myInfo.nickname
					            }
					        })
					        that.$store.commit('updateOpenedRedBagShow', true)
					        that.$store.dispatch('updateUserGoldInfo')
		    			} else if(res.data.code == 300){
		    				that.opened = false
		    				pageUtil.resCode(res)
		    			} else {
		    				that.opened = false
		    				pageUtil.resCode(res)
		    			}
		  			})
		  			.catch(function (error) {
		    			console.log(error);
		  			})
				}
	      	},
	      	ready() {
	        	this.songReady = true
	      	},
	      	error() {
	        	this.songReady = true
	      	},
	      	play() {
	      		this.$refs.coinAudio.play()
	      	},
	      	close () {
	      		this.$store.commit('updateOpenRedBagShow', false)
	      	}
	  	},
	  	filters: {},
	  	computed: {
	  		url () {
	  			return `${API_ROOT}/public/static/music/coin.mp3`
	  		},
	  		myInfo () {
	  			return this.$store.state.myInfo
	  		},
	  		redBagInfo () {
	  			return this.$store.state.redBagInfo
	  		},
	  		scene () {
	  			return this.$store.state.currScene
	  		},
	  		to () {
	  			return util.parseSession(this.$store.state.currSessionId).to
	  		},
	  		isShow () {
	  			return this.$store.state.openRedBagShow
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
	
	.bag-bg {
		position: fixed;
		top: 50%;
		left: 50%;
		width: 5.9rem;
		height: 7.58rem;
		margin-left: -2.95rem;
		margin-top: -3.79rem;
		background: url('../../../assets/icon/pic_hb.png') no-repeat;
		background-size: 100%;
		z-index: 1000;
		.owner-header {
			display: block;
			width: 1.44rem;
			height: 1.44rem;
			margin: 0 auto;
			margin-top: 1.04rem;
			img {
				display: block;
				width: 100%;
				height: 100%;
				background-color: #fff;
				border-radius: 100%;
			} 
		}
		.name {
			display: block;
			line-height: 0.88rem;
			text-align: center;
			color: #fff;
		}
		.open-btn {
			position: absolute;
			top: 67%;
			left: 50%;
			margin-left: -0.75rem;
			display: block;
			width: 1.5rem;
			height: 1.5rem;
			line-height: 1.5rem;
			color: #fff;
			font-size: 0.36rem;
			text-align: center;
			border-radius: 100%;
			background: #FDA83C;
			box-shadow: 0 0.02rem 0.14rem 0 rgba(0,0,0,0.18);
		}
		.close {
			position: absolute;
			right: 0.1rem;
			top: 0.1rem;
			display: block;
			width: 0.44rem;
			height: 0.44rem;
			background: url('../../../assets/icon/close.png') no-repeat;
			background-size: 100%;
		}
	}
</style>