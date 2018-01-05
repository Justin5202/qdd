<!-- 首页 -->
<template>
</template>

<script>
	import Qs from 'qs'
	import Api from '@/api/index'
	import { Indicator, Toast} from 'mint-ui'
	import pageUtil from '@/utils/page'

	export default {
		components: {
		},
		beforeRouteEnter (to, from, next) {
		},
		data() {
		},
		computed: {
		},
		methods: {
		},
		mounted () {
			mui.back = function() {
	            history.go(-1)
	        }
		}
	}
</script>

<style lang="scss" scoped>
	@import '~@/assets/scss/const.scss';
	@import '~@/assets/scss/mixin.scss';
</style>