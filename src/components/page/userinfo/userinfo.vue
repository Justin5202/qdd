<template>
	<div class="user-info">
		<top-bar txt="详细资料" returnShow="true"></top-bar>
		<div class="content" v-if="userInfo.data">
			<div class="info-item">
				<div class="info-img">
					<img :src="userInfo.data.header" alt="">
				</div>
				<div class="info-more">
					<p v-if="userInfo.data.remark">{{userInfo.data.remark}}（{{userInfo.data.nickname}}）</p>
					<p v-else>{{userInfo.data.nickname}}</p>
					<div class="zan">
						<span class="info-id">ID：{{ userInfo.data.fuid }}</span>
						<span class="info-z">
							<i class="icon-z" @click="addPraise(userInfo.data.fuid)"></i>{{ userInfo.data.praise }}
						</span>
					</div>
				</div>
			</div>
			<div class="info-btn">
				<button class="btn big-btn" v-if="userInfo.code === 201" @click="addFriend(userInfo.data.fuid)">添加好友</button>
				<div v-else>
					<button class="btn big-btn" @click="friendRemark(userInfo.data.fuid)">设置备注</button>
					<button class="btn big-btn" @click="enterChat(userInfo.data)">发消息</button>
					<button class="btn big-btn" @click="gift(userInfo.data)">赠送金豆</button>
					<button class="btn big-btn" @click="deleteFriend(userInfo.data.fuid)">删除好友</button>
				</div>
			</div>
		</div>
		<sendredbag></sendredbag>
	</div>
</template>

<script>
	import TopBar from '@/components/common/top-bar/top-bar'
	import Qs from 'qs'
	import Api from '@/api/index'
	import {Toast, MessageBox} from 'mint-ui'
	import pageUtil from '@/utils/page'
	import Sendredbag  from '@/components/common/sendRedBag/sendRedBag'

	export default {
		beforeMount () {
			this.getUserInfo()
		},
		components: {
			TopBar,
			Sendredbag
		},
		data() {
			return {
				userInfo: {},
				title: '备注信息'
			}
		},
		computed: {
			uid () {
				return this.$route.params.uid
			}
		},
		methods: {
			addFriend (id) {
		      	let that = this
		  		let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				this.$store.dispatch('showLoading')
				Api.addFriend(Qs.stringify({
					time: time,
					token: token,
					fuid: id
				})).then(res => {
					this.$store.dispatch('hideLoading')
					if(res.data.code == 200) {
						Toast(res.data.msg)
					} else {
						pageUtil.resCode(res)
					}
				})
		    },
		    deleteFriend (id) {
		      	let that = this
		  		let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				MessageBox.confirm('是否删除好友？').then(action => {
              		that.$store.dispatch('showLoading')
					Api.deleteFriend(Qs.stringify({
						time: time,
						token: token,
						fuid: id
					})).then(res => {
						that.$store.dispatch('hideLoading')
						if(res.data.code == 200) {
							Toast(res.data.msg)
							that.getUserInfo()
						} else {
							pageUtil.resCode(res)
						}
					})
          		})
		    },
		    gift (item) {
		    	this.isShow = true
		    	this.$store.commit('updateBtnItemShow', 2)
		    	this.$store.commit('updateUserSelected', item)
		    	this.$store.dispatch('showRedBag')
		    },
		    enterChat (session) {
      			if (session && session.acid)
      				this.$store.commit('updateCurrP2pSession', session)
      				this.$router.push({path: '/p2pchat/p2p-' + session.acid})
		    },
	  		addPraise(id) {
	  			let that = this
		  		let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				this.$store.dispatch('showLoading')
				Api.addPraise(Qs.stringify({
					time: time,
					token: token,
					fuid: id
				})).then(res => {
					this.$store.dispatch('hideLoading')
					if(res.data.code == 200) {
						that.userInfo.data.praise += 1
						Toast(res.data.msg)
					} else {
						pageUtil.resCode(res)
					}
				})
	  		},
	  		getUserInfo() {
	  			let that = this
				let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				this.$store.dispatch('showLoading')
		  		Api.getFriendInfo(Qs.stringify({
						time: time,
						token: token,
						uid: that.uid,
						acid: that.uid
				})).then(res => {
					this.$store.dispatch('hideLoading')
					if(res.data.code == 200 || res.data.code == 201) {
						that.userInfo = res.data
					}
				})	
	  		},
	  		friendRemark(id) {
	  			this.$router.push({path: `/modify/${this.title}/${id}`})
	  		}
		},
		created () {},
	  	mounted () {}
	}
</script>

<style lang="scss" scoped>
	.user-info {
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
	    }
	    .info-item {
	    	display: flex;
	    	padding-bottom: 0.2rem;
	    	border-bottom: 1px solid #eaeaea;
	    	.info-img {
	    		flex: 0 0 1.3rem;
	    		width: 1.3rem;
	    		height: 1.3rem;
	    		padding-right: 0.2rem;
	    		img {
	    			width: 100%;
	    			height: 100%;
	    		}
	    	}
	    	.info-more {
	    		display: flex;
	    		flex: 1;
	    		flex-direction: column;
		    	justify-content: space-around;
		    	p {
					font-size: 0.32rem;
		    	}
	    		.zan {
	    			display: flex;
	    			.info-z {
	    				padding: 0 0.2rem;
	    				.icon-z {
	    					margin-right: 0.2rem;
	    				}
	    			}
	    		}
	    	}
	    }
	    .btn {
	    	margin-top: 0.3rem;
	    }
	}
</style>