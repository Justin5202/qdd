<!-- 标题栏组件 -->
<template>
	<div class="post">
		<top-bar txt="公告" returnShow="true"></top-bar>
		<div class="content">
			<div class="detail" v-model="detail">
				<div class="title">
					<p>{{ detail.title }}</p>
					<p class="time">
						<span>{{ detail.time }}</span>
					</p>
				</div>
				<div class="post-content">
					<p>{{ detail.content }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import TopBar from '@/components/common/top-bar/top-bar'
	import Qs from 'qs'
	import Api from '@/api/index'
	export default {
		components: {
			TopBar
		},
		data () {
			return {
				detail: '',
				id: this.$route.params.id
			}
		},
		props: {},
	  	watch: {},
	  	methods: {},
	  	filters: {},
	  	computed: {},
	  	created () {},
	  	mounted () {
	  		let that = this
		  	let time = Date.parse(new Date()) / 1000
			let str = time + this.$store.state.str
			let token = Api.encrypted(str, time)
			Api.getNewsDetail(Qs.stringify({
				time: time,
				token: token,
				id: this.id
			})).then(res => {
				if(res.data.code == 200) {
					that.detail = res.data.data
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
	.post {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: #f7f7f7;
	}

	.content {
		margin: 0.3rem;
		margin-top: 1.2rem;
		position: relative;
		.detail {
			background-color: #fff;
			padding: 0.29rem 0.35rem;
			box-shadow: 0 0.02rem 0.04rem 0 rgba(0,0,0,0.18);
			border-radius: 0.1rem;
			margin-bottom: 0.3rem;
		}
		.title {
			text-align: center;
			padding-bottom: 0.3rem;
			font-size: 0.35rem;
			border-bottom: 1px solid rgba(151,151,151,0.22);
		}
		.time {
			font-size: 0.24rem;
			color: rgba(62,62,62,0.40);	
			text-align: center;
		}
		.post-content {
			padding-top: 0.3rem;
		}
	}
</style>