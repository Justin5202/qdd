<!-- 标题栏组件 -->
<template>
	<div class="recharge">
		<top-bar txt="我的金豆" returnShow="true"></top-bar>
		<div class="input-box">
			<span class="ico-gold"></span>
			<span>金豆</span>
			<span class="balance">{{ myInfo.gold / 100 }}<small>个</small></span>
		</div>
		<div class="options">
			<span>请选择购买金豆数量</span>
			<div class="clearfix">
				<label 
					v-for="(item, index) in options" 
					class="btn" 
					:class="{ active : nowIndex == index }"
					@click="selectMoney(index, item)">
					<span>{{ item }}金豆</span>
					<span class="small-num">￥{{ item }}</span>
				</label>
			</div>
			<!-- <span>自定义</span>
			<input type="num" name="num" v-model="num" placeholder="请输入充值金额"> -->
			<button class="btn big-btn" @click="recharge">确认购买</button>
		</div>
		<mt-actionsheet
  			:actions="actions"
  			v-model="sheetVisible">
		</mt-actionsheet>
	</div>
</template>

<script>
	import TopBar from '@/components/common/top-bar/top-bar'
	import Api from '@/api/index'
	import Qs from 'qs'
	import pageUtil from '@/utils/page'
	import { Toast, Actionsheet } from 'mint-ui'

	export default {
		components: {
			TopBar
		},
		data () {
			return {
				num: '',
				options: ['10', '20','50', '100', '200', '500', '1000', '2000'],
				nowIndex: 0,
				selectedMoney: 10,
				actions: [
					{
						name: '微信支付',
						method: () => {
							this.charge(this.selectedMoney, 'cibweixin')
						}
					}, 
					{
						name: '支付宝支付',
						method: () => {
							this.charge(this.selectedMoney, 'cibalipay')
						}
					}
				],
				sheetVisible: false
			}
		},
		props: {},
	  	watch: {},
	  	methods: {
	  		selectMoney (index, money) {
	  			this.nowIndex = index
	  			this.selectedMoney = money
	  		},
	  		recharge () {
	  			this.sheetVisible = true
	  			// let money
	  			// if(this.num) {
	  			// 	if(Number(this.num) && this.num > 0 && this.num <= 2000) {
	  			// 		money = this.num
	  			// 		this.charge(money)
	  			// 	} else {
	  			// 		money = this.selectedMoney
	  			// 		Toast('请输入正确的购买数量')
	  			// 		this.charge(money)
	  			// 	}
	  			// } else {
	  			// 	money = this.selectedMoney
	  			// 	this.sheetVisible = true
	  			// }
	  		},
	  		charge (money, type) {
	  			let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				this.$store.dispatch('showLoading')
				Api.recharge(Qs.stringify({
						time: time,
						token: token,
						money: money,
						service: type
				})).then(res => {
					this.$store.dispatch('hideLoading')
					if(res.data.code == 200) {
						this.$store.commit('updateUrl', res.data.data.url)
						this.$store.commit('updateAlipayUrl', res.data.data)
						this.$router.push(`/pay/${money}`)
					} else {
						pageUtil.resCode(res)
					}
				})
	  		}
	  	},
	  	filters: {},
	  	computed: {
	  		myInfo () {
	  			return this.$store.state.myInfo
	  		}
	  	},
	  	updated () {},
	  	created () {},
	  	mounted () {
	  		mui.back = function() {
	            history.go(-1)
	        }
	  	},
	  	destroyed () {}
	}
</script>

<style lang="scss" scoped>
	@import '~@/assets/scss/const.scss';
	@import '~@/assets/scss/mixin.scss';
	
	.recharge {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: #f7f7f7;
	}
	.input-box {
		margin: 0 0.3rem;
		margin-top: 1.18rem;
		padding: 0.3rem;
		background-color: #fff;
		position: relative;
		.balance {
			display: block;
			width: 100%;
			height: 2rem;
			line-height: 2rem;
			font-size: 0.58rem;
			text-align: center;
			small {
				font-size: 0.28rem;
				margin-left: 0.3rem;
			}
		}
		.ico-gold {
			position: absolute;
			top: 1.45rem;
			left: 0.8rem;
			width: 0.56rem;
			height: 0.54rem;
		}
	}
	.options {
		margin: 0 0.3rem;
		margin-top: 0.3rem;
		padding: 0.3rem;
		background-color: #fff;
		input[type="num"] {
			margin: 0.3rem;
			width: 90%;
			height: 0.86rem;
			font-size: 0.28rem;
			text-align: center;
			color: #E6615D;
			border-radius: 0.08rem;
			border: 1px solid #E6615D;
		}
	}
	span {
		display: block;
	}
	label {
		float: left;
		display: block;
		width: 22%;
		height: 0.88rem;
		line-height: 0.3rem;
		margin: 0.3rem 0.09rem;
		text-align: center;
		box-sizing: border-box;
		span {
			margin-top: 0.14rem;
			color: #bbbbbb;
		}
		.small-num {
			margin-top: 0.05rem;
			font-size: 0.24rem;
		}
	}
	.btn {
		border-color: #bbbbbb;
	}
	.active {
		border-color: #E6615D;
		span {
			color: #E6615D;
		}
	}

</style>