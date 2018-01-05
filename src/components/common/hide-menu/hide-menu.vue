<!-- 标题栏组件 -->
<template>
	<div v-show="isShow">
		<div class="hide-menu">
			<ul>
				<router-link class="active" tag="li" to="/post"><i></i><span>公告</span></router-link>
				<li><i></i><span>创建房间</span></li>
				<li><i></i><span>任务</span></li>
				<li><i></i><span>排行榜</span></li>
				<li><i></i><span>客服</span></li>   
				<li @click="copy"><i></i><span>分享</span></li>
			</ul>
		</div>
		<div class="mask" @click="show"></div>
	</div>
</template>

<script>
	export default {
		components: {},
		data () {
			return {
				isShow: true
			}
		},
		props: {
			txt: {
				type: String,
				default: '抢豆豆'
			}
		},
	  	watch: {},
	  	methods: {
	  		show() {
	  			this.isShow = !this.isShow
	  		}，
	  		copy () {
	  			console.log(12)
	  			window.clipboardData.setData('text', '您的好友邀请您一起游戏，下载地址：http://www.baidu.com）已经复制到手机粘贴板')
            	alert('已复制')
	  		}
	  	},
	  	filters: {},
	  	computed: {},
	  	created () {},
	  	mounted () {},
	  	destroyed () {}
	}
</script>

<style lang="scss" scoped>
	@import '~@/assets/scss/const.scss';
	@import '~@/assets/scss/mixin.scss';
	
	.hide-menu {
			position: absolute;
			top: 0.88rem;
			right: 0;
			z-index: 1000;
			background-color: #fff;
			li {
				padding: 0 0.35rem;
				height: 0.65rem;
				line-height: 0.65rem;
				font-size: 0.28rem;
			}
			.active {
				color: #fff;
				background-color: #E6615D;
			}
			i{
				float: left;
				display: block;
				width: 0.35rem;
				height: 0.35rem;
				margin-top: 0.15rem;
				margin-right: 0.2rem;
			}
			span {
				float: left;
			}
	}
	.mask {
		width: 100%;
		height: 100%;
		position: fixed;
	    top: 0.88rem;
	    right: 0;
	    bottom: 0;
	    left: 0;
	    z-index: 998;
	    background-color: rgba(0,0,0,.3);
	}
</style>