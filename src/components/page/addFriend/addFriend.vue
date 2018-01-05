<template>
	<div class="add-friend">
		<top-bar txt="搜索" returnShow="true"></top-bar>
		<div class="content">
			<div class="search">
				<input type="num" ref="input" class="search-friend" v-if="from == 1" v-model="id" placeholder="输入好友ID">
				<input type="num" ref="input" class="search-friend" v-else-if="from == 2" v-model="roomId" placeholder="请输入房号">
			</div>
			<button class="btn big-btn" v-if="from == 1" @click="getUserInfo">搜索</button>
			<button class="btn big-btn" v-else-if="from == 2" @click="enterRoom">加入房间</button>
			<div class="result">
				<ul>
					<li class="clearfix" v-if="friend !== ''">
						<span class="left">
							<img :src="friend.header" @click="showNameCard(friend)">
						</span>
						<span class="right">
							<span class="name">{{ friend.nickname }}
								</span>
						</span>
						<button class="btn fr" :class="{blur:isAdded}" @click="addFriend(friend.id)">{{txt}}</button>
					</li>
				</ul>
			</div>
			<name-card></name-card>
		</div>
	</div>
</template>

<script>
	import TopBar from '@/components/common/top-bar/top-bar'
	import NameCard from '@/components/common/nameCard/nameCard'
	import Qs from 'qs'
	import Api from '@/api/index'
	import {Toast} from 'mint-ui'
	import pageUtil from '@/utils/page'
	import util from '@/utils'

	export default {
		components: {
			TopBar,
			NameCard
		},
		data() {
			return {
				id: '',
				roomId: '',
				friend: '',
				txt: '添加',
				isAdded: false
			}
		},
		computed: {
			from () {
				return this.$route.params.from
			}
		},
		methods: {
			getUserInfo () {
		        let that = this
		        let time = Date.parse(new Date()) / 1000
		        let str = time + this.$store.state.str
		        let token = Api.encrypted(str, time)
		        this.$store.dispatch('showLoading')
		        Api.getFriendInfo(
		            	Qs.stringify({
			              	time: time,
			              	token: token,
			              	uid: this.id
		        })).then(function (res) {
		            that.$store.dispatch('hideLoading')
		            if(res.data.code == 200) {
		              	that.friend = res.data.data
		              	that.txt = '已添加'
		              	that.isAdded = true
		              	that.$store.commit('updateIsFriend', false)
		            } else if(res.data.code == 201) {
		            	that.friend = res.data.data
		            	that.txt = '添加'
		              	that.isAdded = false
		              	that.$store.commit('updateIsFriend', true)
		            }
		        }).catch(function (error) {
		            console.log(error);
		        })
		    },
		    showNameCard (item) {
	  			this.$store.commit('updateUserSelected', item)
                this.$store.commit('updateNameCardShow', true)
	  		},
	  		addFriend (id) {
		      	if(!this.isAdded) {
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
							that.txt = '已添加'
		              		that.isAdded = true
							Toast(res.data.msg)
						} else {
							pageUtil.resCode(res)
						}
					})
		      	}
		    },
		    enterRoom() {
				let that = this
				let time = Date.parse(new Date()) / 1000
				let str = time + this.$store.state.str
				let token = Api.encrypted(str, time)
				this.$store.dispatch('showLoading')
				Api.enterRoom(
					Qs.stringify({
						time: time,
						token: token,
						rid: that.roomId
				})).then(function (res) {
					that.$store.dispatch('hideLoading')
	    			if(res.data.code == 200) {
	    				let item = res.data.data
	    				that.$store.commit('updateCurrSession', item)
        				that.$router.push({path: '/chat/team-' + item.imtid})
	    			} else {
	    				pageUtil.resCode(res)
	    			}
	  			})
	  			.catch(function (error) {
	    			console.log(error);
	  			})
			}
		},
		created() {},
		mounted() {
			this.$refs.input.focus()
			mui.back = function() {
            	history.go(-1)
	        }
		}
	}
</script>

<style scoped lang="scss">
	@import '~@/assets/scss/const.scss';
	@import '~@/assets/scss/mixin.scss';
	
	.add-friend {
		position: fixed;
	    width: 100%;
	    height: 100%;
	    top: 0;
	    background-color: #f7f7f7;
	}
	.content {
		height: 10.7rem;
	    margin: 1.2rem 0.3rem 0 0.3rem;
	    padding: 0.3rem;
	    background: #FFFFFF;
	    box-shadow: 0 0.02rem 0.04rem 0 rgba(0,0,0,0.18);
	    border-radius: 0.1rem;
	    .result {
	    	margin-top: 0.3rem;
	    }
	    li {
			display: flex;
			padding: 0.14rem 0;
			border-bottom: 1px solid #efefef;
			img {
				display: inline-block;
				width: 0.7rem;
				height: 0.7rem;
				border-radius: 100%;
			}
			.name {
				display: inline-block;
				line-height: 0.8rem;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}
			input {
				width: 0.35rem;
				height: 0.35rem;
				margin-top: 0.28rem;
			}
			.left {
				-webkit-box-flex: 0;
			    -ms-flex: 0 0 0.6rem;
			    flex: 0 0 0.6rem;
			}
			.right {
				max-width: 67%;
				display: flex;
				flex: 1;
				margin-left: 0.3rem;
			}
			.btn {
				margin-top: 0.14rem;
				background-color: #E5615D;
				border: 0;
				color: #fff;
			}
			.blur {
				background-color: #d8d8d8;
			}
			.unread {
				margin-top: 0.28rem;
			}
		}
	}

	.search {
		display: flex;
		margin-bottom: 0.2rem;
		.search-friend {
			width: 100%;
			height: 0.88rem;
			outline: 0;
			flex: 1;
			font-size: 0.28rem;
			padding: 0 0.2rem; 
			border: 0;
			border-bottom: 1px solid rgba(151,151,151,0.22);
		}
	}
</style>