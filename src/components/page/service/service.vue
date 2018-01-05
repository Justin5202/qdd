<!-- 标题栏组件 -->
<template>
	<div class="service">
		<top-bar txt="客服" returnShow="true"></top-bar>
		<div class="content">
			<div class="qrcode">
				<img :src="qrcode_src" alt="">
				<p>扫描二维码，与客服取得联系</p>
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import TopBar from '@/components/common/top-bar/top-bar'
	import TabBar from '@/components/common/tab-bar/tab-bar'
	import Qs from 'qs'
	import Api from '@/api/index'

	export default {
		components: {
			TopBar,
			TabBar
		},
		data () {
			return {
				qrcode_src: ''
			}
		},
		props: {},
	  	watch: {},
	  	methods: {
	  		back() {
	  			this.$emit('back')
	  		}
	  	},
	  	filters: {},
	  	computed: {},
	  	created () {},
	  	mounted () {
	  		let that = this
			let time = Date.parse(new Date()) / 1000
			let str = time + this.$store.state.str
			let token = Api.encrypted(str, time)
			Api.getService(Qs.stringify({
					time: time,
					token: token
			})).then(res => {
				if(res.data.code == 200) {
					that.qrcode_src = res.data.data.kf_qrcode.val
				}
			})
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
    	top: 0;
    	background-color: #f7f7f7;
	}

	.content {
		margin: 0.3rem;
		margin-top: 1.18rem;
		height: 11.3rem;
		background-color: #fff;
		box-shadow: 0 0.02rem 0.04rem 0 rgba(0,0,0,0.18);
		border-radius: 0.1rem;
		.qrcode {
			position: fixed;
			top: 33%;
			left: 50%;
			width: 3.6rem;
			height: 3.6rem;
			margin-left: -1.8rem;
			img {
				width: 100%;
				height: 100%;
			}
			p {
				text-align: center;
				font-size: 0.27rem;
				color: #3E3E3E;
				line-height: 0.37rem;
			}
		}
	}
</style>