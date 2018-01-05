<!-- 标题栏组件 -->
<template>
	<div v-show="isShow">
		<div class="mask" @click="hide"></div>
		<transition
			enter-active-class="zoomIn" leave-active-class="zoomOut">
			<div class="bag" 
				v-if="isShow">
				<h2>发喇叭</h2>
				<!-- <span class="bag-type">发送喇叭</span> -->
				<input 
					type="text" 
					name="num" 
					placeholder="请输入喇叭消息" 
					v-model="value">
				<span class="type" v-if="speakerType == 1">
					<i class="icon-speaker"></i>
					大喇叭
				</span>
				<span class="type" v-else-if="speakerType == 2">
					<i class="icon-speaker"></i>
					小喇叭
				</span>
				<span class="btn" @click="sendSpeaker(speakerType)">确定</span>
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
				value: ''
			}
		},
		props: {
		    type: String,
		    scene: String,
		    to: String,
		    speakerType: ''
		},
	  	watch: {},
	  	methods: {
	  		sendSpeaker (type) {
	  			let that = this
				let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				if(this.value != '') {
					this.$store.dispatch('showLoading')
					Api.getSpeaker(
						Qs.stringify({
							time: time,
							token: token,
							type: type
					})).then(function (res) {
						that.$store.dispatch('hideLoading')
		    			if(res.data.code == 200) {
		    				if(type == 1) {
		    					that.$store.dispatch('sendChatroomMsg', {
					            	type: 'text',
					            	text: that.value
					          	})
		    				}
		    			} else {
		    				pageUtil.resCode(res)
		    			}
		  			})
		  			.catch(function (error) {
		  				alert(error)
		    			console.log(error);
		  			})
				} else {
					Toast('内容不能为空')
				}
		        this.$store.commit('updateSpeakerShow', false)
	  		},
	  		hide () {
	  			this.$store.commit('updateSpeakerShow', false)
	  		} 
	  	},
	  	filters: {},
	  	computed: {
	  		isShow () {
	  			return this.$store.state.speakerShow
	  		} 
	  	},
	  	created () {},
	  	mounted () {
	  	},
	  	destroyed () {}
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
		z-index: 9999;
		text-align: center;
		h2 {
			padding-bottom: 0.36rem;
			color: #592E12;
		}
		span {
			display: block;
		}
		input {
			border: 0;
			width: 80%;
			text-align: center;
		}
		.bag-type {
			color: #592E12;
		}
		.bag-num {
			margin-top: 0.1rem;
			margin-bottom: 0.3rem;
			color: #e5615d;
		}
		.type {
			margin-bottom: 0.3rem;
			padding: 0.17rem 0;
			border-top: 1px solid #dadada;
			border-bottom: 1px solid #dadada;
			position: relative;
			text-align: left;
			padding-left: 1.2rem;
			.icon-speaker {
				position: absolute;
				top: 0.14rem;
				left: 0.5rem;
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