<!-- 首页 -->
<template>
	<div class="modify">
		<top-bar :txt="title" returnShow="true"></top-bar>
		<div class="content">
			<form action="" v-if="id != 1 && id != 2 && !placeholderValue">
				<input type="text" name="text" :disabled="id == 3 && this.$store.state.myInfo.rec > 0" v-model:value="inputValue" :placeholder="defaultValue">
				<button class="btn big-btn" :class="{active: inputValue != ''}" :disabled="inputValue == ''" @click.prevent="done">确认</button>
			</form>
			<form action="" v-else-if="id == 1 || id == 2">
				<input type="password" name="oldpws" v-if="!(isPay == 0)" v-model:value="oldpsw" placeholder="请输入旧密码">
				<input type="password" name="oldpws" v-else-if="id == 1"  v-model:value="oldpsw" placeholder="请输入旧密码">
				<input type="password" name="newpws" v-model:value="newpsw" placeholder="请输入新密码">
				<input type="password" name="renewpws" v-model:value="renewpsw" placeholder="请再次输入密码">
				<button class="btn big-btn" :class="{active: newpsw != '' && newpsw === renewpsw}" :disabled="newpsw == ''" @click.prevent="done">确认</button>
				<router-link tag="p" class="forget fr" to="/resetpsw/pay">忘记密码？</router-link>
			</form>
			<form action="" v-else-if="placeholderValue">
				<input type="text" name="text" v-model:value="name" :placeholder="placeholderValue">
				<button class="btn big-btn" :class="{active: name != ''}" :disabled="name == ''" @click.prevent="confirm">确认</button>
			</form>
		</div>
	</div>
</template>

<script>
	import TopBar from '@/components/common/top-bar/top-bar'
	import Qs from 'qs'
	import Api from '@/api/index'
	import { Indicator, Toast} from 'mint-ui'
	import pageUtil from '@/utils/page'

	export default {
		components: {
			TopBar
		},
		beforeRouteEnter (to, from, next) {
			if(from.path.match(/^\/userinfo\//)) {
				next(vm => vm.placeholderValue = '请输入备注名')
			}
			next()
		},
		data() {
			return {
				// inputValue: '',
				oldpsw: '',
				newpsw: '',
				renewpsw: '',
				name: '',
				id: this.$route.params.index,
				title: this.$route.params.title,
				inputValue: '',
				from: null,
				placeholderValue: false
			}
		},
		computed: {
			defaultValue () {
				if(this.id == 0) {
					return this.$store.state.myInfo.nickname
				} else if(this.id == 3) {
					if(!this.$store.state.myInfo.rec) {
						return '你还没有推荐人'
					} else {
						return this.$store.state.myInfo.rec
					}
				}
			},
			isPay () {
				return this.$store.state.myInfo.ispay
			}
		},
		methods: {
			done () {
				let that = this
				let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				if(this.id == 0) {
					Api.modifyName(Qs.stringify({
						time: time,
						token: token,
						name: this.inputValue
					})).then(res => {
						if(res.data.code == 200) {
							Toast({
			                  	message: '修改成功',
			                  	iconClass: 'icon icon-success',
			                  	duration: 1000
			              	})
			              	setTimeout(() => {
			              		window.history.go(-1)
			              	}, 1000)
						} else {
							pageUtil.resCode(res)
						}
					})
				} else if(this.id == 1) {
					Api.modifyPsw(Qs.stringify({
						time: time,
						token: token,
						oldpsw: this.oldpsw,
						psw: this.newpsw,
						rpsw: this.renewpsw
					})).then(res => {
						if(res.data.code == 200) {
							Toast({
			                  	message: '修改成功',
			                  	iconClass: 'icon icon-success',
			                  	duration: 1000
			              	})
			              	setTimeout(() => {
			              		window.history.go(-1)
			              	}, 1000)
						} else {
							pageUtil.resCode(res)
						}
					})
				} else if(this.id == 2) {
					Api.modifyPayPsw(Qs.stringify({
						time: time,
						token: token,
						oldpsw: this.oldpsw,
						psw: this.newpsw,
						rpsw: this.renewpsw
					})).then(res => {
						if(res.data.code == 200) {
							Toast({
			                  	message: '修改成功',
			                  	iconClass: 'icon icon-success',
			                  	duration: 1000
			              	})
			              	setTimeout(() => {
			              		window.history.go(-1)
			              	}, 1000)
						} else {
							pageUtil.resCode(res)
						}
					})
				} else if(this.id == 3) {
					Api.referrals(Qs.stringify({
						time: time,
						token: token,
						rec: this.inputValue
					})).then(res => {
						if(res.data.code == 200) {
							Toast({
			                  	message: '修改成功',
			                  	iconClass: 'icon icon-success',
			                  	duration: 1000
			              	})
			              	setTimeout(() => {
			              		window.history.go(-1)
			              	}, 1000)
						} else {
							pageUtil.resCode(res)
						}
					})
				}
			},
			confirm () {
				let that = this
				let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				Api.remark(Qs.stringify({
						time: time,
						token: token,
						fuid: this.id,
						remark: this.name
					})).then(res => {
						if(res.data.code == 200) {
							Toast('修改成功')
			              	setTimeout(() => {
			              		window.history.go(-1)
			              	}, 1000)
						} else {
							pageUtil.resCode(res)
						}
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
	.modify {
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
		.big-btn {
			margin-top: 0.6rem;
			background-color: #b8b8b8;
		}
		.active {
			background-color: #E5615D;
		}
		input {
			width: 100%;
			height: 0.88rem;
			border: 0;
			font-size: 0.28rem;
			border-bottom: 1px solid rgba(151,151,151,0.22);
		}
		input[type="text"]:disabled {
			background-color: transparent;
		}
		.forget {
			font-size: 0.24rem;
			padding-top: 0.1rem;
			color: #b8b8b8;
		}
	}
</style>