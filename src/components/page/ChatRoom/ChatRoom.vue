<!-- 标题栏组件 -->
<template>
	<div class="chat">
		<top-bar txt="聊天大厅"></top-bar>
		<tab-bar></tab-bar>
		<div class="content">
			<div class="area-item" v-for="areaItem in area">
				<div class="chat-item">
					{{ areaItem.name }}
					<span class="icon-arrow_right"></span>
				</div>
				<div class="chat-area">
					<ul class="clearfix">
						<li v-for="item in areaItem.list">
							<button @click="enterChatRoom">{{ item.name }}</button>
						</li>
					</ul>
				</div>
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
	import {Toast} from 'mint-ui'

	var proItem = {

	}
	export default {
		components: {
			TopBar,
			TabBar
		},
		data () {
			return {
				area: []
			}
		},
		props: {},
	  	watch: {},
	  	methods: {
	  		enterChatRoom () {
	  			Toast('即将开放')
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
			Api.getChatRoom(Qs.stringify({
					time: time,
					token: token
			})).then(res => {
				if(res.data.code == 200) {
					that.area = res.data.data
				}
			})
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
	.chat {
		position: fixed;
    	width: 100%;
    	height: 100%;
    	top: 0;
    	background-color: #E6615D;
	}
	.content {
		margin: 0 0.3rem;
		margin-top: 1.2rem;
		text-align: center;
		font-size: 0.36rem;
		color: #E6615D;
		.area-item {
			margin-bottom: 0.5rem;
			box-shadow: 0 0.04rem 0.04rem 0 rgba(91,6,3,0.70);
			border-radius: 0.1rem;
			background: #FFFFFF;
		}
		.chat-item {
			width: 100%;
			height: 0.88rem;
			line-height: 0.88rem;
			position: relative;
		}
		.chat-area {
			padding: 0.2rem;
			background-color: #f4f4f4;
			ul li {
				float: left;
				width: 30.2%;
				margin: 0 0.1rem;
				margin-bottom: 0.2rem;
				button {
					width: 100%;
					height: 0.88rem;
					border: 2px solid #bbbbbb;
					border-radius: 0.08rem;
					background-color: #fff;
					color: #bbbbbb;
				}
			}
		}
	}
</style>