<template>
	<div v-if="isLoading">
	    <div class="toast">
	      	<!-- <i class="icon-loading"></i> -->
	      	<div class="line-spin-fade-loader">
		        <div></div>
		        <div></div>
		        <div></div>
		        <div></div>
		        <div></div>
		        <div></div>
		        <div></div>
		        <div></div>
		    </div>
	      	<p class="loading-tips">加载中</p>
	    </div>
  	</div>
</template>

<script>
	export default {
	    computed: {
	      	isLoading () {
	        	return this.$store.state.isLoading
	      	}
	    }
	 }
</script>

<style lang="scss" scoped>
	@import '~@/assets/scss/const.scss';
	@import '~@/assets/scss/mixin.scss';
	
	.toast {
		position: fixed;
		top: 50%;
		left: 50%;
		margin-top: -0.75rem;
		margin-left: -1rem;
		width: 2rem;
		height: 1.5rem;
		background-color: rgba(0,0,0,.7);
		border-radius: 0.08rem;
		z-index: 999;
		.icon-loading {
			margin: 0 auto;
			margin-top: 0.3rem;
			display: block;
			width: 0.6rem;
			height: 0.6rem;
			background: url('../../../assets/icon/loading.gif') no-repeat;
			background-size: 100%;
		}
		.loading-tips {
			margin-top: 0.8rem;
			color: #fff;
			line-height: 0.6rem;
			text-align: center;
		}
	}
</style>