<!-- 标题栏组件 -->
<template>
	<div class="history">
		<top-bar txt="记录" returnShow="true"></top-bar>
		<div class="content">
			<div class="userinfo">
				<span class="user-img">
					<img :src="avatar" alt="">
				</span>
				<span class="user-name">{{name}}</span>
				<!-- <span class="num"><span class="ico-gold"></span>总计：{{sum / 100}}</span> -->
			</div>
			<div class="clearfix">
				<!-- <span class="send fl">
					<span class="num">{{useGold}}</span>
					<span>发出金豆包</span>
				</span> -->
				<span class="get fr">
					<span class="num"><span class="ico-gold"></span>总计：{{sum / 100}}</span>
				</span>
			</div>
			<ul class="detail">
				<li class="clearfix" v-for="item in lists">
					<span class="icon-hb fl"></span>
					<span class="hb-info fl">
						<span class="hb-owner">{{item.remark}}</span>
						<span class="hb-time">{{item.time}}</span>
					</span>
					<span class="got-num out-color fr" v-if="item.status == 1">- {{item.gold / 100}}</span>
					<span class="got-num fr" v-else-if="item.status == 2">+	{{item.gold / 100}}</span>
				</li>
			</ul>
			<p v-if="lists.length == 0" class="get-more">对不起，暂没有相关数据！</p>
			<p v-if="lists.length != 0" class="get-more" @click="getMore">点击加载更多</p>
			<!-- 类型 -->
			<div class="type-box">
				<p @click="showType">{{ typeItem }}</p>
				<span class="icon-arrow_down"></span>
				<ul class="type-ul" v-show="typeShow">
					<li class="type" @click="getTypeReco(0, '全部')">全部</li>
					<li class="type" @click="getTypeReco(1, '红包')">红包</li>
					<li class="type" @click="getTypeReco(7, '分成')">分成</li>
					<li class="type" @click="getTypeReco(4, '充值')">充值</li>
					<li class="type" @click="getTypeReco(5, '赠送')">赠送</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import TopBar from '@/components/common/top-bar/top-bar'
	import Qs from 'qs'
	import Api from '@/api/index'
	import util from '@/utils/index'
	import pageUtil from '@/utils/page'

	export default {
		components: {
			TopBar
		},
		data () {
			return {
				proList: [],
				type: ['全部', '红包', '分成', '充值', '赠送'],
				typeShow: false,
				getGold: '',
				getSilver: '',
				useGold: '',
				useSilver: '',
				lists: [],
				page: 1,
				status: '',
				isPage: false,
				typeItem: '全部',
				sum:''
			}
		},
		props: {},
	  	watch: {},
	  	methods: {
	  		showType () {
	  			this.typeShow = !this.typeShow
	  		},
	  		getTypeReco (status, item) {
	  			let that = this
				let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				that.page = 1
				if(status != 0) {
					that.status = status
				} else {
					that.status = ''
				}
				that.typeItem = item
				that.typeShow = false
				Api.inOutReco(Qs.stringify({
						time: time,
						token: token,
						type: '',
						status: that.status,
						goldType: 1,
						page: 1
				})).then(res => {
					if(res.data.code == 200) {
						let data = res.data.data,
							list = data.list.data,
							lists = that.lists
						// if(that.status) {
						// 	lists = []
						// }
						lists = [] 
						for(let i in list) {
							lists.push(list[i])
						}
						that.getGold = data.get_gold
						that.useGold = data.use_gold
						that.sum = data.sum
						for(let i = 0; i< lists.length; i++) {
							lists[i].time = util.myFormatDate(lists[i].time)
						}
						that.lists = lists
					} else {
						that.lists = []
						pageUtil.resCode(res)
					}
				})
	  		},
	  		getMore () {
	  			this.page += 1
	  			let that = this
				let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				Api.inOutReco(Qs.stringify({
						time: time,
						token: token,
						type: '',
						status: that.status,
						goldType: 1,
						page: that.page
				})).then(res => {
					if(res.data.code == 200) {
						let data = res.data.data,
							list = data.list.data,
							lists = that.lists
						if(that.page == 1) {
							lists = []
						} 
						for(let i in list) {
							lists.push(list[i])
						}
						that.getGold = data.get_gold
						that.useGold = data.use_gold
						for(let i = 10 * (that.page - 1); i< lists.length; i++) {
							lists[i].time = util.myFormatDate(lists[i].time)
						}
						that.lists = lists
					} else {
						pageUtil.resCode(res)
					}
				})
	  		}
	  	},
	  	filters: {},
	  	computed: {
	  		avatar () {
	  			return this.$store.state.myInfo.header
	  		}, 
	  		name () {
	  			return this.$store.state.myInfo.nickname
	  		},
	  		gold () {
	  			return this.$store.state.myInfo.gold
	  		}
	  	},
	  	created () {},
	  	mounted () {
	  		let that = this
			let time = Date.parse(new Date()) / 1000
			let str = time + this.$store.state.str
			let token = Api.encrypted(str, time)
			Api.inOutReco(Qs.stringify({
					time: time,
					token: token,
					type: '',
					goldType: 1
			})).then(res => {
				if(res.data.code == 200) {
					let data = res.data.data,
						list = data.list.data,
						lists = []
					for(let i in list) {
						lists.push(list[i])
					}
					that.getGold = data.get_gold
					that.useGold = data.use_gold
					that.sum = data.sum
					for(let item in lists) {
	              		lists[item].time = util.myFormatDate(lists[item].time)
	              	}
					that.lists = lists
				} else {
					pageUtil.resCode(res)
				}
			})
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
	.history {
		position: fixed;
    	width: 100%;
    	height: 100%;
    	top: 0;
    	display: flex;
    	overflow: hidden;
    	background-color: #f7f7f7;
	}
	.content {
		flex: 1;
		-webkit-overflow-scrolling: touch;
		overflow-y: auto;
		overflow-x: hidden;
		background-color: #F7F6F4;
		box-shadow: 0 0.02rem 0.04rem 0 rgba(0,0,0,0.44);
		border-radius: 0.1rem;
		margin: 1.18rem 0.3rem 0.3rem 0.3rem;
		padding: 0.35rem 0.3rem 0 0.35rem;
		text-align: center;
		position: relative;
	}
	.userinfo {
		padding: 0.3rem 0;
	}
	span {
		display: block;
		color: #3e3e3e;
	}
	.user-img {
		margin: 0 auto;
		width: 2rem;
		height: 2rem;
		img {
			display: block;
			width: 100%;
			height: 100%;
			border-radius: 100%;
		}
	}
	.user-name {
		padding: 0.24rem 0;
	}
	.num {
		font-size: 0.36rem;
	}
	.ico-gold {
		display: inline-block;
		margin-right: 0.2rem;
		// vertical-align: middle;
	}
	.detail {
		margin: 0 -0.3rem;
		margin-top: 0.3rem;
		background-color: #fff;
		li {
			padding: 0.14rem 0.3rem;
			border-bottom: 1px solid #eaeaea;
			.icon-hb {
				margin-top: 0.13rem;
			}
			.hb-info {
				margin-left: 0.3rem;
				.hb-owner {
					font-size: 0.30rem;
					font-weight: bold;
				}
				.hb-time {
					text-align: left;
					font-size: 0.22rem;
					margin-top: 0.1rem;
				}
			}
			.out-color {
				color: #E5615D !important;
			}
			.got-num {
				font-size: 0.36rem;
				color: #87AD31;
				margin-top: 0.18rem;
			}
		}
	}
	.get-more {
		padding: 0.2rem 0;
		font-size: 0.32rem;
	}
	.type-box {
		position: absolute;
		right: 0.3rem;
		top: 0.3rem;
		color: #E6615D;
		font-size: 0.36rem;
		.icon-arrow_down {
			margin: 0 auto;
			display: block;
			width: 0.4rem;
			height: 0.4rem;
			background: url('../../../assets/icon/unfold.png') no-repeat;
			background-size: 100%;
		}
		.type-ul {
			.type {
				padding: 0.02rem 0;
			}
		}
	}
</style>