<!-- 标题栏组件 -->
<template>
	<div class="open-red-bag">
		<div class="open-top">
			<div class="bg"></div>
			<div class="hb-detail-header">
				<i class="icon-return" @click="goback"></i><span>宝箱详情</span>

			</div>
			<div class="bagowner">
				<span class="bagowner-header">
					<img :src="redBagInfo.header" alt="">
				</span>
				<span class="bagowner-name">{{redBagInfo.nickname}}</span>
			</div>
			<h2 class="got-money">{{youGotNum}}</h2>
		</div>
		<div class="got-list">
			<p v-if="redBagInfo.status == 0">宝箱已领取{{getNums}}/{{redBagInfo.number}}个，<span v-if="redBagInfo.type == 1">金豆</span><span v-else-if="redBagInfo.type == 2">银豆</span>数量共{{(counts).toFixed(2)}}/{{redBagInfo.gold / 100}}个</p>
			<p v-else>宝箱已领取{{getNums}}/{{redBagInfo.number}}个，<span v-if="redBagInfo.type == 1">金豆</span><span v-else-if="redBagInfo.type == 2">银豆</span>数量共{{(counts).toFixed(2)}}/{{redBagInfo.gold / 100}}个</p>
			<ul>
				<li class="clearfix" v-for="item in whoGetRedBag">
					<span class="item-header">
						<img :src="item.header" alt="">
					</span>
					<span class="item-info fl">
						<span class="item-name">{{item.nickname}}</span>
						<span class="got-time">{{ item.time }}</span>
					</span>
					<!-- <span class="item-got-money" v-if="redBagInfo.status == 0">{{item.money}}个</span> -->
					<span class="item-got-money" v-if="!Number(item.money)">{{item.money}}个</span>
					<span class="item-got-money" v-else-if="Number(item.money)">{{item.money / 100}}个</span>
					<span class="item-got-money" v-else>{{item.money/100}}个</span>
				</li>
				<div class="hb-bot">
					<span class="goReco" @click="goReco">查看我的宝箱记录</span>
					<span class="hb-tips">未领取的宝箱，将于60秒后发起退款</span>
				</div>
			</ul>
		</div>
	</div>
</template>

<script>
	import Qs from 'qs'
	import Api from '@/api/index'
	import util from '@/utils/index'
	import pageUtil from '@/utils/page'

	export default {
		components: {
		},
		data () {
			return {
				whoGetRedBag: '',
				getNums: 0,
				counts: 0,
				goldNum: '',
				youGotNum: '',
				avatar: '',
				name: '' 
			}
		},
		props: {
			bid: ''
		},
	  	watch: {},
	  	methods: {
	  		goback () {
	  			this.$store.commit('updateOpenedRedBagShow', false)
	  		},
	  		goReco () {
	  			this.$router.push({path: '/history'})
	  		}
	  	},
	  	filters: {},
	  	computed: {
	  		redBagInfo () {
	  			return this.$store.state.redBagInfo
	  		}
	  	},
	  	created () {},
	  	mounted () {
	  		let that = this
	        let time = Date.parse(new Date()) / 1000
	        let str = time + this.$store.state.str
	        let token = Api.encrypted(str, time)
	        Api.getRedBagReco(
	          Qs.stringify({
	            time: time,
	            token: token,
	            bid: that.bid
	        })).then(function (res) {
	            if(res.data.code == 200) {
	            	let data = res.data.data
	            	for(let item in data) {
	              		if(Number(data[item].money)) {
	              			that.counts += Number(data[item].money) / 100
	              		}
	              		data[item].time = util.myFormatDate(data[item].time)
	              		//判断自己抢的金额
	              		if(data[item].uid == that.$store.state.myInfo.id) {
	              			that.youGotNum = data[item].money / 100
	              		}
	              	}
	              	that.whoGetRedBag = data
	              	that.getNums = res.data.data.length
	              	that.$store.dispatch('hideLoading')
	            } else if(res.data.code == 0){
	              	pageUtil.resCode(res)
	            }
	        }).catch(function (error) {
	            console.log(error);
	        })
	  	},
	  	destroyed () {
	  	}
	}
</script>

<style lang="scss" scoped>
	@import '~@/assets/scss/const.scss';
	@import '~@/assets/scss/mixin.scss';
	
	.open-red-bag {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background-color: #f7f7f7;
		z-index: 25;
	}
	.open-top {
		width: 100%;
		height: 5.52rem;
	}
	.bg {
		width: 100%;
		height: 2.51rem;
		background: url('../../../assets/icon/pic_record.png') no-repeat;
		background-size: 100%;
	}
	.hb-detail-header {
		position: absolute;
		top: 0.1rem;
		left: 0.1rem;
		color: #fff;
		span {
			float: left;
			padding-left: 0.25rem;
			display: inline-block;
			margin-top: 0.12rem;
			margin-left: 0.1rem;
			font-size: 0.30rem;
			border-left: 0.02rem solid #fff;
		}
	}
	.icon-return {
		float: left;
		margin-top: 0.05rem;
		display: inline-block;
		width: 0.5rem;
		height: 0.5rem;
		background: url('../../../assets/icon/white_return.png') no-repeat;
		background-size: 100%;
	}
	.bagowner-header {
			display: block;
			width: 1.65rem;
			height: 1.65rem;
			margin: 0 auto;
			margin-top: -1.2rem;
			img {
				display: block;
				width: 100%;
				height: 100%;
				border-radius: 100%;
			} 
		}
		.bagowner-name {
			display: block;
			line-height: 0.88rem;
			text-align: center;
			color: #858585;
		}
		.got-money {
			font-size: 1.2rem;
			text-align: center;
		}
	.got-list {
		width: 100%;
		height: 78%;
		color: #8d8d8d;
		background-color: #fff;
		overflow: hidden;
		p{
			padding: 0.2rem 0.3rem;
		}
		ul {
			display: block;
			position: relative;
			width: 100%;
			height: 100%;
			overflow-y: scroll;
			overflow-x: hidden;
		} 
		li {
			padding: 0.2rem 0.3rem;
			span {
				display: block;
			}
			.item-header {
				float: left;
				width: 0.8rem;
				height: 0.8rem;
				img {
					display: block;
					width: 100%;
					height: 100%;
					border-radius: 100%;
				}
			}
			.item-info {
				margin-left: 0.3rem;
				.item-name {
					color: #202020;
				}
				.got-time {
					font-size: 0.24rem;
					margin-top: 0.16rem;
				}
			}
			.item-got-money {
				color: #202020;
				line-height: 0.8rem;
				float: right;
				font-weight: bold;
			}
		}
	}
	.hb-bot {
		padding-top: 0.3rem;
		text-align: center;
		background-color: #fff;
		.goReco {
			display: block;
			color: #D9583F;
		}
		.hb-tips {
			display: block;
			font-size: 0.24rem;
			color: #858585;
			padding-top: 0.3rem;
		}
	}
</style>