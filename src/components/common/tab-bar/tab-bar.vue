<!-- 底部导航栏组件 -->
<template>
	<div class="bottom-fixed">
		<ul class="tab-bar">
			<router-link class="index" tag="li" to="/index">
				<i class="ico-index" v-if="path == '/index'"></i>
				<i class="ico-index index-gray" v-else></i>
				<span>首页</span>
			</router-link>
			<router-link class="shop" tag="li" to="/shop">
				<i class="ico-shop" v-if="path == '/shop'"></i>
				<i class="ico-shop shop-gray" v-else></i>
				<span>商城</span>
			</router-link>	
			<router-link class="chat" tag="li" to="/ChatRoom">
				<i class="ico-chat" v-if="path == '/ChatRoom'"></i>
				<i class="ico-chat chat-gray" v-else></i>
				<span>聊天大厅</span>
			</router-link>
			<router-link class="friend" tag="li" to="/friend/1">
				<i class="ico-friend" v-if="path == '/friend/1'"></i>
				<i class="ico-friend friend-gray" v-else></i>
				<span>好友</span>
				<span class="unread" v-show="unread || sysUnreadMsgs"></span>
			</router-link>
			<router-link class="mine" tag="li" to="/mine">
				<i class="ico-mine" v-if="path == '/mine'"></i>
				<i class="ico-mine mine-gray" v-else></i>
				<span>我的</span>
			</router-link>
		</ul>
	</div>
</template>

<script>
	export default {
		components: {},
		data () {
			return {
				songReady: false
			}
		},
		props: {},
	  	watch: {},
	  	methods: {
	  		
	  	},
	  	filters: {},
	  	computed: {
	  		sessionlist () {
		      	return this.$store.state.sessionlist
		    },
		    unread () {
		    	let count = 0
				if(this.sessionlist.length > 0) {
					for(let j in this.sessionlist) {
						if(this.sessionlist[j].scene == 'p2p') { 
							count += this.sessionlist[j].unread
						}
					}	
				}
				return count
		    },
	  		sysUnreadMsgs () {
	  			let msgs = this.$store.state.sysMsgs
	  			for(let i in msgs) {
	  				if(!msgs[i].read) {
	  					return true
	  				}
	  			}
	  		},
	  		path () {
	  			return this.$route.path
	  		}
	  	},
	  	created () {
	  	},
	  	mounted () {},
	  	watch: {
	  	},
	  	destroyed () {}
	}
</script>

<style lang="scss" scoped>
	@import '~@/assets/scss/const.scss';
	@import '~@/assets/scss/mixin.scss';
	
	.bottom-fixed {
		position: fixed;
		left: 0;
	    bottom: 0;
	    width: 100%;
	    display: block;
	}
	.video {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}
	.tab-bar {
		display: flex;
		-webkit-box-pack: justify;
	    -moz-box-pack: justify;
	    -ms-flex-pack: justify;
	    -webkit-box-align: center;
	    -moz-box-align: justify;
	    -ms-flex-align: center;
	    justify-content: space-between;
	    align-content: center;
		width: 100%;
		height: 0.88rem;
		text-align: center;
		background-color: #fff;
		box-shadow: 0.002rem 0 0.004rem 0 #5B0503;
		z-index: 21;
		li {
			flex: 1;
			height: 100%;
			display: block;
			float: left;
			position: relative;
			i {
				margin: 0 auto;
				margin-top: 0.1rem;
				display: block;
				width: 0.42rem;
				height: 0.42rem;
			}
			.ico-index {
				background: url('../../../assets/icon/icon_home.png') no-repeat center;
				background-size: 100%;
			}
			.ico-shop {
				background: url('../../../assets/icon/icon_shop.png') no-repeat center;
				background-size: 100%;
			}
			.ico-chat {
				background: url('../../../assets/icon/icon_lt.png') no-repeat center;
				background-size: 100%;
			}
			.ico-friend {
				background: url('../../../assets/icon/icon_hy.png') no-repeat center;
				background-size: 100%;
			}
			.ico-mine {
				background: url('../../../assets/icon/icon_my.png') no-repeat center;
				background-size: 88%;
			}
			.index-gray {
				background: url('../../../assets/icon/icon_home_d.png') no-repeat center;
				background-size: 100%;
			}
			.shop-gray {
				background: url('../../../assets/icon/icon_shop_d.png') no-repeat center;
				background-size: 100%;
			}
			.chat-gray {
				background: url('../../../assets/icon/icon_lt_d.png') no-repeat center;
				background-size: 100%;
			}
			.friend-gray {
				background: url('../../../assets/icon/icon_hy_d.png') no-repeat center;
				background-size: 100%;
			}
			.mine-gray {
				background: url('../../../assets/icon/icon_my_d.png') no-repeat center;
				background-size: 100%;
			}
			span {
				display: block;
				font-size: 0.22rem;
			}
			.unread {
				position: absolute;
				width: 0.2rem;
				height: 0.2rem;
				top: -0.1rem;
				right: 0.5rem;
			}
		}
	}
</style>