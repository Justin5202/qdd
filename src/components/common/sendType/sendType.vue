<!-- 标题栏组件 -->
<template>
	<div class="send-type">
		<ul class="clearfix">
			<li @click="showSendRedbag"><i class="icon-redbag"></i><span>宝箱</span></li>
			<li @click="showSpeaker(type1)"><i class="icon-samllspeaker"></i><span>大喇叭</span></li>
			<!-- <li @click="showSpeaker(type2)"><i class="icon-bigspeaker"></i><span>小喇叭</span></li> -->
			<li @click="showFriendList"><i class="icon-invite"></i><span>邀请好友</span></li>
		</ul>
		<send-speaker
			v-bind:type="type"
		    v-bind:scene="scene"
		    v-bind:to="to"
			v-bind:speakerType="speakerType"></send-speaker>
	</div>
</template>

<script>
	import SendSpeaker  from '@/components/common/SendSpeaker/SendSpeaker'
	import Qs from 'qs'
	import Api from '@/api/index'
	import pageUtil from '@/utils/page'
	import {Toast} from 'mint-ui'
		
	export default {
		components: {
			SendSpeaker
		},
		data () {
			return {
				type1: 1,
				type2: 2,
				speakerType: ''
			}
		},
		props: {
		    type: String,
		    scene: String,
		    to: String,
		    goldType: Number,
		    id: Number,
		    number: Number,
		    goldNum: ''
		},
	  	watch: {},
	  	methods: {
	  		showSendRedbag () {
	  			if(this.currSession.uid > 0 && this.currSession.uid != this.myInfo.id) {
					if(this.currSession.rtype == 1) {
						Toast('VIP接龙房只能由房主发宝箱')
					} else if(this.currSession.rtype == 2) {
						this.$store.commit('updateBtnItemShow', -1)
	  					this.$store.dispatch('showRedBag')	
					}
				} else if(this.currSession.uid == this.myInfo.id) {
					this.$store.commit('updateBtnItemShow', -1)
	  				this.$store.dispatch('showRedBag')	
	  			} else {
	  				Toast('宝箱只能由系统发起！')
	  			}
	  		},
	  		showSpeaker (type) {
	  			Toast('大喇叭暂时关闭')
	  			// this.speakerType = type
	  			// this.$store.commit('updateSpeakerShow', true)
	  		},
	  		showFriendList () {
	  			this.$router.push({path: '/friend/2'})
	  		}
	  	},
	  	filters: {},
	  	computed: {
	  		currSession () {
	  			return this.$store.state.currSession
	  		},
	  		myInfo () {
		      	return this.$store.state.myInfo
		    }
	  	},
	  	created () {},
	  	mounted () {
	  	},
	  	destroyed () {}
	}
</script>

<style lang="scss" scoped>
	@import '~@/assets/scss/const.scss';
	@import '~@/assets/scss/mixin.scss';
	
	.send-type {
		width: 100%;
		background-color: #fcfcfa;
		padding: 0.22rem 0;
		ul li {
			margin-left: 0.3rem;
			float: left;
			width: 1rem;
			height: 1rem;
			background: #FFFFFF;
			border: 1px solid rgba(151,151,151,0.15);
			border-radius: 0.06rem;
			i {
				display: block;
				margin: 0 auto;
				margin-top: 0.16rem;
			}
			span {
				display: block;
				text-align: center;
				font-size: 0.16rem;
				line-height: 0.36rem;
			}
			.icon-redbag {
				width: 0.36rem;
				height: 0.46rem;
				background: url('../../../assets/icon/icon_hb.png') no-repeat center;
				background-size: 100%;
			}
			.icon-samllspeaker, .icon-bigspeaker {
				width: 0.42rem;
				height: 0.42rem;
				background: url('../../../assets/icon/icon-speaker.png') no-repeat;
				background-size: 100%;
			}
			.icon-bigspeaker {
				background-size: 90%;
			}
			.icon-invite {
				width: 0.42rem;
				height: 0.42rem;
				background: url('../../../assets/icon/invite.png') no-repeat;
				background-size: 100%;
			}
		}
	}
</style>