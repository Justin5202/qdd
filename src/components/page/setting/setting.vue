<!-- 首页 -->
<template>
	<div class="setting">
		<top-bar txt="设置" returnShow="true"></top-bar>
		<div class="content">
			<ul class="set-ul">
				<li v-for="(item, index) in title"
					@click="modify(item, index)">
					<span>{{ item }}</span>
					<i class="icon-arrow_right fr"></i>
				</li>
			</ul>
		</div>
		<router-view></router-view>
	</div>
</template>

<script>
	import TopBar from '@/components/common/top-bar/top-bar'
	import Qs from 'qs'
	import Api from '@/api/index'
	import pageUtil from '@/utils/page'
	
	export default {
		components: {
			TopBar
		},
		data() {
			return {
				title: ['修改昵称', '修改登录密码', '修改支付密码', '推荐人', '我的推荐码', '关于抢豆豆']
			}
		},
		methods: {
			modify (title, index) {
				if(index === 4) {
					this.$router.push('/myqrcode')
					return
				}
				if(index === 5) {
					this.$router.push('/about')
					return
				}
				console.log(`/modify/${title}/${index}`)
				this.$router.push({path: `/modify/${title}/${index}`})
			}
		},
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
			mui.back = function() {
	            history.go(-1)
	        }
		}
	}
</script>

<style lang="scss" scoped>
	@import '~@/assets/scss/const.scss';
	@import '~@/assets/scss/mixin.scss';
	.setting {
		position: fixed;
    	width: 100%;
    	height: 100%;
    	top: 0;
    	color: #000;
    	background-color: #f7f7f7;
	}
	.content {
		height: 11.3rem;
		margin: 1.18rem 0.3rem 0 0.3rem;
		padding: 0 0.3rem;
		background: #FFFFFF;
		box-shadow: 0 0.02rem 0.04rem 0 rgba(0,0,0,0.18);
		border-radius: 0.1rem;
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
</style>