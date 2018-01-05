<!-- 标题栏组件 -->
<template>
	<!-- <transition name="forward"> -->
		<div class="create-room">
			<top-bar returnShow="true"></top-bar>
			<div class="content">
				<ul class="title clearfix">
					<li 
						v-for="(item, index) in tabTitle" 
						@click="toggleRoomTabs(index)" 
						v-bind:class="{active:index == nowIndex1}" 
						class="title-item fl">{{item}}</li>
				</ul>
				<span>
					<input 
						type="text" 
						class="room-name" 
						v-model="name" 
						placeholder="请输入房间名称">
				</span>
				<div class="multi" v-if="nowIndex1%2 == 0">
					<div class="gold-num">
						<h4>红包金豆数</h4>
						<span class="gold-item" v-for="item in tabContent1"><input type="radio" v-model="gold" name="gold" :value="item">{{item}}</span>
					</div>
					<h4>玩法场</h4>
					<span class="radio-item"><input type="radio" v-model="multi" value="1" name="multi">6包最小1.10倍</span>
					<span class="radio-item"><input type="radio" v-model="multi" value="2" name="multi">6包最大1.10倍</span><br>
					<span><input type="radio" v-model="multi" value="3" name="multi">自定义<br>
						<span 
							class="self-input" 
							:class="{'blur': disabled1}">包数： <input type="num" v-model="selfNumber1" :placeholder="type1Number" :disabled="disabled1"></span>
						<span 
							class="self-input" 
							:class="{'blur': disabled1}">倍数： <input type="num" v-model="selfMultiple1" placeholder="区间1.10-1.20" :disabled="disabled1"></span>
						<span :class="{'blur': disabled1}"><input type="radio" v-model="selfType" :disabled="disabled1" value="1" name="selfType">最小</span>
						<span :class="{'blur': disabled1}"><input type="radio" v-model="selfType" :disabled="disabled1" value="2" name="selfType">最大</span>
					</span>
					<h4>奖励</h4>
					<span>
						<span class="self-input">顺子(满足三位数以上)： <input type="num" v-model="rewardsz1" placeholder="1-3000"></span>
						<span class="self-input">炸弹(满足三位数以上)： <input type="num" v-model="rewardBoom1" placeholder="1-3000"></span>
					</span>
				</div>
				<div class="multi" v-if="nowIndex1%2 == 1">
					<div class="gold-num">
						<h4>红包金豆数</h4>
						<span class="gold-item" v-for="item in tabContent2"><input type="radio" v-model="gold" :value="item" name="gold">{{item}}</span>
					</div>
					<h4>倍数场</h4>
					<span class="radio-item"><input type="radio" v-model="multi" value="4" name="multi">11包1倍房</span>
					<span class="radio-item"><input type="radio" v-model="multi" value="5" name="multi">9包1.2倍房</span>
					<span class="radio-item"><input type="radio" v-model="multi" value="6" name="multi">7包1.5倍房</span>
					<span>
						<input type="radio" v-model="multi" value="7" name="multi">自定义<br>
						<span class="self-input" :class="{'blur': disabled2}">包数： <input type="num" v-model="selfNumber2" :placeholder="type2Number" :disabled="disabled2"></span>
						<span class="self-input" :class="{'blur': disabled2}">倍数： <input type="num" v-model="selfMultiple2" placeholder="区间1.0-2.0" :disabled="disabled2"></span>
					</span>
					<h4>奖励</h4>
					<span>
						<span class="self-input">顺子(满足三位数以上)： <input type="num" v-model="rewardsz2" placeholder="1-3000"></span>
						<span class="self-input">炸弹(满足三位数以上)： <input type="num" v-model="rewardBoom2" placeholder="1-3000"></span>
					</span>
				</div>
				<button class="btn create" @click="createRoom">创建房间</button>
			</div>
		</div>
	<!-- </transition> -->
</template>

<script> 
	import Vue from 'vue'
	import Qs from 'qs'
	import Api from '@/api/index'
	import { Toast } from 'mint-ui'
	import pageUtil from '@/utils/page'
	import TopBar from '@/components/common/top-bar/top-bar'

	export default {
		components: {
			TopBar
		},
		data () {
			return {
				tabTitle: ['接龙场', '扫雷场'],
				tabContent1: ['1', '10', '25', '50', '100', '200'],
				tabContent2: ['1', '10', '25', '50', '100', '200', '500'],
				nowIndex: 0,
				nowIndex1: 0,
				name: '',
				tid: 1,
				gold: '',
				number: '',
				multi: '',
				multiple: '',
				selfNumber1: '',
				selfMultiple1: '',
				selfNumber2: '',
				selfMultiple2: '',
				rewardsz1: '',
				rewardsz2: '',
				rewardBoom1: '',
				rewardBoom2: '',
				selfType: '',
				type1Number: '',
				type2Number: ''
			}
		},
		props: {
			txt: {
				type: String,
				default: '抢豆豆'
			},
			returnShow: false,
			addShow: false
		},
	  	watch: {},
	  	methods: {
	  		hide() {
	  			this.nowIndex = 0
	  			this.maskShow = !this.maskShow
	  		},
	  		toggleRoomTabs(index) {
	  			this.tid = index + 1
	  			this.nowIndex1 = index
	  		},
	  		createRoomApi() {
	  			let that = this
				let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				this.$store.dispatch('showLoading')
				Api.createRoom(
					Qs.stringify({
						time: time,
						token: token,
						name: that.name,
						tid: that.tid,
						gold: that.gold,
						number: that.number,
						multiple: that.multiple,
						type: that.type,
						reward: that.reward
				})).then(function (res) {
					that.$store.dispatch('hideLoading')	
		    		if(res.data.code == 200) {
		    			Toast(res.data.msg)
	        			that.enterRoom(res.data.data)
	        			that.$store.commit('updateCreateRoomShow', false)
		    		} else {
		    			pageUtil.resCode(res)
		    		}
		  		})
		  		.catch(function (error) {
		    		console.log(error);
		  		})
	  		},
	  		enterRoom (item) {
	  			let that = this
				let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				this.$store.dispatch('showLoading')
				Api.enterRoom(
					Qs.stringify({
						time: time,
						token: token,
						rid: item.id
				})).then(function (res) {
					that.$store.dispatch('hideLoading')
	    			if(res.data.code == 200) {
	    				if (item) {
	    					that.$store.commit('updateCurrSession', item)
        					that.$router.push({path: '/chat/team-' + item.imtid})
	    				}	
	    			} else {
	    				pageUtil.resCode(res)
	    			}
	  			})
	  			.catch(function (error) {
	    			console.log(error);
	  			})
	  		},
	  		createRoom () {
	  			if(this.multi == 1) {
	  				this.multiple = 1.1
	  				this.number = 6
	  				this.type = 1
	  			} else if(this.multi == 2) {
	  				this.multiple = 1.1
	  				this.number = 6
	  				this.type = 2
	  			} else if(this.multi == 3) {
	  				this.multiple = this.selfMultiple1
	  				this.number = this.selfNumber1
	  				this.type = this.selfType
	  			} else if(this.multi == 4) {
	  				this.multiple = 1
	  				this.number = 11
	  			} else if(this.multi == 5) {
	  				this.multiple = 1.2
	  				this.number = 9
	  			} else if(this.multi == 6) {
	  				this.multiple = 1.5
	  				this.number = 7
	  			} else if(this.multi == 7) {
	  				this.multiple = this.selfMultiple2
	  				this.number = this.selfNumber2
	  			}
	  			if(this.multi == 3) {
	  				if(this.selfNumber1 == '' || this.selfMultiple1 == '') {
	  					Toast('请输入包数和倍数')
	  					return
	  				} else if (!Number(this.selfNumber1) || !Number(this.selfMultiple1)) {
	  					Toast('包数和倍数必须为数字')
	  					return
	  				} else if (Number(this.selfNumber1) < 3 || Number(this.selfNumber1) > 20  || Number(this.selfMultiple1) < 1.1 || Number(this.selfNumber1) > 1.2) {
	  					Toast('包数和倍数超出限定范围')
	  					return
	  				} else if (this.selfType == '') {
	  					Toast('请选择最大或最小')
	  					return
	  				} 
	  			} 
	  			if(this.multi == 7) {
	  				if(this.selfNumber2 == '' || this.selfMultiple2 == '') {
	  					Toast('请输入包数和倍数')
	  					return
	  				} else if (!Number(this.selfNumber2) || !Number(this.selfMultiple2)) {
	  					Toast('包数和倍数必须为数字')
	  					return
	  				} else if (Number(this.selfNumber2) < 5 || Number(this.selfNumber2) > 20  || Number(this.selfMultiple2) < 1 || Number(this.selfMultiple1) > 2) {
	  					Toast('包数和倍数超出限定范围')
	  					return
	  				}
	  			} 
	  			if(this.name == '') {
	  				Toast('请输入房间名称')
	  			} else if(this.gold == '') {
	  				Toast('请选择金豆数量')
	  			} else if(this.multi == '') {
	  				Toast('请选择玩法场')
	  			} else if(this.reward.sz && !Number(this.reward.sz)) {
	  				Toast('奖励必须为数字')
	  			} else if(this.reward.zd && !Number(this.reward.sz)) {
	  				Toast('奖励必须为数字') 
	  			} else {
	  				this.createRoomApi()
	  			}
	  		},
	  		getNumber () {
	  			let that = this
				let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
		  		Api.numberRange(Qs.stringify({
						time: time,
						token: token
				})).then(res => {
					if(res.data.code == 200 || res.data.code == 201) {
						that.type1Number = `区间${res.data.data.type1_min}-${res.data.data.type1_max}`
						that.type2Number = `区间${res.data.data.type2_min}-${res.data.data.type2_max}`
					}
				})
	  		}
	  	},
	  	filters: {},
	  	computed: {
	  		reward () {
	  			let data
	  			if(this.nowIndex1%2 == 0) {
	  				data = {
			  			sz: this.rewardsz1,
			  			zd: this.rewardBoom1
			  		}
	  			} else {
	  				data = {
			  			sz: this.rewardsz2,
			  			zd: this.rewardBoom2
			  		}
	  			}
	  			return data
	  		},
	  		disabled1 () {
	  			if(this.multi == 3) {
	  				return false
	  			} else {
	  				return true
	  			}
	  		},
	  		disabled2 () {
	  			if(this.multi == 7) {
	  				return false
	  			} else {
	  				return true
	  			}
	  		}
	  	},
	  	created () {
	  		this.getNumber()
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
	
	.create-room {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		background-color: #f7f7f7;
	}

	input[type="text"] {
		height: 0.6rem;
	}
	.content{
		margin: 0.3rem;
		margin-top: 1.2rem;
		padding: 0 0.3rem;
		background-color: #fff;
		box-shadow: 0 0.02rem 0.04rem 0 rgba(0,0,0,0.44);
		border-radius: 0.08rem;
		font-size: 0.28rem;
		.title {
			margin: 0 -0.3rem;
			text-align: center;
			line-height: 0.6rem;
			.title-item {
				width: 50%;
				color: rgba(43,43,43,0.61);
				border-bottom: 1px solid rgba(151,151,151,0.22);
			}
			.active {
				color: #2b2b2b;
				border-bottom-color: #E5615D;
			}	
		}
		.multi {
			text-align: left;
			line-height: 0.6rem;
			color: #232323;
			.gold-num {
				border-bottom: 1px solid rgba(151,151,151,0.22);
			}
			.radio-item {
				margin-right: 0.3rem;
			}
			.gold-item {
				margin-right: 0.4rem;
			}
			input[type="radio"] {
				width: 0.3rem;
				height: 0.3rem;
			}
			input {
			    width: 100%;
			    height: 0.6rem;
			    border: 0;
			    font-size: 0.28rem;
			    border-bottom: 1px solid rgba(151,151,151,0.22);
			}
			input[type="num"] {
				width: 100%;
				height: 0.6rem;
			}
			.blur {
				color: #c5c5c5;
			}
			.self-input {
				display: inline-block;
				width: 100%;
				margin-left: 0.3rem;
			}
		}
		.create {
			margin-bottom: 0.3rem;
			width: 100%;
			height: 0.88rem;
			border: 0;
			color: #fff;
			background-color: #E5615D;
		}
	}
</style>