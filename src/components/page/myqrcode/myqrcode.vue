<!-- 标题栏组件 -->
<template>
	<div class="service">
		<top-bar txt="我的推荐码" returnShow="true"></top-bar>
		<div class="content">
			<div class="item clearfix">
				<span class="type fl">我的ID：</span>
				<span class="item-type fr">{{myInfo.id}}</span>
			</div>
			<div class="item clearfix">
				<span class="type fl">我的昵称：</span>
				<span class="item-type fr">{{ myInfo.nickname }}</span>
			</div>
			<div class="options">
				<span>我的推荐码</span>
				<p class="loading" v-if="done">生成中...</p>
				<div class="qrcode" ref="qrWrapper">
					<div class="qart">
				        <div id="qrcode" ref="qrcode"></div>
	   				</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import TopBar from '@/components/common/top-bar/top-bar'
	import Qs from 'qs'
	import Api from '@/api/index'

	export default {
		components: {
			TopBar
		},
		data () {
			return {
		        i: false,
		        done: true
			}
		},
		props: {},
	  	watch: {},
	  	methods: {
	  		back() {
	  			this.$emit('back')
	  		},
	  		_getQart(url) {
	  			let width = this.$refs.qrWrapper.offsetWidth
                if(this.i==false){
                    var qrcode = new QRCode(document.getElementById("qrcode"), {
                        width: width,//设置宽高  
                        height: width
                    });              
                    qrcode.makeCode(url);
                }
                this.i = true;
                this.done = false
            }
	  	},
	  	filters: {},
	  	computed: {
	  		myInfo () {
	  			return this.$store.state.myInfo
	  		}
	  	},
	  	created () {
	  		let that = this
			let time = Date.parse(new Date()) / 1000
			let str = time + this.$store.state.str
			let token = Api.encrypted(str, time)
			Api.getQrCode(Qs.stringify({
					time: time,
					token: token
			})).then(res => {
				if(res.data.code == 200) {
					that._getQart(res.data.data.url)
				}
			})
	  	},
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
	
	.service {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: #f7f7f7;
	}
	.content {
		margin: 1.2rem 0.3rem 0 0.3rem;
		padding: 0.3rem;
		height: 10.7rem;
		background: #FFFFFF;
		box-shadow: 0 0.02rem 0.04rem 0 rgba(0,0,0,0.18);
		border-radius: 0.1rem;
		.item {
			padding: 0.3rem 0;
			border-bottom: 1px solid #bbbbbb;
		}
		.type {
			color: #757575;
		}
		.item-type {
			max-width: 70%;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			color: #202020;
		}
	}
	.options {
		margin-top: 0.3rem;
		background-color: #fff;
		.qrcode {
			width: 3.6rem;
			height: 3.6rem;
			margin: 0.6rem auto;
			.qart {
				width: 100%;
				height: 100%;
				#qrcode {
					width: 100%;
					height: 100%;
					img {
						display: block;
						width: 100%;
						height: 100%;
					}
				}
			}
		}
		.loading {
			padding-top: 1rem;
			text-align: center;
		}
	}
	span {
		display: block;
	}
</style>