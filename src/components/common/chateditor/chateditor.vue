<!-- 标题栏组件 -->
<template>
	<div class="chat-editor">
		<div class="chat-main" 
      		v-bind:scene="scene"
      		v-bind:to="to">
      		<div class="clearfix">
      			<span class="msg-icon"></span>
				<span class="u-editor-input">
			        <textarea v-model="msgToSent"></textarea>
			    </span>
			    <span class="u-editor-icon fl" @click.stop="showEmoji"></span>
		      	<span v-if="addShow">
		      		<span class="icon-botadd"
		      		:class="{ rotate : typeShow }" 
		      		v-show="!msgToSent"
		      		@click="showSendType"></span>
		      		<span class="send-btn" v-show="msgToSent" @click="sendTextMsg">发送</span>
		      	</span>
		      	<span class="send-btn" v-else @click="sendTextMsg">发送</span>
      		</div>
	      	<send-type
	      		v-bind:type="type"
		      	v-bind:scene="scene"
		      	v-bind:to="to"
		      	v-bind:goldType="goldType"
		      	v-bind:id="id"
		      	v-bind:number="number"
		      	v-bind:goldNum="goldNum"
	      	 	v-if="typeShow"></send-type>
	      	<chat-emoji
		      	v-bind:type="type"
		      	v-bind:scene="scene"
		      	v-bind:to="to"
		      	v-show="isEmojiShow"
		      	v-on:add-emoji="addEmoji"
		      	v-on:hide-emoji="hideEmoji"
		    ></chat-emoji>
		</div>
	</div>
</template>

<script>
	import sendType from '@/components/common/sendType/sendType'
	import ChatEmoji from '../ChatEmoji/ChatEmoji'
	import Qs from 'qs'
	import Api from '@/api/index'
	import { Toast } from 'mint-ui'

	export default {
		components: {
			sendType,
			ChatEmoji
		},
		data () {
			return {
				msgToSent: ''
			}
		},
		props: {
			scene: String,
			to: String,
			type: String,
			goldType: Number,
			id: Number,
			number: Number,
			goldNum: Number,
			addShow: true
		},
	  	watch: {},
	  	methods: {
	  		sendTextMsg () {
		      	if(!this.isMute) {
		      		if (/^\s*$/.test(this.msgToSent)) {
				        Toast('发送内容不能为空')
				        return
				    } else if (this.msgToSent.length > 800) {
				    	Toast('请不要超过800个字')
				        return
				    } else {
				      	this.msgToSent = this.msgToSent.trim()
				      	this.$store.dispatch('sendMsg', {
				            type: 'text',
				            scene: this.scene,
				            to: this.to,
				            text: this.msgToSent
				        })
			      	}
		      	} else {
		      		Toast('你已经被管理员禁言')
		      	}
		      	this.msgToSent = ''
		      	if(this.scene !== 'p2p') {
		      		let that = this
		  			let time = Date.parse(new Date()) / 1000
					let str = time + this.$store.state.str
					let token = Api.encrypted(str, time)
		  			Api.roomSpeak(Qs.stringify({
							time: time,
							token: token,
							rid: this.to
					})).then(res => {})
		      	}
		    },
		    showSendType () {
		    	this.$store.commit('updateTool', !this.typeShow)
		    	this.isRotate = !this.isRotate
		    	this.$store.commit('updateEmoji', false)
		    },
		    showEmoji () {
		    	this.$store.commit('updateEmoji', !this.isEmojiShow)
    		},
		    hideEmoji () {
		      	this.$store.commit('updateEmoji', false)
		    },
		    addEmoji (emojiName) {
		      	this.msgToSent += emojiName
		      	this.hideEmoji()
		    }
	  	},
	  	filters: {},
	  	computed: {
	  		typeShow () {
	  			return this.$store.state.ToolShow
	  		},
	  		isEmojiShow () {
	  			return this.$store.state.emojiShow
	  		},
	  		myInfo () {
	  			return this.$store.state.myInfo
	  		},
	  		muteMembers () {
	  			return this.$store.state.muteMembers
	  		},
	  		isMute () {
	  			let lists = this.muteMembers
	  			let mute = false
	  			for(let i in lists) {
	  				if(this.myInfo.acid == lists[i].account) {	  						
	  					mute = true
	  				}
	  			}
	  			return mute
	  		}
	  	},
	  	created () {},
	  	mounted () {
	  	},
	  	destroyed () {
	  		this.$store.commit('updateTool', false)
	  		this.$store.commit('updateEmoji', false)
	  	}
	}
</script>

<style lang="scss" scoped>
	@import '~@/assets/scss/const.scss';
	@import '~@/assets/scss/mixin.scss';
	
	.chat-editor {
		position: fixed;
    	width: 100%;
		min-height: 0.88rem;
    	bottom: 0;
    	background-color: #fff;
    	.chat-main {
    		height: 100%;
    	}
	}
	.msg-icon, .u-editor-icon, .icon-botadd {
		margin-left: 0.06rem;
		margin-top: 0.1rem;
		float: left;
		display: block;
		width: 0.66rem;
		height: 0.66rem;
		background: url('../../../assets/icon/icon_msg.png') no-repeat;
		background-size: 100%;
	}
	.u-editor-icon {
		background: url('../../../assets/icon/emoji.png') no-repeat;
		background-size: 100%;
	}
 	.icon-botadd {
 		margin-left: 0;
 		margin-right: 0.2rem;
		float: right;
		background: url('../../../assets/icon/addition.png') no-repeat;
		background-size: 100%;
	}
	.u-editor-input {
		float: left;
		margin-left: 0.1rem;
		textarea {
			padding-top: 0.2rem;
			width: 5rem;
			height: 0.5rem;
			border-bottom: 1px solid #333;
			resize: none;
			// border-radius: 0.44rem;
		}
	}
	.send-btn {
		margin-top: 0.14rem;
		margin-right: 0.1rem;
		float: right;
		display: block;
		width: 0.8rem;
		height: 0.6rem;
		line-height: 0.6rem;
		border-radius: 0.06rem;
		text-align: center;
		background-color: #E6615D;
		color: #fff;
	}
	.rotate {
		transform: rotate(45deg)
	}
</style>