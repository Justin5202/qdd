<template>
	<div>
		<audio ref="audio" id="audio" @canplay="ready" @error="error" preload="true" class="video">
			<source :src="url1" type="audio/mpeg" />
		</audio>
		<audio ref="msgAudio" id="audio" @canplay="ready" @error="error" preload="true" class="video">
			<source :src="url" type="audio/mpeg" />
		</audio>
	</div>
</template>
<script>
	import config from '@/configs/config'

	const API_ROOT = config.API_ROOT

	export default {
		computed: {
			url () {
				return `${API_ROOT}/public/static/music/notify.mp3`
			},
			url1 () {
				return `${API_ROOT}/public/static/music/newmsg.mp3`
			},
 			sessionlist () {
		      	return this.$store.state.sessionlist
		    },
			unread () {
		    	let count = 0
				if(this.sessionlist.length > 0) {
					for(let j in this.sessionlist) {
						if(this.sessionlist[j].scene == 'p2p') { 
							count += this.sessionlist[j].unread
						}
					}	
				}
				return count
		    },
		    sysUnreadMsgs () {
	  			let msgs = this.$store.state.sysMsgs
	  			let n = 0
	  			for(let i in msgs) {
	  				if(!msgs[i].read) {
	  					n += 1
	  				}
	  			}
	  			return n
	  		},
	  		play() {
	  			let s = plus.audio.createPlayer('static/notify.wav')
	  			s.play( function () {//播放完成回调 
        			alert( "Audio play success!" ) 
    			}, function ( e ) {//失败回调 
        			alert( "Audio play error: " + e.message )
    			}) 
	  		}
		},
		watch: {
			unread(newV) {
				if(newV > 0) {
					// this.play()
	  				this.$refs.audio.play()
				}
	  		},
	  		sysUnreadMsgs(newV) {
				if(newV > 0) {
	  				this.$refs.msgAudio.play()
				}
	  		}
		},
		methods: {
			ready() {
	        	this.songReady = true
	      	},
	      	error() {
	        	this.songReady = true
	      	}
		},
		created() {},
		mounted () {}
	}
</script>
<style lang="scss" scoped>
</style>
