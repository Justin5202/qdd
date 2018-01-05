<template>
	<div class="pay">
		<top-bar txt="确认付款" returnShow="true"></top-bar>
		<div class="content" v-if="alipayUrl.pay_info.indexOf('weixin') !== -1">
			<div class="pay-content-wrapper">
				<p class="money">￥{{money}}</p>
				<div class="item clearfix">
					<span class="type fl">充值ID：</span>
					<span class="item-type fr">{{myInfo.id}}</span>
				</div>
				<div class="item clearfix">
					<span class="type fl">付款方式：</span>
					<span class="item-type fr">微信扫码支付</span>
				</div>
				<div class="qrcode iframe" ref="qrWrapper">
					<div class="qart">
				        <div id="qrcode" ref="qrcode"></div>
	   				</div>
				</div>
				<!-- <img :src="alipayUrl.token_id" class="iframe"> -->
				<button class="btn big-btn" @click="done">已完成付款</button>
			</div>
		</div>
		<iframe :src="alipayUrl.pay_info" frameborder="0" v-else class="iframe ali-iframe"></iframe>
	</div>
</template>

<script>
	import TopBar from '@/components/common/top-bar/top-bar'

	export default {
		components: {
			TopBar
		},
		data() {
			return {
				i: false
			}
		},
		computed: {
			myInfo() {
				return this.$store.state.myInfo
			},
			money () {
				return this.$route.params.money
			},
			url () {
		      	return this.$store.state.url
		    },
		    alipayUrl () {
		    	return this.$store.state.alipayUrl
		    }	
		},
		methods: {
			done() {
				history.go(-1)
			},
			_getQart(url) {
	  			let width = this.$refs.qrWrapper.offsetWidth
                if(this.i==false){
                    var qrcode = new QRCode(document.getElementById("qrcode"), {
                        width: width,//设置宽高  
                        height: width
                    });              
                    qrcode.makeCode(url)
                }
                this.i = true
            }
		},
		created() {},
		mounted() {
			this._getQart(this.alipayUrl.pay_info)
			mui.back = function() {
	            history.go(-1)
	        }
		}
	}
</script>

<style scoped lang="scss">
	@import '~@/assets/scss/const.scss';
	@import '~@/assets/scss/mixin.scss';

	.pay {
		position: fixed;
    	width: 100%;
    	height: 100%;
    	top: 0;
    	background-color: #f7f7f7;
	}
	.ali-iframe {
		width: 100%;
		height: 100%;
	}
	.content {
		height: 10.7rem;
		margin: 1.2rem 0.3rem 0 0.3rem;
		padding: 0.3rem;
		background: #FFFFFF;
		box-shadow: 0 0.02rem 0.04rem 0 rgba(0,0,0,0.18);
		border-radius: 0.1rem;
		.money {
			font-size: 0.68rem;
			color: #000;
			text-align: center;
		}
		.item {
			padding: 0.3rem 0;
			border-bottom: 1px solid #bbbbbb;
		}
		.type {
			color: #757575;
		}
		.item-type {
			color: #202020;
		}
		.iframe {
			width: 5rem;
			height: 5rem;
			overflow: hidden;
			border: 0;
			margin: 0.4rem auto;
			body {
				img {
					width: 1rem;
				}
			}
		}
		.alipay {
			margin: 0 auto;
			display: block;
			width: 1.87rem;
			height: 0.66rem;
			background: url('../../../assets/icon/pay.png') no-repeat;
		}
	}


</style>