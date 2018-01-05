<!-- 标题栏组件 -->
<template>
	<div class="mine">
		<top-bar :txt="txt" addShow="true"></top-bar>
		<tab-bar></tab-bar>
		<div class="content">
			<div class="user-info clearfix" v-if="myInfo">
				<div class="user-img fl">
					<img :src="myInfo.header" alt="">
				</div>
				<div class="user-detail fl">
					<div class=" clearfix">
						<div class="account fl">
							<span class="name">{{ myInfo.nickname }}</span>
							<span class="id">ID：{{ myInfo.id }}</span>
						</div>
						<div class="fr">
							<span class="gold">
								<i class="ico-gold"></i>
								{{ myInfo.gold / 100 }}
								<span class="add" @click="goCharge"></span>
							</span>
							<span class="silver">
								<i class="ico-silver"></i>
								{{ myInfo.silver / 100 }}
								<span class="change" @click="exchange"></span>
							</span>
						</div>
					</div>
					<div class="level clearfix">
						<span class="fl" v-if="myInfo.type == 2 && myInfo.fuid == 0">VIP：一级代理</span>
						<span class="fl" v-else-if="myInfo.type == 2 && myInfo.fuid > 0">VIP：二级代理</span>
						<span class="fl" v-else>VIP：普通用户</span>
						<div class="good fl">
							<i class="icon-z fl"></i>
							<span class="fl">{{ myInfo.praise }}</span>
						</div>
					</div>
				</div>
			</div>
			<ul class="">
				<router-link tag="li" to="/service">
					<i class="service fl"></i>
					<span>客服</span>
					<i class="icon-arrow_right fr"></i>
				</router-link>
				<router-link tag="li" to="/history">
					<i class="record fl"></i>
					<span>记录</span>
					<i class="icon-arrow_right fr"></i>
				</router-link>
				<!-- <router-link tag="li" to="/agent">
					<i class="agent fl"></i>
					<span>代理查询</span>
					<i class="icon-arrow_right fr"></i>
				</router-link> -->
				<router-link tag="li" to="/setting">
					<i class="setting fl"></i>
					<span>设置</span>
					<i class="icon-arrow_right fr"></i>
				</router-link>
				<router-link class="recharge" tag="li" to="/recharge">
					<i class="recharge fl"></i>
					<span>购买</span>
					<i class="icon-arrow_right fr"></i>
				</router-link>
				<li @click="logout">
					<i class="logout fl"></i>
					<span>注销</span>
					<i class="icon-arrow_right fr"></i>
				</li>
			</ul>
		</div>
		<router-view></router-view>
		<sendredbag
			v-if="sendRedBagShow"
		    :goldType="2">
		</sendredbag>
	</div>
</template>

<script>
	import Vue from 'vue'
	import TopBar from '@/components/common/top-bar/top-bar'
	import TabBar from '@/components/common/tab-bar/tab-bar'
	import Sendredbag  from '@/components/common/sendRedBag/sendRedBag'
	import Qs from 'qs'
	import Api from '@/api/index'
	import pageUtil from '@/utils/page'
	import { MessageBox } from 'mint-ui'

	export default {
		components: {
			TopBar,
			TabBar,
			Sendredbag
		},
		data () {
			return {
				txt: '个人中心',
			}
		},
		props: {},
	  	watch: {},
	  	methods: {
	  		logout () {
	  			MessageBox.confirm('是否退出当前账号？').then(action => {
              		this.$store.dispatch('logout')
          		})
	  		},
	  		goCharge () {
	  			this.$router.push('/recharge')
	  		},
	  		exchange () {
	  			let that = this
				let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
		  		Api.getExchange(
					Qs.stringify({
						time: time,
						token: token
				})).then(function (res) {
		    		if(res.data.code == 200) {
		    			that.$store.commit('updateExchangeNum', res.data.data.exchange)
		    			that.$store.commit('updateBtnItemShow', 4)
		    			that.$store.dispatch('showRedBag')
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
	  		},
	  		sendRedBagShow () {
	  			return this.$store.state.redbagShow
	  		}
	  	},
	  	created () {},
	  	mounted () {
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
    				that.$store.commit('updateMyInfo', res.data.data)
    			} else {
    				pageUtil.resCode(res)
    			}
  			})
  			.catch(function (error) {
    			console.log(error);
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
	
	.mine {
		position: fixed;
    	width: 100%;
    	height: 100%;
    	top: 0;
    	background-color: #f7f7f7;
	}

	.content {
		height: 9.84rem;
		margin: 1.2rem 0.3rem 0 0.3rem;
		padding: 0.3rem;
		background: #FFFFFF;
		box-shadow: 0 0.02rem 0.04rem 0 rgba(0,0,0,0.18);
		border-radius: 0.1rem;
	}
	.user-info {
		padding-bottom: 0.2rem;
		border-bottom: 1px solid rgba(151,151,151,0.22);
		.user-img {
			width: 1.43rem;
			height: 1.46rem;
			img {
				width: 100%;
				height: 100%;
				border-radius: 0.08rem;
			}
		}
		.user-detail {
			margin-left: 0.3rem;
			width: 72%;
			span {
				display: block;
			}
			.account {
				max-width: 48%;
			}
			.name {
				display: block;
				max-width: 100%;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}
			.name, .gold, .silver {
				margin-bottom: 0.25rem;
				position: relative;
			}
			.gold, .silver {
				padding: 0 0.5rem;
			}
			.add, .change {
				width: 0.44rem;
				height: 0.44rem;
				position: absolute;
				top: -0.05rem;
				right: 0;
			}
			.add {
				background: url('../../../assets/icon/charge.png') no-repeat;
				background-size: 100%;
			}
			.change {
				background: url('../../../assets/icon/change.png') no-repeat;
				background-size: 100%;
			}
			.ico-gold, .ico-silver {
				top: 0;
				left: 0rem;
				position: absolute;
				display: block;
				width: 0.32rem;
				height: 0.32rem;
				background-size: 100%;
			}
			.level {
				span {
					font-weight: bold;
					color: #E6615D; 
				}
				.good {
					margin-left: 0.3rem;
					margin-top: 0.05rem;
				}
				.icon-z {
					margin-right: 0.3rem;
				}
			}
		}
	}
	ul li {
		line-height: 0.88rem;
		border-bottom: 1px solid rgba(151,151,151,0.22);
		position: relative;
		i {
			display: block;
			margin: 0 0.3rem 0 0.1rem;
		}
		.service {
			width: 0.44rem;
			height: 0.39rem;
			background: url('../../../assets/icon/icon-kf.jpg') no-repeat;
			background-size: 100%;
			margin-top: 0.25rem;
		}
		.record {
			width: 0.44rem;
			height: 0.48rem;
			background: url('../../../assets/icon/icon-reco.jpg') no-repeat;
			background-size: 100%;
			margin-top: 0.2rem;
		}
		.task {
			width: 0.44rem;
			height: 0.53rem;
			background: url('../../../assets/icon/icon-task.jpg') no-repeat;
			background-size: 100%;
			margin-top: 0.15rem;
		}
		.setting, .help {
			width: 0.44rem;
			height: 0.42rem;
			background: url('../../../assets/icon/icon-setting.jpg') no-repeat;
			background-size: 100%;
			margin-top: 0.23rem;
		}
		.help {
			background: url('../../../assets/icon/icon-help.jpg') no-repeat;
			background-size: 100%;
		}
		.logout, .recharge, .agent {
			width: 0.44rem;
			height: 0.44rem;
			background: url('../../../assets/icon/logout.png') no-repeat;
			background-size: 100%;
			margin-top: 0.23rem;
		}
		.agent {
			background: url('../../../assets/icon/icon-daili.png') no-repeat;
			background-size: 100%;
		}
		.recharge {
			width: 0.48rem;
			height: 0.48rem;
			background: url('../../../assets/icon/icon-recharge.png') no-repeat;
			background-size: 100%;
			margin-right: 0.26rem;
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
</style>