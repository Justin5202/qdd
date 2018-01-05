<template>
	<div>
		<div class="clearfix" v-if="isIndex">
			<div class="user-info fl clearfix">
				<div class="user-img fl">
					<img :src="myInfo.header" alt="">
				</div>
				<div class="fl">
					<span class="name">昵称：{{ myInfo.nickname }}</span>
					<div class="my-coin clearfix" v-if="isIndex">
						<div class="gold-coin fl">
							<i class="ico-gold fl"></i>
							<span class="fl">{{ myInfo.gold / 100 }}</span>
						</div>
						<div class="silver-coin fl">
							<i class="ico-silver fl"></i>
							<span class="fl">{{ myInfo.silver / 100 }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 大喇叭 -->
		<div class="speaker" v-if="msgs.length != 0 && isShow && isIndex">
			<!-- <ul :class="{ message : speakerMsgs.length != 0 }"> -->
			<ul :style="{marginLeft}">
				<li v-for="item in msgs">
					<span class="icon-speaker"></span>{{ item.fromNick }}：{{ item.text }}</li>
			</ul>
		</div>
		<swipe class="my-swipe" v-if="!isIndex">
			<swipe-item class="slide1" v-for="(item, index) in banners" :key="index">
				<img :src="item.img" alt="">
			</swipe-item>
		</swipe>
	</div>
</template>

<script>
	import { Swipe, SwipeItem } from 'vue-swipe'
	import Qs from 'qs'
	import Api from '@/api/index'
	import pageUtil from '@/utils/page'
	
	export default {
		components: {
			Swipe,
			SwipeItem
		},
		beforeMount () {
			// let that = this
			// Api.getBanner().then(function (res) {
	  //   		if(res.data.code == 200) {
	  //   			that.banners = res.data.data
	  //   		}
	  // 		}).catch(function (error) {
	  //   		console.log(error);
	  // 		})
		},
		data() {
			return {
				banners: '',
				activeIndex: 0,
				isShow: true,
				msgs: ''
			}
		},
		props: {
			isIndex: true
		},
		watch: {
			msgs: 'timer'
		},
		methods: {
			timer () {
				this.isShow = true
				setInterval(() => {
		    		if(this.activeIndex < this.msgs.length  * 100) {
		    			this.activeIndex +=1
		    		} else {
		    			this.isShow = false
		    			this.activeIndex = 0
		    		}
		    	}, 150)
			}
		},
		mounted() {},
		computed: {
			speakerMsgs () {
		    	return this.$store.state.bigSpeakerMsgs
		    },
		    marginLeft () {
		    	return 100 - this.activeIndex + '%'
		    },
		    msglist () {
		      	let msgs = this.$store.state.currChatroomMsgs
		      	if(msgs.length > 3) {
		      		this.msgs = msgs.splice(msgs.length - 3)
		      	} else {
		      		this.msgs = msgs
		      	}
		      	console.log(this.$store.state.currChatroomMsgs)
		      	return msgs
		    },
		    myInfo () {
	  			return this.$store.state.myInfo
	  		}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~@/assets/scss/const.scss';
	@import '~@/assets/scss/mixin.scss';
	.my-coin {
		padding-left: 0.25rem;
		padding-top: 0.05rem;
		.gold-coin {
			margin-right: 0.2rem;
		}
		i {
			margin-right: 0.1rem;
		}
		span {
			color: #fff;
			line-height: 0.44rem;
		}
	}
	.my-swipe {
		margin-top: 0.28rem;
		width: 100%;
	  	height: 3rem;
	  	background-color: #fff;
	  	position: relative;
	  	.slide1{
	  		position: absolute;
	  		top: 0;
	  		left: 0;
	  		width: 100%;
	  		height: 3rem;
	  		img {
	  			width: 100%;
	  			height: 100%;
	  		}
	  	}
	}
	.user-info {
		width: 100%;
		padding: 0.2rem 0;
		.user-img {
			width: 0.8rem;
			height: 0.8rem;
			img {
				width: 100%;
				height: 100%;
				border-radius: 100%;
			}
		}
		.name {
			display: block;
			// max-width: 74%;
			// text-overflow: ellipsis;
			// white-space: nowrap;
			// overflow: hidden;
			margin-left: 0.2rem;
			// line-height: 0.7rem;
			color: #fff;
		}
	}
</style>