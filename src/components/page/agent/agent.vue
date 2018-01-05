<template>
	<div class="agent">
		<top-bar txt="代理查询" returnShow="true"></top-bar>
		<div class="content">
			<ul>
				<li><span>下属代理总数</span><span class="num">{{data.agency_count}}</span></li>
				<li><span>本周新增代理</span><span class="num">{{data.agency_add}}</span></li>
				<li><span>本周分润总额</span><span class="num">{{data.agency_income}}</span></li>
				<li><span>下属普通玩家</span><span class="num">{{data.user_count}}</span></li>
				<li><span>本周新增玩家</span><span class="num">{{data.user_add}}</span></li>
				<li><span>本周分润总额</span><span class="num">{{data.user_income}}</span></li>
			</ul>
		</div>
	</div>
</template>

<script>
	import TopBar from '@/components/common/top-bar/top-bar'
	import Qs from 'qs'
	import Api from '@/api/index'
	import {Toast, MessageBox} from 'mint-ui'
	import pageUtil from '@/utils/page'

	export default {
		components: {
			TopBar
		},
		data() {
			return {
				data: {}
			}
		},
		computed: {},
		methods: {
	  		getAgent() {
	  			let that = this
				let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				this.$store.dispatch('showLoading')
		  		Api.backCheck(Qs.stringify({
					time: time,
					token: token
				})).then(res => {
					this.$store.dispatch('hideLoading')
					if(res.data.code == 200) {
						that.data = res.data.data
					}
				})	
	  		}
		},
		created () {
			this.getAgent()
		},
	  	mounted () {}
	}
</script>

<style lang="scss" scoped>
	.agent {
		position: fixed;
	    width: 100%;
	    height: 100%;
	    top: 0;
	    background-color: #f7f7f7;
	    .content {
	    	height: 10.7rem;
		    margin: 1.2rem 0.3rem 0 0.3rem;
		    padding: 0.3rem;
		    background: #FFFFFF;
		    box-shadow: 0 0.02rem 0.04rem 0 rgba(0,0,0,0.18);
		    border-radius: 0.1rem;
		    ul li {
		    	float: left;
		    	width: 33.33%;
		    	text-align: center;
		    	span {
		    		display: block;
		    	}
		    	.num {
		    		font-size: 0.36rem;
		    		padding: 0.3rem 0;
		    		color: #E6615D;
		    	}
		    }
	    }
	}
</style>