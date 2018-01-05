<!-- 首页 -->
<template>
	<div class="index">
		<top-bar txt="房间列表" returnShow="true"></top-bar>
		<div class="content">
			<!-- <banner :isIndex="false"></banner> -->
			<div class="room" v-for="(roomItem, idx) in rooms">
				<p class="item-title" @click="showItem(idx)">{{ roomItem.name }}<span v-if="roomItem.gold_type == 1 && roomItem.vip != 1">{{ roomItem.gold / 100 }}金豆</span><span v-else-if="roomItem.gold_type == 2 && roomItem.vip != 1">{{ roomItem.gold / 100 }}银豆</span><span class="wf"></span><span 
					class="icon-arrow_right" 
					:class="{ icond : (nowIndex === idx && isShow)}" v-if="roomItem.vip == 0"></span></p>
				<span class="doubt" v-if="roomItem.vip == 1" @click="howToPlay(roomItem.rtype)"></span>
				<div class="thunder clearfix"
					v-if="roomItem.rtype == 2">
					<div class="multi-room active fl"
						v-show="(nowIndex === idx && isShow) || roomItem.vip == 1"
						v-for="(item, index) in roomItem.list"
						@click="enterGroup(item)">
						<h1>{{ item.number }}包</h1>
						<span v-if="item.type == 1" class="thunder-multi">最小发</span>
						<span v-else-if="roomItem.rtype == 2" class="thunder-multi">{{ item.multiple }}倍</span>
						<span class="online">在线人数：{{ item.now ? item.now : 0 }}</span>
					</div>
				</div>
				<div class="room-item clearfix" v-else>
					<div class="multi-room active fl"
						v-for="(item, index) in roomItem.list"
						v-show="(nowIndex === idx && isShow) || roomItem.vip == 1"
						:class="{ fr : index%2 == 1 }" 
						@click="enterGroup(item)">
						<h1 class="fontColor">{{ item.number }}包</h1>
						<span class="thunder-multi fontColor" v-if="item.type == 1">最小发</span>
						<span class="fontColor" v-else-if="item.type == 2">最大发</span>
						<div class="line fl" v-if="index%2 == 0"></div>
						<span class="online fontColor">在线人数：{{ item.now ? item.now : 0 }}</span>
					</div>
				</div>
			</div>
			<transition
			enter-active-class="zoomIn" leave-active-class="zoomOut">
				<div class="play-type" v-if="playTypeShow == 3">
					<p class="rule-title">玩法规则</p>
					房间由玩家创建（注：房主拥有顺子、炸弹奖励设置权），所有宝箱由房主发，最大或最小中包的玩家需按当前倍数返还房主相应金豆。如有玩家抢中三位数以上顺子（如：1.11金豆）或者三位数以上炸弹（如：1.23），由房主给该玩家返还相应奖励的金豆，可能有多个玩家获得奖励。
				</div>
				<div class="play-type" v-else-if="playTypeShow == 4">
					<p class="rule-title">玩法规则</p>
					房间由玩家创建（注：房主拥有免死权和顺子、炸弹奖励设置权）。由当前房间内的玩家随机坐庄自由发宝箱。以白银宝箱10金豆、7包1.5倍场为例，任意玩家自由发出一个10金豆的宝箱，宝箱上面会随机出现一个尾数0-9的号码（如：尾数雷为6），每个宝箱需要7名玩家抢完结算，抢得尾数为6的玩家需返还庄家15金豆（即1.5倍），同一回合内可能出现多名玩家中雷。房主抢宝箱拥有免死权（即：在自己创建的房间内永不中雷）但是对抢中三位数以上顺子（如：1.11金豆）或者三位数以上炸弹（如：1.23）的玩家，由房主给该玩家返还相应奖励的金豆数，可能有多个玩家获得奖励。
				</div>
			</transition>
			<div class="mask" v-if="playTypeShow" @click="hide"></div>
		</div>
	</div>
</template>

<script>
	import TopBar from '@/components/common/top-bar/top-bar'
	import Banner from '@/components/common/Banner/Banner'
	import { Swipe, SwipeItem } from 'vue-swipe'
	import Qs from 'qs'
	import Api from '@/api/index'
	import pageUtil from '@/utils/page'
	
	export default {
		components: {
			TopBar,
			Banner,
			Swipe,
			SwipeItem
		},
		data() {
			return {
				goldCoinNum: '',
				silverCoinNum: '',
				rooms: '',
				nowIndex: -1,
				isShow: false
			}
		},
		methods: {
			enterGroup(item) {
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
			getRooms () {
				let that = this
				let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				this.$store.dispatch('showLoading')
				Api.getRoomList(
					Qs.stringify({
						time: time,
						token: token,
						tid: that.tid,
						isvip: that.vip
				})).then(function (res) {
					that.$store.dispatch('hideLoading')
	    			if(res.data.code == 200) {
	    				that.rooms = res.data.data
	    			} else {
	    				pageUtil.resCode(res)
	    			}
	  			})
	  			.catch(function (error) {
	    			console.log(error);
	  			})
			},
			howToPlay (rtype) {
				if(rtype == 1) {
					this.$store.commit('updatePlayTypeShow', 3)
				} else {
					this.$store.commit('updatePlayTypeShow', 4)
				}
				
			},
			showItem(index) {
				this.isShow = !this.isShow
				this.nowIndex = index
			},
			hide () {
				this.$store.commit('updatePlayTypeShow', false)
			}
		},
		created() {},
		mounted() {
			this.getRooms()
  			mui.back = function() {
	            history.go(-1)
	        }
		},
		computed: {
			tid () {
				return this.$route.params.tid
			},
			vip () {
				return this.$route.params.vip
			},
			playTypeShow () {
				return this.$store.state.playTypeShow
			}
		},
		destoryed() {
			this.isShow = false
			this.nowIndex = -1
		}
	}
</script>

<style lang="scss" scoped>
	@import '~@/assets/scss/const.scss';
	@import '~@/assets/scss/mixin.scss';
	.index {
		position: fixed;
		top: 0;
	   	width: 100%;
    	height: 100%;
    	display: flex;
    	background-color: #E6615D;
		overflow: hidden;
		.content {
			display: block;
		    flex: 1;
		    -webkit-overflow-scrolling: touch;
		    overflow-y: scroll;
		    overflow-x: hidden;
			padding: 0 0.24rem;
			padding-bottom: 0.4rem;
			position: relative;
			.room {
				width: 100%;
				margin-top: 0.4rem;
				text-align: center;
				border-radius: 0.1rem;
				background-color: #fff;
				box-shadow: 0 0.02rem 0.04rem 0 #5B0503;
				position: relative;
				.room-gold-type {
					position: absolute;
					top: 0.25rem;
					left: 50%;
					margin-left: -0.8rem;
				}
				.room-item {
					padding: 0 0.8rem;
					position: relative;
					border: 1px solid rgba(151,151,151,0.28);
				}
				.item-title {
					font-weight: bold;
					font-size: 0.32rem;
					line-height: 0.88rem;
					color: #E6615D;
					.wf {
						font-weight: normal;
						color: #1b1b1b;
					}
				}
				.icon-arrow_right {
					width: 0.3rem;
					height: 0.3rem;
					top: 0.3rem;
					left: 0.3rem;
					background: url('../../../../assets/icon/icon-add.jpg') no-repeat;
					background-size: 100%;
				}
				.icond {
					background: url('../../../../assets/icon/icon-d.png') no-repeat;
					background-size: 100%;
				}
				.doubt {
					top: 0.12rem;
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
					border-radius: 0.1rem;
					position: relative;
					margin: 0.4rem 0;
					h1 {
						margin-top: 0.36rem;
						font-size: 0.42rem;
					}
					span {
						display: block;
						padding: 0.18rem 0;
						font-size: 0.24rem;
					}
					.fontColor {
						color: #4b4b4b;
					}
					p {
						font-size: 0.3rem;
						color: #E6615D;
					}
					.online {
						padding: 0;
					}
				}
				.thunder {
					.multi-room {
						width: 1.8rem;
						height: 1.8rem;
						margin-left: 0.26rem;
						margin-right: 0.26rem;
						margin-bottom: 0.4rem;
						h1 {
							margin-top: 0.24rem;
						}
						.thunder-multi {
							padding: 0.1rem 0;
						}
						.line {
							right: -0.3rem;
						} 
					}
				}
				.active {
					border: 1px solid #E6615D;
					color: #E6615D;
				}
			}
		}
	}
</style>