<!-- 首页 -->
<template>
	<div class="about">
		<top-bar txt="关于抢豆豆" returnShow="true"></top-bar>
		<div class="mask" v-if="isShow"></div>
		<div class="content">
			<div class="logo-wrapper">
				<i class="logo"></i>
				<p>一起抢豆豆</p>
			</div>
			<ul class="set-ul">
				<li>
					<span>版本号</span>
					<span class="version fr">1.0.3</span>
					<i class="icon-arrow_right fr"></i>
				</li>
				<li @click="check">
					<span>版本更新</span>
					<i class="icon-arrow_right fr"></i>
				</li>
			</ul>
			<p class="bot">Copyright @ 2017-2018 QDD</p>
		</div>
		<!-- 提示框 -->
      	<div class="tips" v-if="isShow">
        	<p>更新提示</p>
        	<span>您必须更新到最新版本才能使用</span>
        	<button class="big-btn" @click="download">立即升级</button>
      	</div>
	</div>
</template>

<script>
	import TopBar from '@/components/common/top-bar/top-bar'
	import Qs from 'qs'
	import Api from '@/api/index'
	import pageUtil from '@/utils/page'
	import {Toast} from 'mint-ui'
	
	export default {
		components: {
			TopBar
		},
		data() {
			return {
				isShow: false,
				downUrl: ''
			}
		},
		methods: {
			check() {
				this.checkUpdate()
				this.$store.dispatch('showLoading')
			},
			download () {
		      	plus.runtime.openURL( this.downUrl )
		    },
			checkUpdate () {
				let that = this
			    let time = Date.parse(new Date()) / 1000
			    let str = time + this.$store.state.str
			    let token = Api.encrypted(str, time)
				Api.checkVer(
			      Qs.stringify({
			        time: time,
			        token: token,
			        ver: '1.0.3'
			    })).then(function (res) {
			        that.$store.dispatch('hideLoading')
			        if(res.data.code == 200 || res.data.code == 201) {
			          Toast('已是最新版本，无需升级')
			        } else {
			          localStorage.setItem('version', res.data.data.version)
			          that.isShow = true
			          that.downUrl = res.data.data.down
			        }
			    })
			    .catch(function (error) {
			      console.log(error);
			    })
			}
		},
		mounted () {
			mui.back = function() {
	            history.go(-1)
	        }
		}
	}
</script>

<style lang="scss" scoped>
	@import '~@/assets/scss/const.scss';
	@import '~@/assets/scss/mixin.scss';
	.about {
		position: fixed;
    	width: 100%;
    	height: 100%;
    	top: 0;
    	color: #000;
    	background-color: #f7f7f7;
	}
	.content {
		.logo-wrapper {
			padding-top: 1rem;
			width: 100%;
			height: 4rem;
			.logo {
				margin: 0 auto;
				display: block;
				width: 1.7rem;
				height: 1.7rem;
				background: url('../../../assets/icon/256x256.png') no-repeat;
				background-size: 100%;
			}
			p {
				padding: 0.1rem 0;
				font-size: 0.32rem;
				text-align: center;
			}
		}
	}
	.set-ul {
		padding: 0 0.3rem;
		background-color: #fff;
	}
	ul li {
		line-height: 0.88rem;
		border-bottom: 1px solid rgba(151,151,151,0.22);
		position: relative;
		i {
			display: block;
		}
		.icon-arrow_right {
		  	position: absolute;
		  	right: 0;
		  	top: 0.35rem;
		  	display: block;
		  	width: 0.13rem;
		  	height: 0.20rem;
		}
	}
	.bot {
		margin-top: 4rem;
		font-size: 0.2rem;
		color: #666;
		text-align: center;
	}
	.version {
		margin-right: 0.3rem;
	}
	.tips {
	  position: absolute;
	  top: 35%;
	  left: 50%;
	  width: 80%;
	  margin-left: -40%;
	  padding: 0.2rem 0;
	  text-align: center;
	  background-color: #fff;
	  border-radius: 0.08rem;
	  z-index: 999;
	  p {
	    font-size: 0.36rem;
	  }
	  span {
	    display: block;
	    padding: 0.2rem 0;
	  }
	  button {
	    width: 80%;
	    border-radius: 0.08rem;
	  }
	}
</style>