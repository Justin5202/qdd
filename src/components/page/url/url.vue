<!-- 标题栏组件 -->
<template>
	<div class="url">
		<top-bar txt="二维码" returnShow="true"></top-bar>
		<div class="content">
			<iframe :src="url" class="iframe"></iframe>
		</div>
	</div>
</template>

<script>
	import TopBar from '@/components/common/top-bar/top-bar'

	export default {
		components: {
			TopBar
		},
		data () {
			return {}
		},
		props: {},
	  	watch: {},
	  	methods: {},
	  	filters: {},
	  	computed: {
	  		url () {
		      	return this.$store.state.url
		    }	  	
		},
	  	updated () {},
	  	created () {},
	  	mounted () {
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

	.url {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: #f7f7f7;
	}
	.content {
		margin: 0 0.3rem;
		margin-top: 1.18rem;
		box-shadow: 0 0.02rem 0.04rem 0 rgba(0,0,0,0.18);
		border-radius: 0.1rem;
	}
	.iframe {
		width: 100%;
		height: 8.2rem;
		overflow: hidden;
		border: 0;
	}
	img {
		width: 6.9rem;
		height: 6.9rem;
	}
</style>