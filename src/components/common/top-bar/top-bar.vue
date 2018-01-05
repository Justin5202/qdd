<!-- 标题栏组件 -->
<template>
	<div class="top-bar" id="header">
		<div class="top-bar-box">
			<i class="icon-arrow_left" v-show="returnShow" @click="back"></i>
			<h1>{{ txt }}</h1>
			<i class="icon-add" v-show="addShow" @click="add"></i>
		</div>
		<div class="mask" v-show="nowIndex != 0" @click="hide"></div>
		<div v-if="nowIndex == -1">
			<div class="hide-menu">
				<ul>
					<li v-if="!isFriend" v-for="(item, index) in tabHideTitle" @click="toggleHideTabs(index)" v-bind:class="{active:index == nowIndex}">
						<img :src="item.ico" class="menu-icon fl">
						<span>{{item.txt}}</span>
					</li>
					<li v-if="isFriend" class="btn li-item" @click="addFriend">
						<img src="../../../assets/icon/addFriend.png" height="66" width="66" class="menu-icon fl">
						<span>添加好友</span>
					</li>
					<input type="text" id="copyText" class="copy-text" value="您的好友邀请您一起游戏，下载地址：http://api.17qdd.cn/Marketing/index/download">
					<li v-if="!isFriend" @click="copy" class="btn li-item">
						<img src="../../../assets/icon/share.png" class="menu-icon fl">
						<span>分享app</span>
					</li>
				</ul>
			</div>
		</div>
		<transition
			enter-active-class="zoomIn" leave-active-class="zoomOut">
			<div class="task" v-if="nowIndex === 2">
				<ul class="title clearfix">
					<li v-for="(item, index) in tabTask" 
						@click="toggleTaskTabs(index)" 
						v-bind:class="{active:index == nowIndex1}" 
						class="title-item fl">{{item}}</li>
				</ul>
				<ul class="task-content">
					<li v-for="(item, index) in taskList">
						<span>{{ index+1 }}</span>
						<span>{{ item.name }}</span>
						<span class="reward-type" v-if="item.end == 0 && item.gold_type == 1">奖励金豆{{ item.next_gold / 100 }}</span>
						<span class="reward-type" v-else-if="item.end == 0 && item.gold_type == 2">奖励银豆{{ item.next_gold / 100 }}</span>
						<span class="reward-type" v-else-if="item.end == 1">已经全部完成</span>
						<span class="reward-type" v-else></span>
						<span class="btn disabled" v-if="item.end == 1">已完成</span>
						<button 
							class="btn"
							v-else-if="item.is_get == 1"
							@click.prevent="getReward(item.id)">领取</button>
						<span class="btn disabled last-span small-font" v-else-if="item.is_get == 0 && item.class == 5">{{ ((item.finish_number / 60 + '').indexOf('.') != -1) ? (item.finish_number / 60).toFixed(1) : item.finish_number / 60 }}/{{ ((item.next_number / 60 + '').indexOf('.') != -1) ? (item.next_number / 60).toFixed(1) : item.next_number / 60 }}</span>
						<span class="btn disabled last-span" v-else-if="item.is_get == 0 && item.next_number % 1000 == 0">{{ item.finish_number }}/{{ (item.next_number / 1000) }}k</span>
						<span class="btn disabled last-span" v-else-if="item.is_get == 0">{{ item.finish_number }}/{{ item.next_number }}</span>
					</li>
				</ul>
			</div>
		</transition>
		<transition
			enter-active-class="zoomIn" leave-active-class="zoomOut">
			<div class="rank" v-if="nowIndex === 3">
				<ul class="title clearfix">
					<li v-for="(item, index) in tabRank" @click="toggleRankTabs(index)" v-bind:class="{active:index == nowIndex1}" class="title-item fl">{{item}}</li>
				</ul>
				<ul>
					<li v-for="(item, index) in rankList">
						<span class="rank-num">{{ index+1 }}</span>
						<img :src="item.header" alt="">
						<span class="name">{{ item.nickname }}</span>
						<span class="gold" v-if="nowIndex1 == 0">金豆</span>
						<span class="gold" v-else-if="nowIndex1 == 1">点赞</span>
						<span class="gold" v-else-if="nowIndex1 == 2">发包</span>
						<span class="gold-num" v-if="nowIndex1 == 0">{{ item.gold / 100 }}</span>
						<span class="gold-num" v-else-if="nowIndex1 == 1">{{ item.praise }}</span>
						<span class="gold-num" v-else-if="nowIndex1 == 2">{{ item.use_gold_number }}</span>
					</li>
				</ul>
			</div>
		</transition>
	</div>
</template>

<script> 
	import Vue from 'vue'
	import Qs from 'qs'
	import Api from '@/api/index'
	import { Indicator, Toast } from 'mint-ui'
	import pageUtil from '@/utils/page'

	export default {
		components: {},
		data () {
			return {
				maskShow: false,
				tabTask: ['新手任务', '每日任务', '成就任务'],
				tabRank: ['土豪榜', '人气榜', '达人榜'],
				tabHideTitle: [
					{
			          	ico: require('../../../assets/icon/icon_gg.png'),
			          	txt: '公告'
			        },
			        {
			          	ico: require('../../../assets/icon/icon_tj.png'),
			          	txt: '创建房间'
			        },
			        {
			          	ico: require('../../../assets/icon/icon_rw.png'),
			          	txt: '任务'
			        },
			        {
			          	ico: require('../../../assets/icon/icon_phb.png'),
			          	txt: '排行榜'
			        },
			        {
			          	ico: require('../../../assets/icon/icon_kf.png'),
			          	txt: '客服'
			        }
				],
				nowIndex: 0,
				nowIndex1: 0,
				rankList: [],
				taskList: []
			}
		},
		props: {
			txt: {
				type: String,
				default: '抢豆豆'
			},
			returnShow: false,
			addShow: false,
			isFriend: {
				type: Boolean,
				default: false
			}
		},
	  	watch: {},
	  	methods: {
	  		back() {
	  			window.history.go(-1)
	  		},
	  		add() {
	  			this.nowIndex = -1
	  		},
	  		hide() {
	  			this.nowIndex = 0
	  			this.maskShow = !this.maskShow
	  		},
	  		toggleHideTabs(index) {
	  			let that = this
	  			if(index == 0) {
	  				that.$router.push({path: '/post'})
	  			} else if(index == 1) {
	  				that.$router.push({path: '/createroom'})
	  				this.nowIndex = 0
	  			} else {
	  				this.isShow = !this.isShow
	  				this.nowIndex = index
	  			}
	  			if(index == 2) {
	  				let time = Date.parse(new Date()) / 1000
					let str = time + this.$store.state.str
					let token = Api.encrypted(str, time)
					Api.getTask(Qs.stringify({
							time: time,
							token: token,
							type: 1
					})).then(res => {
						if(res.data.code == 200) {
							that.taskList = res.data.data
						}
					})
	  			} else if(index == 3) {
					let time = Date.parse(new Date()) / 1000
					let str = time + this.$store.state.str
					let token = Api.encrypted(str, time)
					Api.getRank(Qs.stringify({
							time: time,
							token: token,
							type: 1
					})).then(res => {
						if(res.data.code == 200) {
							that.rankList = res.data.data
						}
					})
			  	} else if(index == 4) {
			  		that.$router.push({path: '/service'})
			  	}
			},
	  		toggleTaskTabs(index) {
	  			let that = this
	  			let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
	  			this.nowIndex1 = index
	  			Api.getTask(Qs.stringify({
						time: time,
						token: token,
						type: index + 1
				})).then(res => {
					that.taskList = res.data.data
					if(res.data.code != 200) {
						Toast({
	                    	message: res.data.msg
	                	})
					}
				})
	  		},
	  		toggleRankTabs(index) {
	  			let that = this
	  			let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
	  			this.nowIndex1 = index
	  			Api.getRank(Qs.stringify({
						time: time,
						token: token,
						type: index + 1
				})).then(res => {
					that.rankList = res.data.data
					if(res.data.code > 200) {
						Toast({
	                    	message: res.data.msg
	                	})
					}
				})
	  		},
	  		getReward (id) {
	  			let that = this
	  			let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
	  			Api.getReward(Qs.stringify({
						time: time,
						token: token,
						tid: id
				})).then(res => {
					if(res.data.code == 200) {
						that.toggleTaskTabs(this.nowIndex1)
						Toast({
	                    	message: res.data.msg
	                	})
					} else {
						pageUtil.resCode(res)
					}
				})
	  		},
	  		copy () {
	  			var url = document.getElementById("copyText");
    			url.select();
    			document.execCommand("copy");
    			Toast("复制成功！")
	  		},
	  		addFriend() {
	  			this.$router.push({path: '/search/1'})
	  		}
	  	},
	  	filters: {},
	  	computed: {},
	  	created () {},
	  	mounted () {
	  		mui.back = function() {
            	this.nowIndex = 0
	        }
	  	},
	  	destroyed () {}
	}
</script>

<style lang="scss" scoped>
	@import '~@/assets/scss/const.scss';
	@import '~@/assets/scss/mixin.scss';
	
	.top-bar {
		position: fixed;
		top: 0;
		width: 100%;
		height: 0.88rem;
		line-height: 0.88rem;
		text-align: center;
		font-size: 0.36rem;
		background-color: #fff;
		z-index: 22;
		.mask {
			top: 0.88rem;
		}
		.top-bar-box {
			padding: 0 0.24rem;
			.icon-arrow_left, .icon-add{
			    position: fixed;
			    top: 0;
			    margin: 0.25rem 0.3rem;
			}
			.icon-arrow_left {
				left: 0;
			}
			.icon-add {
				right: 0;
			}
			h1 {
				max-width: 80%;
				display: inline-block;
			    line-height: 0.88rem;
			    font-size: 0.36rem;
			    color: #000;
			    font-weight: normal;
			    text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}
		}
	}
	.hide-menu {
			position: absolute;
			top: 0.88rem;
			right: 0;
			z-index: 1000;
			background-color: #fff;
			li, .li-item {
				padding: 0 0.35rem;
				height: 0.65rem;
				line-height: 0.65rem;
				font-size: 0.28rem;
				border-bottom: 1px solid #efefef;
			}
			.copy-text {
				position: absolute;
				bottom: 0;
				right: -2.37rem;
				width: 2.37rem;
				height: 0.65rem;
				opacity: 1;
			}
			.li-item {
				width: 1.67rem;
				border: 0; 
				padding: 0 0.35rem;
				border-radius: 0;
				color: #3e3e3e;
			}
			.active {
				color: #fff;
				background-color: #E6615D;
			}
			.menu-icon {
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
	.task, .rank {
		position: fixed;
		top: 24%;
		left: 50%;
		width: 6.7rem;
		margin-left: -3.35rem;
		padding-bottom: 0.2rem;
		background-color: #fff;
		box-shadow: 0 0.02rem 0.04rem 0 rgba(0,0,0,0.44);
		border-radius: 0.1rem;
		font-size: 0.28rem;
		z-index: 1000;
		.title {
			text-align: center;
			line-height: 0.88rem;
			.title-item {
				width: 50%;
				color: rgba(43,43,43,0.61);
				border-bottom: 1px solid #f5f5f5;
			}
			.active {
				color: #2b2b2b;
				border-bottom-color: #E5615D;
			}	
		}
		.multi {
			margin-top: 0.2rem;
			ul {
				li {
					margin: 0.2rem 0.46rem;
					float: left;
					width: 1.29rem;
					height: 0.62rem;
					line-height: 0.62rem;
					border: 1px solid #E5615D;
					border-radius: 0.08rem;
					color: #E5615D;
					h3 {
						font-size: 0.38rem;
					}
					small {
						font-size: 0.2rem;
					}
				}
				.active {
					border: 0;
					background-color: #E5615D;
					color: #fff;
				}
			}
		}
	}
	.task {
		.title {
			.title-item {
				width: 33.333%;
			}
		}
		.task-content {
			li {
				span:nth-child(2) {
					display: inline-block;
					width: 34%;
				}
				.reward-type {
					display: inline-block;
					width: 29%;
					color: #E5615D;
				}
				.last-span {
					display: inline-block;
					color: #E5615D;
				}
				.disabled {
					display: inline-block;
					color: #6f6f6f;
					border-color: #bbbbbb;
				}
				.small-font {
					font-size: 0.24rem;
				}
			}
		}
	}
	.rank {
		top: 12%;
		.title {
			.title-item {
				width: 33.333%;
			}
		}
		ul li {
			height: 0.88rem;
			span {
				display: inline-block;
				line-height: 0.7rem;
				vertical-align: 35%;
				font-size: 0.24rem;
			}
			.name {
				line-height: 0.4rem;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
				width: 22%;
			}
			.gold {
				width: 26%;
			}
			.rank-num {
				min-width: 0.26rem;
			}
			.gold-num {
				min-width: 1.17rem;
			}
			img{
				margin: 0 0.3rem;
				display: inline-block;
				width: 0.7rem;
				height: 0.7rem;
				border-radius: 100%;
				margin-top: 0.2rem;
			}
		}
	}
</style>