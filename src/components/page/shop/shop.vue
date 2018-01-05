<!-- 标题栏组件 -->
<template>
	<div class="shop">
		<top-bar txt="商城"></top-bar>
		<tab-bar></tab-bar>
		<img src="../../../assets/icon/shop_bg.jpg" height="49" width="750" alt="shop-bg" class="shop-bg">
		<div class="content">
			<div class="my-coin clearfix">
				<div class="gold-coin fl">
					<i class="ico-gold fl"></i>
					<span class="fl">{{ myInfo.gold / 100 }}</span>
				</div>
				<div class="silver-coin fl">
					<i class="ico-silver fl"></i>
					<span class="fl">{{ myInfo.silver / 100 }}</span>
				</div>
			</div>
			<div class="pro-box">
				<ul class="title clearfix">
					<li 
						class="title-item fl" 
						v-for="(item, index) in  tabTitle"
						:class="{active:index == nowIndex1}"
						@click="toggleShopTabs(index)">{{item}}</li>
				</ul>
				<ul class="pro-item clearfix">
					<li v-for="item in proList">
						<div class="pro-info">
							<span class="pro-num clearfix">
								<span class="icon-speaker fl"></span><span class="numbers fl">×{{ item.number }}</span>
							</span>
							<span>{{ item.name }}</span>
							<span>原价：{{ item.oprice }}</span>
							<span>现价：{{ item.price }}</span> 
						</div>
						<button @click.prevent="buy(item.id)">购买</button>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import TopBar from '@/components/common/top-bar/top-bar'
	import TabBar from '@/components/common/tab-bar/tab-bar'
	import Banner from '@/components/common/Banner/Banner'
	import Qs from 'qs'
	import Api from '@/api/index'
	import { Toast, MessageBox } from 'mint-ui'
	import pageUtil from '@/utils/page'

	export default {
		components: {
			TopBar,
			TabBar,
			Banner
		},
		data () {
			return {
				tabTitle: ['金豆', '银豆'],
				proList: [],
				nowIndex1: 0
			}
		},
		props: {},
	  	watch: {},
	  	methods: {
	  		buy (id) {
	  			let that = this
				let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				MessageBox.confirm('是否购买？').then(action => {
              		Api.buy(Qs.stringify({
						time: time,
						token: token,
						id: id
					})).then(res => {
						if(res.data.code == 200) {
							that.getUserInfo()
							Toast({
				                message: res.data.msg
				            })
						} else {
							pageUtil.resCode(res)
						}
					})
          		})
	  		},
	  		toggleShopTabs (index) {
	  			this.nowIndex1 = index
	  			let that = this
				let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				Api.getShopList(Qs.stringify({
					time: time,
					token: token,
					tid: index + 1
				})).then(res => {
					if(res.data.code == 200) {
						that.proList = res.data.data
					} else {
						that.proList = res.data.data
						pageUtil.resCode(res)
					}
				})
	  		},
	  		getUserInfo () {
	  			let that = this
				let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
	  			Api.getUserInfo(
					Qs.stringify({
						time: time,
						token: token
				})).then(function (res) {
	    			if(res.data.code == 200) {
	    				that.goldCoinNum = res.data.data.gold
	    				that.silverCoinNum = res.data.data.silver
	    				that.$store.commit('updateMyInfo', res.data.data)
	    			} else {
	    				pageUtil.resCode(res)
	    			}
	  			})
	  			.catch(function (error) {
	    			console.log(error);
	  			})
	  		}
	  	},
	  	filters: {},
	  	computed: {
	  		myInfo () {
	  			return this.$store.state.myInfo
	  		}
	  	},
	  	created () {},
	  	mounted () {
	  		let index = 0
	  		this.toggleShopTabs(index) 
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
	  	destroyed () {}
	}
</script>

<style lang="scss" scoped>
	@import '~@/assets/scss/const.scss';
	@import '~@/assets/scss/mixin.scss';
	.shop {
		position: fixed;
    	width: 100%;
    	height: 100%;
    	top: 0;
    	background-color: #E6615D;
	}
	.shop-bg {
		position: absolute;
		top: 0.88rem;
		width: 7.5rem;
		height: 0.49rem
	}
	.content {
		margin: 0 0.3rem;
		margin-top: 1.3rem;
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
		.pro-box {
			background-color: #fff;
			box-shadow: 0 0.02rem 0.04rem 0 rgba(0,0,0,0.44);
			border-radius: 0.1rem;
			padding: 0 0.3rem;
			text-align: center;
		}
		.title {
			text-align: center;
			line-height: 0.88rem;
			.title-item {
				width: 50%;
				color: rgba(43,43,43,0.61);
				border-bottom: 1px solid #f5f5f5;
			}
			.active {
				color: #2b2b2b;
				border-bottom-color: #E5615D;
			}	
		}
		.pro-item {
			margin-top: 0.35rem;
			li {
				float: left;
				width: 31.11%;
				margin: 0 0.07rem 0.35rem 0.07rem;
				span {
					display: block;
				}
				.pro-info {
					padding-top: 0.2rem;
					padding-bottom: 0.3rem;
					margin-bottom: 0.26rem;
					background: rgba(216,216,216,0.10);
					border-radius: 0.08rem;
				}
				.pro-num {
					display: inline-block;
					margin: 0 auto;
					.numbers {
						margin-left: 0.1rem;
						line-height: 0.45rem;
						color: #E6615D;
						font-weight: bold;
					}
				}
				:nth-child(3) {
					color: #cfcfcf;
				}
				:nth-child(4) {
					color: #E6615D;
				}
				.icon-speaker {
					margin: 0 auto;
				}
				button {
					width: 100%;
					height: 0.6rem;
					color: #fff;
					background-color: #E6615D;
					border-radius: 0.08rem;
				}
			}
		}
	}
</style>