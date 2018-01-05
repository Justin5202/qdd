<!-- 标题栏组件 -->
<template>
	<div>
		<div class="mask" @click="hide" v-if="isShow"></div>
			<transition
			enter-active-class="zoomIn" leave-active-class="zoomOut">
			<div class="bag" 
				v-if="isShow">
				<h3 v-if="btnItemShow == 1 || btnItemShow == -1">发<span v-if="currSession.rtype == 1">接龙</span><span v-else-if="currSession.rtype == 2">扫雷</span>宝箱</h3>
				<h3 v-if="btnItemShow == 2">赠送金豆</h3>
				<h3 v-if="btnItemShow == 3">中包结算</h3>
				<h3 v-if="btnItemShow == 4">兑换银豆</h3>
				<h3 v-if="btnItemShow == 5">奖励结算</h3>
				<span class="bag-type" v-if="btnItemShow == 1 || btnItemShow == -1">豆豆宝箱</span>
				<span class="bag-type" v-if="btnItemShow == 3">结算金额</span>
				<span class="bag-type" v-if="btnItemShow == 4">兑换比例：1×{{ exNum }} </span>
				<ul v-if="btnItemShow == 5">
					<li v-for="item in rewardBagInfo.list">
						<span>ID：{{item.tuid}}</span><span v-if="goldType == 1">-	{{item.gold / 100}}金豆</span><span v-else-if="goldType == 2">-	{{item.gold / 100}}银豆</span>
					</li>
				</ul>
				<h2 class="bag-num" v-if="btnItemShow == 1 || btnItemShow == -1">{{currSession.gold / 100}}</h2>
				<h2 class="bag-num" v-if="btnItemShow == 3">{{giveGoldNum / 100}}</h2>
				<input 
					type="num" 
					name="num" 
					placeholder="请输入赠送数量"
					v-if="btnItemShow == 2"
					v-model="num">
				<input type="password"
						name="psw"
						placeholder="请输入支付密码"
						v-if="btnItemShow == 2"
						v-model="paypsw">
				<input 
					type="num" 
					name="num" 
					placeholder="请输入兑换金豆数量"
					v-if="btnItemShow == 4"
					v-model="changenum">
				<span class="type" v-if="goldType == 1">
					<i class="ico-gold"></i>
					金豆	<span class="gift-num" v-if="btnItemShow == 2">× {{ myInfo.gold / 100 }}</span>
					<span class="gift-num" v-else-if="btnItemShow == 5">- {{ rewardCount / 100 }}</span>
				</span>
				<span class="type" v-else-if="goldType == 2">
					<i class="ico-silver"></i>
					银豆	
					<span class="gift-num" v-if="btnItemShow == 4 && changenum">× {{ changenum * exNum }}</span>
					<span class="gift-num" v-else-if="btnItemShow == 5">- {{ rewardCount / 100 }}</span>
				</span>
				<span 
					class="btn" 
					v-if="btnItemShow == 1 || btnItemShow == -1" 
					@click="sendRedBag">    确定
					<span class="countdown" v-if="btnItemShow == 1">({{ sec }}秒后自动发送)</span>
				</span>
				<span 
					class="btn gift" 
					v-if="btnItemShow == 2" 
					@click="gift">确定
				</span>
				<span 
					class="btn give" 
					v-if="btnItemShow == 3" 
					@click="give">确定
					<span class="countdown">({{ sec }}秒后自动发送)</span>
				</span>
				<span 
					class="btn change" 
					v-if="btnItemShow == 4" @click="exchange">确定
				</span>
				<span 
					class="btn reward" 
					v-if="btnItemShow == 5" 
					@click="reward">
					<span class="countdown">({{ sec }}秒后自动发送)</span>
				</span>
				</span>
			</div>
		</transition>
	</div>
</template>

<script>
	import Qs from 'qs'
	import Api from '@/api/index'
	import pageUtil from '@/utils/page'
	import {Toast} from 'mint-ui'
	
	export default {
		components: {
		},
		data () {
			return {
				num: '',
				changenum: '',
				isClick: true,
				sec: '',
				paypsw: ''
			}
		},
		props: {
		    type: String,
		    scene: String,
		    to: String,
		    goldType: Number,
		    id: Number,
		    number: Number,
		    goldNum: Number,
		    giveGoldNum: '',
		    fuid: '',
		    showItem: ''
		},
	  	watch: {},
	  	methods: {
	  		sendRedBag () {
	  			let that = this
				let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				let bid
				this.$store.dispatch('showLoading')
				if(this.bid) {
					bid = this.bid
				}
				Api.sendRedBag(
						Qs.stringify({
							time: time,
							token: token,
							type: that.goldType,
							rid: that.currSession.id,
							bid: bid
					})).then(function (res) {
						that.$store.dispatch('hideLoading')
		    			if(res.data.code == 200) {
		    				window.clearTimeout(that.timer1)
		    				that.getMyInfo()
		    				let data = res.data.data
		    				that.$store.dispatch('sendMsg', {
					            type: 'custom',
					            scene: that.scene,
					            to: that.to,
					            content: {
					            	type: 'bag',
					            	data: {
					            		type: that.currSession.rtype,
										rid: that.id,
										number: that.number,
					            		bid: res.data.data.bid,
					            		thunder: res.data.data.thunder
					            	}
					            }
					        })
					        that.$store.commit('updateBtnItemShow', -1)
		    			} else {
		    				pageUtil.resCode(res)
		    			}
		  			})
		  			.catch(function (error) {
		    			console.log(error);
		  			})
		        this.$store.dispatch('hideRedBag')
	  		},
	  		gift () {
	  			let that = this
		  		let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				Api.gift(Qs.stringify({
					time: time,
					token: token,
					fuid: that.userSelected.fuid,
					money: this.num,
					paypsw: this.paypsw
				})).then(res => {
					if(res.data.code == 200) {
						that.$store.dispatch('hideRedBag')
						that.getMyInfo()
						that.$store.commit('updateBtnItemShow', -1)
						that.$store.dispatch('sendMsg', {
					        type: 'custom',
					        scene: 'p2p',
					        to: that.userSelected.acid,
					        content: {
					        	type: 'gift',
					        	fromId: that.myInfo.id,
					        	from: that.myInfo.nickname,
					        	to: that.userSelected.nickname,
					        	num: that.num
					        }
					    })
						Toast(res.data.msg)
					} else {
						pageUtil.resCode(res)
					}
				})
	  		},
	  		give () {
	  			let that = this
		  		let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				Api.give(Qs.stringify({
					time: time,
					token: token,
					qid: that.qid
				})).then(res => {
					that.$store.dispatch('hideRedBag')
					if(res.data.code == 200) {
						window.clearTimeout(that.timer1)
						that.getMyInfo()
						that.$store.commit('updateBtnItemShow', -1)
						Toast(res.data.msg)
					} 
					// else {
					// 	pageUtil.resCode(res)
					// }
				})
	  		},
	  		exchange () {
	  			let that = this
		  		let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				Api.exchange(Qs.stringify({
					time: time,
					token: token,
					gold: this.changenum
				})).then(res => {
					if(res.data.code == 200) {
						window.clearTimeout(that.timer1)
						that.$store.dispatch('hideRedBag')
						that.getMyInfo()
						that.$store.commit('updateBtnItemShow', -1)
						Toast(res.data.msg)
					} else {
						pageUtil.resCode(res)
					}
				})
	  		},
	  		reward () {
	  			let that = this
		  		let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				Api.reward(Qs.stringify({
					time: time,
					token: token,
					bid: this.rewardBagInfo.bid
				})).then(res => {
					if(res.data.code == 200) {
						window.clearTimeout(that.timer1)
						that.$store.dispatch('hideRedBag')
						that.getMyInfo()
						that.$store.commit('updateBtnItemShow', -1)
						Toast(res.data.msg)
					} else {
						pageUtil.resCode(res)
					}
				})
	  		},
	  		hide () {
	  			if(this.btnItemShow == -1 || this.btnItemShow == 2 || this.btnItemShow == 4) {
	  				this.$store.commit('updateBtnItemShow', -1)
	  				this.$store.dispatch('hideRedBag')
	  			}
	  		},
	  		countDown(type) {
	  			let sec = 10
	  			let that = this
              	if(type == 1 || type == 3 || type == 5) {
              		for (let i = 0; i < 10; i++) {
	                  	that.timer1 = window.setTimeout(() => {
	                      	if(sec != 1) {	                  
		                        sec--
		                        that.sec = sec         
	                      	} else {   
	                      		sec = 10     
						  		if(type == 1) {
						  			that.sendRedBag()
						  		} else if(type == 3) {
						  			that.give()
						  		} else if(type == 5) {
						  			that.reward()
						  		}
	                      	}
	                  	}, i * 1000)
	              	}
              	}
	  		},
	  		getMyInfo() {
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
	  		} 
	  	},
	  	filters: {},
	  	computed: {
	  		btnItemShow () {
	  			return this.$store.state.btnItemShow
	  		},
	  		isShow () {
	  			return this.$store.state.redbagShow
	  		},
	  		currSession () {
	  			return this.$store.state.currSession
	  		},
	  		myInfo () {
		      	return this.$store.state.myInfo
		    },
		    bid () {
		    	return this.$store.state.jlRedBagInfo.bid
		    },
		    rewardBagInfo () {
		    	return this.$store.state.rewardRedBagInfo
		    },
		    rewardCount () {
		    	let list = this.$store.state.rewardRedBagInfo.list
		    	let count = 0
		    	for(let i in list) {
		    		count += list[i].gold
		    	}
		    	return count
		    },
		    userSelected () {
	          	return this.$store.state.userSelected
	        },
	        exNum () {
	        	return this.$store.state.exchangeNum
	        },
	        qid() {
	  			return this.$store.state.solitaireRedBagInfo.qid
	        }
	  	},
	  	created () {
	  		this.countDown(this.btnItemShow)
	  	},
	  	mounted () {},
	  	destroyed () {
	  		setTimeout(() => {
				this.$store.dispatch('updateUserGoldInfo')
			}, 1000)
	  	}
	}
</script>

<style lang="scss" scoped>
	@import '~@/assets/scss/const.scss';
	@import '~@/assets/scss/mixin.scss';
	
	.bag {
		position: fixed;
		top: 50%;
		left: 50%;
		width: 5.9rem;
		max-height: 4.39rem;
		padding: 0.2rem 0;
		margin-top: -2.195rem;
		margin-left: -2.95rem;
		background: rgba(255,255,255, 1);
		border-radius: 0.12rem;
		box-shadow: 0 0.01rem 0.12rem 0px rgba(0, 0, 0, 0.2);
		z-index: 1000;
		text-align: center;
		h3 {
			padding-bottom: 0.2rem;
			color: #592E12;
			span {
				display: inline-block;
			}
		}
		span {
			display: block;
		}
		ul {
			li {
				span {
					display: inline-block;
					padding: 0.06rem 0.2rem;
				}
			}
		}
		.countdown {
			display: inline-block;
		}
		input {
			border: 0;
			width: 100%;
			height: 0.88rem;
		    font-size: 0.28rem;
		    border-bottom: 1px solid #dadada;
			text-align: center;
		}
		input[type="password"] {
			border: 0;
		}
		.gift-num {
			display: inline-block;
			font-size: 0.32rem;
			color: #e5615d;
		}
		.bag-type {
			color: #592E12;
		}
		.bag-num {
			font-size: 0.56rem;
			margin: 0.1rem 0;
			color: #e5615d;
		}
		.type {
			margin-bottom: 0.3rem;
			padding: 0.25rem 0;
			border-top: 1px solid #dadada;
			border-bottom: 1px solid #dadada;
			position: relative;
			text-align: left;
			padding-left: 1.2rem;
			.ico-gold, .ico-silver {
				position: absolute;
				top: 0.18rem;
				left: 0.5rem;
				display: block;
				width: 0.55rem;
				height: 0.55rem;
				background-size: 100%;
			}
		}
		.btn {
			margin: 0 auto;
			width: 80%;
			height: 0.72rem;
			line-height: 0.72rem;
			border: 0;
			background-color: #e5615d;
			color: #fff;
		}
	}
</style>