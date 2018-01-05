<!-- 首页 -->
<template>
	<div class="index">
		<top-bar addShow="true"></top-bar>
		<div class="content">
			<!-- search -->
			<div class="search">
				<div class="search-box">
					<i class="icon-search"></i>
					<div class="box" @click="search">输入房号进入房间</div>
				</div>
			</div>
			<banner :isIndex="true"></banner>
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
			<div class="room">
				<div class="room-item clearfix">
					<span class="ico-gold room-gold-type"></span>
					<p class="item-title">接龙场</p>
					<span class="doubt" @click="howToPlay(type=1)"></span>
					<div class="multi-room active fl"
						@click="getMoreRoom(index=0, tid=1)">
						<i class="gold-box"></i>
						<p class="fontColor">房主模式</p>
						<div class="line fl"></div>
					</div>
					<div class="multi-room active fr"
						@click="getMoreRoom(index=1, tid=1)">
						<i class="gold-box"></i>
						<p class="fontColor">普通模式</p>
					</div>
				</div>
				<div class="room-item clearfix">
					<span class="ico-gold room-gold-type"></span>
					<p class="item-title">扫雷场</p>
					<span class="doubt" @click="howToPlay(type=2)"></span>
					<div class="multi-room active fl"
						@click="getMoreRoom(index=0, tid=2)">
						<i class="gold-box"></i>
						<p class="fontColor">房主模式</p>
						<div class="line fl"></div>
					</div>
					<div class="multi-room active fr"
						@click="getMoreRoom(index=1, tid=2)">
						<i class="gold-box"></i>
						<p class="fontColor">普通模式</p>
					</div>
				</div>
				<div class="room-item clearfix">
					<span class="ico-silver room-gold-type"></span>
					<p class="item-title">接龙场</p>
					<span class="doubt" @click="howToPlay(type=1)"></span>
					<div class="multi-room active fl"
						@click="getMoreRoom(index=0, tid=3)">
						<i class="gold-box"></i>
						<p class="fontColor">房主模式</p>
						<div class="line fl"></div>
					</div>
					<div class="multi-room active fr"
						@click="getMoreRoom(index=1, tid=3)">
						<i class="gold-box"></i>
						<p class="fontColor">普通模式</p>
					</div>
				</div>
				<div class="room-item clearfix">
					<span class="ico-silver room-gold-type"></span>
					<p class="item-title">扫雷场</p>
					<span class="doubt" @click="howToPlay(type=2)"></span>
					<div class="multi-room active fl"
						@click="getMoreRoom(index=0, tid=4)">
						<i class="gold-box"></i>
						<p class="fontColor">房主模式</p>
						<div class="line fl"></div>
					</div>
					<div class="multi-room active fr"
						@click="getMoreRoom(index=1, tid=4)">
						<i class="gold-box"></i>
						<p class="fontColor">普通模式</p>
					</div>
				</div>
			</div>
			<transition
			enter-active-class="zoomIn" leave-active-class="zoomOut">
				<div class="play-type" v-if="playTypeShow == 1">
					<p class="rule-title">玩法规则</p>
					系统发初始宝箱，最小接龙场由抢得金豆最少的玩家接龙发下一个宝箱，最大接龙场由抢得金豆最多的玩家接龙发下一个宝箱。宝箱的金豆数根据当前所在的倍数场决定。以白银宝箱10金豆、6包最大接龙场为例，每个宝箱需要6名玩家抢完结算，抢得金豆最多的玩家接龙发下一个10金豆宝箱。每个宝箱有效抢夺时限为60秒，发宝箱等待时间为10秒。
				</div>
				<div class="play-type" v-else-if="playTypeShow == 2">
					<p class="rule-title">玩法规则</p>
					由当前房间内的玩家随机坐庄自由发宝箱。以白银宝箱10金豆、7包1.5倍场为例，任意玩家自由发一个10金豆的宝箱，宝箱上面会随机出现一个尾数0-9的号码（如：尾数雷为6），每个宝箱需要7名玩家抢完结算，抢得尾数为6的玩家需返还庄家15金豆（即1.5倍），同一回合内可能出现多名玩家中雷。
				</div>
			</transition>
		</div>
		<div class="mask" v-if="playTypeShow" @click="hide"></div>
		<tab-bar></tab-bar>
	</div>
</template>

<script>
	import TabBar from '@/components/common/tab-bar/tab-bar'
	import TopBar from '@/components/common/top-bar/top-bar'
	import Banner from '@/components/common/Banner/Banner'
	import { Swipe, SwipeItem } from 'vue-swipe'
	import Qs from 'qs'
	import Api from '@/api/index'
	import pageUtil from '@/utils/page'
	
	export default {
		components: {
			TabBar,
			TopBar,
			Banner,
			Swipe,
			SwipeItem
		},
		beforeMount () {
			// this.$store.dispatch('connect', {
	  //       	type: 'chatroom',
	  //       	chatroomId: '17989610'
	  //     	})
		},
		data() {
			return {
				isInGroups: this.$store.state.isInGroups,
				fromPath: '',
				msgs: this.$store.state.speakerMsgs,
				timer: ''
			}
		},
		methods: {
			getMoreRoom (index, tid) {
				let vip = (index + 1) % 2
				this.$router.push({path: `/roomlist/${tid}/${vip}`})
			},
			howToPlay (rtype) {
				this.$store.commit('updatePlayTypeShow', rtype)
			},
			search () {
				this.$router.push({path: '/search/2'})
			},
			hide () {
				this.$store.commit('updatePlayTypeShow', false)
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
			}
		},
		watch: {},
		created() {
			this.$store.dispatch('hideLoading')
			this.$store.dispatch('updateUserGoldInfo')
		},
		mounted() {
			let first = null
			mui.back = function() {
            	//首次按键，提示‘再按一次退出应用’
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
	        }
		},
		activated () {
			let first = null
			mui.back = function() {
            	//首次按键，提示‘再按一次退出应用’
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
	        }
		},
		computed: {
			playTypeShow () {
				return this.$store.state.playTypeShow
			},
			speakerMsglist () {
		      	return this.$store.state.speakerMsgs
		    },
		    sessionlist () {
		      	return this.$store.state.sessionlist
		    }
		},
		updated () {
			clearInterval(this.timer)
	  		this.marquee()
		}
	}
</script>

<style lang="scss" scoped>
	@import '~@/assets/scss/const.scss';
	@import '~@/assets/scss/mixin.scss';
	
	.index {
    	width: 100%;
    	height: 100%;
    	display: flex;
    	background-color: #E6615D;
		padding-bottom: 1rem;
		overflow: hidden;
		.content {
			display: block;
		    flex: 1;
		    -webkit-overflow-scrolling: touch;
		    overflow-y: scroll;
		    overflow-x: hidden;
			padding: 0 0.24rem;
			position: relative;
			.search-box {
				margin-top: 0.2rem;
				height: 0.6rem;
				padding-left: 0.7rem;
				position: relative;
				background-color: #fff;
				border-radius: 0.06rem;
				.icon-search {
					position: absolute;
					top: 0.1rem;
					left: 0.2rem;
					display: block;
					width: 0.4rem;
					height: 0.4rem;
					background: url('../../../assets/icon/search.png') no-repeat;
					background-size: 100%;
				}
				.box {
					line-height: 0.6rem;
				}
			}
			.my-coin {
				padding: 0.28rem 0;
				.gold-coin {
					margin-right: 0.5rem;
				}
				i {
					margin-right: 0.19rem;
				}
				span {
					color: #fff;
					line-height: 0.44rem;
				}
			}
			.my-swipe {
				width: 100%;
			  	height: 3rem;
			  	background-color: #fff;
			  	position: relative;
			  	.slide1{
			  		position: absolute;
			  		top: 0;
			  		left: 0;
			  		width: 100%;
			  		height: 3rem;
			  		img {
			  			width: 100%;
			  			height: 100%;
			  		}
			  	}
			}
			.room {
				width: 100%;
				text-align: center;
				.room-gold-type {
					position: absolute;
					top: 0.25rem;
					left: 39%;
					// margin-left: -1.1rem;
				}
				.room-item {
					border-radius: 0.1rem;
					background-color: #fff;
					margin-bottom: 0.4rem;
					padding: 0 0.8rem;
					box-shadow: 0 0.02rem 0.04rem 0 #5B0503;
					position:relative;
				}
				.item-title {
					margin-left: 0.5rem;
					font-size: 0.36rem;
					line-height: 0.88rem;
				}
				.tips {
					font-size: 0.28rem;
					color: #E6615D;
				}
				.line {
					position: absolute;
					top: 0.6rem;
					right: -0.5rem;
					width: 1px;
					height: 0.97rem;
					background-color: #979797;
				}
				.multi-room {
					width: 2.19rem;
					height: 2.19rem;
					margin-bottom: 0.3rem;
					border: 0;
					border-radius: 0.1rem;
					position: relative;
					.gold-box {
						display: block;
						width: 1.5rem;
						height: 1.5rem;
						background: url('../../../assets/icon/icon_bx.png') no-repeat;
						background-size: 100%;
						margin: 0.14rem auto 0 auto;
					}
					h1 {
						margin-top: 0.14rem;
						font-size: 0.34rem;
					}
					span {
						display: block;
						padding-top: 0.1rem;
						font-size: 0.24rem;
					}
					.bot {
						margin: 0 auto;
						max-width: 84%;
					}
					.fontColor {
						font-size: 0.32rem;
						color: #E6615D;
					}
					p {
						font-size: 0.3rem;
						color: #E6615D;
					}
				}
				.active {
					border: 1px solid #E6615D;
					color: #E6615D;
				}
			}
			.speaker {
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
						overflow: hidden;
						position: relative;
						.blank {
							width: 7.02rem;
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
		}
	}
</style>